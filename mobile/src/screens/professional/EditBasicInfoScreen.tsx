import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, TextInput, Button as PaperButton, HelperText, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { userAPI, professionalAPI } from '../../services/api';
import { updateProfile, updateProfessionalProfile } from '../../store/authSlice';
import { theme } from '../../theme/theme';
import { ProfilePhotoUploader } from '../../components/ProfilePhotoUploader';

const schema = yup.object({
    firstName: yup.string().required('Nombre requerido'),
    lastName: yup.string().required('Apellido requerido'),
    category: yup.string().required('Categoría requerida'),
    bio: yup.string().max(500, 'Máximo 500 caracteres'),
}).required();

export const EditBasicInfoScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, professional } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto || null);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            category: professional?.category || '',
            bio: professional?.bio || '',
        }
    });

    const selectedCategory = watch('category');

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            // 1. Update User info - DISABLED for Professionals
            // Name cannot be changed here

            // 2. Update Professional info
            const profData = {
                category: data.category,
                bio: data.bio,
            };
            const profRes = await professionalAPI.updateProfile(profData);
            dispatch(updateProfessionalProfile(profRes.data));

            // 3. Update Photo if changed
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

            Alert.alert('Éxito', 'Información actualizada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar la información');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Información Básica</Text>
                <View style={{ width: 48 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <ProfilePhotoUploader
                            currentPhotoUrl={profilePhoto}
                            onPhotoSelected={setProfilePhoto}
                        />
                    </View>

                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Nombre"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                                disabled={true}
                                right={<TextInput.Icon icon="lock" />}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Apellido"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                                disabled={true}
                                right={<TextInput.Icon icon="lock" />}
                            />
                        )}
                    />
                    <HelperText type="info">El cambio de nombre debe solicitarse a soporte.</HelperText>

                    <Text style={styles.label}>Categoría</Text>
                    <View style={styles.chipContainer}>
                        {[
                            { label: 'Barbería', value: 'BARBER' },
                            { label: 'Tatuajes', value: 'TATTOO_ARTIST' },
                            { label: 'Manicura', value: 'MANICURIST' },
                        ].map((cat) => (
                            <Chip
                                key={cat.value}
                                selected={selectedCategory === cat.value}
                                onPress={() => setValue('category', cat.value, { shouldValidate: true })}
                                showSelectedOverlay
                                mode="outlined"
                                style={styles.chip}
                            >
                                {cat.label}
                            </Chip>
                        ))}
                    </View>
                    <HelperText type="error" visible={!!errors.category}>{errors.category?.message}</HelperText>

                    <Controller
                        control={control}
                        name="bio"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Biografía"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                                error={!!errors.bio}
                            />
                        )}
                    />
                    <HelperText type="error" visible={!!errors.bio}>{errors.bio?.message}</HelperText>

                    <PaperButton
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={loading}
                        style={styles.button}
                    >
                        Guardar Cambios
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
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: '#333',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 5,
    },
    chip: {
        marginBottom: 5,
    },
    button: {
        marginTop: 20,
        marginBottom: 40,
    }
});
