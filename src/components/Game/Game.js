import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { colors, CLEAR, ENTER } from '../../constants';
import Keyboard from '../Keyboard'
import * as Clipboard from 'expo-clipboard';
import words from '../../words';


const NUMBER_OF_TRIES = 6;

// CREATES A NEW ARRAY WITH THE SAME VALUE AS THE ORIGINAL ONE
const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])]
};

// const getDayOfTheYear = () => {
//   const now = new Date();
//   const start = new Date(now.getFullYear(), 0, 0);
//   const diff = now - start;
//   const oneDay = 1000 * 60 * 60 * 24;
//   const day = Math.floor(diff / oneDay);
//   return day;
// }
// const dayOfTheYear = getDayOfTheYear

const Game = () => {
  // const word = words[dayOfTheYear]; *Requires updates*
  const word = "hello"
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

  const message = "Good Job!";
  const fullMessage = message + " The word was: " + `"${word}"`;

  // CHECKING WHETHER THE GAME IS PLAYING, WON, OR LOST.
  // THEN IT WILL RESET THE STATE
  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      Alert.alert(fullMessage)
      setGameState('won')
      // Reset the state after 3 seconds
      setTimeout(() => {
        resetState()
      }, 5000)

    } else if (checkIfLost() && gameState !== 'lost') {
      Alert.alert("Try again!")
      setGameState('lost')

      // Reset the state after 3 seconds
      setTimeout(() => {
        resetState()
      }, 5000)
    }

  };

  // RESET STATE FUNCTION
  const resetState = () => {
    setGameState('playing')
    setRows(new Array(NUMBER_OF_TRIES).fill(
      new Array(letters.length).fill('')
    ))
    setCurrentRow(0)
    setCurrentCol(0)
  }


  // CHECKING EACH INDIVIDUAL ROW AND THE LETTERS OF THE INDICIES
  const checkIfWon = () => {
    const row = rows[currentRow - 1];
    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return !checkIfWon() && currentRow === rows.length;
  };

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return;
    }

    const updatedRows = copyArray(rows)

    // CLEAR FUNCTION
    if (key === CLEAR) {
      const prevCol = currentCol - 1;
      if (prevCol >= 0) {
        updatedRows[currentRow][prevCol] = "";
        setRows(updatedRows);
        setCurrentCol(prevCol);
      }
      return;
    }

    // ENTER FUNCTION
    if (key === ENTER) {
      if (currentCol === rows[0].length) {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
      return;
    }

    // Updating a 2-dimensional array with new values
    if (currentCol < rows[0].length) {
      updatedRows[currentRow][currentCol] = key;
      setRows(updatedRows);
      setCurrentCol(currentCol + 1)
    }
  }

  // Checks if the current Row & Col matches the current Row and Col
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
    <>
      <ScrollView style={styles.map}>
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
      </ScrollView>


      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </>
  );
}

const styles = StyleSheet.create({
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

export default Game;
