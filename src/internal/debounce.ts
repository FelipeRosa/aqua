type DebounceContext = {
    timeoutId: NodeJS.Timeout | null
}

// This always returns void because there were some
// issues with the type system
type F<A extends any[]> = (...args: A) => void

export function debounce<A extends any[], R>(
    f: F<A>,
    waitMillis: number,
): F<A> {
    const context: DebounceContext = {
        timeoutId: null,
    }

    return (...args: A): void => {
        if (context.timeoutId !== null) {
            clearInterval(context.timeoutId)
        }

        context.timeoutId = setTimeout(() => {
            context.timeoutId = null
            f.apply(f, args)
        }, waitMillis)
    }
}
