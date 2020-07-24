import { Cursor, CursorWithSelection, Selection } from '../entities'

export const withoutSelection = (cursor: CursorWithSelection): Cursor => ({
    row: cursor.row,
    column: cursor.column,
})

export const selection = (cursor: CursorWithSelection): Selection | null => {
    if (cursor.selectionStartOrEnd === null) {
        return null
    }

    return {
        start: withoutSelection(cursor),
        end: cursor.selectionStartOrEnd,
    }
}