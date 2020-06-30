import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import { realCursorX } from '../services/cursor'

export const Cursor = () => {
    const {
        state: { editor },
    } = useContext(AppStateContext)

    const { cursor, content, font } = editor

    const cursorX = realCursorX(editor)

    function charWidth(
        fontFamily: string,
        fontSize: number,
        s: string,
    ): number {
        const el = document.createElement('pre')
        document.body.appendChild(el)

        el.style.fontFamily = fontFamily
        el.style.fontSize = `${fontSize}px`
        el.style.height = 'auto'
        el.style.width = 'auto'
        el.style.position = 'absolute'
        el.style.whiteSpace = 'no-wrap'

        el.innerHTML = s

        const width = el.offsetWidth

        document.body.removeChild(el)

        return width
    }

    const cursorLeft = charWidth(
        'Fira Code',
        16,
        content[cursor.y].slice(0, cursorX),
    )

    const style = {
        left: cursorLeft,
        top: cursor.y * font.lineHeight,
        height: font.lineHeight,
        borderLeft: '2px solid black',
    }

    return <span style={style} className="editor-cursor" />
}
