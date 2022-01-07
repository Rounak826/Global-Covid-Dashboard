import './App.css';
import SearchPannel from './Components/SearchPannel/SearchPannel';
import React, { useCallback, useEffect, useState } from 'react';
import Overview from './Components/Overview/Overview';
import Display from './Components/Display/Display';
//const List = [{name:'india', case:12335},{name:'America',case:4858},{name:'brazil', case:1596},{name:'egypt',case:228}, {name:'brazil',case:1585},{name:'japan', case:2313},{name:'New-zealand',case:3133},{name:'india', case:12335},{name:'America',case:4858},{name:'brazil', case:1596},{name:'egypt',case:228}, {name:'brazil',case:1585},{name:'japan', case:2313},{name:'New-zealand',case:3133},{name:'india', case:12335},{name:'America',case:4858},{name:'brazil', case:1596},{name:'egypt',case:228}, {name:'brazil',case:1585},{name:'japan', case:2313},{name:'New-zealand',case:3133},{name:'india', case:12335},{name:'America',case:4858},{name:'brazil', case:1596},{name:'egypt',case:228}, {name:'brazil',case:1585},{name:'japan', case:2313},{name:'New-zealand',case:3133},]

function App() {
  const [countryList, setList] = useState([]);
  const [location, setLocation] = useState('world');
  const [summary, setSummary] = useState({});
  const [sumGraph, setSumGraph] = useState({});
  const [history, setHistory] = useState([]);
  const [criteria, setCriteria] = useState('sort');
  const [time, setTime] = useState('*');
  const [loading, setLoading] =useState('true');
  const [error ,setError] = useState({status:false, message:''});
  //sort
  const sort = (value)=>{
    setCriteria(value);
  } 
  //convert iso to milliseconds
  const isoToMillis = (iso) => {
    let myDate = new Date(iso);
    return myDate.getTime();
  }
  //covert date calculator
  const dateByDays = (days) => {
    let curDate = new Date();
    curDate.setDate(curDate.getDate() - days);
    return curDate.toISOString();
  }

  //process fetched data for summarised graph
  const processData = (obj, newObj, initial) => {
    let temp = initial;
    Object.values(obj).map(cases => {

      newObj.push({ num: cases - temp })
      temp = cases;
      return newObj;

    })
  }
  const delta = (array, newArr, initial) => {
    
    array.map(e => {
      
      newArr.push({
        cases: e.Confirmed - initial.Confirmed,
        recovered: e.Recovered - initial.Recovered<0?0:e.Recovered - initial.Recovered,
        deaths: e.Deaths - initial.Deaths<0?0: e.Deaths - initial.Deaths,
        active: e.Recovered - initial.Recovered<0?0:e.Recovered - initial.Recovered,
        date: e.Date.substr(0, 10)
      })
      initial = e;
      return newArr;
    })
    return newArr;
  }
  const timeHandler = (e) => {
    setTime(e.target.value);

    console.log(time);
  }
  const changeCountry = (country) => {
    setLocation(country);
  }
  //fetch data for big graph
  const historyAll = useCallback(
    () => {
      setLoading(true);
      let url = ``;
      if (location === 'world') {
        if (time === '*') {
          url = `https://api.covid19api.com/world`;
        } else {
          url = `https://api.covid19api.com/world?from=${dateByDays(time)}&to=${dateByDays(1)}`;
        }
        fetch(url).then(res => res.json().then(data => {
          let newData = [];
          data.sort((a, b) => { return isoToMillis(a.Date) - isoToMillis(b.Date) })
          data.map(x => {
            if (x.NewRecovered < 20000000) {

              newData.push({ cases: x.NewConfirmed, recovered: x.NewRecovered, deaths: x.NewDeaths, active: (x.NewConfirmed - x.NewRecovered - x.NewDeaths), date: x.Date.substr(0, 10) })
            } else {
             
              newData.push({ cases: x.NewConfirmed, recovered: 0, deaths: x.NewDeaths, active: 0, date: x.Date.substr(0, 10) })

            }
            return newData;
          })
          setHistory(newData);
          if(newData.length<=0){
            setError({status:true,message:'no record found'})
          }else{
            setError({status:false,message:'record found'})
          } 
          setLoading(false);
        })).catch(e=>{setError({status:true,message:e});setLoading(false);})
      } else {

        if (time === '*') {
          url = `https://api.covid19api.com/total/country/${location}`;
        } else {
          url = `https://api.covid19api.com/total/country/${location}?from=${dateByDays(time)}&to=${dateByDays(1)}`;
        }
        fetch(url).then(res => res.json().then(data => {
          let newData = [];
          data.sort((a, b) => { return isoToMillis(a.Date) - isoToMillis(b.Date) })
          //process data by finding change in respective fields
          newData = delta(data, newData, data[0]);
          setHistory(newData);
          if(newData.length<=0){
            setError({status:true,message:'no record found'})
          }else{
            setError({status:false,message:'record found'})
          }
          setLoading(false);
        })).catch(e=>{setError({status:true,message:e});setLoading(false);})
      }
    },
    [time, location],
  )



  //fetch data for summarised graphs
  const historic30 =useCallback(
    async () => {
      let url = ``;
      if (location === 'world') {
        url = `https://disease.sh/v3/covid-19/historical/all?lastdays=30`;
      } else {
        url = `https://disease.sh/v3/covid-19/historical/${location}?lastdays=30`;
      }
  
      fetch(url).then(res => {
        res.json().then(data => {
  
          let graphData = {
            cases: [],
            deaths: [],
            recovered: [],
            active: [],
          }
          if (location === 'world') {
            //let temp = data.cases[0];
            processData(data.cases, graphData.cases, data.cases[0])
            processData(data.recovered, graphData.recovered, data.recovered[0])
            processData(data.deaths, graphData.deaths, data.deaths[0])
  
            for (let i = 0; i < graphData.cases.length; i++) {
              //console.log(graphData.cases[i])
              graphData.active.push({ num: graphData.cases[i].num - graphData.recovered[i].num - graphData.deaths[i].num });
            }
          } else {
            //let temp = data.timeline.cases[0];
            processData(data.timeline.cases, graphData.cases, data.timeline.cases[0])
            processData(data.timeline.recovered, graphData.recovered, data.timeline.recovered[0])
            processData(data.timeline.deaths, graphData.deaths, data.timeline.deaths[0])
  
            for (let i = 0; i < graphData.cases.length; i++) {
              //console.log(graphData.cases[i])
              graphData.active.push({ num: graphData.cases[i].num - graphData.recovered[i].num - graphData.deaths[i].num });
            }
          }
  
          setSumGraph(graphData);
          
        })
      })
  
    }
    ,
    [location],
  )
  
  
  //fetch data for summary
  const getSummary = useCallback(
    () => {
      let url = ``;
      if(location==='world'){
        url = `https://disease.sh/v3/covid-19/all`
      }else{
        url = `https://disease.sh/v3/covid-19/countries/${location}`
      }
       
      fetch(url).then(res => {
        res.json().then(data => {
          setSummary(data);
        })
      })
    }
    ,
    [location],
  )
  const getCountryList = useCallback(
    ()=>{
      let url = `https://corona.lmao.ninja/v2/countries?yesterday&${criteria}`;
        fetch(url).then(res => {
          res.json().then(data => {
            let CountryData = [];
            data.map(x => CountryData.push({ 
              name: x.country,
              case: x.cases,
              recovered:x.recovered,
              active:x.active,
              deaths:x.deaths
            
            }))
            setList(CountryData);
          })
        });
    }
    ,
    [criteria],
  )

  useEffect(() => {
    if (!countryList.length) {
      getCountryList();
    }
    if (!Object.keys(summary).length) {
      getSummary();
    }
    if (!Object.keys(sumGraph).length) {
      historic30();
    }

    //console.log(summary);
  }, [getCountryList, getSummary,summary, location,countryList.length,historic30,sumGraph]);
 
 
  useEffect(() => {
    
      historic30()
      getSummary()
    
  }, [location,historic30,getSummary])

  
  
  useEffect(() => {
    historyAll();
  }, [time, location,historyAll])
  
  useEffect(() => {
    getCountryList()  
  }, [criteria,getCountryList])

  return (
    <div className="App">
      <SearchPannel countryList={countryList} changeCountry={changeCountry} sort={sort}/>
      <div className="main">
        <h1 className='head'>COVID-19<span> Dashboard | </span><span className="location">{location}</span></h1>
        <Overview summary={summary} history={sumGraph} />
        <Display error={error} loading={loading} time={time} timeHandler={timeHandler} data={history} location={location}/>
      </div>
    </div>
  );
}

export default App;
