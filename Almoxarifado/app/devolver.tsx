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
import { devolverItens } from "../src/services/api";
import { loadSession } from "../src/storage/session";

type ItemDevolucao = {
  itemId: number;
  nome: string;
  quantidade: number;
  unidade: string;
  tipoRetorno: "RETORNA" | "NAO_RETORNA";
};

export default function DevolverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, clearCart } = useCart();

  const [itensParaDevolucao, setItensParaDevolucao] = useState<ItemDevolucao[]>(
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [detalhes, setDetalhes] = useState("");
  const [devolvendo, setDevolvendo] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Converte itens do carrinho para formato de devolução
    const itensConvertidos = items.map((item) => ({
      itemId: item.itemId,
      nome: item.nome,
      quantidade: item.quantidade,
      unidade: item.unidade,
      tipoRetorno: "RETORNA" as const, // Por padrão, assume que retorna
    }));
    setItensParaDevolucao(itensConvertidos);

    // Carrega dados do usuário
    loadSession().then(setUser);
  }, [items]);

  function alterarTipoRetorno(itemId: number, tipo: "RETORNA" | "NAO_RETORNA") {
    setItensParaDevolucao((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, tipoRetorno: tipo } : item
      )
    );
  }

  function alterarQuantidade(itemId: number, quantidade: number) {
    if (quantidade <= 0) return;

    setItensParaDevolucao((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, quantidade } : item
      )
    );
  }

  function removerItem(itemId: number) {
    setItensParaDevolucao((prev) =>
      prev.filter((item) => item.itemId !== itemId)
    );
  }

  async function confirmarDevolucao() {
    if (!user) {
      Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
      return;
    }

    const itensParaRetornar = itensParaDevolucao.filter(
      (item) => item.tipoRetorno === "RETORNA"
    );

    if (itensParaRetornar.length === 0) {
      Alert.alert(
        "Aviso",
        "Nenhum item marcado para devolução ao almoxarifado."
      );
      setModalVisible(false);
      clearCart();
      router.back();
      return;
    }

    setDevolvendo(true);
    try {
      const result = await devolverItens({
        itens: itensParaRetornar.map((item) => ({
          itemId: item.itemId,
          quantidade: item.quantidade,
        })),
        usuario_id: user.id,
        detalhes: detalhes || "Devolução via app mobile",
      });

      if (result.success) {
        Alert.alert(
          "Sucesso",
          `Devolução registrada com sucesso!\n\n${itensParaRetornar.length} item(s) devolvido(s) ao almoxarifado.`,
          [
            {
              text: "OK",
              onPress: () => {
                clearCart();
                setModalVisible(false);
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert("Erro", result.error || "Erro ao registrar devolução");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
    setDevolvendo(false);
  }

  const itensQueRetornam = itensParaDevolucao.filter(
    (item) => item.tipoRetorno === "RETORNA"
  );
  const itensQueNaoRetornam = itensParaDevolucao.filter(
    (item) => item.tipoRetorno === "NAO_RETORNA"
  );

  if (itensParaDevolucao.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar
          backgroundColor={theme.colors.secondary}
          barStyle="light-content"
        />

        <View
          style={{
            backgroundColor: theme.colors.secondary,
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
              Devolução
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
            name="return-down-back-outline"
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
            Nenhum item selecionado para devolução.{"\n"}
            Adicione itens ao carrinho primeiro.
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
        backgroundColor={theme.colors.secondary}
        barStyle="light-content"
      />

      {/* Header */}
      <View
        style={{
          backgroundColor: theme.colors.secondary,
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
              Devolução de Itens
            </Text>
            <Text style={{ color: theme.colors.surface, opacity: 0.9 }}>
              {itensParaDevolucao.length} item
              {itensParaDevolucao.length !== 1 ? "s" : ""} para processar
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, padding: theme.spacing.md }}>
        {/* Instruções */}
        <Card style={{ backgroundColor: theme.colors.warning + "20" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Ionicons
              name="information-circle"
              size={24}
              color={theme.colors.warning}
              style={{ marginRight: theme.spacing.sm }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...theme.typography.h3,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Como funciona a devolução?
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.colors.textSecondary,
                }}
              >
                • <Text style={{ fontWeight: "600" }}>RETORNA:</Text> Item volta
                para o almoxarifado (ex: ferramentas, equipamentos){"\n"}•{" "}
                <Text style={{ fontWeight: "600" }}>NÃO RETORNA:</Text> Item
                fica com a pessoa (ex: mouse, pilhas, materiais de consumo)
              </Text>
            </View>
          </View>
        </Card>

        {/* Lista de Itens */}
        <FlatList
          data={itensParaDevolucao}
          keyExtractor={(item) => String(item.itemId)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card>
              <View style={{ marginBottom: theme.spacing.md }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        ...theme.typography.h3,
                        color: theme.colors.text,
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
                      {item.quantidade} {item.unidade}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => removerItem(item.itemId)}>
                    <Ionicons
                      name="close"
                      size={20}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>

                {/* Controle de Quantidade */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: theme.spacing.md,
                  }}
                >
                  <Text
                    style={{
                      ...theme.typography.body,
                      marginRight: theme.spacing.md,
                    }}
                  >
                    Quantidade:
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
                        alterarQuantidade(item.itemId, item.quantidade - 1)
                      }
                      style={{
                        backgroundColor: theme.colors.error,
                        padding: theme.spacing.sm,
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
                        ...theme.typography.body,
                        minWidth: 30,
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {item.quantidade}
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        alterarQuantidade(item.itemId, item.quantidade + 1)
                      }
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

                {/* Tipo de Retorno */}
                <View>
                  <Text
                    style={{
                      ...theme.typography.body,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    Este item:
                  </Text>

                  <View style={{ flexDirection: "row", gap: theme.spacing.md }}>
                    <TouchableOpacity
                      onPress={() => alterarTipoRetorno(item.itemId, "RETORNA")}
                      style={{
                        flex: 1,
                        backgroundColor:
                          item.tipoRetorno === "RETORNA"
                            ? theme.colors.secondary
                            : theme.colors.border,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.medium,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="return-down-back"
                        size={16}
                        color={
                          item.tipoRetorno === "RETORNA"
                            ? theme.colors.surface
                            : theme.colors.textSecondary
                        }
                        style={{ marginRight: theme.spacing.xs }}
                      />
                      <Text
                        style={{
                          color:
                            item.tipoRetorno === "RETORNA"
                              ? theme.colors.surface
                              : theme.colors.textSecondary,
                          fontWeight: "600",
                          fontSize: 14,
                        }}
                      >
                        RETORNA
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        alterarTipoRetorno(item.itemId, "NAO_RETORNA")
                      }
                      style={{
                        flex: 1,
                        backgroundColor:
                          item.tipoRetorno === "NAO_RETORNA"
                            ? theme.colors.accent
                            : theme.colors.border,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.medium,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="person"
                        size={16}
                        color={
                          item.tipoRetorno === "NAO_RETORNA"
                            ? theme.colors.surface
                            : theme.colors.textSecondary
                        }
                        style={{ marginRight: theme.spacing.xs }}
                      />
                      <Text
                        style={{
                          color:
                            item.tipoRetorno === "NAO_RETORNA"
                              ? theme.colors.surface
                              : theme.colors.textSecondary,
                          fontWeight: "600",
                          fontSize: 14,
                        }}
                      >
                        NÃO RETORNA
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      </View>

      {/* Resumo e Botão de Confirmar */}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.md,
          borderTopWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: theme.spacing.md,
          }}
        >
          <Text
            style={{
              ...theme.typography.body,
              color: theme.colors.textSecondary,
            }}
          >
            Retornam ao almoxarifado:
          </Text>
          <Text
            style={{
              ...theme.typography.body,
              fontWeight: "600",
              color: theme.colors.secondary,
            }}
          >
            {itensQueRetornam.length} item
            {itensQueRetornam.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: theme.spacing.md,
          }}
        >
          <Text
            style={{
              ...theme.typography.body,
              color: theme.colors.textSecondary,
            }}
          >
            Ficam com a pessoa:
          </Text>
          <Text
            style={{
              ...theme.typography.body,
              fontWeight: "600",
              color: theme.colors.accent,
            }}
          >
            {itensQueNaoRetornam.length} item
            {itensQueNaoRetornam.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <Button
          title="Confirmar Devolução"
          onPress={() => setModalVisible(true)}
          icon="checkmark-circle"
          fullWidth
        />
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
              Confirmar Devolução
            </Text>

            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={{
                  ...theme.typography.body,
                  color: theme.colors.textSecondary,
                  marginBottom: theme.spacing.sm,
                }}
              >
                Resumo:
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.colors.text,
                }}
              >
                • {itensQueRetornam.length} item
                {itensQueRetornam.length !== 1 ? "s" : ""} retorna
                {itensQueRetornam.length === 1 ? "" : "m"} ao almoxarifado
              </Text>
              <Text
                style={{
                  ...theme.typography.caption,
                  color: theme.colors.text,
                }}
              >
                • {itensQueNaoRetornam.length} item
                {itensQueNaoRetornam.length !== 1 ? "s" : ""} fica
                {itensQueNaoRetornam.length === 1 ? "" : "m"} com a pessoa
              </Text>
            </View>

            <Input
              label="Observações (opcional)"
              value={detalhes}
              onChangeText={setDetalhes}
              placeholder="Ex: Item danificado, devolução parcial..."
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
                loading={devolvendo}
                onPress={confirmarDevolucao}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
