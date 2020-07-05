import { createDefaultFont, Font } from './font'
import { Size } from './geom'
import { Tab } from './tab'

export type Editor = {
    font: Font
    tabs: Tab[]
    activeTabIndex: number
    size: Size
}

export type SetActiveTabIndexParams = {
    activeTabIndex: number
}

export type SetSizeParams = {
    size: Size
}

export type InsertTabParams = {
    tab: Tab
}

export type UpdateTabParams = {
    tabIndex: number
    tabUpdate: Partial<Tab>
}

export const createDefaultEditor = (): Editor => ({
    font: createDefaultFont(),
    tabs: [],
    activeTabIndex: -1,
    size: { width: 0, height: 0 },
})

export const setActiveTabIndex = (
    editor: Editor,
    { activeTabIndex }: SetActiveTabIndexParams,
): Editor => ({
    ...editor,
    activeTabIndex,
})

export const setSize = (editor: Editor, { size }: SetSizeParams): Editor => ({
    ...editor,
    size,
    tabs: editor.tabs.map((tab) => ({
        ...tab,
        size,
    })),
})

export const insertTab = (editor: Editor, { tab }: InsertTabParams): Editor => {
    const { tabs: editorTabs, activeTabIndex } = editor

    const resizedTab: Tab = {
        ...tab,
        size: editor.size,
    }

    const [newTabs, newActiveTabIndex] = ((): [Tab[], number] => {
        if (editor.tabs.length === 0) {
            return [[resizedTab], 0]
        }

        const tabs = [
            ...editorTabs.splice(0, activeTabIndex + 1),
            resizedTab,
            ...editorTabs.splice(activeTabIndex + 1),
        ]

        return [tabs, activeTabIndex + 1]
    })()

    return {
        ...editor,
        tabs: newTabs,
        activeTabIndex: newActiveTabIndex,
    }
}

export const updateTab = (
    editor: Editor,
    { tabIndex, tabUpdate }: UpdateTabParams,
): Editor => {
    if (tabIndex < 0 || tabIndex >= editor.tabs.length) {
        return { ...editor }
    }

    const updatedTabs = [...editor.tabs]
    updatedTabs[tabIndex] = { ...editor.tabs[tabIndex], ...tabUpdate }

    return {
        ...editor,
        tabs: updatedTabs,
    }
}

export const activeTab = (editor: Editor): Tab | null => {
    if (
        editor.activeTabIndex < 0 ||
        editor.activeTabIndex >= editor.tabs.length
    ) {
        return null
    }

    return editor.tabs[editor.activeTabIndex]
}
