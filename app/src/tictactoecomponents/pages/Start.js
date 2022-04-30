import React from "react";
import { Link } from "react-router-dom";
import Choice from '../functional/Choice.js'
import InputForm from '../functional/InputForm.js'
import Loading from '../functional/Loading'
import Error from '../functional/Error'
import {Redirect} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import firebase from "@firebase/app-compat";
import "@firebase/auth-compat";
import firebaseconfig from "../../firebase.js";
const ENDPOINT = 'http://localhost:4000'




class Start extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            step: 1,
            name: '',
            newGame: null,
            room: '',
            loading: false,
            serverConfirmed: false,
            error: false,
            errorMessage: '',
        }
    }

    

    
    componentDidMount(){
        let id = firebase.auth().currentUser._delegate.uid;
        firebaseconfig.firestore().collection('info').doc(id).get().then(doc => {
            this.setState({ name: doc.data().name });
            if (doc.data().vidas < 1){
                window.location.href = "/";

            }
          });

        this.socket = socketIOClient(ENDPOINT)
        this.socket.on('newGameCreated', (room) =>{
            this.setState({serverConfirmed:true, room:room})
        })
        this.socket.on('joinConfirmed', ()=>{
            this.setState({serverConfirmed:true})
        })
        this.socket.on('errorMessage', (message) => this.displayError(message))    
    }

   
     

    componentWillUnmount(){
        this.socket.disconnect()
    }

    onChoice = (choice)=>{
        const gameChoice = choice==='new'?true:false
        const newState = {newGame: gameChoice}
        this.setState(newState, ()=>{
            this.stepForward()
        })
    }



      
    validate = ()=>{
     


          if (this.state.newGame){
            return !(this.state.name==='')
        }else{
            return !(this.state.name==='') && !(this.state.room==='')
        }
         
       
    }



    onSubmit = ()=>{
        this.setState({loading: true})
        if (this.validate()){
            if (this.state.newGame){
                this.socket.emit('newGame')
            }else{
                this.socket.emit('joining', {room:this.state.room})
            }
        }else{
            setTimeout(()=>this.setState({loading: false }), 500)
            this.displayError(this.state.newGame? 'Llena el campo de texto con el ID de la partida':'Llena el campo de texto con el ID de la partida')
        }
    }

    stepBack = ()=>{
        this.setState({step: this.state.step - 1})
    }

    stepForward = () =>{
        this.setState({step: this.state.step + 1})
    }

    onTyping = (e)=>{
        const target = e.target.name
        const newState = {[target]:e.target.value}
        this.setState(newState)
    }

    displayError = (message) =>{
        this.setState({error:true, errorMessage:message, loading:false})
        setTimeout(()=>{
            this.setState({error:false, errorMessage:''})
        }, 3000)
    }

    render(){

        
    
        if (this.state.serverConfirmed){
            return(
                <Redirect to={`tresenraya/game?room=${this.state.room}&name=${this.state.name}`} />
            )
        }else{
            switch(this.state.step){
                case(1):
                    return (
            <div>
                        <nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">

<Link to="/">
    <div className="navbar-brand navbar-title">Red Borrego</div>
</Link>
<Link to="/">
    <button className="navbar-brand navbar-button">Inicio</button> 
    </Link>



  </div>
</nav>

                        <Choice onChoice={this.onChoice}/>
                        </div>
                    );
                case(2):
                    return (
                        <>
                        <div>
                        
                        <nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">

<Link to="/">

    <div className="navbar-brand navbar-title">Red Borrego</div>
    </Link>
    <Link to="/">

    <button className="navbar-brand navbar-button">Inicio</button> 
    </Link>



  </div>
</nav>
                            <Loading loading={this.state.loading}/>
                            <Error display={this.state.error} message={this.state.errorMessage}/>
                            <InputForm 
                                stepBack={this.stepBack} 
                                onSubmit={this.onSubmit} 
                                onTyping={this.onTyping.bind(this)}
                                newGame={this.state.newGame}
                                name = {this.state.name}
                                room = {this.state.room}/> 
                                </div>
                        </>
                    );
                default:
                    return null
            }
        }
        
    }
    
}

export default Start;