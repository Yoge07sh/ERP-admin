import  { useEffect, useState } from "react";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/logo.png";

function WelcomePage() {
  let [username, setUserName] = useState("admin");

  useEffect(() => {
    let token;
    token = localStorage.getItem("token");

    if (token) {
      setUserName(localStorage.getItem("name"));
    }
  }, []);

  return (
    <Container fluid className="min-vh-100 bg-light d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="border-0 shadow-lg rounded-4 text-center">
              <Card.Body className="p-4 p-md-5">

                <div className="d-flex flex-column align-items-center">

                  {/* Logo */}
                  <Image
                    src={logo}
                    width="100"
                    height="100"
                    roundedCircle
                    className="mb-4 shadow-sm border border-3 border-white"
                  />

                  {/* Welcome Heading */}
                  <h2 className="fw-bold text-dark mb-3">
                    Welcome, {username}
                  </h2>

                  {/* Description */}
                  <p className="text-secondary mb-0 lh-lg">
                    Manage your courses, branches, and subjects easily
                    using the dashboard.
                  </p>

                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default WelcomePage;