import { Content, Cursor, CursorWithSelection, Selection } from '../entities'
import { selection as cursorSelection } from './cursor'
import { bounds, normalized } from './selection'

export const insertAt = (
    content: Content,
    s: string,
    cursor: Cursor,
): [Content, Cursor] => {
    const { row, column } = cursor

    const sLines = s.split('\n')
    const addedRows = sLines.length - 1

    const newContent: Content = [
        ...content.slice(0, row),
        ...sLines,
        ...content.slice(row + 1),
    ]

    newContent[row] = content[row].slice(0, column) + sLines[0]

    newContent[row + addedRows] =
        newContent[row + addedRows] + content[row].slice(column)

    return [
        newContent,
        {
            row: row + addedRows,
            column:
                (addedRows === 0 ? column : 0) +
                sLines[sLines.length - 1].length,
        },
    ]
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
