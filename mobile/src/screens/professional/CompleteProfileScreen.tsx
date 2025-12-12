import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ProgressBar, useTheme, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateProfile, updateProfessionalProfile, setProfileComplete } from '../../store/authSlice';
import { userAPI, professionalAPI } from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ProfilePhotoUploader } from '../../components/ProfilePhotoUploader';
import { LocationPicker } from '../../components/LocationPicker';
import { ServicePriceInput } from '../../components/ServicePriceInput';
import { PortfolioUploader } from '../../components/PortfolioUploader';
import { theme } from '../../theme/theme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as Location from 'expo-location';

interface CompleteProfileScreenProps {
    navigation: any;
}

const steps = [
    { title: 'Información Básica', description: 'Cuéntanos sobre ti' },
    { title: 'Ubicación', description: '¿Dónde ofrecerás tus servicios?' },
    { title: 'Servicios', description: '¿Qué ofreces y cuánto cobras?' },
    { title: 'Portafolio', description: 'Muestra tu trabajo' },
];

const step1Schema = yup.object({
    firstName: yup.string().required('Nombre requerido'),
    lastName: yup.string().required('Apellido requerido'),
    bio: yup.string().required('Biografía requerida').min(20, 'Mínimo 20 caracteres'),
    category: yup.string().required('Categoría requerida'),
}).required();

const step2Schema = yup.object({
    address: yup.string().required('Dirección requerida'),
}).required();

export const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user, professional } = useSelector((state: RootState) => state.auth);

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // State for all steps
    const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([]);

    const { control: control1, handleSubmit: handleSubmit1, formState: { errors: errors1 }, watch: watch1, setValue: setValue1 } = useForm({
        resolver: yupResolver(step1Schema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            bio: professional?.bio || '',
            category: professional?.category || 'BARBER', // Default
        },
    });
    const selectedCategory = watch1('category');

    const { control: control2, handleSubmit: handleSubmit2, setValue: setValue2, getValues: getValues2, formState: { errors: errors2 } } = useForm({
        resolver: yupResolver(step2Schema),
        defaultValues: {
            address: professional?.address || '',
        },
    });

    const [geocoding, setGeocoding] = useState(false);

    const handleGeocodeAddress = async () => {
        const address = getValues2('address');
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
                Alert.alert('Ubicación encontrada', 'Verifica el pin en el mapa.');
            } else {
                Alert.alert('No encontrada', 'Intenta ser más específico (Calle, Número, Comuna).');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Falló la búsqueda. Verifica tu conexión.');
        } finally {
            setGeocoding(false);
        }
    };

    // Step 1 Submit
    const onStep1Submit = (data: any) => {
        if (!profilePhoto && !user?.profilePhoto) {
            Alert.alert('Foto requerida', 'Por favor sube una foto de perfil');
            return;
        }
        setCurrentStep(1);
    };

    // Step 2 Submit
    const onStep2Submit = (data: any) => {
        if (!location) {
            Alert.alert('Ubicación requerida', 'Por favor selecciona tu ubicación en el mapa');
            return;
        }
        setCurrentStep(2);
    };

    // Step 3 Submit
    const onStep3Submit = () => {
        if (services.length === 0) {
            Alert.alert('Servicios requeridos', 'Por favor agrega al menos un servicio');
            return;
        }
        setCurrentStep(3);
    };

    // Final Submit
    const onFinalSubmit = async () => {
        // Collect data from forms (need to use getValues or keep state synced? 
        // Since we used separate forms, we need to pass data through or store in state.
        // For simplicity, let's trigger handleSubmit1 again to get data, but that's async/tricky.
        // Better: Store step data in state when moving next.
        // Refactoring to store data in state on step transition.

        // Actually, handleSubmit passes data to the callback. 
        // I need to store that data.
        // Let's change the onStepXSubmit to store data.
        submitAll();
    };

    // We need to store form data to submit at the end
    const [step1Data, setStep1Data] = useState<any>(null);
    const [step2Data, setStep2Data] = useState<any>(null);

    const handleNextStep1 = (data: any) => {
        if (!profilePhoto && !user?.profilePhoto) {
            Alert.alert('Foto requerida', 'Por favor sube una foto de perfil');
            return;
        }
        setStep1Data(data);
        setCurrentStep(1);
    };

    const handleNextStep2 = (data: any) => {
        if (!location) {
            Alert.alert('Ubicación requerida', 'Por favor selecciona tu ubicación en el mapa');
            return;
        }
        setStep2Data(data);
        setCurrentStep(2);
    };

    const handleNextStep3 = () => {
        if (services.length === 0) {
            Alert.alert('Servicios requeridos', 'Por favor agrega al menos un servicio');
            return;
        }
        setCurrentStep(3);
    };

    const submitAll = async () => {
        setLoading(true);
        try {
            // 1. Update User Profile (Name)
            if (step1Data.firstName !== user?.firstName || step1Data.lastName !== user?.lastName) {
                const userRes = await userAPI.updateProfile({
                    firstName: step1Data.firstName,
                    lastName: step1Data.lastName,
                });
                dispatch(updateProfile(userRes.data));
            }

            // 2. Upload Profile Photo
            if (profilePhoto && profilePhoto !== user?.profilePhoto) {
                const formData = new FormData();
                formData.append('photo', {
                    uri: profilePhoto,
                    name: 'profile.jpg',
                    type: 'image/jpeg',
                } as any);
                const photoRes = await userAPI.uploadPhoto(formData);
                dispatch(updateProfile(photoRes.data));
            }

            // 3. Create/Update Professional Profile
            const pricesObj = services.reduce((acc, curr) => ({
                ...acc,
                [curr.name]: curr.price
            }), {});

            const servicesMap = services.reduce((acc, curr) => ({
                ...acc,
                [curr.name]: { price: curr.price, duration: curr.duration }
            }), {});

            const profData = {
                category: step1Data.category,
                bio: step1Data.bio,
                prices: servicesMap,
                address: step2Data.address,
                latitude: location!.latitude,
                longitude: location!.longitude,
                hashtags: [],
                isAvailable: true, // IMPORTANT: Default to available immediately
            };

            let profRes;
            if (professional) {
                profRes = await professionalAPI.updateProfile(profData);
            } else {
                profRes = await professionalAPI.createProfile(profData);
            }
            dispatch(updateProfessionalProfile(profRes.data));

            // 4. Upload Portfolio Photos
            for (const photoUri of portfolioPhotos) {
                const formData = new FormData();
                formData.append('image', {
                    uri: photoUri,
                    name: 'portfolio.jpg',
                    type: 'image/jpeg',
                } as any);
                await professionalAPI.addPortfolioItem(formData);
            }

            dispatch(setProfileComplete(true));

            Alert.alert(
                '¡Perfil Completado!',
                'Tu perfil profesional ha sido actualizado exitosamente.',
                [
                    {
                        text: 'Ir al Mapa',
                        onPress: () => {
                            // Reset stack to Main tabs
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Main' }],
                            });
                        }
                    }
                ]
            );

        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Error al guardar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <View>
            <ProfilePhotoUploader
                currentPhotoUrl={profilePhoto}
                onPhotoSelected={setProfilePhoto}
            />
            <Input
                label="Nombre"
                name="firstName"
                control={control1}
                error={errors1.firstName?.message}
            />
            <Input
                label="Apellido"
                name="lastName"
                control={control1}
                error={errors1.lastName?.message}
            />
            <Text style={{ marginBottom: 8, marginTop: 10, fontWeight: 'bold', color: theme.colors.primary }}>
                Selecciona tu Profesión
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
                {[
                    { label: 'Barbería', value: 'BARBER', icon: 'content-cut' },
                    { label: 'Tatuajes', value: 'TATTOO_ARTIST', icon: 'draw' },
                    { label: 'Manicura', value: 'MANICURIST', icon: 'hand-wash' },
                ].map((cat) => (
                    <Chip
                        key={cat.value}
                        selected={selectedCategory === cat.value}
                        onPress={() => setValue1('category', cat.value, { shouldValidate: true })}
                        showSelectedOverlay
                        mode="outlined"
                        style={{ borderColor: selectedCategory === cat.value ? theme.colors.primary : '#ccc' }}
                    >
                        {cat.label}
                    </Chip>
                ))}
            </View>
            {errors1.category && <Text style={{ color: theme.colors.error, fontSize: 12, marginBottom: 10 }}>{errors1.category.message}</Text>}
            <Input
                label="Biografía"
                name="bio"
                control={control1}
                error={errors1.bio?.message}
                multiline
                numberOfLines={4}
                placeholder="Cuéntanos sobre tu experiencia y especialidades..."
            />
            <Button onPress={handleSubmit1(handleNextStep1)} style={styles.button}>
                Siguiente
            </Button>
        </View>
    );

    const renderStep2 = () => (
        <View>
            <Text style={{ marginBottom: 10, color: '#666' }}>
                Ingresa tu dirección exacta para aparecer en el mapa:
            </Text>

            <Input
                label="Dirección (Calle, Número, Comuna)"
                name="address"
                control={control2}
                error={errors2.address?.message}
                placeholder="Ej: Av. Providencia 1234, Santiago"
            />

            <Button
                mode="text"
                onPress={handleGeocodeAddress}
                loading={geocoding}
                disabled={geocoding}
                icon="map-search"
                style={{ marginBottom: 10 }}
            >
                Ubicar en Mapa
            </Button>

            <LocationPicker
                onLocationSelected={(loc) => {
                    setLocation(loc);
                }}
                initialLocation={location || undefined}
            />

            <View style={styles.buttonRow}>
                <Button mode="outlined" onPress={() => setCurrentStep(0)} style={styles.halfButton}>
                    Atrás
                </Button>
                <Button onPress={handleSubmit2(handleNextStep2)} style={styles.halfButton}>
                    Siguiente
                </Button>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View>
            <ServicePriceInput
                services={services}
                onServicesChange={setServices}
            />
            <View style={styles.buttonRow}>
                <Button mode="outlined" onPress={() => setCurrentStep(1)} style={styles.halfButton}>
                    Atrás
                </Button>
                <Button onPress={handleNextStep3} style={styles.halfButton}>
                    Siguiente
                </Button>
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View>
            <PortfolioUploader
                photos={portfolioPhotos}
                onPhotosChange={setPortfolioPhotos}
            />
            <View style={styles.buttonRow}>
                <Button mode="outlined" onPress={() => setCurrentStep(2)} style={styles.halfButton}>
                    Atrás
                </Button>
                <Button onPress={submitAll} loading={loading} style={styles.halfButton}>
                    Finalizar
                </Button>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.header}>
                    <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
                    <Text style={styles.stepDescription}>{steps[currentStep].description}</Text>
                    <ProgressBar
                        progress={(currentStep + 1) / steps.length}
                        color={colors.primary}
                        style={styles.progressBar}
                    />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {currentStep === 0 && renderStep1()}
                    {currentStep === 1 && renderStep2()}
                    {currentStep === 2 && renderStep3()}
                    {currentStep === 3 && renderStep4()}
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
    header: {
        padding: 20,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    button: {
        marginTop: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    halfButton: {
        width: '48%',
    },
});
