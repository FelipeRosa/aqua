import { BrowserWindow } from 'electron'
import { EditorTab } from '../renderer/entities'

export type MainMessage = {
    type: 'new-tab'
    arg: Partial<EditorTab>
}

export const sendToRenderer = (window: BrowserWindow, msg: MainMessage) =>
    window.webContents.send('main-msg', msg)
