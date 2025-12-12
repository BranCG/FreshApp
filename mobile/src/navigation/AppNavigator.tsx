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
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { CompleteProfileScreen } from '../screens/professional/CompleteProfileScreen';
import { ProfessionalProfileScreen } from '../screens/professional/ProfessionalProfileScreen';
import { EditProfileMenuScreen } from '../screens/professional/EditProfileMenuScreen';
import { EditBasicInfoScreen } from '../screens/professional/EditBasicInfoScreen';
import { EditLocationScreen } from '../screens/professional/EditLocationScreen';
import { EditServicesScreen } from '../screens/professional/EditServicesScreen';
import { EditPortfolioScreen } from '../screens/professional/EditPortfolioScreen';
import { HelpScreen } from '../screens/help/HelpScreen';
import { TermsScreen } from '../screens/help/TermsScreen';
import { PrivacyScreen } from '../screens/help/PrivacyScreen';
import { FAQScreen } from '../screens/help/FAQScreen';

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
                    headerShown: false,
                    tabBarLabel: 'Servicios',
                    tabBarIcon: ({ color }) => <TabIcon emoji="🌍" color={color} />,
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'Historial',
                    tabBarIcon: ({ color }) => <TabIcon emoji="📅" color={color} />,
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
            <Tab.Screen
                name="Help"
                component={HelpScreen}
                options={{
                    tabBarLabel: 'Ayuda',
                    tabBarIcon: ({ color }) => <TabIcon emoji="❓" color={color} />,
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
                <Stack.Screen name="ProfessionalProfile" component={ProfessionalProfileScreen} />
                <Stack.Screen name="EditProfileMenu" component={EditProfileMenuScreen} />
                <Stack.Screen name="EditBasicInfo" component={EditBasicInfoScreen} />
                <Stack.Screen name="EditLocation" component={EditLocationScreen} />
                <Stack.Screen name="EditServices" component={EditServicesScreen} />
                <Stack.Screen name="EditPortfolio" component={EditPortfolioScreen} />
                <Stack.Screen name="Terms" component={TermsScreen} />
                <Stack.Screen name="Privacy" component={PrivacyScreen} />
                <Stack.Screen name="FAQ" component={FAQScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
