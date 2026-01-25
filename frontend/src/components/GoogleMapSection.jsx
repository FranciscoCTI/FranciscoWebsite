import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { React, useCallback, useMemo, useState } from 'react'
import {
    VStack, HStack, Text, Box, useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure
} from '@chakra-ui/react'
import MarkerItem from './MarkerItem';

function GoogleMapSection({ projects }) {

    const containerStyle = {
        width: '100%',
        height: '70vh',
        borderRadius: '20px'
    };

    const center = useMemo(() => (
        {
            lat: -36.829550693894596, lng: -73.03672092503368
        }
    ), []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    })

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        //map.fitBounds(bounds);

        setMap(map)
    }, [center])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <Box alignContent={center}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {/* Child component such as markers*/}
                {projects.map((item, index) => (
                    <MarkerItem key={index}
                        item={item} />
                ))}
            </GoogleMap>
        </Box>
    ) : <></>
}

export default GoogleMapSection