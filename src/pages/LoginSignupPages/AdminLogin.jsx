import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
const apiUrl = import.meta.env.VITE_API_URL;
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    // Basic validation
    if (!email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setShowSpinner(true);

      const res = await axios.post(`${apiUrl}/login`, {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("name", res.data.data.name);

        setAdminName(res.data.data.name);
        setShowSuccessModal(true);

        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        setErrorMsg(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Server error. Please try again.",
      );
    } finally {
      setShowSpinner(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Navy Section */}
      <div
        style={{
          height: "42vh",
          minHeight: "300px",
          background:
            "linear-gradient(135deg, #071a33 0%, #0b2d52 55%, #123e68 100%)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      />

      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.035)",
          top: "-100px",
          right: "-70px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          bottom: "-60px",
          left: "-50px",
        }}
      />

      <Container
        fluid
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          zIndex: 2,
        }}
      >
        <Row className="w-100 justify-content-center">
          <Col xs={11} sm={9} md={7} lg={5} xl={4}>
            <Card
              className="border-0"
              style={{
                borderRadius: "18px",
                boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18)",
                overflow: "hidden",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  background: "#ffffff",
                  padding: "30px 30px 20px",
                  textAlign: "center",
                }}
              >
                <h3
                  className="mt-3 mb-1 fw-bold"
                  style={{
                    color: "#0f2742",
                    fontSize: "24px",
                  }}
                >
                  RDEC ERP Portal
                </h3>

                <p
                  className="mb-0"
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Administration Login
                </p>
              </div>

              <Card.Body
                style={{
                  padding: "10px 30px 32px",
                }}
              >
                {/* Error */}
                {errorMsg && (
                  <div
                    className="mb-3"
                    style={{
                      background: "#fff1f2",
                      border: "1px solid #fecdd3",
                      color: "#be123c",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      fontSize: "13px",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <Form onSubmit={handleLogin}>
                  {/* Email */}
                  <Form.Group className="mb-3" controlId="adminEmail">
                    <Form.Label
                      className="fw-semibold"
                      style={{
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Email Address
                    </Form.Label>

                    <div className="position-relative">
                      <FaEnvelope
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "14px",
                          zIndex: 2,
                        }}
                      />

                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          height: "46px",
                          borderRadius: "8px",
                          paddingLeft: "40px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          boxShadow: "none",
                        }}
                      />
                    </div>
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-4" controlId="adminPassword">
                    <Form.Label
                      className="fw-semibold"
                      style={{
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Password
                    </Form.Label>

                    <div className="position-relative">
                      <FaLock
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#64748b",
                          fontSize: "14px",
                          zIndex: 2,
                        }}
                      />

                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          height: "46px",
                          borderRadius: "8px",
                          paddingLeft: "40px",
                          paddingRight: "42px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          boxShadow: "none",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "13px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: "none",
                          background: "transparent",
                          color: "#64748b",
                          padding: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </Form.Group>

                  {/* Login Button */}
                  <div className="d-grid">
                    <Button
                      type="submit"
                      disabled={showSpinner}
                      style={{
                        height: "46px",
                        border: "none",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #0b2d52, #164d7a)",
                        fontWeight: "600",
                        fontSize: "15px",
                        boxShadow: "0 6px 15px rgba(11,45,82,0.22)",
                      }}
                    >
                      {showSpinner ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </Form>

                {/* Footer */}
                <div
                  className="text-center mt-4"
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "16px",
                  }}
                >
                  <small
                    style={{
                      color: "#94a3b8",
                      fontSize: "12px",
                    }}
                  >
                    RDEC ERP Portal • Secure Administration Access
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Bottom text */}
            <p
              className="text-center mt-3"
              style={{
                color: "#64748b",
                fontSize: "12px",
              }}
            >
              © 2026 R.D. Engineering College
            </p>
          </Col>
        </Row>
      </Container>
      <Modal
        show={showSuccessModal}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body
          className="text-center"
          style={{
            padding: "35px 30px",
            borderRadius: "15px",
          }}
        >
          <div
            className="mx-auto d-flex align-items-center justify-content-center"
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "50%",
              background: "#dcfce7",
              color: "#16a34a",
              fontSize: "30px",
              fontWeight: "700",
              marginBottom: "18px",
            }}
          >
            ✓
          </div>

          <h4
            className="fw-bold mb-2"
            style={{
              color: "#0f2742",
            }}
          >
            Login Successful
          </h4>

          <p
            className="mb-1"
            style={{
              color: "#475569",
              fontSize: "14px",
            }}
          >
            Welcome, {adminName}
          </p>

          <p
            className="mb-0"
            style={{
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Redirecting to dashboard...
          </p>

          <div className="mt-3">
            <Spinner
              animation="border"
              size="sm"
              style={{
                color: "#0b2d52",
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminLogin;
