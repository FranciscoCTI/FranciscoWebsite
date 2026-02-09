import { MarkerF, OverlayView } from '@react-google-maps/api'
import React, { useState } from 'react'
import MarkerInfo from './MarkerInfo';
import ICON_BY_TYPE from './Icons'

function MarkerItem({ item, clusterer, isSelected, onSelect, onClose }) {

    const toLatLng = (location) => {
        const [lng, lat] = location.coordinates;
        return { lat, lng };
    };

    const icon = ICON_BY_TYPE[item.type] || ICON_BY_TYPE[0];

    return (
        <div>
            <MarkerF
                position={toLatLng(item.location)}
                clusterer={clusterer}
                icon={{
                    url: icon,
                    scaledSize:
                    {
                        width: 40,
                        height: 40
                    }

                }}
                onClick={(e) => {
                    e.domEvent.stopPropagation();
                    onSelect();
                }}
            >
                {
                    isSelected && (
                        <OverlayView
                            position={toLatLng(item.location)}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    writingMode: 'horizontal-tb',
                                    whiteSpace: 'nowrap',
                                    transform: 'none'
                                }}>
                                <MarkerInfo item={item}
                                    closeHandler={onClose}>
                                </MarkerInfo>
                            </div>
                        </OverlayView>
                    )}

            </MarkerF>
        </div>
    )
}

export default MarkerItem