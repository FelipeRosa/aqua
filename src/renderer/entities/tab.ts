import path from 'path'
import { createDefaultFont, Font, stringMetrics } from './font'
import { Point, Size } from './geom'
import { breakLine, Content, insertAt, removeSelection } from './tab/content'
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

export const createDefaultTab = (): Tab => ({
    label: null,
    content: [''],
    cursor: { row: 0, column: 0, selectionStartOrEnd: null },
    scroll: { x: 0, y: 0 },
    font: createDefaultFont(),
    size: { width: 0, height: 0 },
})

export const labelText = ({ label }: Tab): string =>
    // TODO: move this to editor functions because we need to
    //       consider the case when multiple tabs have the same basename
    label === null ? 'Unnamed' : path.basename(label)

export const adjustedCursor = (tab: Tab): CursorWithSelection => ({
    ...tab.cursor,
    row: tab.cursor.row,
    column: Math.min(tab.cursor.column, tab.content[tab.cursor.row].length),
})

export const cursorFromPoint = (tab: Tab, p: Point): Cursor | null => {
    // This takes into account the tab labels height (32px)
    const row = Math.floor((p.y + tab.scroll.y - 32) / tab.font.lineHeight)
    if (row < 0) {
        return null
    }

    const rowContent = tab.content[Math.min(row, tab.content.length - 1)]

    let s = ''
    for (let i = 0; i < rowContent.length; i++) {
        const right = s + rowContent.charAt(i)
        // This takes into account the line numbers width (48px)
        if (stringMetrics(tab.font, right).width > p.x - 48) {
            break
        }

        s = right
    }

    const column = s.length

    return { row, column }
}

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
    if (selecting && tab.cursor.selectionStartOrEnd === null) {
        newCursor.selectionStartOrEnd = tab.cursor
    } else if (!selecting) {
        newCursor.selectionStartOrEnd = null
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

export const insertAtCursor = (tab: Tab, s: string): Tab => {
    const newTab = removeAtCursor(tab)
    const [newContent, newCursor] = insertAt(newTab.content, s, newTab.cursor)

    return setCursor({ ...tab, content: newContent }, newCursor, false)
}

export const removeAtCursor = (tab: Tab): Tab => {
    const cursor = adjustedCursor(tab)
    const [newContent, newCursor] = removeSelection(tab.content, cursor)

    return setCursor({ ...tab, content: newContent }, newCursor, false)
}

export const breakLineAtCursor = (tab: Tab): Tab => {
    const newTab = removeAtCursor(tab)
    const [newContent, newCursor] = breakLine(newTab.content, newTab.cursor)

    return setCursor({ ...tab, content: newContent }, newCursor, false)
}
