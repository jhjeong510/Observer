import React from 'react';
import styles from "./icons.module.css"
import BuildingImage from "./building.ico";

export const BuildingIcon=({onClick, children, htmlFor})=>{
    return(
		<>
			{BuildingImage}
		</>
        // <span className={styles.container}>
        //     <label htmlFor={htmlFor}>
        //     <BuildingImage className={styles.icon} onClick={onClick}/>
        //     <span className={styles.tooltiptext}>{children}</span>
        //     </label>
        // </span>
    )
}