import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { TareaLocal } from './Tipo';

export default function TareasLocalScreen() {
  const db = useSQLiteContext();
  const [tareas, setTareas] = useState<TareaLocal[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState('');

  useEffect(() => { cargar(); }, []);

  async function agregar() {
    if (!nuevaTarea.trim()) return;
    await db.runAsync('INSERT INTO tareas (task) VALUES (?)', [nuevaTarea]);
    setNuevaTarea('');
    await cargar();
  }

  async function cargar() {
    const resultado = await db.getAllAsync<TareaLocal>(
      'SELECT * FROM tareas ORDER BY id DESC'
    );
    setTareas(resultado);
  }

  async function toggleCompletar(tarea: TareaLocal) {
    const nuevoEstado = tarea.completada === 0 ? 1 : 0;
    await db.runAsync(
      'UPDATE tareas SET completada = ? WHERE id = ?',
      [nuevoEstado, tarea.id]
    );
    await cargar();
  }

  async function eliminar(id: number) {
    await db.runAsync('DELETE FROM tareas WHERE id = ?', [id]);
    setTareas(prev => prev.filter(t => t.id !== id));
  }

  const pendientes = tareas.filter(t => t.completada === 0);
  const completadas = tareas.filter(t => t.completada === 1);
  const progreso = tareas.length > 0
    ? Math.round((completadas.length / tareas.length) * 100)
    : 0;

  type Sección = { title: string; data: TareaLocal[] };
  const secciones: Sección[] = [];
  if (pendientes.length) secciones.push({ title: `Por comprar (${pendientes.length})`, data: pendientes });
  if (completadas.length) secciones.push({ title: `Ya en el changuito (${completadas.length})`, data: completadas });

  const todosLosItems = secciones.flatMap(s => [
    { type: 'header', title: s.title, id: s.title } as any,
    ...s.data.map(d => ({ type: 'item', ...d })),
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header verde */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Mi lista del super</Text>
        <Text style={styles.headerSub}>
          {tareas.length === 0
            ? 'Lista vacía'
            : pendientes.length === 0
            ? '¡Todo listo!'
            : `${pendientes.length} producto${pendientes.length !== 1 ? 's' : ''} por comprar`}
        </Text>

        {/* Barra de progreso */}
        {tareas.length > 0 && (
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progreso}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
              {completadas.length} / {tareas.length} completados
            </Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={nuevaTarea}
            onChangeText={setNuevaTarea}
            placeholder="Agregar producto…"
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
      <FlatList
        data={todosLosItems}
        keyExtractor={item => item.id?.toString() ?? item.title}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌿</Text>
            <Text style={styles.emptyText}>
              Tu lista está vacía.{'\n'}Agregá el primer producto arriba.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.sectionLabel}>{item.title}</Text>;
          }
          const tarea = item as TareaLocal & { type: string };
          return (
            <View style={[styles.card, tarea.completada === 1 && styles.cardDone]}>
              <Pressable
                style={[styles.checkBtn, tarea.completada === 1 && styles.checkBtnDone]}
                onPress={() => toggleCompletar(tarea)}
              >
                {tarea.completada === 1 && <Text style={styles.checkMark}>✓</Text>}
              </Pressable>

              <Text style={[styles.itemText, tarea.completada === 1 && styles.itemTextDone]}>
                {tarea.task}
              </Text>

              <Pressable onPress={() => eliminar(tarea.id)} style={styles.delBtn}>
                <Text style={styles.delBtnTxt}>🗑</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const VERDE = '#1a6b3a';
const VERDE_CLARO = '#7de7a5';
const AMARILLO = '#f0a500';

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f0' },
  header: {
    backgroundColor: VERDE,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff', marginBottom: 2 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 12 },
  progressWrap: { marginBottom: 14 },
  progressTrack: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 99, overflow: 'hidden',
  },
  progressFill: { height: 5, backgroundColor: VERDE_CLARO, borderRadius: 99 },
  progressLabel: {
    fontSize: 11, color: 'rgba(255,255,255,0.55)',
    textAlign: 'right', marginTop: 4,
  },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: '#222',
  },
  btnAgregar: {
    backgroundColor: AMARILLO, borderRadius: 10,
    paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
  },
  btnAgregarTxt: { color: '#fff', fontSize: 24, lineHeight: 28 },
  listContent: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: '#888',
    letterSpacing: 0.8, textTransform: 'uppercase',
    marginTop: 16, marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 0.5, borderColor: '#e0e0e0',
    padding: 12, flexDirection: 'row',
    alignItems: 'center', gap: 12, marginBottom: 8,
  },
  cardDone: { opacity: 0.55 },
  checkBtn: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: '#ccc',
    alignItems: 'center', justifyContent: 'center',
  },
  checkBtnDone: { borderColor: VERDE, backgroundColor: VERDE },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  itemText: { flex: 1, fontSize: 15, color: '#222' },
  itemTextDone: { textDecorationLine: 'line-through', color: '#aaa' },
  delBtn: { padding: 4 },
  delBtnTxt: { fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 22 },
});