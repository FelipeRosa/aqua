import { Font, StringMetrics } from '../entities'

export const createDefaultFont = (): Font => {
    const font: Font = {
        family: 'Fira Code',
        size: 16,
        lineHeight: 0,
    }

    font.lineHeight = stringMetrics(font, 'g').lineHeight

    return font
}

export const stringMetrics = (font: Font, s: string): StringMetrics => {
    const el = document.createElement('pre')
    document.body.appendChild(el)

    el.style.fontFamily = font.family
    el.style.fontSize = `${font.size}px`
    el.style.height = 'auto'
    el.style.width = 'auto'
    el.style.position = 'absolute'
    el.style.whiteSpace = 'no-wrap'

    // Use innerText instead of innerHTML or we would have to escape s.
    el.innerText = s

    const width = el.offsetWidth
    const lineHeight = el.offsetHeight

    document.body.removeChild(el)

    return {
        width,
        lineHeight,
    }
}