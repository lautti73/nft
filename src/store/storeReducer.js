const types = {
    setConnect: 'set - connect',
    logged: 'login - bool'
}

const initialStore = {
    openConnect: false,
    logged: false
}

const storeReducer = (state, action) => {
    switch(action.type) {
        case types.setConnect:
            return {
                ...state,
                openConnect: action.payload
            }
        case types.logged:
            return {
                ...state,
                logged: action.payload
            }
        default:
            return state;
    }
}

export {initialStore, types}
export default storeReducer