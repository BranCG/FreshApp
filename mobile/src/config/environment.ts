/**
 * Environment Configuration
 * Centralizes all environment-specific settings
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const ENV = {
  dev: {
    apiUrl: __DEV__ 
      ? Platform.OS === 'android'
        ? 'http://10.0.2.2:3000/api'  // Android emulator
        : 'http://localhost:3000/api'  // iOS simulator
      : 'http://localhost:3000/api',
    socketUrl: __DEV__
      ? Platform.OS === 'android'
        ? 'http://10.0.2.2:3000'
        : 'http://localhost:3000'
      : 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://freshapp-backend-staging.onrender.com/api',
    socketUrl: 'https://freshapp-backend-staging.onrender.com',
  },
  prod: {
    apiUrl: 'https://freshapp-backend.onrender.com/api',
    socketUrl: 'https://freshapp-backend.onrender.com',
  },
};

const getEnvVars = (env = Constants.expoConfig?.releaseChannel) => {
  // __DEV__ is true when running in development mode
  if (__DEV__) return ENV.dev;
  
  // Check release channel for staging/production
  if (env === 'staging') return ENV.staging;
  if (env === 'production') return ENV.prod;
  
  // Default to production for release builds
  return ENV.prod;
};

export default getEnvVars();
