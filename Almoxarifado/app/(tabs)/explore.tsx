import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

import { theme } from "@/src/styles/theme";

export default function CaixaScreen() {
  const router = useRouter();

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
              Devolução
            </Text>
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
          Retornar itens ao almoxarifado
        </Text>
      </View>

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: theme.spacing.lg,
          paddingBottom: 90,
        }}
      >
        <Ionicons
          name="return-down-back-outline"
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
          Carrinho Vazio
        </Text>

        <Text
          style={{
            ...theme.typography.body,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.md,
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          Para fazer uma devolução, primeiro adicione itens ao carrinho através
          das categorias.
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
    </View>
  );
}
