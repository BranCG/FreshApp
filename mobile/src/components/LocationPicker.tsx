import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button } from './Button';
import { Text, useTheme } from 'react-native-paper';
import { theme } from '../theme/theme';

interface LocationPickerProps {
    onLocationSelected: (location: {
        latitude: number;
        longitude: number;
        address?: string;
    }) => void;
    initialLocation?: {
        latitude: number;
        longitude: number;
    };
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
    onLocationSelected,
    initialLocation,
}) => {
    const { colors } = useTheme();
    const [location, setLocation] = useState<Region | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (initialLocation) {
            setLocation({
                latitude: initialLocation.latitude,
                longitude: initialLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        } else {
            getCurrentLocation();
        }
    }, [initialLocation]);

    const getCurrentLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setLocation(region);
            onLocationSelected({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            setErrorMsg('Error al obtener la ubicación');
        } finally {
            setLoading(false);
        }
    };

    const handleMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({
            ...location!,
            latitude,
            longitude,
        });
        onLocationSelected({ latitude, longitude });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text>Obteniendo ubicación...</Text>
            </View>
        );
    }

    if (errorMsg) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: colors.error }}>{errorMsg}</Text>
                <Button onPress={getCurrentLocation} mode="outlined">
                    Reintentar
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    style={styles.map}
                    region={location}
                    onPress={handleMapPress}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="Tu ubicación"
                        description="Esta será la ubicación mostrada a los clientes"
                    />
                </MapView>
            )}
            <View style={styles.footer}>
                <Text style={styles.hint}>
                    Toca el mapa para ajustar tu ubicación exacta
                </Text>
                <Button onPress={getCurrentLocation} mode="text" icon="crosshairs-gps">
                    Usar mi ubicación actual
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 300,
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    map: {
        flex: 1,
        width: '100%',
    },
    loadingContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    errorContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 20,
    },
    footer: {
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    hint: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 5,
    },
});
