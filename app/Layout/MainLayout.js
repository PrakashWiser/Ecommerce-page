import React from "react";

function MainLayout({ styles, children }) {
  return <section className={styles}>{children}</section>;
}

export default MainLayout;
