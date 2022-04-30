import firebaseconfig from './firebase.js';
import { AuthContext } from "./Auth.js";
import React, { useContext, useEffect } from "react";
import ErraseButton from './ErraseButton.js';
import StudentButton from './StudentButton.js';
import EditButton from './EditButton.js';
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ModalBody } from "react-bootstrap";
import "./Teacher.css"
import GetDate from './GetDate.js';
import PriceStatus from './PriceStatus.js';

function Teacher ({history}){

    const { currentUser } = useContext(AuthContext);
    const db = firebaseconfig.firestore();

    if (currentUser) {
        if (currentUser._delegate.uid !== "eUQeAWWwIoQ0dvwoZRSwfIJtG5r2"){
          history.push({ pathname: `/`})
        }
      }
      const [modal, setModal] = React.useState(false);
      const [campus, setCampus] = React.useState('');
      const [campusPrices, setCampusPrices] = React.useState([]);
      const [campusBigPrices, setCampusBigPrices] = React.useState([]);

      const [teacherName, setTeacherName] = React.useState("");
      const [subject, setSubject] = React.useState("");
      const [period, setPeriod] = React.useState("Seleccione aquí el período de la materia");
      const [priceType, setPriceType] = React.useState("Seleccione aquí el tipo de pase");
      const [price, setPrice] = React.useState("");
      const [date, setDate] = React.useState("");
    


      useEffect(() => {
        const searchImage = async () => {
          if (currentUser){
            const nameCollection = await db.collection('admins').doc(currentUser._delegate.uid).get();
            setCampus(nameCollection.data().campus)


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

      function openModal (){
          setModal(true)
          }
          
          function closeModal (){
            setModal(false)
          }

          const saveName = (event) =>{
            setTeacherName(event.target.value);
          }

          const saveSubject = (event) =>{
            setSubject(event.target.value);
          }
        
          const savePeriod = (event) =>{
            setPeriod(event.target.value);
          }
          
          const savePriceType = (event) =>{
            setPriceType(event.target.value);
          }
          const savePrice = (event) =>{
            setPrice(event.target.value);
          }

          const saveDate = (event) =>{
            setDate(event.target.value);
          }

          const addPrice = async () =>{
            if (priceType == "Pase borrego"){

              await db.collection("pases").doc(campus).collection('Pase borrego').add({
                  coste: parseInt(price),
                  materia: subject,
                  periodo: period,
                  nombre: teacherName,
                  fecha: date,
                  tipo: 'Pase borrego'
              }).then(function(docRef) {
                db.collection('pases').doc(campus).collection('Pase borrego').doc(docRef.id).update({
               id: docRef.id
              })          
          })

          
            }else { 
              await db.collection("pases").doc(campus).collection('Pase de tarea').add({
                coste: parseInt(price),
                materia: subject,
                periodo: period,
                fecha: date,
                nombre: teacherName,
                tipo: priceType
            }).then(function(docRef) {
              db.collection('pases').doc(campus).collection('Pase de tarea').doc(docRef.id).update({
             id: docRef.id
            })          
        })

            }

            setModal(false)
            setTeacherName("");
            setSubject("");
            setPeriod("");
            setPriceType("");
            setPrice(0);
            setDate("");
      
          }

return(
  <>

<Modal backdrop="static"
    keyboard={false} onHide={closeModal} show={modal}>
         
            
            
              <ModalHeader><h2>Añadir nuevo pase</h2></ModalHeader>
              <ModalBody>
              <label >Nombre del maestro(s): </label>
               <input onChange={saveName} value={teacherName} autoComplete="off"  className="teacher-input col-12" name="name" type="name" id="teacher-name" required placeholder="Escriba aquí el nombre del o los maestros" />
               <label >Nombre de la materia: </label>
               <input onChange={saveSubject} value={subject} autoComplete="off"  className="teacher-input col-12" name="name" type="name" id="subject-name" required placeholder="Escriba aquí el nombre de la materia" />
               <label >Seleccionar período: </label>
               <select onChange={savePeriod} value={period} required type="text" autoComplete="off" class=" col-12 teacher-input" id="period" name="semester">
                <option className="disabled-option" selected={true} disabled="true" >Seleccione aquí el período de la materia</option>
                <option >Primer semestre</option>
                <option >Segundo semestre</option>
                <option >Tercer semestre</option>
                <option >Cuarto semestre</option>
                <option >Quinto semestre</option>
                <option >Sexto semestre</option>
                </select>
                <label >Seleccionar tipo de pase: </label>
               <select onChange={savePriceType} value={priceType} required type="text" autoComplete="off" class=" col-12 teacher-input " id="price-type" name="pase">
                <option className="disabled-option" selected={true} disabled="true" >Seleccione aquí el tipo de pase</option>
                <option >Pase borrego</option>
                <option >Pase de tarea</option>
                <option >Pase de décimas</option>
                </select>
                <label >Indicar precio:</label>
                <input onChange={savePrice} value={price} autoComplete="off"  className="teacher-input col-12" name="price" type="number" id="price" required placeholder="Escriba aquí el precio del pase" />
                <label >Indicar fecha límite:</label>
                <input onChange={saveDate} value={date} autoComplete="off"  className="teacher-input col-12" name="date" id="date-limit" type="datetime-local" required placeholder="Indique la fecha límite " />
             
              </ModalBody>
              <div className="row text-center">
                  <div className="col-6 mb-3">
                  <button class="btn btn-danger col-11" onClick={() => closeModal()}>Cancelar</button>
                  </div>
                  <div className="col-6">
                 {
                   (teacherName!==""&&subject!==""&&period!=="Seleccione aquí el período de la materia"&&priceType!=="Seleccione aquí el tipo de pase"&& price !== ""&&date!=="") && 
                   <button class="btn btn-primary col-11" onClick={() => addPrice()}>Añadir</button>

                 }

                  {
                   (teacherName==""||subject==""||period=="Seleccione aquí el período de la materia"||priceType=="Seleccione aquí el tipo de pase"|| price == ""||date=="") && 
                   <button class="btn btn-primary col-11" disabled>Añadir</button>

                 }


                  
                      
                  </div>

                  </div>

            </Modal>
    <div>

<nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">

    <div className="navbar-brand  navbar-title" >Red Borrego Administrador</div>

    <button className="navbar-brand navbar-button" onClick={() => firebaseconfig.auth().signOut()}>Cerrar sesión</button>


  </div>
</nav>

<div className="container">
<div className=" row">
  <div className="col-lg-1"></div>
  <div className=" text-center col-lg-5  col-md-5">
  <div className="sticky-top pt-3">

    <h3 className="text-white ">Prepatec {campus}</h3>
    <button onClick={() => openModal()}  className="btn btn-light col-10 mt-3">
      Añadir pase
    </button>

    <button onClick={() => firebaseconfig.auth().signOut()} className="btn btn-primary col-10 mt-3">
      Cambiar campus
    </button>

  </div>
  </div>

  <div className="col-md-7 col-lg-5 mt-2">

<div className="row">

  { campusPrices.map((price) => {
      return (
      <div key={price.materia+price.periodo+price.coste+price.tipo} className="col-12  mt-3 ">
     <div class="card card-game1 mb-3" >
       <div class="card-body text-center">

       <h5 class="card-title">{price.tipo+' (' + price.materia + ')'}</h5>
       <div className="price-status">{price.periodo} con {price.nombre}</div>


       <div className="row mt-3 mb-3">
<div className="col-4 ">
<div>
<StudentButton campus={campus} name={price.nombre} date={price.fecha} cost={price.coste}  id={price.id} price={'Pase de tarea'} subject={price.materia} type={price.tipo} period={price.periodo}></StudentButton>
        </div>
</div>
<div className="col-4">

<PriceStatus date={price.fecha}></PriceStatus>

</div>
<div className="col-4">
  <ErraseButton campus={campus} name={price.nombre} date={price.fecha} cost={price.coste} id={price.id} price={'Pase de tarea'} subject={price.materia} type={price.tipo} period={price.periodo}></ErraseButton>

</div>

</div>

<div className="white-text mb-2">
  <GetDate date={price.fecha}></GetDate>
</div>

         </div>
         </div>
         </div>

      )

    }) 
    }
      { campusBigPrices.map((price) => {
      return (
      <div key={price.materia+price.periodo+price.coste+price.tipo} className="col-12 mt-3 ">
     <div class="card card-game2 mb-3" >
       <div class="card-body text-center">

       <h5 class="card-title">{price.tipo+' (' + price.materia + ')'}</h5>
       <div className="price-status">{price.periodo} con {price.nombre}</div>

       <div className="row mt-3 mb-3">
<div className="col-4">
<div>  
<StudentButton campus={campus} name={price.nombre} date={price.fecha} cost={price.coste} id={price.id} price={'Pase borrego'} subject={price.materia} type={price.tipo} period={price.periodo}></StudentButton>

        </div>
</div>
<div className="col-4">
<PriceStatus date={price.fecha}></PriceStatus>


</div>
<div className="col-4">
<ErraseButton campus={campus} name={price.nombre}  date={price.fecha} cost={price.coste} id={price.id} price={'Pase borrego'} subject={price.materia} type={price.tipo} period={price.periodo}></ErraseButton>
</div>

</div>
<div className="mb-2">
  <GetDate date={price.fecha}></GetDate>
</div>


         </div>
         </div>
         </div>

      )

    }) 
    }
  </div>

  </div>

  <div className="col-lg-1"></div>


  </div>

</div>
    </div>

    </>
)

}

export default Teacher