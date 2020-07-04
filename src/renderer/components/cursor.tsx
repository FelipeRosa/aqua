import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import { EditorTab } from '../entities'
import { charWidth } from '../services/font'
import TabService from '../services/tab'

export type CursorProps = {
    tab: EditorTab
    color: string
}

export const Cursor = ({ tab, color }: CursorProps) => {
    const {
        state: { editor },
    } = useContext(AppStateContext)
    const { font } = editor
    const { cursor, content } = tab

    const tabService = new TabService({ editor })

    const style: React.CSSProperties = {
        left: charWidth(
            'Fira Code',
            16,
            content[cursor.line].slice(0, tabService.realCursorX(tab)),
        ),
        top: cursor.line * font.lineHeight,
        height: font.lineHeight,
        borderLeft: `2px solid ${color}`,
    }

    return <span style={style} className="editor-cursor" />
}
