import React, {useEffect} from "react";
import firebaseconfig from "./firebase";
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ModalBody } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faGem } from "@fortawesome/free-solid-svg-icons";

const BuyButton = (props) =>{
    const db = firebaseconfig.firestore();

    const [adquired, setAdquire] = React.useState(false);
    const [modal, setModal] = React.useState(false);

    const fecha = new Date(`${props.date}`);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    

    const hour = fecha.getHours();
    const minute = fecha.getMinutes();

    const finalDate = fecha.toLocaleDateString("es-ES", options)
     
    function handleGemChanges(newValue) {
        props.onChangeGems(newValue);
    }
    
    
    function handlePointsChange(newValue) {
        props.onChangePoints(newValue);
    }

    function handlePricesChanges(newValue){
        props.onChangePrices(newValue)
    }

    useEffect(() => {
        const searchRequests =   () => {
            const requestscollection =  db.collection('pases').doc(props.campus).collection(props.type).doc(props.id).collection('alumnos').where("user", "==", props.user).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setAdquire(true)
                     
                     });
                }) 
        };
        searchRequests();
      }, []);


     const buyPrice = () =>{
         setModal(true)
         openPriceModal()
     }

     const buyBigPrice = () =>{
        setModal(true)
        openBigPriceModal()
    }

    const closeModal = () =>{
        setModal(false)
    }

    const openPriceModal = () =>{
        setModal(true)

    }

    const openBigPriceModal = () =>{
        setModal(true)


    }


    const confirm =  async () =>{
        if(props.type == 'Pase borrego'){

            setAdquire(true)
            const newValue = props.points-props.cost
            const newPrices = props.prices + 1
            handlePricesChanges(newPrices)
            handlePointsChange(newValue)

            await db.collection('info').doc(props.user).update({puntos: newValue})

            await db.collection('info').doc(props.user).collection('premios').add({
                materia: props.subject,
                tipo: props.type,
                periodo: props.period
            })
            .then(function(docRef) {
              db.collection('pases').doc(props.campus).collection('Pase borrego').doc(props.id).collection('alumnos').add({
             id: docRef.id,
             name: props.name,
             email: props.email,
             user: props.user
            })        
        })
        
            
            closeModal()

            
        }
        else{

            setAdquire(true)
            const newValue = props.gems-props.cost
            const newPrices = props.prices + 1
            handlePricesChanges(newPrices)
            handleGemChanges(newValue)

            await db.collection('info').doc(props.user).update({gemas: newValue })

            await db.collection('info').doc(props.user).collection('premios').add({
                materia: props.subject,
                tipo: props.type,
                periodo: props.period
            })
            .then(function(docRef) {
              db.collection('pases').doc(props.campus).collection('Pase de tarea').doc(props.id).collection('alumnos').add({
             id: docRef.id,
             name: props.name,
             email: props.email,
             user: props.user
            })        
        })

            closeModal()

            

        }
    }





    return(
        <>
         <Modal backdrop="static"
    keyboard={false} onHide={closeModal} show={modal}>
         
            
            
              <ModalHeader><h2>Comprar</h2></ModalHeader>
              <ModalBody>
                  <div>
                  <div className="mb-2">
             <b>Maestro(s): </b>{props.teacher}

            </div>
            
             <div className="mb-2">
                 <b>Materia: </b>{props.subject}
             </div>
             <div className="mb-2">
                 <b>Período: </b>{props.period}
             </div>
             <div className="mb-2">
                 <b>Tipo de pase: </b>{props.type}
             </div>
             <div className="mb-2">
                 <b>Precio: </b>{props.cost}
                 {props.price !== "Pase borrego" &&
                     <FontAwesomeIcon className="icon-gems2" icon={faGem} ></FontAwesomeIcon>
                 }
                 {props.price === "Pase borrego" &&
                    <FontAwesomeIcon className="icon-gems2" icon={faStar} ></FontAwesomeIcon>

                }
             </div>

             {
                 minute < 10 &&
                 <div className="mb-2">
                 <b>Fecha límite: </b>
                 {finalDate + "  " +  hour + ":0" + minute}
                </div>
             }

            {
                 minute > 10 &&
                 <div className="mb-2">
                 <b>Fecha límite: </b>
                 {finalDate + "  " +  hour + ":" + minute}
                </div>
             }
         
                  </div>
              </ModalBody>
              <div className="row text-center">
                  <div className="col-6 mb-3">
                  <button class="btn btn-danger col-11" onClick={() => closeModal()}>Cancelar</button>
                  </div>
                  <div className="col-6">
                 
                  <button  onClick={() => confirm()} class="btn btn-primary col-11">Confirmar</button>
                      
                  
                      
                  </div>

                  </div>

            </Modal>
        <div>

            {
                adquired === false &&
                <div>
                    {
                        props.type !== "Pase borrego" &&
                        <div>

                            { 
                                props.gems < props.cost &&
                                <div>
                                  <button disabled className="btn btn-primary btn-sm">Comprar</button>
                                </div>


                            }

                                

                            {

                                props.gems >= props.cost &&
                                <div>
                                <button onClick={() => buyPrice()}  className="btn btn-primary btn-sm">Comprar</button>
                                </div>

                            }
                   
                        </div>
                    }

                    {
                        props.type === "Pase borrego" &&
                        <div>
                   
                   { 
                                props.points < props.cost &&
                                <div>
                                  <button disabled className="btn btn-primary btn-sm">Comprar</button>
                                </div>


                            }

                                

                            {

                                props.points >= props.cost &&
                                <div>
                                <button  onClick={() => buyBigPrice()}  className="btn btn-primary btn-sm">Comprar</button>
                                </div>

                            }
                        </div>
                    }
                </div>
            }

            {
                adquired===true &&
                <div>
                    <button disabled className="btn btn-primary btn-sm">Comprado</button>
                </div>
            }
        </div>
        </>
    )

}

export default BuyButton