import { AppState, Msg } from './entities'
import { realCursorX } from './services/cursor'

export function reducer(prevState: AppState, msg: Msg): AppState {
    switch (msg.type) {
        case 'cursor-move': {
            const nextState = { ...prevState }
            const {
                editor: { content, cursor },
            } = nextState

            switch (msg.direction) {
                case 'left':
                    cursor.x = Math.max(0, realCursorX(nextState.editor) - 1)
                    break

                case 'right':
                    if (
                        cursor.y < content.length &&
                        cursor.x < content[cursor.y].length
                    ) {
                        cursor.x++
                    }
                    break

                case 'down':
                    if (cursor.y < content.length - 1) {
                        cursor.y++
                    }
                    break

                case 'up':
                    if (cursor.y > 0) {
                        cursor.y--
                    }
                    break
            }

            return nextState
        }

        case 'cursor-insert': {
            const nextState = { ...prevState }
            const {
                editor: { content, cursor },
            } = nextState

            const cursorX = realCursorX(nextState.editor)

            content[cursor.y] =
                content[cursor.y].slice(0, cursorX) +
                msg.char +
                content[cursor.y].slice(cursorX)

            cursor.x = cursorX + 1

            return nextState
        }

        case 'cursor-remove': {
            const nextState = { ...prevState }
            const {
                editor: { content, cursor },
            } = nextState

            const cursorX = realCursorX(nextState.editor)

            if (cursorX > 0) {
                content[cursor.y] =
                    content[cursor.y].slice(0, cursorX - 1) +
                    content[cursor.y].slice(cursorX)

                cursor.x = cursorX - 1
            } else if (cursor.y > 0) {
                const preLines = content.slice(0, cursor.y - 1)
                const posLines = content.slice(cursor.y + 1)

                nextState.editor.content = [
                    ...preLines,
                    content[cursor.y - 1] + content[cursor.y].trimLeft(),
                    ...posLines,
                ]

                nextState.editor.cursor.x = content[cursor.y - 1].length
                nextState.editor.cursor.y--

                return nextState
            }

            return nextState
        }

        case 'cursor-new-line': {
            const nextState = { ...prevState }
            const {
                editor: { content, cursor },
            } = nextState

            const cursorX = realCursorX(nextState.editor)

            const preLines = content.slice(0, cursor.y)
            const posLines = content.slice(cursor.y + 1)

            // compute previous line indentation
            const preSpacesMatch = content[cursor.y].match(/^\s+/)
            const preSpaces = preSpacesMatch ? preSpacesMatch[0] : ''

            nextState.editor.content = [
                ...preLines,
                content[cursor.y].slice(0, cursorX),
                // add indentation from previous line
                preSpaces + content[cursor.y].slice(cursorX),
                ...posLines,
            ]

            // set cursor x to match the computed indentation
            nextState.editor.cursor.x = preSpaces.length
            nextState.editor.cursor.y++

            return nextState
        }
    }

    return prevState
}
