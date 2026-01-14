import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StatusBar,
  Switch,
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
import {
  Item,
  ativarItem,
  criarItem,
  inativarItem,
  listarItens,
} from "../src/services/api";

type Params = {
  categoriaId: string;
  nome: string;
};

export default function ItensScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { categoriaId, nome } = useLocalSearchParams<Params>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [itens, setItens] = useState<Item[]>([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [criando, setCriando] = useState(false);
  const [mostrandoInativos, setMostrandoInativos] = useState(false);

  // Form para criar item
  const [nomeItem, setNomeItem] = useState("");
  const [tipoItem, setTipoItem] = useState("");
  const [unidadeItem, setUnidadeItem] = useState("UN");
  const [controladoItem, setControladoItem] = useState(false);
  const [estoqueInicialItem, setEstoqueInicialItem] = useState("");

  const { addItem, items } = useCart();

  const carregar = useCallback(async () => {
    const res = await listarItens(categoriaId, mostrandoInativos);
    if (res.success) setItens(res.itens);
    setLoading(false);
  }, [categoriaId, mostrandoInativos]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function onRefresh() {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  }

  function incrementar(id: number) {
    setQuantidades((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  }

  function decrementar(id: number) {
    setQuantidades((prev) => {
      const atual = prev[id] || 0;
      if (atual <= 1) {
        const novo = { ...prev };
        delete novo[id];
        return novo;
      }
      return { ...prev, [id]: atual - 1 };
    });
  }

  function adicionarAoCarrinho() {
    Object.entries(quantidades).forEach(([id, qtd]) => {
      const item = itens.find((i) => i.id === Number(id));
      if (!item) return;

      addItem({
        itemId: item.id,
        nome: item.nome,
        unidade: item.unidade,
        quantidade: qtd,
      });
    });

    setQuantidades({});
    Alert.alert("Sucesso", "Itens adicionados ao carrinho!");
  }

  async function handleCriarItem() {
    if (!nomeItem.trim()) {
      Alert.alert("Erro", "Nome do item é obrigatório");
      return;
    }

    setCriando(true);
    try {
      const dados = {
        nome: nomeItem.trim(),
        categoria_id: Number(categoriaId),
        tipo: tipoItem.trim() || undefined,
        unidade: unidadeItem,
        controlado: controladoItem,
        estoque_inicial:
          controladoItem && estoqueInicialItem
            ? Number(estoqueInicialItem)
            : undefined,
      };

      const result = await criarItem(dados);
      if (result.success && result.item) {
        setItens([
          ...itens,
          { ...result.item, estoque: dados.estoque_inicial || 0 },
        ]);
        limparFormulario();
        setModalVisible(false);
        Alert.alert("Sucesso", "Item criado com sucesso!");
      } else {
        Alert.alert("Erro", result.error || "Erro ao criar item");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
    setCriando(false);
  }

  function limparFormulario() {
    setNomeItem("");
    setTipoItem("");
    setUnidadeItem("UN");
    setControladoItem(false);
    setEstoqueInicialItem("");
  }

  async function inativarItemFunc(itemId: number) {
    try {
      const res = await inativarItem(itemId);
      if (res.success) {
        carregar();
      } else {
        Alert.alert("Erro", res.error || "Erro ao inativar item");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
  }

  async function ativarItemFunc(itemId: number) {
    try {
      const res = await ativarItem(itemId);
      if (res.success) {
        carregar();
      } else {
        Alert.alert("Erro", res.error || "Erro ao ativar item");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
  }

  const totalSelecionado = Object.values(quantidades).reduce(
    (sum, q) => sum + q,
    0
  );

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
            marginTop: theme.spacing.md,
            color: theme.colors.textSecondary,
          }}
        >
          Carregando itens...
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

          <TouchableOpacity
            onPress={() => setMostrandoInativos(!mostrandoInativos)}
            style={{
              backgroundColor: mostrandoInativos
                ? theme.colors.accent
                : theme.colors.primaryDark,
              padding: theme.spacing.xs,
              borderRadius: theme.borderRadius.small,
              marginRight: theme.spacing.md,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <Ionicons
              name={mostrandoInativos ? "eye-off" : "eye"}
              size={16}
              color={theme.colors.surface}
            />
            <Text
              style={{
                color: theme.colors.surface,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {mostrandoInativos ? "Inativos" : "Ativos"}
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={{ ...theme.typography.h2, color: theme.colors.surface }}
            >
              {nome}
            </Text>
            <Text style={{ color: theme.colors.surface, opacity: 0.9 }}>
              {mostrandoInativos ? "Itens Inativos" : "Itens Ativos"} •{" "}
              {itens.length} item{itens.length !== 1 ? "s" : ""} disponíve
              {itens.length !== 1 ? "is" : "l"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: theme.colors.primaryDark,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.medium,
              marginRight: theme.spacing.sm,
            }}
          >
            <Ionicons name="add" size={24} color={theme.colors.surface} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/carrinho")}
            style={{
              backgroundColor:
                items.length > 0
                  ? theme.colors.accent
                  : theme.colors.primaryDark,
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.medium,
              position: "relative",
            }}
          >
            <Ionicons name="bag" size={24} color={theme.colors.surface} />
            {items.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: theme.colors.error,
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: theme.colors.surface,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {items.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Itens */}
      <View style={{ flex: 1, paddingBottom: 120 }}>
        <FlatList
          data={itens}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            padding: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    <Text
                      style={{
                        ...theme.typography.h3,
                        color: item.ativo
                          ? theme.colors.text
                          : theme.colors.textSecondary,
                        flex: 1,
                      }}
                    >
                      {item.nome}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        item.ativo
                          ? inativarItemFunc(item.id)
                          : ativarItemFunc(item.id)
                      }
                      style={{
                        backgroundColor: item.ativo
                          ? theme.colors.error
                          : theme.colors.success,
                        paddingHorizontal: theme.spacing.sm,
                        paddingVertical: 4,
                        borderRadius: theme.borderRadius.small,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.colors.surface,
                          fontSize: 10,
                          fontWeight: "600",
                        }}
                      >
                        {item.ativo ? "INATIVAR" : "ATIVAR"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      ...theme.typography.caption,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {item.tipo && `${item.tipo} • `}
                    Unidade: {item.unidade}
                    {item.controlado &&
                      item.estoque !== undefined &&
                      ` • Estoque: ${item.estoque}`}
                    {item.localizacao && ` • Local: ${item.localizacao}`}
                  </Text>
                </View>

                {item.ativo && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => decrementar(item.id)}
                      disabled={!quantidades[item.id]}
                      style={{
                        backgroundColor: quantidades[item.id]
                          ? theme.colors.error
                          : theme.colors.disabled,
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
                        color: theme.colors.text,
                        minWidth: 30,
                        textAlign: "center",
                      }}
                    >
                      {quantidades[item.id] || 0}
                    </Text>

                    <TouchableOpacity
                      onPress={() => incrementar(item.id)}
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
                )}
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: theme.spacing.xl }}>
              <Ionicons
                name="cube-outline"
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
                {mostrandoInativos
                  ? "Nenhum item inativo encontrado nesta categoria."
                  : "Nenhum item encontrado nesta categoria.\nToque no + para criar um novo item."}
              </Text>
            </View>
          }
        />
      </View>

      {/* Botão Fixo para Adicionar ao Carrinho */}
      {totalSelecionado > 0 && (
        <View
          style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Button
            title={`Adicionar ${totalSelecionado} item${
              totalSelecionado > 1 ? "s" : ""
            } ao carrinho`}
            onPress={adicionarAoCarrinho}
            icon="bag-add"
            fullWidth
          />
        </View>
      )}

      {/* Modal para Criar Item */}
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
              width: "95%",
              maxWidth: 500,
              maxHeight: "90%",
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
              Novo Item
            </Text>

            <Input
              label="Nome do item *"
              value={nomeItem}
              onChangeText={setNomeItem}
              placeholder="Ex: Notebook Dell, Martelo..."
              autoFocus
            />

            <Input
              label="Tipo/Descrição"
              value={tipoItem}
              onChangeText={setTipoItem}
              placeholder="Ex: Ferramenta, Eletrônico..."
            />

            <Input
              label="Unidade"
              value={unidadeItem}
              onChangeText={setUnidadeItem}
              placeholder="UN, KG, M..."
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: theme.spacing.md,
              }}
            >
              <Text
                style={{ ...theme.typography.body, color: theme.colors.text }}
              >
                Item controlado por estoque
              </Text>
              <Switch
                value={controladoItem}
                onValueChange={setControladoItem}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
              />
            </View>

            {controladoItem && (
              <Input
                label="Estoque inicial"
                value={estoqueInicialItem}
                onChangeText={setEstoqueInicialItem}
                placeholder="0"
                keyboardType="numeric"
              />
            )}

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
                onPress={() => {
                  setModalVisible(false);
                  limparFormulario();
                }}
                style={{ flex: 1 }}
              />
              <Button
                title="Criar"
                loading={criando}
                onPress={handleCriarItem}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
