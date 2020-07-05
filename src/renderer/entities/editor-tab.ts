import Editor from './editor'
import TabContent from './tab-content'
import TabCursor, { CursorMoveDirection } from './tab-cursor'
import TabScroll from './tab-scroll'

export default class EditorTab {
    private readonly parent: Editor

    private label: string | null
    private readonly content: TabContent
    private readonly cursor: TabCursor
    private readonly scroll: TabScroll

    constructor(parent: Editor) {
        this.parent = parent

        this.label = null
        this.content = new TabContent()
        this.cursor = new TabCursor(this)
        this.scroll = new TabScroll(this)
    }

    setLabel(label: string | null) {
        this.label = label
    }

    getContent(): TabContent {
        return this.content
    }

    getCursor(): TabCursor {
        return this.cursor
    }

    getScroll(): TabScroll {
        return this.scroll
    }

    getLabelText(): string {
        if (this.label === null) {
            return 'Unnamed'
        }

        return this.label
    }

    moveCursor(direction: CursorMoveDirection): boolean {
        this.cursor.move(direction)

        const font = this.parent.getFont()
        const editorSize = this.parent.getSize()

        const contentWidth = editorSize.width - 48
        const contentHeight = editorSize.height - 32

        const cursorLine = this.getContent().getLine(this.cursor.getLine())
        const cursorSubstr = cursorLine.substr(0, this.cursor.getColumn())

        const cursorLeft = font.stringWidth(cursorSubstr)
        const cursorRight = font.stringWidth(cursorSubstr + ' ')
        const cursorBottom = (this.cursor.getLine() + 1) * font.getLineHeight()
        const cursorTop = this.cursor.getLine() * font.getLineHeight()

        if (cursorLeft < this.scroll.getX()) {
            this.scroll.setX(cursorLeft)
            return true
        }
        if (cursorRight >= this.scroll.getX() + contentWidth) {
            this.scroll.setX(cursorRight - contentWidth)
            return true
        }
        if (cursorTop < this.scroll.getY()) {
            this.scroll.setY(cursorTop)
            return true
        }
        if (cursorBottom > this.scroll.getY() + contentHeight) {
            this.scroll.setY(cursorBottom - contentHeight)
            return true
        }

        return false
    }

    insertAtCursor(s: string) {
        const { line, column } = this.cursor.getPosition()

        this.content.insert(s, line, column)
        this.cursor.move('right', s.length)
    }

    removeAtCursor(): boolean {
        const { line, column } = this.cursor.getPosition()

        const lines = [...this.getContent().getLines()]

        if (!this.getContent().remove(line, column)) {
            return false
        }

        if (line > 0 && column === 0) {
            this.cursor.move('up', 1)
            this.cursor.move('right', lines[line - 1].length)
        } else {
            this.cursor.move('left', 1)
        }

        return true
    }

    newLineAtCursor() {
        const { line, column } = this.cursor.getPosition()
        const lineIndent = this.getContent().breakLine(line, column)

        this.cursor.move('down', 1)
        this.cursor.moveToLineStart()
        this.cursor.move('right', lineIndent)
    }
}
