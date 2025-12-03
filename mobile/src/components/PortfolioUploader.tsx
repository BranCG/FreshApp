import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/theme';

interface PortfolioUploaderProps {
    photos: string[];
    onPhotosChange: (photos: string[]) => void;
    maxPhotos?: number;
}

export const PortfolioUploader: React.FC<PortfolioUploaderProps> = ({
    photos,
    onPhotosChange,
    maxPhotos = 6,
}) => {
    const { colors } = useTheme();

    const pickImage = async () => {
        if (photos.length >= maxPhotos) {
            Alert.alert('Límite alcanzado', `Solo puedes subir hasta ${maxPhotos} fotos.`);
            return;
        }

        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para subir fotos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                onPhotosChange([...photos, uri]);
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        onPhotosChange(newPhotos);
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <View style={styles.photoContainer}>
            <Image source={{ uri: item }} style={styles.photo} />
            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.error }]}
                onPress={() => removePhoto(index)}
            >
                <IconButton icon="close" iconColor="white" size={16} style={{ margin: 0 }} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Portafolio</Text>
                <Text style={styles.counter}>
                    {photos.length}/{maxPhotos}
                </Text>
            </View>
            <Text style={styles.subtitle}>
                Muestra tu mejor trabajo a los clientes
            </Text>

            <FlatList
                data={[...photos, 'ADD_BUTTON']}
                renderItem={({ item, index }) => {
                    if (item === 'ADD_BUTTON') {
                        if (photos.length >= maxPhotos) return null;
                        return (
                            <TouchableOpacity
                                style={[styles.addButton, { borderColor: colors.primary }]}
                                onPress={pickImage}
                            >
                                <Text style={[styles.addIcon, { color: colors.primary }]}>+</Text>
                                <Text style={[styles.addText, { color: colors.primary }]}>Agregar</Text>
                            </TouchableOpacity>
                        );
                    }
                    return renderItem({ item: item as string, index });
                }}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                scrollEnabled={false} // Nested inside ScrollView usually
                contentContainerStyle={styles.grid}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    counter: {
        fontSize: 14,
        color: '#666',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    grid: {
        // flexGrow: 1,
    },
    photoContainer: {
        width: '31%',
        aspectRatio: 1,
        margin: '1%',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    deleteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        width: '31%',
        aspectRatio: 1,
        margin: '1%',
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    addIcon: {
        fontSize: 32,
        marginBottom: 4,
    },
    addText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
