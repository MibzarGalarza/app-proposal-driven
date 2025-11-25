# 🚗 Woman Drive - Aplicación de Transporte

Una aplicación móvil desarrollada con React Native y Expo, diseñada específicamente para ofrecer un servicio de transporte seguro para mujeres.

## 📋 Características

- ✅ Sistema de autenticación (Login/Registro)
- ✅ Gestión de perfil de usuario con foto
- ✅ Búsqueda de rutas con Google Maps
- ✅ Visualización de mapas interactivos
- ✅ Historial de viajes
- ✅ Cambio de contraseña
- ✅ Animaciones Lottie
- ✅ Detección de conectividad a internet
- ✅ Almacenamiento local con AsyncStorage

## 🚀 Tecnologías Utilizadas

- **React Native** - Framework para desarrollo móvil
- **Expo** - Plataforma de desarrollo
- **React Navigation** - Navegación entre pantallas
- **Google Maps API** - Mapas y direcciones
- **Zustand** - Gestión de estado
- **AsyncStorage** - Almacenamiento local
- **Expo Image Picker** - Selección de imágenes
- **Lottie** - Animaciones

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) en tu dispositivo móvil (iOS/Android)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MibzarGalarza/app-proposal-driven.git
cd app-proposal-driven
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.template`:

```bash
cp .env.template .env
```

Luego edita el archivo `.env` y agrega tus propias API keys:

```properties
# Google Places API Key (para autocompletado de direcciones)
API_KEY=tu_google_places_api_key_aqui

# Google Maps API Key (para mapas y direcciones)
API_KEY_MAPS=tu_google_maps_api_key_aqui
```

### 4. Obtener las API Keys de Google

#### Google Places API:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Places API**
4. Ve a "Credenciales" y crea una API Key
5. Restringe la key para usar solo Places API

#### Google Maps API:
1. En el mismo proyecto de Google Cloud Console
2. Habilita las siguientes APIs:
   - **Maps SDK for Android** (si vas a probar en Android)
   - **Maps SDK for iOS** (si vas a probar en iOS)
   - **Directions API**
   - **Geocoding API**
3. Crea otra API Key o usa la misma
4. Configura las restricciones necesarias

### 5. Configurar Babel (ya configurado)

El proyecto ya incluye la configuración de `react-native-dotenv` en `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
```

## 🎮 Ejecutar la aplicación

### Modo desarrollo

```bash
npm start
# o
expo start
```

Esto abrirá Expo Dev Tools en tu navegador. Desde ahí puedes:

- Escanear el código QR con la app **Expo Go** en tu dispositivo móvil
- Presionar `a` para abrir en emulador Android
- Presionar `i` para abrir en simulador iOS
- Presionar `w` para abrir en el navegador web

### Limpiar caché (recomendado si hay problemas)

```bash
npm start -- -c
# o
expo start -c
```

### Ejecutar en plataforma específica

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 Estructura del Proyecto

```
app-proposal-driven/
├── assets/                      # Recursos estáticos (imágenes, iconos, animaciones)
├── src/
│   ├── animations/             # Componentes de animaciones Lottie
│   ├── api/                    # Funciones para manejo de datos
│   │   ├── home/              # Acciones relacionadas con home
│   │   └── login/             # Acciones de autenticación
│   ├── components/            # Componentes reutilizables
│   ├── pages/                 # Pantallas de la aplicación
│   │   ├── home/             # Pantallas de inicio y búsqueda
│   │   ├── login/            # Pantallas de autenticación
│   │   ├── perfil/           # Pantallas de perfil
│   │   └── viajes/           # Pantalla de viajes
│   ├── shared/               # Componentes y utilidades compartidas
│   ├── store/                # Estado global (Zustand)
│   └── styles/               # Estilos globales
├── App.js                     # Componente principal
├── Navigation.js              # Configuración de navegación
├── .env.template             # Template de variables de entorno
├── babel.config.js           # Configuración de Babel
└── package.json              # Dependencias del proyecto
```

## 🔑 Funcionalidades Principales

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión
- Persistencia de sesión con AsyncStorage
- Cierre de sesión

### Perfil de Usuario
- Visualización de información personal
- Edición de perfil (nombre, apellido, teléfono)
- Cambio de foto de perfil (cámara o galería)
- Cambio de contraseña
- Fecha de registro

### Búsqueda de Rutas
- Autocompletado de direcciones con Google Places
- Visualización en mapa con Google Maps
- Cálculo de rutas con Directions API
- Marcadores personalizados

### Viajes
- Historial de viajes realizados
- Detalles de cada viaje

## 🎨 Diseño

La aplicación utiliza un esquema de colores rosa/fucsia (#f83dd9ff) con gradientes, siguiendo las mejores prácticas de UI/UX para aplicaciones móviles modernas.

**Fuentes:**
- Poppins (Regular, Medium, SemiBold, Bold)

## 🐛 Solución de Problemas

### Error: "Module not found: @env"
```bash
# Limpia la caché y reinicia
expo start -c
```

### Error: "Google Maps no se muestra"
- Verifica que las API Keys estén correctamente configuradas en el archivo `.env`
- Asegúrate de haber habilitado todas las APIs necesarias en Google Cloud Console
- Revisa que las restricciones de las API Keys permitan el uso desde tu app

### Error: "Image picker no funciona"
- Verifica los permisos en tu dispositivo
- En iOS, asegúrate de aceptar los permisos cuando la app los solicite
- En Android, verifica los permisos en la configuración del sistema

### Problemas con las fuentes
```bash
# Las fuentes se cargan automáticamente con expo-font
# Si hay problemas, limpia la caché
expo start -c
```

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador web

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Autores

- **Mibzar Galarza** - [MibzarGalarza](https://github.com/MibzarGalarza)

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio de GitHub:

👉 [https://github.com/MibzarGalarza/app-proposal-driven](https://github.com/MibzarGalarza/app-proposal-driven)

---

**Nota:** Recuerda nunca compartir tus API Keys públicamente. El archivo `.env` está incluido en `.gitignore` para proteger tus credenciales.