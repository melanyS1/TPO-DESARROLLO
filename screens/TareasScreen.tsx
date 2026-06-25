import { useState, useEffect } from "react";
import {
  View, Text, FlatList, TextInput, Pressable,
  ActivityIndicator, StyleSheet, SafeAreaView,
} from "react-native";
import { Tarea } from "./Tipo";
import { tareasApi } from "../services/tareasApi";
import { showToast } from '../modules/ToastModule';


type Estado = "cargando" | "error" | "listo";

const VERDE = "#1a6b3a";
const VERDE_CLARO = "#7de7a5";
const VERDE_FONDO = "#EDFBF3";
const AMARILLO = "#f0a500";

export default function TareasScreen() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [estado, setEstado] = useState<Estado>("cargando");
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEdicion, setTextoEdicion] = useState("");

  useEffect(() => {
    cargar();
    showToast("Componente Android funcionando");

  }, []);
  
  async function cargar() {
    setEstado("cargando");
    try {
      const res = await tareasApi.getAll();
      setTareas(res.data);
      setEstado("listo");
    } catch {
      setEstado("error");
    }
  }

  async function agregar() {
    if (!nuevaTarea.trim()) return;
    try {
      await tareasApi.create(nuevaTarea);
      setNuevaTarea("");
      showToast('✅ Tarea agregada');  // ← agregás esta línea
      await cargar();
    } catch { setEstado("error"); }
  }

  async function eliminar(id: string) {
    try {
      await tareasApi.remove(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
      showToast('🗑 Tarea eliminada');  // ← agregás esta línea
    } catch { setEstado("error"); }
  }

  async function guardarEdicion() {
    if (!editandoId) return;
    try {
      await tareasApi.update(editandoId, textoEdicion);
      setEditandoId(null);
      await cargar();
    } catch { setEstado("error"); }
  }

  if (estado === "cargando") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={VERDE} />
      </View>
    );
  }

  if (estado === "error") {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTxt}>Error al cargar las tareas</Text>
        <Pressable style={styles.btnAmarillo} onPress={cargar}>
          <Text style={styles.btnTxt}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Mis tareas</Text>
        <Text style={styles.headerSub}>
          {tareas.length === 0
            ? "Sin tareas todavía"
            : `${tareas.length} tarea${tareas.length !== 1 ? "s" : ""}`}
        </Text>

        {/* Input agregar */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={nuevaTarea}
            onChangeText={setNuevaTarea}
            placeholder="Nueva tarea…"
            placeholderTextColor="#999"
            returnKeyType="done"
            onSubmitEditing={agregar}
          />
          <Pressable style={styles.btnAgregar} onPress={agregar}>
            <Text style={styles.btnAgregarTxt}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Lista */}
      <FlatList<Tarea>
        data={tareas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌿</Text>
            <Text style={styles.emptyTxt}>
              No hay tareas todavía.{"\n"}Agregá la primera arriba.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editandoId === item.id ? (
              // Modo edición
              <>
                <TextInput
                  value={textoEdicion}
                  onChangeText={setTextoEdicion}
                  style={styles.inputEdicion}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={guardarEdicion}
                />
                <Pressable style={styles.btnGuardar} onPress={guardarEdicion}>
                  <Text style={styles.btnTxt}>✓</Text>
                </Pressable>
                <Pressable
                  style={styles.btnCancelar}
                  onPress={() => setEditandoId(null)}
                >
                  <Text style={styles.btnTxt}>✕</Text>
                </Pressable>
              </>
            ) : (
              // Modo lectura
              <>
                <Text style={styles.itemTxt}>{item.task}</Text>
                <Pressable
                  style={styles.btnEditar}
                  onPress={() => {
                    setEditandoId(item.id);
                    setTextoEdicion(item.task);
                  }}
                >
                  <Text style={styles.btnTxt}>✏️</Text>
                </Pressable>
                <Pressable
                  style={styles.btnEliminar}
                  onPress={() => eliminar(item.id)}
                >
                  <Text style={styles.btnTxt}>🗑</Text>
                </Pressable>
              </>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f0" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },

  // Header
  header: {
    backgroundColor: VERDE,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#fff", marginBottom: 2 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 14 },

  inputRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: "#222",
  },
  btnAgregar: {
    backgroundColor: AMARILLO, borderRadius: 10,
    paddingHorizontal: 16, alignItems: "center", justifyContent: "center",
  },
  btnAgregarTxt: { color: "#fff", fontSize: 24, lineHeight: 28 },

  // Lista
  listContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  itemTxt: { flex: 1, fontSize: 15, color: "#222" },

  // Edición
  inputEdicion: {
    flex: 1, borderWidth: 1.5, borderColor: VERDE,
    borderRadius: 8, padding: 8, fontSize: 14, color: "#222",
  },
  btnGuardar: {
    backgroundColor: VERDE, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  btnCancelar: {
    backgroundColor: "#ccc", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  btnEditar: {
    backgroundColor: VERDE_FONDO, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  btnEliminar: {
    backgroundColor: "#fff0f0", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  btnAmarillo: {
    backgroundColor: AMARILLO, borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  btnTxt: { fontSize: 15 },

  // Empty / error
  emptyState: { alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTxt: { fontSize: 14, color: "#aaa", textAlign: "center", lineHeight: 22 },
  errorTxt: { color: "#c00", fontSize: 15, marginBottom: 8 },
});