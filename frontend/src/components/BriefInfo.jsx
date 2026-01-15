import {
    Box, Container, Heading, HStack, VStack,
    IconButton, Text, Image, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, Button, Select, Wrap,
    Stack, Checkbox, Flex, useDisclosure, Collapse, Link
} from '@chakra-ui/react';
import { useState } from "react";

export const BriefInfo = ({ information, moreInfo, title, children }) => {

    const { isOpen, onToggle } = useDisclosure();

    return (
        <Container border={"1px solid black"}
            pt={0}
            maxW='container.lg'
            padding={35}
            bg={'black'}
            fontFamily="monospace"
            color="green.500"
            fontSize={20}
            paddingBottom={10}>

            <Text justify='left' color={'yellow'} fontSize={40}>{title}</Text>
            <Flex align="left" w="100%" justify={"left"}>
                <VStack>
                    <Text flex="7" pr={4}>
                        {information}
                    </Text>
                </VStack>
            </Flex>

            <Button onClick={onToggle} size="lg" mt={5} colorScheme="yellow" variant="outline">
                {isOpen ? 'Yeah yeah, just close it' : 'Interesting , let´s see more'}
            </Button>
            <Collapse in={isOpen} animateOpacity>
                <Box mt={2} p={1} bg="gray.800">
                    <Text fontSize={18}>
                        {moreInfo || 'No additional description available.'}
                    </Text>
                    <Box w="full" textAlign="left">
                        {children}
                    </Box>
                </Box>
            </Collapse>
        </Container>
    )
};
export default BriefInfo;