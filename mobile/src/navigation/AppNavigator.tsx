import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { CompleteProfileScreen } from '../screens/professional/CompleteProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente helper para los iconos
const TabIcon = ({ emoji, color }: { emoji: string; color: string }) => (
    <Text style={{ fontSize: 24, opacity: color === '#7C3AED' ? 1 : 0.5 }}>{emoji}</Text>
);

// Tab Navigator para usuarios autenticados
const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#7C3AED',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Servicios',
                    tabBarIcon: ({ color }) => <TabIcon emoji="🌍" color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    const { isAuthenticated, user, profileComplete } = useSelector((state: RootState) => state.auth);

    return (
        <NavigationContainer key={isAuthenticated ? 'authenticated' : 'unauthenticated'}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    user?.role === 'PROFESSIONAL' && !profileComplete ? (
                        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
                    ) : (
                        <Stack.Screen name="Main" component={MainTabs} />
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
