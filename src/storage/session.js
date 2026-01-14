// src/storage/session.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'almox_session';
const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hora

/**
 * Salva sessão do usuário
 */
export async function saveSession(user) {
  const session = {
    user,
    loginAt: Date.now(),
  };

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Carrega sessão válida (ou null)
 */
export async function loadSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const session = JSON.parse(raw);

  const now = Date.now();
  const expired = now - session.loginAt > SESSION_TIMEOUT_MS;

  if (expired) {
    await clearSession();
    return null;
  }

  return session.user;
}

/**
 * Limpa sessão (logout)
 */
export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
