import React from 'react'
import { Container, Flex, Text, HStack, Button, Icon, useColorMode } from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';

const NavBar = () => {

    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Container maxW={"1400px"} px={4}>
            <Flex
                h={20}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{ base: 'column', sm: 'row' }}

            >
                <Text
                    fontSize="30px"
                    fontFamily="monospace"
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                >
                    <Link
                        as={"/"}
                        to="/"
                        color="gray.200"
                        textDecoration="none"
                        _hover={{
                            textDecoration: "underline",
                            color: "black",
                        }}
                    >
                        Francisco Contreras / AEC Developer
                    </Link>
                </Text>
                <HStack spacing={2} alignItems={"center"} fontFamily={'monospace'}>
                    <Link to={"/employers"}>
                        <Button borderRadius={0}>
                            Employers
                        </Button>
                    </Link>
                    <Link to={"/Projects"}>
                        <Button borderRadius={0}>
                            Projects
                        </Button>
                    </Link>
                    <Link to={"/Technologies"}>
                        <Button borderRadius={0}>
                            Technologies
                        </Button>
                    </Link>
                    <Link to={"/contact"}>
                        <Button borderRadius={0}>
                            Contact me
                        </Button>
                    </Link>
                    <Button borderRadius={0} onClick={toggleColorMode}>
                        {
                            colorMode === 'light' ? <IoMoon /> : <LuSun size="20" />
                        }
                    </Button>
                </HStack>
            </Flex>
        </Container >
    )
}

export default NavBar