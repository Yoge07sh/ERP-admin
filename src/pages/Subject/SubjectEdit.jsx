import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const apiUrl = import.meta.env.VITE_API_URL;

function SubjectEdit() {
  let navigate = useNavigate();
  let params = useParams();
  let [subject, setSubject] = useState("");
  let [show, setShow] = useState(false);
  let [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleClose = () => {
    setShow(false);
    navigate("/subjects");
  };

  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setSubject((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function doEditSubject(id) {
    axios({
      url: apiUrl + "/edit/subject/" + id,
      method: "put",
      data: subject,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setMessage("Subject Updated successfully");
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    axios({
      url: apiUrl + "/subject/" + params.id,
      method: "get",
    })
      .then((result) => {
        setSubject(result.data.data);
      })
      .catch(() => {});
  }, [params]);

  return (
    <>
      <Container className="mt-5">
        <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">
          UPDATE SUBJECT
        </h3>

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Subject Code :-</Form.Label>
                <Form.Control
                  type="text"
                  value={subject.subjectCode}
                  onChange={handleChange}
                  name="subjectCode"
                  placeholder="eg: BMC101"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Subject Full Name :-</Form.Label>
                <Form.Control
                  type="text"
                  value={subject.subjectFullName}
                  onChange={handleChange}
                  name="subjectFullName"
                  placeholder="eg: javaScript."
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
                  value={subject.subjectNickName}
                  onChange={handleChange}
                  name="subjectNickName"
                  placeholder="eg: js"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Subject Category :-</Form.Label>
                <Form.Select
                  value={subject.subjectCategory}
                  onChange={handleChange}
                  name="subjectCategory"
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
                  value={subject.subjectType}
                  onChange={handleChange}
                  name="subjectType"
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
                  value={subject.creditScore}
                  onChange={handleChange}
                  name="creditScore"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-3 mt-4 justify-content-center">
            <Button
              onClick={() => navigate("/subjects")}
              variant="danger"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => doEditSubject(subject._id)}
              variant="success"
            >
              Edit Subject
            </Button>
          </div>
        </Form>
      </Container>

      {/* {showSpinner && (<div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>)} */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SubjectEdit;
