import "bootstrap/dist/css/bootstrap.min.css";

import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function AddFacultyMapping() {
  const [facultyMapping, setFacultyMapping] = useState({
    session: "",
    facultyId: "",
    course: "",
    branch: "",
    year: "",
    semester: "",
    section: "",
    subjectId: "",
    loadPerWeek: "",
  });

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // ================= SUCCESS MODAL =================
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFacultyMapping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= FETCH COURSES =================
  useEffect(() => {
    axios
      .get(apiUrl + "/courses/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          alert("Failed to load Courses.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Courses:", err);
      });
  }, []);

  // ================= FETCH SUBJECTS =================
  useEffect(() => {
    axios
      .get(apiUrl + "/subjects/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setSubjects(res.data.data);
        } else {
          alert("Failed to load Subjects.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Subjects:", err);
      });
  }, []);

  // ================= FETCH BRANCHES =================
  useEffect(() => {
    axios
      .get(apiUrl + "/branchs/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setBranches(res.data.data);
        } else {
          alert("Failed to load Branches.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Branches:", err);
      });
  }, []);

  // ================= FETCH FACULTIES =================
  useEffect(() => {
    axios
      .get(apiUrl + "/faculties/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setFaculties(res.data.data);
        } else {
          alert("Failed to load Faculties.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Faculties:", err);
      });
  }, []);
  // ================= RESET BRANCH WHEN COURSE CHANGES =================
  useEffect(() => {
    setFacultyMapping((prev) => ({
      ...prev,
      branch: "",
    }));
  }, [facultyMapping.course]);

  // ================= SUBMIT FACULTY MAPPING =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        apiUrl + "/add/facultymapping",
        facultyMapping,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        // Show success modal
        setShow(true);

        // Reset form
        setFacultyMapping({
          session: "",
          facultyId: "",
          course: "",
          branch: "",
          year: "",
          semester: "",
          section: "",
          subjectId: "",
          loadPerWeek: "",
        });
        navigate("/facultymapping");
      } else {
        alert(res.data.message || "Failed to add faculty mapping.");
      }
    } catch (err) {
      console.error("Error adding faculty mapping:", err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while adding faculty mapping.",
      );
    }
  };

  return (
    <Container>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold">
        ADD FACULTY MAPPING
      </h3>

      <hr />

      <Form onSubmit={handleSubmit}>
        {/* ================= ROW 1 ================= */}
        <Row className="mb-3">
          {/* Session */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Session :-<span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="session"
                value={facultyMapping.session}
                onChange={handleChange}
                required
              >
                <option value="">Select Session</option>
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Faculty */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Faculty :- <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="facultyId"
                value={facultyMapping.facultyId}
                onChange={handleChange}
                required
              >
                <option value="">Select Faculty</option>

                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty._id}>
                    {[faculty.firstName, faculty.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Course */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Course :- <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="course"
                value={facultyMapping.course}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>

                {courses.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {/* ================= ROW 2 ================= */}
        <Row className="mb-3">
          {/* Branch */}

          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Branch :- <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="branch"
                value={facultyMapping.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>

                {branches.map((branch) => (
                  <option key={branch.value} value={branch.value}>
                    {branch.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Year */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Year :- <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="year"
                value={facultyMapping.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Semester */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Semester :- <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="semester"
                value={facultyMapping.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {/* ================= ROW 3 ================= */}
        <Row className="mb-3">
          {/* Section */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Section :- <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="section"
                value={facultyMapping.section}
                onChange={handleChange}
                required
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Subject */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Subject :- <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="subjectId"
                value={facultyMapping.subjectId}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>

                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Load Per Week */}
          <Col md={4}>
            <Form.Group>
              <Form.Label>Load Per Week :-</Form.Label>

              <Form.Control
                type="text"
                name="loadPerWeek"
                value={facultyMapping.loadPerWeek}
                onChange={handleChange}
                placeholder="Enter load per week"
              />
            </Form.Group>
          </Col>
        </Row>
        {/* ================= SUBMIT BUTTON ================= */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            onClick={() => navigate("/facultymapping")}
            variant="danger"
            type="button"
          >
            Cancel
          </Button>

          <Button type="submit">Add Mapping</Button>
        </div>
      </Form>

      {/* ================= SUCCESS MODAL ================= */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Faculty Mapping has been saved successfully...</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddFacultyMapping;
