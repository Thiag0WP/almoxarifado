import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { CartProvider } from "../src/cart/CartContext";
import { SessionProvider } from "../src/context/SessionContext";
import { loadSession } from "../src/storage/session";

function SessionWrapper({
  children,
  isLogged,
}: {
  children: React.ReactNode;
  isLogged: boolean;
}) {
  if (!isLogged) return children;

  return (
    <SessionProvider>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          // Não fazer nada, apenas capturar o toque para resetar o timeout
        }}
      >
        {children}
      </Pressable>
    </SessionProvider>
  );
}

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const user = await loadSession();
      setIsLogged(!!user);
      setLoading(false);
    }
    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CartProvider>
      <SessionWrapper isLogged={isLogged}>
        <Stack screenOptions={{ headerShown: false }}>
          {!isLogged ? (
            <Stack.Screen name="login" />
          ) : (
            <Stack.Screen name="(tabs)" />
          )}
        </Stack>
      </SessionWrapper>
    </CartProvider>
  );
}
