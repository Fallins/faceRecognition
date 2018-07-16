import React from 'react'
import Tilt from 'react-tilt'
import LogoIcon from './Logo.png'
import './Logo.css'

const Logo = ({devClick}) => {
    return (
        <div className="logo ma4 mt3" onClick={devClick}>
            <Tilt className="Tilt" options={{ max: 60, scale: 1.1 }} style={{ height: 64, width: 64 }} >
                <div className="Tilt-inner">
                    <img src={LogoIcon} alt="Logo"/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo