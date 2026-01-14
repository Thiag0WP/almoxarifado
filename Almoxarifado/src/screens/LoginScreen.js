// src/screens/LoginScreen.js

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { login } from '../services/api';
import { saveSession } from '../storage/session';

export default function LoginScreen({ onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!pin) {
      Alert.alert('Erro', 'Digite o PIN');
      return;
    }

    setLoading(true);

    try {
      const result = await login(pin);

      if (!result.success) {
        Alert.alert('Erro', result.error || 'PIN inválido');
        return;
      }

      // salva sessão local
      await saveSession(result.user);

      // avisa o App que logou
      onLoginSuccess(result.user);

    } catch {
      Alert.alert('Erro', 'Falha ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1976d2', // theme.colors.primary
      }}
    >
      <StatusBar backgroundColor="#1976d2" barStyle="light-content" />
      
      {/* Background decorativo */}
      <View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60%',
          backgroundColor: '#1976d2',
        }}
      />
      
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 32,
        }}
      >
        {/* Logo e título */}
        <View style={{
          alignItems: 'center',
          marginBottom: 48,
        }}>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 20,
            borderRadius: 50,
            marginBottom: 16,
          }}>
            <Ionicons name="cube" size={48} color="#fff" />
          </View>
          
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Almoxarifado TI
          </Text>
          
          <Text
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
            }}
          >
            Faça login para acessar o sistema
          </Text>
        </View>

        {/* Card de login */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#212121',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Digite seu PIN
          </Text>

          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="●●●●●●"
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            style={{
              backgroundColor: '#f5f5f5',
              borderWidth: 1,
              borderColor: '#e0e0e0',
              padding: 16,
              fontSize: 24,
              borderRadius: 8,
              marginBottom: 24,
              textAlign: 'center',
              letterSpacing: 8,
              fontWeight: 'bold',
            }}
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#bdbdbd' : '#1976d2',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              shadowColor: '#1976d2',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                  Verificando...
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="log-in" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                  Entrar
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{
          alignItems: 'center',
          marginTop: 32,
        }}>
          <Text style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
            textAlign: 'center',
          }}>
            Sistema de Gerenciamento de Almoxarifado{'\n'}
            Versão 2.0
          </Text>
        </View>
      </View>
    </View>
  );
}
