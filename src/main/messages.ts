import { BrowserWindow } from 'electron'

export type MainMessage = {
    type: 'new-tab'
    arg: { label: string; content: string[] }
}

export const sendToRenderer = (window: BrowserWindow, msg: MainMessage) =>
    window.webContents.send('main-msg', msg)
