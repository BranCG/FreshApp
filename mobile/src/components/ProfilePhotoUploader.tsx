import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/theme';

interface ProfilePhotoUploaderProps {
    currentPhotoUrl?: string | null;
    onPhotoSelected: (uri: string) => void;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
    currentPhotoUrl,
    onPhotoSelected,
}) => {
    const { colors } = useTheme();
    const [image, setImage] = useState<string | null>(currentPhotoUrl || null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir una foto.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                setImage(uri);
                onPhotoSelected(uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={[styles.placeholder, { backgroundColor: colors.surfaceVariant }]}>
                        <Text style={styles.placeholderIcon}>📷</Text>
                        <Text style={styles.placeholderText}>Subir Foto</Text>
                    </View>
                )}
                <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.editIcon}>✏️</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.helperText}>Toca para cambiar tu foto de perfil</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    imageContainer: {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'visible', // Allow badge to overflow
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'dashed',
    },
    placeholderIcon: {
        fontSize: 32,
        marginBottom: 4,
    },
    placeholderText: {
        fontSize: 12,
        color: '#666',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    editIcon: {
        fontSize: 16,
        color: '#fff',
    },
    helperText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
});
