import React from "react";
import classes from "./CurvedContainer.module.scss";

const CurvedContainer: React.FC<{ className?: string; children?: React.ReactNode }> = props => {
    return (
        <div className={`${classes["curved-container"]} ${props.className && props.className}`}>{props.children}</div>
    );
};

export default CurvedContainer;
