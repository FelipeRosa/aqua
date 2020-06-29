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
                    if (cursor.x > 0) {
                        cursor.x--
                    }
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
            }

            // tslint:disable-next-line:no-console
            console.log(content)

            return nextState
        }
    }

    return prevState
}
