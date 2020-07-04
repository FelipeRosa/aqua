export default class FontService {
    public static charWidth(
        fontFamily: string,
        fontSize: number,
        s: string,
    ): number {
        const el = document.createElement('pre')
        document.body.appendChild(el)

        el.style.fontFamily = fontFamily
        el.style.fontSize = `${fontSize}px`
        el.style.height = 'auto'
        el.style.width = 'auto'
        el.style.position = 'absolute'
        el.style.whiteSpace = 'no-wrap'

        el.innerHTML = s

        const width = el.offsetWidth

        document.body.removeChild(el)

        return width
    }
}
