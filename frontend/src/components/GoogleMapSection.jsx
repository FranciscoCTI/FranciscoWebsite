import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { React, useCallback, useState } from 'react'
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

function GoogleMapSection() {

    const containerStyle = {
        height: '600px'
    };

    const center = {
        lat: -36.829, lng: -73.036
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    })

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

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
                zoom={8}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {/* Child component such as markers*/}
                <></>
            </GoogleMap>
        </Box>
    ) : <></>
}

export default GoogleMapSection