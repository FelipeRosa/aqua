import { Editor, Size, Tab } from '../entities'
import * as fontService from './font'

export const createDefaultEditor = (): Editor => ({
    font: fontService.createDefaultFont(),
    tabs: [],
    activeTabIndex: -1,
    size: { width: 0, height: 0 },
})

export const setActiveTabIndex = (
    editor: Editor,
    activeTabIndex: number,
): Editor => {
    if (activeTabIndex < 0 || activeTabIndex >= editor.tabs.length) {
        return editor
    }

    return {
        ...editor,
        activeTabIndex,
    }
}

export const setSize = (editor: Editor, size: Size): Editor => ({
    ...editor,
    size,
    tabs: editor.tabs.map((tab) => ({
        ...tab,
        size,
    })),
})

export const insertTab = (editor: Editor, tab: Tab): Editor => {
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

export const removeTab = (editor: Editor, tabIndex: number): Editor => {
    if (tabIndex < 0 || tabIndex >= editor.tabs.length) {
        return editor
    }

    const newTabs = [
        ...editor.tabs.slice(0, tabIndex),
        ...editor.tabs.slice(tabIndex + 1),
    ]

    const newActiveTabIndex =
        editor.activeTabIndex >= tabIndex
            ? Math.max(0, editor.activeTabIndex - 1)
            : editor.activeTabIndex

    return {
        ...editor,
        tabs: newTabs,
        activeTabIndex: newActiveTabIndex,
    }
}

export const updateTab = (
    editor: Editor,
    tabIndex: number,
    tabUpdate: Partial<Tab>,
): Editor => {
    if (tabIndex < 0 || tabIndex >= editor.tabs.length) {
        return editor
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

export const scrollTab = (
    editor: Editor,
    tabIndex: number,
    deltaX: number,
    deltaY: number,
): Editor => {
    if (tabIndex < 0 || tabIndex >= editor.tabs.length) {
        return editor
    }

    const tab = editor.tabs[tabIndex]

    const contentHeight = editor.font.lineHeight * tab.content.length

    const x = Math.max(0, tab.scroll.x + deltaX)
    const y = Math.min(
        Math.max(0, tab.scroll.y + deltaY),
        Math.max(contentHeight - tab.size.height + 32, 0),
    )

    return updateTab(editor, tabIndex, { scroll: { x, y } })
}
