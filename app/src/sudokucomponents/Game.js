import React, { useState, useEffect, useContext } from 'react';
import Board from './Board';

import { easy, getBoxes } from '../utils';
import { NewBoardButton, Status, Status2 } from './GameStyles';
import firebaseconfig from '../firebase';
import { AuthContext } from '../Auth';
import { useHistory } from "react-router-dom";

const Game = (props) => {
  const [gameState, setGameState] = useState({
    board: [],
    boardValidated: true
  });
  let history = useHistory();


  const { currentUser } = useContext(AuthContext);
  const db = firebaseconfig.firestore();

  const [livesNumber, setLivesNumber] = React.useState();
  const [pointsNumber, setPointsNumber] = React.useState();

  const [boardCompleted, setBoardCompleted] = React.useState(false);
  const [attemps, setAttemps] = React.useState(0);


  useEffect(() => {
    const searchImage = async () => {
      if (currentUser){
        const nameCollection = await db.collection('info').doc(currentUser._delegate.uid).get();
        setLivesNumber(nameCollection.data().vidas)
        setPointsNumber(nameCollection.data().puntos)

        if (nameCollection.data().vidas === 0 && attemps=== 0){
            history.push("/");

        }
      }
    };
    searchImage();
  }, []);


  function isValidSudoku(board) {
      const row1 = parseInt(board[0][0].value)+parseInt(board[0][1].value)+parseInt(board[0][2].value)+parseInt(board[0][3].value)+parseInt(board[0][4].value)+parseInt(board[0][5].value)+parseInt(board[0][6].value)+parseInt(board[0][7].value)+parseInt(board[0][8].value);
      const row2 = parseInt(board[1][0].value)+parseInt(board[1][1].value)+parseInt(board[1][2].value)+parseInt(board[1][3].value)+parseInt(board[1][4].value)+parseInt(board[1][5].value)+parseInt(board[1][6].value)+parseInt(board[1][7].value)+parseInt(board[1][8].value);
      const row3 = parseInt(board[2][0].value)+parseInt(board[2][1].value)+parseInt(board[2][2].value)+parseInt(board[2][3].value)+parseInt(board[2][4].value)+parseInt(board[2][5].value)+parseInt(board[2][6].value)+parseInt(board[2][7].value)+parseInt(board[2][8].value);
      const row4 = parseInt(board[3][0].value)+parseInt(board[3][1].value)+parseInt(board[3][2].value)+parseInt(board[3][3].value)+parseInt(board[3][4].value)+parseInt(board[3][5].value)+parseInt(board[3][6].value)+parseInt(board[3][7].value)+parseInt(board[3][8].value);
      const row5 = parseInt(board[4][0].value)+parseInt(board[4][1].value)+parseInt(board[4][2].value)+parseInt(board[4][3].value)+parseInt(board[4][4].value)+parseInt(board[4][5].value)+parseInt(board[4][6].value)+parseInt(board[4][7].value)+parseInt(board[4][8].value);
      const row6 = parseInt(board[5][0].value)+parseInt(board[5][1].value)+parseInt(board[5][2].value)+parseInt(board[5][3].value)+parseInt(board[5][4].value)+parseInt(board[5][5].value)+parseInt(board[5][6].value)+parseInt(board[5][7].value)+parseInt(board[5][8].value);
      const row7 = parseInt(board[6][0].value)+parseInt(board[6][1].value)+parseInt(board[6][2].value)+parseInt(board[6][3].value)+parseInt(board[6][4].value)+parseInt(board[6][5].value)+parseInt(board[6][6].value)+parseInt(board[6][7].value)+parseInt(board[6][8].value);
      const row8 = parseInt(board[7][0].value)+parseInt(board[7][1].value)+parseInt(board[7][2].value)+parseInt(board[7][3].value)+parseInt(board[7][4].value)+parseInt(board[7][5].value)+parseInt(board[7][6].value)+parseInt(board[7][7].value)+parseInt(board[7][8].value);
      const row9 = parseInt(board[8][0].value)+parseInt(board[8][1].value)+parseInt(board[8][2].value)+parseInt(board[8][3].value)+parseInt(board[8][4].value)+parseInt(board[8][5].value)+parseInt(board[8][6].value)+parseInt(board[8][7].value)+parseInt(board[8][8].value);

     if((row1&&row2&&row3&&row4&&row5&&row6&&row7&&row8&&row9) === 45 ){
         setBoardCompleted(true)
         const newPoints = pointsNumber+30
         setPointsNumber(newPoints)
         handleChangePoints(newPoints)
         updateFirebasePoints(newPoints)

     }


      }



      const updateFirebasePoints = async (points) =>{
        await db.collection("info").doc(currentUser._delegate.uid).update({
            puntos: points
           });
      }

  function newGame() {

    // Grab a random start board from the predefined startboard array
    // There's three of them, easy, medium and hard. I'm using easy now
    const randomStartBoard = easy[Math.floor(Math.random() * easy.length)].map(
      (row, y) =>
        row.split('').map((nr, x) => ({
          value: parseInt(nr),
          disabled: parseInt(nr) !== 0,
          y,
          x,
        }))
    );
    // Put the startboard in the state
    setGameState(prev => ({ ...prev, board: randomStartBoard, boardValidated: true }));
    setAttemps(0)
    setBoardCompleted(false)
    if (livesNumber === 0){
        history.push("/");
    }
  }

  function setCellValue(value, x, y) {
    // Have to do below mapping to not mutate the state because of shallow cloning
    const newBoard = gameState.board.map((row, i) =>
      i === y
        ? row.map((cell, j) => (j === x ? { ...cell, value } : cell))
        : row
    );
    return newBoard;
  }

  // Could use forEach for this one instead but want to break early if finding duplicates
  // That's not possible with a forEach.
  function validate(array) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          array[row].filter(el => el.value === array[row][col].value).length >
            1 &&
          array[row][col].value !== 0
        ) {
          return false;
        }
      }
    }
    return true;
  }

  function validateBoard(newBoard) {
    const rows = newBoard;
    // Simply reverse the array to be able to loop over cols
    const cols = newBoard.map((row, index) =>
      newBoard.map(column => column[index])
    );
    // Boxes, function is from "utils.js"
    const boxes = getBoxes(newBoard);
    isValidSudoku(newBoard);

    return validate(rows) && validate(cols) && validate(boxes);
  }



  function inputCallback(value, x, y) {
    // Only allow numbers 1-9 with reg.ex test. Also allow no value
    if (value === '' || /^[1-9]$/.test(value)) {
      const updatedBoard = setCellValue(
        value !== '' ? parseInt(value) : 0,
        x,
        y
      );
      const validated = validateBoard(updatedBoard);
      setGameState(prev => ({
        ...prev,
        board: updatedBoard,
        boardValidated: validated,
      }));

      if(attemps == 0){
        const newLives = livesNumber-1;
        setLivesNumber(newLives)
        handleChangeLives(newLives)
        updateFirebaseLives(newLives)
    }

    setAttemps(attemps+1)



    }
  }

  function handleChangeLives(newValue) {
    props.onChangeLives(newValue);
}


function handleChangePoints(newValue) {
    props.onChangePoints(newValue);
}
  const updateFirebaseLives = async (lives) =>{
    await db.collection("info").doc(currentUser._delegate.uid).update({
        vidas: lives
       });
  }

  // Run once the component mount
  useEffect(() => {
    newGame();
  }, []);

  return (
    <div className="col-md-8">
      <Board board={gameState.board} inputCallback={inputCallback} />

      <div className="text-center row mt-3 mb-3">
      <div className="col-md-2"></div>

         <div className="col-5 col-md-4">
        {
            !boardCompleted &&
            <Status status={gameState.boardValidated} />

        }

        {
            boardCompleted &&
            <Status2 status={gameState.boardValidated} />

        }
      </div>
      <div  className="col-7 col-md-4">

      <button className=" btn btn-light mt-1 mb-3" onClick={newGame}>Nuevo intento</button>

      </div>
      <div className="col-md-2"></div>

      </div>
    </div>
  );
};

export default Game;