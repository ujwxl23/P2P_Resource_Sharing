import React, { useEffect, useState, useRef } from 'react'
import { utils } from "ethers";

import "./card.css"
import Card from './Card';
const DetailCard = (data) => {
  console.log(data)
  const [detail, setDetail] = useState("");
  const dataRef = useRef();
  const [useProps, setUseProps] = useState(false);
  const values = data.value.current;
  let props = [];
  function setData() {
    for (var col = 0; col < values[0].length; col++) {
                console.log(values[1][col].toString(),"space")
                if (values[0][col] === "" || values[1][col].toString()==="0")
                  continue;
                var prop = {
                  des: values[0][col],
                  space: values[1][col].toString(),
                  hrs: values[2][col].toString(),
                  rate: utils.formatEther(values[3][col]),
                  id: values[4][col].toString(),
                };
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
      < div class="cardContainer" >
        
          
        {
          useProps ?
            <div className="row">
              {dataRef.current.map((e, i) => {
                return( <div className="card">
        <p>
        <b>Description:</b> {dataRef.current[i].des}
        </p>
         <p>
         <b>Space:</b> {dataRef.current[i].space}
        </p>
        <p>
         <b>Hrs:</b> {dataRef.current[i].hrs}
        </p>
        <p>
        <b>Rate:</b> {dataRef.current[i].rate}
        </p>
         <p>
        <b>Device Id:</b>  {dataRef.current[i].id}
        </p>
      </div>)
                           
               
              })}
              </div>
          :
            <></>
    }
        
     
      
          
        </div>
    )
}

export default DetailCard
