import { useAppSelector } from "@/store/hooks";

export const useReducedMotion = () =>
  Boolean(useAppSelector((state) => state.session.user?.accessibilityPreferences.reducedMotion));
