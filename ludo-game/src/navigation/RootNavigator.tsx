/**
 * Root Navigator
 * Main navigation structure using React Navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/contracts/navigation.contract.simple';

// Screens
import MainMenuScreen from '@ui/screens/MainMenuScreen';
import ModeSelectionScreen from '@ui/screens/ModeSelectionScreen';
import GameScreen from '@ui/screens/GameScreen';
import WinScreen from '@ui/screens/WinScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: false, // Prevent accidental back navigation during game
        }}
      >
        <Stack.Screen name="Home" component={MainMenuScreen} />
        <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Win" component={WinScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
