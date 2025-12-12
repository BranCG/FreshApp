import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export const PrivacyScreen: React.FC<any> = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Políticas de Privacidad</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>
                        🔒 Tu privacidad es sagrada. Protegemos tus datos con los más altos estándares de seguridad.
                    </Text>
                </View>

                <Text style={styles.updateDate}>Última actualización: Diciembre 2024</Text>

                {/* 1. INTRODUCCIÓN */}
                <Text style={styles.sectionTitle}>1. Introducción</Text>
                <Text style={styles.paragraph}>
                    En FreshApp respetamos tu privacidad y nos comprometemos a proteger tus datos personales de acuerdo con la <Text style={styles.bold}>Ley 19.628 sobre Protección de Datos Personales</Text> y estándares internacionales como <Text style={styles.bold}>ISO 27001</Text>.
                </Text>

                <Divider style={styles.divider} />

                {/* 2. DATOS RECOPILADOS */}
                <Text style={styles.sectionTitle}>2. Datos que Recopilamos</Text>

                <Text style={styles.subsectionTitle}>2.1 Datos Personales</Text>
                <Text style={styles.paragraph}>
                    • Nombre completo{'\n'}
                    • Correo electrónico{'\n'}
                    • Número de teléfono{'\n'}
                    • Fotografía de perfil (opcional){'\n'}
                    • Tipo de usuario (Cliente/Profesional)
                </Text>

                <Text style={styles.subsectionTitle}>2.2 Datos de Ubicación</Text>
                <Text style={styles.paragraph}>
                    • <Text style={styles.bold}>Ubicación GPS</Text> en tiempo real{'\n'}
                    • Dirección registrada{'\n'}
                    • Historial de ubicaciones de servicios{'\n'}
                    {'\n'}
                    <Text style={styles.bold}>Importante</Text>: La ubicación GPS es esencial para el funcionamiento de nuestra plataforma de servicios a domicilio.
                </Text>

                <Text style={styles.subsectionTitle}>2.3 Datos Profesionales (Solo Profesionales)</Text>
                <Text style={styles.paragraph}>
                    • Categoría de servicio{'\n'}
                    • Precios y duración de servicios{'\n'}
                    • Portfolio (fotografías opcionales){'\n'}
                    • Calificaciones y reseñas{'\n'}
                    • Estado de disponibilidad
                </Text>

                <Text style={styles.subsectionTitle}>2.4 Datos de Actividad</Text>
                <Text style={styles.paragraph}>
                    • Historial de servicios solicitados/realizados{'\n'}
                    • Interacciones en la plataforma{'\n'}
                    • Reportes y denuncias{'\n'}
                    • Registro de tiempos de sesión
                </Text>

                <Divider style={styles.divider} />

                {/* 3. USO DE DATOS */}
                <Text style={styles.sectionTitle}>3. Cómo Usamos tus Datos</Text>
                <Text style={styles.paragraph}>
                    Utilizamos tus datos para:{'\n'}
                    ✓ <Text style={styles.bold}>Conectar</Text> clientes con profesionales cercanos{'\n'}
                    ✓ <Text style={styles.bold}>Procesar</Text> solicitudes de servicios{'\n'}
                    ✓ <Text style={styles.bold}>Garantizar seguridad</Text> mediante monitoreo de actividad{'\n'}
                    ✓ <Text style={styles.bold}>Mejorar</Text> la experiencia del usuario{'\n'}
                    ✓ <Text style={styles.bold}>Comunicar</Text> actualizaciones importantes{'\n'}
                    ✓ <Text style={styles.bold}>Cumplir</Text> con obligaciones legales
                </Text>

                <Divider style={styles.divider} />

                {/* 4. COMPARTIR DATOS */}
                <Text style={styles.sectionTitle}>4. Compartir Información</Text>

                <View style={styles.warningBox}>
                    <Text style={styles.warningTitle}>⚖️ Compartir con Autoridades</Text>
                    <Text style={styles.warningText}>
                        Compartiremos tus datos con autoridades policiales, judiciales o regulatorias cuando:{'\n'}
                        • Se requiera por ley{'\n'}
                        • Exista riesgo para la seguridad{'\n'}
                        • Se reporte un incidente{'\n'}
                        • Sea necesario para investigaciones
                    </Text>
                </View>

                <Text style={styles.subsectionTitle}>4.1 Entre Usuarios</Text>
                <Text style={styles.paragraph}>
                    Compartimos <Text style={styles.bold}>información limitada</Text> entre cliente y profesional:{'\n'}
                    • Nombre y foto de perfil{'\n'}
                    • Ubicación (solo durante el servicio activo){'\n'}
                    • Calificaciones y reseñas{'\n'}
                    {'\n'}
                    <Text style={styles.bold}>NO compartimos</Text> números de teléfono ni direcciones de email directamente.
                </Text>

                <Text style={styles.subsectionTitle}>4.2 Terceros</Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>NO</Text> vendemos tus datos personales a terceros. Solo compartimos con:{'\n'}
                    • Proveedores de servicios en la nube (almacenamiento seguro){'\n'}
                    • Procesadores de pago{'\n'}
                    • Servicios de análisis (datos anonimizados){'\n'}
                    • Autoridades (según sea requerido por ley)
                </Text>

                <Divider style={styles.divider} />

                {/* 5. SEGURIDAD */}
                <Text style={styles.sectionTitle}>5. Seguridad de tus Datos</Text>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        <Text style={styles.bold}>Medidas de Seguridad (ISO 27001)</Text>:{'\n\n'}
                        🔐 Encriptación de datos en tránsito y reposo{'\n'}
                        🔐 Autenticación de dos factores (próximamente){'\n'}
                        🔐 Monitoreo 24/7 de actividad sospechosa{'\n'}
                        🔐 Backups regulares y seguros{'\n'}
                        🔐 Acceso limitado solo a personal autorizado{'\n'}
                        🔐 Auditorías de seguridad periódicas
                    </Text>
                </View>

                <Divider style={styles.divider} />

                {/* 6. TUS DERECHOS */}
                <Text style={styles.sectionTitle}>6. Tus Derechos</Text>
                <Text style={styles.paragraph}>
                    Según la Ley 19.628, tienes derecho a:{'\n'}
                    ✓ <Text style={styles.bold}>Acceder</Text> a tus datos personales{'\n'}
                    ✓ <Text style={styles.bold}>Rectificar</Text> datos incorrectos{'\n'}
                    ✓ <Text style={styles.bold}>Eliminar</Text> tu cuenta y datos{'\n'}
                    ✓ <Text style={styles.bold}>Oponerte</Text> al procesamiento de ciertos datos{'\n'}
                    ✓ <Text style={styles.bold}>Portabilidad</Text> de tus datos{'\n'}
                    ✓ <Text style={styles.bold}>Revocar</Text> consentimientos
                </Text>

                <Text style={styles.paragraph}>
                    Para ejercer estos derechos, contáctanos en: <Text style={styles.bold}>privacidad@freshapp.com</Text>
                </Text>

                <Divider style={styles.divider} />

                {/* 7. RETENCIÓN */}
                <Text style={styles.sectionTitle}>7. Retención de Datos</Text>
                <Text style={styles.paragraph}>
                    Conservamos tus datos:{'\n'}
                    • <Text style={styles.bold}>Cuenta activa</Text>: Durante todo el tiempo que uses la plataforma{'\n'}
                    • <Text style={styles.bold}>Cuenta cerrada</Text>: Hasta 5 años por motivos legales y de seguridad{'\n'}
                    • <Text style={styles.bold}>Datos de incidentes</Text>: Indefinidamente para colaborar con investigaciones
                </Text>

                <Divider style={styles.divider} />

                {/* 8. COOKIES */}
                <Text style={styles.sectionTitle}>8. Cookies y Tecnologías Similares</Text>
                <Text style={styles.paragraph}>
                    Utilizamos cookies y tecnologías similares para:{'\n'}
                    • Mantener tu sesión activa{'\n'}
                    • Recordar preferencias{'\n'}
                    • Mejorar el rendimiento{'\n'}
                    • Analizar uso de la aplicación (datos anonimizados)
                </Text>

                <Divider style={styles.divider} />

                {/* 9. MENORES */}
                <Text style={styles.sectionTitle}>9. Menores de Edad</Text>
                <Text style={styles.paragraph}>
                    FreshApp está diseñado para <Text style={styles.bold}>mayores de 18 años</Text>. No recopilamos intencionalmente datos de menores. Si detectamos que un menor usa la plataforma, cerraremos la cuenta inmediatamente.
                </Text>

                <Divider style={styles.divider} />

                {/* 10. CAMBIOS */}
                <Text style={styles.sectionTitle}>10. Cambios a esta Política</Text>
                <Text style={styles.paragraph}>
                    Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos mediante:{'\n'}
                    • Notificación en la app{'\n'}
                    • Correo electrónico{'\n'}
                    • Aviso en esta sección
                </Text>

                <View style={styles.footerBox}>
                    <Text style={styles.footerText}>
                        Preguntas sobre privacidad: privacidad@freshapp.com{'\n'}
                        {'\n'}
                        Última revisión: Diciembre 2024
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.white,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    updateDate: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 20,
        marginBottom: 12,
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 22,
        marginBottom: 12,
    },
    bold: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    divider: {
        marginVertical: 20,
    },
    alertBox: {
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.success,
        marginBottom: 20,
    },
    alertText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
        lineHeight: 20,
    },
    warningBox: {
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
        marginBottom: 16,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#E65100',
        lineHeight: 22,
    },
    infoBox: {
        backgroundColor: '#E3F2FD',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.info,
        marginBottom: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#0D47A1',
        lineHeight: 22,
    },
    footerBox: {
        backgroundColor: theme.colors.grey100,
        padding: 16,
        borderRadius: 8,
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
