import { Cursor } from './cursor'

export type Selection = {
    start: Cursor
    end: Cursor
}

export const bounds = (selection: Selection): Selection[] => {
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

    if (top.row === bottom.row) {
        return [{ start: top, end: bottom }]
    }

    const middle: Selection[] = []
    for (let i = top.row + 1; i < bottom.row; i++) {
        middle.push({
            start: { row: i, column: 0 },
            end: { row: i, column: Infinity },
        })
    }

    return [
        {
            start: top,
            end: { row: top.row, column: Infinity },
        },
        ...middle,
        {
            start: { row: bottom.row, column: 0 },
            end: bottom,
        },
    ]
}
