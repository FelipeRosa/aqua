import { Direction, EditorState, EditorTab } from '../entities'
import FontService from './font'

type TabServiceConsParams = {
    editor: EditorState
}

export default class TabService {
    private readonly editor: EditorState

    constructor({ editor }: TabServiceConsParams) {
        this.editor = editor
    }

    public moveCursor(tab: EditorTab, direction: Direction) {
        switch (direction) {
            case 'left':
                this._moveCursorLeft(tab)
                break

            case 'right':
                this._moveCursorRight(tab)
                break

            case 'down':
                this._moveCursorDown(tab)
                break

            case 'up':
                this._moveCursorUp(tab)
                break
        }
    }

    public realCursorX(tab: EditorTab): number {
        const { cursor, content } = tab

        return Math.min(cursor.column, content[cursor.line].length)
    }

    private _moveCursorLeft(tab: EditorTab) {
        const { font } = this.editor
        const { cursor, content, scroll } = tab

        cursor.column = Math.max(0, this.realCursorX(tab) - 1)

        const line = content[cursor.line]

        const cursorSubstr = line.substr(0, cursor.column)
        const cursorLeft = FontService.charWidth(
            font.family,
            font.size,
            cursorSubstr,
        )

        if (cursorLeft < scroll.x) {
            scroll.x = cursorLeft
        }
    }

    private _moveCursorRight(tab: EditorTab) {
        const { cursor, content, scroll } = tab
        const { font, size } = this.editor

        if (
            cursor.line < content.length &&
            cursor.column < content[cursor.line].length
        ) {
            cursor.column++

            const line = content[cursor.line]

            // We need to take the editor line numbers width into
            // account here.
            const contentWidth = size.width - 48

            const cursorSubstr = line.substr(0, cursor.column + 1)
            const cursorRight = FontService.charWidth(
                font.family,
                font.size,
                // Add a space if we reached the last character
                // so the scroll will be set to after it.
                cursor.column === line.length
                    ? cursorSubstr + ' '
                    : cursorSubstr,
            )

            if (cursorRight > scroll.x + contentWidth) {
                scroll.x = cursorRight - contentWidth
            }
        }
    }

    private _moveCursorDown(tab: EditorTab) {
        const { cursor, content, scroll } = tab
        const { font, size } = this.editor

        if (cursor.line < content.length - 1) {
            cursor.line++

            const cursorBottom = (cursor.line + 1) * font.lineHeight

            // We need to take the height of the tabs <div> into account (32px).
            const contentHeight = size.height - 32

            if (cursorBottom > scroll.y + contentHeight) {
                scroll.y = cursorBottom - contentHeight
            }

            this._moveToCursor(tab)
        }
    }

    private _moveCursorUp(tab: EditorTab) {
        const { cursor, scroll } = tab
        const { font, size } = this.editor

        if (cursor.line > 0) {
            cursor.line--

            const cursorTop = cursor.line * font.lineHeight

            // Same as above: We need to take the height of the tabs <div> into account (32px).
            const contentHeight = size.height - 32

            if (cursorTop < scroll.y || cursorTop > scroll.y + contentHeight) {
                scroll.y = cursorTop
            }

            this._moveToCursor(tab)
        }
    }

    private _moveToCursor(tab: EditorTab) {
        const { cursor, content, scroll } = tab
        const { font, size } = this.editor

        const contentWidth = size.width - 48
        const cursorColumn = Math.max(0, this.realCursorX(tab) - 1)

        const line = content[cursor.line]

        const cursorSubstr = line.substr(0, cursorColumn)
        const cursorLeft = FontService.charWidth(
            font.family,
            font.size,
            cursorSubstr,
        )

        if (cursorLeft < scroll.x || cursorLeft > scroll.x + contentWidth) {
            scroll.x = cursorLeft
        }
    }
}
