import React, {useEffect} from 'react'
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ModalBody } from "react-bootstrap";
import firebaseconfig from './firebase';
import { faGem } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ErraseButton = (props) => {
    const db = firebaseconfig.firestore();

    const [modal, setModal] = React.useState(false);

    const fecha = new Date(`${props.date}`);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    

    const hour = fecha.getHours();
    const minute = fecha.getMinutes();

    const finalDate = fecha.toLocaleDateString("es-ES", options)
     

    function openModal (){
        setModal(true)
        }
        
        function closeModal (){
          setModal(false)
        }


        const deletePrice  =  () => {
            db.collection('pases').doc(props.campus).collection(props.price).doc(props.id).delete();
            setModal(false)
          }
        
    return (
        <>
          <Modal  onHide={closeModal} show={modal}>
         
         <ModalHeader><h2>Borrar pase</h2>
         
        
         </ModalHeader>
         <ModalBody>

             <div className="mb-2">
             <b>Maestro(s): </b>{props.name}

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
         

             <div className="mt-2 container-fluid">Al borrar el pase, se eliminara la lista de alumnos que consiguieron dicho pase.</div>
         </ModalBody>
         <div className="row text-center">
                  <div className="col-6 mb-3">
                  <button class="btn btn-secondary col-11" onClick={() => closeModal()}>Cancelar</button>
                  </div>
                  <div className="col-6">
                  <button class="btn btn-danger col-11" onClick={() => deletePrice()}>Borrar</button>
                  </div>

                  </div>

       </Modal>
        <div>
            <button onClick={() => openModal()}  className="btn btn-danger">Eliminar</button>
        </div>
        </>
    )
}

export default ErraseButton