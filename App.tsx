import { StyleSheet, Text, View, Button } from "react-native";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { SQLiteProvider } from "expo-sqlite";
import { initDB } from "./database/initDB";

interface Cliente {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
}

interface BadgeProps {
  texto: string;
  color?: string;
}

interface MostrarProductoProps {
  productos: Producto[];
}

function SaludarCliente({ id, nombre }: Cliente) {
  return (
    <Text>
      Hola {nombre} tu id es {id}
    </Text>
  );
}

function Badge({ texto, color = "blue" }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

function MostrarProducto({ productos }: MostrarProductoProps) {
  return (
    <View>
      {productos.map((producto) => (
        <View key={producto.id}>
          <Text>{producto.nombre}</Text>
          <Text>Precio: ${producto.precio.toFixed(2)}</Text>
          <Text>Disponible: {producto.disponible ? "Sí" : "No"}</Text>
        </View>
      ))}
    </View>
  );
}

export default function App() {
  let miVariable: String = "Jijo";
  let blip: number = 5;
  let blop: boolean = true;
  let blup: String[] = ["hola", "mundo"];
  let productos: Producto[] = [
    { id: 1, nombre: "Producto A", precio: 19.99, disponible: true },
    { id: 2, nombre: "Producto B", precio: 29.99, disponible: false },
    { id: 3, nombre: "Producto C", precio: 39.99, disponible: true },
  ];

  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarMensaje = (): void => {
    setMensaje("Puta");
  };

  return (
    <>
      {/*
    <View style={styles.container}>
      <Text>variable {miVariable}</Text>

      <SaludarCliente id={1} nombre='Juan' />

      <MostrarProducto productos={productos} />

      <Badge texto='Nuevo' color='green' />

      <Badge texto='En oferta' />

      <StatusBar style="auto" />

      <Contador />

      <Text>
        {mensaje ?? 'No hay mensaje'}
      </Text>

      <Button
        title='Cargar mensaje'
        onPress={cargarMensaje}
      />
    </View>
    */}
      <SQLiteProvider databaseName="tareas.db" onInit={initDB}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SQLiteProvider>
      {/*
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>*/}

    </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  texto: {
    color: "white",
    fontWeight: "bold",
  },
});