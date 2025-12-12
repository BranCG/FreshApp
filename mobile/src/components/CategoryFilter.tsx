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
    vertical?: boolean;
}

export const CategoryFilter = ({
    categories,
    selectedCategory,
    onSelectCategory,
    vertical = false
}: CategoryFilterProps) => {
    const { colors } = useTheme();

    const allOption = { id: 'ALL', name: 'Todos', icon: 'apps' };
    const items = [allOption, ...categories];


    return (
        <ScrollView
            horizontal={!vertical}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, vertical && { flexDirection: 'column', alignItems: 'flex-end', paddingVertical: 5 }]}
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
                                backgroundColor: isSelected ? colors.primary : '#FFFFFF',
                                borderColor: isSelected ? colors.primary : '#BDBDBD',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                marginBottom: vertical ? 8 : 0,
                                minWidth: vertical ? 120 : 'auto',
                            }
                        ]}
                        onPress={() => onSelectCategory(category.id === 'ALL' ? null : category.id)}
                    >
                        <Text
                            style={[
                                styles.text,
                                { color: isSelected ? '#fff' : '#424242' }
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
