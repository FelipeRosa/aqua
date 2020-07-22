import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import { stringMetrics } from '../entities/font'
import { Tab } from '../entities/tab'
import { subContent } from '../entities/tab/content'
import { bounds, Selection as SelectionEntity } from '../entities/tab/selection'

export type SelectionProps = {
    tab: Tab
}

export const Selection = ({ tab }: SelectionProps) => {
    const {
        state: {
            editor,
            themes: { editor: editorTheme },
        },
    } = useContext(AppStateContext)

    const { font } = editor
    const { content, cursor } = tab
    const { selectionStartOrEnd } = cursor

    if (selectionStartOrEnd === null) {
        return null
    }

    const selection: SelectionEntity = {
        start: selectionStartOrEnd,
        end: cursor,
    }

    const selectionBounds = bounds(selection)
    const selectionContent = subContent(content, selection)
    if (selectionBounds.length === 0 || selectionContent === null) {
        return null
    }

    const selectionLineStyle = (lineIndex: number): React.CSSProperties => {
        const contentLineIndex = selectionBounds[lineIndex].start.row
        const contentLine = content[contentLineIndex]

        return {
            left: stringMetrics(
                font,
                contentLine.substr(0, selectionBounds[lineIndex].start.column),
            ).width,
            top: contentLineIndex * font.lineHeight,
            width: stringMetrics(font, selectionContent[lineIndex]).width,
            height: font.lineHeight,
            background: editorTheme.selectionColor,
        }
    }

    return (
        <div>
            {selectionContent.map((_line, lineIndex) => (
                <span
                    style={selectionLineStyle(lineIndex)}
                    className="editor-cursor-selection"
                />
            ))}
        </div>
    )
}
