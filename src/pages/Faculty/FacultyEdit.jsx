import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const apiUrl = import.meta.env.VITE_API_URL;
function FacultyEdit() {
  let navigate = useNavigate();
  let params = useParams();
  let [faculty, setFaculty] = useState({});
  let [show, setShow] = useState(false);
  // let [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate("/faculties");
  };

  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setFaculty((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function doEditFaculty(id) {
    axios({
      url: apiUrl+"/edit/faculty/" + id,
      method: "put",
      data: faculty,
    })
      .then((result) => {
        if (result.data.success) {
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios({
      url: apiUrl+"/faculty/" + params.id,
      method: "get",
    })
      .then((result) => {
        setFaculty(result.data.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [params]);
  return (
    <Container className="">
      <Form>
        <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">
          UPDATE FACULTY
        </h3>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={faculty.firstName}
              onChange={handleChange}
              name="firstName"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={faculty.lastName}
              onChange={handleChange}
              name="lastName"
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Personal Email</Form.Label>
            <Form.Control
              type="text"
              value={faculty.personalEmail}
              onChange={handleChange}
              name="personalEmail"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>CollegeId</Form.Label>
            <Form.Control
              type="text"
              value={faculty.collegeId}
              onChange={handleChange}
              name="collegeId"
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Mobile No.</Form.Label>
            <Form.Control
              type="number"
              value={faculty.mobileNo}
              onChange={handleChange}
              name="mobileNo"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Emergency Mobile No.</Form.Label>
            <Form.Control
              type="number"
              value={faculty.emergencyMobileNo}
              onChange={handleChange}
              name="emergencyMobileNo"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Mother's Name</Form.Label>
            <Form.Control
              type="text"
              value={faculty.motherName}
              onChange={handleChange}
              name="motherName"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Father's Name</Form.Label>
            <Form.Control
              type="text"
              value={faculty.fatherName}
              onChange={handleChange}
              name="fatherName"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              aria-label="gender"
              onChange={handleChange}
              name="gender"
              value={faculty.gender}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Married Status</Form.Label>
            <Form.Select
              aria-label="MarriedStatus"
              onChange={handleChange}
              name="marriedStatus"
              value={faculty.marriedStatus}
            >
              <option value="not married">Not Married</option>
              <option value="married">Married</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group className="mb-3" as={Col}>
            <Form.Label>Date Of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              onChange={handleChange}
              value={faculty.dob ? faculty.dob.split("T")[0] : ""}
            />
          </Form.Group>
          <Form.Group className="mb-3" as={Col} >
            <Form.Label>Thumb Id</Form.Label>
            <Form.Control
              type="text"
              name="thumbId"
              value={faculty.thumbId}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>College Email</Form.Label>
            <Form.Control
              type="text"
              value={faculty.collegeEmail}
              onChange={handleChange}
              name="collegeEmail"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Designation</Form.Label>
            <Form.Control
              type="text"
              value={faculty.designation}
              onChange={handleChange}
              name="designation"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Highest Qualification</Form.Label>
            <Form.Control
              type="text"
              value={faculty.highestQualification}
              onChange={handleChange}
              name="highestQualification"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Total Experience</Form.Label>
            <Form.Control
              type="number"
              value={faculty.totalExperience}
              onChange={handleChange}
              name="totalExperience"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Teaching Experience</Form.Label>
            <Form.Control
              type="number"
              value={faculty.teachingExperience}
              onChange={handleChange}
              name="teachingExperience"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Industry Experience</Form.Label>
            <Form.Control
              type="number"
              value={faculty.industryExperience}
              onChange={handleChange}
              name="industryExperience"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Research Experience</Form.Label>
            <Form.Control
              type="number"
              value={faculty.researchExperience}
              onChange={handleChange}
              name="researchExperience"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3"></Row>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            onClick={() => navigate("/faculties")}
            variant="danger"
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={() => doEditFaculty(faculty._id)} variant="success">
            Edit Faculty
          </Button>
        </div>
      </Form>

      {/* ---------Modal code ------------- */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Faculty Updated successfully👍</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FacultyEdit;
