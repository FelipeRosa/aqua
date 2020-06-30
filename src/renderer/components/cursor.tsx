import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import { EditorTab } from '../entities'
import { realCursorX } from '../services/editor'
import { charWidth } from '../services/font'

export type CursorProps = {
    tab: EditorTab
    color: string
}

export const Cursor = ({ tab, color }: CursorProps) => {
    const {
        state: { editor },
    } = useContext(AppStateContext)

    const style: React.CSSProperties = {
        left: charWidth(
            'Fira Code',
            16,
            tab.content[tab.cursor.line].slice(0, realCursorX(tab)),
        ),
        top: tab.cursor.line * editor.font.lineHeight,
        height: editor.font.lineHeight,
        borderLeft: `2px solid ${color}`,
    }

    return <span style={style} className="editor-cursor" />
}
