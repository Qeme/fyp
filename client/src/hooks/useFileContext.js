import { useContext } from 'react';
import { FileContext } from '../context/FileContext'

export const useFileContext = () => {
    // we grab the context object value from the value={} inside context provider component then passed it into context
    const context = useContext(FileContext);

    // however, in the dev later, when we accidentally miss put the FileContext.Provider for wrong components (outside the context tree)
    // we can check them by putting an error message
    if(!context){
        // we THROW and ERROR the message
        throw Error('useFileContext MUST be used inside an FileContextProvider') 
    }

    return context
}