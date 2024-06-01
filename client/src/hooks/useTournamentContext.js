import { useContext } from 'react';
import { TournamentContext } from '../context/TournamentContext'

export const useTournamentContext = () => {
    // we grab the context object value from the value={} inside context provider component then passed it into context
    const context = useContext(TournamentContext);

    // however, in the dev later, when we accidentally miss put the TournamentContext.Provider for wrong components (outside the context tree)
    // we can check them by putting an error message
    if(!context){
        // we THROW and ERROR the message
        throw Error('useTournamentContext MUST be used inside an TournamentContextProvider') 
    }

    return context
}
