import {
    Box, Container, Heading, HStack, VStack,
    IconButton, Text, Image, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, Input, ModalFooter, Button, Select, Wrap,
    Stack, Checkbox, Flex, useDisclosure, Collapse, Link
} from '@chakra-ui/react';
import { Children, useState } from "react";
import { StepInCareer } from './StepInCareer';
import Gallery from './Gallery';

const CarrerTimeline = () => {

    const [openId, setOpenId] = useState(null);

    return (
        <Container border={"1px solid black"}
            pt={0}
            maxW='container.lg'
            padding={5}
            bg={'black'}
            fontFamily="monospace"
            color="green.500"
            fontSize={20}
            paddingBottom={10}>
            <Text justify='left' color={'yellow'} fontSize={40}>My carrer so far</Text>
            <VStack>
                <StepInCareer id={0} openId={openId} setOpenId={setOpenId}
                    title="Self thought 3d and 2d animator"
                    years={"2000-2003"}
                    moreInfo={"When i was in highSchool i was really into animation. I started with 2d, using Flash, and then learned Cinema 4D and 3D studio Max. I managed to create some episodes of my own superhero series and some cool 3d animated scenes and even a short 3D film, everything at an amateur level of course"}
                ><Gallery experienceName={'Animator'}></Gallery></StepInCareer>
                <StepInCareer id={1} openId={openId} setOpenId={setOpenId}
                    title="Architect" years={"2003-2025"}
                    moreInfo={"Following my interest in animation, society pushed me to choose a more  traditional career path, so i choose architecture since i knew that they were starting to use 3d software. In my university years i enjoyed the technology and architectural history classes. At the end i had a strong interest in theory and even considered following an academic path, untill..."}><Gallery experienceName={'Architect'}></Gallery></StepInCareer>
                <StepInCareer id={2} openId={openId} setOpenId={setOpenId}
                    title="BIM specialist"
                    years={"2010-2025"}
                    moreInfo={"Working on my final architecture project i met BIM, and i was amazed with these huge and detailed futuristic models of buildings and their systems, that resembled a biological body. I worked as a BIM specialist in all kinds of companies, location, disciplines and use cases. Mainly using the software Revit"}><Gallery experienceName={'BIM'}></Gallery></StepInCareer>
                <StepInCareer id={3} openId={openId} setOpenId={setOpenId} title="Startup entepreneur"
                    years={"2012-2015"}
                    moreInfo={"Then i saw the movie THE SOCIAL NETWORK and i wanted to create the next Facebook. So i started a AEC related startup. COWORA was a web plaftorm aiming to connect the stakeholders of the cheap house construction market"}><Gallery experienceName={'Entepreneur'}></Gallery></StepInCareer>
                <StepInCareer id={4} openId={openId} setOpenId={setOpenId} title="Revit Application developer"
                    years={"2017-2022"}
                    moreInfo={"During my years as a BIM specialist i noticed that you could automate processes using code, mainly with the Revit API. So i learned programming from scratch by myself. With time I created several apps with increasing complexity. Some of them are still selling on the Autodesk AppStore"}><Gallery experienceName={'RevitAppDeveloper'}></Gallery></StepInCareer>
                <StepInCareer id={5} openId={openId} setOpenId={setOpenId} title="AEC developer"
                    years={"2022-now"}
                    moreInfo={"I guess the logical step once achieving enough experience was becoming a developer. An australian company hired me to participate on an AEC development. This was a huge jump in my carrer since i had to learn more generic programming practices such as: version control, using different frameworks, SOLID principles, working and reviewing PR´s, etc. Now i´m focusing in learning web development, specifically MERN stack.. and that´s why i created this website."}><Gallery experienceName={'AECDeveloper'}></Gallery></StepInCareer>
            </VStack>
        </Container>
    )
}

export default CarrerTimeline