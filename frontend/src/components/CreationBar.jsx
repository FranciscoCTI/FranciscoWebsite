import React from 'react'
import {
    VStack, HStack, Text, Box, useColorModeValue, Container, Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Center
} from '@chakra-ui/react'

export const CreationBar = ({ onClickCreate }) => {

    const textColor = useColorModeValue("black.800", "white.300"); // light / dark text
    const backGroundColor = useColorModeValue("whiteAlpha.500", "blackAlpha.500"); // light / dark text

    return (
        <Container
            maxW='100%'
            padding={5}
            bg={backGroundColor}
            fontFamily="monospace"
            color={textColor}
            fontSize={20}
            paddingBottom={10}>
            <HStack justify='Center'>
                <Button onClick={onClickCreate}>Create new project</Button>
            </HStack>
        </Container>
    )
}
