import { useState, useEffect } from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";
// ================= LIVE CLOCK =================
function SidebarClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        color: "#ffffff",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontSize: "18px",
          fontWeight: "700",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
      </span>

      <span
        style={{
          fontSize: "13px",
          color: "#b9c8d8",
        }}
      >
        {currentTime.toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </span>

      <span
        style={{
          fontSize: "12px",
          color: "#22c55e",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
        }}
      >
        <i
          className="bi bi-circle-fill"
          style={{ fontSize: "6px", marginRight: "5px" }}
        ></i>
        Live
      </span>
    </div>
  );
}

function AdminNavbar({ onMenuClick }) {
  const username = localStorage.getItem("name") || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  return (
    <Navbar
      sticky="top"
      style={{
        height: "70px",
        backgroundColor: "#0b2d52",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        zIndex: 1030,
      }}
    >
      <Container fluid className="px-4">
        <div
          className="d-flex align-items-center w-100"
          style={{ position: "relative", height: "70px" }}
        >
          <Button
            variant="outline-light"
            className="d-md-none me-2"
            onClick={onMenuClick}
            style={{
              border: "none",
              fontSize: "22px",
            }}
          >
            <i className="bi bi-list"></i>
          </Button>
          {/* Left - Logo */}
          <Navbar.Brand
            className="navbar-brand-custom d-flex align-items-center m-0"
            style={{
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "18px",
              textDecoration: "none",
            }}
          >
            <img
              alt="RDEC"
              src={logo}
              width="45"
              height="45"
              style={{ objectFit: "contain", marginRight: "10px" }}
            />
            <span>RDEC ERP</span>
          </Navbar.Brand>

          {/* Center - Live Clock */}

          <div className="navbar-clock">
            <SidebarClock />
          </div>

          {/* Right - User + Logout */}
          <div className="navbar-right ms-auto d-flex align-items-center gap-3">
            <div
              className="navbar-user d-flex align-items-center"
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              <i
                className="bi bi-person-circle"
                style={{ fontSize: "20px", marginRight: "8px" }}
              ></i>
              Welcome, {username}
            </div>

            <Button
              onClick={handleLogout}
              variant="outline-light"
              className="d-flex align-items-center"
              style={{
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <i
                className="bi bi-box-arrow-right"
                style={{ marginRight: "6px" }}
              ></i>
              Logout
            </Button>
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
