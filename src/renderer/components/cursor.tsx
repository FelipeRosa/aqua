import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import EditorTab from '../entities/editor-tab'

export type CursorProps = {
    tab: EditorTab
    color: string
}

export const Cursor = ({ tab, color }: CursorProps) => {
    const {
        state: { editor },
    } = useContext(AppStateContext)
    const font = editor.getFont()
    const cursor = tab.getCursor()
    const content = tab.getContent()

    const style: React.CSSProperties = {
        left: font.stringWidth(
            content.getLine(cursor.getLine()).slice(0, cursor.getColumn()),
        ),
        top: cursor.getLine() * font.getLineHeight(),
        height: font.getLineHeight(),
        borderLeft: `2px solid ${color}`,
    }

    return <span style={style} className="editor-cursor" />
}
