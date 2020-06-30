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

export const realCursorX = (tab: EditorTab): number => {
    return Math.min(tab.cursor.column, tab.content[tab.cursor.line].length)
}
