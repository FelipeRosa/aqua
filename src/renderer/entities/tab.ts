import { Content, insertAt } from './tab/content'
import { Cursor } from './tab/cursor'
import { Scroll } from './tab/scroll'

export type Tab = {
    label: string | null
    content: Content
    cursor: Cursor
    scroll: Scroll
}

export type InsertAtCursorParams = {
    s: string
}

export const createTab = (): Tab => ({
    label: null,
    content: [''],
    cursor: { row: 0, column: 0 },
    scroll: { x: 0, y: 0 },
})

export const labelText = ({ label }: Tab): string =>
    label === null ? 'Unnamed' : label

export const insertAtCursor = (tab: Tab, { s }: InsertAtCursorParams): Tab => {
    const [newContent, result] = insertAt(tab.content, { s, ...tab.cursor })

    return {
        ...tab,
        content: newContent,
        cursor: result.newCursorPosition,
    }
}
