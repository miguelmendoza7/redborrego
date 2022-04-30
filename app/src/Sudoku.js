import Game from './sudokucomponents/Game';
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth.js";
import React, { useContext, useEffect } from "react";
import firebaseconfig from './firebase.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Verify from './VerifyUser';

function Sudoku () {
    const { currentUser } = useContext(AuthContext);
    const db = firebaseconfig.firestore();


    const [livesNumber, setLivesNumber] = React.useState('');
    const [pointsNumber, setPointsNumber] = React.useState('');
    const [campus, setCampus] = React.useState('');

    const [name, setName] = React.useState('');


    if (currentUser) {
      Verify(currentUser._delegate.uid)
      }

      function handleChangeLives(newValue) {
        setLivesNumber(newValue);
      }

      function handleChangePoints(newValue) {
        setPointsNumber(newValue);
      }


      useEffect(() => {
        const searchImage = async () => {
          if (currentUser){
            const nameCollection = await db.collection('info').doc(currentUser._delegate.uid).get();
            setLivesNumber(nameCollection.data().vidas);
            setPointsNumber(nameCollection.data().puntos);
            setName(nameCollection.data().name);
            setCampus(nameCollection.data().campus);

          }
        };
        searchImage();
      }, []);

     

    return (

        <div>
                 <nav className="navbar navbar-dark bg-dark pt-3 pb-3 mb-4">
<div className="container-fluid">
<Link to="/">

    <div className="navbar-brand navbar-title" href="/">Red Borrego</div>
    </Link>
        <Link to="/">
    <button className="navbar-brand navbar-button">Inicio</button> 
    </Link>



  </div>
</nav>
<div className="container">
<div className="row">

<div className="col-md-4 mb-3">
<div className="card card-game mb-3">
<div class="card-body">
  <div className="text-center">
  <h5 className="card-title profile-name">{name}</h5>
  <div className="profile-status">{campus}</div>
  <div className="row mt-4 mb-3">

    <div className="col-6">
    <div>{pointsNumber}
      <FontAwesomeIcon className="icon-points" icon={faStar} ></FontAwesomeIcon>
      </div>
    </div>

    <div className="col-6">
    <div>{livesNumber}
    <FontAwesomeIcon className="icon-heart" icon={faBolt} ></FontAwesomeIcon>
    </div>
    </div>
  </div>


  </div>


</div>

</div>
    </div>


    <Game onChangeLives={handleChangeLives} onChangePoints={handleChangePoints}/>


</div>


</div>
        </div>
    )
}

export default Sudoku