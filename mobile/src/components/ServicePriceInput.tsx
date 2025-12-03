import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton, useTheme, Divider } from 'react-native-paper';
import { Input } from './Input';
import { Button } from './Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { theme } from '../theme/theme';

interface ServiceItem {
    id: string;
    name: string;
    price: number;
    duration: number; // in minutes
}

interface ServicePriceInputProps {
    services: ServiceItem[];
    onServicesChange: (services: ServiceItem[]) => void;
}

const schema = yup.object({
    name: yup.string().required('Nombre del servicio requerido'),
    price: yup.number().typeError('Debe ser un número').positive('Debe ser mayor a 0').required('Precio requerido'),
    duration: yup.number().typeError('Debe ser un número').positive('Debe ser mayor a 0').integer().required('Duración requerida'),
}).required();

export const ServicePriceInput: React.FC<ServicePriceInputProps> = ({
    services,
    onServicesChange,
}) => {
    const { colors } = useTheme();
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            price: '',
            duration: '30',
        },
    });

    const handleAddService = (data: any) => {
        const newService: ServiceItem = {
            id: Date.now().toString(),
            name: data.name,
            price: parseFloat(data.price),
            duration: parseInt(data.duration),
        };

        onServicesChange([...services, newService]);
        reset({ name: '', price: '', duration: '30' });
    };

    const handleRemoveService = (id: string) => {
        onServicesChange(services.filter(s => s.id !== id));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Servicios y Precios</Text>
            <Text style={styles.subtitle}>Agrega los servicios que ofreces</Text>

            <View style={styles.form}>
                <Input
                    label="Nombre del Servicio"
                    name="name"
                    control={control}
                    placeholder="Ej: Corte de Cabello"
                    error={errors.name?.message}
                />

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Input
                            label="Precio ($)"
                            name="price"
                            control={control}
                            placeholder="10000"
                            keyboardType="numeric"
                            error={errors.price?.message}
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Input
                            label="Duración (min)"
                            name="duration"
                            control={control}
                            placeholder="30"
                            keyboardType="numeric"
                            error={errors.duration?.message}
                        />
                    </View>
                </View>

                <Button onPress={handleSubmit(handleAddService)} mode="outlined" icon="plus">
                    Agregar Servicio
                </Button>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.listTitle}>Tus Servicios ({services.length})</Text>

            {services.length === 0 ? (
                <Text style={styles.emptyText}>No has agregado servicios aún.</Text>
            ) : (
                <ScrollView style={styles.list} nestedScrollEnabled>
                    {services.map((item) => (
                        <View key={item.id} style={[styles.serviceItem, { backgroundColor: colors.surface }]}>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceName}>{item.name}</Text>
                                <Text style={styles.serviceDetails}>
                                    ${item.price.toLocaleString()} • {item.duration} min
                                </Text>
                            </View>
                            <IconButton
                                icon="delete"
                                iconColor={colors.error}
                                size={20}
                                onPress={() => handleRemoveService(item.id)}
                            />
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    form: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    divider: {
        marginVertical: 16,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    list: {
        maxHeight: 300,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '500',
    },
    serviceDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        marginTop: 10,
    },
});
