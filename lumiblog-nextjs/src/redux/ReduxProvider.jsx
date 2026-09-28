"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect, useRef } from "react";
import { setUser } from "./slices/authSlice.js";
import { useDispatch } from "react-redux";
import api from "@/axios.js";



function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMe = async () => {

      try {
        const response = await api.get(`/api/user/me`, {
          withCredentials: true,
        });
        if (response.data.success) {

          dispatch(setUser(response.data.user));
        }
        else {
          // dispatch(setUser(null))
        }

      } catch {
        // dispatch(setUser(null));
      } finally {
        // dispatch(setUser(null));

      }
    };

    fetchMe();
  }, [dispatch]);

  return children;
}



export default function ReduxProvider({ children }) {
  return <Provider store={store}><AuthInitializer>{children}</AuthInitializer></Provider>;
}
