import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { theme } from "@/src/styles/theme";
import { useSession } from "../../src/context/SessionContext";
import {
  Configuracao,
  atualizarConfiguracao,
  listarConfiguracoes,
} from "../../src/services/api";

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const { carregarTimeout } = useSession();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [configuracoes, setConfiguracoes] = useState<Configuracao>({});
  const [timeoutSessao, setTimeoutSessao] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const res = await listarConfiguracoes();
      if (res.success) {
        setConfiguracoes(res.configuracoes);
        setTimeoutSessao(String(res.configuracoes.timeout_sessao_min || 60));
      } else {
        Alert.alert("Erro", res.error || "Erro ao carregar configurações");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function onRefresh() {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  }

  async function salvarTimeoutSessao() {
    if (!timeoutSessao || isNaN(Number(timeoutSessao))) {
      Alert.alert("Erro", "Digite um valor válido em minutos");
      return;
    }

    setSalvando(true);
    try {
      const res = await atualizarConfiguracao(
        "timeout_sessao_min",
        Number(timeoutSessao)
      );
      if (res.success) {
        Alert.alert("Sucesso", "Configuração atualizada com sucesso");
        await carregar();
        await carregarTimeout(); // Recarrega o timeout no contexto
      } else {
        Alert.alert("Erro", res.error || "Erro ao salvar configuração");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
    setSalvando(false);
  }

  async function logout() {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair do aplicativo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            router.replace("/login");
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={{
            ...theme.typography.body,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.md,
          }}
        >
          Carregando configurações...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />

      {/* Header */}
      <View
        style={{
          backgroundColor: theme.colors.primary,
          paddingVertical: theme.spacing.xl,
          paddingHorizontal: theme.spacing.md,
          ...theme.shadows.medium,
        }}
      >
        <Text
          style={{ ...theme.typography.h1, color: theme.colors.surface }}
        >
          Configurações
        </Text>
        <Text
          style={{
            color: theme.colors.surface,
            opacity: 0.9,
            marginTop: theme.spacing.xs,
          }}
        >
          Gerencie as configurações do sistema
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: 100,
        }}
      >
        {/* Timeout de Sessão */}
        <Card>
          <View style={{ marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
              <Ionicons
                name="time-outline"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={{ ...theme.typography.h3, color: theme.colors.text, flex: 1 }}>
                Timeout de Sessão
              </Text>
            </View>
            <Text
              style={{
                ...theme.typography.caption,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md,
              }}
            >
              Tempo em minutos para logout automático por inatividade
            </Text>

            <View style={{ flexDirection: "row", gap: theme.spacing.md, alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  value={timeoutSessao}
                  onChangeText={setTimeoutSessao}
                  keyboardType="numeric"
                  placeholder="60"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: theme.borderRadius.medium,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    fontSize: theme.typography.body.fontSize,
                    color: theme.colors.text,
                  }}
                />
              </View>
              <Text style={{ ...theme.typography.body, color: theme.colors.text }}>
                minutos
              </Text>
            </View>

            <TouchableOpacity
              onPress={salvarTimeoutSessao}
              disabled={salvando}
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.borderRadius.medium,
                marginTop: theme.spacing.md,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: theme.spacing.sm,
                opacity: salvando ? 0.6 : 1,
              }}
            >
              {salvando ? (
                <ActivityIndicator size="small" color={theme.colors.surface} />
              ) : (
                <Ionicons
                  name="checkmark-outline"
                  size={20}
                  color={theme.colors.surface}
                />
              )}
              <Text
                style={{
                  color: theme.colors.surface,
                  fontWeight: "600",
                  fontSize: theme.typography.body.fontSize,
                }}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
              Informações do Sistema
            </Text>
          </View>

          <View style={{ gap: theme.spacing.sm }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>
                Versão do App:
              </Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.text, fontWeight: "600" }}>
                1.0.0
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>
                Timeout Atual:
              </Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.text, fontWeight: "600" }}>
                {configuracoes.timeout_sessao_min || 60} min
              </Text>
            </View>
          </View>
        </Card>

        {/* Ações */}
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
            <Ionicons
              name="exit-outline"
              size={24}
              color={theme.colors.error}
            />
            <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>
              Ações
            </Text>
          </View>

          <TouchableOpacity
            onPress={logout}
            style={{
              backgroundColor: theme.colors.error,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.borderRadius.medium,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.surface}
            />
            <Text
              style={{
                color: theme.colors.surface,
                fontWeight: "600",
                fontSize: theme.typography.body.fontSize,
              }}
            >
              Sair do Sistema
            </Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}