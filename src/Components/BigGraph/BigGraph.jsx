import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { numFormatter } from '../Overview/Overview';
let temp = '';

const Formatter = (str, time, location) => {
  let date = new Date(str);
  try {
    if (location === 'world') {

      if (time === '*' || time > 30) {
        
        //1month MMM-yy
        str = str.substring(0, 7);
        date = new Date(str);
        if (str !== temp ) {
          temp = str;
          return format(date, "MMM-yy")
        } else {
          return ""
        }

      } else {
        //1day dd-MMM
        
        if (str !== temp) {
          temp = str;
          return format(date, "dd-MMM")
        } else {
          return ""
        }

      }
    } else {
      
      if (time === '*' || time>30) {
        
        let x = 2;
        if(time<=90){
          x=1;
        }
        //1 or 2month MMM-yy
        let month = date.getMonth();
        str = str.substring(0, 7);
        date = new Date(str);
        if (str !== temp && month % x === 0) {
          temp = str;
          return format(date, "MMM-yy")
        } else {
          return ""
        }

      } else {
        //1day dd-MMM
        if (str !== temp) {
          temp = str;
          return format(date, "dd-MMM")
        } else {
          return ""
        }

      }

    }
  } catch {
    return ""
  }

}
export default function BigGraph(props) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="date" axisLine={false} tickLine={false} tickFormatter={str => {

          return Formatter(str, props.time, props.location);
        }} />
        <YAxis axisLine={false} tickLine={false} scaleToFit={true} tickFormatter={num => {
          return numFormatter(num, false);
        }} />
        <Tooltip />
        <Line type="monotone" dataKey={props.dKey} stroke={props.color} strokeWidth={2.5} dot={false} />
      </LineChart>


    </ResponsiveContainer>
  )
}
