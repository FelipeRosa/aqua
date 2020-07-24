import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import { stringMetrics } from '../services/font'
import { Tab } from '../entities'

export type CursorProps = {
    tab: Tab
    color: string
}

export const Cursor = ({ tab, color }: CursorProps) => {
    const {
        state: { editor },
    } = useContext(AppStateContext)

    const { font } = editor
    const { content, cursor } = tab

    const style: React.CSSProperties = {
        left: stringMetrics(font, content[cursor.row].slice(0, cursor.column))
            .width,
        top: cursor.row * font.lineHeight,
        height: font.lineHeight,
        borderLeft: `2px solid ${color}`,
    }

    return <span style={style} className="editor-cursor" />
}
