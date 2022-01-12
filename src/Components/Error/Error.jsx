import React from 'react'
import './error.css'
import errorGif from '../assets/Error.gif'
export default function Error() {
    return (
        <div className='error'>
            <img src={errorGif} alt="" />
        </div>
    )
}
