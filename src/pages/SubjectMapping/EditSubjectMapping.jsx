import { useState, useEffect } from "react";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";

import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate, useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function EditSubjectMapping() {
  let navigate = useNavigate();
  let params = useParams();
  let id = params.id;

  const token = localStorage.getItem("token");

  let [subjects, setSubjects] = useState([]);
  let [courses, setCourses] = useState([]);
  let [branchs, setBranchs] = useState([]);

  const [show, setShow] = useState(false);

  let [showForm, setShowForm] = useState(true);
  let [showSpinner, setShowSpinner] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(false);

  let [subjectMapping, setSubjectMapping] = useState({
    session: "",
    subject: "",
    course: "",
    branch: "",
    year: "",
    semester: "",
  });

  // =========================
  // GET COURSES
  // =========================
  useEffect(() => {
    axios
      .get(apiUrl + "/courses/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setCourses(res.data.data);
        } else {
          alert("Failed to load Course.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Courses:", err);
      });
  }, []);

  // =========================
  // GET SUBJECTS
  // =========================
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

  // =========================
  // GET BRANCHES
  // =========================
  useEffect(() => {
    axios
      .get(apiUrl + "/branchs/for/mapping")
      .then((res) => {
        if (res.data.success) {
          setBranchs(res.data.data);
        } else {
          alert("Failed to load Branch.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Branchs:", err);
      });
  }, []);

  // =========================
  // GET EXISTING MAPPING
  // =========================
  useEffect(() => {
    axios({
      url: apiUrl + "/subjectMapping/" + id,
      method: "get",
    })
      .then((res) => {
        const data = res.data.data;

        console.log("Existing Subject Mapping:", data);

        setSubjectMapping({
          session: data.session || "",

          // Populated object -> ObjectId
          subject: data.subject?._id || "",

          // Populated object -> ObjectId
          course: data.course?._id || "",

          // Populated object -> ObjectId
          branch: data.branch?._id || "",

          year: data.year || "",
          semester: data.semester || "",
        });
      })
      .catch((err) => {
        console.error("Error loading subject mapping:", err);
        alert("Error loading subject mapping");
      });
  }, [id]);

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  function manageUpdate(e) {
    let name = e.target.name;
    let value = e.target.value;

    setSubjectMapping((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  // =========================
  // UPDATE MAPPING
  // =========================
  let doEditMapping = () => {
    setButtonDisabled(true);
    setShowForm(false);
    setShowSpinner(true);

    axios({
      url: apiUrl + "/Edit/subjectMapping/" + id,
      method: "put",

      data: {
        session: subjectMapping.session,
        subject: subjectMapping.subject,
        course: subjectMapping.course,
        branch: subjectMapping.branch,
        year: subjectMapping.year,
        semester: subjectMapping.semester,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setShow(true);
        }

        setButtonDisabled(false);
        setShowSpinner(false);
        setShowForm(true);
      })
      .catch((err) => {
        console.error("Error updating Subject Mapping:", err);

        setShowSpinner(false);
        setButtonDisabled(false);
        setShowForm(true);

        alert(
          err.response?.data?.message ||
            "Something went wrong while updating Subject Mapping",
        );
      });
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const handleClose = () => {
    setShow(false);
    navigate("/subjectsmap");
  };

  return (
    <>
      {/* =========================
          FORM
      ========================= */}
      {showForm && (
        <Container className="mt-5">
          <h3 className="text-center mb-4 py-2 text-primary fw-bold">
            EDIT SUBJECT MAPPING
          </h3>

          <hr />

          <Form>
            {/* =========================
                SESSION + SUBJECT
            ========================= */}
            <Row>
              {/* SESSION */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Session</Form.Label>

                  <Form.Select
                    name="session"
                    value={subjectMapping.session}
                    onChange={manageUpdate}
                  >
                    <option value="2024-25">2024-25</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2026-27">2026-27</option>
                    <option value="2027-28">2027-28</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* SUBJECT */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subjects</Form.Label>

                  <Form.Select
                    name="subject"
                    value={subjectMapping.subject}
                    onChange={manageUpdate}
                  >
                    <option value="">Select Subject</option>

                    {subjects.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* =========================
                COURSE + BRANCH
            ========================= */}
            <Row>
              {/* COURSE */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Courses</Form.Label>

                  <Form.Select
                    name="course"
                    value={subjectMapping.course}
                    onChange={manageUpdate}
                  >
                    <option value="">Select Course</option>

                    {courses.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* BRANCH */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Branch</Form.Label>

                  <Form.Select
                    name="branch"
                    value={subjectMapping.branch}
                    onChange={manageUpdate}
                  >
                    <option value="">Select Branch</option>

                    {branchs.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* =========================
                YEAR + SEMESTER
            ========================= */}
            <Row>
              {/* YEAR */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>

                  <Form.Select
                    name="year"
                    value={subjectMapping.year}
                    onChange={manageUpdate}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* SEMESTER */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester</Form.Label>

                  <Form.Select
                    name="semester"
                    value={subjectMapping.semester}
                    onChange={manageUpdate}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* =========================
                BUTTONS
            ========================= */}
            <div className="d-flex gap-3 mt-4 justify-content-center">
              <Button onClick={() => navigate("/subjectsmap")} variant="danger">
                Cancel
              </Button>

              <Button
                onClick={doEditMapping}
                disabled={buttonDisabled}
                variant="success"
              >
                Edit Mapping
              </Button>
            </div>
          </Form>
        </Container>
      )}

      {/* =========================
          SPINNER
      ========================= */}
      {showSpinner && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* =========================
          SUCCESS MODAL
      ========================= */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Subject Mapping Updated Successfully</Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditSubjectMapping;
