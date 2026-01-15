import { Box, Text, useColorModeValue } from "@chakra-ui/react";

export const Footer = () => {

    const bg = useColorModeValue("gray.100", "gray.900"); // light / dark background
    const text = useColorModeValue("gray.800", "yellow.300"); // light / dark text

    return (
        <Box mt="10"
            as="footer"
            bg={bg}
            py={4}
            textAlign="center"

        >
            <Text fontSize="sm" fontFamily="monospace" color={text} letterSpacing={'widest'}>
                © {new Date().getFullYear()} Francisco Contreras Chávez - Concepción - Chile.
            </Text>
        </Box>
    );
};