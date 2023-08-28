import React from "react";
import { Link } from "react-router-dom"; // Importa il componente Link
import "../style/SidebarOption.css";

function SidebarOption({ option = "test", Icon, navigateTo, public: isPublic }) {
  return (
    <Link to={navigateTo} className="sidebarOption__link">
      <div className="sidebarOption">
        {Icon && <Icon className="sidebarOption__icon" />}
        {Icon ? <h4 >{option}</h4> : <p className={isPublic ? "public" : ""}>{option}</p>}
      </div>
    </Link>
  );
}

export default SidebarOption;
