import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import History from './tabs/History';
import Reward from './tabs/Reward';
import ScanScreen from './ScanScreen';
import StackScreen from './StackScreen';
import SnapPicture from './tabs/SnapPicture';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          }else if (route.name === 'Live Scan') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Reward') {
            iconName = focused ? 'medal' : 'medal-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'timer' : 'timer-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
        <Tab.Screen name='Home' component={StackScreen}/>
        <Tab.Screen name='Live Scan' component={SnapPicture}/>
        <Tab.Screen name='Reward' component={Reward}/>
        <Tab.Screen name='History' component={History}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
