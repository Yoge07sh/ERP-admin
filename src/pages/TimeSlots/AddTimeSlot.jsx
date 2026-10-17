import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const apiUrl = import.meta.env.VITE_API_URL;

function AddTimeSlot() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [show, setShow] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [session, setSession] = useState("");
  const [lectureNo, setLectureNo] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const handleClose = () => {
    setShow(false);
  };

  const sessions = ["2026-27", "2027-28", "2028-29"];

  const lectureNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const handleTimeSlot = (e) => {
    setTimeSlot(e.target.value);
  };

  const doAddTimeSlot = async (e) => {
    e.preventDefault();
    const timeSlotRegex =
      /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeSlotRegex.test(timeSlot)) {
      alert("Time slot must be in HH:MM-HH:MM format.");
      return;
    }

    setButtonDisabled(true);

    try {
      const res = await axios.post(
        `${apiUrl}/add/timeslots`,
        {
          session,
          lectureNo: Number(lectureNo),
          timeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(res.data);

      setShow(true);

      setSession("");
      setLectureNo("");
      setTimeSlot("");
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Failed to add time slot.");
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={doAddTimeSlot}>
        <h3 className="text-center mb-4 py-2 text-primary fw-bold">
          ADD NEW TIME SLOT
        </h3>

        <hr />

        <Row className="mb-3">
          <Form.Group as={Col} controlId="session">
            <Form.Label>Session :-</Form.Label>

            <Form.Select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              required
            >
              <option value="">-- Select Session --</option>

              {sessions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="lectureNo">
            <Form.Label>Lecture No :-</Form.Label>

            <Form.Select
              value={lectureNo}
              onChange={(e) => setLectureNo(e.target.value)}
              required
            >
              <option value="">-- Select Lecture No. --</option>

              {lectureNumbers.map((number) => (
                <option key={number} value={number}>
                  Lecture {number}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <Form.Label>Enter Time slot :-</Form.Label>
            <Form.Control
              type="text"
              placeholder="Format 00:00-00:00"
              maxlength="11"
              value={timeSlot}
              onChange={handleTimeSlot}
            ></Form.Control>
          </Form.Group>
          <span className="mt-2 text-danger">
            <h6 style={{ fontSize: "15px" }}>Example :- 09:10-10:00</h6>
          </span>
        </Row>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button
            onClick={() => navigate("/timeslots")}
            variant="danger"
            type="button"
          >
            {" "}
            Cancel
          </Button>
          <Button disabled={buttonDisabled} variant="success" type="submit">
            {" "}
            {buttonDisabled ? "Adding..." : "Add Time Slot"}{" "}
          </Button>
        </div>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>Time Slot Added successfully 👍</Modal.Body>

        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              handleClose();
              navigate("/timeslots");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AddTimeSlot;
