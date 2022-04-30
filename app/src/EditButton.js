import React from 'react'
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ModalBody } from "react-bootstrap";

const EditButton = (props) => {
    const [modal, setModal] = React.useState(false);

    function openModal (){
        setModal(true)
        }
        
        function closeModal (){
          setModal(false)
        }
        
    return (
        <>
          <Modal backdrop="static"
    keyboard={false}  onHide={closeModal} show={modal}>
         
         <ModalHeader><h2>Editar pase</h2>
         
         </ModalHeader>
         <ModalBody>
         </ModalBody>
         <div className="row text-center">
                  <div className="col-6 mb-3">
                  <button class="btn btn-secondary col-11" onClick={() => closeModal()}>Cancelar</button>
                  </div>
                  <div className="col-6">
                  <button class="btn btn-primary col-11" onClick={() => closeModal()}>Listo</button>

                      
                  
                      
                  </div>

                  </div>

       </Modal>
        <div>
            <button onClick={() => openModal()}  className="btn btn-primary">Editar</button>
        </div>
        </>
    )
}

export default EditButton