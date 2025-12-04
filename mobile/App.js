// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import CurrencyListScreen from "./screens/Currency/CurrencyListScreen";
import CreateCurrencyScreen from "./screens/Currency/CreateCurrencyScreen";
import EditCurrencyScreen from "./screens/Currency/EditCurrencyScreen";
import AllUsersScreen from "./screens/Users/AllUsersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Currency" component={CurrencyListScreen} />
        <Stack.Screen name="CurrencyCreate" component={CreateCurrencyScreen} />
        <Stack.Screen name="CurrencyEdit" component={EditCurrencyScreen} />
        <Stack.Screen name="Users" component={AllUsersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
