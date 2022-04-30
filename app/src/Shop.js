import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { faGem } from "@fortawesome/free-solid-svg-icons";
import "./shop.css";
import { AuthContext } from "./Auth.js";
import React, { useContext, useEffect } from "react";
import firebaseconfig from "./firebase";
import Verify from "./VerifyUser";
import BuyButton from "./BuyButton";
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ModalBody } from "react-bootstrap";
import PricesModal from './PricesModal.js';
import GetDate from "./GetDate";

function Shop({history}){
  const { currentUser } = useContext(AuthContext);
  const db = firebaseconfig.firestore();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const [campus, setCampus] = React.useState('');
  const [modal, setModal] = React.useState(false);

  const [campusPrices, setCampusPrices] = React.useState([]);
  const [campusBigPrices, setCampusBigPrices] = React.useState([]);

  const [points, setPoints] = React.useState(0);
  const [gems, setGems] = React.useState(0);

  const [pricesNumber, setPricesNumber] = React.useState('');

  const today = new Date()


  if (currentUser) {
    Verify(currentUser._delegate.uid)
  }

  useEffect(() => {
    const searchImage = async () => {
      if (currentUser){
        const nameCollection = await db.collection('info').doc(currentUser._delegate.uid).get();
        setPoints(parseInt(nameCollection.data().puntos));
        setName(nameCollection.data().name)
        setCampus(nameCollection.data().campus)
        setGems(parseInt(nameCollection.data().gemas))
        setEmail(nameCollection.data().email)

        const campusCollectionPrices = await db.collection("pases").doc(nameCollection.data().campus).collection('Pase de tarea').onSnapshot((snapshot) => {
          setCampusPrices(snapshot.docs.map((doc) => (doc.data()))
         )});


         const campusCollectionBigPrices = await db.collection("pases").doc(nameCollection.data().campus).collection('Pase borrego').onSnapshot((snapshot) => {
          setCampusBigPrices(snapshot.docs.map((doc) => (doc.data()))
         )});


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
      } 
    };
    searchRequests();

  }, []);



 function handleGemChanges(newValue) {
  setGems(newValue);
}

function handlePointsChange (newValue) {
  setPoints(newValue);
}

function handlePricesChanges(newValue) {
  setPricesNumber(newValue);
}


function openModal (){
setModal(true)
}

function closeModal (){
  setModal(false)
}

return(
  <>
   <Modal  onHide={closeModal} show={modal}>
         
              <ModalHeader><h2>Tus premios</h2>
              
              <div className="pointer">
              <FontAwesomeIcon icon={faTimes} onClick={() => closeModal()}></FontAwesomeIcon>
              </div>
              </ModalHeader>
              <ModalBody>
              </ModalBody>
              <div className=" container text-center mb-3">
              <PricesModal user={currentUser._delegate.uid}></PricesModal>

               
                  </div>

            </Modal>
    <div>
        <nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">
<Link to="/">

    <div className="navbar-brand navbar-title" >Red Borrego</div>
    </Link>

    <Link to="/">
    <button className="navbar-brand navbar-button">Inicio</button> 
    </Link>


  </div>
</nav>

<div className="container mt-4">
  <h2 className="white-text mb-4">Tienda Prepatec {campus}</h2>
    <div className="row"> 
    <div className="col-lg-4  col-md-6 mb-3">

{currentUser &&

    <div className="card presentation-card card-game">
        <div className="card-body text-center">
        <h5 className="card-title profile-name mt-2">{name}</h5>
    <div className="row mt-4 mb-4">
    <div className="col-4">
    <div>{points}
        
        <FontAwesomeIcon  className="icon-points" icon={faStar} ></FontAwesomeIcon>
        </div>

      </div>

      <div className="col-4">
     

     <div>{pricesNumber}
     
     <FontAwesomeIcon className="icon-trophy" icon={faTrophy} ></FontAwesomeIcon>
     </div>

   </div>

      <div className="col-4">
    <div>{gems}
        
        <FontAwesomeIcon  className="icon-gem" icon={faGem} ></FontAwesomeIcon>
        </div>

      </div>

     
</div>

<div className="text-center mb-3">
{pricesNumber == 0 && 
        <button disabled className="btn btn-success btn-sm">Ver premios</button>
      }

      {
        pricesNumber > 0 && 
        <button onClick={() => openModal()} className="btn prices-button btn-success btn-sm">Ver premios</button>

      }
      </div>
        </div>

    </div>

    }

    </div>

    { campusPrices.map((price) => {
      return (
        <>
        { new Date(price.fecha) >= today &&
      <div key={price.materia+price.periodo+price.coste+price.tipo} className="col-lg-4 col-md-6 mb-3">
     <div class="card card-game1 mb-3" >
       <div class="card-body text-center">

       <h5 class="card-title">{price.tipo+' (' + price.materia + ')'}</h5>
       <div className="price-status">{price.periodo} con {price.nombre}</div>

       <div className="row mt-3 mb-3">
<div className="col-lg-1"></div>
<div className="col-md-6 col-lg-5 col-6">
<div>{price.coste}
        <FontAwesomeIcon  className="icon-gem" icon={faGem} ></FontAwesomeIcon>
        </div>
</div>
<div className="col-md-6 col-lg-5 col-6">
<BuyButton onChangeGems={handleGemChanges} onChangePrices={handlePricesChanges} name={name}  email={email} subject={price.materia} price={price.tipo} prices={pricesNumber} points={points} gems={gems} user={currentUser._delegate.uid} cost={price.coste} period={price.periodo} teacher={price.nombre} date={price.fecha} campus={campus} type={price.tipo} id={price.id} />
</div>
<div className="col-lg-1"></div>

</div>

<div className="white-text mb-2">
<GetDate date={price.fecha}></GetDate>
</div>


         </div>
         </div>
         </div>
         }
</>
      )
    
    }) 
    }


{ campusBigPrices.map((price) => {

      return (
        <>
        { new Date(price.fecha) >= today &&
      <div key={price.materia+price.periodo+price.coste} className="col-lg-4  col-md-6 mb-3">
     <div class="card card-game2 mb-3" >
       <div class="card-body text-center">

       <h5 class="card-title">{'Pase borrego (' + price.materia + ')'}</h5>
       <div className="price-status">{price.periodo} con {price.nombre}</div>

       <div className="row mt-3 mb-3">
<div className="col-lg-1"></div>
<div className="col-md-6  col-lg-5 col-6">
<div>{price.coste}
        <FontAwesomeIcon  className="icon-points" icon={faStar} ></FontAwesomeIcon>
        </div>
</div>
<div className="col-md-6 col-lg-5 col-6">
<BuyButton onChangePoints={handlePointsChange} onChangePrices={handlePricesChanges}  name={name} email={email} subject={price.materia} prices={pricesNumber} points={points} teacher={price.nombre} date={price.fecha} period={price.periodo} gems={gems} user={currentUser._delegate.uid} campus={campus} price={price.tipo} cost={price.coste} type={'Pase borrego'} id={price.id}/>

</div>
<div className="col-lg-1"></div>

</div>

<div className="mb-2">
<GetDate date={price.fecha}></GetDate>
</div>
         </div>
         </div>
         </div>
      }

 </>
      )

    }) 
    }

    </div>


</div>

    </div>

</>
);
}

export default Shop