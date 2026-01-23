import { useEffect, useState, useRef, Button } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, Marker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googleMaps/markerclusterer';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import uIcon from '../assets/UniversityIcon.png'
import AECIcon from '../assets/AECIcon.png'
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
import PopUpContentBox from '../components/PopUpContentBox.jsx';
import ReactDOM from 'react-dom/client';

const MyMap = ({ content }) => {

    const startPosition = { lat: -36.829550693894596, lng: -73.03672092503368 };

    const [zoom, setZoom] = useState(9);
    const [position, setPosition] = useState(startPosition);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProject, setSelectedProject] = useState(null);

    const handleMarkerClick = (project) => {
        setSelectedProject(project);
        onOpen();
    };

    const textColor = useColorModeValue("black.800", "white.300"); // light / dark text
    const backGroundColor = useColorModeValue("whiteAlpha.500", "blackAlpha.500"); // light / dark text

    function ClusteredMarkers() {
        const map = useMap();
        const [clusterer, setClusterer] = useState(null);
        const [infoWindow, setInfoWindow] = useState(null);

        useEffect(() => {
            if (!map) return;

            const iw = new window.google.maps.InfoWindow();
            setInfoWindow(iw);

            const googleMarkers = content.map(pos => {

                const marker = new window.google.maps.Marker({
                    position: { lat: pos.latitude, lng: pos.longitude },
                    icon: {
                        url: AECIcon,
                        scaledSize: new window.google.maps.Size(40, 40)
                    }
                })

                marker.addListener("click", () => {
                    const container = document.createElement('div');
                    const root = ReactDOM.createRoot(container);
                    root.render(<PopUpContentBox project={pos} onPressButton={() =>
                        handleMarkerClick(selectedProject)} />)
                    iw.setContent(container);
                    iw.open(map, marker);
                    //handleMarkerClick(pos)
                });

                return marker;
            });

            const markerCluster = new MarkerClusterer({ markers: googleMarkers, map });

            setClusterer(markerCluster)

            return () => {
                markerCluster.clearMarkers();
                iw.close();
            }
        }, [map]);

        return null;
    };

    return (
        <div>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <div style={{ height: "75vh" }}>
                    <Map center={position}
                        zoom={zoom}
                        mapId={import.meta.env.VITE_GOOGLE_PROJECTS_MAP_ID}
                        gestureHandling={'auto'}
                        disableDefaultUI={true}
                        zoomControl={true}
                        scrollwheel={true}
                        onZoomChanged={(ev) => {
                            setZoom(ev.detail.zoom);
                            console.log('Zoom changed to', ev.detail.zoom);
                        }}
                        onCenterChanged={(ev) => {
                            setPosition(ev.detail.center);
                            console.log('position changed to', ev.detail.center)
                        }}
                    >
                        <ClusteredMarkers></ClusteredMarkers>
                    </Map>
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
                </div>
            </APIProvider>
        </div>
    );
};

export default MyMap;