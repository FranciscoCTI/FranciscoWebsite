import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { APIProvider, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import AECIcon from '../assets/AECIcon.png'
import { Icon } from "@chakra-ui/react";
import { MdLocationOn } from "react-icons/md";
import {
    VStack, Container, Text, SimpleGrid, useColorModeValue, Button, Modal, useDisclosure, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton, Box,
    ModalBody, Input, ModalFooter,
    HStack
} from '@chakra-ui/react'

const conce = { lat: -36.829550693894596, lng: -73.03672092503368 };

const LocationPicker = ({ value, onChange }) => {
    return (
        <APIProvider>
            <Map
                style={{ height: "300px", width: "100%" }}
                defaultCenter={conce}
                defaultZoom={13}
                mapId={import.meta.env.VITE_GOOGLE_PROJECTS_MAP_ID}
                onClick={(e) => {
                    onChange({
                        lat: e.detail.latLng.lat,
                        lng: e.detail.latLng.lng,
                    });
                }}
            >
                {value && (
                    <AdvancedMarker position={value}>
                        <Box color="red" fontSize="32px">
                            <img
                                src={AECIcon}
                                alt="Project location"
                                width={40}
                                height={40}
                                style={{ objectFit: "contain" }}
                            />
                        </Box>
                    </AdvancedMarker>
                )}
            </Map>
        </APIProvider>
    );
};

export default LocationPicker;