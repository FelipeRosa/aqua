import {
    activeTab,
    insertTab,
    removeTab,
    scrollTab,
    setActiveTabIndex,
    setSize,
    updateTab,
} from './entities/editor'
import { stringMetrics } from './entities/font'
import { AppState } from './entities/state'
import {
    breakLineAtCursor,
    createDefaultTab,
    insertAtCursor,
    removeAtCursor,
    setCursor,
} from './entities/tab'

export type Msg =
    | {
          type: 'cursor-move'
          direction: 'left' | 'right' | 'up' | 'down'
          selecting: boolean
      }
    | {
          type: 'cursor-insert'
          char: string
      }
    | {
          type: 'cursor-remove'
      }
    | {
          type: 'cursor-new-line'
      }
    | {
          type: 'editor-tab-click'
          index: number
      }
    | {
          type: 'editor-tab-content-click'
          index: number
          clickX: number
          clickY: number
          selecting: boolean
      }
    | {
          type: 'editor-tab-close'
          index: number
      }
    | {
          type: 'editor-tab-scroll'
          index: number
          deltaX: number
          deltaY: number
      }
    | {
          type: 'editor-new-tab'
          tab: Partial<{
              label: string | null
              content: string[]
          }>
      }
    | {
          type: 'editor-update-tab'
          index: number
          tab: Partial<{
              label: string | null
              content: string[]
          }>
      }
    | {
          type: 'editor-update-size'
          newSize: number[]
      }

export function reducer(prevState: AppState, msg: Msg): AppState {
    switch (msg.type) {
        case 'cursor-move': {
            const { editor } = prevState

            const tab = activeTab(editor)
            if (tab === null) {
                return prevState
            }

            const newCursor = { ...tab.cursor }
            switch (msg.direction) {
                case 'left':
                    newCursor.column--
                    break
                case 'right':
                    newCursor.column++
                    break
                case 'up':
                    newCursor.row--
                    break
                case 'down':
                    newCursor.row++
                    break
            }

            const tabUpdate = setCursor(tab, newCursor, msg.selecting)
            const tabIndex = editor.activeTabIndex

            return {
                ...prevState,
                editor: updateTab(editor, { tabIndex, tabUpdate }),
            }
        }

        case 'cursor-insert': {
            const { editor } = prevState

            const tab = activeTab(editor)
            if (tab === null) {
                return prevState
            }

            const tabUpdate = insertAtCursor(tab, { s: msg.char })
            const tabIndex = editor.activeTabIndex

            return {
                ...prevState,
                editor: updateTab(editor, { tabIndex, tabUpdate }),
            }
        }

        case 'cursor-remove': {
            const { editor } = prevState

            const tab = activeTab(editor)
            if (tab === null) {
                return prevState
            }

            const tabUpdate = removeAtCursor(tab)
            const tabIndex = editor.activeTabIndex

            return {
                ...prevState,
                editor: updateTab(editor, { tabIndex, tabUpdate }),
            }
        }

        case 'cursor-new-line': {
            const { editor } = prevState

            const tab = activeTab(editor)
            if (tab === null) {
                return prevState
            }

            const tabUpdate = breakLineAtCursor(tab)
            const tabIndex = editor.activeTabIndex

            return {
                ...prevState,
                editor: updateTab(editor, { tabIndex, tabUpdate }),
            }
        }

        case 'editor-tab-click': {
            const { editor } = prevState

            return {
                ...prevState,
                editor: setActiveTabIndex(editor, {
                    activeTabIndex: msg.index,
                }),
            }
        }

        case 'editor-tab-content-click': {
            const { editor } = prevState

            // TODO check tab index. Refactoring this code may be a good idea.
            const tab = editor.tabs[msg.index]

            const row = Math.floor(
                (msg.clickY + tab.scroll.y - 32) / editor.font.lineHeight,
            )

            const rowContent = tab.content[row]

            let s = ''
            for (let i = 0; i < rowContent.length; i++) {
                const right = s + rowContent.charAt(i)
                if (stringMetrics(editor.font, right).width > msg.clickX - 48) {
                    break
                }

                s = right
            }

            const column = s.length

            return {
                ...prevState,
                editor: updateTab(editor, {
                    tabIndex: msg.index,
                    tabUpdate: setCursor(tab, { row, column }, msg.selecting),
                }),
            }
        }

        case 'editor-tab-close': {
            const { editor } = prevState

            return {
                ...prevState,
                editor: removeTab(editor, msg.index),
            }
        }

        case 'editor-tab-scroll': {
            const { editor } = prevState

            return {
                ...prevState,
                editor: scrollTab(
                    editor,
                    editor.activeTabIndex,
                    msg.deltaX,
                    msg.deltaY,
                ),
            }
        }

        case 'editor-new-tab': {
            const { editor } = prevState

            return {
                ...prevState,
                editor: insertTab(editor, {
                    tab: {
                        ...createDefaultTab(),
                        ...msg.tab,
                    },
                }),
            }
        }

        case 'editor-update-tab': {
            const { editor } = prevState

            return {
                ...prevState,
                editor: updateTab(editor, {
                    tabIndex: msg.index,
                    tabUpdate: msg.tab,
                }),
            }
        }

        case 'editor-update-size': {
            // TODO: need to ajust the scroll for each tab when editor is
            //       resized to make the cursor always centered
            const { editor } = prevState

            return {
                ...prevState,
                editor: setSize(editor, {
                    size: { width: msg.newSize[0], height: msg.newSize[1] },
                }),
            }
        }
    }

    return prevState
}
