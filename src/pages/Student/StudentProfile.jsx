import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Image,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
const apiurl = import.meta.env.VITE_API_URL;
function StudentProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(apiurl + "/student/" + id)
      .then((result) => {
        setStudent(result.data.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Something went wrong!");
        setLoading(false);
      });
  }, [id]);

  function goToStudentList() {
    navigate("/students");
  }

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  function goToEdit(id) {
    navigate("/edit/student/" + id);
  }

  return (
    <>
      <h2 className="text-center mb-4 text-primary fw-bold pb-2">
        Student Details
      </h2>
      <Container className="my-5 p-4 bg-light rounded-4">
        <Row className="align-items-center mb-4">
          <Col md={4} className="text-center mb-3 mb-md-0">
            <Card className="shadow border-1 rounded-4 overflow-hidden">
              <Image
                variant="top"
                src={student.image || "/profile.png"}
                alt="Student picture"
                className="p-2 img-fluid"
                thumbnail
                style={{ objectFit: "cover", height: "400px", width: "400px" }}
              />
            </Card>
          </Col>

          <Col md={8}>
            <h2 className="fw-bold mb-3 border-bottom pb-2">
              {student.firstName} {student.lastName}
            </h2>

            <Row>
              <Col sm={6} className="mb-2">
                <strong>Enrollment No :-</strong> {student.enrollmentNumber}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Date of Birth :-</strong> {student.dob}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Gender:</strong> {student.gender}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Personal Email :-</strong> {student.personalEmailId}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>College Email :-</strong> {student.collegeEmailId}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Father's Name :-</strong> {student.fatherName}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Mother's Name :-</strong> {student.motherName}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Admission Year :-</strong> {student.admissionYear}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Year :-</strong> {student.year}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Semester :-</strong> {student.semester}
              </Col>
              <Col sm={12} className="mb-2">
                <strong>Address :-</strong> {student.localAddressLine1},{" "}
                {student.localAddressLine2}
              </Col>
              <Col sm={3} className="mb-2">
                <strong>City :-</strong> {student.localCity}
              </Col>
              <Col sm={3} className="mb-2">
                <strong>State :-</strong> {student.localState}
              </Col>
              <Col sm={3} className="mb-2">
                <strong>Pincode :-</strong> {student.localPincode}
              </Col>
            </Row>

            <div className="mt-4">
              <Button
                variant="primary"
                onClick={goToStudentList}
                className="me-2"
              >
                Back to List
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => goToEdit(student._id)}
              >
                Edit Profile
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default StudentProfile;
