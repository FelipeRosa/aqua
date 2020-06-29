import React, { useReducer } from 'react'
import { render } from 'react-dom'
import { Editor } from './components/editor'
import { AppStateContext } from './context'
import { initialAppState } from './entities'
import './index.css'
import { reducer } from './reducer'

function charWidth(fontFamily: string, fontSize: number): number {
    const el = document.createElement('span')
    document.body.appendChild(el)

    el.style.fontFamily = fontFamily
    el.style.fontSize = `${fontSize}px`
    el.style.height = 'auto'
    el.style.width = 'auto'
    el.style.position = 'absolute'
    el.style.whiteSpace = 'no-wrap'

    el.innerHTML = 'm'

    const width = el.offsetWidth

    document.body.removeChild(el)

    return width
}

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialAppState())

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            <Editor />
        </AppStateContext.Provider>
    )
}

render(<App />, document.getElementById('root'))
