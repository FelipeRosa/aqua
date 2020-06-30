import React, { useContext } from 'react'
import { AppStateContext } from '../context'

export const Tabs = () => {
    const { state, dispatch } = useContext(AppStateContext)
    const {
        editor: { tabs, activeTabIndex },
    } = state

    const onTabClick = (tabIndex: number) => {
        dispatch({ type: 'editor-tab-click', index: tabIndex })
    }

    return (
        <div className="editor-tabs">
            {tabs.map((tab, tabIndex) => (
                <div
                    key={tabIndex}
                    className={`editor-tab ${
                        tabIndex === activeTabIndex ? 'active' : ''
                    }`}
                    onClick={() => onTabClick(tabIndex)}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    )
}
