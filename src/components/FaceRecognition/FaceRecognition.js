import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, boxes}) => {    
    console.log({imageUrl, boxes})
    return (
        <div className="center ma">
            {
                imageUrl ? 
                    <p>There are {boxes.length} face(s) has been detected</p> : 
                    null
            }
            
            <div className="absolute mt5">
                <img id="inputImage" src={imageUrl} alt="" style={{width: '500px', height: 'auto'}}/>
                
                {
                    boxes? boxes.map((box, idx) => {
                        const boxStyle = {
                            top: box.topRow, 
                            bottom: box.bottomRow,
                            left: box.leftCol,
                            right: box.rightCol
                        }
                        return (
                            <div key={idx} className="bounding-box" style={boxStyle}></div>
                        )
                    }) : null
                }
            </div>
        </div>
    )
}

export default FaceRecognition