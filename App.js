// In App.js in a new project

import * as React from 'react';
import {  Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/Login/LoginScreen'
import SignUpScreen from './screens/Login/SignUpScreen'
import Chat from './screens/Chat/Chat'
import SuccessScreen from './screens/Login/SuccessSignUp';
import { useEffect } from 'react';
import LoginWeb from './screens/Login/LoginWebScreen';
import AddAccountWeb from './screens/Login/AddAccountCalendar';

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    // Escuchar cuando la aplicación se abra mediante un deep link
    const handleDeepLink = async (event) => {
      const url = new URL(event.url);
      //console.log('url',url)

    };

    // Agrega el listener para los deep links
    Linking.addEventListener('url', handleDeepLink);

    // Remueve el listener al desmontar el componente
    return () => {
      Linking.removeAllListeners('url');
    };
    
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="LoginWeb" component={LoginWeb} />
        <Stack.Screen name="AddAccountWeb" component={AddAccountWeb} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
