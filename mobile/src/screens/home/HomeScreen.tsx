import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    FlatList,
    Dimensions,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { theme } from '../../theme/theme';
import { CategoryFilter } from '../../components/CategoryFilter';
import { ProfessionalCard } from '../../components/ProfessionalCard';
// import { api } from '../../services/api'; // TODO: Implement when API is ready

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const mapRef = useRef<MapView>(null);

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<any>(null);

    const DEFAULT_REGION: Region = {
        latitude: -33.4489, // Santiago, Chile
        longitude: -70.6693,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    useEffect(() => {
        getLocationPermission();
    }, []);

    useEffect(() => {
        if (location) {
            fetchNearbyProfessionals();
        }
    }, [location, selectedCategory]);

    const getLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permiso Requerido',
                    'Necesitamos acceso a tu ubicación para mostrarte profesionales cercanos'
                );
                setLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLocation(currentLocation);
            setLoading(false);

            // Center map on user location
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
            }
        } catch (error) {
            console.error('Error getting location:', error);
            setLoading(false);
            Alert.alert('Error', 'No pudimos obtener tu ubicación');
        }
    };

    const fetchNearbyProfessionals = async () => {
        if (!location) return;

        try {
            // TODO: Implement API call when backend is ready
            // const response = await api.professionals.findNearby(params);
            // setProfessionals(response.professionals || []);

            // For now, use mock data
            setProfessionals(getMockProfessionals(location));
        } catch (error) {
            console.error('Error fetching professionals:', error);
            setProfessionals(getMockProfessionals(location));
        }
    };

    const getMockProfessionals = (userLocation: Location.LocationObject) => {
        const mockData = [
            {
                id: '1',
                user: { firstName: 'Carlos', lastName: 'Rojas', profilePhoto: null },
                category: 'BARBER',
                avgRating: 4.8,
                totalReviews: 156,
                prices: { haircut: 12000, beard: 8000 },
                isAvailable: true,
                latitude: userLocation.coords.latitude + 0.01,
                longitude: userLocation.coords.longitude + 0.01,
            },
            {
                id: '2',
                user: { firstName: 'María', lastName: 'González', profilePhoto: null },
                category: 'MANICURIST',
                avgRating: 4.9,
                totalReviews: 203,
                prices: { manicure: 15000, pedicure: 18000 },
                isAvailable: true,
                latitude: userLocation.coords.latitude - 0.015,
                longitude: userLocation.coords.longitude + 0.008,
            },
            {
                id: '3',
                user: { firstName: 'Diego', lastName: 'Silva', profilePhoto: null },
                category: 'TATTOO_ARTIST',
                avgRating: 4.7,
                totalReviews: 89,
                prices: { small: 30000, medium: 60000 },
                isAvailable: false,
                latitude: userLocation.coords.latitude + 0.02,
                longitude: userLocation.coords.longitude - 0.01,
            },
        ];

        return selectedCategory
            ? mockData.filter(p => p.category === selectedCategory)
            : mockData;
    };

    const centerOnUser = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    };

    const handleMarkerPress = (professional: any) => {
        setSelectedProfessional(professional);

        // Center map on selected marker
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: professional.latitude,
                longitude: professional.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    };

    const handleProfessionalPress = (professional: any) => {
        // Navigate to professional detail
        // navigation.navigate('ProfessionalDetail', { professionalId: professional.id });
        Alert.alert('Ver Perfil', `Navegar al perfil de ${professional.user.firstName}`);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
            </View>
        );
    }

    const currentLocation = location || {
        coords: {
            latitude: DEFAULT_REGION.latitude,
            longitude: DEFAULT_REGION.longitude,
        },
    };

    return (
        <View style={styles.container}>
            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={DEFAULT_REGION}
                    showsUserLocation
                    showsMyLocationButton={false}
                    loadingEnabled
                >
                    {/* Professional Markers */}
                    {professionals.map((professional) => (
                        <Marker
                            key={professional.id}
                            coordinate={{
                                latitude: professional.latitude,
                                longitude: professional.longitude,
                            }}
                            onPress={() => handleMarkerPress(professional)}
                        >
                            <View style={styles.markerContainer}>
                                <Text style={styles.markerText}>
                                    {professional.category === 'BARBER' && '💈'}
                                    {professional.category === 'TATTOO_ARTIST' && '🎨'}
                                    {professional.category === 'MANICURIST' && '💅'}
                                </Text>
                            </View>
                        </Marker>
                    ))}
                </MapView>

                {/* Center on User Button */}
                <TouchableOpacity
                    style={styles.centerButton}
                    onPress={centerOnUser}
                    activeOpacity={0.8}
                >
                    <Text style={styles.centerButtonText}>📍</Text>
                </TouchableOpacity>

                {/* Category Filter */}
                <View style={styles.filterContainer}>
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </View>
            </View>

            {/* Professionals List */}
            <View style={styles.listContainer}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Profesionales Cercanos</Text>
                    <Text style={styles.listCount}>
                        {professionals.length} {professionals.length === 1 ? 'profesional' : 'profesionales'}
                    </Text>
                </View>

                <FlatList
                    data={professionals}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ProfessionalCard
                            professional={item}
                            onPress={() => handleProfessionalPress(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>😔</Text>
                            <Text style={styles.emptyTitle}>No hay profesionales cerca</Text>
                            <Text style={styles.emptySubtitle}>
                                Intenta cambiar el filtro o ampliar el área de búsqueda
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
    },
    mapContainer: {
        height: MAP_HEIGHT,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        ...theme.shadows.md,
    },
    markerText: {
        fontSize: 24,
    },
    centerButton: {
        position: 'absolute',
        right: theme.spacing.md,
        bottom: theme.spacing.xl,
        backgroundColor: theme.colors.background,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    centerButtonText: {
        fontSize: 24,
    },
    filterContainer: {
        position: 'absolute',
        top: theme.spacing.md,
        left: 0,
        right: 0,
    },
    listContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    listTitle: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: '700',
        color: theme.colors.text,
    },
    listCount: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
    },
    listContent: {
        paddingBottom: theme.spacing.xl,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl * 2,
        paddingHorizontal: theme.spacing.lg,
    },
    emptyText: {
        fontSize: 64,
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
