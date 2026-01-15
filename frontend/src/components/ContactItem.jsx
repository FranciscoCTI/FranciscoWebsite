import { HStack, Box, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const ContactItem = ({ name, website, children }) => {


    const bg = useColorModeValue("gray.700", "black",); // light / dark 
    const text = useColorModeValue("white", "yellow"); // light / dark text

    return (
        <Box bg={bg} as="a"
            p={3}
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            fontSize={15}
            fontFamily="monospace"
            color={text}
            letterSpacing={'widest'}
            _hover={{ transform: "translateY(-3px)", shadow: 'x1' }}
            transition="all 0.2s ease">
            <HStack>
                <Text mr={4}>{name}</Text>
                {children}
            </HStack>
        </Box>
    )
}

export default ContactItem