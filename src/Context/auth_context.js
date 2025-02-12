import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import auth_reducer from "../Reducer/auth_reducer";
import Notification from "../Utils/Notification";

import {
  REGISTER_CUSTOMER_BEGIN,
  REGISTER_CUSTOMER_SUCCESS,
  REGISTER_CUSTOMER_FAIL,
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_BEGIN,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_OTP_BEGIN,
  FORGOT_PASSWORD_OTP_SUCCESS,
  FORGOT_PASSWORD_OTP_FAIL,
} from "../Actions";

import {
  ACCEPT_HEADER,
  change_password,
  forgot_password,
  login,
  register,
} from "../Utils/Constant";
// import { useMallContext } from "./mall_context";

const initialState = {
  register_customer_loading: false,
  forgot_password_loading: false,
  forgot_password_otp_loading: false,
  register_customer_data: [],
  login_loading: false,
  login_data: {},
  is_token: "",
};

const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auth_reducer, initialState);
  //   const { is_login, is_token } = useMallContext();

  //   Register customer

  const RegisterCustomer = async (params) => {
    const url = "http://192.168.1.21:8069/signup_ecom"; // Fixed missing const
    dispatch({ type: REGISTER_CUSTOMER_BEGIN });
    try {
      const response = await axios.post(register, params, {
        headers: {
          Accept: ACCEPT_HEADER,
          //   Authorization: "Bearer " + is_token,
        },
      });
      const registercustomerdata = response.data;

      if (registercustomerdata.success == 1) {
        dispatch({
          type: REGISTER_CUSTOMER_SUCCESS,
          payload: registercustomerdata,
        });
        Notification("success", "Success!", response.data.message);
      } else if (registercustomerdata.success == 0) {
        Notification("error", "Error!", registercustomerdata.message);
        // alert(response.data.message);
        dispatch({ type: REGISTER_CUSTOMER_FAIL });
      } else {
        Notification("error", "Error!", response.data.message);
        //    alert(response.data.message);
        dispatch({ type: REGISTER_CUSTOMER_FAIL });
      }
      return response.data;
    } catch (error) {
      dispatch({ type: REGISTER_CUSTOMER_FAIL });
      //   ("error", error);
      console.log("err11", error);
    }
  };

  // login mall Registore api
  //   const setLogin = async (params) => {
  //     url="http://192.168.1.21:8069/login_ecom"
  //     dispatch({ type: LOGIN_BEGIN });
  //     try {
  //       const response = await axios.post(url, params, {
  //         headers: {
  //         //   Accept: ACCEPT_HEADER,
  //         },
  //       });
  //       const logindata = response.data;

  //       if (logindata.success == 1) {
  //         // localStorage.setItem("cusimg", response.data.user.store_logo_path);

  //         console.log("login data---login",logindata);
  //         dispatch({ type: LOGIN_SUCCESS, payload: logindata });
  //         localStorage.setItem("is_login", JSON.stringify(true));
  //         localStorage.setItem("logindata", JSON.stringify(logindata));
  //         localStorage.setItem("is_token", JSON.stringify(logindata.token));
  //         localStorage.setItem("is_id", JSON.stringify(logindata.user.id));
  //         // if(logindata.user.role == 6 ||logindata.user.role ==='6' ){
  //         //   localStorage.setItem(
  //         //     "cusimg",
  //         //     JSON.stringify(logindata.user.store_logo_path)
  //         //   );
  //         // }else if(logindata.user.role == 4 ||logindata.user.role ==='4' ){
  //         //   localStorage.setItem(
  //         //     "cusimg",
  //         //     JSON.stringify(logindata.user.cus_profile_path)
  //         //   );

  //         //   localStorage.setItem(
  //         //     "cuslocation",
  //         //     JSON.stringify(logindata.user.location)
  //         //   );
  //         // }else if(logindata.user.role == 3 ||logindata.user.role ==='3' ){

  //         //   localStorage.setItem(
  //         //     "cusimg",
  //         //     JSON.stringify(logindata.user.store_logo_path)
  //         //   );
  //         //   localStorage.setItem(
  //         //     "iseatery",
  //         //     JSON.stringify(logindata.user.is_eatery)
  //         //   );

  //         // }else if(logindata.user.role == 2 ||logindata.user.role ==='2' ){
  //         //   localStorage.setItem(
  //         //     "cusimg",
  //         //     JSON.stringify(logindata.user.store_logo_path)
  //         //   );
  //         // }else {
  //         //   null
  //         // }

  //         // localStorage.setItem("role", JSON.stringify(logindata.user.role));

  //       } else {
  //         alert(logindata.message);
  //         dispatch({ type: LOGIN_FAIL });

  //       }
  //       return response.data;
  //     } catch (error) {
  //       dispatch({ type: LOGIN_FAIL });
  //       localStorage.setItem("is_login", JSON.stringify(false));

  //       console.log("login error",error);

  //     }
  //   };

  const setLogin = async (params) => {
    const url = "http://192.168.1.21:8069/login_ecom"; // Fixed missing const
    dispatch({ type: LOGIN_BEGIN });

    try {
      const response = await axios.post(login, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });

      const logindata = response.data;
      console.log("login data---login", logindata);
      if (logindata.success == 1) {
        dispatch({ type: LOGIN_SUCCESS, payload: logindata });

        localStorage.setItem("is_login", JSON.stringify(true));
        localStorage.setItem("logindata", JSON.stringify(logindata));
        localStorage.setItem("is_token", JSON.stringify(logindata.token));
        localStorage.setItem("is_id", JSON.stringify(logindata.user.id));
        localStorage.setItem("is_user", JSON.stringify(logindata.user));
        localStorage.setItem("is_role", JSON.stringify(logindata.user.role));
      } else {
        alert(logindata.message);
        dispatch({ type: LOGIN_FAIL });
      }

      return logindata; // Return the login data
    } catch (error) {
      dispatch({ type: LOGIN_FAIL });
      localStorage.setItem("is_login", JSON.stringify(false));
      console.error("Login error:", error);

      return null; // Explicitly return null on error
    }
  };

  const forgotPassword = async (params) => {
    const url = "http://192.168.1.21:8069/forget_pasword_ecom"; // Fixed missing const

    dispatch({ type: FORGOT_PASSWORD_BEGIN });
    try {
      const response = await axios.post(forgot_password, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      const logindata = response.data;

      if (logindata.success == 1) {
        // localStorage.setItem("cusimg", response.data.user.store_logo_path);
        Notification("success", "Success!", response.data.message);
        console.log("forgot password response", logindata);
        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: logindata });
      } else {
        alert(logindata.message);
      }
      return response.data;
    } catch (error) {
      dispatch({ type: FORGOT_PASSWORD_FAIL });
      console.log("forgot password error", error);
      console.log("error11", error);
    }
  };

  const forgotPasswordOtp = async (params) => {
    const url = "http://192.168.1.21:8069/forget_pasword_ecom"; // Fixed missing const

    dispatch({ type: FORGOT_PASSWORD_OTP_BEGIN });
    try {
      const response = await axios.post(change_password, params, {
        headers: {
          Accept: ACCEPT_HEADER,
        },
      });
      const logindata = response.data;

      if (logindata.success == 1) {
        // localStorage.setItem("cusimg", response.data.user.store_logo_path);
        Notification("success", "Success!", response.data.message);
        console.log("forgot password response", logindata);
        dispatch({ type: FORGOT_PASSWORD_OTP_SUCCESS, payload: logindata });
      } else {
        alert(logindata.message);
      }
      return response.data;
    } catch (error) {
      dispatch({ type: FORGOT_PASSWORD_OTP_FAIL });
      console.log("forgot password error", error);
      console.log("error11", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setLogin,
        RegisterCustomer,
        forgotPassword,
        forgotPasswordOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
