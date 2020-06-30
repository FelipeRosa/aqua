export type EditorTab = {
    label: string
    content: string[]
    cursor: {
        column: number
        line: number
    }
}

export const emptyEditorTab = (): EditorTab => ({
    label: 'Unnamed',
    content: [''],
    cursor: {
        column: 0,
        line: 0,
    },
})

export type EditorState = {
    font: {
        charWidth: number
        lineHeight: number
    }
    activeTabIndex: number
    tabs: EditorTab[]
}

export type AppState = {
    editor: EditorState
}

export function initialAppState(): AppState {
    return {
        editor: {
            font: {
                charWidth: 10,
                lineHeight: 20,
            },
            activeTabIndex: 0,
            tabs: [],
        },
    }
}

export type Msg =
    | {
          type: 'cursor-move'
          direction: 'left' | 'right' | 'up' | 'down'
      }
    | {
          type: 'cursor-insert'
          char: string
      }
    | {
          type: 'cursor-remove'
      }
    | {
          type: 'cursor-new-line'
      }
    | {
          type: 'editor-tab-click'
          index: number
      }
    | {
          type: 'editor-new-tab'
          tab: Partial<EditorTab>
      }
