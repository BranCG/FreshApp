import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button as PaperButton, HelperText, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { professionalAPI } from '../../services/api';
import { updateProfessionalProfile } from '../../store/authSlice';
import { theme } from '../../theme/theme';
import * as Location from 'expo-location';
import { LocationPicker } from '../../components/LocationPicker';

const schema = yup.object({
    address: yup.string().required('Dirección requerida'),
}).required();

export const EditLocationScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { professional } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [geocoding, setGeocoding] = useState(false);

    // Initial location from professional profile
    const initialLocation = professional?.latitude && professional?.longitude
        ? { latitude: professional.latitude, longitude: professional.longitude }
        : null;

    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(initialLocation);

    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            address: professional?.address || '',
        }
    });

    const handleGeocodeAddress = async () => {
        const address = getValues('address');
        if (!address) {
            Alert.alert('Error', 'Ingresa una dirección primero');
            return;
        }

        setGeocoding(true);
        try {
            const result = await Location.geocodeAsync(address);
            if (result.length > 0) {
                const { latitude, longitude } = result[0];
                setLocation({ latitude, longitude });
            } else {
                Alert.alert('No encontrado', 'No pudimos encontrar esa dirección.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Falló la geocodificación.');
        } finally {
            setGeocoding(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (!location) {
            Alert.alert('Error', 'Por favor ubica tu negocio en el mapa.');
            return;
        }

        setLoading(true);
        try {
            const profData = {
                address: data.address,
                latitude: location.latitude,
                longitude: location.longitude,
            };

            const profRes = await professionalAPI.updateProfile(profData);
            dispatch(updateProfessionalProfile(profRes.data));

            Alert.alert('Éxito', 'Ubicación actualizada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar la ubicación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Editar Ubicación</Text>
                <View style={{ width: 48 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <Text style={styles.helperText}>
                        Ingresa la dirección y presiona "Ubicar en Mapa" o mueve el pin manualmente.
                    </Text>

                    <Controller
                        control={control}
                        name="address"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Dirección"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                                error={!!errors.address}
                                placeholder="Ej: Av. Providencia 1234"
                            />
                        )}
                    />
                    <HelperText type="error" visible={!!errors.address}>{errors.address?.message}</HelperText>

                    <PaperButton
                        mode="text"
                        onPress={handleGeocodeAddress}
                        loading={geocoding}
                        disabled={geocoding}
                        icon="map-search"
                        style={{ marginBottom: 15 }}
                    >
                        Ubicar en Mapa
                    </PaperButton>

                    <LocationPicker
                        initialLocation={location || undefined}
                        onLocationSelected={setLocation}
                    />

                    <PaperButton
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        style={styles.button}
                    >
                        Guardar Ubicación
                    </PaperButton>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    input: {
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    helperText: {
        marginBottom: 15,
        color: '#666',
        fontSize: 14,
    },
    button: {
        marginTop: 30,
        marginBottom: 40,
    }
});
