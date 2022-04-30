import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { AuthContext } from "./Auth.js";
import React, { useContext, useEffect } from "react";
import firebaseconfig from './firebase.js';
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ModalBody } from "react-bootstrap";
import PricesModal from './PricesModal.js';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import connect4image from "./connect4image.png"
import Verify from './VerifyUser.js';
import { faGem } from "@fortawesome/free-solid-svg-icons";

function Home({history}) {
  const { currentUser } = useContext(AuthContext);
  const [modal, setModal] = React.useState(false);

  const [livesNumber, setLivesNumber] = React.useState(0);
  const [pointsNumber, setPointsNumber] = React.useState(0);
  const [gemsNumber, setGemsNumber] = React.useState(0);

  const [name, setName] = React.useState('');
  const [pricesNumber, setPricesNumber] = React.useState(0);
  const [campus, setCampus] = React.useState('');

  const db = firebaseconfig.firestore();


  if (currentUser) {
    Verify(currentUser._delegate.uid)
  }

  useEffect(() => {
    const searchImage = async () => {
      if (currentUser){
        const nameCollection = await db.collection('info').doc(currentUser._delegate.uid).get();
        setLivesNumber(nameCollection.data().vidas);
        setPointsNumber(nameCollection.data().puntos);
        setName(nameCollection.data().name);
        setCampus(nameCollection.data().campus)
        setGemsNumber(nameCollection.data().gemas)
      }
    };
    searchImage();
  }, []);



  useEffect(() => {

    const searchRequests =  async () => {
      if (currentUser){

        const requestscollection =  await db.collection("info").doc(currentUser._delegate.uid).collection("premios").get().then(function(querySnapshot) {      
            setPricesNumber(querySnapshot.size); 
        });    
      
    };
  }
    searchRequests();
    

  }, []);


     
  const closeModal = () =>{
    setModal(false)  
  }


  const openModal = () =>{
    setModal(true)  
  }


  return (

    <>

<Modal onHide={closeModal} show={modal}  >
            
            
              <ModalHeader><h2>Tus premios</h2>
              
              <div className="pointer">
              <FontAwesomeIcon icon={faTimes} onClick={() => closeModal()}></FontAwesomeIcon>
              </div>
              
              </ModalHeader>

              <ModalBody>
                <div className="mt-3"></div>
              {currentUser &&
                      <PricesModal user={currentUser._delegate.uid}></PricesModal>

              }
 
              </ModalBody>
            


            </Modal>

    <div >
<nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">
<Link to="/">

    <div className="navbar-brand  navbar-title" >Red Borrego</div>
    </Link>


    {currentUser && 

    <div>
      <Link to="/tienda">
    <button  className="navbar-brand navbar-button">Tienda</button> 
    </Link>

      </div>

    }

    




  </div>
</nav>

<div className="container">

<div className="row mt-3">
<div className="col-md-5 col-lg-4">
<div className="sticky-top pt-3">

  
{!currentUser && 

<div className="card card-game mb-3">
  <div className="card-body">
<div className="text-center">
  <h5 className="card-title profile-name">Usuario no reconocido</h5>
  <div className="profile-status">Campus no reconocido</div>

  <div className="row mt-3 mb-3">
    <div className="col-6 ">

    <button onClick={() => history.push('/registro')} className="btn btn-light btn-sm  ">Registrarme</button>

    </div>
    <div className="col-6 ">

    <button onClick={() => history.push('/inicio')} className="btn  btn-primary btn-sm ">Iniciar sesión</button>

    </div>
    </div>

  </div>

</div>
</div>
}

{currentUser && 

<div className="card card-game mb-3">
<div class="card-body">
  <div className="text-center">
  <h5 className="card-title profile-name">{name}</h5>
  <div className="profile-status">{campus}</div>
  <div className="row mt-4 mb-3">
  <div className="col-3">
    <div className="icon-text">{pricesNumber}
      
      <FontAwesomeIcon className="icon-trophy" icon={faTrophy} ></FontAwesomeIcon>
      </div>

    </div>
    <div className="col-3">
    <div className="icon-text">{gemsNumber}
    <FontAwesomeIcon className="icon-gem" icon={faGem} ></FontAwesomeIcon>
    </div>
    </div>
    <div className="col-3">
    <div className="icon-text">{pointsNumber}
      
      <FontAwesomeIcon className="icon-points" icon={faStar} ></FontAwesomeIcon>
      </div>

    </div>
   
    <div className="col-3">
    <div className="icon-text">{livesNumber}
    <FontAwesomeIcon className="icon-heart" icon={faBolt} ></FontAwesomeIcon>
    </div>
    </div>
  </div>

  <div className="row mt-4 mb-3">
    <div className="col-6">
      {pricesNumber == 0 && 
        <button disabled className="btn btn-success btn-sm">Ver premios</button>
      }

      {
        pricesNumber > 0 && 
        <button  onClick={() => openModal()} className="btn prices-button btn-success btn-sm">Ver premios</button>

      }
    </div>
    <div className="col-6">
        <Link to="/problemas">
      <button  className="btn btn-danger btn-sm">Ganar energía</button>
      </Link>

    </div>

  </div>

  </div>


</div>

</div>

}
 

  <h5 className="prices-text pt-3">Recompensas: </h5>

<ul class="list-group mb-4">
<li class=" mb-3 list-group-item d-flex justify-content-between align-items-center">
    Contestar bien una pregunta de los problemas
  
    <span class="badge bg-danger rounded-pill">1</span>
    <span class="badge bg-light text-dark rounded-pill">3</span>

  </li>

  <li class="list-group-item d-flex justify-content-between align-items-center">
    Completa un Sudoku
    <span class="badge bg-primary rounded-pill">30</span>
  </li>

  <li class="list-group-item d-flex justify-content-between align-items-center">
    Gana una partida de Ajedrez
    <span class="badge bg-primary rounded-pill">15</span>
  </li>

  <li class="list-group-item d-flex justify-content-between align-items-center">
    Gana una partida de Conecta 4
    <span class="badge bg-primary rounded-pill">10</span>
  </li>


  <li class="list-group-item d-flex justify-content-between align-items-center">
    Gana una partida de Tres en Raya
    <span class="badge bg-primary rounded-pill">5</span>
  </li>
 
 
</ul>


{ currentUser &&
<div className="row text-center mt-4 ">
  <div className="col-6  mb-3">
  <button className="btn btn-light btn-sm col-12 " onClick={() => firebaseconfig.auth().signOut()}>Cerrar sesión</button>

  </div>
  <div className="col-6 ">
  <button className="btn btn-primary btn-sm col-12 " >Cambiar campus</button>

  </div>

</div>
}

</div>
</div>
<div className="col-md-7 mt-2 col-lg-8">



<div class="card card-game mb-3" >
  <div class="row g-0">
    <div class="col-md-6 col-lg-3 card-white">
      <img src="https://cdn-icons-png.flaticon.com/512/1501/1501686.png" class="img-fluid rounded-start" alt=" checkmate"></img>
    </div>
    <div class="col-md-6 col-lg-9">
      <div class="card-body">
        <h5 class="card-title"><b>Sudoku</b> (Un jugador)</h5>
        <p class="card-text">Completar con numeros del 1 al 9, sin repetir ningún número en la misma fila o columna.</p>
            


        {currentUser &&

        <div>

          {
            livesNumber > 0 &&
            <Link to="/sudoku">
            <button className="btn btn-primary">Jugar</button>
            </Link>
          }


         {
            livesNumber === 0 &&
            <button  disabled className="btn btn-primary">Jugar</button>
          }
        </div>
        
        }

        
            {!currentUser &&
            <button disabled className="btn btn-primary">Jugar</button>

            }

      </div>
    </div>
  </div>
</div>


<div class="card card-game mb-3" >
  <div class="row g-0">
    <div class="col-md-6 col-lg-3 card-white">
      <img src="https://ichi.pro/assets/images/max/640/1*ELxNO3RFHEpG_2JsViRILw.png" class="img-fluid rounded-start" alt="tic tae toe"></img>
    </div>
    <div class="col-md-6 col-lg-9">
      <div class="card-body">
        <h5 class="card-title"><b>Tres en raya</b> (Multijugador)</h5>
        <p class="card-text"> Gana el que consiga hacer línea ya sea vertical, horizontal o diagonal.</p>

        {currentUser &&

<div>

  {
    livesNumber > 0 &&
    <Link to="/tresenraya">
    <button className="btn btn-primary">Jugar</button>
    </Link>
  }


 {
    livesNumber === 0 &&
    <button  disabled className="btn btn-primary">Jugar</button>
  }
</div>

}


    {!currentUser &&
    <button disabled className="btn btn-primary">Jugar</button>

    }
      </div>
    </div>
  </div>
</div>

<div class="card card-game mb-3" >
  <div class="row g-0">
    <div class="col-md-6 col-lg-3 card-white">
      <img src={"https://cdn-icons-png.flaticon.com/512/1707/1707222.png"} class="img-fluid rounded-start" alt=" checkmate"></img>
    </div>
    <div class="col-md-6 col-lg-9">
      <div class="card-body">
        <h5 class="card-title"><b>Conecta 4</b> (Multijugador)</h5>
        <p class="card-text">Se debe conectar 4 fichas de diferentes formas, ya sea horizontal, vertical o diagonal.</p>
            

        
    <button  disabled className="btn btn-primary">Jugar</button>


      </div>
    </div>
  </div>
</div>


<div class="card card-game mb-3" >
  <div class="row g-0">
    <div class="col-md-6 col-lg-3 card-white">
      <img src="https://us.123rf.com/450wm/asnia/asnia1708/asnia170800329/83800586-%EC%A0%88%EC%97%B0-%EB%B9%88-%EC%B2%B4%EC%8A%A4-%ED%8C%90%EC%9E%85%EB%8B%88%EB%8B%A4-%EC%B2%B4%EC%8A%A4-%EB%98%90%EB%8A%94-%EC%B2%B4%EC%BB%A4-%EA%B2%8C%EC%9E%84-%EB%B3%B4%EB%93%9C-%EC%A0%84%EB%9E%B5-%EA%B2%8C%EC%9E%84-%EA%B0%9C%EB%85%90-%EA%B7%B8%EB%A6%BC%EC%9E%85%EB%8B%88%EB%8B%A4-%EB%B0%94%EB%91%91%ED%8C%90-%EB%B0%B0%EA%B2%BD%EC%9E%85%EB%8B%88%EB%8B%A4-.jpg" class="img-fluid rounded-start" alt=" checkmate"></img>
    </div>
    <div class="col-md-6 col-lg-9">
      <div class="card-body">
        <h5 class="card-title"><b>Ajedrez</b> (Multijugador)</h5>
        <p class="card-text">En una partida de ajedrez, si no hay defensa posible contra un jaque, el rey está en jaque mate.</p>
            


        <button  disabled className="btn btn-primary">Jugar</button>


      </div>
    </div>
  </div>
</div>



</div>






</div>
</div>
    </div>

    </>
  );
}

export default Home;
