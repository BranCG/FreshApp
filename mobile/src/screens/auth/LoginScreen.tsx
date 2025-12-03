import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as SecureStore from 'expo-secure-store';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { authStart, loginSuccess, authFailure } from '../../store/authSlice';
import { RootState } from '../../store';
import { theme } from '../../theme/theme';
import { authAPI } from '../../services/api';

const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email es requerido'),
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña es requerida'),
}).required();

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const { colors } = useTheme();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: any) => {
        dispatch(authStart());
        try {
            const response = await authAPI.login(data.email, data.password);
            const { user, professional, accessToken, refreshToken, profileComplete } = response.data;

            // Guardar tokens en SecureStore
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            // Actualizar Redux
            dispatch(loginSuccess({
                user,
                professional,
                token: accessToken,
                refreshToken,
                profileComplete,
            }));

            // Navegar según rol y estado del perfil
            if (user.role === 'PROFESSIONAL' && !profileComplete) {
                navigation.replace('CompleteProfile');
            } else {
                navigation.replace('Main');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
            dispatch(authFailure(errorMessage));
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="displayMedium" style={styles.title}>FreshApp</Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>Bienvenido de nuevo</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        name="email"
                        control={control}
                        error={errors.email?.message}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon="email"
                    />

                    <Input
                        label="Contraseña"
                        name="password"
                        control={control}
                        error={errors.password?.message}
                        secureTextEntry
                        leftIcon="lock"
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        style={styles.button}
                    >
                        Iniciar Sesión
                    </Button>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium">¿No tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                Regístrate
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        color: theme.colors.textSecondary,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 16,
        marginBottom: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default LoginScreen;
