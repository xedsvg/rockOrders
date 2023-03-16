// import {registerRootComponent} from 'expo';

// import App from './App';

// registerRootComponent(App);

import "expo/build/Expo.fx";
import { Platform } from "react-native";
import { registerRootComponent } from "expo";
import { activateKeepAwake } from "expo-keep-awake";
import { createRoot } from "react-dom/client";
import App from "./App";

if (__DEV__) {
  activateKeepAwake();
}

if (Platform.OS === "web") {
  const root = createRoot(
    document.getElementById("root") ?? document.getElementById("main")
  );
  root.render(<App />);
} else {
  registerRootComponent(App);
}