export type EditorState = {
    content: string[]
    cursor: {
        x: number
        y: number
    }
    font: {
        charWidth: number
        lineHeight: number
    }
}

export type AppState = {
    editor: EditorState
}

export function initialAppState(): AppState {
    return {
        editor: {
            content: ['fn main() {', '    println!("abc");', '}', ''],
            cursor: {
                x: 0,
                y: 0,
            },
            font: {
                charWidth: 10,
                lineHeight: 20,
            },
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
