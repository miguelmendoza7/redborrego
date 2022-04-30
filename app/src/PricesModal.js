import React, { useEffect }  from "react"
import firebaseconfig from './firebase.js';


function PricesModal(props){

    const db = firebaseconfig.firestore();
    const [prices, setPrices] = React.useState([]);

    useEffect(() => {
        const searchRequests = async () => {
           const requestsCollection = await db.collection("info").doc(props.user).collection('premios').onSnapshot((snapshot) => {
            setPrices(snapshot.docs.map((doc) => (doc.data()))
           )})
       };
       searchRequests(); 
     }, []);


    return(

        <div className="">

            
{ prices.map((price) => {
return (

  <div>
  {
  price.tipo == 'Pase borrego' &&

  <div key={price.tipo + price.materia + price.periodo} >
    <div class="card card-game2 mb-3" >
  <div class="card-body text-center">
  <h5 class="card-title">{price.tipo + " ("+ price.materia + ")"}</h5>

    <div className="price-status">{price.periodo}</div>


  </div>
</div>
    </div>
}

{
  price.tipo !== 'Pase borrego' &&

  <div key={price.tipo + price.materia + price.periodo} className=" mb-3">
    <div class="card card-game1 mb-3" >
  <div class="card-body text-center">
  <h5 class="card-title">{price.tipo + " ("+ price.materia + ")"}</h5>

    <div className="price-status">{price.periodo}</div>


  </div>
</div>
    </div>
}

  </div>




);
})}


        </div>

    )


}


export default PricesModal