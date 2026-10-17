import { Container, Button, Table, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { FaClipboardCheck, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

// Convert a Date into YYYY-MM-DD according to IST
const getDateIST = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
};

function Eregister() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    formData = {},
    facultyMapId = "",
    fromDate = "",
    toDate = "",
  } = location.state || {};

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get E-Attendance Register
  const getERegister = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${apiUrl}/eregister`, {
        params: {
          mappingId: facultyMapId,
          fromDate: fromDate,
          toDate: toDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAttendanceRecords(response.data.data || []);
      }
    } catch (error) {
      console.error("E-Register error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch E-Attendance Register",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyMapId && fromDate && toDate) {
      getERegister();
    } else {
      setLoading(false);
    }
  }, [facultyMapId, fromDate, toDate]);

  // Get all unique students
  const students = [];

  attendanceRecords.forEach((record) => {
    record.students?.forEach((student) => {
      const studentData = student.studentId;

      if (!studentData) return;

      const exists = students.find(
        (item) => item.studentId === studentData._id,
      );

      if (!exists) {
        students.push({
          studentId: studentData._id,
          rollNumber: studentData.rollNumber,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
        });
      }
    });
  });

  // Get all unique dates in IST
  const dates = [
    ...new Set(
      attendanceRecords
        .map((record) => getDateIST(record.date))
        .filter(Boolean),
    ),
  ].sort();

  // Get attendance for a student on a particular date
  const getStudentDateAttendance = (student, date) => {
    return attendanceRecords.filter((record) => {
      const recordDate = getDateIST(record.date);

      return (
        recordDate === date &&
        record.students?.some(
          (item) => item.studentId?._id === student.studentId,
        )
      );
    });
  };

  // Get attendance percentage
  const getAttendancePercentage = (student) => {
    let totalLectures = 0;
    let presentLectures = 0;

    attendanceRecords.forEach((record) => {
      const attendance = record.students?.find(
        (item) => item.studentId?._id === student.studentId,
      );

      if (attendance) {
        totalLectures++;

        if (attendance.status === "Present") {
          presentLectures++;
        }
      }
    });

    if (totalLectures === 0) {
      return "0.0";
    }

    return ((presentLectures / totalLectures) * 100).toFixed(1);
  };
  const generateAttendancePDF = () => {
    if (attendanceRecords.length === 0 || students.length === 0) {
      alert("No attendance records available to generate the report.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Report heading
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("E-ATTENDANCE REGISTER", pageWidth / 2, 15, {
      align: "center",
    });

    // Class information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Course: ${formData.courseName || "-"}`, 14, 25);

    doc.text(`Branch: ${formData.branchName || "-"}`, 14, 31);

    doc.text(`Session: ${formData.session || "-"}`, 14, 37);

    doc.text(
      `Year: ${formData.year || "-"}  |  Semester: ${
        formData.semester || "-"
      }  |  Section: ${formData.section || "-"}`,
      14,
      43,
    );

    doc.text(
      `Period: ${formatDate(fromDate)} to ${formatDate(toDate)}`,
      14,
      49,
    );

    // Build table headings
    const tableHeaders = [
      "S.No",
      "Roll No.",
      "Student Name",
      ...dates.map((date) => formatDate(date)),
      "Attendance %",
    ];

    // Build one row per student
    const tableRows = students.map((student, index) => {
      const dateAttendance = dates.map((date) => {
        const records = getStudentDateAttendance(student, date);

        if (records.length === 0) {
          return "-";
        }

        return records
          .map((record) => {
            const attendance = record.students?.find(
              (item) =>
                String(item.studentId?._id || item.studentId) ===
                String(student.studentId),
            );

            if (!attendance) return null;

            const lectureNo = record.timeSlotId?.lectureNo ?? "?";

            const status =
              attendance.status === "Present"
                ? "P"
                : attendance.status === "Absent"
                  ? "A"
                  : "-";

            return `L${lectureNo}: ${status}`;
          })
          .filter(Boolean)
          .join("\n");
      });

      return [
        index + 1,
        student.rollNumber || "-",
        `${student.firstName || ""} ${student.lastName || ""}`.trim() || "-",
        ...dateAttendance,
        `${getAttendancePercentage(student)}%`,
      ];
    });

    // Generate PDF table
    autoTable(doc, {
      startY: 55,
      head: [tableHeaders],
      body: tableRows,
      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
      },

      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },

      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 22, halign: "center" },
        2: { cellWidth: 38 },
      },

      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(8);
        doc.text(
          `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
          14,
          pageHeight - 8,
        );

        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
          pageWidth - 14,
          pageHeight - 8,
          { align: "right" },
        );
      },

      margin: {
        top: 12,
        right: 10,
        bottom: 15,
        left: 10,
      },
    });

    // Download PDF
    const filename = `Attendance_Report_${fromDate}_to_${toDate}.pdf`;

    doc.save(filename);
  };

  // Display date in Indian format
  const formatDate = (date) => {
    if (!date) return "-";

    // If already YYYY-MM-DD, convert it safely as an IST calendar date
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split("-");

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return new Date(date).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Container
      fluid
      className="pb-4"
      style={{
        marginTop: "-15px",
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
            <h4 className="mb-1 fw-bold">E-Attendance Register</h4>

            <p
              className="mb-0"
              style={{
                color: "#cbd5e1",
                fontSize: "12px",
              }}
            >
              Date and Lecture wise attendance register
            </p>
          </div>
        </div>
      </div>

      {/* Class Information */}
      <Card className="shadow-sm border-0 mb-3">
        <Card.Body className="p-2">
          <h6 className="fw-bold mb-2">Class Information</h6>

          <div className="border rounded p-2 bg-light">
            <Row className="g-0 text-center align-items-center">
              {/* Course */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">COURSE</small>

                <div className="fw-bold text-primary">
                  {formData.courseName || "-"}
                </div>
              </Col>

              {/* Branch */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">BRANCH</small>

                <div className="fw-bold">
                  {formData.branchName || "No Branch"}
                </div>
              </Col>

              {/* Session */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SESSION</small>

                <div className="fw-bold">{formData.session || "-"}</div>
              </Col>

              {/* Year */}
              <Col lg={1} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">YEAR</small>

                <div className="fw-bold">{formData.year || "-"}</div>
              </Col>

              {/* Semester */}
              <Col lg={2} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SEMESTER</small>

                <div className="fw-bold">{formData.semester || "-"}</div>
              </Col>

              {/* Section */}
              <Col lg={1} md={4} sm={6} className="border-end">
                <small className="text-muted d-block">SECTION</small>

                <div className="fw-bold">{formData.section || "-"}</div>
              </Col>
            </Row>
          </div>

          {/* Date Range */}
          <Row className="mt-2 g-2">
            <Col md={6}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">
                  <FaCalendarAlt className="me-1 text-primary" />
                  FROM DATE
                </small>

                <div className="fw-bold">{formatDate(fromDate)}</div>
              </div>
            </Col>

            <Col md={6}>
              <div className="border rounded p-2">
                <small className="text-muted d-block">
                  <FaCalendarAlt className="me-1 text-danger" />
                  TO DATE
                </small>

                <div className="fw-bold">{formatDate(toDate)}</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Attendance Register */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="p-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h5 className="fw-bold mb-1">Attendance Register</h5>
              <small className="text-muted">
                Attendance for all lectures within the selected date range
              </small>
            </div>

            <Button
              variant="primary"
              onClick={generateAttendancePDF}
              disabled={loading || attendanceRecords.length === 0}
            >
              Generate PDF Report
            </Button>
          </div>
          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>

              <div className="mt-2 text-muted">Loading attendance...</div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered hover className="mb-0 align-middle text-center">
                  <thead className="table-primary">
                    <tr>
                      <th
                        style={{
                          minWidth: "50px",
                        }}
                      >
                        S.No
                      </th>

                      <th
                        style={{
                          minWidth: "100px",
                        }}
                      >
                        Roll No.
                      </th>

                      <th
                        className="text-start"
                        style={{
                          minWidth: "100px",
                        }}
                      >
                        Student Name
                      </th>

                      {dates.map((date) => (
                        <th
                          key={date}
                          style={{
                            minWidth: "80px",
                          }}
                        >
                          {formatDate(date)}
                        </th>
                      ))}

                      <th
                        style={{
                          minWidth: "100px",
                        }}
                      >
                        Attendance %
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student, index) => {
                      const percentage = getAttendancePercentage(student);

                      return (
                        <tr key={student.studentId}>
                          <td>{index + 1}</td>

                          <td className="fw-semibold">{student.rollNumber}</td>

                          <td className="text-start">
                            {student.firstName} {student.lastName}
                          </td>

                          {dates.map((date) => {
                            const dateRecords = getStudentDateAttendance(
                              student,
                              date,
                            );

                            return (
                              <td
                                key={date}
                                style={{
                                  minWidth: "80px",
                                  padding: "5px",
                                }}
                              >
                                {dateRecords.length === 0 ? (
                                  <span className="text-muted">-</span>
                                ) : (
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "repeat(2, 1fr)",
                                      gap: "2px",
                                    }}
                                  >
                                    {dateRecords.map((record) => {
                                      const attendance = record.students?.find(
                                        (item) =>
                                          item.studentId?._id ===
                                          student.studentId,
                                      );

                                      const lectureNo =
                                        record.timeSlotId?.lectureNo;

                                      const status = attendance?.status;

                                      return (
                                        <span
                                          key={record._id}
                                          className={
                                            status === "Present"
                                              ? "text-success fw-bold"
                                              : status === "Absent"
                                                ? "text-danger fw-bold"
                                                : "text-secondary fw-bold"
                                          }
                                          style={{
                                            fontSize: "13px",
                                            minWidth: "25px",
                                          }}
                                        >
                                          L{lectureNo}:
                                          {status === "Present"
                                            ? "P"
                                            : status === "Absent"
                                              ? "A"
                                              : "-"}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </td>
                            );
                          })}

                          <td>
                            <span
                              className={
                                Number(percentage) >= 75
                                  ? "badge bg-success"
                                  : "badge bg-danger"
                              }
                            >
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              {/* No Records */}
              {attendanceRecords.length === 0 && (
                <div className="text-center text-muted py-5">
                  No attendance records found.
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Back */}
      <div className="text-end mt-3">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="d-flex align-items-center gap-2 ms-auto"
        >
          <FaArrowLeft />
          Back
        </Button>
      </div>
    </Container>
  );
}

export default Eregister;
