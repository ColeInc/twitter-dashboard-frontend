import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./NavButton.module.css";
import { ReactComponent as RightChevron } from "../../assets/icons/noun-right-chevron-4695692.svg";

const NavButton = (props) => {
    const style = props.style ? props.style : {};
    const icon = (
        <div className={classes["nav-button__icon"]}>{props.icon}</div>
    );

    return (
        <NavLink
            {...props}
            className={(navItem) => {
                return navItem.isActive
                    ? `${classes.active} ${classes["nav-button__font"]}`
                    : classes["nav-button__font"];
            }}
        >
            <div className={classes["nav-button__button"]} style={style}>
                {icon}
                <p>{props.children}</p>
                <RightChevron className={classes["nav-button__chevron"]} />
            </div>
        </NavLink>
    );
};

export default NavButton;