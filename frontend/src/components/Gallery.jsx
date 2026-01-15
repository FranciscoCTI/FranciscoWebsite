import React from 'react'
import { SimpleGrid, Box, ChakraProvider, Flex, Image } from '@chakra-ui/react';

const Gallery = ({ experienceName }) => {

    const allImages = import.meta.glob("../assets/*/*.{png,PNG,jpg,JPG,jpeg,svg,gif}", {
        eager: true,
    });

    const images = Object.entries(allImages)
        .filter(([path]) => path.includes(`/Experience_${experienceName}/`))
        .map(([_, module]) => module.default);

    return (
        <Box>
            <Flex gap={4} wrap={'wrap'}>
                {
                    Object.values(images).map((img, i) =>
                    (
                        <Image
                            src={img}
                            alt={`img-${i}`}
                            w="300px"
                            h="auto"
                            objectFit="contain"
                            boxShadow="0 2px 5px rgba(0,0,0,0.2)"
                            my="5px"
                        />
                    ))}
            </Flex>
        </Box>
    )
};

export default Gallery