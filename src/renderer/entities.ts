export type Editor = {
    font: Font
    tabs: Tab[]
    activeTabIndex: number
    size: Size
}

export type Tab = {
    label: string | null
    content: Content
    cursor: CursorWithSelection
    scroll: Scroll
    font: Font
    size: Size
}

export type Cursor = {
    row: number
    column: number
}

export type CursorWithSelection = Cursor & {
    selectionStartOrEnd: Cursor | null
}

export type Content = string[]

export type Scroll = {
    x: number
    y: number
}

export type Selection = {
    start: Cursor
    end: Cursor
}

export type Font = {
    family: string
    size: number
    lineHeight: number
}

export type StringMetrics = {
    width: number
    lineHeight: number
}

export type Size = {
    width: number
    height: number
}

export type Point = {
    x: number
    y: number
}

export type AppState = {
    themes: {
        editor: EditorTheme
    }
    editor: Editor
}

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
