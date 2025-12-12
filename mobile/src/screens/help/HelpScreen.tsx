import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Icon } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export const HelpScreen: React.FC<any> = ({ navigation }) => {
    const helpOptions = [
        {
            title: 'Términos y Condiciones',
            description: 'Lee nuestros términos de uso y obligaciones',
            icon: 'file-document-outline',
            screen: 'Terms',
            color: theme.colors.primary,
        },
        {
            title: 'Políticas de Privacidad',
            description: 'Conoce cómo protegemos tus datos',
            icon: 'shield-check',
            screen: 'Privacy',
            color: theme.colors.secondary,
        },
        {
            title: 'Preguntas Frecuentes',
            description: 'Respuestas a consultas comunes sobre seguridad',
            icon: 'help-circle-outline',
            screen: 'FAQ',
            color: theme.colors.info,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Centro de Ayuda</Text>
                    <Text style={styles.headerSubtitle}>
                        Tu seguridad es nuestra prioridad
                    </Text>
                </View>

                {helpOptions.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(option.screen)}
                        style={styles.cardContainer}
                    >
                        <Card style={styles.card}>
                            <View style={styles.cardContent}>
                                <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
                                    <Icon source={option.icon} size={32} color={option.color} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardTitle}>{option.title}</Text>
                                    <Text style={styles.cardDescription}>{option.description}</Text>
                                </View>
                                <Icon source="chevron-right" size={24} color={theme.colors.grey500} />
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        ¿Necesitas más ayuda? Contáctanos en: {'\n'}
                        <Text style={styles.footerEmail}>soporte@freshapp.com</Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: theme.colors.white,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    footer: {
        marginTop: 32,
        padding: 20,
        backgroundColor: theme.colors.grey100,
        borderRadius: 12,
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    footerEmail: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
