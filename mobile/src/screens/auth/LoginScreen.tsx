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
import { useDispatch } from 'react-redux';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { theme } from '../../theme/theme';
import { api } from '../../services/api';

interface LoginScreenProps {
    navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email inválido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await api.auth.login({ email, password });

            // Store auth data in Redux
            // dispatch(setAuth(response));

            Alert.alert('Éxito', 'Has iniciado sesión correctamente');
            // Navigate to Home
            // navigation.navigate('Home');
        } catch (error: any) {
            Alert.alert(
                'Error',
                error.response?.data?.error || 'Error al iniciar sesión'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        Alert.alert('Próximamente', 'Inicio de sesión con Google estará disponible pronto');
    };

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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>🌟 FreshApp</Text>
                        <Text style={styles.subtitle}>
                            Conecta con profesionales cerca de ti
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.title}>Iniciar Sesión</Text>

                        <Input
                            label="Email"
                            placeholder="tu@email.com"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Contraseña"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors({ ...errors, password: undefined });
                            }}
                            error={errors.password}
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>

                        <Button
                            title="Iniciar Sesión"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.loginButton}
                        />

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>O continúa con</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <Button
                            title="🔍 Google"
                            onPress={handleGoogleLogin}
                            variant="outline"
                            style={styles.googleButton}
                        />

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerLink}>Regístrate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xl * 2,
        marginBottom: theme.spacing.xl,
    },
    logo: {
        fontSize: 48,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    title: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: theme.typography.h2.fontWeight as any,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.lg,
    },
    forgotPasswordText: {
        color: theme.colors.primary,
        fontSize: theme.typography.caption.fontSize,
    },
    loginButton: {
        marginBottom: theme.spacing.lg,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        marginHorizontal: theme.spacing.md,
        color: theme.colors.textSecondary,
        fontSize: theme.typography.caption.fontSize,
    },
    googleButton: {
        marginBottom: theme.spacing.lg,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    registerText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.body.fontSize,
    },
    registerLink: {
        color: theme.colors.primary,
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
    },
});
