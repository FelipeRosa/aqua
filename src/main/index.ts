import { app, BrowserWindow, dialog, Menu } from 'electron'
import * as fs from 'fs'
import { debounce } from '../internal/debounce'
import { sendToRenderer } from '../internal/main-messages'

app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    const debouncedWindowResized = debounce(
        () =>
            sendToRenderer(window, {
                type: 'window-resized',
                newSize: window.getContentSize(),
            }),
        100,
    )
    window.on('resize', () => debouncedWindowResized())
    window.webContents.on('did-finish-load', () => debouncedWindowResized())

    window.loadFile('./dist/index.html')

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    accelerator: 'Ctrl+N',
                    click: () => {
                        sendToRenderer(window, {
                            type: 'new-tab',
                            tabInitialState: {},
                        })
                    },
                },
                {
                    label: 'Open',
                    accelerator: 'Ctrl+O',
                    click: () => {
                        const dialogPaths = dialog.showOpenDialogSync(window, {
                            properties: ['openFile', 'multiSelections'],
                        })
                        if (!dialogPaths || dialogPaths.length === 0) {
                            return
                        }

                        dialogPaths.forEach((filePath) => {
                            const fileContents = fs.readFileSync(filePath)

                            const fileLines = fileContents
                                .toString('utf-8')
                                .split('\n')

                            sendToRenderer(window, {
                                type: 'new-tab',
                                tabInitialState: {
                                    label: filePath,
                                    content: fileLines,
                                },
                            })
                        })
                    },
                },
                {
                    label: 'Save',
                    accelerator: 'Ctrl+S',
                    click: () => {
                        sendToRenderer(window, {
                            type: 'get-current-tab',
                        }).then((tab) => {
                            if (tab === null) {
                                return
                            }

                            const filePath =
                                tab.label ||
                                dialog.showSaveDialogSync(window, {
                                    properties: ['showOverwriteConfirmation'],
                                })

                            if (filePath) {
                                const fileContents = tab.content.join('\n')
                                fs.writeFileSync(filePath, fileContents)

                                sendToRenderer(window, {
                                    type: 'update-current-tab',
                                    updatedTab: { label: filePath },
                                })
                            }
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
