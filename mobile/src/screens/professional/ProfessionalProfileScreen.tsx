import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import { Text, Button as PaperButton, IconButton, Divider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { professionalAPI } from '../../services/api';
import { theme } from '../../theme/theme';
import ENV from '../../config/environment';

interface ProfessionalProfileScreenProps {
    navigation: any;
    route: any;
}

export const ProfessionalProfileScreen: React.FC<ProfessionalProfileScreenProps> = ({ navigation, route }) => {
    const { professionalId } = route.params;
    const { user } = useSelector((state: RootState) => state.auth);
    const [professional, setProfessional] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    useEffect(() => {
        loadProfessional();
    }, [professionalId]);

    const loadProfessional = async () => {
        try {
            const response = await professionalAPI.getById(professionalId);
            setProfessional(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo cargar el perfil del profesional');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/150';
        if (url.startsWith('http')) return url;
        return `${ENV.apiUrl.replace('/api', '')}${url}`;
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleContact = () => {
        // Mock contact action
        Alert.alert('Contactar', 'Función de chat/llamada próximamente.');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!professional) return null;

    const isOwner = user?.id === professional.userId;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Perfil Profesional</Text>
                {isOwner && (
                    <IconButton icon="pencil" onPress={handleEditProfile} iconColor={theme.colors.primary} />
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: getImageUrl(professional.user.profilePhoto) }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>
                        {professional.user.firstName} {professional.user.lastName}
                    </Text>
                    <Text style={styles.category}>{professional.category}</Text>

                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>⭐ {professional.avgRating.toFixed(1)}</Text>
                        <Text style={styles.reviews}>({professional.totalReviews} reseñas)</Text>
                    </View>
                </View>

                {/* Actions */}
                {!isOwner && (
                    <View style={styles.actionButtons}>
                        <PaperButton
                            mode="contained"
                            onPress={handleContact}
                            style={styles.mainButton}
                            icon="chat"
                        >
                            Contactar
                        </PaperButton>
                        <PaperButton
                            mode="outlined"
                            onPress={() => Alert.alert('Reservar', 'Próximamente')}
                            style={styles.secondaryButton}
                            icon="calendar"
                        >
                            Reservar
                        </PaperButton>
                    </View>
                )}

                <Divider style={styles.divider} />

                {/* Bio */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sobre mí</Text>
                    <Text style={styles.bioText}>{professional.bio || 'Sin biografía.'}</Text>
                </View>

                {/* Services */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Servicios y Precios</Text>
                    {professional.prices && Object.entries(professional.prices).map(([service, details]: [string, any]) => (
                        <View key={service} style={styles.serviceRow}>
                            <Text style={styles.serviceName}>{service}</Text>
                            <Text style={styles.servicePrice}>
                                ${typeof details === 'object' ? details.price : details}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ubicación</Text>
                    <Text style={styles.address}>{professional.address}</Text>
                    {/* Could add a mini MapView here later */}
                </View>

                {/* Availability */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estado</Text>
                    <Text style={[styles.status, { color: professional.isAvailable ? 'green' : 'red' }]}>
                        {professional.isAvailable ? 'Disponible ahora' : 'No disponible'}
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        paddingBottom: 20,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    category: {
        fontSize: 16,
        color: theme.colors.primary,
        marginBottom: 5,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
        color: '#FFD700',
    },
    reviews: {
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 20,
    },
    mainButton: {
        flex: 1,
    },
    secondaryButton: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    section: {
        padding: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    bioText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    serviceName: {
        fontSize: 16,
        color: '#333',
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    address: {
        fontSize: 14,
        color: '#666',
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
