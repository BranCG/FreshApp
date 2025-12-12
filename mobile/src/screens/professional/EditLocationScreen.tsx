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

    // Initial location from professional profile
    const initialLocation = professional?.latitude && professional?.longitude
        ? { latitude: professional.latitude, longitude: professional.longitude }
        : null;

    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(initialLocation);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            address: professional?.address || '',
        }
    });

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
                        Usa el GPS para definir tu nueva ubicación. La dirección se actualizará automáticamente.
                    </Text>

                    <LocationPicker
                        initialLocation={location || undefined}
                        onLocationSelected={(loc: any) => {
                            setLocation(loc);
                            if (loc.address) {
                                setValue('address', loc.address, { shouldValidate: true });
                            }
                        }}
                    />

                    <Text style={{ marginBottom: 4, marginTop: 20, fontWeight: 'bold', color: theme.colors.primary }}>
                        Dirección Detectada:
                    </Text>
                    <Controller
                        control={control}
                        name="address"
                        render={({ field: { value } }) => (
                            <TextInput
                                label="Dirección"
                                value={value}
                                mode="outlined"
                                style={styles.input}
                                editable={false}
                                placeholder="Esperando GPS..."
                            />
                        )}
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
