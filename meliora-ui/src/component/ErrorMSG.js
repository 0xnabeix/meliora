import React from 'react'

export default function ErrorMSG(props) {
    return (
        <div style={{"color":"red"}}>
            {props.msg && props.msg}
        </div>
    )
}
