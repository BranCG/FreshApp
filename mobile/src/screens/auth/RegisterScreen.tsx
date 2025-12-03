import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { theme } from '../../theme/theme';
import { authAPI } from '../../services/api';
import { useDispatch } from 'react-redux';
import { authStart, registerSuccess, authFailure } from '../../store/authSlice';

interface RegisterScreenProps {
    navigation: any;
}

type UserRole = 'CLIENT' | 'PROFESSIONAL';

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [step, setStep] = useState<'role' | 'form'>('role');
    const [role, setRole] = useState<UserRole>('CLIENT');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre es requerido';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        dispatch(authStart());
        setLoading(true);
        try {
            const response = await authAPI.register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
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
            const errorMessage = error.response?.data?.message || 'Error al registrarse';
            dispatch(authFailure(errorMessage));
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
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
                        title="Continuar"
                        onPress={() => setStep('form')}
                        style={styles.continueButton}
                    />

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
                        placeholder="Juan"
                        value={formData.firstName}
                        onChangeText={(text) => updateField('firstName', text)}
                        error={errors.firstName}
                        autoCapitalize="words"
                    />

                    <Input
                        label="Apellido"
                        placeholder="Pérez"
                        value={formData.lastName}
                        onChangeText={(text) => updateField('lastName', text)}
                        error={errors.lastName}
                        autoCapitalize="words"
                    />

                    <Input
                        label="Email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChangeText={(text) => updateField('email', text)}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Input
                        label="Teléfono (opcional)"
                        placeholder="+56 9 1234 5678"
                        value={formData.phone}
                        onChangeText={(text) => updateField('phone', text)}
                        error={errors.phone}
                        keyboardType="phone-pad"
                    />

                    <Input
                        label="Contraseña"
                        placeholder="••••••••"
                        value={formData.password}
                        onChangeText={(text) => updateField('password', text)}
                        error={errors.password}
                        secureTextEntry
                    />

                    <Input
                        label="Confirmar Contraseña"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChangeText={(text) => updateField('confirmPassword', text)}
                        error={errors.confirmPassword}
                        secureTextEntry
                    />

                    <Button
                        title="Registrarse"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.registerButton}
                    />

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
