import { Container, Button, Table, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function ViewAttendance() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    formData = {},
    facultyMapId = "",
    SingletimeSlot = "",
    selectedDate = "",
  } = location.state || {};

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const getAttendance = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${apiUrl}/viewattendance`, {
        params: {
          mappingId: facultyMapId,
          SingletimeSlot: SingletimeSlot,
          date: selectedDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAttendanceRecords(response.data.data || []);
      }
    } catch (err) {
      console.error("View attendance error:", err);

      alert(err.response?.data?.message || "Failed to fetch attendance");
    }
  };

  useEffect(() => {
    if (facultyMapId && SingletimeSlot) {
      getAttendance();
    }
  }, [facultyMapId, SingletimeSlot]);

  return (
    <Container className="py-3">
      {/* Page Heading */}
      <div className="text-center mb-4">
        <h3 className="text-primary fw-bold mb-1">VIEW ATTENDANCE</h3>
        <small className="text-muted">
          Attendance details for the selected class and time slot
        </small>
      </div>

      {/* Attendance Summary */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="p-3">
          <div className="border rounded p-3 bg-light">
            <Row className="g-0 text-center align-items-center">
              {/* Course */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">COURSE</small>
                <div className="fw-bold text-primary mt-1">
                  {formData.courseName || "-"}
                </div>
              </Col>

              {/* Branch */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">BRANCH</small>
                <div className="fw-bold mt-1">
                  {formData.branchName || "No Branch"}
                </div>
              </Col>

              {/* Session */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SESSION</small>
                <div className="fw-bold mt-1">{formData.session || "-"}</div>
              </Col>

              {/* Year */}
              <Col lg={1} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">YEAR</small>
                <div className="fw-bold mt-1">{formData.year || "-"}</div>
              </Col>

              {/* Semester */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SEMESTER</small>
                <div className="fw-bold mt-1">{formData.semester || "-"}</div>
              </Col>

              {/* Section */}
              <Col lg={1} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SECTION</small>
                <div className="fw-bold mt-1">{formData.section || "-"}</div>
              </Col>

              {/* Time Slot */}
              <Col lg={2} md={4} sm={6}>
                <small className="text-muted d-block">TIME SLOT</small>
                <div className="fw-bold text-primary mt-1">
                  {attendanceRecords[0]?.timeSlotId?.timeSlot || "Selected"}
                </div>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
      {/* Attendance Records */}
      {attendanceRecords.map((record) => (
        <Card key={record._id} className="shadow-sm border-0 mb-3">
          <Card.Body className="p-0">
            <div className="p-2 text-center border-bottom">
              <strong>
                Date: {new Date(record.date).toLocaleDateString("en-IN")}
                {" | "}
                Lecture: {record.timeSlotId?.lectureNo}
                {" | "}
                {record.timeSlotId?.timeSlot}
              </strong>
            </div>

            <Table bordered hover responsive className="mb-0 align-middle">
              <thead className="table-primary">
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Roll No.</th>
                  <th>Student Name</th>
                  <th className="text-center">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {record.students?.map((student, index) => (
                  <tr key={student._id}>
                    <td className="text-center">{index + 1}</td>

                    <td className="text-center">
                      {student.studentId?.rollNumber}
                    </td>

                    <td>
                      {student.studentId?.firstName}{" "}
                      {student.studentId?.lastName}
                    </td>

                    <td className="text-center">
                      <span
                        className={
                          student.status === "Present"
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
      {/* No Records */}
      {attendanceRecords.length === 0 && (
        <div className="text-center text-muted py-4">
          No attendance records found.
        </div>
      )}
      {/* Back */}
      <div className="text-end mt-3">
        <Button
          variant="warning"
          className="me-2"
          onClick={() =>
            navigate(
              `/edit/attendance/${facultyMapId}/${SingletimeSlot}/${selectedDate}`,
              {
                state: {
                  formData: formData,
                  facultyMapId: facultyMapId,
                  SingletimeSlot: SingletimeSlot,
                  selectedDate: selectedDate,
                },
              },
            )
          }
        >
          Edit Attendance
        </Button>

        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </Container>
  );
}

export default ViewAttendance;
