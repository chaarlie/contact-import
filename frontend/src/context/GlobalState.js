import React, { createContext, useReducer } from 'react';

const initialState = {
    loggedInUser: '',
    token: '',
    setToken: () => {},
    loginUser: () => {},
    logoutUser: () => {}
}

export const GlobalContext = createContext(initialState);

const AppReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER': 
            return {
                ...state,
                loggedInUser: action.payload
            }
        case 'SET_TOKEN': 
            return {
                ...state,
                token: action.payload
            }

        case 'LOGOUT_USER': 
            return {
                ...state,
                loggedInUser: ''
            }
        default:
            return { state }
    }
}

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    const loginUser = user => {
        dispatch({ 
            type: 'LOGIN_USER',
            payload: user
        })
    }

    const setToken = token => {
        dispatch({ 
            type: 'SET_TOKEN',
            payload: token
        })
    }


    const logoutUser = () => { 
        dispatch({ 
            type: 'LOGOUT_USER'
        })
    }

    return (
        <GlobalContext.Provider value={{
            loggedInUser: state.loggedInUser,
            token: state.token,
            loginUser,
            logoutUser,
            setToken
        }}>
            {children}
        </GlobalContext.Provider>
        )
}