import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScanScreen from './ScanScreen';
import Home from './tabs/Home';

const Stack = createNativeStackNavigator();

const StackScreen = () => {
  return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="ScanScreen" component={ScanScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
  )
}

export default StackScreen