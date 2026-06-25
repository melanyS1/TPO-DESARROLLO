import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import TareasScreen from "../screens/TareasScreen";
import TareasLocalScreen from "../screens/TareasLocalScreen";
// Stack tipado: sabe que pantallas existen y sus parametros
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tareas" component={TareasScreen} />
      <Stack.Screen name="TareasLocal" component={TareasLocalScreen} />
    </Stack.Navigator>
  );
}