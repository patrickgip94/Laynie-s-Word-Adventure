import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image, Alert } from 'react-native';
import { colors, CLEAR, ENTER } from './src/constants';
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
  const [gameState, setGameState] = useState('playing'); // Won, Lost, Playing 

  useEffect(() => {
    if (currentRow > 0) {
      checkGameState()
    }
  }, [currentRow])

  const checkGameState = () => {
    if (checkIfWon()) {
      Alert.alert("Good Job Laynie!")
      setGameState('won')
    } else if (checkIfLost()) {
      Alert.alert("Try again!")
      setGameState('lost')
    }
  };

  const checkIfWon = () => {
    const row = rows[currentRow - 1];

    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return currentRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return;
    }

    const updatedRows = copyArray(rows)

    if (key === CLEAR) {
      const prevCol = currentCol - 1;
      if (prevCol >= 0) {
        updatedRows[currentRow][prevCol] = "";
        setRows(updatedRows);
        setCurrentCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (currentCol === rows[0].length) {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
      return;
    }

    if (currentCol < rows[0].length) {
      updatedRows[currentRow][currentCol] = key;
      setRows(updatedRows);
      setCurrentCol(currentCol + 1)
    }
  }

  const isCellActive = (row, col) => {
    return row === currentRow && col === currentCol
  }

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= currentRow) {
      return "#A67B5B" // Default color before iterating through the key
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.black
  };

  const getAllLettersWithColor = (color) => {
    return rows.flatMap((row, i) => // flatMap will merge all the array at the end
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary)
  const greyCaps = getAllLettersWithColor(colors.black)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Image source={require('./assets/layLogo.png')} style={styles.logo} />

      <View style={styles.map}>

        {/* i = index for row, j = index for col */}
        {rows.map((row, i) => (
          <View style={styles.row} key={`row-${i}`}>
            {row.map((letter, j) =>
              <View
                key={`cell-${i}-${j}`} // creates a unique key for each box
                style={[styles.cell, {
                  borderColor: isCellActive(i, j)
                    ? "#f27F0C"
                    : colors.lightgrey,
                  backgroundColor: getCellBGColor(i, j),
                }]}>
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            )}
          </View>
        ))}

      </View>


      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
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
    height: 125,
    marginTop: 25,
  },
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
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
    color: "white",
    fontWeight: 'bold',
    fontSize: 28,
  },
});
