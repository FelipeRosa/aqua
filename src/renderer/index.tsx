import { ipcRenderer } from 'electron'
import React, { useEffect, useReducer } from 'react'
import { render } from 'react-dom'
import { MainMsg } from '../internal/main-messages'
import { Editor } from './components/editor'
import { AppStateContext } from './context'
import { initialAppState } from './entities'
import './index.css'
import { reducer } from './reducer'

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialAppState())

    useEffect(() => {
        ipcRenderer.on('main-msg.new-tab', (_e, msg: MainMsg<'new-tab'>) => {
            dispatch({ type: 'editor-new-tab', tab: msg.tabInitialState })

            ipcRenderer.send('renderer-msg.editor-new-tab', null)
        })
        ipcRenderer.on(
            'main-msg.get-current-tab',
            (_e, _msg: MainMsg<'get-current-tab'>) => {
                ipcRenderer.send(
                    'renderer-msg.get-current-tab',
                    state.editor.getActiveTab(),
                )
            },
        )
        ipcRenderer.on(
            'main-msg.update-current-tab',
            (_e, msg: MainMsg<'update-current-tab'>) => {
                const activeTabIndex = state.editor.getActiveTabIndex()
                if (activeTabIndex !== null) {
                    dispatch({
                        type: 'editor-update-tab',
                        index: activeTabIndex,
                        tab: msg.updatedTab,
                    })
                }

                ipcRenderer.send('renderer-msg.update-current-tab', null)
            },
        )
        ipcRenderer.on(
            'main-msg.window-resized',
            (_e, msg: MainMsg<'window-resized'>) => {
                dispatch({ type: 'editor-update-size', newSize: msg.newSize })

                ipcRenderer.send('renderer-msg.window-resized', null)
            },
        )

        return () => {
            ipcRenderer.removeAllListeners('main-msg.new-tab')
            ipcRenderer.removeAllListeners('main-msg.get-current-tab')
            ipcRenderer.removeAllListeners('main-msg.update-current-tab')
            ipcRenderer.removeAllListeners('main-msg.window-resized')
        }
    }, [])

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            <Editor />
        </AppStateContext.Provider>
    )
}

render(<App />, document.getElementById('root'))
