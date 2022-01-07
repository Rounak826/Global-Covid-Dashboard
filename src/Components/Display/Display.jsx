import React, { useState } from 'react'
import BigGraph from '../BigGraph/BigGraph';
import Error from '../Error/Error';
import Loader from '../Loader/Loader';
import './display.css';
export default function Display(props) {
  //console.log(props.data)
  const [Bool, setBool] = useState({
      cases : true,
      recovered: false,
      deaths: false,
      active:false
  })
    return (
        <div className="bigGraph">
            <div className="controls">
                <button autoFocus={Bool.cases} onClick={()=>setBool({
                    cases : true,
                    recovered: false,
                    deaths: false,
                    active:false
                })} className='confirm'>Confirmed</button>

                <button onClick={()=>setBool({
                    cases : false,
                    recovered: false,
                    deaths: false,
                    active:true
                })} className='active'>Active</button>
                <button onClick={()=>setBool({
                    cases : false,
                    recovered: true,
                    deaths: false,
                    active:false
                })} className='recovered'>Recovered</button>
                <button onClick={()=>setBool({
                    cases : false,
                    recovered: false,
                    deaths: true,
                    active:false
                })} className='death'>Death</button>
                <select name="time" value={props.time} onChange={props.timeHandler}>
                    <option value="7">1 week</option>
                    <option value="29">1 month</option>
                    <option value="90">3 month</option>
                    <option value="*">beginning</option>
                </select>
            </div>
            <div className="graph">
               
                {props.loading&&<Loader />}
                {!props.loading&&props.error.status&&<Error />}
                {Bool.cases&&!props.loading&&!props.error.status&&<BigGraph location={props.location} time={props.time}  data={props.data} dKey={'cases'} color={'#ff805d'} />}
                {Bool.recovered&&!props.loading&&!props.error.status&&<BigGraph location={props.location} time={props.time}  data={props.data} dKey={'recovered'} color={'#61c589'} />}
                {Bool.deaths&&!props.loading&&!props.error.status&&<BigGraph location={props.location} time={props.time} data={props.data} dKey={'deaths'} color={'#aaaa'} />}
                {Bool.active&&!props.loading&&!props.error.status&&<BigGraph location={props.location} time={props.time} data={props.data} dKey={'active'} color={'#40cde8'} />}
                
                    
            </div>
        </div>
    )
}
