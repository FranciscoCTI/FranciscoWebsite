import { React, useState, useEffect } from 'react'
import { useTechnologyStore } from '../store/technology';
import { VStack, Container, Text, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import TechnologyCard from '../components/TechnologyCard';

const TechnologiesPage = () => {

    const text = useColorModeValue("black.800", "yellow.300"); // light / dark text

    console.log("Started rendering technologies page");
    const { technologies, fetchTechnologies } = useTechnologyStore();

    console.log("📌 Technologies in store previous to fetch:", technologies);

    useEffect(() => {
        fetchTechnologies();
    }, []);

    return (
        <>
            <Container maxW='container.xl' py={3}>
                <VStack spacing={5}>
                    <Text
                        my={10}
                        fontSize={'30'}
                        fontWeight={'bold'}
                        color={text}
                        textAlign={'center'}
                        fontFamily="monospace"
                        letterSpacing={'widest'}
                        mb={4} mt={4}
                    >
                        These are all the technologies that I use
                    </Text>
                    {technologies.map((tech) => (
                        (tech != null && tech.name != "") &&
                        (<TechnologyCard key={tech._id} technology={tech} />)
                    ))}
                    {
                        technologies.length === 0 &&
                        (
                            <Text mt={40} fontSize='x1' textAlign={'center'} fontWeight={'bold'} color='gray.500'>
                                No technologies found :( {''}
                            </Text>
                        )
                    }
                </VStack>
            </Container>
        </>
    )
}

export default TechnologiesPage;