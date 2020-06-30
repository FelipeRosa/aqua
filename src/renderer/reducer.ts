import { AppState, Msg } from './entities'
import { activeTab, realCursorX } from './services/editor'

export function reducer(prevState: AppState, msg: Msg): AppState {
    switch (msg.type) {
        case 'cursor-move': {
            const nextState = { ...prevState }

            const tab = activeTab(nextState.editor)
            if (tab === null) {
                break
            }

            const { cursor, content } = tab

            switch (msg.direction) {
                case 'left':
                    cursor.column = Math.max(0, realCursorX(tab) - 1)
                    break

                case 'right':
                    if (
                        cursor.line < content.length &&
                        cursor.column < content[cursor.line].length
                    ) {
                        cursor.column++
                    }
                    break

                case 'down':
                    if (cursor.line < content.length - 1) {
                        cursor.line++
                    }
                    break

                case 'up':
                    if (cursor.line > 0) {
                        cursor.line--
                    }
                    break
            }

            return nextState
        }

        case 'cursor-insert': {
            const nextState = { ...prevState }

            const tab = activeTab(nextState.editor)
            if (tab === null) {
                break
            }

            const { cursor, content } = tab

            const cursorX = realCursorX(tab)

            content[cursor.line] =
                content[cursor.line].slice(0, cursorX) +
                msg.char +
                content[cursor.line].slice(cursorX)

            cursor.column = cursorX + msg.char.length

            return nextState
        }

        case 'cursor-remove': {
            const nextState = { ...prevState }

            const tab = activeTab(nextState.editor)
            if (tab === null) {
                break
            }

            const { cursor, content } = tab

            const cursorX = realCursorX(tab)

            if (cursorX > 0) {
                content[cursor.line] =
                    content[cursor.line].slice(0, cursorX - 1) +
                    content[cursor.line].slice(cursorX)

                cursor.column = cursorX - 1
            } else if (cursor.line > 0) {
                const preLines = content.slice(0, cursor.line - 1)
                const posLines = content.slice(cursor.line + 1)

                tab.content = [
                    ...preLines,
                    content[cursor.line - 1] + content[cursor.line].trimLeft(),
                    ...posLines,
                ]

                cursor.column = content[cursor.line - 1].length
                cursor.line--

                return nextState
            }

            return nextState
        }

        case 'cursor-new-line': {
            const nextState = { ...prevState }

            const tab = activeTab(nextState.editor)
            if (tab === null) {
                break
            }

            const { cursor, content } = tab

            const cursorX = realCursorX(tab)

            const preLines = content.slice(0, cursor.line)
            const posLines = content.slice(cursor.line + 1)

            // compute previous line indentation
            const preSpacesMatch = content[cursor.line].match(/^\s+/)
            const preSpaces = preSpacesMatch ? preSpacesMatch[0] : ''

            tab.content = [
                ...preLines,
                content[cursor.line].slice(0, cursorX),
                // add indentation from previous line
                preSpaces + content[cursor.line].slice(cursorX),
                ...posLines,
            ]

            // set cursor x to match the computed indentation
            cursor.column = preSpaces.length
            cursor.line++

            return nextState
        }

        case 'editor-tab-click': {
            const nextState = { ...prevState }
            const { editor } = nextState

            if (msg.index < editor.tabs.length) {
                editor.activeTabIndex = msg.index
            }

            return nextState
        }
    }

    return prevState
}
