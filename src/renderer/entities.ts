export type ThemeState = {
    editor: {
        backgroundColor: string
        textColor: string
        cursorColor: string
        activeTabBackgroundColor: string
        activeTabBorderColor: string
        currentLineColor: string
        contentBorderTopColor: string
        contentBackgroundColor: string
        lineNumbersColor: string
    }
}

export type EditorTab = {
    label: string | null
    content: string[]
    cursor: {
        column: number
        line: number
    }
}

export const emptyEditorTab = (): EditorTab => ({
    label: null,
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
    theme: ThemeState
    editor: EditorState
}

export function initialAppState(): AppState {
    return {
        theme: {
            editor: {
                backgroundColor: '#1f202a',
                textColor: '#f8f8f2',
                cursorColor: '#ffb86c',
                activeTabBackgroundColor: '#44475a',
                activeTabBorderColor: '#bd93f9',
                currentLineColor: '#44475a',
                contentBorderTopColor: '#44475a',
                contentBackgroundColor: '#282a36',
                lineNumbersColor: '#727795',
            },
        },
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
    | {
          type: 'editor-update-tab'
          index: number
          tab: Partial<EditorTab>
      }
