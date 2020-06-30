import { ipcRenderer } from 'electron'
import React, { useEffect, useReducer } from 'react'
import { render } from 'react-dom'
import { MainMessage } from '../main/messages'
import { Editor } from './components/editor'
import { AppStateContext } from './context'
import { initialAppState } from './entities'
import './index.css'
import { reducer } from './reducer'

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialAppState())

    useEffect(() => {
        ipcRenderer.on('main-msg', (_e, msg: MainMessage) => {
            switch (msg.type) {
                case 'new-tab':
                    dispatch({ type: 'editor-new-tab', tab: msg.arg })
                    break
            }
        })

        return () => {
            ipcRenderer.removeAllListeners('main-msg')
        }
    })

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            <Editor />
        </AppStateContext.Provider>
    )
}

render(<App />, document.getElementById('root'))
