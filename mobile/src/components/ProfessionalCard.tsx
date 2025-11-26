import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme/theme';

interface Professional {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
    category: string;
    avgRating: number;
    totalReviews: number;
    prices?: any;
    isAvailable: boolean;
}

interface ProfessionalCardProps {
    professional: Professional;
    onPress: () => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
    professional,
    onPress,
}) => {
    const categoryIcons = {
        BARBER: '💈',
        TATTOO_ARTIST: '🎨',
        MANICURIST: '💅',
    };

    const categoryLabels = {
        BARBER: 'Barbero',
        TATTOO_ARTIST: 'Tatuador',
        MANICURIST: 'Manicurista',
    };

    const getMinPrice = () => {
        if (!professional.prices) return null;
        const prices = Object.values(professional.prices as Record<string, number>);
        return Math.min(...prices);
    };

    const minPrice = getMinPrice();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {professional.user.profilePhoto ? (
                        <Image
                            source={{ uri: professional.user.profilePhoto }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarText}>
                                {professional.user.firstName[0]}
                                {professional.user.lastName[0]}
                            </Text>
                        </View>
                    )}
                    {professional.isAvailable && (
                        <View style={styles.availableBadge} />
                    )}
                </View>

                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                        {professional.user.firstName} {professional.user.lastName}
                    </Text>

                    <View style={styles.categoryRow}>
                        <Text style={styles.categoryIcon}>
                            {categoryIcons[professional.category as keyof typeof categoryIcons]}
                        </Text>
                        <Text style={styles.category}>
                            {categoryLabels[professional.category as keyof typeof categoryLabels]}
                        </Text>
                    </View>

                    <View style={styles.ratingRow}>
                        <Text style={styles.stars}>⭐</Text>
                        <Text style={styles.rating}>
                            {professional.avgRating.toFixed(1)}
                        </Text>
                        <Text style={styles.reviews}>
                            ({professional.totalReviews})
                        </Text>
                    </View>
                </View>

                {minPrice && (
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Desde</Text>
                        <Text style={styles.price}>${minPrice.toLocaleString()}</Text>
                    </View>
                )}
            </View>

            {!professional.isAvailable && (
                <View style={styles.unavailableBanner}>
                    <Text style={styles.unavailableText}>No disponible</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: theme.spacing.md,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    avatarPlaceholder: {
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: theme.colors.background,
        fontSize: 20,
        fontWeight: '600',
    },
    availableBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: theme.colors.success,
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    categoryIcon: {
        fontSize: 14,
        marginRight: theme.spacing.xs,
    },
    category: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stars: {
        fontSize: 14,
        marginRight: theme.spacing.xs,
    },
    rating: {
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
        color: theme.colors.text,
        marginRight: theme.spacing.xs,
    },
    reviews: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    price: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    unavailableBanner: {
        marginTop: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        backgroundColor: `${theme.colors.error}20`,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
    },
    unavailableText: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.error,
        fontWeight: '600',
    },
});
