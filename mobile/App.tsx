import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { theme } from './src/theme';

export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <PaperProvider theme={theme}>
                    <NavigationContainer>
                        <StatusBar style="auto" />
                        <RootNavigator />
                    </NavigationContainer>
                </PaperProvider>
            </SafeAreaProvider>
        </Provider>
    );
}
