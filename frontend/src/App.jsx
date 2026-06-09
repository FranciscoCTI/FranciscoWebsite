import { Box, useColorModeValue, Divider, Flex } from "@chakra-ui/react"
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import EmployersPage from "./pages/EmployersPage";
import ProjectsPage from "./pages/ProjectsPage";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import TechnologiesPage from "./pages/TechnologiesPage";
import { Footer } from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import { APSPage } from "./pages/APSPage";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import "./App.css";

function App() {

  return (
    <>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <Flex direction={"column"} minHeight={"100vh"}>
          <Box flex="1">

            <NavBar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/employers" element={<EmployersPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/technologies" element={<TechnologiesPage />} />
              <Route path="/Contact" element={<ContactPage />} />
              <Route path="/APS" element={<APSPage urn="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnZhdHRiNWRmaTVqd2QzOWVmdXUwY2tzbGVlbmN5cHBwb2pkM2NzaHZveGNqemhwLWJhc2ljLWFwcC9Qcm95ZWN0b0Nhc2FfMjAyNV9hLnJ2dA" />} />
            </Routes>

          </Box>
          <Footer></Footer>
        </Flex>
      </ClerkProvider>
    </>
  )
}

export default App;
