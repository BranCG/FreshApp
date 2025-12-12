import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button as PaperButton, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { professionalAPI } from '../../services/api';
import { updateProfessionalProfile } from '../../store/authSlice';
import { theme } from '../../theme/theme';
import { ServicePriceInput } from '../../components/ServicePriceInput';

export const EditServicesScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { professional } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);

    // Parse initial services from professional.prices object
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        if (professional?.prices) {
            const parsedServices = Object.entries(professional.prices).map(([name, details]: [string, any]) => ({
                name,
                price: typeof details === 'object' ? details.price.toString() : details.toString(),
                duration: typeof details === 'object' ? details.duration?.toString() : '',
            }));
            setServices(parsedServices);
        }
    }, [professional]);

    const onSubmit = async () => {
        if (services.length === 0) {
            Alert.alert('Error', 'Debes tener al menos un servicio.');
            return;
        }

        setLoading(true);
        try {
            // Reconstruct services map
            const servicesMap = services.reduce((acc, curr) => ({
                ...acc,
                [curr.name]: {
                    price: parseInt(curr.price) || 0,
                    duration: parseInt(curr.duration) || 30
                }
            }), {});

            const profData = {
                prices: servicesMap,
            };

            const profRes = await professionalAPI.updateProfile(profData);
            dispatch(updateProfessionalProfile(profRes.data));

            Alert.alert('Éxito', 'Servicios actualizados correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar los servicios');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Editar Servicios</Text>
                <View style={{ width: 48 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <Text style={styles.helperText}>
                        Agrega o modifica los servicios que ofreces.
                    </Text>

                    <ServicePriceInput
                        services={services}
                        onServicesChange={setServices}
                    />

                    <PaperButton
                        mode="contained"
                        onPress={onSubmit}
                        loading={loading}
                        style={styles.button}
                    >
                        Guardar Servicios
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
