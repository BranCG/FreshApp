import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { theme } from '../../theme/theme';
import { authAPI } from '../../services/api';
import { authStart, registerSuccess, authFailure } from '../../store/authSlice';

interface RegisterScreenProps {
    navigation: any;
}

type UserRole = 'CLIENT' | 'PROFESSIONAL';

const schema = yup.object({
    firstName: yup.string().required('El nombre es requerido'),
    lastName: yup.string().required('El apellido es requerido'),
    email: yup.string().email('Email inválido').required('El email es requerido'),
    phone: yup.string().optional(),
    password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirmar contraseña es requerido'),
}).required();

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [step, setStep] = useState<'role' | 'form'>('role');
    const [role, setRole] = useState<UserRole>('CLIENT');
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: any) => {
        dispatch(authStart());
        setLoading(true);
        try {
            const response = await authAPI.register({
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone || undefined,
                role,
            });

            const { user, profileComplete, otpCode } = response.data;

            // Guardar user en Redux
            dispatch(registerSuccess({ user, profileComplete }));

            // Navegar a OTP verification
            navigation.navigate('OTPVerification', {
                userId: user.id,
                email: user.email,
                otpCode, // Solo en desarrollo
            });
        } catch (error: any) {
            console.error('Registration Error:', error);
            if (error.response) {
                console.error('Error Data:', error.response.data);
                console.error('Error Status:', error.response.status);
            }
            const errorMessage = error.response?.data?.message || error.message || 'Error al registrarse';
            dispatch(authFailure(errorMessage));
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'role') {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.logo}>🌟</Text>
                    <Text style={styles.title}>¿Cómo deseas usar FreshApp?</Text>
                    <Text style={styles.subtitle}>
                        Selecciona el tipo de cuenta que mejor se ajuste a tus necesidades
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                            role === 'CLIENT' && styles.roleCardSelected,
                        ]}
                        onPress={() => setRole('CLIENT')}
                    >
                        <Text style={styles.roleIcon}>👤</Text>
                        <Text style={styles.roleTitle}>Soy Cliente</Text>
                        <Text style={styles.roleDescription}>
                            Busco profesionales para servicios a domicilio
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                            role === 'PROFESSIONAL' && styles.roleCardSelected,
                        ]}
                        onPress={() => setRole('PROFESSIONAL')}
                    >
                        <Text style={styles.roleIcon}>💼</Text>
                        <Text style={styles.roleTitle}>Soy Profesional</Text>
                        <Text style={styles.roleDescription}>
                            Ofrezco servicios a domicilio (barbería, tatuajes, manicura)
                        </Text>
                    </TouchableOpacity>

                    <Button
                        onPress={() => setStep('form')}
                        style={styles.continueButton}
                    >
                        Continuar
                    </Button>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Inicia Sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setStep('role')}
                    >
                        <Text style={styles.backButtonText}>← Atrás</Text>
                    </TouchableOpacity>

                    <Text style={styles.formTitle}>
                        {role === 'CLIENT' ? 'Registro de Cliente' : 'Registro de Profesional'}
                    </Text>

                    <Input
                        label="Nombre"
                        name="firstName"
                        control={control}
                        placeholder="Juan"
                        error={errors.firstName?.message}
                        autoCapitalize="words"
                    />

                    <Input
                        label="Apellido"
                        name="lastName"
                        control={control}
                        placeholder="Pérez"
                        error={errors.lastName?.message}
                        autoCapitalize="words"
                    />

                    <Input
                        label="Email"
                        name="email"
                        control={control}
                        placeholder="tu@email.com"
                        error={errors.email?.message}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Input
                        label="Teléfono (opcional)"
                        name="phone"
                        control={control}
                        placeholder="+56 9 1234 5678"
                        error={errors.phone?.message}
                        keyboardType="phone-pad"
                    />

                    <Input
                        label="Contraseña"
                        name="password"
                        control={control}
                        placeholder="••••••••"
                        error={errors.password?.message}
                        secureTextEntry
                    />

                    <Input
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        control={control}
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        secureTextEntry
                    />

                    <Button
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        style={styles.registerButton}
                    >
                        Registrarse
                    </Button>

                    <Text style={styles.termsText}>
                        Al registrarte, aceptas nuestros{' '}
                        <Text style={styles.termsLink}>Términos y Condiciones</Text> y{' '}
                        <Text style={styles.termsLink}>Política de Privacidad</Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
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
    },
    roleCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        borderWidth: 2,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    roleCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}15`,
    },
    roleIcon: {
        fontSize: 48,
        marginBottom: theme.spacing.sm,
    },
    roleTitle: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    roleDescription: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    continueButton: {
        marginTop: theme.spacing.lg,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },
    loginText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.body.fontSize,
    },
    loginLink: {
        color: theme.colors.primary,
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
    },
    backButton: {
        marginBottom: theme.spacing.md,
    },
    backButtonText: {
        color: theme.colors.primary,
        fontSize: theme.typography.body.fontSize,
    },
    formTitle: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: theme.typography.h2.fontWeight as any,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    registerButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    termsText: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    termsLink: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
