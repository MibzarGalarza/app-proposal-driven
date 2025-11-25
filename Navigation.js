import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


//Iconos
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Importaciones de React Native
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

//Valores globales
import useGlobalState from "./src/store/auth";


//Screens
import LoadingScreen from "./src/pages/login/LoadingScreen";
import LoginScreen from "./src/pages/login/LoginScreen";
import RegisterScreen from "./src/pages/login/RegisterScreen";
import HomeScreen from "./src/pages/home/HomeScreen";
import BuscarDestino from "./src/pages/home/BuscarDestino";
import BuscarInicio from "./src/pages/home/BuscarInicio";
import ViajesScreen from "./src/pages/viajes/ViajesScreen";
import PerfilScreen from "./src/pages/perfil/PerfilScreen";
import EditarPerfilScreen from "./src/pages/perfil/EditarPerfilScreen";
import CambiarPasswordScreen from "./src/pages/perfil/CambiarPasswordScreen";


//Stacks
const Stack = createNativeStackNavigator();
const StackHome = createNativeStackNavigator();

//Button Tabs
const Tab = createBottomTabNavigator();


function MyStackPrincipal() {

  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerTintColor: "#000", // Color del texto del header
        headerStyle: {
          backgroundColor: "#FFF", // Color de fondo del header
        },
      }}
    >
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{
          headerShown: false,
          title: "", // Título vacío
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          title: "", // Título vacío
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          title: "", // Título vacío
        }}
      />
      <Stack.Screen
        name="Home"
        component={TabsNavigator}
        options={{
          headerShown: false,
          title: "", // Título vacío
        }}
      />
    </Stack.Navigator>
  );
}


function MyStackViajes() {

  return (
    <StackHome.Navigator
      initialRouteName="ViajesScreen"
      screenOptions={{
        headerShown: true,
        headerTintColor: "#fff",
        headerShadowVisible: false,
        headerStatusBarHeight: 0,
        headerStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <StackHome.Screen
        name="ViajesScreen"
        component={ViajesScreen}
        options={{
          headerShown: true,
          title: "Viajes",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#f83dd9ff', '#ff6ec7', '#ff9eb8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
    </StackHome.Navigator>
  );
}

function MyStackPerfil() {

  return (
    <StackHome.Navigator
      initialRouteName="PerfilScreen"
      screenOptions={{
        headerShown: true,
        headerTintColor: "#fff",
        headerShadowVisible: false,
        headerStatusBarHeight: 0,
        headerStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <StackHome.Screen
        name="PerfilScreen"
        component={PerfilScreen}
        options={{
          headerShown: true,
          title: "Perfil",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#f83dd9ff', '#ff6ec7', '#ff9eb8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      <StackHome.Screen
        name="EditarPerfil"
        component={EditarPerfilScreen}
        options={{
          headerShown: false,
        }}
      />
      <StackHome.Screen
        name="CambiarPassword"
        component={CambiarPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
    </StackHome.Navigator>
  );
}


function MyStackHome() {

  return (
    <StackHome.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: true,
        headerTintColor: "#fff",
        headerShadowVisible: false,
        headerStatusBarHeight: 0,
        headerStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <StackHome.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: true,
          title: "Solicitar viaje",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#f83dd9ff', '#ff6ec7', '#ff9eb8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      <StackHome.Screen
        name="BuscarDestino"
        component={BuscarDestino}
        options={{
          headerShown: true,
          title: "Selecciona tu destino",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#f83dd9ff', '#ff6ec7', '#ff9eb8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
      <StackHome.Screen
        name="BuscarInicio"
        component={BuscarInicio}
        options={{
          headerShown: true,
          title: "Selecciona tu origen",
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Poppins_600SemiBold",
            fontSize: 20,
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#f83dd9ff', '#ff6ec7', '#ff9eb8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      />
    </StackHome.Navigator>
  );
}


function TabsNavigator() {

  const { showTabs } = useGlobalState();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#f83dd9ff",
        tabBarInactiveTintColor: "#CCC",
        tabBarStyle: {
          backgroundColor: "#FFF",
          display: showTabs ? "flex" : "none",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={MyStackHome}
        options={{
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Poppins_600SemiBold", fontSize: 11 }}>
              Inicio
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Viajes"
        component={MyStackViajes}
        options={{
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Poppins_600SemiBold", fontSize: 11 }}>
              Viajes
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={MyStackPerfil}
        options={{
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontFamily: "Poppins_600SemiBold", fontSize: 11 }}>
              Perfil
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
});

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyStackPrincipal />
    </NavigationContainer>
  );
}