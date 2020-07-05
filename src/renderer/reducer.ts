import { AppState, Msg } from './entities'
import EditorTab from './entities/editor-tab'

export function reducer(prevState: AppState, msg: Msg): AppState {
    switch (msg.type) {
        case 'cursor-move': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = editor.getActiveTab()
            if (tab === null) {
                return prevState
            }

            tab.moveCursor(msg.direction)

            return nextState
        }

        case 'cursor-insert': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = editor.getActiveTab()
            if (tab === null) {
                return prevState
            }

            tab.insertAtCursor(msg.char)

            return nextState
        }

        case 'cursor-remove': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = editor.getActiveTab()
            if (tab === null) {
                return prevState
            }

            if (tab.removeAtCursor()) {
                return nextState
            }

            return prevState
        }

        case 'cursor-new-line': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = editor.getActiveTab()
            if (tab === null) {
                return prevState
            }

            tab.newLineAtCursor()

            return nextState
        }

        case 'editor-tab-click': {
            const nextState = { ...prevState }
            const { editor } = nextState

            if (editor.setActiveTab(msg.index)) {
                return nextState
            }

            return prevState
        }

        case 'editor-new-tab': {
            const nextState = { ...prevState }
            const { editor } = nextState

            const tab = new EditorTab(editor)

            if (msg.tab.label) {
                tab.setLabel(msg.tab.label)
            }
            if (msg.tab.content) {
                tab.getContent().setLines(msg.tab.content)
            }

            editor.addTab(tab)

            return nextState
        }

        case 'editor-update-tab': {
            const nextState = { ...prevState }
            const { editor } = nextState

            return prevState
        }

        case 'editor-update-size': {
            const nextState = { ...prevState }

            nextState.editor.updateSize(msg.newSize[0], msg.newSize[1])

            // TODO: need to ajust the scroll for each tab when editor is
            //       resized to make the cursor always centered

            return nextState
        }
    }

    return prevState
}
