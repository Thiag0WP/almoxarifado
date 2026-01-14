import {
  Categoria,
  criarCategoria,
  listarCategorias,
} from "@/src/services/api";
import { clearSession } from "@/src/storage/session";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/src/cart/CartContext";
import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { Input } from "@/src/components/Input";
import { theme } from "@/src/styles/theme";

export default function CategoriasScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBuscaVisible, setModalBuscaVisible] = useState(false);
  const [modalCaixaVisible, setModalCaixaVisible] = useState(false);
  const [mostrandoInativos, setMostrandoInativos] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [termoBusca, setTermoBusca] = useState("");
  const [criando, setCriando] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768;
  const { items, updateQty, removeItem, clearCart } = useCart();

  const carregar = useCallback(async () => {
    const res = await listarCategorias(mostrandoInativos);
    if (res.success) {
      setCategorias(res.categorias);
    }
    setLoading(false);
  }, [mostrandoInativos]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function onRefresh() {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  }

  async function handleCriarCategoria() {
    if (!nomeCategoria.trim()) {
      Alert.alert("Erro", "Nome da categoria é obrigatório");
      return;
    }

    setCriando(true);
    try {
      const result = await criarCategoria(nomeCategoria.trim());
      if (result.success && result.categoria) {
        setCategorias(
          [...categorias, result.categoria].sort((a, b) =>
            a.nome.localeCompare(b.nome)
          )
        );
        setNomeCategoria("");
        setModalVisible(false);
        Alert.alert("Sucesso", "Categoria criada com sucesso!");
      } else {
        Alert.alert("Erro", result.error || "Erro ao criar categoria");
      }
    } catch {
      Alert.alert("Erro", "Erro de comunicação com o servidor");
    }
    setCriando(false);
  }

  async function handleLogout() {
    Alert.alert("Confirmar saída", "Deseja realmente sair do sistema?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await clearSession();
          router.replace("/login");
        },
      },
    ]);
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
            marginTop: theme.spacing.md,
            color: theme.colors.textSecondary,
          }}
        >
          Carregando categorias...
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
          paddingTop: 50,
          paddingBottom: theme.spacing.lg,
          paddingHorizontal: theme.spacing.md,
          ...theme.shadows.medium,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...theme.typography.h1,
                color: theme.colors.surface,
              }}
            >
              Almoxarifado TI
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
            <TouchableOpacity
              onPress={() => setModalBuscaVisible(true)}
              style={{
                backgroundColor: theme.colors.secondary,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.medium,
              }}
            >
              <Ionicons name="search" size={24} color={theme.colors.surface} />
            </TouchableOpacity>

            {items.length > 0 && (
              <TouchableOpacity
                onPress={() => setModalCaixaVisible(true)}
                style={{
                  backgroundColor: theme.colors.success,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.medium,
                  position: "relative",
                }}
              >
                <Ionicons name="cube" size={24} color={theme.colors.surface} />
                {items.length > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
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
            )}

            <TouchableOpacity
              onPress={() => setMostrandoInativos(!mostrandoInativos)}
              style={{
                backgroundColor: mostrandoInativos
                  ? theme.colors.warning
                  : theme.colors.secondary,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.medium,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons
                name={mostrandoInativos ? "eye-off" : "eye"}
                size={20}
                color={theme.colors.surface}
              />
              {isTablet && (
                <Text
                  style={{
                    color: theme.colors.surface,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {mostrandoInativos ? "Inativas" : "Ativas"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: theme.colors.accent,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.medium,
              }}
            >
              <Ionicons name="add" size={24} color={theme.colors.surface} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: theme.colors.error,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.medium,
              }}
            >
              <Ionicons name="log-out" size={24} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            color: theme.colors.surface,
            opacity: 0.9,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {mostrandoInativos ? "Categorias Inativas" : "Categorias Ativas"}
        </Text>
        <Text
          style={{
            color: theme.colors.surface,
            opacity: 0.9,
            marginTop: theme.spacing.xs,
          }}
        >
          {categorias.length} categoria{categorias.length !== 1 ? "s" : ""}{" "}
          disponíve{categorias.length !== 1 ? "is" : "l"}
        </Text>
      </View>

      {/* Lista de Categorias */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        numColumns={isTablet ? 2 : 1}
        key={isTablet ? 2 : 1}
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: insets.bottom + 100,
          flexGrow: 1,
        }}
        columnWrapperStyle={isTablet ? { gap: theme.spacing.md } : undefined}
        renderItem={({ item }) => (
          <Card style={isTablet ? { flex: 1 } : undefined}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/itens",
                  params: {
                    categoriaId: item.id,
                    nome: item.nome,
                  },
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...theme.typography.h3,
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
                  Toque para ver os itens
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: theme.spacing.xl }}>
            <Ionicons
              name="folder-outline"
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
              Nenhuma categoria encontrada.{"\n"}Toque no + para criar uma nova
              categoria.
            </Text>
          </View>
        }
      />

      {/* Modal para Criar Categoria */}
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
              Nova Categoria
            </Text>

            <Input
              label="Nome da categoria"
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
              placeholder="Ex: Eletrônicos, Ferramentas..."
              autoFocus
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
                onPress={() => {
                  setModalVisible(false);
                  setNomeCategoria("");
                }}
                style={{ flex: 1 }}
              />
              <Button
                title="Criar"
                loading={criando}
                onPress={handleCriarCategoria}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Buscar Itens */}
      <Modal
        visible={modalBuscaVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalBuscaVisible(false)}
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
              maxHeight: "80%",
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
              Buscar Item Existente
            </Text>

            <Input
              label="Nome do item"
              value={termoBusca}
              onChangeText={setTermoBusca}
              placeholder="Digite o nome do item..."
              autoFocus
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
                onPress={() => {
                  setModalBuscaVisible(false);
                  setTermoBusca("");
                }}
                style={{ flex: 1 }}
              />
              <Button
                title="Buscar"
                onPress={() => {
                  // Implementar busca aqui
                  Alert.alert(
                    "Info",
                    "Funcionalidade de busca será implementada em breve!"
                  );
                  setModalBuscaVisible(false);
                  setTermoBusca("");
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal da Caixa */}
      <Modal
        visible={modalCaixaVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCaixaVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.borderRadius.large,
              borderTopRightRadius: theme.borderRadius.large,
              padding: theme.spacing.lg,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.lg,
              }}
            >
              <Text
                style={{
                  ...theme.typography.h2,
                  color: theme.colors.text,
                }}
              >
                Caixa de Itens
              </Text>
              <TouchableOpacity
                onPress={() => setModalCaixaVisible(false)}
                style={{
                  padding: theme.spacing.sm,
                }}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => String(item.itemId)}
              renderItem={({ item }) => (
                <Card>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1 }}>
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
                        {item.quantidade} {item.unidade}
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
                        onPress={() => {
                          if (item.quantidade > 1) {
                            updateQty(item.itemId, item.quantidade - 1);
                          } else {
                            removeItem(item.itemId);
                          }
                        }}
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
                          minWidth: 30,
                          textAlign: "center",
                        }}
                      >
                        {item.quantidade}
                      </Text>

                      <TouchableOpacity
                        onPress={() =>
                          updateQty(item.itemId, item.quantidade + 1)
                        }
                        style={{
                          backgroundColor: theme.colors.success,
                          padding: theme.spacing.xs,
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
              style={{ maxHeight: 300 }}
            />

            <View
              style={{ marginTop: theme.spacing.lg, gap: theme.spacing.sm }}
            >
              <Button
                title="Devolver Itens"
                onPress={() => {
                  setModalCaixaVisible(false);
                  router.push("/devolver");
                }}
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <Button
                title="Limpar Caixa"
                onPress={() => {
                  Alert.alert(
                    "Confirmar",
                    "Deseja limpar todos os itens da caixa?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Limpar",
                        style: "destructive",
                        onPress: () => {
                          clearCart();
                          setModalCaixaVisible(false);
                        },
                      },
                    ]
                  );
                }}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
