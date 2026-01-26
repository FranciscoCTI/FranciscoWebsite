import { MarkerF, OverlayView } from '@react-google-maps/api'
import React, { useState } from 'react'
import AECIcon from '../assets/AECIcon.png'
import MarkerInfo from './MarkerInfo';

function MarkerItem({ item }) {

    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div>
            <MarkerF
                position={{ lat: Number(item.latitude), lng: Number(item.longitude) }}
                icon={{
                    url: AECIcon,
                    scaledSize:
                    {
                        width: 40,
                        height: 40
                    }

                }}
                onClick={() => setSelectedItem(item)}
            >
                {
                    selectedItem &&
                    <OverlayView
                        position={{ lat: Number(selectedItem.latitude), lng: Number(selectedItem.longitude) }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div
                            style={{
                                writingMode: 'horizontal-tb',
                                whiteSpace: 'nowrap',
                                transform: 'none'
                            }}>
                            <MarkerInfo item={selectedItem} closeHandler={() => setSelectedItem(null)}></MarkerInfo>
                        </div>
                    </OverlayView>
                }

            </MarkerF>
        </div>
    )
}

export default MarkerItem