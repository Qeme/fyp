import { useContext } from 'react';
import { PaymentContext } from '../context/PaymentContext'

export const usePaymentContext = () => {
    // we grab the context object value from the value={} inside context provider component then passed it into context
    const context = useContext(PaymentContext);

    // however, in the dev later, when we accidentally miss put the PaymentContext.Provider for wrong components (outside the context tree)
    // we can check them by putting an error message
    if(!context){
        // we THROW and ERROR the message
        throw Error('usePaymentContext MUST be used inside an PaymentContextProvider') 
    }

    return context
}