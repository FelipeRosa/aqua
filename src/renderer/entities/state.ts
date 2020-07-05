import { createDefaultEditor, Editor } from './editor'
import { createDefaultEditorTheme, EditorTheme } from './theme'

export type AppState = {
    themes: {
        editor: EditorTheme
    }
    editor: Editor
}

export const createDefaultAppState = (): AppState => ({
    themes: {
        editor: createDefaultEditorTheme(),
    },
    editor: createDefaultEditor(),
})
