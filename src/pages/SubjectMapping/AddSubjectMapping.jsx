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
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function SubjectMapping() {
  let navigate = useNavigate();

  let [subjects, setSubjects] = useState([]);
  let [courses, setCourses] = useState([]);
  let [branchs, setBranchs] = useState([]);

  const [show, setShow] = useState(false);

  let [showForm, SetShowForm] = useState(true);
  let [showSpinner, setShowSpinner] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(false);

  let [session, setSession] = useState("");
  let [subject, setSubject] = useState("");
  let [course, setCourse] = useState("");
  let [branch, setBranch] = useState("");
  let [year, setYear] = useState("1");
  let [semester, setSemester] = useState("1");

  const token = localStorage.getItem("token");

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
  // ADD SUBJECT MAPPING
  // =========================
  let doAddMapping = () => {
    setButtonDisabled(true);
    SetShowForm(false);
    setShowSpinner(true);

    axios({
      url: apiUrl + "/add/subjectMapping",
      method: "post",

      data: {
        session,
        subject,
        course,
        branch,
        year,
        semester,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setButtonDisabled(false);
          setShow(true);
          setShowSpinner(false);
          SetShowForm(true);
        }
      })
      .catch((err) => {
        console.error("Error adding Subject Mapping:", err);

        setShowSpinner(false);
        setButtonDisabled(false);
        SetShowForm(true);

        alert(
          err.response?.data?.message ||
            "Something went wrong while adding Subject Mapping",
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
    <Container className="mt-4">
      {/* =========================
          FORM
      ========================= */}
      {showForm && (
        <>
          <h3 className="mb-4 text-danger text-center">ADD SUBJECT MAPPING</h3>

          <Row>
            {/* SESSION */}
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Session</Form.Label>

                <Form.Select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                >
                  <option value="">Select Session</option>
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* SUBJECT */}
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Subject</Form.Label>

                <Form.Select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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

            {/* COURSE */}
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Course</Form.Label>

                <Form.Select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
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
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Branch</Form.Label>

                <Form.Select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
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

            {/* YEAR */}
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Year</Form.Label>

                <Form.Select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* SEMESTER */}
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Semester</Form.Label>

                <Form.Select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
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
              BUTTON
          ========================= */}
          <Button
            variant="primary"
            onClick={doAddMapping}
            disabled={buttonDisabled}
          >
            Add Subject Mapping
          </Button>
        </>
      )}

      {/* =========================
          SPINNER
      ========================= */}
      {showSpinner && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
          <p className="mt-2">Saving Subject Mapping...</p>
        </div>
      )}

      {/* =========================
          SUCCESS MODAL
      ========================= */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Subject Mapping added successfully.</Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SubjectMapping;
