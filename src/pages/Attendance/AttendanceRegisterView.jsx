import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaClipboardCheck } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

const getId = (value) =>
  value && typeof value === "object" ? value._id : value;

const getStudentName = (student) =>
  [student?.firstName, student?.lastName].filter(Boolean).join(" ") ||
  student?.name ||
  "N/A";

const formatDate = (value) => {
  const date = new Date(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
};

function AttendanceRegisterView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mappingId = state?.mappingId;
  const fromDate = state?.fromDate;
  const toDate = state?.toDate;

  useEffect(() => {
    if (!mappingId || !fromDate || !toDate) {
      navigate("/attendance-register", { replace: true });
      return;
    }

    const fetchRegister = async () => {
      setLoading(true);
      setError("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        // Use the separate E-Attendance Register APIs.
        const [studentResponse, attendanceResponse] = await Promise.all([
          axios.get(`${apiUrl}/e-attendance/students`, {
            ...config,
            params: { mappingId },
          }),

          axios.get(`${apiUrl}/e-attendance/records`, {
            ...config,
            params: { mappingId, fromDate, toDate },
          }),
        ]);

        const attendanceRecords = attendanceResponse.data.data || [];

        attendanceRecords.sort((a, b) => {
          const dateDifference = new Date(a.date) - new Date(b.date);

          if (dateDifference !== 0) return dateDifference;

          return (
            (a.timeSlotId?.lectureNo ?? 999) - (b.timeSlotId?.lectureNo ?? 999)
          );
        });

        setStudents(studentResponse.data.data || []);
        setRecords(attendanceRecords);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load the attendance register.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegister();
  }, [mappingId, fromDate, toDate, token, navigate]);

  // Every saved attendance record is one lecture column.
  const sessions = useMemo(
    () =>
      records.map((record, index) => ({
        ...record,
        columnKey: String(record._id || index),
        label: `${formatDate(record.date)}${
          record.timeSlotId?.lectureNo != null
            ? ` / L${record.timeSlotId.lectureNo}`
            : ""
        }`,
      })),
    [records],
  );

  const rows = useMemo(
    () =>
      students.map((student) => {
        const studentId = getId(student._id);

        const statuses = sessions.map((session) => {
          const entry = (session.students || []).find(
            (item) => String(getId(item.studentId)) === String(studentId),
          );

          if (entry?.status === "Present") return "P";
          if (entry?.status === "Absent") return "A";

          return "-";
        });

        const present = statuses.filter((status) => status === "P").length;
        const absent = statuses.filter((status) => status === "A").length;
        const total = present + absent;

        return {
          student,
          statuses,
          present,
          absent,
          percentage: total > 0 ? ((present / total) * 100).toFixed(2) : null,
        };
      }),
    [students, sessions],
  );

  const summary = useMemo(() => {
    const present = rows.reduce((sum, row) => sum + row.present, 0);
    const absent = rows.reduce((sum, row) => sum + row.absent, 0);

    return { present, absent };
  }, [rows]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="text-muted mt-2">Loading attendance register...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-3 px-md-4">
      <div className="position-relative d-flex align-items-center justify-content-center mb-4">
        <Button
          variant="outline-secondary"
          className="position-absolute start-0"
          onClick={() => navigate("/attendance-register")}
        >
          <FaArrowLeft className="me-2" />
          Back
        </Button>

        <div className="text-center">
          <h3 className="mb-1">
            <FaClipboardCheck className="me-2 text-primary" />
            Attendance Register
          </h3>

          <div className="text-muted small">
            {fromDate} to {toDate}
          </div>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && (
        <>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Student Attendance Details</h5>

              {students.length === 0 ? (
                <Alert variant="info">
                  No active students found for this class.
                </Alert>
              ) : sessions.length === 0 ? (
                <Alert variant="info">
                  No attendance records were found for this date range.
                </Alert>
              ) : (
                <div className="table-responsive" style={{ maxHeight: "70vh" }}>
                  <Table bordered hover size="sm" className="align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ minWidth: 100 }}>Roll No.</th>
                        <th style={{ minWidth: 180 }}>Student Name</th>

                        {sessions.map((session) => (
                          <th
                            key={session.columnKey}
                            style={{ minWidth: 105 }}
                            className="text-center"
                          >
                            {session.label}
                          </th>
                        ))}

                        <th className="text-center">Total Days</th>
                        <th className="text-center">Present Days</th>
                        <th style={{ minWidth: 105 }}>Percentage</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row) => (
                        <tr key={String(row.student._id)}>
                          <td>
                            {row.student.rollNumber ??
                              row.student.rollNo ??
                              "N/A"}
                          </td>

                          <td>{getStudentName(row.student)}</td>

                          {row.statuses.map((status, index) => (
                            <td
                              key={sessions[index].columnKey}
                              className="text-center"
                            >
                              {status === "P" ? (
                                <Badge bg="success">P</Badge>
                              ) : status === "A" ? (
                                <Badge bg="danger">A</Badge>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          ))}

                          <td className="text-center">
                            {row.present + row.absent}
                          </td>

                          <td className="text-center">{row.present}</td>

                          <td className="text-center">
                            <Badge
                              bg={
                                row.percentage === null
                                  ? "secondary"
                                  : Number(row.percentage) >= 75
                                    ? "success"
                                    : "warning"
                              }
                              text={
                                row.percentage !== null &&
                                Number(row.percentage) < 75
                                  ? "dark"
                                  : undefined
                              }
                            >
                              {row.percentage === null
                                ? "N/A"
                                : `${row.percentage}%`}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              <div className="text-muted small mt-3">
                Percentage = Present ÷ (Present + Absent) × 100. Unmarked
                student entries are excluded.
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}

export default AttendanceRegisterView;
