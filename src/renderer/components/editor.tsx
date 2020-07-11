import React, { useContext, useRef } from 'react'
import { AppStateContext } from '../context'
import { activeTab as editorActiveTab } from '../entities/editor'
import { Cursor } from './cursor'
import './editor.css'
import { Tabs } from './tabs'

export const Editor = () => {
    const {
        state: {
            themes: { editor: editorTheme },
            editor,
        },
        dispatch,
    } = useContext(AppStateContext)

    const { font, size: editorSize } = editor

    const activeTab = editorActiveTab(editor)

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

    const onMouseWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        dispatch({
            type: 'editor-tab-scroll',
            index: editor.activeTabIndex,
            deltaX: e.deltaX,
            deltaY: e.deltaY,
        })
    }

    const onLineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (activeTab === null) {
            return
        }

        dispatch({
            type: 'editor-tab-content-click',
            index: editor.activeTabIndex,
            clickX: e.clientX,
            clickY: e.clientY,
        })
    }

    const editorStyle: React.CSSProperties = {
        background: editorTheme.backgroundColor,
        color: editorTheme.textColor,
        height: activeTab
            ? Math.max(
                  // This needs to take the height (32px) of the tabs into account
                  // so we don't render the editor too short.
                  activeTab.content.length * font.lineHeight + 32,
                  editorSize.height,
              )
            : editorSize.height,
        // TODO: width should be the max tab content line width. Which would be
        //       ideally cached when the tab content changes.
        width: 10000,
    }

    const editorContentWrapperStyle: React.CSSProperties = {
        top: activeTab ? -activeTab.scroll.y : 0,
    }

    const editorContentStyle: React.CSSProperties = {
        background: editorTheme.contentBackgroundColor,
        left: activeTab ? -activeTab.scroll.x + 48 : 0,
    }

    const editorLineNumbersStyle: React.CSSProperties = {
        background: editorTheme.backgroundColor,
    }

    const editorLineNumberStyle = (isCurrent: boolean): React.CSSProperties => {
        const style: React.CSSProperties = {
            color: editorTheme.lineNumbersColor,
            height: font.lineHeight,
        }

        if (isCurrent) {
            style.background = editorTheme.currentLineColor
        }

        return style
    }

    const lineStyle = (isCurrent: boolean): React.CSSProperties => {
        const style: React.CSSProperties = {}
        style.height = font.lineHeight

        if (isCurrent) {
            style.background = editorTheme.currentLineColor
        }

        return style
    }

    return (
        <div className="editor" style={editorStyle}>
            <Tabs />

            {activeTab && (
                <div
                    className="editor-content-wrapper"
                    style={editorContentWrapperStyle}
                    onWheel={onMouseWheel}
                >
                    <div
                        className="editor-line-numbers"
                        style={editorLineNumbersStyle}
                    >
                        {activeTab.content.map((_line, lineIndex) => (
                            <div
                                className="editor-line-number"
                                style={editorLineNumberStyle(
                                    activeTab.cursor.row === lineIndex,
                                )}
                                onClick={onLineClick}
                            >
                                {lineIndex + 1}
                            </div>
                        ))}
                    </div>

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

                        <Cursor
                            tab={activeTab}
                            color={editorTheme.cursorColor}
                        />

                        {activeTab.content.map((line, lineIndex) => (
                            <div>
                                <div
                                    key={lineIndex}
                                    className="editor-line"
                                    style={lineStyle(
                                        lineIndex === activeTab.cursor.row,
                                    )}
                                    onClick={onLineClick}
                                >
                                    {line}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
