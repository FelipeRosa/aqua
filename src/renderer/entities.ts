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

export type TabCursor = { column: number; line: number }
export type CursorMoveDirection = 'left' | 'right' | 'up' | 'down'
export type TabScroll = { x: number; y: number }
export type EditorTab = {
    label: string | null
    content: string[]
    cursor: TabCursor
    scroll: TabScroll
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

export type EditorFont = {
    family: string
    size: number
    charWidth: number
    lineHeight: number
}
export type EditorSize = { width: number; height: number }
export type EditorState = {
    font: EditorFont
    activeTabIndex: number
    tabs: EditorTab[]
    size: EditorSize
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
          direction: CursorMoveDirection
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
