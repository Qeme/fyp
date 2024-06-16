import { useContext } from 'react';
import { UserContext } from '../context/UserContext'

export const useUserContext = () => {
    // we grab the context object value from the value={} inside context provider component then passed it into context
    const context = useContext(UserContext);

    // however, in the dev later, when we accidentally miss put the UserContext.Provider for wrong components (outside the context tree)
    // we can check them by putting an error message
    if(!context){
        // we THROW and ERROR the message
        throw Error('useUserContext MUST be used inside an UserContextProvider') 
    }

    return context
}