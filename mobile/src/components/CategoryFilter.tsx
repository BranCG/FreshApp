import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

interface CategoryFilterProps {
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

const categories = [
    { id: 'ALL', label: 'Todos', icon: '🌟' },
    { id: 'BARBER', label: 'Barberos', icon: '💈' },
    { id: 'TATTOO_ARTIST', label: 'Tatuadores', icon: '🎨' },
    { id: 'MANICURIST', label: 'Manicuristas', icon: '💅' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((category) => {
                const isSelected =
                    category.id === 'ALL'
                        ? selectedCategory === null
                        : selectedCategory === category.id;

                return (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                        ]}
                        onPress={() =>
                            onSelectCategory(category.id === 'ALL' ? null : category.id)
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.icon}>{category.icon}</Text>
                        <Text
                            style={[
                                styles.label,
                                isSelected && styles.labelSelected,
                            ]}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: theme.spacing.sm,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    icon: {
        fontSize: 20,
        marginRight: theme.spacing.xs,
    },
    label: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
        fontWeight: '500',
    },
    labelSelected: {
        color: theme.colors.background,
    },
});
