import { selection as cursorSelection } from './cursor'
import { Content, Cursor, CursorWithSelection, Selection } from '../entities'
import { bounds, normalized } from './selection'

export const insertAt = (
    content: Content,
    s: string,
    cursor: Cursor,
): [Content, Cursor] => {
    const { row, column } = cursor

    const newContent = [...content]
    newContent[row] =
        content[row].slice(0, column) + s + content[row].slice(column)

    return [newContent, { row, column: column + 1 }]
}

export const removeSelection = (
    content: Content,
    cursor: CursorWithSelection,
): [Content, Cursor] => {
    const selection = cursorSelection(cursor)
    if (selection === null) {
        return [content, cursor]
    }

    const { start, end } = normalized(selection)

    const newContent: Content = []
    for (let i = 0; i < content.length; i++) {
        if (i < start.row || i > end.row) {
            newContent.push(content[i])
            continue
        }

        if (i === start.row) {
            const line = content[i].substr(0, start.column)
            if (line.length > 0) {
                newContent.push(line)
            }
        }

        if (i === end.row) {
            const line = content[i].substr(end.column)

            newContent[start.row] = (newContent[start.row] || '') + line
        }
    }

    // Empty content is defined as ['']
    if (newContent.length === 0) {
        newContent.push('')
    }

    return [newContent, start]
}

export const breakLine = (
    content: Content,
    cursor: Cursor,
): [Content, Cursor] => {
    const { row, column } = cursor

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

    return [newContent, { row: row + 1, column: preSpaces.length }]
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