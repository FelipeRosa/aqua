import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import { realCursorX } from '../services/cursor'

export const Cursor = () => {
    const {
        state: { editor },
    } = useContext(AppStateContext)

    const { cursor, font } = editor

    const style = {
        left: realCursorX(editor) * font.charWidth - 1,
        top: cursor.y * font.lineHeight,
        height: font.lineHeight,
        borderLeft: '2px solid black',
    }

    return <span style={style} className="editor-cursor" />
}
