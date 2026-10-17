import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Spinner,
  Card,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

function AddSubject() {
  let navigate = useNavigate();

  const [show, setShow] = useState(false);
  let [showForm, SetShowForm] = useState(true);
  let [showSpinner, setShowSpinner] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(false);
  let [subjectCode, setSubjectCode] = useState("");
  let [subjectFullName, setSubjectFullName] = useState("");
  let [subjectNickName, setSubjectNickName] = useState("");
  let [subjectCategory, setSubjectCategory] = useState("theory");
  let [subjectType, setSubjectType] = useState("regular");
  let [creditScore, setCreditScore] = useState();

  const token = localStorage.getItem("token");

  let doAddSubject = () => {
    setButtonDisabled(true);
    SetShowForm(false);
    setShowSpinner(true);
    axios({
      url: apiUrl+"/add/subject",
      method: "post",
      data: {
        subjectCode,
        subjectFullName,
        subjectNickName,
        subjectCategory,
        subjectType,
        creditScore,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        if (result.data.success) setButtonDisabled(false);
        setShow(true);
        setShowSpinner(false);
        SetShowForm(true);
      })
      .catch((err) => {
        setShowSpinner(false);
        setButtonDisabled(false);
        SetShowForm(true);
        console.log(err.message);
        alert("Hello" + err);
      });
  };

  const handleClose = () => {
    setShow(false);
    navigate("/subjects");
  };

  return (
    <>
      {showForm && (
        <Container className="mt-5">
          <h3 className="text-center mb-4 py-2 text-primary fw-bold ">
            ADD NEW SUBJECT
          </h3>
          <hr />

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Code :-</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="eg: BMC101"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Full Name :-</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setSubjectFullName(e.target.value)}
                    placeholder="eg: javaScript."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Nick Name :-</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setSubjectNickName(e.target.value)}
                    placeholder="eg: js"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Category :-</Form.Label>
                  <Form.Select
                    onChange={(e) => setSubjectCategory(e.target.value)}
                    required
                  >
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject Type :-</Form.Label>
                  <Form.Select
                    onChange={(e) => setSubjectType(e.target.value)}
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="elective">Elective</option>
                    <option value="combined">Combined</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Credit Score :-</Form.Label>
                  <Form.Select
                    onChange={(e) => setCreditScore(e.target.value)}
                    required
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-center gap-2 mt-4">
              <Button
                onClick={() => navigate("/subjects")}
                variant="danger"
                type="button"
              >
                Cancel
              </Button>
              <Button
                onClick={doAddSubject}
                disabled={buttonDisabled}
                variant="success"
                type="submit"
              >
                Add Subject
              </Button>
            </div>
          </Form>
        </Container>
      )}
      {showSpinner && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Subject added successfully</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddSubject;
