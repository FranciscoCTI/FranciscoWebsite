import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import { useRef, useState } from 'react';
import MarkerItem from '../components/MarkerItem.jsx';
import { RegularMapStyle } from '../components/MapStyles.js';
import loader from '../components/GoogleMapsLoader.js';

const center = {
    lat: -36.795,
    lng: -73.066,
};

const SetLocationMap = ({ mapClickHandler, dragEndHandler, height, initialMarker }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [latLng, setLatLng] = useState(null);

    const containerStyle = {
        width: '100%',
        height: height,
    };

    const { isLoaded } = loader;

    const createCurrentPinHandler = (event) => {

        if (!event.latLng) return; // Always safe to check!

        const position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };

        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        const marker = new window.google.maps.Marker({
            position,
            map: mapRef.current,
            draggable: true,
            icon: {
                url: MarkerItem,
                scaledSize: new window.google.maps.Size(20, 20)
            }
        });

        marker.addListener('dragend', dragEndHandler);

        markerRef.current = marker;
    };

    return isLoaded ? (
        <div
            style={containerStyle}
            ref={(el) => {
                if (el && !mapRef.current) {
                    mapRef.current = new window.google.maps.Map(el, {
                        center,
                        zoom: 14,
                        styles: RegularMapStyle,
                        gestureHandling: 'greedy',
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false
                    });

                    mapRef.current.addListener('click', createCurrentPinHandler);
                    mapRef.current.addListener('click', mapClickHandler);

                    if (initialMarker && !markerRef.current) {
                        markerRef.current = new window.google.maps.Marker({
                            position: initialMarker,
                            map: mapRef.current,
                            draggable: true,
                            icon: {
                                url: dotIcon,
                                scaledSize: new window.google.maps.Size(20, 20)
                            }
                        });
                        markerRef.current.addListener('dragend', dragEndHandler);

                        mapRef.current.setCenter({
                            lat: initialMarker.lat,
                            lng: initialMarker.lng,
                        });
                    }
                }
            }}
        />
    ) : (
        <p>Loading map...</p>
    );
};

export default SetLocationMap;