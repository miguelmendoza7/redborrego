import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
import Square from '../functional/Square';
import Wait from '../functional/Wait'
import Status from '../functional/Status'
import PlayAgain from '../functional/PlayAgain'
import ScoreBoard from '../functional/ScoreBoard';
import io from 'socket.io-client'
import qs from 'qs'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import firebase from "@firebase/app-compat";
import "@firebase/auth-compat";
import firebaseconfig from "../../firebase.js";

const ENDPOINT = 'http://localhost:4000'

class Board extends Component {
  constructor(props){
    super(props)
    this.state = {
      game: new Array(9).fill(null),
      piece: 'X',
      turn: true,
      end: false,
      name: '',
      points: 0,
      energy: 0,
      room: '',
      started: false,
      statusMessage: '',
      colorMessage: 'status-default',
      currentPlayerScore: 0,
      opponentPlayer: [],
      //State to check when a new user join
      waiting: false,
      display: 'none',
      joinError: false
    }
    this.socketID = null
  }



  componentDidMount = async () => {

    let id = firebase.auth().currentUser._delegate.uid;
    await firebaseconfig.firestore().collection('info').doc(id).get().then(doc => {
        this.setState({ 
            name: doc.data().name,
            points: doc.data().puntos,
            energy: doc.data().vidas
        });
       

      });
    //Getting the room and the username information from the url
    //Then emit to back end to process


    const {room, name} = qs.parse(window.location.search, {
        ignoreQueryPrefix: true
       })

       const emptyValue = '';

       if(this.state.name != name){
         window.location.href = "/";
        this.socket.emit('newRoomJoin', {emptyValue, emptyValue})

      }
      else if (this.state.name === name){
        this.socket = io(ENDPOINT)   
        this.socket.emit('checkRoom', room)
        this.socket.emit('newRoomJoin', {room, name})
        

    
  

    this.setState({room})



  

    //New user join, logic decide on backend whether to display 
    //the actual game or the wait screen or redirect back to the main page
    this.socket.on('waiting', ()=> this.setState({waiting:true, display: 'flex', currentPlayerScore:0, opponentPlayer:[]}))
    this.socket.on('starting', ({gameState, players, turn})=> {
      this.setState({waiting:false, display: 'none'})
      this.gameStart(gameState, players, turn)
    })
    this.socket.on('joinError', () => this.setState({joinError: true}))
   
    //Listening to the assignment of piece store the piece along with the in state
    //socket id in local socketID variable
    this.socket.on('pieceAssignment', ({piece, id}) => {
      this.setState({piece: piece})
      this.socketID = id 
    })

    //Game play logic events
    this.socket.on('update', ({gameState, turn}) => this.handleUpdate(gameState, turn))
    this.socket.on('winner', ({gameState,id}) => this.handleWin(id, gameState))
    this.socket.on('draw', ({gameState}) => this.handleDraw(gameState))

    this.socket.on('restart', ({gameState, turn}) => this.handleRestart(gameState, turn))
}
  }

  //Setting the states to start a game when new user join
  gameStart(gameState, players, turn){
    const opponent = players.filter(([id, name]) => id!==this.socketID)[0][1]
    if(this.state.name===opponent){
        this.breakRoom()
    }
    this.setState({opponentPlayer: [opponent, 0], end:false, started: false})
    this.setBoard(gameState)
    this.setTurn(turn)
    this.setMessage()
    this.setState({colorMessage:'status-default'})

  }

  //When some one make a move, emit the event to the back end for handling
  handleClick = (index) => {
    if (this.socket.disconnected === true){
        window.location.href = "/";
    }
    const {game, piece, end, turn, room, started, energy} = this.state
    if (!game[index] && !end && turn){
      this.socket.emit('move', {room, piece, index})
    }

    if (!started && turn===true){
        console.log('menos una vida 1')

        let id = firebase.auth().currentUser._delegate.uid;
        const newEnergy = energy - 1
        firebaseconfig.firestore().collection('info').doc(id).update({vidas: newEnergy})
        this.setState({started: true, energy: newEnergy})

    }
  }

  //Setting the states each move when the game haven't ended (no wins or draw)
  handleUpdate(gameState, turn){
    this.setState({colorMessage:'status-default'})
    if (!this.state.started){
        console.log('menos una vida 2')
        let id = firebase.auth().currentUser._delegate.uid;
        const newEnergy = this.state.energy - 1
        firebaseconfig.firestore().collection('info').doc(id).update({vidas: newEnergy})
        this.setState({started: true, energy: newEnergy})

    }
    this.setBoard(gameState)
    this.setTurn(turn)
    this.setMessage()
  }

  //Setting the states when some one wins
  handleWin(id, gameState) {
    this.setBoard(gameState)
    if (this.socketID === id){
      const playerScore = this.state.currentPlayerScore + 1
      this.setState({currentPlayerScore:playerScore, statusMessage:'Ganaste', colorMessage: 'status-victory'})
      let id = firebase.auth().currentUser._delegate.uid;
      const newPoints = this.state.points + 5
      firebaseconfig.firestore().collection('info').doc(id).update({puntos: newPoints})
      this.setState({points: newPoints})


    }else{
      const opponentScore = this.state.opponentPlayer[1] + 1
      const opponent = this.state.opponentPlayer
      opponent[1] = opponentScore
      this.setState({opponentPlayer:opponent, statusMessage:`${this.state.opponentPlayer[0]} Ganó`, colorMessage: 'status-loose'})
    }
    this.setState({end:true, started: false})
  }

  //Setting the states when there is a draw at the end
  handleDraw(gameState){
    this.setBoard(gameState)
    this.setState({end:true, statusMessage:'Draw',  started: false})
  }

  playAgainRequest = () => {
    this.socket.emit('playAgainRequest', this.state.room)
    this.setState({colorMessage:'status-default'})

  }



  //Handle the restart event from the back end
  handleRestart(gameState, turn){
    this.setBoard(gameState)
    this.setTurn(turn)
    this.setMessage()
    this.setState({end: false})
    this.setState({colorMessage:'status-default'})
    this.setState({started: false})

    if (this.state.energy === 0){
        this.leave()
        window.location.href = "/";
    

    }

  }

  //Some utilities methods to set the states of the board

  setMessage(){
    const message = this.state.turn?'Tu turno':`Turno de ${this.state.opponentPlayer[0]}`
    this.setState({statusMessage:message})
  }

  setTurn(turn){
    if (this.state.piece === turn){
      this.setState({turn:true})
    }else{
      this.setState({turn:false})
    }
  } 

  setBoard(gameState){
    this.setState({game:gameState})
  }
  


  leave = () => {
    this.socket.emit('disconnecting', 2)
    this.setState({joinError: true})
    this.setState({started: false})


  }


  breakRoom = () => {
    this.socket.emit('disconnecting', 1)
    this.setState({joinError: true})
    this.setState({started: false})


  }





  renderSquare(i){
    return(
      <Square key={i} value={this.state.game[i]} 
                              player={this.state.piece} 
                              end={this.state.end} 
                              id={i} 
                              onClick={this.handleClick}
                              turn={this.state.turn}/> 
    )
  }

  render(){
    if (this.state.joinError){
      return(
        <Redirect to={`/`} />
      )
    }else{
      const squareArray = []
      for (let i=0; i<9; i++){
        const newSquare = this.renderSquare(i)
        squareArray.push(newSquare)
      }
      return(
        <>
        <div>

        <nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">

<Link to="/">
    <div onClick={this.leave}  className="navbar-brand navbar-title">Red Borrego</div>
    </Link>

    <button onClick={this.leave}  className="navbar-brand navbar-button">Abandonar</button> 



  </div>
</nav>

<div className="container">
            <div className="row">
                <div className="col-md-4">

                <div className="card card-game mt-4 mb-2">
<div class="card-body">
  <div className="text-center">
  <h5 className="card-title profile-name">{this.state.name}</h5>
  <div className="profile-status">Estudiante</div>
  <div className="row mt-4 mb-3">

    <div className="col-6">
    <div>{this.state.points}
      <FontAwesomeIcon className="icon-points" icon={faStar} ></FontAwesomeIcon>
      </div>
    </div>

    <div className="col-6">
    <div>{this.state.energy}
    <FontAwesomeIcon className="icon-heart" icon={faBolt} ></FontAwesomeIcon>
    </div>
    </div>
  </div>


  </div>


</div>

</div>

                </div>
         <div className="col-md-8">
         <div className='wait' style={{display: this.state.display}}>
            <h1 className="wait-message">Esperando a que el jugador se conecte...</h1>
            <div className="copy">
                <h1 className='copy-message'>ID de la partida:</h1>
                <div className='copy-container'>
                    <div  className='copy-area'>{this.state.room}</div>
                    <button onClick={this.breakRoom} className="btn btn-danger">Abandonar</button>
                </div>
            </div>
        </div>
          <Status color={this.state.colorMessage}  message={this.state.statusMessage}/>
          <div className="board">
            {squareArray}
          </div>
          <PlayAgain end={this.state.end} onClick={this.playAgainRequest}/>
          </div>
          </div>
          </div>
          </div>
        </>
      )
    }
  }
}


export default Board
