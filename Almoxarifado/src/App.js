// // src/App.js

// import { useEffect, useState } from 'react';
// import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

// import LoginScreen from './screens/LoginScreen';
// import { clearSession, loadSession } from './storage/session';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function init() {
//       const sessionUser = await loadSession();
//       setUser(sessionUser);
//       setLoading(false);
//     }

//     init();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <LoginScreen
//         onLoginSuccess={(u) => setUser(u)}
//       />
//     );
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 32,
//       }}
//     >
//       <Text style={{ fontSize: 22, marginBottom: 16 }}>
//         Bem-vindo, {user.nome}
//       </Text>

//       <TouchableOpacity
//         onPress={async () => {
//           await clearSession();
//           setUser(null);
//         }}
//         style={{
//           backgroundColor: '#c62828',
//           padding: 12,
//           borderRadius: 6,
//         }}
//       >
//         <Text style={{ color: '#fff' }}>Sair</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
