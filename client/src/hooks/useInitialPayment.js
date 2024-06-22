import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { usePaymentContext } from "./usePaymentContext";

export const useInitialPayment = () => {
  const { payments, dispatch } = usePaymentContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/payments", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json()

      if(response.ok){
        dispatch({type: "SET_PAYMENTS", payload: json})
      }
    };

    if(user){
        fetchInit();
    }
  },[dispatch, user]);

  // we then return these 2 things to be used for context
  return { payments, dispatch };
};
