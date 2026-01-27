import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { React, useCallback, useMemo, useState, useEffect, useRef } from 'react'
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
import { MarkerClusterer } from '@react-google-maps/api';

function GoogleMapSection({ projects }) {

    const textColor = useColorModeValue("black.800", "white.300"); // light / dark text
    const backGroundColor = useColorModeValue("whiteAlpha.500", "blackAlpha.500"); // light / dark text

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

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef([]);

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
                options={
                    {
                        disableDoubleClickZoom: true,
                        scrollwheel: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        clickableIcons: false,
                        styles: [
                            {
                                featureType: "poi.business",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "poi",
                                stylers: [{ visibility: "off" }],
                            },
                            {
                                featureType: "transit",
                                stylers: [{ visibility: "off" }],
                            },
                        ]
                    }
                }
            >
                {/* Child component such as markers*/}

                {/*projects.map((item, index) => (
                    <MarkerItem key={index}
                        item={item} />
                ))*/}
                <MarkerClusterer>
                    {(clusterer) =>
                        projects.map((item, index) => (
                            <MarkerItem
                                key={index}
                                item={item}
                                clusterer={clusterer}>
                            </MarkerItem>
                        )
                        )}
                </MarkerClusterer>
            </GoogleMap>
            <Box position={'absolute'}
                top="100px"
                left="350px"
                bg={backGroundColor}
                p={3}
            >
                <VStack>
                    <Text fontSize={30}
                        fontWeight={'bold'}
                        fontFamily={'monospace'}
                        bg="transparent"
                        textColor={textColor}
                    >
                        These are the projects where I have participated
                    </Text>
                </VStack>
            </Box>
        </Box>
    ) : <></>
}

export default GoogleMapSection