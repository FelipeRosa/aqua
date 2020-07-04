import { EditorState, EditorTab } from '../entities'

export const activeTab = ({
    activeTabIndex,
    tabs,
}: EditorState): EditorTab | null => {
    if (activeTabIndex < tabs.length && activeTabIndex >= 0) {
        return tabs[activeTabIndex]
    }

    return null
}
