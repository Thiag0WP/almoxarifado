import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../src/cart/CartContext";

export function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const router = useRouter();
  const { items } = useCart();

  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#ddd",
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ fontSize: 18 }}>← Voltar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenCart}>
        <Text style={{ fontSize: 18 }}>
          🛒 {items.length > 0 ? `(${items.length})` : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
