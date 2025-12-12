import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, useTheme, IconButton, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

interface EditProfileMenuScreenProps {
    navigation: any;
}

export const EditProfileMenuScreen: React.FC<EditProfileMenuScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>Selecciona qué deseas actualizar:</Text>

                <List.Section>
                    <List.Item
                        title="Información Básica"
                        description="Nombre, Categoría, Biografía"
                        left={props => <List.Icon {...props} icon="account-circle-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('EditBasicInfo')}
                        style={styles.listItem}
                    />
                    <Divider />

                    <List.Item
                        title="Ubicación"
                        description="Dirección y posición en mapa"
                        left={props => <List.Icon {...props} icon="map-marker-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('EditLocation')}
                        style={styles.listItem}
                    />
                    <Divider />

                    <List.Item
                        title="Servicios y Precios"
                        description="Gestiona tu catálogo de servicios"
                        left={props => <List.Icon {...props} icon="format-list-bulleted" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('EditServices')}
                        style={styles.listItem}
                    />
                    <Divider />

                    <List.Item
                        title="Portafolio"
                        description="Sube fotos de tus trabajos"
                        left={props => <List.Icon {...props} icon="image-multiple-outline" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => navigation.navigate('EditPortfolio')} // We can reuse logic or create new
                        style={styles.listItem}
                    />
                </List.Section>
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
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    listItem: {
        paddingVertical: 15,
    }
});
