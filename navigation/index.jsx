import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import LoginScreen from "../screens/Login";
import ProfileScreen from "../screens/Profile";
import RepositoriesScreen from "../screens/Repositories";
import IssueScreen from "../screens/Issue";
import RepositoryDetailsScreen from "../screens/RepositoryDetails";
import { useAuth } from "../context/index.jsx";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Repositories"
      component={RepositoriesScreen}
      options={{
        tabBarLabel: "Repos",
        tabBarIcon: () => <Text>📁</Text>,
      }}
    />
    <Tab.Screen
      name="Issues"
      component={IssueScreen}
      options={{
        tabBarLabel: "Issues",
        tabBarIcon: () => <Text>❗️</Text>,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: () => <Text>👤</Text>,
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { authData } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!authData ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen 
              name="Main" 
              component={BottomTabs} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="RepositoryDetails" 
              component={RepositoryDetailsScreen} 
              options={({ route }) => ({ 
                title: route.params.repository.name 
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;