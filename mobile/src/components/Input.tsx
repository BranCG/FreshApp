import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { theme } from '../theme/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    rightIcon,
    containerStyle,
    secureTextEntry,
    ...props
}) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    error && styles.inputContainerError,
                ]}
            >
                {icon && <View style={styles.iconLeft}>{icon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        icon && styles.inputWithIconLeft,
                        (rightIcon || secureTextEntry) && styles.inputWithIconRight,
                    ]}
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={isSecure}
                    {...props}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={() => setIsSecure(!isSecure)}
                    >
                        <Text style={styles.eyeIcon}>{isSecure ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                )}

                {rightIcon && !secureTextEntry && (
                    <View style={styles.iconRight}>{rightIcon}</View>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
    },
    inputContainerError: {
        borderColor: theme.colors.error,
    },
    input: {
        flex: 1,
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
        paddingVertical: theme.spacing.md,
    },
    inputWithIconLeft: {
        paddingLeft: theme.spacing.xs,
    },
    inputWithIconRight: {
        paddingRight: theme.spacing.xs,
    },
    iconLeft: {
        marginRight: theme.spacing.sm,
    },
    iconRight: {
        marginLeft: theme.spacing.sm,
        padding: theme.spacing.xs,
    },
    eyeIcon: {
        fontSize: 20,
    },
    errorText: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },
});
