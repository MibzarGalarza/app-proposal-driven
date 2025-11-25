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

- [Node.js](https://nodejs.org/) v18+
- Expo CLI: `npm install -g expo-cli`
- [Expo Go](https://expo.dev/client) en tu móvil (iOS/Android)
- Cuenta gratuita en [Expo.dev](https://expo.dev/)

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

### 4. Obtener API Keys de Google

Ve a [Google Cloud Console](https://console.cloud.google.com/):

1. Crear proyecto nuevo
2. Habilitar APIs: **Places API**, **Maps SDK** (Android/iOS), **Directions API**, **Geocoding API**
3. Ir a "Credenciales" → Crear API Key
4. Copiar las keys al archivo `.env`

### 5. Login en Expo (primera vez)

```bash
# Si no tienes Expo CLI instalado
npm install -g expo-cli

# Iniciar sesión
expo login
# Ingresa tu email y password de expo.dev

# Verificar sesión
expo whoami
```

**Nota:** En algunos casos también puedes necesitar:
```bash
# Instalar EAS CLI (opcional)
npm install -g eas-cli
eas login
```

## 🎮 Ejecutar la Aplicación

```bash
# Iniciar servidor
npm start
# o con caché limpia (recomendado la primera vez)
npm start -- -c
```

**En tu móvil:**
- Abre **Expo Go** ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Escanea el código QR de la terminal

**Atajos en terminal:**
- `a` → Android emulador | `i` → iOS simulador | `w` → Web | `r` → Recargar

## � Estructura

```
src/
├── animations/  # Componentes Lottie
├── api/        # Lógica de negocio (home, login)
├── pages/      # Pantallas (home, login, perfil, viajes)
├── shared/     # Componentes compartidos
└── store/      # Estado global (Zustand)
```

## 🐛 Problemas Comunes

| Problema | Solución |
|----------|----------|
| **"Module not found: @env"** | `expo start -c` |
| **"Expo CLI not found"** | `npm install -g expo-cli` o usa `npx expo start` |
| **Google Maps no se muestra** | Verificar API Keys en `.env` y APIs habilitadas en Google Cloud |
| **No conecta con el móvil** | Misma red WiFi o usar `expo start --tunnel` |
| **Permisos cámara/fotos** | Aceptar permisos cuando la app los solicite |

## 📝 Comandos Útiles

```bash
npm start              # Iniciar desarrollo
npm start -- -c        # Limpiar caché
expo start --tunnel    # Usar túnel (redes restrictivas)
expo whoami           # Ver usuario logueado
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/NuevaFeature`
3. Commit: `git commit -m 'Add: Nueva feature'`
4. Push: `git push origin feature/NuevaFeature`
5. Abre un Pull Request

##  Autor

**Mibzar Galarza** - [@MibzarGalarza](https://github.com/MibzarGalarza)

## 📞 Soporte

📌 **Repositorio:** [github.com/MibzarGalarza/app-proposal-driven](https://github.com/MibzarGalarza/app-proposal-driven)

---

⚠️ **Importante:** No subas el archivo `.env` a Git. Está protegido en `.gitignore`