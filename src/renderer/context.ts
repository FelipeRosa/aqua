import { createContext, Dispatch } from 'react'
import { AppState, initialAppState, Msg } from './entities'

export type AppStateContextValue = {
    state: AppState
    dispatch: Dispatch<Msg>
}

export const AppStateContext = createContext<AppStateContextValue>({
    state: initialAppState(),
    // tslint:disable-next-line:no-empty
    dispatch: () => {},
})
