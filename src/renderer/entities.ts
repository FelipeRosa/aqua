export type Direction = 'left' | 'right' | 'up' | 'down'

export type ThemeState = {
    editor: {
        backgroundColor: string
        textColor: string
        cursorColor: string
        activeTabBackgroundColor: string
        activeTabBorderColor: string
        currentLineColor: string
        tabsBorderBottom: string
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
    scroll: {
        x: number
        y: number
    }
}

export const emptyEditorTab = (): EditorTab => ({
    label: null,
    content: [''],
    cursor: {
        column: 0,
        line: 0,
    },
    scroll: {
        x: 0,
        y: 0,
    },
})

export type EditorState = {
    font: {
        family: string
        size: number
        charWidth: number
        lineHeight: number
    }
    activeTabIndex: number
    tabs: EditorTab[]
    size: {
        width: number
        height: number
    }
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
                tabsBorderBottom: '#44475a',
                currentLineColor: '#44475a',
                contentBackgroundColor: '#282a36',
                lineNumbersColor: '#727795',
            },
        },
        editor: {
            font: {
                family: 'Fira Code',
                size: 16,
                charWidth: 10,
                lineHeight: 20,
            },
            activeTabIndex: 0,
            tabs: [],
            size: {
                width: 0,
                height: 0,
            },
        },
    }
}

export type Msg =
    | {
          type: 'cursor-move'
          direction: Direction
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
    | {
          type: 'editor-update-size'
          newSize: number[]
      }
