import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Image } from 'react-native';
import Game from './src/components/Game';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Image source={require('./assets/layLogo.png')} style={styles.logo} />
      <Game />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff2',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 300,
    height: 75,
    marginTop: 30,
  },

});
