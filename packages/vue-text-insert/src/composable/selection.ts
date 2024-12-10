export function useSelection() {
    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);

    const getRangeEndOfset = (): number => {
        return range.endOffset;
    };

    const getCaretPrependingText = (): string => {
        return range.startContainer.textContent ?? "";
    };

    const getCaretPossition = (): [number, number] => {
        const span = document.createElement("span");
        span.appendChild(document.createTextNode("\u200b"));
        range.insertNode(span);

        const rect = span.getBoundingClientRect();

        span.remove();

        return [rect.left, rect.top];
    };

    return { selection, range, getRangeEndOfset, getCaretPrependingText, getCaretPossition };
}
