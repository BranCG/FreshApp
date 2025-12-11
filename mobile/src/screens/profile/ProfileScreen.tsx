import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { Button } from '../../components/Button';
import { theme } from '../../theme/theme';

interface ProfileScreenProps {
    navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, professional } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Limpiar tokens almacenados
                            await SecureStore.deleteItemAsync('accessToken');
                            await SecureStore.deleteItemAsync('refreshToken');

                            // Actualizar Redux
                            dispatch(logout());
                        } catch (error) {
                            console.error('Error al cerrar sesión:', error);
                            Alert.alert('Error', 'No se pudo cerrar sesión');
                        }
                    },
                },
            ]
        );
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'CLIENT':
                return 'Cliente';
            case 'PROFESSIONAL':
                return 'Profesional';
            case 'ADMIN':
                return 'Administrador';
            default:
                return role;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'BARBER':
                return 'Barbero';
            case 'TATTOO_ARTIST':
                return 'Tatuador';
            case 'MANICURIST':
                return 'Manicurista';
            default:
                return category;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header con foto de perfil */}
                <View style={styles.header}>
                    <View style={styles.photoContainer}>
                        {user?.profilePhoto ? (
                            <Image
                                source={{ uri: user.profilePhoto }}
                                style={styles.photo}
                            />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Text style={styles.photoPlaceholderText}>
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.name}>
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{getRoleLabel(user?.role || '')}</Text>
                    </View>
                </View>

                {/* Información del usuario */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Teléfono:</Text>
                        <Text style={styles.infoValue}>
                            {user?.phone || 'No especificado'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{user?.email}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Estado:</Text>
                        <Text style={[styles.infoValue, styles.verified]}>
                            {user?.isVerified ? '✓ Verificado' : '⏳ Pendiente'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Miembro desde:</Text>
                        <Text style={styles.infoValue}>
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : '-'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Dirección:</Text>
                        <Text style={styles.infoValue}>
                            {user?.address || 'No registrada'}
                        </Text>
                    </View>
                </View>

                {/* Información profesional (solo si es profesional) */}
                {user?.role === 'PROFESSIONAL' && professional && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información Profesional</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Categoría:</Text>
                            <Text style={styles.infoValue}>
                                {getCategoryLabel(professional.category)}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Calificación:</Text>
                            <Text style={styles.infoValue}>
                                ⭐ {professional.avgRating.toFixed(1)} ({professional.totalReviews} reseñas)
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Disponible:</Text>
                            <Text style={[styles.infoValue, professional.isAvailable ? styles.available : styles.unavailable]}>
                                {professional.isAvailable ? '✓ Sí' : '✗ No'}
                            </Text>
                        </View>

                        {professional.bio && (
                            <View style={styles.bioContainer}>
                                <Text style={styles.infoLabel}>Biografía:</Text>
                                <Text style={styles.bioText}>{professional.bio}</Text>
                            </View>
                        )}

                        {professional.address && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Dirección:</Text>
                                <Text style={styles.infoValue}>{professional.address}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Botón de cerrar sesión */}
                <Button
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    mode="outlined"
                >
                    Cerrar Sesión
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xl * 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    photoContainer: {
        marginBottom: theme.spacing.md,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: theme.colors.primary,
    },
    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.background,
    },
    name: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    email: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    roleBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },
    roleText: {
        color: theme.colors.background,
        fontSize: theme.typography.caption.fontSize,
        fontWeight: '600',
    },
    section: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    sectionTitle: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    infoLabel: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
        fontWeight: '400',
        flex: 1,
        textAlign: 'right',
    },
    verified: {
        color: theme.colors.success,
    },
    available: {
        color: theme.colors.success,
    },
    unavailable: {
        color: theme.colors.error,
    },
    bioContainer: {
        marginTop: theme.spacing.sm,
    },
    bioText: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
        lineHeight: 22,
        marginTop: theme.spacing.xs,
    },
    logoutButton: {
        marginTop: theme.spacing.lg,
        borderColor: theme.colors.error,
    },
});
