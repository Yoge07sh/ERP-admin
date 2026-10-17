import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import axios from "axios";

import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
const apiUrl = import.meta.env.VITE_API_URL
function TimeSlotList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [timeSlots, setTimeSlots] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios({
      url: apiUrl+"/timeslots",
      method: "get",
    })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data.data);
          setTimeSlots(res.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isDelete]);

  const handleClose = () => {
    setShow(false);
    setIsDelete((prev) => !prev);
  };

  function goToAddTimeSlotPage() {
    navigate("/add/timeslots");
  }

  function goToDelete(id) {
    axios({
      url: apiUrl+"/delete/timeslot/" + id,
      method: "delete",
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
        console.log(err.message);
      });
  }

  function goToEdit(id) {
    navigate("/edit/timeslot/" + id);
  }

  return (
    <>
      <h3 className="text-center mb-4 py-2  fw-bold text-danger">
        TIME SLOTS LIST
      </h3>

      <button
        className="btn btn-success ms-3 mt-2 float-end"
        onClick={goToAddTimeSlotPage}
      >
        Add TimeSlot +
      </button>

      <table className="table text-center table-hover mt-5">
        <thead>
          <tr>
            <th>Session</th>
            <th>Lecture Number</th>
            <th>Lecture Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {timeSlots.map((timeslot) => (
            <tr key={timeslot._id}>
              <td>{timeslot.session}</td>

              <td>{timeslot.lectureNo}</td>

              <td>{timeslot.timeSlot}</td>

              <td>
                <Button
                  variant="outline-primary"
                  title="Edit TimeSlot"
                  onClick={() => goToEdit(timeslot._id)}
                >
                  <FaEdit />
                </Button>

                <Button
                  variant="outline-danger"
                  title="Delete TimeSlot"
                  className="ms-2"
                  onClick={() => goToDelete(timeslot._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Success Modal */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>TimeSlot has been Deleted successfully 👍</Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TimeSlotList;
