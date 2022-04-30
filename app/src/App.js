import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Home from './Home';
import Shop from './Shop';
import Problems from './Problems';
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRouting";
import LogIn from './LogIn';
import SignUp from './SignUp';
import Teacher from './Teacher';
import Sudoku from './Sudoku';
import Board from "./tictactoecomponents/pages/Board"
import Start from "./tictactoecomponents/pages/Start.js";
import "./Tictactoe.css"
import React from "react";

function App() {

  return (
    <AuthProvider>
    <Router>
    <div >
    <Route exact path="/" component={Home}/>
    <Route exact path="/registro"  component={SignUp}/>
    <Route exact path="/inicio" component={LogIn}/>
    <PrivateRoute path='/tresenraya/game' component={Board} />
    <PrivateRoute exact path='/tresenraya' component={Start } />

    <PrivateRoute exact path="/tienda" component={Shop}/>
    <PrivateRoute   path="/admin" component={Teacher}/>

    <PrivateRoute  exact path="/problemas" component={Problems}/>
   
    <PrivateRoute exact path="/sudoku" component={Sudoku}/>



    </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
