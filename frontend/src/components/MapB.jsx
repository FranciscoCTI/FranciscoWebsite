import { useEffect, useState, useRef, Button } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, Marker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googleMaps/markerclusterer';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
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
import PopUpContentBox from './PopUpContentBox.jsx';
import ReactDOM from 'react-dom/client';

const MyMapB = ({ content }) => {

    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.google) return;

        new window.google.maps.Map(mapRef.current, {
            center: { lat: -33.45, lng: -70.66 },
            zoom: 12,
        });
    }, [])

    return (
        <>
            <div
                ref={mapRef}
                style={{ width: "100%", height: "600px" }}
            />
        </>
    );
};

export default MyMapB;