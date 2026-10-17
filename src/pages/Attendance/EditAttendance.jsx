import {
  Container,
  Button,
  Table,
  Card,
  Row,
  Col,
  Badge,
  Modal,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function EditAttendance() {
  const { facultyMapId, SingletimeSlot, selectedDate } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const { formData = {} } = location.state || {};

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  // Get existing attendance
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
        const records = response.data.data || [];

        if (records.length === 0) {
          alert("No attendance record found for this date and time slot.");
          navigate(-1);
          return;
        }

        const record = records[0];

        setStudents(
          record.students?.map((item) => item.studentId).filter(Boolean) || [],
        );

        const attendanceData = {};

        record.students?.forEach((item) => {
          if (item.studentId?._id) {
            attendanceData[item.studentId._id] = item.status;
          }
        });

        setAttendance(attendanceData);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);

      alert(err.response?.data?.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyMapId && SingletimeSlot && selectedDate) {
      getAttendance();
    }
  }, [facultyMapId, SingletimeSlot, selectedDate]);

  // Update attendance
  const handleUpdate = async () => {
    if (!facultyMapId) {
      alert("Mapping information is missing.");
      return;
    }

    if (!SingletimeSlot) {
      alert("Time slot is missing.");
      return;
    }

    if (!selectedDate) {
      alert("Date is missing.");
      return;
    }

    if (students.length === 0) {
      alert("No students found.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const attendanceData = students.map((student) => ({
        studentId: student._id,
        status: attendance[student._id] || "Present",
      }));

      const response = await axios.put(
        `${apiUrl}/edit/attendance`,
        {
          facultyMapId: facultyMapId,
          timeSlotId: SingletimeSlot,
          date: selectedDate,
          students: attendanceData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setShow(true);
      }
    } catch (err) {
      console.error("Attendance update error:", err);

      alert(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = students.filter(
    (student) => attendance[student._id] === "Present",
  ).length;

  const absentCount = students.filter(
    (student) => attendance[student._id] === "Absent",
  ).length;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="text-muted">Loading attendance...</div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-3 px-4">
      {/* Page Heading */}
      <div className="text-center mb-3">
        <h3 className="text-primary fw-bold mb-1">EDIT ATTENDANCE</h3>

        <div className="text-muted small">
          Update attendance for the selected class
        </div>
      </div>

      <Row className="g-3">
        {/* Attendance Summary */}
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Body className="py-2 px-3">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <h6 className="fw-bold text-primary mb-0">
                  Attendance Summary
                </h6>

                <div>
                  <small className="text-muted">Course</small>

                  <span className="fw-semibold ms-2">
                    {formData.courseName || "-"}
                  </span>
                </div>

                {formData.branchName && (
                  <div>
                    <small className="text-muted">Branch</small>

                    <span className="fw-semibold ms-2">
                      {formData.branchName}
                    </span>
                  </div>
                )}

                <div>
                  <small className="text-muted">Year</small>

                  <span className="fw-semibold ms-2">
                    {formData.year || "-"}
                  </span>
                </div>

                <div>
                  <small className="text-muted">Semester</small>

                  <span className="fw-semibold ms-2">
                    {formData.semester || "-"}
                  </span>
                </div>

                <div>
                  <small className="text-muted">Section</small>

                  <span className="fw-semibold ms-2">
                    {formData.section || "-"}
                  </span>
                </div>

                <div>
                  <small className="text-muted">Date</small>

                  <span className="fw-semibold ms-2">
                    {selectedDate
                      ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                          "en-IN",
                        )
                      : "-"}
                  </span>
                </div>

                <div className="ms-auto d-flex gap-2">
                  <Badge bg="primary" pill>
                    Total: {students.length}
                  </Badge>

                  <Badge bg="success" pill>
                    Present: {presentCount}
                  </Badge>

                  <Badge bg="danger" pill>
                    Absent: {absentCount}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Student Table */}
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              {/* Table Heading */}
              <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom">
                <div>
                  <h5 className="fw-bold mb-1">Student List</h5>

                  <small className="text-muted">
                    Edit attendance for each student
                  </small>
                </div>

                <Badge bg="primary" className="px-3 py-2">
                  {students.length} Students
                </Badge>
              </div>

              {/* Student Table */}
              <div className="table-responsive">
                <Table bordered hover className="mb-0 align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th className="text-center" style={{ width: "8%" }}>
                        S.No
                      </th>

                      <th className="text-center" style={{ width: "18%" }}>
                        Roll No.
                      </th>

                      <th style={{ width: "39%" }}>Student Name</th>

                      <th className="text-center" style={{ width: "35%" }}>
                        Attendance
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.length > 0 ? (
                      students.map((student, index) => {
                        const status = attendance[student._id] || "Present";

                        return (
                          <tr key={student._id}>
                            <td className="text-center fw-semibold">
                              {index + 1}
                            </td>

                            <td className="text-center fw-semibold">
                              {student.rollNumber}
                            </td>

                            <td>
                              <span className="fw-semibold">
                                {student.firstName} {student.lastName}
                              </span>
                            </td>

                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  size="sm"
                                  className="px-3"
                                  variant={
                                    status === "Present"
                                      ? "success"
                                      : "outline-success"
                                  }
                                  onClick={() =>
                                    setAttendance({
                                      ...attendance,
                                      [student._id]: "Present",
                                    })
                                  }
                                >
                                  Present
                                </Button>

                                <Button
                                  size="sm"
                                  className="px-3"
                                  variant={
                                    status === "Absent"
                                      ? "danger"
                                      : "outline-danger"
                                  }
                                  onClick={() =>
                                    setAttendance({
                                      ...attendance,
                                      [student._id]: "Absent",
                                    })
                                  }
                                >
                                  Absent
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 p-3 border-top">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>

                <Button
                  variant="primary"
                  disabled={students.length === 0 || submitting}
                  className="px-4"
                  onClick={handleUpdate}
                >
                  {submitting ? "Updating..." : "Update Attendance"}
                </Button>
              </div>
            </Card.Body>
          </Card>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Attendance updated successfully👍</Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => {
                  handleClose();

                  navigate("/viewattendance", {
                    state: {
                      formData,
                      facultyMapId,
                      SingletimeSlot,
                      selectedDate,
                    },
                  });
                }}
              >
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default EditAttendance;
