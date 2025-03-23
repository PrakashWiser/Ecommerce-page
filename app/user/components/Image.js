import React from "react";

function Image({ styles, link,alt,style }) {
  return <img src={link.src} className={styles} style={style} alt={alt}/>;
}

export default Image;
