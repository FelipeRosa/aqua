import { createContext, Dispatch } from 'react'
import { AppState, createDefaultAppState } from './entities/state'
import { Msg } from './reducer'

export type AppStateContextValue = {
    state: AppState
    dispatch: Dispatch<Msg>
}

export const AppStateContext = createContext<AppStateContextValue>({
    state: createDefaultAppState(),
    // tslint:disable-next-line:no-empty
    dispatch: () => {},
})
