import { bounds, Selection } from './selection'

export type Content = string[]

export type InsertAtParams = {
    s: string
    row: number
    column: number
}

export type InsertAtResult = {
    newCursorPosition: { row: number; column: number }
}

export type RemoveAtParams = {
    row: number
    column: number
}

export type RemoveAtResult = {
    newCursorPosition: { row: number; column: number }
}

export type BreakLineParams = {
    row: number
    column: number
}

export type BreakLineResult = {
    newCursorPosition: { row: number; column: number }
}

export const insertAt = (
    content: Content,
    { s, row, column }: InsertAtParams,
): [Content, InsertAtResult] => {
    const newContent = [...content]
    newContent[row] =
        content[row].slice(0, column) + s + content[row].slice(column)

    return [
        newContent,
        {
            newCursorPosition: { row, column: column + 1 },
        },
    ]
}

export const removeAt = (
    content: Content,
    { row, column }: RemoveAtParams,
): [Content, RemoveAtResult] => {
    let newContent = [...content]
    const result: RemoveAtResult = {
        newCursorPosition: {
            row,
            column,
        },
    }

    if (column > 0) {
        newContent[row] =
            content[row].slice(0, column - 1) + content[row].slice(column)

        result.newCursorPosition.column = Math.max(
            0,
            result.newCursorPosition.column - 1,
        )
    } else if (row > 0) {
        const preLines = content.slice(0, row - 1)
        const posLines = content.slice(row + 1)

        newContent = [
            ...preLines,
            content[row - 1] + content[row].trimLeft(),
            ...posLines,
        ]

        result.newCursorPosition.row--
        result.newCursorPosition.column =
            content[result.newCursorPosition.row].length
    }

    return [newContent, result]
}

export const breakLine = (
    content: Content,
    { row, column }: BreakLineParams,
): [Content, BreakLineResult] => {
    const preLines = content.slice(0, row)
    const posLines = content.slice(row + 1)

    // compute previous line indentation
    const preSpacesMatch = content[row].match(/^\s+/)
    const preSpaces = preSpacesMatch ? preSpacesMatch[0] : ''

    const newContent = [
        ...preLines,
        content[row].slice(0, column),
        // add indentation from previous line
        preSpaces + content[row].slice(column),
        ...posLines,
    ]

    return [
        newContent,
        {
            newCursorPosition: {
                row: row + 1,
                column: preSpaces.length,
            },
        },
    ]
}

export const subContent = (
    content: Content,
    selection: Selection,
): Content | null => {
    const { start, end } = selection

    // Bound check
    if (
        start.row < 0 ||
        start.row >= content.length ||
        end.row < 0 ||
        end.row >= content.length ||
        start.column < 0 ||
        start.column > content[start.row].length ||
        end.column < 0 ||
        end.column > content[end.row].length
    ) {
        return null
    }

    return bounds(selection).map((s) =>
        content[s.start.row].substr(
            s.start.column,
            s.end.column - s.start.column,
        ),
    )
}
