import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'

export const useAuthContext = () => {
    // we grab the context object value from the value={} inside context provider component then passed it into context
    const context = useContext(AuthContext);

    // however, in the dev later, when we accidentally miss put the AuthContext.Provider for wrong components (outside the context tree)
    // we can check them by putting an error message
    if(!context){
        // we THROW and ERROR the message
        throw Error('useAuthContext MUST be used inside an AuthContextProvider') 
    }

    return context
}