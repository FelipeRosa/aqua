export type Cursor = {
    row: number
    column: number
}

export type CursorWithSelection = Cursor & { selectionStart: Cursor | null }
