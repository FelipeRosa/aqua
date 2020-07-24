import { AppState } from '../entities'
import { createDefaultEditorTheme } from './theme'
import { createDefaultEditor } from './editor'

export const createDefaultAppState = (): AppState => ({
    themes: {
        editor: createDefaultEditorTheme(),
    },
    editor: createDefaultEditor(),
})