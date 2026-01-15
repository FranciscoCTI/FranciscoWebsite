import React from 'react'
import { Box, Center, Container, Spacer, Divider, HStack, Stack, Flex, Link, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import ContactItem from '../components/ContactItem';

import { HiOutlineMailOpen } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { SiAutodesk } from "react-icons/si";
import { LuConstruction } from "react-icons/lu";

const ContactPage = () => {
    const text = useColorModeValue("black.800", "yellow.300"); // light / dark text
    return (
        <>
            <VStack mt={5}>
                <Text my={10}
                    fontSize={'30'}
                    fontWeight={'bold'}
                    fontFamily={'monospace'}
                    color={text}
                    textAlign={'center'}
                >
                    I did all this website by myself so you can contact me at:
                </Text>
                <ContactItem name={"franciscofcch@gmail.com "}>
                    <HiOutlineMailOpen />
                </ContactItem>

                <ContactItem name={"+569 83790046"}>
                    <FaPhoneAlt></FaPhoneAlt>
                </ContactItem>

                <ContactItem name={"Linkedin"} website={"https://www.linkedin.com/in/francisco-contreras-chavez-147bbb33/"}>
                    <FaLinkedin></FaLinkedin>
                </ContactItem>

                <ContactItem name={"GitHub"} website={"https://github.com/FranciscoCTI"}>
                    <FaGithub></FaGithub>
                </ContactItem>

                <ContactItem name={"Autodesk AppStore"} website={"https://apps.autodesk.com/en/Publisher/PublisherHomepage?ID=98UZMV6JE92L"}>
                    <SiAutodesk></SiAutodesk></ContactItem>

                <ContactItem name={"Constru-Fast"} website={"https://www.constru-fast.com"}>
                    <LuConstruction></LuConstruction></ContactItem>
            </VStack>
        </>
    )
}

export default ContactPage