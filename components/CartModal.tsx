import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../src/cart/CartContext";

export function CartModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, clear } = useCart();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "80%",
            height: "100%",
            backgroundColor: "#fff",
            padding: 16,
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>✖ Minimizar</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 20, marginBottom: 12 }}>Carrinho</Text>

          <FlatList
            data={items}
            keyExtractor={(i) => String(i.itemId)}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 12 }}>
                <Text>{item.nome}</Text>
                <Text>Qtd: {item.quantidade}</Text>
                <TouchableOpacity onPress={() => removeItem(item.itemId)}>
                  <Text style={{ color: "red" }}>Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <TouchableOpacity onPress={clear} style={{ marginTop: 16 }}>
            <Text style={{ color: "red" }}>Limpar carrinho</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
