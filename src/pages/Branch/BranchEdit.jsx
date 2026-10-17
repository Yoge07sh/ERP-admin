import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const apiUrl = import.meta.env.VITE_API_URL;

function BranchEdit() {
  let [course, setCourse] = useState([]);

  let navigate = useNavigate();
  let params = useParams();
  let [branch, setBranch] = useState({});
  let [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate("/branches");
  };

  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setBranch((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function doEditBranch(id) {
    const token = localStorage.getItem("token");

    axios({
      url: apiUrl + "/edit/branch/" + id,
      method: "put",
      data: branch,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err.response?.data || err);
      });
  }

  useEffect(() => {
    axios({
      url: apiUrl + "/branch/" + params.id,
      method: "get",
    })
      .then((result) => {
        setBranch(result.data.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [params.id]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/courses/for/branch`)
      .then((res) => {
        if (res.data.success) {
          setCourse(res.data.data);
        } else {
          alert("Failed to load Branch.");
        }
      })
      .catch((err) => {
        console.error("Error fetching Branches:", err);
      });
  }, []);

  return (
    <Container className="">
      <Form>
        <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">
          UPDATE BRANCH
        </h3>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Select Course :-</Form.Label>
            <Form.Select
              value={branch.course}
              onChange={handleChange}
              name="course"
            >
              {course.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Branch Code :-</Form.Label>
            <Form.Control
              type="text"
              value={branch.branchCode}
              onChange={handleChange}
              name="branchCode"
              placeholder="eg: CSE101"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Branch Short Name :-</Form.Label>
            <Form.Control
              type="text"
              value={branch.branchShortName}
              onChange={handleChange}
              name="branchShortName"
              placeholder="eg: CSE"
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Branch Full Name :-</Form.Label>
            <Form.Control
              type="text"
              value={branch.branchFullName}
              onChange={handleChange}
              name="branchFullName"
              placeholder="eg: Computer Science and Engineering"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Total Intake :-</Form.Label>
            <Form.Control
              type="number"
              value={branch.branchIntake}
              onChange={handleChange}
              name="branchIntake"
              placeholder="eg: 60"
            />
          </Form.Group>
        </Row>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            onClick={() => navigate("/branches")}
            variant="danger"
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => doEditBranch(branch._id)}
            variant="success"
            type="button"
          >
            Edit Branch
          </Button>
        </div>
      </Form>

      {/* ---------Modal code ------------- */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Branch Updated successfully👍</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BranchEdit;
