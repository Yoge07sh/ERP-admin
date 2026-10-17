import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Modal,
  Spinner,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function AddStudent() {
  let navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate("/students");
  };

  const handleCloseBulkModal = () => {
    setShowBulkModal(false);
  };

  let [courses, setCourses] = useState([]);
  let [branches, setBranches] = useState([]);

  let [buttonDisabled, setButtonDisabled] = useState(false);
  let [showSpinner, setShowSpinner] = useState(false);
  const [sameAsLocal, setSameAsLocal] = useState(false);

  // Upload Excel File
  const [bulkFile, setBulkFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("bulkFile", bulkFile);
    formData.append("course", course);
    formData.append("branch", branch);
    formData.append("section", section);
    formData.append("year", year);
    formData.append("semester", semester);
    formData.append("admissionYear", admissionYear);

    try {
      setUploading(true);
      const res = await axios.post(`${apiUrl}/students/upload`, formData);
      //     headers: { "Content-Type": "multipart/form-data" },
      // });

      alert(res.data.message || "File uploaded successfully");
      setBulkFile(null);
      navigate("/students");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.response?.data?.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSameAsLocal = (e) => {
    const checked = e.target.checked;
    setSameAsLocal(checked);

    if (checked) {
      setPermanentAddressLine1(localAddressLine1);
      setPermanentAddressLine2(localAddressLine2);
      setPermanentCity(localCity);
      setPermanentState(localState);
      setPermanentPincode(localPincode);
    } else {
      setPermanentAddressLine1("");
      setPermanentAddressLine2("");
      setPermanentCity("");
      setPermanentState("");
      setPermanentPincode("");
    }
  };

  let [enrollmentNumber, setEnrollmentNumber] = useState("");
  let [fileNumber, setFileNumber] = useState("");
  let [rollNumber, setRollNumber] = useState("");
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [dob, setDob] = useState("");
  let [gender, setGender] = useState("");
  let [fatherName, setFatherName] = useState("");
  let [motherName, setMotherName] = useState("");
  let [personalEmailId, setPersonalEmailId] = useState("");
  let [collegeEmailId, setCollegeEmailId] = useState("");
  let [mobileNumber, setMobileNumber] = useState("");
  let [emergencyMobNumber, setEmergencyMobNumber] = useState("");

  let [course, setCourse] = useState("");
  let [branch, setBranch] = useState("");
  let [section, setSection] = useState("");

  let [admissionYear, setAdmissionYear] = useState(0);
  let [currentSession, setCurrentSession] = useState("");
  let [year, setYear] = useState(""); // dropdown
  let [semester, setSemester] = useState(""); // dropdown
  let [group, setGroup] = useState(""); // dropdown
  let [file, setFile] = useState("");
  let [localAddressLine1, setLocalAddressLine1] = useState("");
  let [localAddressLine2, setLocalAddressLine2] = useState("");
  let [localCity, setLocalCity] = useState("");
  let [localState, setLocalState] = useState("");
  let [localPincode, setLocalPincode] = useState("");

  let [permanentAddressLine1, setPermanentAddressLine1] = useState("");
  let [permanentAddressLine2, setPermanentAddressLine2] = useState("");
  let [permanentCity, setPermanentCity] = useState("");
  let [permanentState, setPermanentState] = useState("");
  let [permanentPincode, setPermanentPincode] = useState("");

  useEffect(() => {
    axios({
      url: apiUrl + "/courses/for/student",
      method: "get",
    })
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
    if (!course) {
      setBranches([]);
      setBranch("");
      return;
    }

    axios
      .get(`${apiUrl}/branches/for/student`, {
        params: {
          courseId: course,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setBranches(res.data.data);

          // No branches for this course
          if (res.data.data.length === 0) {
            setBranch("");
          }
        } else {
          setBranches([]);
          setBranch("");
        }
      })
      .catch((err) => {
        console.error("Error fetching Branches:", err);
        setBranches([]);
        setBranch("");
      });
  }, [course]);

  let doAddStudent = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    setShowSpinner(true);

    let formData = new FormData();
    formData.append("enrollmentNumber", enrollmentNumber);
    formData.append("fileNumber", fileNumber);
    formData.append("rollNumber", rollNumber);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("fatherName", fatherName);
    formData.append("motherName", motherName);
    formData.append("personalEmailId", personalEmailId);
    formData.append("collegeEmailId", collegeEmailId);
    formData.append("mobileNumber", mobileNumber);
    formData.append("emergencyMobNumber", emergencyMobNumber);

    formData.append("course", course);
    formData.append("branch", branch);
    formData.append("section", section);

    formData.append("admissionYear", admissionYear);
    formData.append("currentSession", currentSession);
    formData.append("year", year);
    formData.append("semester", semester);
    formData.append("group", group);
    if (file) {
      formData.append("file", file);
    }
    formData.append("filename", file.name);

    formData.append("localAddressLine1", localAddressLine1);
    formData.append("localAddressLine2", localAddressLine2);
    formData.append("localCity", localCity);
    formData.append("localState", localState);
    formData.append("localPincode", localPincode);

    formData.append("permanentAddressLine1", permanentAddressLine1);
    formData.append("permanentAddressLine2", permanentAddressLine2);
    formData.append("permanentCity", permanentCity);
    formData.append("permanentState", permanentState);
    formData.append("permanentPincode", permanentPincode);

    axios({
      url: `${apiUrl}/add/student`,
      method: "post",
      data: formData,
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          setButtonDisabled(false);
          setShowSpinner(false);
          setShow(true);

          //reset
          setEnrollmentNumber("");
          setFileNumber("");
          setRollNumber("");
          setFirstName("");
          setLastName("");
          setDob("");
          setGender("");
          setFatherName("");
          setMotherName("");
          setPersonalEmailId("");
          setCollegeEmailId("");
          setMobileNumber("");
          setEmergencyMobNumber("");
          setCourse("");
          setBranch("");
          setSection("");
          setAdmissionYear("");
          setCurrentSession("");
          setYear("");
          setSemester("");
          setGroup("");
          setFile("");
          setLocalAddressLine1("");
          setLocalAddressLine2("");
          setLocalCity("");
          setLocalState("");
          setLocalPincode("");
          setPermanentAddressLine1("");
          setPermanentAddressLine2("");
          setPermanentCity("");
          setPermanentState("");
          setPermanentPincode("");

          setSameAsLocal(false);
          //navigate('/students');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <h4 className="text-center mb-4 py-2 text-primary fw-bold">
        ADD NEW STUDENT
      </h4>
      <hr />

      <div className=" mb-5">
        <Button
          className="w-full p-2 rounded"
          onClick={() => setShowBulkModal(true)}
        >
          📂 Add Students through CSV/Excel files
        </Button>
        <p className="text-gray-400">
          *Make sure Excel column names match student schema fields (e.g.,
          firstName, lastName, rollNumber, image, etc.).
        </p>
      </div>

      <Form onSubmit={doAddStudent}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Enrollment Number :-</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter enrollment number"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>File Number :-</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter file number"
                value={fileNumber}
                onChange={(e) => setFileNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Roll Number :-</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter roll number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>First Name :-</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name :-</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth :-</Form.Label>
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Gender :-</Form.Label>
              <Form.Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Father's Name :-</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter father's name"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Mother's Name :-</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter mother's name"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Emails and Contact */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Personal Email :-</Form.Label>
              <Form.Control
                type="email"
                value={personalEmailId}
                onChange={(e) => setPersonalEmailId(e.target.value)}
                placeholder="example@gamil.com"
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>College Email :-</Form.Label>
              <Form.Control
                type="email"
                value={collegeEmailId}
                onChange={(e) => setCollegeEmailId(e.target.value)}
                placeholder="example@rdec.in"
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number :-</Form.Label>
              <Form.Control
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
              />
            </Form.Group>
          </Col>
        </Row>

        {/*------------------- This Row Data was also used by bulkFile upload for selection of fields. */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Select Course :-</Form.Label>
              <Form.Select
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setBranch("");
                }}
                required
              >
                <option value="">Select</option>

                {courses.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            {course && branches.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Select Branch :-</Form.Label>

                <Form.Select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                >
                  <option value="">Select</option>

                  {branches.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Select Section</Form.Label>
              <Form.Select
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {/* ---------------------------------------------------- */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Emergency Number :-</Form.Label>
              <Form.Control
                type="text"
                value={emergencyMobNumber}
                onChange={(e) => setEmergencyMobNumber(e.target.value)}
                placeholder="Enter emergency mobile number"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Admission Year :-</Form.Label>
              <Form.Control
                type="number"
                value={admissionYear}
                onChange={(e) => setAdmissionYear(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Current Session :-</Form.Label>
              <Form.Control
                type="text"
                value={currentSession}
                onChange={(e) => setCurrentSession(e.target.value)}
                placeholder="eg:2020"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Year :-</Form.Label>
              <Form.Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Semester :-</Form.Label>
              <Form.Select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
                <option value="5">5th</option>
                <option value="6">6th</option>
                <option value="7">7th</option>
                <option value="8">8th</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Group :-</Form.Label>
              <Form.Select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="All">All</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Local Address */}
        <div className="p-3 mb-4 border rounded">
          <h5 className="mt-4 text-primary">Local Address :-</h5>
          <Row>
            <Col md={4}>
              <Form.Control
                name="LocalAddressLine1"
                placeholder="Address Line 1"
                value={localAddressLine1}
                onChange={(e) => setLocalAddressLine1(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                name="LocalAddressLine2"
                placeholder="Address Line 2"
                value={localAddressLine2}
                onChange={(e) => setLocalAddressLine2(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                name="LocalCity"
                placeholder="City"
                value={localCity}
                onChange={(e) => setLocalCity(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={4}>
              <Form.Control
                name="LocalState"
                placeholder="State"
                value={localState}
                onChange={(e) => setLocalState(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                name="LocalPincode"
                placeholder="Pincode"
                value={localPincode}
                onChange={(e) => setLocalPincode(e.target.value)}
              />
            </Col>
          </Row>
        </div>

        {/* Checkbox for copying address */}
        <Form.Check
          type="checkbox"
          label="Permanent Address same as Local Address"
          checked={sameAsLocal}
          onChange={handleSameAsLocal}
        />

        {/* Permanent Address */}
        <div className="p-3 mb-4 border rounded">
          <h5 className="mt-4 text-primary">Permanent Address :-</h5>
          <Row>
            <Col md={4}>
              <Form.Control
                name="PermanentAddressLine1"
                placeholder="Address Line 1"
                value={permanentAddressLine1}
                onChange={(e) => setPermanentAddressLine1(e.target.value)}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                name="PermanentAddressLine2"
                placeholder="Address Line 2"
                value={permanentAddressLine2}
                onChange={(e) => setPermanentAddressLine2(e.target.value)}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                name="PermanentCity"
                placeholder="City"
                value={permanentCity}
                onChange={(e) => setPermanentCity(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={4}>
              <Form.Control
                name="PermanentState"
                placeholder="State"
                value={permanentState}
                onChange={(e) => setPermanentState(e.target.value)}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                name="PermanentPincode"
                placeholder="Pincode"
                value={permanentPincode}
                onChange={(e) => setPermanentPincode(e.target.value)}
              />
            </Col>
          </Row>
        </div>

        {/* File Upload and Submit */}
        <Row className="mt-4">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Student Image :-</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button
            onClick={() => navigate("/students")}
            className="me-2"
            variant="danger"
          >
            Cancel
          </Button>
          <Button variant="success" disabled={buttonDisabled} type="submit">
            Add Student
          </Button>
        </div>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Student has been saved successfully...</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Bulk Upload of Students Details */}

      <Modal size="lg" show={showBulkModal} onHide={handleCloseBulkModal}>
        <Modal.Header closeButton>
          <Modal.Title>📂 Bulk Upload Students</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleBulkUpload}>
          {" "}
          {/* <-- Form starts here */}
          <Modal.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Admission Year :-</Form.Label>
                  <Form.Control
                    type="number"
                    value={admissionYear}
                    onChange={(e) => setAdmissionYear(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Course :-</Form.Label>
                  <Form.Select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {courses.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Branch :-</Form.Label>
                  <Form.Select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {branches.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Section :-</Form.Label>
                  <Form.Select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Year :-</Form.Label>
                  <Form.Select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester :-</Form.Label>
                  <Form.Select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                    <option value="5">5th</option>
                    <option value="6">6th</option>
                    <option value="7">7th</option>
                    <option value="8">8th</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Card className="m-5 mb-0 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Upload Excel or CSV File</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => setBulkFile(e.target.files[0])}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Text className="text-muted">
                  Make sure Excel column names match student schema fields.
                </Form.Text>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseBulkModal}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {showSpinner && <Spinner animation="border" />}
    </Container>
  );
}

export default AddStudent;
