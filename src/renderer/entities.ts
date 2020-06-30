export type EditorTab = {
    label: string
    content: string[]
    cursor: {
        column: number
        line: number
    }
}

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
            tabs: [
                {
                    label: 'a',
                    content: ['fn main() {', '    println!("abc");', '}'],
                    cursor: { column: 0, line: 0 },
                },
                {
                    label: 'b',
                    content: ['fn some_func() -> i32 {', '    1', '}'],
                    cursor: { column: 0, line: 0 },
                },
            ],
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
