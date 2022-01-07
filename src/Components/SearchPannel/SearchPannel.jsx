import React, { useEffect } from 'react'
import './search.css'
import { Search } from 'react-feather';
import { useState } from 'react/cjs/react.development';
import sort from './sort.svg';
import { numFormatter } from '../Overview/Overview';
let i=0;
export default function SearchPannel(props) {
    const [value, setValue] = useState('');
    const [List,setList] = useState(props.countryList);
    const [hidden, setHidden] = useState(true);
    
    const checkSequence=(country)=>{
        //console.log(country);
        let seq = value[0].toUpperCase() + value.substring(1)
        return  country.name.includes(seq);
    }
    const searchHandler = (e)=>{
        setValue(e.target.value)
        if(value===''){
            setList(props.countryList);
        }else{
            setList(List.filter(checkSequence));
        }
        
    }
    
    useEffect(() => {
        if(value===''){
            //console.log(List);
            setList(props.countryList);
        }
    }, [value,List,props.countryList])

    return (
        <div className="pannel">
            <div className="top">
            <div className="search">
                <Search width={20}/>
                <input type="text" value={value} onChange={searchHandler} name="Search" placeholder='Search Country...' />
            </div>
            <button className='sortBtn' onClick={()=>setHidden(!hidden)}><img src={sort} alt="" /></button>
            </div>
            <div className="sort" style={{height: hidden?0:'auto'}} hidden={hidden}>
                <button hidden={hidden} onClick={()=>props.sort('sort')} className="sortOption Name">Name</button>
                <button hidden={hidden} onClick={()=>props.sort('sort=active')} className="sortOption Active">Active</button>
                <button hidden={hidden} onClick={()=>props.sort('sort=deaths')} className="sortOption Deaths">Deaths</button>
                <button hidden={hidden} onClick={()=>props.sort('sort=recovered')} className="sortOption Recovered">Recovered</button>
                <button hidden={hidden} onClick={()=>props.sort('sort=cases')} className="sortOption Confirmed">Confirmed</button>
                
            </div>
            <div className="list" style={{height: hidden?'82vh':'75vh'}}>
                {List.map(country=>{
                    return (
                    <div key={i++} className="item">
                        <button onClick={()=>{props.changeCountry(country.name)}}>{country.name}
                            <div className="info">
                                <p className='C'>C: {numFormatter(country.case)}</p>
                                <p className='R'>R: {numFormatter(country.recovered)}</p>
                                <p className='A'>A: {numFormatter(country.active)}</p>
                                <p className='D'>D: {numFormatter(country.deaths)}</p>
                            </div>
                            
                        </button>
                    </div>)
                })}
            </div>
        </div>
    )
}
