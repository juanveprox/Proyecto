import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../auth/AutorizarContexto"


import Alert from 'react-bootstrap/Alert';
//*Iconos
import logoEscuela from "../assets/img/logo_escuela.png"
import flecha from "../assets/iconos/flecha_icono.svg"
import { FaHouse } from "react-icons/fa6";
import { PiStudentBold } from "react-icons/pi";
import { SiClerk } from "react-icons/si";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { GrUserWorker, GrDocumentConfig } from "react-icons/gr";
import { TfiBlackboard } from "react-icons/tfi";
import { HiDocumentReport } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { IoExitOutline } from "react-icons/io5";

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuthContext()

  const ModSidebaropen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const cerrarSesion = () => {
    logout()

  }


  //#region Data links
  const linksArray = [
    {
      label: "Inicio",
      icon: <FaHouse />,
      to: "/inicio",
    },
    {
      label: "Estudiantes",
      icon: <PiStudentBold />,
      to: "/estudiantes",
    },
    {
      label: "Administrativo",
      icon: <SiClerk />,
      to: "/administrativos",
    },
    {
      label: "Docentes",
      icon: <LiaChalkboardTeacherSolid />,
      to: "/docentes",
    },
    {
      label: "Obreros",
      icon: <GrUserWorker />,
      to: "/obreros",
    },
    {
      label: "Secciones",
      icon: <TfiBlackboard />,
      to: "/secciones",
    },
    {
      label: "Reportes",
      icon: <HiDocumentReport />,
      to: "/reportes",
    },
    {
      label: "Actividades",
      icon: <SlCalender />,
      to: "/actividades",
    },
    // {
    //   label: "Registrar",
    //   // icon: <MdOutlineAnalytics />,
    //   to: "/registrar",
    // }


  ];
  const secondarylinksArray = [
    {
      label: "Configuración",
      icon: <GrDocumentConfig />,
      to: "/null",
    },
    {
      label: "Salir",
      icon: <IoExitOutline />,
      to: "/null",
      onclick: cerrarSesion
    },
  ];



  return (
    <Contenedor className={sidebarOpen ? "sidebarState active" : ""}>

      <Container isOpen={sidebarOpen}>


        <div className="Logocontent">
          <div className="imgcontent">
            <img src={logoEscuela} />
          </div>
          <h2>Holaquetal</h2>
        </div>

        <button className="Sidebarbutton" onClick={ModSidebaropen}>
          <img src={flecha} alt="flecha" />
        </button>
        {
          linksArray.map(({ icon, label, to }) => (
            <div className="LinkContainer" key={label}>
              <NavLink
                to={to}
                className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
              >
                <div className="Linkicon">{icon}</div>
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            </div>
          ))
        }
        <Divider />
        {
          secondarylinksArray.map((item) => (
            <div className="LinkContainer" key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
                onClick={(e) => {
                  if (item.to === "/null") e.preventDefault();
                  item.onclick?.();
                }}
              >
                <div className="Linkicon">{item.icon}</div>
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            </div>
          ))
        }


      </Container>

    </Contenedor>


  );
}


//#region STYLED COMPONENTS
const Container = styled.div`
  color:#fff;
  background:rgb(50, 71, 87);
  position: sticky;
  top:0;
  z-index:1;
  overflow-x: hidden;
  box-sizing: border-box
  padding-top: 20px;
  height:100vh;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.6) rgba(0, 0, 0, 0.1);

  .Sidebarbutton {
    width:100%;
    height: 2rem;
    background:rgb(82, 78, 78);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
    text-align: inherit;
    margin: 1rem 0 .5rem;
    padding: 0;
    font-family: inherit;
    outline: none;

    img{
        transition: all 0.3s;
        transform: ${({ isOpen }) => (isOpen ? `initial` : `rotate(180deg)`)};
    }

  }
  .Logocontent {
    margin:1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 24px;

    .imgcontent {
      display: flex;
      cursor: pointer;
      transition: all 0.3s;
      transform: ${({ isOpen }) => (isOpen ? `scale(0.9)` : `scale(1.3)`)};

      img {
        max-width: 100%;
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
      }

    }
    h2 {
      display: ${({ isOpen }) => (isOpen ? `block` : `none`)};
    }
  }
  .LinkContainer {
    margin: 8px 0;
    padding: 0 10%;
    :hover {
      background:#D9D9D940;
    }
    .Links {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: calc(8px -2px) 0;
      color: #fff;
      height:50px;
      .Linkicon {
        padding: 8px 16px;
        display: flex;

        svg {
          font-size:24px
        }
      }
      &.active {
        .Linkicon {
          svg {
            color: #9247FC;
          }
        }
      }
    }
  }
`;
const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: rgb(255, 255, 255);
  margin: 24px 0;
`;
const Contenedor = styled.div`
  display:flex
  flex-direction:column;
  width:90px;
  color:#fff;
  min-height: 100vh;
  transition: all 0.5s ;

  &.active {
    width:300px;
  }
`;

