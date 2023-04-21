import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { colors } from './src/constants';
import Keyboard from './src/components/Keyboard';


const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])]
};



export default function App() {
  const word = 'hello';
  const letters = word.split(''); // return array of letters ['h','e','l','l','o']

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(
    new Array(letters.length).fill('')
  ));

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const onKeyPressed = (key) => {
    const updatedRows = copyArray(rows)

    if (currentCol < rows[0].length) {
      updatedRows[currentRow][currentCol] = key;
      setRows(updatedRows);
      setCurrentCol(currentCol + 1)
    }
  }

  const isCellActive = (row, col) => {
    return row === currentRow && col === currentCol
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Image source={require('./assets/layLogo.png')} style={styles.logo} />

      <View style={styles.map}>

        {rows.map((row, i) => (
          <View style={styles.row} key={`row-${i}`}>
            {row.map((cell, j) =>
              <View
                key={`cell-${i}-${j}`}
                style={[styles.cell, {
                  borderColor: isCellActive(i, j)
                    ? "#f27F0C"
                    : colors.lightgrey,
                }]}>
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            )}
          </View>
        ))}

      </View>


      <Keyboard onKeyPressed={onKeyPressed} />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff2',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 125,
    marginTop: 25,
  },
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
    height: 100,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cell: {
    borderColor: "#ccae88",
    borderWidth: 2,
    flex: 1,
    aspectRatio: 1,
    maxWidth: 70,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  },
});
