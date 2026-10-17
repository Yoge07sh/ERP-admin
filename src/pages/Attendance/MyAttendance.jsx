import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

const MyAttendance = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [attendance, setAttendance] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    percentage: 0,
    records: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your attendance.");
          return;
        }

        const response = await axios.get(`${apiUrl}/my/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setAttendance(response.data.data);
        } else {
          setError(response.data.message || "Unable to load attendance.");
        }
      } catch (err) {
        console.error("My attendance error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load attendance. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [apiUrl]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading attendance...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <h3 className="mb-3">My Attendance</h3>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const summaryCards = [
    {
      title: "Total Classes",
      value: attendance.totalClasses,
      color: "primary",
    },
    {
      title: "Present",
      value: attendance.present,
      color: "success",
    },
    {
      title: "Absent",
      value: attendance.absent,
      color: "danger",
    },
    {
      title: "Attendance",
      value: `${attendance.percentage}%`,
      color: "info",
    },
  ];

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4">My Attendance</h3>

      {/* Summary cards */}
      <Row className="g-3 mb-4">
        {summaryCards.map((item) => (
          <Col xs={6} md={3} key={item.title}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body>
                <div className="text-muted small">{item.title}</div>

                <h3 className={`text-${item.color} mt-2 mb-0`}>{item.value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Attendance history */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Attendance History</h5>

          {attendance.records.length === 0 ? (
            <Alert variant="info" className="mb-0">
              No attendance records found.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover bordered className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Lecture</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.records.map((record) => (
                    <tr key={record._id}>
                      <td>{formatDate(record.date)}</td>

                      <td>{record.subject || "N/A"}</td>

                      <td>
                        {record.lectureNo != null
                          ? `Lecture ${record.lectureNo}`
                          : record.timeSlot || "—"}
                      </td>

                      <td>
                        <Badge
                          bg={
                            record.status === "Present"
                              ? "success"
                              : record.status === "Absent"
                                ? "danger"
                                : "secondary"
                          }
                        >
                          {record.status || "Unknown"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyAttendance;
