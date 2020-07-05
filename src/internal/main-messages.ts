import { BrowserWindow, ipcMain } from 'electron'

export type NewTabMsg<T extends 'new-tab'> = {
    type: T
    tabInitialState: Partial<{
        label: string | null
        content: string[]
    }>
}

export type GetCurrentTabMsg<T extends 'get-current-tab'> = {
    type: T
}

export type UpdateCurrentTabMsg<T extends 'update-current-tab'> = {
    type: T
    updatedTab: Partial<{
        label: string | null
    }>
}

export type WindowResizedMsg<T extends 'window-resized'> = {
    type: T
    newSize: number[]
}

// prettier-ignore
export type MainMsg<T> =
      T extends 'new-tab' ? NewTabMsg<T>
    : T extends 'get-current-tab' ? GetCurrentTabMsg<T>
    : T extends 'update-current-tab' ? UpdateCurrentTabMsg<T>
    : T extends 'window-resized' ? WindowResizedMsg<T>
    : never

// prettier-ignore
export type RendererMsg<T> =
      T extends 'new-tab' ? null
    : T extends 'get-current-tab' ? { label: string; content: string[] } | null
    : T extends 'update-current-tab' ? null
    : T extends 'window-resized' ? null
    : never

export function sendToRenderer<T>(
    window: BrowserWindow,
    msg: MainMsg<T>,
): Promise<RendererMsg<T>> {
    return new Promise((resolve) => {
        window.webContents.send(`main-msg.${msg.type}`, msg)

        ipcMain.once(`renderer-msg.${msg.type}`, (_e, args) => {
            resolve(args)
        })
    })
}
