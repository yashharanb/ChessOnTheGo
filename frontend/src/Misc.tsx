import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

export function LoadingScreen(){
    return <div className="overall-loading-screen">
                <FontAwesomeIcon icon="spinner" className="fa-pulse fa-3x" style={{ marginLeft: 15 }} />
    </div>

}
