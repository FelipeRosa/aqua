import { AppState, emptyEditorTab, Msg } from './entities'
import EditorService from './services/editor'
import TabService from './services/tab'

export function reducer(prevState: AppState, msg: Msg): AppState {
    switch (msg.type) {
        case 'cursor-move': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = EditorService.activeTab(editor)
            if (tab === null) {
                return prevState
            }

            new TabService({ editor }).moveCursor(tab, msg.direction)

            return nextState
        }

        case 'cursor-insert': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = EditorService.activeTab(editor)
            if (tab === null) {
                return prevState
            }

            new TabService({ editor }).insertAtCursor(tab, msg.char)

            return nextState
        }

        case 'cursor-remove': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = EditorService.activeTab(editor)
            if (tab === null) {
                return prevState
            }

            const tabService = new TabService({ editor })
            if (tabService.removeAtCursor(tab)) {
                return nextState
            }

            return prevState
        }

        case 'cursor-new-line': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = EditorService.activeTab(editor)
            if (tab === null) {
                return prevState
            }

            new TabService({ editor }).newLineAtCursor(tab)

            return nextState
        }

        case 'editor-tab-click': {
            const nextState = { ...prevState }
            const { editor } = nextState

            if (msg.index < 0 || msg.index >= editor.tabs.length) {
                return prevState
            }

            editor.activeTabIndex = msg.index

            return nextState
        }

        case 'editor-new-tab': {
            const nextState = { ...prevState }
            const { editor } = nextState

            editor.tabs.push({
                ...emptyEditorTab(),
                ...msg.tab,
            })
            editor.activeTabIndex = editor.tabs.length - 1

            return nextState
        }

        case 'editor-update-tab': {
            if (msg.index < 0 || msg.index >= prevState.editor.tabs.length) {
                return prevState
            }

            const nextState = { ...prevState }
            nextState.editor.tabs[msg.index] = {
                ...prevState.editor.tabs[msg.index],
                ...msg.tab,
            }

            return nextState
        }

        case 'editor-update-size': {
            const nextState = { ...prevState }
            nextState.editor.size = {
                width: msg.newSize[0],
                height: msg.newSize[1],
            }

            // TODO: need to ajust the scroll for each tab when editor is
            //       resized to make the cursor always centered

            return nextState
        }
    }

    return prevState
}
