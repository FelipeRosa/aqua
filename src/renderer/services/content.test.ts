import { Content, ContentDiff, Cursor } from '../entities'
import { applyDiff, insertAt, removeSelection, subContent } from './content'

describe('content', () => {
    const content: Content = [
        'line one',
        'line two after one',
        'line three after two',
        'line four after all',
    ]

    describe('insertAt', () => {
        it('adds single line', () => {
            const [result, cursor] = insertAt(content, 'abc', {
                row: 1,
                column: 1,
            })

            expect(result).toEqual([
                ...content.slice(0, 1),
                'labcine two after one',
                ...content.slice(2),
            ])
            expect(cursor).toEqual({
                row: 1,
                column: 4,
            })
        })

        it('adds multiple lines', () => {
            const [result, cursor] = insertAt(content, 'ab\nc\n', {
                row: 1,
                column: 1,
            })

            expect(result).toEqual([
                ...content.slice(0, 1),
                'lab',
                'c',
                'ine two after one',
                ...content.slice(2),
            ])
            expect(cursor).toEqual({
                row: 3,
                column: 0,
            })
        })

        it('breaks lines', () => {
            const [result, cursor] = insertAt(content, '\n', {
                row: 1,
                column: 1,
            })

            expect(result).toEqual([
                ...content.slice(0, 1),
                'l',
                'ine two after one',
                ...content.slice(2),
            ])
            expect(cursor).toEqual({
                row: 2,
                column: 0,
            })
        })
    })

    describe('removeSelection', () => {
        it('works', () => {
            const testCases: {
                start: Cursor
                end: Cursor | null
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
                {
                    start: { row: 2, column: 2 },
                    end: null,
                    expectedContent: content,
                },
            ]

            testCases.forEach(({ start, end, expectedContent }) => {
                const result = removeSelection(content, {
                    ...start,
                    selectionStartOrEnd: end,
                })
                expect(result).toEqual([expectedContent, start])

                if (end === null) {
                    return
                }

                const reversedResult = removeSelection(content, {
                    ...end,
                    selectionStartOrEnd: start,
                })
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

    describe('applyDiff', () => {
        describe('when diff op is "add"', () => {
            const diff: ContentDiff = {
                op: 'add',
                at: { row: 2, column: 3 },
                value: ['ab', 'cd'],
            }

            it('should add content', () => {
                expect(applyDiff(content, diff)).toEqual([
                    [
                        'line one',
                        'line two after one',
                        'linab',
                        'cde three after two',
                        'line four after all',
                    ],
                    {
                        row: 3,
                        column: 2,
                    },
                ])
            })
        })

        describe('when diff op is "rm"', () => {
            const diff: ContentDiff = {
                op: 'rm',
                at: { row: 0, column: 6 },
                value: ['ne', 'li'],
            }

            it('should remove content', () => {
                expect(applyDiff(content, diff)).toEqual([
                    [
                        'line one two after one',
                        'line three after two',
                        'line four after all',
                    ],
                    diff.at,
                ])
            })
        })
    })
})
