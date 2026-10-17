import { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaClipboardCheck,
  FaArrowRight,
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

// Get today's date in local time as YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function AttendanceRegisterForm() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [mappings, setMappings] = useState([]);
  const [selectedMapping, setSelectedMapping] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(getTodayDate);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/e-attendance/mappings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setMappings(response.data.data || []);
        } else {
          setError("Failed to load faculty mappings.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load faculty mappings.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedMapping || !fromDate || !toDate) {
      setError("Please select a class and both dates.");
      return;
    }

    if (fromDate > toDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    setSubmitting(true);

    navigate("/attendance-register/view", {
      state: {
        mappingId: selectedMapping,
        fromDate,
        toDate,
      },
    });
  };

  return (
    <Container
      fluid
      className="py-4 px-3 px-md-4"
      style={{
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
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
              width: 52,
              height: 52,
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          >
            <FaClipboardCheck size={25} />
          </div>

          <div>
            <h3 className="mb-1 fw-bold">E-Attendance Register</h3>
            <p className="mb-0" style={{ color: "#cbd5e1", fontSize: 14 }}>
              Select your class and date range to view the register.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-4 shadow-sm p-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <FaChalkboardTeacher className="me-2 text-primary" />
                  Select Class / Subject
                </Form.Label>

                <Form.Select
                  value={selectedMapping}
                  onChange={(e) => setSelectedMapping(e.target.value)}
                  className="py-2"
                  disabled={loading}
                  required
                  style={{
                    borderRadius: 10,
                    boxShadow: "none",
                  }}
                >
                  <option value="">
                    {loading
                      ? "Loading classes..."
                      : mappings.length
                        ? "Select Class"
                        : "No assigned classes found"}
                  </option>

                  {mappings.map((mapping) => (
                    <option key={mapping._id} value={mapping._id}>
                      {mapping.session} | {mapping.course?.courseShortName} |{" "}
                      {mapping.branch?.branchShortName} | Year {mapping.year} |
                      Sem {mapping.semester} | Sec {mapping.section} |{" "}
                      {mapping.subjectId?.subjectFullName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <FaCalendarAlt className="me-2 text-primary" />
                  Start Date
                </Form.Label>

                <Form.Control
                  type="date"
                  value={fromDate}
                  max={toDate || getTodayDate()}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="py-2"
                  required
                  style={{
                    borderRadius: 10,
                    boxShadow: "none",
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <FaCalendarAlt className="me-2 text-primary" />
                  End Date
                </Form.Label>

                <Form.Control
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  max={getTodayDate()}
                  onChange={(e) => setToDate(e.target.value)}
                  className="py-2"
                  required
                  style={{
                    borderRadius: 10,
                    boxShadow: "none",
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            disabled={
              loading || submitting || !selectedMapping || !fromDate || !toDate
            }
            className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 border-0"
            style={{
              backgroundColor: "#2563eb",
              borderRadius: 9,
              fontWeight: 600,
              minWidth: 180,
            }}
          >
            {submitting ? (
              <Spinner size="sm" />
            ) : (
              <>
                <FaClipboardCheck />
                View Register
                <FaArrowRight size={12} />
              </>
            )}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default AttendanceRegisterForm;
