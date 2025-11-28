import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { StarRatingDisplay } from 'react-native-star-rating-widget';

interface Professional {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    isAvailable: boolean;
}

interface ProfessionalCardProps {
    professional: Professional;
    onPress: () => void;
}

export const ProfessionalCard = ({ professional, onPress }: ProfessionalCardProps) => {
    const { colors } = useTheme();

    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Content style={styles.content}>
                <Image source={{ uri: professional.image }} style={styles.image} />
                <View style={styles.info}>
                    <View style={styles.header}>
                        <Text variant="titleMedium" style={styles.name}>{professional.name}</Text>
                        {professional.isAvailable ? (
                            <View style={styles.badge}>
                                <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
                            </View>
                        ) : (
                            <View style={styles.badge}>
                                <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
                            </View>
                        )}
                    </View>

                    <Text variant="bodyMedium" style={styles.category}>{professional.category}</Text>

                    <View style={styles.ratingContainer}>
                        <StarRatingDisplay
                            rating={professional.rating}
                            starSize={16}
                            color="#FFC107"
                            emptyColor="#E0E0E0"
                            style={styles.stars}
                        />
                        <Text variant="bodySmall" style={styles.reviews}>({professional.reviews})</Text>
                    </View>

                    <Text variant="titleMedium" style={[styles.price, { color: colors.primary }]}>
                        ${professional.price}/hr
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
    },
    badge: {
        padding: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    category: {
        color: '#757575',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    stars: {
        marginRight: 4,
    },
    reviews: {
        color: '#9E9E9E',
    },
    price: {
        fontWeight: 'bold',
        textAlign: 'right',
    },
});
