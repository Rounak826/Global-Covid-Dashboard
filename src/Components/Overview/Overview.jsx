import React from 'react'
import './overview.css'
import GraphCard from '../GraphCard/GraphCard'

export default function Overview(props) {
    return (
        <div className="container">
            {/*console.log(props.history)*/}
            <GraphCard  color={'#ff805d'} title={'Confirmed'} num={props.summary.cases} status={numFormatter(props.summary.todayCases, true)} data={props.history.cases}/>
            <GraphCard  color={'#40cde8'} title={'Active'} num={props.summary.active} status={numFormatter(props.summary.todayCases-props.summary.todayRecovered, true)} data={props.history.active}/>
            <GraphCard  color={'#61c589'} title={'Recovered'} num={props.summary.recovered} status={numFormatter(props.summary.todayRecovered, true)} data={props.history.recovered}/>
            <GraphCard  color={'#aaaa'} title={'Deaths'} num={props.summary.deaths} status={numFormatter(props.summary.todayDeaths, true)} data={props.history.deaths}/>
        </div>
    )
}

export const numFormatter = (num , signBool , prev)=>{
    let sign=''
    if(signBool){
        sign='+'
    }
    if(num>=1000000){
        return  (num/1000000).toFixed(0)+' m';

    }else if(num>1000){
        return sign + (num/1000).toFixed(0)+' k';
    }else{
        return sign + num;
    }     
}