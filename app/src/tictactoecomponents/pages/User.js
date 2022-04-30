import  { useEffect } from "react";
import firebaseconfig from "../../firebase.js";

export function User({id}) {
    const db = firebaseconfig.firestore();

    useEffect(() => {
        const searchImage = async () => {
            const nameCollection = await db.collection('info').doc(id).get();
            name = nameCollection.data().name
        };
        searchImage();
      }, []);

      return name
    
}


