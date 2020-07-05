export type Cursor = {
    row: number
    column: number
}

export type MoveLeftParams = {
    steps: number
}

export type MoveRightParams = {
    steps: number
    lineLength: number
}

export type MoveUpParams = {
    steps: number
}

export type MoveDownParams = {
    steps: number
    lineCount: number
}

export const moveLeft = (
    cursor: Cursor,
    { steps }: MoveLeftParams,
): Cursor => ({
    ...cursor,
    column: Math.max(0, cursor.column - steps),
})

export const moveRight = (
    cursor: Cursor,
    { steps, lineLength }: MoveRightParams,
): Cursor => ({
    ...cursor,
    column: Math.min(cursor.column + steps, lineLength),
})

export const moveUp = (cursor: Cursor, { steps }: MoveUpParams): Cursor => ({
    ...cursor,
    row: Math.max(0, cursor.row - steps),
})

export const moveDown = (
    cursor: Cursor,
    { steps, lineCount }: MoveDownParams,
): Cursor => ({
    ...cursor,
    row: Math.min(cursor.row + steps, lineCount - 1),
})
