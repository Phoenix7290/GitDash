import React from "react";
import AppNavigator from "./navigation/index";
import { AuthProvider } from "./context/index.jsx";

const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;
