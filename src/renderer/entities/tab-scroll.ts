import EditorTab from './editor-tab'

export default class TabScroll {
    private readonly parent: EditorTab

    private x: number
    private y: number

    constructor(parent: EditorTab) {
        this.parent = parent

        this.x = 0
        this.y = 0
    }

    setX(x: number): void {
        this.x = x
    }

    setY(y: number): void {
        this.y = y
    }

    getX(): number {
        return this.x
    }

    getY(): number {
        return this.y
    }
}
