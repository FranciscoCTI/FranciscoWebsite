import { useState } from 'react'
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
    Center,
    Select
} from '@chakra-ui/react'
import { COUNTRIES } from "../../../backend/models/Enums/Countries.js"


export const FilteringBar = ({ filterText, onChange }) => {

    return (
        <Container
            maxW='100%'
            padding={3}
            fontFamily="monospace"
            fontSize={20}
            bg={'Grey'}
            rounded={10}>
            <HStack justify='Center' spacing={10}>
                <VStack>
                    <Text color={'white'}>By name</Text>
                    <input
                        style={{ height: "40px" }}
                        type="text"
                        placeholder="Filter projects…"
                        value={filterText}
                        onChange={(e) => onChange(e.target.value)}
                        rounded={10}
                    />
                </VStack>
                <VStack>
                    <Text color={'white'}>By country</Text>
                    <Select bg={'white'}
                        style={{ height: "40px" }}
                        type="text"
                        placeholder="Filter projects…"
                        value={filterText}
                    >
                        {COUNTRIES.map((c) => (
                            <option key={c}>
                                {c}
                            </option>
                        ))}
                    </Select>


                </VStack>
            </HStack>
        </Container>
    )
}
