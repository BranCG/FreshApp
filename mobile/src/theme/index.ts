export const colors = {
    primary: '#6200EE',
    primaryDark: '#3700B3',
    primaryLight: '#BB86FC',

    secondary: '#03DAC6',
    secondaryDark: '#018786',
    secondaryLight: '#66FFF9',

    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#B00020',
    success: '#00C853',
    warning: '#FFB300',

    text: '#000000',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',

    border: '#E0E0E0',
    divider: '#EEEEEE',

    // Gradientes
    gradientStart: '#6200EE',
    gradientEnd: '#BB86FC',

    //Transparencias
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Rating
    star: '#FFB300',

    // Category colors
    barber: '#FF6B6B',
    tattooArtist: '#4ECDC4',
    manicurist: '#FFE66D',
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
    lg: 16,
    full: 9999,
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
        fontSize: 16,
        fontWeight: '600' as const,
        textTransform: 'uppercase' as const,
    },
};

export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
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
