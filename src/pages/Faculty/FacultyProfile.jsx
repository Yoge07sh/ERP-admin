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
const apiUrl = import.meta.env.VITE_API_URL;

function FacultyProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${apiUrl}/faculty/${id}`)
      .then((result) => {
        setFaculty(result.data.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Something went wrong!");
        setLoading(false);
      });
  }, [id]);

  function goToFacultyList() {
    navigate("/faculties");
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
    navigate("/edit/faculty/" + id);
  }

  return (
    <>
      <h2 className="text-center mb-4 text-primary fw-bold pb-2">
        Faculty Details
      </h2>
      <Container className="my-5 p-4 bg-light rounded-4">
        <Row className="align-items-center mb-4">
          <Col md={4} className="text-center mb-3 mb-md-0">
            <Card className="shadow border-1 rounded-4 overflow-hidden">
              <Image
                variant="top"
                src={faculty.facultyImage || "/profile.png"}
                alt="Faculty picture"
                className="p-2 img-fluid"
                thumbnail
                style={{ objectFit: "cover", height: "400px", width: "400px" }}
              />
            </Card>
          </Col>

          <Col md={8}>
            <h2 className="fw-bold mb-3 border-bottom pb-2">
              {faculty.firstName} {faculty.lastName}
            </h2>

            <Row>
              <Col sm={6} className="mb-2">
                <strong>Personal Email:</strong> {faculty.personalEmail}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>College Id:</strong> {faculty.collegeId}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Mobile No:</strong> {faculty.mobileNo}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Emergency Mobile No:</strong>{" "}
                {faculty.emergencyMobileNo}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Gender:</strong> {faculty.gender}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Date of Birth:</strong>{" "}
                {new Date(faculty.dob).toLocaleDateString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>Designation:</strong> {faculty.designation}
              </Col>
              <Col sm={6} className="mb-2">
                <strong>College Email:</strong> {faculty.collegeEmail}
              </Col>
            </Row>

            <div className="mt-4">
              <Button
                variant="primary"
                onClick={goToFacultyList}
                className="me-2"
              >
                Back to List
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => goToEdit(faculty._id)}
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

export default FacultyProfile;
