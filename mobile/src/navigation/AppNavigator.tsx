import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { CompleteProfileScreen } from '../screens/professional/CompleteProfileScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    const { isAuthenticated, user, profileComplete } = useSelector((state: RootState) => state.auth);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    user?.role === 'PROFESSIONAL' && !profileComplete ? (
                        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
                    ) : (
                        <>
                            <Stack.Screen name="Main" component={HomeScreen} />
                        </>
                    )
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
