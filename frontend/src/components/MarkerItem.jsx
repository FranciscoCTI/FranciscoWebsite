import { MarkerF } from '@react-google-maps/api'
import React from 'react'

function MarkerItem({ item }) {
    return (
        <div>
            <MarkerF
                position={{ lat: Number(item.latitude), lng: Number(item.longitude) }}></MarkerF>
        </div>
    )
}

export default MarkerItem