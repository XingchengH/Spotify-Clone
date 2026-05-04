import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./components/Spinner";
import type { AppDispath, RootState } from "./store/store";
import { initializeAuth } from "./store/slices/userSlice";
import { updateApiToken } from "./lib/axios";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispath>();
  const loading = useSelector((state: RootState) => state.user.loading);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    updateApiToken(token);
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return <>{children}</>;
};

export default AppWrapper;
