import React from "react";
import { Link } from "react-router-dom"; // Importa il componente Link
import "../style/SidebarOption.css";

function SidebarOption({ option = "test", Icon, link }) {
  return (
    <Link to={link} className="sidebarOption__link"> {/* Usa Link con la proprietà "to" */}
      <div className="sidebarOption">
        {Icon && <Icon className="sidebarOption__icon" />}
        {Icon ? <h4>{option}</h4> : <p>{option}</p>}
      </div>
    </Link>
  );
}

export default SidebarOption;
