import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Registra un nuevo usuario en AsyncStorage
 */
export const registerUser = async (userData) => {
  try {
    // Obtener usuarios existentes
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Verificar si el email ya existe
    const userExists = users.find(user => user.email === userData.email);
    if (userExists) {
      return { success: false, message: 'Este email ya está registrado' };
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      fechaRegistro: new Date().toISOString()
    };

    // Guardar usuario
    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));

    return { success: true, message: 'Registro exitoso', user: newUser };
  } catch (error) {
    console.error('Error en registerUser:', error);
    return { success: false, message: 'Error al registrar usuario' };
  }
};

/**
 * Inicia sesión con email y contraseña
 */
export const loginUser = async (email, password) => {
  try {
    // Obtener usuarios
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Email o contraseña incorrectos' };
    }

    // Guardar sesión actual
    await AsyncStorage.setItem('currentUser', JSON.stringify(user));

    return { success: true, message: 'Login exitoso', user };
  } catch (error) {
    console.error('Error en loginUser:', error);
    return { success: false, message: 'Error al iniciar sesión' };
  }
};

/**
 * Obtiene el usuario actual en sesión
 */
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error en getCurrentUser:', error);
    return null;
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('currentUser');
    return { success: true, message: 'Sesión cerrada' };
  } catch (error) {
    console.error('Error en logoutUser:', error);
    return { success: false, message: 'Error al cerrar sesión' };
  }
};

/**
 * Obtiene todos los usuarios (solo para propósitos de demostración)
 */
export const getAllUsers = async () => {
  try {
    const usersData = await AsyncStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return [];
  }
};

/**
 * Actualiza los datos del usuario
 */
export const updateUser = async (userId, updatedData) => {
  try {
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Actualizar usuario
    users[userIndex] = { ...users[userIndex], ...updatedData };
    await AsyncStorage.setItem('users', JSON.stringify(users));

    // Si es el usuario actual, actualizar también su sesión
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      await AsyncStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }

    return { success: true, message: 'Usuario actualizado', user: users[userIndex] };
  } catch (error) {
    console.error('Error en updateUser:', error);
    return { success: false, message: 'Error al actualizar usuario' };
  }
};

/**
 * Elimina todos los usuarios (solo para desarrollo/testing)
 */
export const clearAllUsers = async () => {
  try {
    await AsyncStorage.removeItem('users');
    await AsyncStorage.removeItem('currentUser');
    return { success: true, message: 'Todos los usuarios eliminados' };
  } catch (error) {
    console.error('Error en clearAllUsers:', error);
    return { success: false, message: 'Error al eliminar usuarios' };
  }
};
