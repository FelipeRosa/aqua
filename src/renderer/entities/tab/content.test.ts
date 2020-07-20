import { Content, subContent } from './content'
import { Cursor } from './cursor'

describe('subContent', () => {
    const content: Content = [
        'line one',
        'line two after one',
        'line three after two',
        'line four after all',
    ]

    it('works when cursors are on the same line', () => {
        const start: Cursor = { row: 1, column: 3 }
        const end: Cursor = { row: 1, column: 6 }

        const result = subContent(content, { start, end })
        const reversedResult = subContent(content, { start: end, end: start })

        expect(result).toEqual(['e t'])
        expect(reversedResult).toEqual(result)
    })

    it('works when cursors span multiple lines', () => {
        const start: Cursor = { row: 1, column: 2 }
        const end: Cursor = { row: 3, column: 2 }

        const result = subContent(content, { start, end })
        const reversedResult = subContent(content, { start: end, end: start })

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
        const reversedResult = subContent(content, { start: end, end: start })

        expect(result).toBeNull()
        expect(reversedResult).toBeNull()
    })
})
