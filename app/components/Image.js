import React from "react";

function Image({ styles, link,alt }) {
  return <img src={link.src} className={styles} alt={alt}/>;
}

export default Image;
