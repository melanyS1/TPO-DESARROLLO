// screens/HomeScreen.tsx
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, "Home">;
interface Props { navigation: HomeNavProp; }

const APPS = [
  {
    ruta: "Tareas" as keyof RootStackParamList,
    emoji: "📋",
    titulo: "Mis tareas",
    sub: "Organizá lo que tenés que hacer",
    color: "#1B3A6B",
    fondo: "#EEF2FF",
  },
  {
    ruta: "TareasLocal" as keyof RootStackParamList,
    emoji: "🛒",
    titulo: "Lista del super",
    sub: "Llevá el control de las compras",
    color: "#1a6b3a",
    fondo: "#EDFBF3",
  },
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Estrellas decorativas */}
        <Text style={[styles.star, styles.s1]}>★</Text>
        <Text style={[styles.star, styles.s2]}>✦</Text>
        <Text style={[styles.star, styles.s3]}>★</Text>
        <Text style={[styles.star, styles.s4]}>✦</Text>
        <Text style={[styles.star, styles.s5]}>★</Text>
        <Text style={[styles.star, styles.s6]}>✦</Text>

        <View style={styles.headerWrap}>
          <Text style={styles.saludo}>Hola 👋</Text>
          <Text style={styles.titulo}>¿Qué querés{"\n"}hacer hoy?</Text>
        </View>

        <View style={styles.cards}>
          {APPS.map((app) => (
            <Pressable
              key={app.ruta}
              style={({ pressed }) => [
                styles.card,
                { borderLeftColor: app.color, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() => navigation.navigate(app.ruta as any)}
            >
              <View style={[styles.iconWrap, { backgroundColor: app.fondo }]}>
                <Text style={styles.emoji}>{app.emoji}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitulo, { color: app.color }]}>
                  {app.titulo}
                </Text>
                <Text style={styles.cardSub}>{app.sub}</Text>
              </View>
              <Text style={[styles.arrow, { color: app.color }]}>›</Text>
            </Pressable>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f7f5" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },

  // Estrellas
  star: { position: "absolute", color: "#1B3A6B" },
  s1: { top: 30,  right: 28,  fontSize: 28, opacity: 0.12 },
  s2: { top: 80,  right: 60,  fontSize: 14, opacity: 0.18 },
  s3: { top: 55,  right: 90,  fontSize: 20, opacity: 0.08 },
  s4: { top: 120, right: 30,  fontSize: 10, opacity: 0.20 },
  s5: { top: 20,  left: 30,   fontSize: 12, opacity: 0.15 },
  s6: { top: 100, left: 50,   fontSize: 18, opacity: 0.09 },

  headerWrap: { marginBottom: 36, marginTop: 8 },
  saludo: { fontSize: 15, color: "#999", marginBottom: 6 },
  titulo: { fontSize: 30, fontWeight: "700", color: "#111", lineHeight: 36 },

  cards: { gap: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    borderLeftWidth: 4,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 26 },
  cardText: { flex: 1 },
  cardTitulo: { fontSize: 16, fontWeight: "600", marginBottom: 3 },
  cardSub: { fontSize: 13, color: "#999" },
  arrow: { fontSize: 26, fontWeight: "300" },
});