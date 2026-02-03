import { MarkerF, OverlayView } from '@react-google-maps/api'
import React, { useState } from 'react'
import AECIcon from '../assets/AECIcon.png'
import MarkerInfo from './MarkerInfo';

function MarkerItem({ item, clusterer }) {

    const [selectedItem, setSelectedItem] = useState(null);

    const toLatLng = (location) => ({
        lat: location.coordinates[1],
        lng: location.coordinates[0],
    });

    return (
        <div>
            <MarkerF
                position={toLatLng(item.location)}
                clusterer={clusterer}
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
                        position={toLatLng(item.location)}
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