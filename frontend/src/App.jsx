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
import { useEmployerStore } from "./store/employer";

function App() {
  const { employers } = useEmployerStore();

  return (
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
        </Routes>
      </Box>
      <Footer></Footer>
    </Flex>
  )
};

export default App;
