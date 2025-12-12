import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateProfile } from '../../store/authSlice';
import { userAPI, professionalAPI } from '../../services/api';
import {
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    FlatList,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import ENV from '../../config/environment'; // Import Env
import { theme } from '../../theme/theme';
import { useFocusEffect } from '@react-navigation/native';
import { CategoryFilter } from '../../components/CategoryFilter';
import { ProfessionalCard } from '../../components/ProfessionalCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_HEIGHT = SCREEN_HEIGHT * 0.5;

interface HomeScreenProps {
    navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const mapRef = useRef<MapView>(null);
    const { user, professional } = useSelector((state: RootState) => state.auth);

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
    const [updatingLocation, setUpdatingLocation] = useState(false);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [manualAddress, setManualAddress] = useState('');

    const categories = [
        { id: 'BARBER', name: 'Barbería', icon: 'cut' },
        { id: 'TATTOO_ARTIST', name: 'Tatuajes', icon: 'palette' },
        { id: 'MANICURIST', name: 'Manicura', icon: 'hand' },
    ];

    const DEFAULT_REGION: Region = {
        latitude: -33.4489, // Santiago, Chile
        longitude: -70.6693,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    useEffect(() => {
        const initLocation = async () => {
            // Si el usuario tiene ubicación guardada en su perfil, usarla
            if (user?.latitude && user?.longitude) {
                const userLoc = {
                    coords: {
                        latitude: user.latitude,
                        longitude: user.longitude,
                        altitude: null,
                        accuracy: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                    },
                    timestamp: Date.now(),
                } as Location.LocationObject;

                setLocation(userLoc);
                setLoading(false);

                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: user.latitude!,
                        longitude: user.longitude!,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    });
                }
            } else {
                // Si no tiene ubicación guardada, intentar obtener GPS
                getLocationPermission();
            }
        };

        if (!location) {
            initLocation();
        }
    }, [user?.latitude, user?.longitude]);

    useFocusEffect(
        useCallback(() => {
            if (location) {
                fetchNearbyProfessionals();
            }
        }, [location, selectedCategory])
    );

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

        setLoading(true);
        try {
            const params = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                radius: 10000, // 10 km
                category: selectedCategory || undefined
            };

            const response = await professionalAPI.findNearby(params);

            const mappedProfessionals = response.data.professionals.map((p: any) => {
                // Calcular precio mínimo
                let minPrice = 0;
                if (p.prices) {
                    const prices = typeof p.prices === 'string' ? JSON.parse(p.prices) : p.prices;
                    // prices puede ser { servicio: { price: 100 } } o { servicio: 100 }
                    // Normalizar
                    const values = Object.values(prices).map((val: any) => {
                        if (typeof val === 'object' && val.price) return Number(val.price);
                        return Number(val);
                    });
                    if (values.length > 0) minPrice = Math.min(...values);
                }

                return {
                    id: p.id,
                    name: `${p.user.firstName} ${p.user.lastName}`,
                    category: p.category, // BARBER, etc.
                    rating: p.avgRating,
                    reviews: p.totalReviews,
                    price: minPrice,
                    rating: p.avgRating,
                    reviews: p.totalReviews,
                    price: minPrice,
                    image: p.user.profilePhoto ? (p.user.profilePhoto.startsWith('http') ? p.user.profilePhoto : `${ENV.apiUrl.replace('/api', '')}${p.user.profilePhoto}`) : 'https://via.placeholder.com/150',
                    isAvailable: p.isAvailable,
                    latitude: p.latitude,
                    longitude: p.longitude
                };
            });

            setProfessionals(mappedProfessionals);
        } catch (error) {
            console.error('Error fetching professionals:', error);
            // Alert.alert('Error', 'No se pudieron cargar los profesionales cercanos');
            setProfessionals([]);
        } finally {
            setLoading(false);
        }
    };

    // Remove getMockProfessionals or keep as unused functions/comments
    /* const getMockProfessionals = (userLocation: Location.LocationObject) => {
        const mockData = [
            {
                id: '1',
                name: 'Carlos Rojas',
                category: 'Barbería',
                rating: 4.8,
                reviews: 156,
                price: 12000,
                image: 'https://i.pravatar.cc/150?img=12',
                isAvailable: true,
                latitude: userLocation.coords.latitude + 0.01,
                longitude: userLocation.coords.longitude + 0.01,
            },
            {
                id: '2',
                name: 'María González',
                category: 'Manicura',
                rating: 4.9,
                reviews: 203,
                price: 15000,
                image: 'https://i.pravatar.cc/150?img=5',
                isAvailable: true,
                latitude: userLocation.coords.latitude - 0.015,
                longitude: userLocation.coords.longitude + 0.008,
            },
            {
                id: '3',
                name: 'Diego Silva',
                category: 'Tatuajes',
                rating: 4.7,
                reviews: 89,
                price: 30000,
                image: 'https://i.pravatar.cc/150?img=33',
                isAvailable: false,
                latitude: userLocation.coords.latitude + 0.02,
                longitude: userLocation.coords.longitude - 0.01,
            },
        ];

        return selectedCategory
            ? mockData.filter(p => {
                const categoryMap: { [key: string]: string } = {
                    'BARBER': 'Barbería',
                    'MANICURIST': 'Manicura',
                    'TATTOO_ARTIST': 'Tatuajes',
                };
                return p.category === categoryMap[selectedCategory];
            })
            : mockData;
    }; */

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
        Alert.alert('Ver Perfil', `Navegar al perfil de ${professional.name}`);
    };

    const updateLocationData = async (addressString: string, latitude: number, longitude: number) => {
        // Actualizar Backend
        try {
            await userAPI.updateProfile({
                address: addressString,
                latitude,
                longitude
            });
        } catch (err) {
            console.warn('Error updating profile location in backend', err);
        }

        // Actualizar Redux
        dispatch(updateProfile({
            address: addressString,
            latitude,
            longitude
        }));

        // Actualizar Mapa
        const newLoc = {
            coords: { latitude, longitude, altitude: 0, accuracy: 0, altitudeAccuracy: 0, heading: 0, speed: 0 },
            timestamp: Date.now()
        };
        setLocation(newLoc);

        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }

        Alert.alert('Ubicación Actualizada', `📍 ${addressString}`);
        setModalVisible(false);
    };

    const handleUpdateLocation = async () => {
        setUpdatingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Habilita la ubicación para usar esta función');
                return;
            }

            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = location.coords;

            const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
            let addressString = 'Ubicación actual';

            if (addressResponse.length > 0) {
                const addr = addressResponse[0];
                const parts = [addr.street, addr.streetNumber, addr.city].filter(p => p);
                addressString = parts.join(' ');

                if (!addressString || addressString.length < 5) {
                    addressString = addr.name || addr.district || 'Ubicación seleccionada';
                }
            }

            await updateLocationData(addressString, latitude, longitude);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo obtener la ubicación GPS');
        } finally {
            setUpdatingLocation(false);
        }
    };

    const handleManualLocation = async () => {
        if (!manualAddress.trim()) {
            Alert.alert('Error', 'Por favor escribe una dirección');
            return;
        }

        setUpdatingLocation(true);
        Keyboard.dismiss();

        try {
            // Geocoding
            const geocoded = await Location.geocodeAsync(manualAddress);

            if (geocoded.length > 0) {
                const { latitude, longitude } = geocoded[0];

                // Reverse geocode para obtener formato bonito y confirmar ciudad
                let finalAddress = manualAddress;
                try {
                    const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
                    if (addressResponse.length > 0) {
                        const addr = addressResponse[0];
                        const parts = [addr.street, addr.streetNumber, addr.city].filter(p => p);
                        if (parts.length >= 2) {
                            finalAddress = parts.join(' ');
                        } else if (addr.district || addr.region) {
                            finalAddress = `${manualAddress}, ${addr.district || addr.region}`;
                        }
                    }
                } catch (e) {
                    // Si falla reverse, usar input original
                }

                await updateLocationData(finalAddress, latitude, longitude);
                setManualAddress('');

            } else {
                Alert.alert('No encontrada', 'No pudimos encontrar esa dirección. Intenta agregar la ciudad o país.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al buscar la dirección');
        } finally {
            setUpdatingLocation(false);
        }
    };

    const renderLocationModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalContent}
                    >
                        <Text style={styles.modalTitle}>Cambiar Ubicación</Text>

                        <TouchableOpacity
                            style={styles.gpsButton}
                            onPress={handleUpdateLocation}
                            disabled={updatingLocation}
                        >
                            {updatingLocation ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.gpsButtonIcon}>📍</Text>
                                    <Text style={styles.gpsButtonText}>Usar mi ubicación actual (GPS)</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>O ingresa manualmente</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <Text style={styles.inputLabel}>Dirección (Calle, número, ciudad):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Av. Providencia 123, Santiago"
                            value={manualAddress}
                            onChangeText={setManualAddress}
                            returnKeyType="search"
                            onSubmitEditing={handleManualLocation}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleManualLocation}
                                disabled={updatingLocation}
                            >
                                {updatingLocation ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Buscar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.addressBar}
                onPress={() => setModalVisible(true)}
            >
                <View style={styles.addressContent}>
                    <Text style={styles.addressLabel}>📍 Tu ubicación:</Text>
                    <Text style={styles.addressText} numberOfLines={1}>
                        {updatingLocation ? 'Usando GPS...' : (user?.address || 'Toca para definir ubicación')}
                    </Text>
                </View>
                <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderLocationModal()}

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={DEFAULT_REGION}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                    loadingEnabled
                >
                    {/* User Location Marker */}
                    {location && (
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title="Tu ubicación"
                            description={user?.address}
                            zIndex={999}
                        >
                            <View style={styles.userMarkerContainer}>
                                <Text style={styles.userMarkerIcon}>🏠</Text>
                            </View>
                        </Marker>
                    )}

                    {/* Professional Markers */}
                    {professionals.map((professional) => (
                        <Marker
                            key={professional.id}
                            coordinate={{
                                latitude: professional.latitude,
                                longitude: professional.longitude,
                            }}
                            tracksViewChanges={false}
                        >
                            <View style={styles.markerContainer}>
                                <Text style={styles.markerText}>
                                    {professional.category === 'BARBER' && '💈'}
                                    {professional.category === 'TATTOO_ARTIST' && '🎨'}
                                    {professional.category === 'MANICURIST' && '💅'}
                                    {!['BARBER', 'TATTOO_ARTIST', 'MANICURIST'].includes(professional.category) && '👤'}
                                </Text>
                            </View>
                            <Callout tooltip onPress={() => handleMarkerPress(professional)}>
                                <View style={styles.calloutBubble}>
                                    <Text style={styles.calloutTitle}>{professional.name}</Text>
                                    <Text style={styles.calloutSubtitle}>{professional.category}</Text>
                                    <View style={styles.calloutBtn}>
                                        <Text style={styles.calloutBtnText}>Pedir Servicio</Text>
                                    </View>
                                </View>
                            </Callout>
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

                {/* Center on Shop Button (Professional Only) */}
                {user?.role === 'PROFESSIONAL' && professional?.latitude && (
                    <TouchableOpacity
                        style={[styles.centerButton, { bottom: 90, backgroundColor: theme.colors.surface }]}
                        onPress={() => {
                            mapRef.current?.animateToRegion({
                                latitude: professional.latitude,
                                longitude: professional.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }, 1000);
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.centerButtonText}>🏪</Text>
                    </TouchableOpacity>
                )}

                {/* Category Filter */}
                <View style={styles.filterContainer}>
                    <CategoryFilter
                        categories={categories}
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
    headerContainer: {
        position: 'absolute',
        top: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 10 : 50,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    addressBar: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressContent: {
        flex: 1,
        marginRight: 10,
    },
    addressLabel: {
        fontSize: 10,
        color: theme.colors.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    addressText: {
        fontSize: 14,
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    editIcon: {
        fontSize: 16,
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
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.md,
    },
    markerText: {
        fontSize: 20,
    },
    calloutBubble: {
        backgroundColor: 'white',
        width: 180, // Wider for new text
        alignItems: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Elevation for Android
        elevation: 5,
        marginBottom: 5, // Give space for arrow if native
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
        color: '#333',
    },
    calloutSubtitle: {
        fontSize: 10,
        color: '#666',
        marginBottom: 5,
    },
    calloutBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
        marginTop: 2,
    },
    calloutBtnText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    userMarkerContainer: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: theme.colors.primary,
        elevation: 6,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    userMarkerIcon: {
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
        top: 80,
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 300,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    gpsButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    gpsButtonIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    gpsButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#6B7280',
        fontSize: 14,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: theme.colors.text,
    },
    input: {
        backgroundColor: '#F3F4F6',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#4B5563',
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: theme.colors.primary,
        marginLeft: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
