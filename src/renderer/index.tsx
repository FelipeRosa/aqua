import React, { useReducer } from 'react'
import { render } from 'react-dom'
import { Editor } from './components/editor'
import { AppStateContext } from './context'
import { initialAppState } from './entities'
import './index.css'
import { reducer } from './reducer'

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialAppState())

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            <Editor />
        </AppStateContext.Provider>
    )
}

render(<App />, document.getElementById('root'))
