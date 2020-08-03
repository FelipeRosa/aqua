import { BrowserWindow, ipcMain } from 'electron'
import { Tab } from '../renderer/entities'

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
        dirty: boolean
    }>
}

export type WindowResizedMsg<T extends 'window-resized'> = {
    type: T
    newSize: number[]
}

export type ContentUndoRedoMsg<T extends 'content-undo-redo'> = {
    type: T
    op: 'undo' | 'redo'
}

export type ContentCopy<T extends 'content-copy'> = {
    type: T
    cut: boolean
}

export type ContentPaste<T extends 'content-paste'> = {
    type: T
}

// prettier-ignore
export type MainMsg<T> =
      T extends 'new-tab' ? NewTabMsg<T>
    : T extends 'get-current-tab' ? GetCurrentTabMsg<T>
    : T extends 'update-current-tab' ? UpdateCurrentTabMsg<T>
    : T extends 'window-resized' ? WindowResizedMsg<T>
    : T extends 'content-undo-redo' ? ContentUndoRedoMsg<T>
    : T extends 'content-copy' ? ContentCopy<T>
    : T extends 'content-paste' ? ContentPaste<T>
    : never

// prettier-ignore
export type RendererMsg<T> =
      T extends 'new-tab' ? null
    : T extends 'get-current-tab' ? Tab | null
    : T extends 'update-current-tab' ? null
    : T extends 'window-resized' ? null
    : T extends 'content-undo-redo' ? null
    : T extends 'content-copy' ? null
    : T extends 'content-paste' ? null
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
