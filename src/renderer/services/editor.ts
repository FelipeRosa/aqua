import { EditorState, EditorTab } from '../entities'

export default class EditorService {
    public static activeTab(editor: EditorState): EditorTab | null {
        const { activeTabIndex, tabs } = editor

        if (activeTabIndex < tabs.length && activeTabIndex >= 0) {
            return tabs[activeTabIndex]
        }

        return null
    }
}
