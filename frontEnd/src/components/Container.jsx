import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
// import router from "../routes/AppRouter.jsx";


const Container = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (

    <Contenedor className={sidebarOpen ? "sidebarState active" : ""}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* {router} */}
    </Contenedor>

  )
}



const Contenedor = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: #21252B;
  transition:all 0.3s ;
  &.active {
    grid-template-columns: 300px auto;
  }
  color:#fff;
  min-height: 100vh;
`;

export default Container