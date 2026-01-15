import React, { useState } from 'react'
import {
    Box, Container, Heading, HStack, VStack,
    IconButton, Text, Image, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, Button, Select, Wrap,
    Stack, Checkbox, Flex, useDisclosure, Collapse, Link,
    Center
} from '@chakra-ui/react';

export const StepInCareer = ({ id, openId, setOpenId, title, years, moreInfo, children }) => {

    const isOpen = openId === id;

    return (
        <Box mt={5} p={4} bg={"gray.800"} borderWidth={isOpen ? "4px" : "0px"} borderColor={'yellow'}>
            <HStack align="center">
                <Text color={'yellow'} mr={25}>{years}</Text>
                <Text fontWeight={'bold'}>{title}</Text>
                <Button align={"center"}
                    ml={5}
                    onClick={() => setOpenId(isOpen ? null : id)}
                    size="sm"
                    colorScheme="yellow"
                    variant="outline">
                    {isOpen ? 'Close' : 'More'}
                </Button>
            </HStack>
            <Collapse in={isOpen} animateOpacity>
                <Box mt={2} p={1} bg={"gray.800"}>
                    <Text fontSize={18}>
                        {moreInfo || 'No additional description available.'}
                    </Text>
                </Box>
                <Box w="full" textAlign="left">
                    {children}
                </Box>
            </Collapse>
        </Box>
    )
}
