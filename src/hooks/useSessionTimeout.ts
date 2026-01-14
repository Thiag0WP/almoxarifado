import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { listarConfiguracoes } from "../services/api";

const STORAGE_KEY = "last_activity";

export function useSessionTimeout() {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [timeoutMinutos, setTimeoutMinutos] = useState(60);
  const lastActivityRef = useRef(Date.now());

  // Carregar configuração de timeout
  const carregarTimeout = useCallback(async () => {
    try {
      const res = await listarConfiguracoes();
      if (res.success && res.configuracoes.timeout_sessao_min) {
        setTimeoutMinutos(res.configuracoes.timeout_sessao_min);
      }
    } catch {
      // Em caso de erro, usar valor padrão
      setTimeoutMinutos(60);
    }
  }, []);

  // Fazer logout
  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem(STORAGE_KEY);
    router.replace("/login");
  }, [router]);

  // Registrar atividade
  const registrarAtividade = useCallback(() => {
    const agora = Date.now();
    lastActivityRef.current = agora;
    AsyncStorage.setItem(STORAGE_KEY, agora.toString());
  }, []);

  // Verificar se sessão expirou
  const verificarExpiracao = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) return; // Usuário não logado

      const ultimaAtividade = await AsyncStorage.getItem(STORAGE_KEY);
      const agora = Date.now();

      if (ultimaAtividade) {
        const tempoInativo = agora - parseInt(ultimaAtividade);
        const timeoutMs = timeoutMinutos * 60 * 1000; // Converter minutos para ms

        if (tempoInativo >= timeoutMs) {
          logout();
          return;
        }
      } else {
        // Primeira vez, registrar atividade
        registrarAtividade();
      }
    } catch {
      // Em caso de erro, não fazer nada
    }
  }, [timeoutMinutos, logout, registrarAtividade]);

  // Configurar timeout
  const configurarTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      verificarExpiracao();
    }, timeoutMinutos * 60 * 1000);
  }, [timeoutMinutos, verificarExpiracao]);

  // Resetar timeout
  const resetarTimeout = useCallback(() => {
    registrarAtividade();
    configurarTimeout();
  }, [registrarAtividade, configurarTimeout]);

  // Gerenciar mudanças de estado do app
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        // App voltou ao primeiro plano, verificar expiração
        verificarExpiracao();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        // App foi para segundo plano, registrar atividade
        registrarAtividade();
      }
    },
    [verificarExpiracao, registrarAtividade]
  );

  useEffect(() => {
    carregarTimeout();
  }, [carregarTimeout]);

  useEffect(() => {
    configurarTimeout();

    // Listener para mudanças de estado do app
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription?.remove();
    };
  }, [configurarTimeout, handleAppStateChange]);

  return {
    resetarTimeout,
    timeoutMinutos,
    carregarTimeout,
  };
}