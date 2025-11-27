import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface Category {
    id: string;
    name: string;
    icon: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (id: string | null) => void;
}

export const CategoryFilter = ({
    categories,
    selectedCategory,
    onSelectCategory
}: CategoryFilterProps) => {
    const { colors } = useTheme();

    const allOption = { id: 'ALL', name: 'Todos', icon: 'apps' };
    const items = [allOption, ...categories];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {items.map((category) => {
                const isSelected = category.id === 'ALL'
                    ? selectedCategory === null
                    : selectedCategory === category.id;

                return (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.item,
                            {
                                backgroundColor: isSelected ? colors.primary : colors.surface,
                                borderColor: isSelected ? colors.primary : '#E0E0E0',
                            }
                        ]}
                        onPress={() => onSelectCategory(category.id === 'ALL' ? null : category.id)}
                    >
                        <Text
                            style={[
                                styles.text,
                                { color: isSelected ? '#fff' : '#757575' }
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    item: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        elevation: 2,
    },
    text: {
        fontWeight: '600',
    },
});
