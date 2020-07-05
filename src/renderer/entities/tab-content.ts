export default class TabContent {
    private lines: string[]

    constructor() {
        this.lines = ['']
    }

    setLine(s: string, n: number) {
        if (n < 0 || n >= this.lines.length) {
            throw new Error('invalid line index ' + n)
        }

        this.lines[n] = s
    }

    setLines(lines: string[]) {
        this.lines = lines
    }

    getLineCount(): number {
        return this.lines.length
    }

    getLine(n: number): string {
        if (n < 0 || n >= this.lines.length) {
            throw new Error('invalid line index ' + n.toString())
        }

        return this.lines[n]
    }

    getLines(): string[] {
        return this.lines
    }

    insert(s: string, l: number, c: number) {
        const line = this.getLine(l)

        if (c < 0 || c > line.length) {
            throw new Error('invalid column index ' + c.toString())
        }

        this.setLine(line.slice(0, c) + s + line.slice(c), l)
    }

    remove(l: number, c: number): boolean {
        if (c > 0) {
            const line = this.getLine(l)
            this.setLine(line.slice(0, c - 1) + line.slice(c), l)
        } else if (l > 0) {
            const lines = this.getLines()

            const preLines = lines.slice(0, l - 1)
            const posLines = lines.slice(l + 1)

            this.setLines([
                ...preLines,
                lines[l - 1] + lines[l].trimLeft(),
                ...posLines,
            ])
        } else {
            return false
        }

        return true
    }

    breakLine(l: number, c: number): number {
        const preLines = this.lines.slice(0, l)
        const posLines = this.lines.slice(l + 1)

        // compute previous line indentation
        const preSpacesMatch = this.lines[l].match(/^\s+/)
        const preSpaces = preSpacesMatch ? preSpacesMatch[0] : ''

        this.setLines([
            ...preLines,
            this.lines[l].slice(0, c),
            // add indentation from previous line
            preSpaces + this.lines[l].slice(c),
            ...posLines,
        ])

        return preSpaces.length
    }
}
