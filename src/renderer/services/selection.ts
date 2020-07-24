import { Cursor, Selection } from '../entities'

export const normalized = (selection: Selection): Selection => {
    const [top, bottom]: Cursor[] = ((): Cursor[] => {
        if (selection.start.row === selection.end.row) {
            return selection.start.column < selection.end.column
                ? [selection.start, selection.end]
                : [selection.end, selection.start]
        } else if (selection.start.row < selection.end.row) {
            return [selection.start, selection.end]
        } else {
            return [selection.end, selection.start]
        }
    })()

    return {
        start: top,
        end: bottom,
    }
}

export const bounds = (selection: Selection): Selection[] => {
    const { start, end } = normalized(selection)

    if (start.row === end.row) {
        return [{ start, end }]
    }

    const middle: Selection[] = []
    for (let i = start.row + 1; i < end.row; i++) {
        middle.push({
            start: { row: i, column: 0 },
            end: { row: i, column: Infinity },
        })
    }

    return [
        {
            start,
            end: { row: start.row, column: Infinity },
        },
        ...middle,
        {
            start: { row: end.row, column: 0 },
            end,
        },
    ]
}
