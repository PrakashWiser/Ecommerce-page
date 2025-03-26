import React from "react";
import Image from "next/image";

function CustomImage({
  styles,
  link,
  alt,
  style,
  width,
  height,
  priority = false,
}) {
  return (
    <Image
      src={link.src}
      className={styles}
      style={style}
      alt={alt || "Image"}
      width={width || 500}
      height={height || 300}
      priority={priority}
    />
  );
}

export default CustomImage;
