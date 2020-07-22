import { Content, removeSelection, subContent } from './content'
import { Cursor } from './cursor'

describe('content', () => {
    const content: Content = [
        'line one',
        'line two after one',
        'line three after two',
        'line four after all',
    ]

    describe('removeSelection', () => {
        it('works', () => {
            const testCases: {
                start: Cursor
                end: Cursor
                expectedContent: Content
            }[] = [
                {
                    start: { row: 0, column: 0 },
                    end: { row: 0, column: 1 },
                    expectedContent: ['ine one', ...content.slice(1)],
                },
                {
                    start: { row: 0, column: 6 },
                    end: { row: 3, column: 4 },
                    expectedContent: ['line o four after all'],
                },
                {
                    start: { row: 0, column: 0 },
                    end: { row: Infinity, column: Infinity },
                    expectedContent: [''], // empty content is ['']
                },
            ]

            testCases.forEach(({ start, end, expectedContent }) => {
                const result = removeSelection(content, {
                    ...start,
                    selectionStartOrEnd: end,
                })
                const reversedResult = removeSelection(content, {
                    ...end,
                    selectionStartOrEnd: start,
                })

                expect(result).toEqual([expectedContent, start])
                expect(reversedResult).toEqual([expectedContent, start])
            })
        })
    })

    describe('subContent', () => {
        it('works when cursors are on the same line', () => {
            const start: Cursor = { row: 1, column: 3 }
            const end: Cursor = { row: 1, column: 6 }

            const result = subContent(content, { start, end })
            const reversedResult = subContent(content, {
                start: end,
                end: start,
            })

            expect(result).toEqual(['e t'])
            expect(reversedResult).toEqual(result)
        })

        it('works when cursors span multiple lines', () => {
            const start: Cursor = { row: 1, column: 2 }
            const end: Cursor = { row: 3, column: 2 }

            const result = subContent(content, { start, end })
            const reversedResult = subContent(content, {
                start: end,
                end: start,
            })

            expect(result).toEqual([
                'ne two after one',
                'line three after two',
                'li',
            ])
            expect(reversedResult).toEqual(result)
        })

        it('returns null when is out of bounds', () => {
            const start: Cursor = { row: 10, column: 2 }
            const end: Cursor = { row: 3, column: 2 }

            const result = subContent(content, { start, end })
            const reversedResult = subContent(content, {
                start: end,
                end: start,
            })

            expect(result).toBeNull()
            expect(reversedResult).toBeNull()
        })
    })
})
