import { Container, Form, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaEye,
  FaArrowRight,
  FaClipboardCheck,
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

// Get today's date according to India Standard Time
const getTodayIST = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
};

function AttendanceRegister() {
  const navigate = useNavigate();

  const [mappings, setMappings] = useState([]);
  const [selectedMapping, setSelectedMapping] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(getTodayIST());

  const [formData, setFormData] = useState({
    session: "",
    course: "",
    courseName: "",
    branch: "",
    branchName: "",
    year: "",
    semester: "",
    section: "",
    subjectName: "",
  });

  const token = localStorage.getItem("token");

  // Get today's date in IST
  const todayIST = getTodayIST();

  // Get faculty mappings
  useEffect(() => {
    axios
      .get(`${apiUrl}/getfacultymappings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setMappings(res.data.data);
        } else {
          alert("Failed to load faculty mappings.");
        }
      })
      .catch((err) => {
        console.error("Error fetching faculty mappings:", err);
        alert("Failed to load faculty mappings.");
      });
  }, [token]);

  // When faculty selects a mapping
  const handleMappingChange = (e) => {
    const mappingId = e.target.value;

    setSelectedMapping(mappingId);

    const mapping = mappings.find((item) => item._id === mappingId);

    if (mapping) {
      setFormData({
        session: mapping.session || "",
        course: mapping.course?._id || "",
        courseName: mapping.course?.courseShortName || "",
        branch: mapping.branch?._id || "",
        branchName: mapping.branch?.branchShortName || "",
        year: mapping.year || "",
        semester: mapping.semester || "",
        section: mapping.section || "",
        subjectName: mapping.subjectId?.subjectFullName || "",
      });
    } else {
      setFormData({
        session: "",
        course: "",
        courseName: "",
        branch: "",
        branchName: "",
        year: "",
        semester: "",
        section: "",
        subjectName: "",
      });
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMapping) {
      alert("Please select a class.");
      return;
    }

    if (!fromDate) {
      alert("Please select From Date.");
      return;
    }

    if (!toDate) {
      alert("Please select To Date.");
      return;
    }

    if (fromDate > toDate) {
      alert("From Date cannot be greater than To Date.");
      return;
    }

    navigate("/eregister", {
      state: {
        formData,
        facultyMapId: selectedMapping,
        fromDate,
        toDate,
      },
    });
  };

  return (
    <Container
      fluid
      className="py-4 px-4"
      style={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        className="mb-4 p-4 rounded-4 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
          color: "white",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: "52px",
              height: "52px",
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          >
            <FaClipboardCheck size={25} />
          </div>

          <div>
            <h3 className="mb-1 fw-bold">E-Attendance Register</h3>

            <p
              className="mb-0"
              style={{
                color: "#cbd5e1",
                fontSize: "12px",
              }}
            >
              Select class, date range to view attendance
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-4 shadow-sm p-4">
        <Form onSubmit={handleSubmit}>
          {/* Faculty Mapping */}
          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label
                  className="fw-semibold"
                  style={{ color: "#1e293b" }}
                >
                  <FaChalkboardTeacher
                    className="me-2"
                    style={{ color: "#2563eb" }}
                  />
                  Select Class / Subject
                </Form.Label>

                <Form.Select
                  value={selectedMapping}
                  onChange={handleMappingChange}
                  className="py-2"
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    boxShadow: "none",
                  }}
                >
                  <option value="">Select Class / Subject</option>

                  {mappings.map((mapping) => (
                    <option key={mapping._id} value={mapping._id}>
                      {mapping.session} | {mapping.course?.courseShortName} |{" "}
                      {mapping.branch?.branchShortName || "No Branch"} | Year{" "}
                      {mapping.year} | Semester {mapping.semester} | Section{" "}
                      {mapping.section} | {mapping.subjectId?.subjectFullName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* From Date + To Date */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label
                  className="fw-semibold"
                  style={{ color: "#1e293b" }}
                >
                  <FaCalendarAlt
                    className="me-2"
                    style={{ color: "#8b5cf6" }}
                  />
                  From Date
                </Form.Label>

                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={todayIST}
                  className="py-2"
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    boxShadow: "none",
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label
                  className="fw-semibold"
                  style={{ color: "#1e293b" }}
                >
                  <FaCalendarAlt
                    className="me-2"
                    style={{ color: "#ef4444" }}
                  />
                  To Date
                </Form.Label>

                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  max={todayIST}
                  className="py-2"
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    boxShadow: "none",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Submit Button */}
          <div className="d-flex gap-3 mt-2">
            <Button
              type="submit"
              disabled={!selectedMapping || !fromDate || !toDate}
              className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 border-0"
              style={{
                backgroundColor: "#2563eb",
                borderRadius: "9px",
                fontWeight: "600",
                minWidth: "220px",
              }}
            >
              <FaEye />
              View E-Attendance Register
              <FaArrowRight size={12} />
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default AttendanceRegister;
