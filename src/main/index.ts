import { app, BrowserWindow, dialog, Menu } from 'electron'
import * as fs from 'fs'
import { sendToRenderer } from './messages'

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    window.loadFile('./dist/index.html')

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator: 'Ctrl+O',
                    click: () => {
                        const dialogPaths = dialog.showOpenDialogSync({})
                        if (!dialogPaths || dialogPaths.length === 0) {
                            return
                        }

                        const filePath = dialogPaths[0]
                        const fileContents = fs.readFileSync(filePath)

                        const fileLines = fileContents
                            .toString('utf-8')
                            .split('\n')

                        sendToRenderer(window, {
                            type: 'new-tab',
                            arg: { label: filePath, content: fileLines },
                        })
                    },
                },
            ],
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Toggle Development Tools',
                    accelerator: 'F12',
                    click: () => {
                        if (window.webContents.isDevToolsOpened()) {
                            window.webContents.closeDevTools()
                        } else {
                            window.webContents.openDevTools()
                        }
                    },
                },
            ],
        },
    ])

    Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
    app.quit()
})
