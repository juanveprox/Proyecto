import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const LayoutConSidebar = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <LayoutContainer>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <MainContent $sidebarOpen={sidebarOpen}>
                <Outlet /> {/* Aquí se renderizarán Dashboard, Signup, etc. */}
            </MainContent>
        </LayoutContainer>
    )
}


const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
//   margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? "10px" : "40px")};
//   transition: margin-left 0.5s;
  padding: 20px;
`;


export default LayoutConSidebar