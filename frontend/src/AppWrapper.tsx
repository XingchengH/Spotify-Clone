import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./components/Spinner";
import type { AppDispath, RootState } from "./store/store";
import { initializeAuth } from "./store/slices/userSlice";
const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispath>();
  const loading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return <>{children}</>;
};

export default AppWrapper;
