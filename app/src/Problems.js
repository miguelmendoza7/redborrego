import { Link } from "react-router-dom";
import { AuthContext } from "./Auth.js";
import React, { useEffect, useContext } from "react";
import Verify from "./VerifyUser.js";
import firebaseconfig from "./firebase.js";

function Problems(){
    const { currentUser } = useContext(AuthContext);
    const db = firebaseconfig.firestore();

    const [problem, setProblem] = React.useState([]);
    const [results, setResults] = React.useState([]);
    const [checked, setChecked] = React.useState(false);
    const [wrong, setWrong] = React.useState(true);

    const [livesNumber, setLivesNumber] = React.useState(0);
    const [gemsNumber, setGemsNumber] = React.useState(0);
  
    if (currentUser) {
      Verify(currentUser._delegate.uid) 
      }

     useEffect(() => {
        const searchRequests = async () => {
        const nameCollection = await db.collection('info').doc(currentUser._delegate.uid).get();
        setLivesNumber(nameCollection.data().vidas);
        setGemsNumber(nameCollection.data().gemas)

           newProblem()
           
        
      
       };
       searchRequests(); 
     }, []);


     const check = async (estado) =>{
         if (estado == "correcta"){
             const newLives = livesNumber + 1;
             const newGems = gemsNumber + 5;

             await db.collection('info').doc(currentUser._delegate.uid).update({gemas: newGems, vidas: newLives})
             setLivesNumber(newLives)
             setGemsNumber(gemsNumber)
            setWrong(false)
         }
         else {
             setWrong(true)

         }
         setChecked(true)

     }

     const newProblem =  async () =>{
        const requestsCollection = await db.collection("lecturas").get();

        const records = requestsCollection.docs;
        const randomID = Math.floor(Math.random() * requestsCollection.size)
        const result = records[randomID].data();
        setProblem(result)
     
        const answers = []
        const arr = [];

         while(arr.length < 4){
             var r = Math.floor(Math.random() * 4) ;
             if(arr.indexOf(r) === -1){
                 arr.push(r) 
                 answers.push(result.respuestas[r])
             };
         }
        setResults(answers)

        setChecked(false)

    }
   
   
return(
    <div>
        <nav className="navbar navbar-dark bg-dark pt-3 pb-3">
<div className="container-fluid">
<Link to="/">

    <div className="navbar-brand  navbar-title" >Red Borrego</div>
    </Link>
        <Link to="/">
    <button className="navbar-brand navbar-button">Inicio</button> 
    </Link>


  </div>
</nav>

<div className="container">
    <div className="row">
    <div className="col-lg-8">
    <h3 className="white-text mt-3 mb-3">Problemas</h3>
    <div className="white-text">{problem.texto}</div>
    </div>

    <div className="col-lg-4">
    <h6 className=" bg-white text-dark p-3 mt-4 mb-4">{problem.pregunta}</h6>

{ !checked &&
    <div>
    
    { results.map((result) => {
return (
    

  <button disabled={checked} onClick={() => check(result.estado)}  key={result.respuesta} className={`p-2 mb-2 col-12 text-white btn btn-secondary`}>
      {result.respuesta}

  </button>

);
})}
</div>
}

{
    (checked && !wrong)&& 

    <div>


         { results.map((result) => {
return (
    <>
    { result.estado !== "correcta" &&
  <button disabled={true}   key={result.respuesta} className={`p-2 mb-2 col-12 text-white btn btn-secondary`}>
      {result.respuesta}

  </button>
  }

{ result.estado === "correcta" &&
  <button disabled={true}   key={result.respuesta} className={`p-2 mb-2 col-12 text-white btn btn-success`}>
      {result.respuesta}

  </button>
  }


</>);
})}


    
    </div>

}
 


{
    (checked && wrong)&& 

    <div>


         { results.map((result) => {
return (
    <>
    { result.estado !== "correcta" &&
  <button disabled={true}   key={result.respuesta} className={`p-2 mb-2 col-12 text-white btn btn-danger`}>
      {result.respuesta}

  </button>
  }

{ result.estado === "correcta" &&
  <button disabled={true}   key={result.respuesta} className={`p-2 mb-2 col-12 text-white btn btn-success`}>
      {result.respuesta}

  </button>
  }


</>);
})}


    
    </div>

}

{
    checked && 
    <button onClick={() => newProblem()} className="btn btn-primary mt-4">Nuevo intento</button>

}

    </div>

   
    </div>

</div>


    </div>

);
}

export default Problems