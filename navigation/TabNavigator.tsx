// navigation/TabNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen
from '../screens/HomeScreen';
type TabParamList = {
Home: undefined;  Lista: undefined;  Ajustes: undefined; };
const Tab = createBottomTabNavigator<TabParamList>();
export default function TabNavigator() {
    return (
    <Tab.Navigator>
    <Tab.Screen name='Home' component={HomeScreen} options={{title:'Inicio'}} />
    </Tab.Navigator>
);
}