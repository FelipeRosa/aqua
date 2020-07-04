import React, { useContext } from 'react'
import { AppStateContext } from '../context'

export const Tabs = () => {
    const { state, dispatch } = useContext(AppStateContext)
    const {
        theme: {
            editor: {
                activeTabBorderColor,
                activeTabBackgroundColor,
                backgroundColor,
                tabsBorderBottom,
            },
        },
        editor: { tabs, activeTabIndex },
    } = state

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
                    style={tabStyle(activeTabIndex === tabIndex)}
                    onClick={() => onTabClick(tabIndex)}
                >
                    {tab.label || 'Unnamed'}
                </div>
            ))}
        </div>
    )
}
