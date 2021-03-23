export function handle(state, action) {
    const input = action.input
    const caller = action.caller

    if (input.function === 'tag') {
        const temp = [...state.tags]
        const pending = SmartWeave.transaction.tags
        temp.push(pending)

        state.tags = temp

        return { state }
    }
}
