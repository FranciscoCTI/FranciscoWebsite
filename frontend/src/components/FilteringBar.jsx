import { useState } from 'react'
import {
    VStack, HStack,
    Text,
    Box,
    useColorModeValue,
    Container,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Center,
    Select,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Input
} from '@chakra-ui/react'
import { COUNTRIES } from "../../../backend/models/Enums/Countries.js"

export const FilteringBar = ({ filterText, onChange, onChangeCountry }) => {

    const backGroundColor = useColorModeValue('white', "gray.800");
    const intermediateColor = useColorModeValue('blue.100', "gray.500");
    const textColor = useColorModeValue("black", "yellow");
    const placeholderColor = useColorModeValue("gray.500", "yellow.600");

    const [selectedCountry, setSelectedCountry] = useState("");

    return (
        <Container
            maxW='100%'
            padding={3}
            fontFamily="monospace"
            fontSize={20}
            bg={intermediateColor}
            rounded={10}>
            <HStack justify='Center' spacing={10}>
                <VStack>
                    <Text color={textColor}>By name</Text>
                    <Input
                        type="text"
                        placeholder="Filter projects…"
                        value={filterText}
                        onChange={(e) => onChange(e.target.value)}
                        bg={backGroundColor}
                        color={textColor}
                        _placeholder={{ color: placeholderColor }}
                        style={{ height: "35px", borderRadius: "10px" }}
                    />
                </VStack>
                <VStack>
                    <Text>By country</Text>
                    <Menu>
                        <MenuButton as={Button}
                            bg={backGroundColor}
                            color={textColor}
                            w="250px">
                            {selectedCountry || "Select country"}
                        </MenuButton>

                        <MenuList bg={backGroundColor} color={textColor}>
                            {COUNTRIES.map((c) => (
                                <MenuItem w="250px" key={c} onClick={() => {
                                    onChangeCountry(c);
                                    setSelectedCountry(c)
                                }}>
                                    {c}
                                </MenuItem>
                            ))}
                            <MenuItem onClick={() => {
                                onChangeCountry("");
                                setSelectedCountry("");
                            }} >Select country</MenuItem>
                        </MenuList>
                    </Menu>
                </VStack>
            </HStack>
        </Container>
    )
}
