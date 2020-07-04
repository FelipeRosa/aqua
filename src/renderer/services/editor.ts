import { EditorSize, EditorState, EditorTab, emptyEditorTab } from '../entities'

export default class EditorService {
    public static activeTab(editor: EditorState): EditorTab | null {
        const { activeTabIndex, tabs } = editor

        if (activeTabIndex < tabs.length && activeTabIndex >= 0) {
            return tabs[activeTabIndex]
        }

        return null
    }

    public static setActiveTab(editor: EditorState, index: number): boolean {
        if (index < 0 || index >= editor.tabs.length) {
            return false
        }

        editor.activeTabIndex = index

        return true
    }

    public static newTab(editor: EditorState, tab: Partial<EditorTab>) {
        editor.tabs.push({
            ...emptyEditorTab(),
            ...tab,
        })

        editor.activeTabIndex = editor.tabs.length - 1
    }

    public static updateTab(
        editor: EditorState,
        tabIndex: number,
        tabUpdates: Partial<EditorTab>,
    ): boolean {
        const { tabs } = editor

        if (tabIndex < 0 || tabIndex >= tabs.length) {
            return false
        }

        tabs[tabIndex] = {
            ...tabs[tabIndex],
            ...tabUpdates,
        }

        return true
    }

    public static updateSize(editor: EditorState, size: EditorSize) {
        editor.size = size
    }
}
