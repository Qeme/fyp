import { useContext } from 'react';
import { TeamContext } from '../context/TeamContext'

export const useTeamContext = () => {
    // we grab the context object value from the value={} inside context provider component then passed it into context
    const context = useContext(TeamContext);

    // however, in the dev later, when we accidentally miss put the TeamContext.Provider for wrong components (outside the context tree)
    // we can check them by putting an error message
    if(!context){
        // we THROW and ERROR the message
        throw Error('useTeamContext MUST be used inside an TeamContextProvider') 
    }

    return context
}