import { createDefaultFont, Font, stringMetrics } from './font'
import { Size } from './geom'
import { breakLine, Content, insertAt, removeAt } from './tab/content'
import { Cursor, moveDown, moveLeft, moveRight, moveUp } from './tab/cursor'
import { Scroll } from './tab/scroll'

export type Tab = {
    label: string | null
    content: Content
    cursor: Cursor
    scroll: Scroll
    font: Font
    size: Size
}

export type MoveCursorDirection = 'left' | 'right' | 'up' | 'down'

export type InsertAtCursorParams = {
    s: string
}

export type MoveCursorParams = {
    direction: MoveCursorDirection
}

export const createDefaultTab = (): Tab => ({
    label: null,
    content: [''],
    cursor: { row: 0, column: 0 },
    scroll: { x: 0, y: 0 },
    font: createDefaultFont(),
    size: { width: 0, height: 0 },
})

export const labelText = ({ label }: Tab): string =>
    label === null ? 'Unnamed' : label

export const moveCursor = (tab: Tab, { direction }: MoveCursorParams): Tab => {
    const steps = 1

    const newCursor: Cursor = (() => {
        switch (direction) {
            case 'left':
                return moveLeft(tab.cursor, { steps })
            case 'right': {
                const lineLength = tab.content[tab.cursor.row].length

                return moveRight(tab.cursor, { steps, lineLength })
            }
            case 'up':
                return moveUp(tab.cursor, { steps })
            case 'down': {
                const lineCount = tab.content.length

                return moveDown(tab.cursor, { steps, lineCount })
            }
        }

        return { ...tab.cursor }
    })()

    // adjust scroll
    const cursorLine = tab.content[newCursor.row]
    const cursorSubstr = cursorLine.substr(0, newCursor.column)

    const cursorLeft = stringMetrics(tab.font, cursorSubstr).width
    const cursorRight = stringMetrics(tab.font, cursorSubstr + ' ').width
    const cursorTop = newCursor.row * tab.font.lineHeight
    const cursorBottom = cursorTop + tab.font.lineHeight

    const contentWidth = tab.size.width - 48
    const contentHeight = tab.size.height - 32

    const newScroll = {
        x: (() => {
            if (cursorLeft < tab.scroll.x) {
                return cursorLeft
            }
            if (cursorRight >= tab.scroll.x + contentWidth) {
                return cursorRight - contentWidth
            }
            return tab.scroll.x
        })(),

        y: (() => {
            if (cursorTop < tab.scroll.y) {
                return cursorTop
            }
            if (cursorBottom > tab.scroll.y + contentHeight) {
                return cursorBottom - contentHeight
            }
            return tab.scroll.y
        })(),
    }

    return {
        ...tab,
        cursor: newCursor,
        scroll: newScroll,
    }
}

export const insertAtCursor = (tab: Tab, { s }: InsertAtCursorParams): Tab => {
    const [newContent, result] = insertAt(tab.content, { s, ...tab.cursor })

    return {
        ...tab,
        content: newContent,
        cursor: result.newCursorPosition,
    }
}

export const removeAtCursor = (tab: Tab): Tab => {
    const [newContent, result] = removeAt(tab.content, tab.cursor)

    return {
        ...tab,
        content: newContent,
        cursor: result.newCursorPosition,
    }
}

export const breakLineAtCursor = (tab: Tab): Tab => {
    const [newContent, result] = breakLine(tab.content, tab.cursor)

    return {
        ...tab,
        content: newContent,
        cursor: result.newCursorPosition,
    }
}
