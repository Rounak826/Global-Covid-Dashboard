import React from 'react'
import './loader.css'
import loaderGif from '../assets/loader.gif'
export default function Loader() {
    return (
        <div className='loader'>
            <img src={loaderGif} alt="" />
        </div>
    )
}
