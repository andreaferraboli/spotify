import React from "react";
import {Link} from "react-router-dom"; // Importa il componente Link
import "../styles/SidebarOption.css";

function SidebarOption({option = "test", Icon, navigateTo, public: isPublic, currentAudioElement,setCurrentAudioElement}) {
    return (
        <Link to={navigateTo} className="sidebarOption__link" onClick={()=>{currentAudioElement?.pause();setCurrentAudioElement(null)}}>
            <div className={Icon ? "controlSidebarOption" : "sidebarOption"}>
                {Icon && <Icon className="sidebarOption__icon"/>}
                {Icon ? <h4>{option}</h4> : <p className={isPublic ? "public" : ""}>{option}</p>}
            </div>
        </Link>
    );
}

export default SidebarOption;
