import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const apiUrl = import.meta.env.VITE_API_URL;

function StudentEdit() {
  const [student, setStudent] = useState({});
  const [file, setFile] = useState(null);

  const [show, setShow] = useState(false);
  const [sameAsLocal, setSameAsLocal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  /*
   * Close success modal
   */
  const handleClose = () => {
    setShow(false);
    navigate("/students");
  };

  /*
   * Handle all normal form fields
   */
  function handleChange(e) {
    const { name, value } = e.target;

    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));

    /*
     * If "Permanent Address same as Local Address" is checked,
     * keep permanent address synchronized with local address.
     */
    if (
      sameAsLocal &&
      [
        "localAddressLine1",
        "localAddressLine2",
        "localCity",
        "localState",
        "localPincode",
      ].includes(name)
    ) {
      const permanentFieldMap = {
        localAddressLine1: "permanentAddressLine1",
        localAddressLine2: "permanentAddressLine2",
        localCity: "permanentCity",
        localState: "permanentState",
        localPincode: "permanentPincode",
      };

      setStudent((prev) => ({
        ...prev,
        [permanentFieldMap[name]]: value,
      }));
    }
  }

  /*
   * Handle image selection
   */
  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  }

  /*
   * Copy local address to permanent address
   */
  function handleSameAsLocal(e) {
    const checked = e.target.checked;

    setSameAsLocal(checked);

    if (checked) {
      setStudent((prev) => ({
        ...prev,

        permanentAddressLine1: prev.localAddressLine1 || "",
        permanentAddressLine2: prev.localAddressLine2 || "",
        permanentCity: prev.localCity || "",
        permanentState: prev.localState || "",
        permanentPincode: prev.localPincode || "",
      }));
    }
  }

  /*
   * Update student
   */
  async function doEditStudent(id, e) {
    /*
     * Prevent browser form submission.
     */
    if (e) {
      e.preventDefault();
    }

    if (!id) {
      setError("Student ID is missing.");
      return;
    }

    setShowSpinner(true);
    setError("");

    try {
      /*
       * Use FormData because the form supports image upload.
       *
       * If your backend expects JSON even when no image is uploaded,
       * you can replace this with `data: student`.
       */
      const formData = new FormData();

      Object.keys(student).forEach((key) => {
        /*
         * Do not send undefined/null values.
         */
        if (student[key] !== undefined && student[key] !== null) {
          formData.append(key, student[key]);
        }
      });

      /*
       * Only append a new image if the user selected one.
       */
      if (file) {
        formData.append("studentImage", file);
      }

      const result = await axios({
        url: apiUrl + "/edit/student/" + id,
        method: "put",
        data: formData,
      });

      if (result.data.success) {
        setShow(true);
      } else {
        setError(result.data.message || "Student could not be updated.");
      }
    } catch (err) {
      console.error("Error updating student:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while updating the student.",
      );
    } finally {
      setShowSpinner(false);
    }
  }

  /*
   * Load student details
   */
  useEffect(() => {
    let isMounted = true;

    async function getStudent() {
      setShowSpinner(true);
      setError("");

      try {
        const result = await axios({
          url: apiUrl + "/student/" + params.id,
          method: "get",
        });

        if (!isMounted) return;

        const studentData = result.data?.data || {};

        setStudent(studentData);

        /*
         * Automatically check the checkbox when local and permanent
         * addresses are already identical.
         */
        const addressesAreSame =
          (studentData.localAddressLine1 || "") ===
            (studentData.permanentAddressLine1 || "") &&
          (studentData.localAddressLine2 || "") ===
            (studentData.permanentAddressLine2 || "") &&
          (studentData.localCity || "") === (studentData.permanentCity || "") &&
          (studentData.localState || "") ===
            (studentData.permanentState || "") &&
          (studentData.localPincode || "") ===
            (studentData.permanentPincode || "");

        /*
         * Only mark it as same if there is actually a local address.
         */
        const hasLocalAddress =
          studentData.localAddressLine1 ||
          studentData.localAddressLine2 ||
          studentData.localCity ||
          studentData.localState ||
          studentData.localPincode;

        setSameAsLocal(Boolean(addressesAreSame && hasLocalAddress));
      } catch (err) {
        console.error("Error loading student:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message || "Unable to load student details.",
          );
        }
      } finally {
        if (isMounted) {
          setShowSpinner(false);
        }
      }
    }

    if (params.id) {
      getStudent();
    } else {
      setError("Student ID is missing.");
    }

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <>
      <Container className="py-3">
        <h4 className="text-center mb-4 py-2 text-white fw-bold bg-black">
          UPDATE STUDENT
        </h4>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Form onSubmit={(e) => doEditStudent(student._id, e)}>
          {/* =========================
              BASIC INFORMATION
          ========================== */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Enrollment Number :-</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter enrollment number"
                  value={student.enrollmentNumber || ""}
                  onChange={handleChange}
                  name="enrollmentNumber"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>File Number :-</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter file number"
                  value={student.fileNumber || ""}
                  onChange={handleChange}
                  name="fileNumber"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Roll Number :-</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter roll number"
                  value={student.rollNumber || ""}
                  onChange={handleChange}
                  name="rollNumber"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* =========================
              NAME / DOB
          ========================== */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>First Name :-</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={student.firstName || ""}
                  onChange={handleChange}
                  name="firstName"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name :-</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={student.lastName || ""}
                  onChange={handleChange}
                  name="lastName"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Date of Birth :-</Form.Label>
                <Form.Control
                  type="date"
                  value={student.dob ? student.dob.split("T")[0] : ""}
                  onChange={handleChange}
                  name="dob"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* =========================
              PERSONAL INFORMATION
          ========================== */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Gender :-</Form.Label>

                <Form.Select
                  value={student.gender || ""}
                  onChange={handleChange}
                  name="gender"
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
                  value={student.fatherName || ""}
                  onChange={handleChange}
                  name="fatherName"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Mother's Name :-</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter mother's name"
                  value={student.motherName || ""}
                  onChange={handleChange}
                  name="motherName"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* =========================
              EMAIL / CONTACT
          ========================== */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Personal Email :-</Form.Label>
                <Form.Control
                  type="email"
                  value={student.personalEmailId || ""}
                  onChange={handleChange}
                  name="personalEmailId"
                  placeholder="example@gmail.com"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>College Email :-</Form.Label>
                <Form.Control
                  type="email"
                  value={student.collegeEmailId || ""}
                  onChange={handleChange}
                  name="collegeEmailId"
                  placeholder="example@rdec.in"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number :-</Form.Label>
                <Form.Control
                  type="text"
                  value={student.mobileNumber || ""}
                  onChange={handleChange}
                  name="mobileNumber"
                  placeholder="Enter mobile number"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* =========================
              ADMISSION INFORMATION
          ========================== */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Emergency Number :-</Form.Label>
                <Form.Control
                  type="text"
                  value={student.emergencyMobNumber || ""}
                  onChange={handleChange}
                  name="emergencyMobNumber"
                  placeholder="Enter emergency mobile number"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Admission Year :-</Form.Label>
                <Form.Control
                  type="number"
                  value={student.admissionYear || ""}
                  onChange={handleChange}
                  name="admissionYear"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Current Session :-</Form.Label>
                <Form.Control
                  type="text"
                  value={student.currentSession || ""}
                  onChange={handleChange}
                  name="currentSession"
                  placeholder="eg: 2020"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* =========================
              ACADEMIC INFORMATION
          ========================== */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Year :-</Form.Label>

                <Form.Select
                  value={student.year || ""}
                  onChange={handleChange}
                  name="year"
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
                  value={student.semester || ""}
                  onChange={handleChange}
                  name="semester"
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
                  value={student.group || ""}
                  onChange={handleChange}
                  name="group"
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

          {/* =========================
              LOCAL ADDRESS
          ========================== */}
          <div className="p-3 mb-4 border rounded">
            <h5 className="mt-2 text-primary">Local Address :-</h5>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Address Line 1 :-</Form.Label>
                  <Form.Control
                    name="localAddressLine1"
                    placeholder="Address Line 1"
                    value={student.localAddressLine1 || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Address Line 2 :-</Form.Label>
                  <Form.Control
                    name="localAddressLine2"
                    placeholder="Address Line 2"
                    value={student.localAddressLine2 || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>City :-</Form.Label>
                  <Form.Control
                    name="localCity"
                    placeholder="City"
                    value={student.localCity || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>State :-</Form.Label>
                  <Form.Control
                    name="localState"
                    placeholder="State"
                    value={student.localState || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Pincode :-</Form.Label>
                  <Form.Control
                    name="localPincode"
                    placeholder="Pincode"
                    value={student.localPincode || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* =========================
              SAME ADDRESS CHECKBOX
          ========================== */}
          <Form.Check
            type="checkbox"
            label="Permanent Address same as Local Address"
            checked={sameAsLocal}
            onChange={handleSameAsLocal}
            className="mb-3"
          />

          {/* =========================
              PERMANENT ADDRESS
          ========================== */}
          <div className="p-3 mb-4 border rounded">
            <h5 className="mt-2 text-primary">Permanent Address :-</h5>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Address Line 1 :-</Form.Label>
                  <Form.Control
                    name="permanentAddressLine1"
                    placeholder="Address Line 1"
                    value={student.permanentAddressLine1 || ""}
                    onChange={handleChange}
                    disabled={sameAsLocal}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>Address Line 2 :-</Form.Label>
                  <Form.Control
                    name="permanentAddressLine2"
                    placeholder="Address Line 2"
                    value={student.permanentAddressLine2 || ""}
                    onChange={handleChange}
                    disabled={sameAsLocal}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>City :-</Form.Label>
                  <Form.Control
                    name="permanentCity"
                    placeholder="City"
                    value={student.permanentCity || ""}
                    onChange={handleChange}
                    disabled={sameAsLocal}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>State :-</Form.Label>
                  <Form.Control
                    name="permanentState"
                    placeholder="State"
                    value={student.permanentState || ""}
                    onChange={handleChange}
                    disabled={sameAsLocal}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Pincode :-</Form.Label>
                  <Form.Control
                    name="permanentPincode"
                    placeholder="Pincode"
                    value={student.permanentPincode || ""}
                    onChange={handleChange}
                    disabled={sameAsLocal}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* =========================
              IMAGE UPLOAD
          ========================== */}
          <Row className="mt-4">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Student Image :-</Form.Label>

                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {file && (
                  <Form.Text className="text-muted">
                    Selected: {file.name}
                  </Form.Text>
                )}

                {!file && student.image && (
                  <Form.Text className="text-muted">
                    Existing image will be kept unless a new image is selected.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* =========================
              BUTTONS
          ========================== */}
          <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
            <Button
              onClick={() => navigate("/students")}
              variant="danger"
              type="button"
              disabled={showSpinner}
            >
              Cancel
            </Button>

            <Button variant="success" type="submit" disabled={showSpinner}>
              {showSpinner ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Updating...
                </>
              ) : (
                "Edit Student"
              )}
            </Button>
          </div>
        </Form>

        {/* =========================
            SUCCESS MODAL
        ========================== */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Success </Modal.Title>
          </Modal.Header>

          <Modal.Body>Student has been updated successfully 👍</Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default StudentEdit;
