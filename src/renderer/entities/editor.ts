import { createFont, Font } from './font'
import EditorTab from './editor-tab'

export default class Editor {
    private readonly font: Font
    private activeTabIndex: number | null
    private tabs: EditorTab[]
    private size: { width: number; height: number }

    constructor() {
        this.font = createFont({ family: 'Fira Code', size: 16 })

        this.activeTabIndex = null
        this.tabs = []

        this.size = { width: 0, height: 0 }
    }

    setActiveTab(index: number): boolean {
        if (
            index < 0 ||
            index >= this.tabs.length ||
            index === this.activeTabIndex
        ) {
            return false
        }

        this.activeTabIndex = index
        return true
    }

    getFont(): EditorFont {
        return this.font
    }

    getSize(): { width: number; height: number } {
        return this.size
    }

    getTabs(): EditorTab[] {
        return this.tabs
    }

    getActiveTabIndex(): number | null {
        return this.activeTabIndex
    }

    getActiveTab(): EditorTab | null {
        if (this.activeTabIndex === null) {
            return null
        }

        return this.tabs[this.activeTabIndex]
    }

    addTab(tab: EditorTab) {
        if (this.activeTabIndex === null) {
            this.tabs = [tab]
            this.activeTabIndex = 0
        } else {
            this.tabs = [
                ...this.tabs.splice(0, this.activeTabIndex + 1),
                tab,
                ...this.tabs.splice(this.activeTabIndex + 1),
            ]
            this.activeTabIndex++
        }
    }

    updateSize(width: number, height: number): boolean {
        if (this.size.width !== width || this.size.height !== height) {
            this.size = { width, height }
            return true
        }

        return false
    }
}
