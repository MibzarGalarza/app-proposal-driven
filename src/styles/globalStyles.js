import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  cardStyles: {
    //Estilos de elavacion de android
    elevation: 80,
    //Estilos de elevacion de ios
    shadowColor: "#000",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardBottom: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
    //Estilos de elavacion de android
    elevation: 80,
    //Estilos de elevacion de ios
    shadowColor: "#000",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#09090bff',
  },
  // Estilos de texto
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  normalText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  normalTextSmall: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 20,
  },
  normalTextBold: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  normalBoldSmall: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline',
    color: "#072AC8"
  },
  linkTextSmall: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    lineHeight: 20,
    textDecorationLine: 'underline',
    color: "#072AC8"
  },
  buttonTextStyle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    lineHeight: 24,
    color: '#fff',
  },
  titleNoticia: {
    fontFamily: 'Lora_700Bold',
    fontSize: 22,
    lineHeight: 30,
  },
  noticia: {
    fontFamily: 'Lora_400Regular',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'justify',
  },


  // Estilos input container
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },
  checkBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    width: 25,
    height: 25,
    borderRadius: 8,
  },
  buttonLogin: {
    backgroundColor: '#023B71',
    paddingVertical: 12,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },


  //Center loading
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  loadingCircle: {
    backgroundColor: '#FFF',
    borderRadius: 100,
    width: 160,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
  },
});

export default globalStyles;