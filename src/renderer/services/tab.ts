import path from 'path'
import {
    ContentDiff,
    Cursor,
    CursorWithSelection,
    Point,
    Tab,
} from '../entities'
import { applyDiff, insertAt, removeSelection, subContent } from './content'
import { selection } from './cursor'
import { createDefaultFont, stringMetrics } from './font'
import { normalized } from './selection'

export const createDefaultTab = (): Tab => ({
    label: null,
    content: [''],
    cursor: { row: 0, column: 0, selectionStartOrEnd: null },
    scroll: { x: 0, y: 0 },
    font: createDefaultFont(),
    size: { width: 0, height: 0 },
    diffs: {
        done: [],
        undone: [],
    },
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

    const newTab1 = { ...tab, content: newContent }
    newTab1.diffs.done.push({
        op: 'add',
        at: newTab.cursor,
        value: s.split('\n'),
    })
    newTab1.diffs.undone = []

    return setCursor(newTab1, newCursor, false)
}

export const removeAtCursor = (tab: Tab): Tab => {
    const cursor = adjustedCursor(tab)
    const [newContent, newCursor] = removeSelection(tab.content, cursor)

    const newTab = { ...tab, content: newContent }

    const cursorSelection = selection(cursor)
    if (cursorSelection !== null) {
        const normalizedCursorSelection = normalized(cursorSelection)
        const value = subContent(tab.content, cursorSelection)

        if (value !== null) {
            newTab.diffs.done.push({
                op: 'rm',
                at: normalizedCursorSelection.start,
                value,
            })
            newTab.diffs.undone = []
        }
    }

    return setCursor(newTab, newCursor, false)
}

export const undoRedo = (tab: Tab, op: 'undo' | 'redo'): Tab => {
    const newDiffs = {
        done: [...tab.diffs.done],
        undone: [...tab.diffs.undone],
    }

    const [stackOut, stackIn] = ((): [ContentDiff[], ContentDiff[]] => {
        switch (op) {
            case 'undo':
                return [newDiffs.done, newDiffs.undone]
            case 'redo':
                return [newDiffs.undone, newDiffs.done]
        }
    })()

    const diff: ContentDiff | undefined = stackOut.pop()
    if (diff === undefined) {
        return { ...tab }
    }

    const inverseDiff: ContentDiff = {
        ...diff,
        op: diff.op === 'add' ? 'rm' : 'add',
    }
    stackIn.push(inverseDiff)

    const [newContent, newCursor] = applyDiff(tab.content, inverseDiff)

    return setCursor(
        {
            ...tab,
            content: newContent,
            diffs: newDiffs,
        },
        newCursor,
        false,
    )
}
