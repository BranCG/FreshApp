import React from 'react';
import { View, StyleSheet, TextInputProps } from 'react-native';
import { TextInput, Text, useTheme } from 'react-native-paper';
import { Control, Controller } from 'react-hook-form';

interface InputProps extends TextInputProps {
    label: string;
    name: string;
    control: Control<any>;
    error?: string;
    leftIcon?: string;
    secureTextEntry?: boolean;
}

export const Input = ({
    label,
    name,
    control,
    error,
    leftIcon,
    secureTextEntry,
    ...props
}: InputProps) => {
    const { colors } = useTheme();
    const [isSecure, setIsSecure] = React.useState(secureTextEntry);

    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label={label}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        mode="outlined"
                        error={!!error}
                        secureTextEntry={isSecure}
                        left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
                        right={secureTextEntry ? (
                            <TextInput.Icon
                                icon={isSecure ? "eye" : "eye-off"}
                                onPress={() => setIsSecure(!isSecure)}
                            />
                        ) : undefined}
                        style={styles.input}
                        theme={{ roundness: 8 }}
                        {...props}
                    />
                )}
            />
            {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
