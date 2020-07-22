import { selection, withoutSelection } from './cursor'

describe('cursor', () => {
    describe('withoutSelection', () => {
        it('should return cursor without "selectionStart" field', () => {
            const result = withoutSelection({
                row: 0,
                column: 0,
                selectionStartOrEnd: { row: 0, column: 0 },
            })

            expect(result).toEqual({
                row: 0,
                column: 0,
            })
        })
    })

    describe('selection', () => {
        it('should return null when cursor has no selection', () => {
            const result = selection({
                row: 0,
                column: 0,
                selectionStartOrEnd: null,
            })

            expect(result).toBeNull()
        })

        it('should return the correct cursor selection', () => {
            const result = selection({
                row: 1,
                column: 2,
                selectionStartOrEnd: {
                    row: 3,
                    column: 4,
                },
            })

            expect(result).toEqual({
                start: { row: 1, column: 2 },
                end: { row: 3, column: 4 },
            })
        })
    })
})
