import { createContext, Dispatch } from 'react'
import { Msg } from './reducer'
import { AppState } from './entities'
import { createDefaultAppState } from './services/state'

export type AppStateContextValue = {
    state: AppState
    dispatch: Dispatch<Msg>
}

export const AppStateContext = createContext<AppStateContextValue>({
    state: createDefaultAppState(),
    // tslint:disable-next-line:no-empty
    dispatch: () => {},
})
