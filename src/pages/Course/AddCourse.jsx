import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import universityData from "../../assets/universities.json";

import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const apiUrl = import.meta.env.VITE_API_URL
function AddCourse() {
  let navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  let [buttonDisabled, setButtonDisabled] = useState(false);

  let [courseCode, setCourseCode] = useState("");
  let [courseFullName, setCourseFullName] = useState("");
  let [courseShortName, setCourseShortName] = useState("");
  let [affiliatedUniversity, setAffiliatedUniversity] = useState("");
  let [totalIntake, setTotalIntake] = useState(60);
  const token = localStorage.getItem("token");
  const doAddCourse = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    try {
      const res = await axios.post(
        `${apiUrl}/add/course`,
        {
          courseCode,
          courseFullName,
          courseShortName,
          affiliatedUniversity,
          totalIntake: Number(totalIntake),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ); // JSON payload

      setShow(true);

      // reset form
      setCourseCode("");
      setCourseFullName("");
      setCourseShortName("");
      setAffiliatedUniversity("");
      setTotalIntake(60);
    } catch (err) {
      console.log(err.response?.data || err);
      // alert('Failed to add course');
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <Container className="">
      <Form>
        <h3 className="text-center mb-4 py-2 text-primary fw-bold ">
          ADD NEW COURSE
        </h3>
        <hr />
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Course Code :-</Form.Label>
            <Form.Control
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="eg: BMC101"
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Course Short Name :-</Form.Label>
            <Form.Control
              type="text"
              value={courseShortName}
              onChange={(e) => setCourseShortName(e.target.value)}
              placeholder="eg: B.Tech"
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Course Full Name :-</Form.Label>
            <Form.Control
              type="text"
              value={courseFullName}
              onChange={(e) => setCourseFullName(e.target.value)}
              placeholder="eg: Bachelor of Technology"
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Total Intake :-</Form.Label>
            <Form.Control
              type="number"
              value={totalIntake}
              onChange={(e) => setTotalIntake(e.target.value)}
              placeholder="eg:60"
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Affiliated University :-</Form.Label>
            <Form.Select
              value={affiliatedUniversity}
              onChange={(e) => setAffiliatedUniversity(e.target.value)}
              required
            >
              <option value="">-- Select University --</option>
              {universityData.map((uni) => (
                <option key={uni.id} value={uni.name}>
                  {uni.name}, {uni.location}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <div className="d-flex justify-content-center gap-2 mt-4 ">
          <Button
            variant="danger"
            onClick={() => navigate("/courses")}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={doAddCourse}
            disabled={buttonDisabled}
            type="submit"
          >
            Add Course
          </Button>
        </div>
      </Form>

      {/* ---------Modal code ------------- */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Course Added successfully👍</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddCourse;
