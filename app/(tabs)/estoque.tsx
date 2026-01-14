import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Dimensions,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/src/components/Button";
import { Card } from "@/src/components/Card";
import { theme } from "@/src/styles/theme";
import { useCart } from "../../src/cart/CartContext";

export default function EstoqueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");
  const isTablet = width >= 768;
  const { items, updateQty, removeItem, clearCart } = useCart();

  const handleDevolucaoEstoque = () => {
    if (items.length === 0) {
      Alert.alert(
        "Aviso",
        "Adicione itens à caixa para fazer devolução ao estoque."
      );
      return;
    }
    router.push("/estoque-devolver");
  };

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
              Devolver ao Estoque
            </Text>
          </View>

          {items.length > 0 && (
            <View
              style={{
                backgroundColor: theme.colors.secondary,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.medium,
              }}
            >
              <Text
                style={{
                  color: theme.colors.surface,
                  fontWeight: "600",
                  fontSize: 12,
                }}
              >
                {items.length} items
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            color: theme.colors.surface,
            opacity: 0.9,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Devolver itens para reposição do estoque
        </Text>
      </View>

      {/* Content */}
      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.lg,
            paddingBottom: insets.bottom + 90,
          }}
        >
          <Ionicons
            name="archive-outline"
            size={100}
            color={theme.colors.textSecondary}
          />

          <Text
            style={{
              ...theme.typography.h2,
              color: theme.colors.text,
              marginTop: theme.spacing.lg,
              textAlign: "center",
            }}
          >
            Nenhum Item para Devolver
          </Text>

          <Text
            style={{
              ...theme.typography.body,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.md,
              textAlign: "center",
              lineHeight: 24,
              maxWidth: isTablet ? "60%" : "100%",
            }}
          >
            Adicione itens à sua caixa para poder devolvê-los ao estoque.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.borderRadius.medium,
              marginTop: theme.spacing.xl,
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <Ionicons
              name="grid-outline"
              size={24}
              color={theme.colors.surface}
            />
            <Text
              style={{
                ...theme.typography.button,
                color: theme.colors.surface,
              }}
            >
              Ver Categorias
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.itemId)}
          contentContainerStyle={{
            padding: theme.spacing.md,
            paddingBottom: insets.bottom + 90,
            gap: isTablet ? theme.spacing.md : theme.spacing.sm,
          }}
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
                    onPress={() => updateQty(item.itemId, item.quantidade + 1)}
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
          ListFooterComponent={() => (
            <View
              style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}
            >
              <Button
                title="Confirmar Devolução ao Estoque"
                onPress={handleDevolucaoEstoque}
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
                        onPress: clearCart,
                      },
                    ]
                  );
                }}
                variant="outline"
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
