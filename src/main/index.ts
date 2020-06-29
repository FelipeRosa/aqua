import { app, BrowserWindow, Menu } from 'electron'

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
