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
import { movimentarItens } from "../src/services/api";
import { loadSession } from "../src/storage/session";

export default function CarrinhoScreen() {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [destino, setDestino] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [processando, setProcessando] = useState(false);
  const [user, setUser] = useState<any>(null);

  const totalItens = items.reduce((sum, i) => sum + i.quantidade, 0);

  useEffect(() => {
    loadSession().then(setUser);
  }, []);

  async function confirmarRetirada() {
    if (!user) {
      Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
      return;
    }

    if (!destino.trim()) {
      Alert.alert("Erro", "Destino é obrigatório");
      return;
    }

    setProcessando(true);
    try {
      const result = await movimentarItens({
        itens: items.map((item) => ({
          itemId: item.itemId,
          quantidade: item.quantidade,
        })),
        usuario_id: user.id,
        destino: destino.trim(),
        detalhes: detalhes.trim() || undefined,
      });

      if (result.success) {
        Alert.alert(
          "Sucesso",
          `Retirada registrada com sucesso!\n\n${totalItens} item(s) retirado(s) para ${destino}.`,
          [
            {
              text: "OK",
              onPress: () => {
                clearCart();
                setDestino("");
                setDetalhes("");
                setModalVisible(false);
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert("Erro", result.error || "Erro ao registrar retirada");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
    setProcessando(false);
  }

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar
          backgroundColor={theme.colors.primary}
          barStyle="light-content"
        />

        <View
          style={{
            backgroundColor: theme.colors.primary,
            paddingTop: insets.top,
            paddingBottom: theme.spacing.lg,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: theme.spacing.md }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.surface}
              />
            </TouchableOpacity>

            <Text
              style={{ ...theme.typography.h1, color: theme.colors.surface }}
            >
              Carrinho
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.lg,
          }}
        >
          <Ionicons
            name="bag-outline"
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
            Seu carrinho está vazio.{"\n"}
            Adicione itens das categorias para continuar.
          </Text>

          <Button
            title="Voltar"
            onPress={() => router.back()}
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>
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
          paddingTop: insets.top,
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
            style={{ marginRight: theme.spacing.md }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.surface}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{ ...theme.typography.h1, color: theme.colors.surface }}
            >
              Carrinho
            </Text>
            <Text style={{ color: theme.colors.surface, opacity: 0.9 }}>
              {items.length} item{items.length !== 1 ? "s" : ""} • {totalItens}{" "}
              unidade{totalItens !== 1 ? "s" : ""}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/devolver")}
            style={{
              backgroundColor: theme.colors.secondary,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.medium,
            }}
          >
            <Ionicons
              name="return-down-back"
              size={24}
              color={theme.colors.surface}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Itens */}
      <View style={{ flex: 1, paddingBottom: 120 }}>
        <FlatList
          contentContainerStyle={{
            padding: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
          }}
          data={items}
          keyExtractor={(item) => String(item.itemId)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ ...theme.typography.h3, color: theme.colors.text }}
                  >
                    {item.nome}
                  </Text>
                  <Text
                    style={{
                      ...theme.typography.caption,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    Unidade: {item.unidade}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      item.quantidade <= 1
                        ? removeItem(item.itemId)
                        : updateQty(item.itemId, item.quantidade - 1)
                    }
                    style={{
                      backgroundColor: theme.colors.error,
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.small,
                    }}
                  >
                    <Ionicons
                      name={item.quantidade <= 1 ? "trash" : "remove"}
                      size={16}
                      color={theme.colors.surface}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      ...theme.typography.body,
                      color: theme.colors.text,
                      minWidth: 30,
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {item.quantidade}
                  </Text>

                  <TouchableOpacity
                    onPress={() => updateQty(item.itemId, item.quantidade + 1)}
                    style={{
                      backgroundColor: theme.colors.primary,
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.small,
                    }}
                  >
                    <Ionicons
                      name="add"
                      size={16}
                      color={theme.colors.surface}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          )}
        />
      </View>

      {/* Botões de Ação */}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.md,
          borderTopWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
          <Button
            title="Limpar Carrinho"
            variant="outline"
            onPress={() => {
              Alert.alert(
                "Confirmar",
                "Deseja remover todos os itens do carrinho?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Limpar",
                    style: "destructive",
                    onPress: clearCart,
                  },
                ]
              );
            }}
            style={{ flex: 1 }}
          />

          <Button
            title="Finalizar Retirada"
            onPress={() => setModalVisible(true)}
            icon="checkmark-circle"
            style={{ flex: 2 }}
          />
        </View>
      </View>

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
              padding: theme.spacing.lg,
              margin: theme.spacing.lg,
              borderRadius: theme.borderRadius.large,
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
              Finalizar Retirada
            </Text>

            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={{
                  ...theme.typography.body,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.sm,
                }}
              >
                Resumo da retirada:
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.colors.text,
                }}
              >
                • {items.length} tipo{items.length !== 1 ? "s" : ""} de item
                {items.length !== 1 ? "s" : ""}
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.colors.text,
                }}
              >
                • {totalItens} unidade{totalItens !== 1 ? "s" : ""} total
              </Text>
            </View>

            <Input
              label="Destino *"
              value={destino}
              onChangeText={setDestino}
              placeholder="Ex: Sala 205, Mesa de João, Estoque externo..."
              autoFocus
            />

            <Input
              label="Observações (opcional)"
              value={detalhes}
              onChangeText={setDetalhes}
              placeholder="Ex: Manutenção preventiva, projeto X..."
              multiline
              numberOfLines={3}
            />

            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.md,
                marginTop: theme.spacing.md,
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
                loading={processando}
                onPress={confirmarRetirada}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
