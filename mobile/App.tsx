import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
            <StatusBar style="auto" />
        </Provider>
    );
}
