import { BrowserWindow, ipcMain } from 'electron'
import { EditorTab } from '../renderer/entities'

// prettier-ignore
export type MainMessage<T> =
      T extends 'new-tab' ? { type: T; tabInitialState: Partial<EditorTab> }
    : T extends 'get-current-tab' ? { type: T }
    : T extends 'update-current-tab' ? { type: T, updatedTab: Partial<EditorTab> }
    : T extends 'window-resized' ? { type: T, newSize: number[] }
    : never

// prettier-ignore
export type MainMessageResponse<T> =
      T extends 'new-tab' ? null
    : T extends 'get-current-tab' ? (EditorTab | null)
    : T extends 'update-current-tab' ? null
    : T extends 'window-resized' ? null
    : null

export function sendToRenderer<T>(
    window: BrowserWindow,
    msg: MainMessage<T>,
): Promise<MainMessageResponse<T>> {
    return new Promise((resolve) => {
        window.webContents.send(`main-msg.${msg.type}`, msg)
        ipcMain.once(`renderer-msg.${msg.type}`, (_e, args) => {
            resolve(args)
        })
    })
}
