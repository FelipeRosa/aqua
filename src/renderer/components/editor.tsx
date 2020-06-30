import React, { useContext, useRef } from 'react'
import { AppStateContext } from '../context'
import * as editorService from '../services/editor'
import { Cursor } from './cursor'
import './editor.css'
import { Tabs } from './tabs'

export const Editor = () => {
    const {
        state: { theme, editor },
        dispatch,
    } = useContext(AppStateContext)

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        let handled = true

        switch (e.keyCode) {
            case 8:
                dispatch({ type: 'cursor-remove' })
                break

            case 9:
                // tabs are only 4 spaces for now
                dispatch({ type: 'cursor-insert', char: '    ' })
                break

            case 13:
                dispatch({ type: 'cursor-new-line' })
                break

            case 39:
                dispatch({ type: 'cursor-move', direction: 'right' })
                break

            case 37:
                dispatch({ type: 'cursor-move', direction: 'left' })
                break

            case 38:
                dispatch({ type: 'cursor-move', direction: 'up' })
                break

            case 40:
                dispatch({ type: 'cursor-move', direction: 'down' })
                break

            default:
                handled = false
                break
        }

        if (handled) {
            e.preventDefault()
        }
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const onFocus = () => {
        textareaRef.current?.focus()
    }

    const onInput = () => {
        if (textareaRef.current) {
            const textarea = textareaRef.current

            dispatch({ type: 'cursor-insert', char: textarea.value })
            textarea.value = ''
        }
    }

    const activeTab = editorService.activeTab(editor)

    const editorStyle: React.CSSProperties = {
        background: theme.editor.backgroundColor,
        color: theme.editor.textColor,
    }

    const editorContentStyle: React.CSSProperties = {
        background: theme.editor.contentBackgroundColor,
        borderTop: '1px solid ' + theme.editor.contentBorderTopColor,
    }

    const lineStyle = (isCurrent: boolean): React.CSSProperties => {
        const style: React.CSSProperties = {}
        style.height = editor.font.lineHeight

        if (isCurrent) {
            style.background = theme.editor.currentLineColor
        }

        return style
    }

    return (
        <div className="editor" style={editorStyle}>
            <Tabs />

            {activeTab && (
                <div
                    className="editor-content"
                    style={editorContentStyle}
                    tabIndex={0}
                    onFocus={onFocus}
                >
                    <textarea
                        ref={textareaRef}
                        style={{
                            position: 'absolute',
                            left: -25,
                            top: -25,
                            width: 10,
                            height: 10,
                        }}
                        onKeyDown={onKeyDown}
                        onInput={onInput}
                    />

                    <Cursor tab={activeTab} color={theme.editor.cursorColor} />

                    {activeTab.content.map((line, lineIndex) => (
                        <div
                            key={lineIndex}
                            className="editor-line"
                            style={lineStyle(
                                lineIndex === activeTab.cursor.line,
                            )}
                        >
                            {line}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
