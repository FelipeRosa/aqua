import EditorTab from './editor-tab'

export type CursorMoveDirection = 'left' | 'right' | 'up' | 'down'

export default class TabCursor {
    private readonly parent: EditorTab

    private line: number
    private column: number

    constructor(parent: EditorTab) {
        this.parent = parent

        this.line = 0
        this.column = 0
    }

    getPosition(): { line: number; column: number } {
        return {
            line: this.getLine(),
            column: this.getColumn(),
        }
    }

    getColumn(): number {
        return Math.min(this.column, this._getCurrentLine().length)
    }

    getLine(): number {
        return this.line
    }

    move(direction: CursorMoveDirection, steps: number = 1): boolean {
        const movements: { [key in CursorMoveDirection]: () => boolean } = {
            left: () => this._moveLeft(steps),
            right: () => this._moveRight(steps),
            up: () => this._moveUp(steps),
            down: () => this._moveDown(steps),
        }

        return movements[direction]()
    }

    moveToLineStart() {
        this.column = 0
    }

    private _moveLeft(steps: number): boolean {
        if (this.column > 0) {
            this.column = Math.max(0, this.column - steps)
            return true
        }

        return false
    }

    private _moveRight(steps: number): boolean {
        const tabContent = this.parent.getContent()
        const currentLine = this._getCurrentLine()

        if (
            this.line < tabContent.getLineCount() &&
            this.column <= currentLine.length
        ) {
            this.column = Math.min(this.column + steps, currentLine.length)
            return true
        }

        return false
    }

    private _moveUp(steps: number): boolean {
        if (this.line > 0) {
            this.line = Math.max(0, this.line - steps)
            return true
        }

        return false
    }

    private _moveDown(steps: number): boolean {
        const contentLineCount = this.parent.getContent().getLineCount()

        if (this.line < contentLineCount - 1) {
            this.line = Math.min(this.line + steps, contentLineCount - 1)
            return true
        }

        return false
    }

    private _getCurrentLine(): string {
        const line = this.parent.getContent().getLine(this.line)

        if (line === null) {
            // This should really never happen. So we treat it as an exception
            throw new Error('invalid line for cursor')
        }

        return line
    }
}
