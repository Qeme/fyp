import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext funtion
  export it as well so it can be used by the custom hook usePaymentContext
*/
export const PaymentContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (payments in this case)
  action is {{type: 'SET_payments', payload: payments / book: { title: A , author: B }}} 
*/
export const paymentReducer = (state, action) => {
  switch (action.type) {
    case "SET_PAYMENTS":
      return {
        ...state, //please do not forget to spread the state
        payments: action.payload, //this part basically SETTING UP the payments value
      }; 
    case "UPDATE_PAYMENT":
      return {
        ...state,
        payments: [action.payload, ...state.payments], // ...state.payments is basically set up the current value (if not mentioned, it will completely replaced the original one)
      };
    case "REMOVE_PAYMENT":
      return {
        ...state,
        payments: state.payments.filter((payment) => payment._id !== action.payload._id),  // the payments value will be replaced by using filter->only take the payments that id is not same with the id that is being
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (PaymentContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const PaymentContextProvider = ({ children }) => {

  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(paymentReducer, { payments: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <PaymentContext.Provider value={{ ...state, dispatch }}>
      {children} 
    </PaymentContext.Provider>
  );
};
