/**
 * App Entry Point
 * Main application component that renders the root navigation
 */

import { StatusBar } from 'expo-status-bar';
import RootNavigator from '@navigation/RootNavigator';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
