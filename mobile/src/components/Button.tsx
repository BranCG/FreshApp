import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

interface ButtonProps extends React.ComponentProps<typeof PaperButton> {
    mode?: 'text' | 'outlined' | 'contained';
    children: React.ReactNode;
}

export const Button = ({ mode = 'contained', children, style, ...props }: ButtonProps) => {
    return (
        <PaperButton
            mode={mode}
            style={[styles.button, style]}
            contentStyle={styles.content}
            labelStyle={styles.label}
            {...props}
        >
            {children}
        </PaperButton>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        marginVertical: 8,
    },
    content: {
        height: 48,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
