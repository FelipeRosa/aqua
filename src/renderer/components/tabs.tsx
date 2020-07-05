import React, { useContext } from 'react'
import { AppStateContext } from '../context'
import { labelText } from '../entities/tab'

export const Tabs = () => {
    const { state, dispatch } = useContext(AppStateContext)
    const {
        themes: {
            editor: {
                activeTabBorderColor,
                activeTabBackgroundColor,
                backgroundColor,
                tabsBorderBottom,
            },
        },
        editor,
    } = state

    const { tabs } = editor

    const onTabClick = (tabIndex: number) => {
        dispatch({ type: 'editor-tab-click', index: tabIndex })
    }

    const tabsStyle: React.CSSProperties = {
        background: backgroundColor,
        borderBottom: '1px solid ' + tabsBorderBottom,
    }

    const tabStyle = (isActive: boolean): React.CSSProperties => ({
        background: `${isActive ? activeTabBackgroundColor : 'none'}`,
        borderBottom: isActive
            ? '2px solid ' + activeTabBorderColor
            : undefined,
    })

    return (
        <div className="editor-tabs" style={tabsStyle}>
            {tabs.map((tab, tabIndex) => (
                <div
                    key={tabIndex}
                    className="editor-tab"
                    style={tabStyle(editor.activeTabIndex === tabIndex)}
                    onClick={() => onTabClick(tabIndex)}
                >
                    {labelText(tab)}
                </div>
            ))}
        </div>
    )
}
