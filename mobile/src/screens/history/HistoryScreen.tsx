import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { Text, SegmentedButtons, Card, Badge, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { serviceRequestAPI } from '../../services/api';
import { theme } from '../../theme/theme';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistoryScreenProps {
    navigation: any;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { colors } = useTheme();

    const [viewMode, setViewMode] = useState<'CLIENT' | 'PROFESSIONAL'>('CLIENT');
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Inicializar viewMode basado en el rol
    useEffect(() => {
        if (user?.role === 'PROFESSIONAL') {
            setViewMode('PROFESSIONAL');
        } else {
            setViewMode('CLIENT');
        }
    }, [user?.role]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await serviceRequestAPI.getAll({
                role: viewMode
            });
            setRequests(response.data.serviceRequests || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [viewMode]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return theme.colors.warning;
            case 'ACCEPTED': return theme.colors.info;
            case 'IN_PROGRESS': return theme.colors.primary;
            case 'COMPLETED': return theme.colors.success;
            case 'CANCELLED': return theme.colors.error;
            case 'REJECTED': return theme.colors.error;
            default: return theme.colors.textSecondary;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendiente';
            case 'ACCEPTED': return 'Aceptado';
            case 'IN_PROGRESS': return 'En Curso';
            case 'COMPLETED': return 'Completado';
            case 'CANCELLED': return 'Cancelado';
            case 'REJECTED': return 'Rechazado';
            case 'ARRIVED': return 'Llegado';
            default: return status;
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isClientView = viewMode === 'CLIENT';
        const otherPerson = isClientView ? item.professional : item.client;
        const otherPersonFirstName = otherPerson?.firstName || (isClientView ? item.professional?.firstName : item.client?.firstName);
        const otherPersonLastName = otherPerson?.lastName || (isClientView ? item.professional?.lastName : item.client?.lastName);
        const otherPersonPhoto = otherPerson?.profilePhoto || (isClientView ? item.professional?.profilePhoto : item.client?.profilePhoto);

        return (
            <Card style={styles.card} onPress={() => {
                // Navegar a detalle (pendiente implementación)
                // navigation.navigate('ServiceDetail', { id: item.id });
            }}>
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <View style={styles.userInfo}>
                            {otherPersonPhoto ? (
                                <Image source={{ uri: otherPersonPhoto }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.placeholderAvatar]}>
                                    <Text style={styles.placeholderText}>
                                        {otherPersonFirstName?.[0]}{otherPersonLastName?.[0]}
                                    </Text>
                                </View>
                            )}
                            <View>
                                <Text style={styles.name}>
                                    {otherPersonFirstName} {otherPersonLastName}
                                </Text>
                                <Text style={styles.category}>
                                    {item.category}
                                </Text>
                            </View>
                        </View>
                        <Badge
                            style={{ backgroundColor: getStatusColor(item.status), alignSelf: 'flex-start' }}
                            size={24}
                        >
                            {getStatusLabel(item.status)}
                        </Badge>
                    </View>

                    <View style={styles.details}>
                        <Text style={styles.date}>
                            📅 {format(new Date(item.requestedDate), "d 'de' MMMM, HH:mm", { locale: es })}
                        </Text>
                        <Text style={styles.price}>
                            💰 ${item.estimatedPrice}
                        </Text>
                    </View>

                    {item.clientAddress && (
                        <Text style={styles.address} numberOfLines={1}>
                            📍 {item.clientAddress}
                        </Text>
                    )}
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Historial</Text>
            </View>

            {user?.role === 'PROFESSIONAL' && (
                <View style={styles.segmentContainer}>
                    <SegmentedButtons
                        value={viewMode}
                        onValueChange={val => setViewMode(val as 'CLIENT' | 'PROFESSIONAL')}
                        buttons={[
                            {
                                value: 'PROFESSIONAL',
                                label: 'Mis Trabajos',
                                showSelectedCheck: true,
                            },
                            {
                                value: 'CLIENT',
                                label: 'Mis Pedidos',
                                showSelectedCheck: true,
                            },
                        ]}
                    />
                </View>
            )}

            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : requests.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No hay servicios registrados</Text>
                </View>
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 50, // SafeArea
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.surface,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    segmentContainer: {
        padding: 16,
    },
    listContent: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    placeholderAvatar: {
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    category: {
        fontSize: 14,
        color: '#6B7280',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#1F2937',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7C3AED',
    },
    address: {
        fontSize: 12,
        color: '#6B7280',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
    }
});
