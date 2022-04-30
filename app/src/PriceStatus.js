import React from "react";


function PriceStatus(props){
 
      const fecha = new Date(`${props.date}`);
      

      var now = new Date();

    

    return (
        <div>
                {
               fecha < now
               &&
               <button disabled className="btn btn-danger">Desactivado</button>
             }

            {
               fecha >= now
               &&
                <button disabled className="btn btn-success">Activado</button>
             }
         
        </div>
    )
}

export default PriceStatus