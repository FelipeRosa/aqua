import { AppState } from './entities'
import {
    activeTab,
    insertTab,
    removeTab,
    scrollTab,
    setActiveTabIndex,
    setSize,
    updateTab,
} from './services/editor'
import {
    createDefaultTab,
    cursorFromPoint,
    insertAtCursor,
    removeAtCursor,
    setCursor,
    undoRedo,
} from './services/tab'

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
          type: 'editor-tab-content-drag'
          index: number
          dragX: number
          dragY: number
      }
    | {
          type: 'editor-tab-content-undo-redo'
          op: 'undo' | 'redo'
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
                editor: updateTab(editor, tabIndex, tabUpdate),
            }
        }

        case 'cursor-insert': {
            const { editor } = prevState

            const tab = activeTab(editor)
            if (tab === null) {
                return prevState
            }

            const tabUpdate = insertAtCursor(tab, msg.char)
            const tabIndex = editor.activeTabIndex

            return {
                ...prevState,
                editor: updateTab(editor, tabIndex, tabUpdate),
            }
        }

        case 'cursor-remove': {
            const { editor } = prevState

            const tab = activeTab(editor)
            if (tab === null) {
                return prevState
            }

            // Create an artificial selection containing the
            // character behind the cursor
            const { cursor } = tab

            if (
                cursor.selectionStartOrEnd === null &&
                (cursor.row > 0 || cursor.column > 0)
            ) {
                cursor.selectionStartOrEnd = {
                    row: cursor.column === 0 ? cursor.row - 1 : cursor.row,
                    column:
                        cursor.column === 0
                            ? tab.content[cursor.row - 1].length
                            : cursor.column - 1,
                }
            }

            const tabUpdate = removeAtCursor(tab)
            const tabIndex = editor.activeTabIndex

            return {
                ...prevState,
                editor: updateTab(editor, tabIndex, tabUpdate),
            }
        }

        case 'editor-tab-click': {
            const { editor } = prevState

            return {
                ...prevState,
                editor: setActiveTabIndex(editor, msg.index),
            }
        }

        case 'editor-tab-content-click': {
            const { editor } = prevState

            // TODO check tab index. Refactoring this code may be a good idea.
            const tab = editor.tabs[msg.index]

            const newCursor = cursorFromPoint(tab, {
                x: msg.clickX,
                y: msg.clickY,
            })
            if (newCursor === null) {
                return prevState
            }

            return {
                ...prevState,
                editor: updateTab(
                    editor,
                    msg.index,
                    setCursor(tab, newCursor, msg.selecting),
                ),
            }
        }

        case 'editor-tab-content-drag': {
            const { editor } = prevState

            const tab = editor.tabs[msg.index]

            const newCursor = cursorFromPoint(tab, {
                x: msg.dragX,
                y: msg.dragY,
            })
            if (newCursor === null) {
                return prevState
            }

            return {
                ...prevState,
                editor: updateTab(
                    editor,
                    msg.index,
                    setCursor(tab, newCursor, true),
                ),
            }
        }

        case 'editor-tab-content-undo-redo': {
            const { editor } = prevState

            const tab = activeTab(editor)
            if (tab === null) {
                return prevState
            }

            const tabUpdate = undoRedo(tab, msg.op)
            const tabIndex = editor.activeTabIndex

            return {
                ...prevState,
                editor: updateTab(editor, tabIndex, tabUpdate),
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
                    ...createDefaultTab(),
                    ...msg.tab,
                }),
            }
        }

        case 'editor-update-tab': {
            const { editor } = prevState

            return {
                ...prevState,
                editor: updateTab(editor, msg.index, msg.tab),
            }
        }

        case 'editor-update-size': {
            // TODO: need to ajust the scroll for each tab when editor is
            //       resized to make the cursor always centered
            const { editor } = prevState

            return {
                ...prevState,
                editor: setSize(editor, {
                    width: msg.newSize[0],
                    height: msg.newSize[1],
                }),
            }
        }
    }

    return prevState
}
