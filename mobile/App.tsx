import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme, configureFonts } from 'react-native-paper';
import { theme } from './src/theme/theme';

const fontConfig = {
    fontFamily: 'Inter_400Regular',
};

const paperTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        error: theme.colors.error,
        background: theme.colors.background,
        surface: theme.colors.surface,
    },
    fonts: configureFonts({ config: fontConfig }),
};

export default function App() {
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <Provider store={store}>
            <PaperProvider theme={paperTheme}>
                <AppNavigator />
                <StatusBar style="auto" />
            </PaperProvider>
        </Provider>
    );
}
