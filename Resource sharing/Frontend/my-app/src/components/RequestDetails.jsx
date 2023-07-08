import React from 'react'
import {useState,useRef,useEffect} from 'react'
import {utils} from 'ethers'
import "./card.css"

const RequestDetails = (data) => {
    console.log(data.value);
    const dataRef = useRef();
  const [useProps, setUseProps] = useState(false);
  const values = data.value.current;
      function setData() {
          for (var i = 0; i < values.length; i+=3){
              var prop = {
                  deviceId: values[i].toString(),
                  requestId: values[i + 1].toString(),
                  reqHrs: values[i + 2].toString()
              }
              dataRef.current.push(prop);
          }
    setUseProps(true);
      }
    
    useEffect(() => {
     dataRef.current = [];
    setData();
console.log(dataRef.current);
  })
    return (
        <div className="cardContainer">
            {
                useProps ?
                     <div className="row">

                        {
                            dataRef.current.map((e) => {
                                return (
                    <div className="card">
                    <p>
                        <b>Device Id:</b> {e.deviceId}
                    </p>
                    <p>
                         <b>Request Id:</b> {e.requestId}
                    </p>
                     <p>
                        <b>Time Period:</b> {e.reqHrs} hrs
                    </p>
                </div>
                                )
                            })
                        }
             
                    </div>
                    :
                    <></>
            }
           
        </div>
    )
}

export default RequestDetails
