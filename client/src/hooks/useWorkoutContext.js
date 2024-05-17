import { useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext'

export const useWorkoutContext = () => {
    // we grab the context object value from the value={} inside context provider component then passed it into context
    const context = useContext(WorkoutContext);

    // however, in the dev later, when we accidentally miss put the WorkoutContext.Provider for wrong components (outside the context tree)
    // we can check them by putting an error message
    if(!context){
        // we THROW and ERROR the message
        throw Error('useWorkoutContext MUST be used inside an WorkoutContextProvider') 
    }

    return context
}
