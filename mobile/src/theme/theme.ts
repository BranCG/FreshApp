export const colors = {
    // Colores primarios
    primary: '#6200EE',
    primaryDark: '#3700B3',
    primaryLight: '#BB86FC',

    // Colores secundarios
    secondary: '#03DAC6',
    secondaryDark: '#018786',
    secondaryLight: '#66FFF9',

    // Colores de estado
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Grises
    grey50: '#FAFAFA',
    grey100: '#F5F5F5',
    grey200: '#EEEEEE',
    grey300: '#E0E0E0',
    grey400: '#BDBDBD',
    grey500: '#9E9E9E',
    grey600: '#757575',
    grey700: '#616161',
    grey800: '#424242',
    grey900: '#212121',

    // Blanco y negro
    white: '#FFFFFF',
    black: '#000000',

    // Fondos
    background: '#F5F5F5',
    surface: '#FFFFFF',

    // Texto
    text: '#212121', // Alias for textPrimary
    textPrimary: '#212121',
    textSecondary: '#757575',
    textDisabled: '#9E9E9E',
    textOnPrimary: '#FFFFFF',

    // Borders
    border: '#E0E0E0',

    // Categorías (colores distintivos)
    barber: '#FF6B6B',
    tattoo: '#4ECDC4',
    manicurist: '#FFE66D',

    // Transparencias
    overlay: 'rgba(0, 0, 0, 0.5)',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
    full: 999, // Alias for round
};

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        lineHeight: 36,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    h4: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    h5: {
        fontSize: 18,
        fontWeight: '600' as const,
        lineHeight: 24,
    },
    h6: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 22,
    },
    body: { // Alias for body1
        fontSize: 16,
        fontWeight: 'normal' as const,
        lineHeight: 24,
    },
    body1: {
        fontSize: 16,
        fontWeight: 'normal' as const,
        lineHeight: 24,
    },
    body2: {
        fontSize: 14,
        fontWeight: 'normal' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: 'normal' as const,
        lineHeight: 16,
    },
    button: {
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
        letterSpacing: 0.5,
    },
};

export const shadows = {
    sm: { // Alias for small
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    md: { // Medium shadow
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: { // Large shadow
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    small: {
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    medium: {
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    large: {
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

export const theme = {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
};

export type Theme = typeof theme;
