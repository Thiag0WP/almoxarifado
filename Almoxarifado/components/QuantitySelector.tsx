import { Text, TouchableOpacity, View } from "react-native";

export function QuantitySelector({
  quantidade,
  estoqueAtual,
  onChange,
}: {
  quantidade: number;
  estoqueAtual: number;
  onChange: (qtd: number) => void;
}) {
  const restante = estoqueAtual - quantidade;

  return (
    <View style={{ marginTop: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={() => onChange(Math.max(1, quantidade - 1))}>
          <Text style={{ fontSize: 22 }}>−</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 18 }}>{quantidade}</Text>

        <TouchableOpacity
          onPress={() =>
            onChange(quantidade < estoqueAtual ? quantidade + 1 : quantidade)
          }
        >
          <Text style={{ fontSize: 22 }}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 4 }}>
        Estoque após retirada: <Text style={{ color: "red" }}>{restante}</Text>
      </Text>
    </View>
  );
}
