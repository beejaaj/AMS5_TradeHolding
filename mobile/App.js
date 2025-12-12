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
import CurrencyDetailsScreen from "./screens/Currency/CurrencyDetailsScreen";
import EditUserScreen from "./screens/EditUserSCreen";
import WalletsScreen from "./screens/wallets/WalletScreen";
import AddUserScreen from "./screens/Users/AddUserScreen";
import WalletDetailsScreen from "./screens/wallets/WalletDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="UserEdit" component={EditUserScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="CurrencyList" component={CurrencyListScreen} />
        <Stack.Screen name="CurrencyDetails" component={CurrencyDetailsScreen} />
        <Stack.Screen name="CurrencyCreate" component={CreateCurrencyScreen} />
        <Stack.Screen name="CurrencyEdit" component={EditCurrencyScreen} />
        <Stack.Screen name="AllUsers" component={AllUsersScreen} />
        <Stack.Screen name="AddUser" component={AddUserScreen} />
        <Stack.Screen name="Wallets" component={WalletsScreen} />
        <Stack.Screen name="WalletDetails" component={WalletDetailsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
