export type EditorTheme = {
    backgroundColor: string
    textColor: string
    cursorColor: string
    activeTabBackgroundColor: string
    activeTabBorderColor: string
    currentLineColor: string
    tabsBorderBottom: string
    contentBackgroundColor: string
    lineNumbersColor: string
    selectionColor: string
}

export const createDefaultEditorTheme = (): EditorTheme => ({
    backgroundColor: '#1f202a',
    textColor: '#f8f8f2',
    cursorColor: '#ffb86c',
    activeTabBackgroundColor: '#44475a',
    activeTabBorderColor: '#bd93f9',
    tabsBorderBottom: '#44475a',
    currentLineColor: 'rgba(68,71,90,0.2)',
    contentBackgroundColor: '#282a36',
    lineNumbersColor: '#727795',
    selectionColor: 'rgba(68,71,90,0.7)',
})
