import React from "react";


function GetDate(props){
 
      const fecha = new Date(`${props.date}`);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      

      const hour = fecha.getHours();
      const minute = fecha.getMinutes();

      const finalDate = fecha.toLocaleDateString("es-ES", options)
      


    return (
        <div>
                {
                 minute < 10 &&
                 <div className="mb-2 date-limit-text">
                 <b>Fecha límite: </b>
                 {finalDate + "  " +  hour + ":0" + minute}
                </div>
             }

            {
                 minute > 10 &&
                 <div className="mb-2 date-limit-text">
                 <b>Fecha límite: </b>
                 {finalDate + "  " +  hour + ":" + minute}
                </div>
             }
         
        </div>
    )
}

export default GetDate