import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer>
      <div className="border-top">
        <Container className="d-flex justify-content-center py-4">
          <span>© 2023 Farhan Gunawan, Inc. All rights reserved</span>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
