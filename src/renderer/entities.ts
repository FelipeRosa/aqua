import Editor from './entities/editor'
import { CursorMoveDirection } from './entities/tab-cursor'

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

export type AppState = {
    theme: ThemeState
    editor: Editor
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
        editor: new Editor(),
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
          tab: Partial<{
              label: string | null
              content: string[]
          }>
      }
    | {
          type: 'editor-update-tab'
          index: number
          tab: Partial<{
              label: string | null
              content: string[]
          }>
      }
    | {
          type: 'editor-update-size'
          newSize: number[]
      }
