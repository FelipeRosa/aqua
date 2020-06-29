import { EditorState } from '../entities'

export const realCursorX = ({
    cursor,
    content,
}: Readonly<EditorState>): number => {
    return Math.min(cursor.x, content[cursor.y].length)
}
