import React from 'react'
import './graphCard.css'
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function GraphCard(props) {
    const formatNum=(x)=>{
        if(x) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return (
        <div className="card">
            <div className="info">
                <div className="col">
                    <p>{props.title}</p>
                    <h4>{formatNum(props.num)}</h4>
                </div>
                <div className="status" style={{backgroundColor:props.color}}>
                    <p>{props.status}</p>
                </div>
            </div>
            <div className="graph">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart width={150} height={40} data={props.data}>
                        <Bar barSize={4} dataKey="num" fill={props.color} radius={[5, 5, 5, 5]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
