import React from 'react'
import { Box, Center, Container, Divider, HStack, Stack, Flex, Link } from '@chakra-ui/react';
import { BriefInfo } from '../components/BriefInfo';
import { useEmployerStore } from '../store/employer.jsx';
import { useEffect } from 'react';
import CarrerTimeline from '../components/CarrerTimeline.jsx';
import { Image } from '@chakra-ui/react';

const HomePage = () => {

    const { fetchEmployers, employers } = useEmployerStore();

    useEffect(() => {
        fetchEmployers();
    }, [fetchEmployers]);
    console.log("Employers", employers);

    const internetInfo = "https://en.wikipedia.org/wiki/List_of_countries_by_Internet_connection_speeds";

    const whatIsBIM = "https://en.wikipedia.org/wiki/Building_information_modeling#:~:text=Building%20information%20modeling%20(BIM)%20is,%2C%20bridges%2C%20ports%20and%20tunnels.";

    const chileanLandscape = "/vista-lago-pehoe-y-macizo-1.png";

    return (
        <>
            <Stack spacing="6" my={6}>

                <Flex justify="center"><img src="/fotoSlovenia.jpg" style={{ width: "1020px", height: "300px", objectFit: "cover" }}></img></Flex>

                <BriefInfo information={"Hello, i´m Francisco, an AEC developer from Chile. This is my personal website where you can see all my experience, projects and technologies, so you can hire me to work remotely."} moreInfo={"AEC software developer, Revit Application Developer, BIM specialist, Architect. 15 years of experience in the private construction industry. Autodesk Developer Network member, published in the Autodesk AppStore. Creator of several Revit applications such as: Hanger Generator, Instance Locator, Coordinate Locator, LinkModifier, and more Revit applications for companies in Chile, Australia and the UK. Experience developing a variety of programs in technologies such as: .NET general software, Revit API, Navisworks API, ObjectARX, Autodesk ACC applications, GrassHopper nodes, Rhino Common, 3d Geometry oriented desktop and web software. Currently specializing in web development, focused on MERN stack (MONGODB, Express, React, NodeJS)."} title={"About me"}>
                </BriefInfo>

                <CarrerTimeline />

                <BriefInfo information={"What interest me is to create solutions to real problems using technology. For this what i´ve used is: BIM technology, web and desktop software development. What i´m looking for right now is to be part of a company where i can develop AEC software using my 15 years of experience in BIM, architecture and the construction industry in general"} moreInfo={"About BIM"} title={"Interest areas"}>
                    <Link fontSize={20} href={whatIsBIM} isExternal color="blue.500">
                        {"What is BIM"}
                    </Link></BriefInfo>

                <BriefInfo information={"I live with my wife, 3 kids and close to my parents in a chilean city named Concepción. I want to keep working remotely since the quality of life is the best that way. Chile has one of the best internet in the world so I never had any problems in communicating with my remote employers"} moreInfo={'About Chile'} title={"Outside of work"}>
                    <Link fontSize={20} href={internetInfo} isExternal color="blue.500">
                        {"About Chile´s internet"}
                    </Link>
                    <Image
                        src={chileanLandscape}
                        alt={`img-${1}`}
                        w="100%"
                        h="auto"
                        objectFit="contain"
                        boxShadow="0 2px 5px rgba(0,0,0,0.2)"
                        my="5px"
                    />

                </BriefInfo>
            </Stack>
        </>
    )
}

export default HomePage