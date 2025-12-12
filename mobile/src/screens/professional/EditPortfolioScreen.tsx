import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { professionalAPI } from '../../services/api';
import { updateProfessionalProfile } from '../../store/authSlice';
import { theme } from '../../theme/theme';
import * as ImagePicker from 'expo-image-picker';
import ENV from '../../config/environment';

export const EditPortfolioScreen: React.FC<any> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { professional } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    const portfolioItems = professional?.portfolioItems || [];

    const getImageUrl = (url: string) => {
        if (!url) return 'https://via.placeholder.com/150';
        if (url.startsWith('http')) return url;
        return `${ENV.apiUrl.replace('/api', '')}${url}`;
    };

    const handleAddPhoto = async () => {
        if (portfolioItems.length >= 10) {
            Alert.alert('Límite alcanzado', 'Solo puedes subir hasta 10 fotos.');
            return;
        }

        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a galería.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 5],
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                uploadPhoto(uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
        }
    };

    const uploadPhoto = async (uri: string) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: uri,
                name: 'portfolio.jpg',
                type: 'image/jpeg',
            } as any);
            formData.append('description', 'Portfolio Item');
            formData.append('displayOrder', (portfolioItems.length + 1).toString());

            const res = await professionalAPI.addPortfolioItem(formData);
            const newItem = res.data;

            // Update Redux
            dispatch(updateProfessionalProfile({
                portfolioItems: [...portfolioItems, newItem]
            }));

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo subir la foto');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePhoto = (item: any) => {
        Alert.alert(
            'Eliminar Foto',
            '¿Estás seguro que deseas eliminar esta foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await professionalAPI.deletePortfolioItem(item.id);

                            // Update Redux
                            const newItems = portfolioItems.filter((p: any) => p.id !== item.id);
                            dispatch(updateProfessionalProfile({
                                portfolioItems: newItems
                            }));
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Error', 'No se pudo eliminar la foto');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.photoContainer}>
            <Image
                source={{ uri: getImageUrl(item.imageUrl) }}
                style={styles.photo}
            />
            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.error }]}
                onPress={() => handleDeletePhoto(item)}
            >
                <IconButton icon="trash-can" iconColor="white" size={16} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Editar Portafolio</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.helperText}>
                    Sube y gestiona las fotos de tus trabajos ({portfolioItems.length}/10).
                </Text>

                <View style={styles.grid}>
                    {portfolioItems.map((item: any) => (
                        <View key={item.id} style={styles.wrapper}>
                            {renderItem({ item })}
                        </View>
                    ))}

                    {portfolioItems.length < 10 && (
                        <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color={theme.colors.primary} />
                            ) : (
                                <>
                                    <Text style={{ fontSize: 32, color: theme.colors.primary }}>+</Text>
                                    <Text style={{ fontSize: 12, color: theme.colors.primary }}>Agregar</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
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
        marginBottom: 20,
        color: '#666',
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    wrapper: {
        width: '33.33%',
        padding: 5,
    },
    photoContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
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
        width: '30%', // Slightly smaller to fix grid
        aspectRatio: 1,
        margin: '1.5%',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
    }
});
