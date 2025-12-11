import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { Button } from '../../components/Button';
import { theme } from '../../theme/theme';
import { authAPI } from '../../services/api';
import { loginSuccess, authFailure, authStart } from '../../store/authSlice';

interface OTPVerificationScreenProps {
    navigation: any;
    route: any;
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
    navigation,
    route,
}) => {
    const dispatch = useDispatch();
    const { userId, email, otpCode } = route.params;

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-complete en desarrollo si tenemos el código
    React.useEffect(() => {
        if (otpCode && __DEV__) {
            setCode(otpCode);
        }
    }, [otpCode]);

    const handleVerify = async () => {
        if (code.length !== 6) {
            Alert.alert('Error', 'El código debe tener 6 dígitos');
            return;
        }

        dispatch(authStart());
        setLoading(true);

        try {
            const response = await authAPI.verifyOTP(userId, code);
            const { user, professional, accessToken, refreshToken, profileComplete } = response.data;

            // Guardar tokens
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

            // El AppNavigator manejará automáticamente la navegación
            // basándose en el estado de isAuthenticated y profileComplete
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Código inválido';
            dispatch(authFailure(errorMessage));
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        // TODO: Implementar reenvío de código
        Alert.alert('Código reenviado', 'Te hemos enviado un nuevo código de verificación');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.logo}>✉️</Text>
                <Text style={styles.title}>Verificación</Text>
                <Text style={styles.subtitle}>
                    Ingresa el código de 6 dígitos que enviamos a{'\n'}
                    <Text style={styles.email}>{email}</Text>
                </Text>

                <View style={styles.codeContainer}>
                    <TextInput
                        style={styles.codeInput}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        placeholder="000000"
                        placeholderTextColor={theme.colors.textSecondary}
                        autoFocus
                    />
                </View>

                {__DEV__ && otpCode && (
                    <Text style={styles.devHint}>
                        💡 Código de desarrollo: {otpCode}
                    </Text>
                )}

                <Button
                    onPress={handleVerify}
                    loading={loading}
                    style={styles.verifyButton}
                >
                    Verificar Código
                </Button>

                <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
                    <Text style={styles.resendText}>
                        ¿No recibiste el código?{' '}
                        <Text style={styles.resendLink}>Reenviar</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>← Volver</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
    },
    logo: {
        fontSize: 72,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: theme.typography.h2.fontWeight as any,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 22,
    },
    email: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    codeContainer: {
        marginBottom: theme.spacing.lg,
    },
    codeInput: {
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 8,
        color: theme.colors.text,
    },
    devHint: {
        textAlign: 'center',
        color: theme.colors.warning,
        fontSize: theme.typography.caption.fontSize,
        marginBottom: theme.spacing.md,
        fontStyle: 'italic',
    },
    verifyButton: {
        marginBottom: theme.spacing.md,
    },
    resendButton: {
        padding: theme.spacing.sm,
    },
    resendText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: theme.typography.body.fontSize,
    },
    resendLink: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    backButton: {
        marginTop: theme.spacing.lg,
        padding: theme.spacing.sm,
    },
    backText: {
        textAlign: 'center',
        color: theme.colors.primary,
        fontSize: theme.typography.body.fontSize,
    },
});

export default OTPVerificationScreen;
