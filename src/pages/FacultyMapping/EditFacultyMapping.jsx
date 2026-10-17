import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function EditFacultyMapping() {
  const params = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");
  const handleClose = () => {
    setShow(false);
    navigate("/facultymapping");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFacultyMapping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  useEffect(() => {
    if (!params.id) {
      return;
    }

    setLoading(true);

    axios
      .get(apiUrl + "/facultyMapping/" + params.id)
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;

          setFacultyMapping({
            session: data.session || "",

            facultyId: data.facultyId?._id || data.facultyId || "",

            course: data.course?._id || data.course?.value || data.course || "",

            branch: data.branch?._id || data.branch?.value || data.branch || "",

            year: data.year || "",

            semester: data.semester || "",

            section: data.section || "",

            subjectId:
              data.subjectId?._id ||
              data.subjectId?.value ||
              data.subjectId ||
              "",

            loadPerWeek: data.loadPerWeek || "",
          });
        } else {
          alert(res.data.message || "Faculty Mapping not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Faculty Mapping:", err);

        alert(
          err.response?.data?.message ||
            "Something went wrong while fetching Faculty Mapping.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.put(
        apiUrl + "/edit/facultyMapping/" + params.id,
        facultyMapping,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setShow(true);
      } else {
        alert(res.data.message || "Failed to update Faculty Mapping.");
      }
    } catch (err) {
      console.error("Error updating Faculty Mapping:", err);

      alert(
        err.response?.data?.message ||
          "Something went wrong while updating Faculty Mapping.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold">
        EDIT FACULTY MAPPING
      </h3>

      <hr />

      {loading && <div className="text-center mb-3">Loading...</div>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          {/* Session */}

          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Session :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="session"
                value={facultyMapping.session}
                onChange={handleChange}
                required
              >
                <option value="">---Select Session---</option>

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
                Faculty :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="facultyId"
                value={facultyMapping.facultyId}
                onChange={handleChange}
                required
              >
                <option value="">---Select Faculty---</option>

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
                Course :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="course"
                value={facultyMapping.course}
                onChange={handleChange}
                required
              >
                <option value="">---Select Course---</option>

                {courses.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          {/* Branch */}

          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Branch :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="branch"
                value={facultyMapping.branch}
                onChange={handleChange}
                required
              >
                <option value="">---Select Branch---</option>

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
                Year :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="year"
                value={facultyMapping.year}
                onChange={handleChange}
                required
              >
                <option value="">---Select Year---</option>

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
                Semester :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="semester"
                value={facultyMapping.semester}
                onChange={handleChange}
                required
              >
                <option value="">---Select Semester---</option>

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
        <Row className="mb-3">
          {/* Section */}

          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Section :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="section"
                value={facultyMapping.section}
                onChange={handleChange}
                required
              >
                <option value="">---Select Section---</option>

                <option value="A">Section A</option>

                <option value="B">Section B</option>

                <option value="C">Section C</option>

                <option value="D">Section D</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Subject */}

          <Col md={4}>
            <Form.Group>
              <Form.Label>
                Subject :-
                <span className="text-danger">*</span>
              </Form.Label>

              <Form.Select
                name="subjectId"
                value={facultyMapping.subjectId}
                onChange={handleChange}
                required
              >
                <option value="">---Select Subject---</option>

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
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            onClick={() => navigate("/facultymapping")}
            variant="danger"
            type="button"
          >
            Cancel
          </Button>

          <Button type="submit" variant="success" disabled={loading}>
            {loading ? "Updating..." : "Edit Mapping"}
          </Button>
        </div>
      </Form>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Faculty Mapping has been updated successfully.</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EditFacultyMapping;
