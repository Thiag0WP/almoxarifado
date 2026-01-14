import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Input } from "@/src/components/Input";
import { theme } from "@/src/styles/theme";
import { useCart } from "../src/cart/CartContext";
import { devolverItensAoEstoque } from "../src/services/api";
import { loadSession } from "../src/storage/session";

type ItemDevolucaoEstoque = {
  itemId: number;
  nome: string;
  quantidade: number;
  unidade: string;
  localizacao?: string;
};

export default function EstoqueDevolverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, clearCart } = useCart();

  const [itensParaDevolucao, setItensParaDevolucao] = useState<
    ItemDevolucaoEstoque[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalhes, setDetalhes] = useState("");
  const [devolvendo, setDevolvendo] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Converte itens do carrinho para formato de devolução de estoque
    const itensConvertidos = items.map((item) => ({
      itemId: item.itemId,
      nome: item.nome,
      quantidade: item.quantidade,
      unidade: item.unidade,
      localizacao: "", // Será preenchida pelo usuário
    }));
    setItensParaDevolucao(itensConvertidos);

    // Carrega dados do usuário
    loadSession().then(setUser);
  }, [items]);

  function alterarQuantidade(itemId: number, quantidade: number) {
    if (quantidade <= 0) return;

    setItensParaDevolucao((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, quantidade } : item
      )
    );
  }

  function alterarLocalizacao(itemId: number, localizacao: string) {
    setItensParaDevolucao((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, localizacao } : item
      )
    );
  }

  function removerItem(itemId: number) {
    setItensParaDevolucao((prev) =>
      prev.filter((item) => item.itemId !== itemId)
    );
  }

  async function confirmarDevolucaoEstoque() {
    if (!user) {
      Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
      return;
    }

    if (itensParaDevolucao.length === 0) {
      Alert.alert("Erro", "Nenhum item para devolver ao estoque.");
      return;
    }

    setDevolvendo(true);
    try {
      const movimentacoes = itensParaDevolucao.map((item) => ({
        itemId: item.itemId,
        quantidade: item.quantidade,
        localizacao: item.localizacao?.trim() || "",
      }));

      const result = await devolverItensAoEstoque({
        itens: movimentacoes,
        usuario_id: user.id,
        detalhes: detalhes.trim() || undefined,
      });

      if (result.success) {
        Alert.alert(
          "Sucesso!",
          `${itensParaDevolucao.length} item(ns) devolvido(s) ao estoque com sucesso!`,
          [
            {
              text: "OK",
              onPress: () => {
                clearCart();
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Erro",
          result.error || "Erro ao processar devolução ao estoque."
        );
      }
    } catch {
      Alert.alert(
        "Erro",
        "Erro ao processar devolução ao estoque. Tente novamente."
      );
    }
    setDevolvendo(false);
  }

  if (items.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: theme.spacing.lg,
        }}
      >
        <Ionicons
          name="archive-outline"
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text
          style={{
            ...theme.typography.h3,
            color: theme.colors.text,
            marginTop: theme.spacing.md,
            textAlign: "center",
          }}
        >
          Nenhum item na caixa
        </Text>
        <Button
          title="Voltar às Categorias"
          onPress={() => router.push("/(tabs)")}
          style={{ marginTop: theme.spacing.lg }}
        />
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
          paddingTop: insets.top + 20,
          paddingBottom: theme.spacing.lg,
          paddingHorizontal: theme.spacing.md,
          ...theme.shadows.medium,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.medium,
              marginRight: theme.spacing.md,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.surface}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...theme.typography.h2,
                color: theme.colors.surface,
              }}
            >
              Devolução ao Estoque
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: theme.colors.surface,
            opacity: 0.9,
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          {itensParaDevolucao.length} item(ns) • Localização opcional
        </Text>
      </View>

      {/* Lista de Itens */}
      <FlatList
        data={itensParaDevolucao}
        keyExtractor={(item) => String(item.itemId)}
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: insets.bottom + 120,
        }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: theme.spacing.md }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: theme.spacing.md,
              }}
            >
              <View style={{ flex: 1, marginRight: theme.spacing.md }}>
                <Text
                  style={{
                    ...theme.typography.h4,
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {item.nome}
                </Text>
                <Text
                  style={{
                    ...theme.typography.caption,
                    color: theme.colors.textSecondary,
                  }}
                >
                  Quantidade: {item.quantidade} {item.unidade}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => removerItem(item.itemId)}
                style={{
                  backgroundColor: theme.colors.error,
                  padding: theme.spacing.xs,
                  borderRadius: theme.borderRadius.small,
                }}
              >
                <Ionicons name="close" size={16} color={theme.colors.surface} />
              </TouchableOpacity>
            </View>

            {/* Controles de Quantidade */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: theme.spacing.md,
              }}
            >
              <Text
                style={{
                  ...theme.typography.body,
                  color: theme.colors.text,
                  fontWeight: "600",
                }}
              >
                Quantidade a devolver:
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    alterarQuantidade(
                      item.itemId,
                      Math.max(1, item.quantidade - 1)
                    )
                  }
                  style={{
                    backgroundColor: theme.colors.error,
                    padding: theme.spacing.xs,
                    borderRadius: theme.borderRadius.small,
                  }}
                >
                  <Ionicons
                    name="remove"
                    size={16}
                    color={theme.colors.surface}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    ...theme.typography.h4,
                    color: theme.colors.text,
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  {item.quantidade}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    alterarQuantidade(item.itemId, item.quantidade + 1)
                  }
                  style={{
                    backgroundColor: theme.colors.success,
                    padding: theme.spacing.xs,
                    borderRadius: theme.borderRadius.small,
                  }}
                >
                  <Ionicons name="add" size={16} color={theme.colors.surface} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Campo de Localização */}
            <Input
              label="Localização do item no estoque (opcional)"
              value={item.localizacao || ""}
              onChangeText={(text) => alterarLocalizacao(item.itemId, text)}
              placeholder="Ex: Prateleira A3, Gaveta 2, Sala 101..."
              style={{ marginBottom: 0 }}
            />
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: theme.spacing.xl }}>
            <Ionicons
              name="archive-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text
              style={{
                ...theme.typography.body,
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.md,
                textAlign: "center",
              }}
            >
              Todos os itens foram removidos.
            </Text>
          </View>
        }
      />

      {/* Botões de Ação */}
      {itensParaDevolucao.length > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            paddingBottom: insets.bottom + theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            ...theme.shadows.medium,
          }}
        >
          <Button
            title={
              devolvendo
                ? "Processando..."
                : `Devolver ${itensParaDevolucao.length} item(ns) ao Estoque`
            }
            loading={devolvendo}
            onPress={() => setModalVisible(true)}
            style={{ backgroundColor: theme.colors.secondary }}
          />
        </View>
      )}

      {/* Modal de Confirmação */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.large,
              padding: theme.spacing.lg,
              margin: theme.spacing.lg,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <Text
              style={{
                ...theme.typography.h2,
                color: theme.colors.text,
                marginBottom: theme.spacing.lg,
                textAlign: "center",
              }}
            >
              Confirmar Devolução ao Estoque
            </Text>

            <Text
              style={{
                ...theme.typography.body,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.lg,
                textAlign: "center",
              }}
            >
              Você está devolvendo {itensParaDevolucao.length} item(ns) ao
              estoque. Esta ação aumentará o estoque disponível.
            </Text>

            <Input
              label="Observações (opcional)"
              value={detalhes}
              onChangeText={setDetalhes}
              placeholder="Motivo da devolução, condição dos itens, etc..."
              multiline
              numberOfLines={3}
              style={{ marginBottom: theme.spacing.lg }}
            />

            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.md,
              }}
            >
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Confirmar"
                onPress={confirmarDevolucaoEstoque}
                loading={devolvendo}
                style={{ flex: 1, backgroundColor: theme.colors.secondary }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
