import { createContext, useReducer } from "react";
import storeReducer, { initialStore, types } from "./storeReducer";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(storeReducer, initialStore)
    const setOpenConnect = (connect) => dispatch({type: types.setConnect, payload: connect})
    const setLogin = (logged) => dispatch({ type: types.logged, payload: logged})

    return(
        <StoreContext.Provider value={[store, setOpenConnect, { setLogin } ]}>
            {children}
        </StoreContext.Provider>
    )
}

export { StoreContext }
export default StoreProvider