import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { store } from "@/store";

export const AppProviders = ({ children }: PropsWithChildren) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {children}
      </SafeAreaProvider>
    </Provider>
  </GestureHandlerRootView>
);
