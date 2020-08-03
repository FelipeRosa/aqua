import {
    app,
    BrowserWindow,
    dialog,
    globalShortcut,
    Menu,
    MenuItemConstructorOptions,
} from 'electron'
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

    window.loadFile('./dist/index.html').then(() => {
        debouncedWindowResized()
    })

    const appMenu: MenuItemConstructorOptions[] =
        process.platform === 'darwin' ? [{ role: 'appMenu' }] : []

    // TODO: refactor menu items code to use accelerators this way.
    window.on('focus', () => {
        globalShortcut.register('CmdOrCtrl+C', () => {
            sendToRenderer(window, {
                type: 'content-copy',
                cut: false,
            })
        })
        globalShortcut.register('CmdOrCtrl+X', () => {
            sendToRenderer(window, {
                type: 'content-copy',
                cut: true,
            })
        })
        globalShortcut.register('CmdOrCtrl+V', () => {
            sendToRenderer(window, { type: 'content-paste' })
        })
    })

    // Unregister all global shortcuts when the window loses focus. Otherwise it
    // will affect other programs' shortcuts (if they are the same).
    window.on('blur', () => {
        globalShortcut.unregisterAll()
    })

    const menu = Menu.buildFromTemplate([
        ...appMenu,
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        sendToRenderer(window, {
                            type: 'new-tab',
                            tabInitialState: {},
                        })
                    },
                },
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
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
                    accelerator: 'CmdOrCtrl+S',
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
                                    updatedTab: {
                                        label: filePath,
                                        dirty: false,
                                    },
                                })
                            }
                        })
                    },
                },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    click: () => {
                        sendToRenderer(window, {
                            type: 'content-undo-redo',
                            op: 'undo',
                        })
                    },
                },
                {
                    label: 'Redo',
                    accelerator: 'CmdOrCtrl+Shift+Z',
                    click: () => {
                        sendToRenderer(window, {
                            type: 'content-undo-redo',
                            op: 'redo',
                        })
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Cut',
                    click: () => {
                        sendToRenderer(window, {
                            type: 'content-copy',
                            cut: true,
                        })
                    },
                },
                {
                    label: 'Copy',
                    click: () => {
                        sendToRenderer(window, {
                            type: 'content-copy',
                            cut: false,
                        })
                    },
                },
                {
                    label: 'Paste',
                    click: () => {
                        sendToRenderer(window, { type: 'content-paste' })
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
