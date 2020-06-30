import React, { useContext, useRef } from 'react'
import { AppStateContext } from '../context'
import { Cursor } from './cursor'
import './editor.css'
import { Tabs } from './tabs'

export const Editor = () => {
    const {
        state: { editor },
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

    return (
        <div className="editor">
            <Tabs />

            <div className="editor-content" tabIndex={0} onFocus={onFocus}>
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

                <Cursor />

                {editor.content.map((line, lineIndex) => (
                    <div
                        key={lineIndex}
                        className="editor-line"
                        style={{ height: editor.font.lineHeight }}
                    >
                        {line}
                    </div>
                ))}
            </div>
        </div>
    )
}
