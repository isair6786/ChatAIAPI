import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Messages from './Messages'
import Calendar from './Calendar'


const Tab = createBottomTabNavigator();
function Chat() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chats') {
            iconName = focused
              ? 'chatbubble-ellipses'
              : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Calendario') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'indigo',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Chats" component={Messages} />
      <Tab.Screen name="Calendario" component={Calendar} />
    </Tab.Navigator>
  );
}

export default Chat;