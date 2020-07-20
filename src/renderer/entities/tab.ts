import path from 'path'
import { createDefaultFont, Font, stringMetrics } from './font'
import { Size } from './geom'
import { breakLine, Content, insertAt, removeAt } from './tab/content'
import { Cursor, CursorWithSelection } from './tab/cursor'
import { Scroll } from './tab/scroll'

export type Tab = {
    label: string | null
    content: Content
    cursor: CursorWithSelection
    scroll: Scroll
    font: Font
    size: Size
}

export type InsertAtCursorParams = {
    s: string
}

export const createDefaultTab = (): Tab => ({
    label: null,
    content: [''],
    cursor: { row: 0, column: 0, selectionStart: null },
    scroll: { x: 0, y: 0 },
    font: createDefaultFont(),
    size: { width: 0, height: 0 },
})

export const labelText = ({ label }: Tab): string =>
    // TODO: move this to editor functions because we need to
    //       consider the case when multiple tabs have the same basename
    label === null ? 'Unnamed' : path.basename(label)

export const adjustedCursor = (tab: Tab): Cursor => ({
    row: tab.cursor.row,
    column: Math.min(tab.cursor.column, tab.content[tab.cursor.row].length),
})

export const setCursor = (
    tab: Tab,
    cursor: Cursor,
    selecting: boolean,
): Tab => {
    const row = Math.min(Math.max(0, cursor.row), tab.content.length - 1)

    const cursorLine = tab.content[row]
    const column = Math.min(Math.max(0, cursor.column), cursorLine.length)

    const newCursor: CursorWithSelection = {
        ...tab.cursor,
        row,
        column,
    }

    // handle cursor selection
    if (selecting && tab.cursor.selectionStart === null) {
        newCursor.selectionStart = tab.cursor
    } else if (!selecting) {
        newCursor.selectionStart = null
    }

    // adjust scroll
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
    const cursor = adjustedCursor(tab)
    const [newContent, result] = insertAt(tab.content, { s, ...cursor })

    return setCursor(
        {
            ...tab,
            content: newContent,
        },
        result.newCursorPosition,
        false,
    )
}

export const removeAtCursor = (tab: Tab): Tab => {
    const cursor = adjustedCursor(tab)
    const [newContent, result] = removeAt(tab.content, cursor)

    return setCursor(
        {
            ...tab,
            content: newContent,
        },
        result.newCursorPosition,
        false,
    )
}

export const breakLineAtCursor = (tab: Tab): Tab => {
    const cursor = adjustedCursor(tab)
    const [newContent, result] = breakLine(tab.content, cursor)

    return setCursor(
        {
            ...tab,
            content: newContent,
        },
        result.newCursorPosition,
        false,
    )
}
