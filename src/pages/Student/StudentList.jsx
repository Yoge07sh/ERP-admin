import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Modal, Button, Form, InputGroup, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Pagination from "../../components/Pagination";
const apiUrl = import.meta.env.VITE_API_URL;

function StudentList() {
  let navigate = useNavigate();
  let [students, setStudents] = useState([]);
  const [show, setShow] = useState(false);
  let [isDelete, setIsDelete] = useState(false);
  let [searchByFirstName, setSearchByFirstName] = useState("");
  let [searchByLastName] = useState("");
  let [searchByEnrollment] = useState("");
  let [searchByRollno] = useState("");
  let [searchByFileno] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 20;

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios({
      url: apiUrl + "/students",
      method: "get",
      params: {
        firstName: searchByFirstName,
        lastName: searchByLastName,
        enrollmentNumber: searchByEnrollment,
        rollNumber: searchByRollno,
        fileNumber: searchByFileno,
        page: currentPage,
        limit: limit,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setStudents(result.data.data);
              if (result.data.pagination) {
                setTotalPages(result.data.pagination.totalPages);
                setTotalRecords(result.data.pagination.totalRecords);
              }

        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    isDelete,
    searchByFirstName,
    searchByLastName,
    searchByEnrollment,
    searchByRollno,
    searchByFileno,
    currentPage,
  ]);

  const handleClose = () => {
    setShow(false);
    setIsDelete((prev) => !prev);
  };

  function goToAddStudentPage() {
    navigate("/add/student");
  }

  function goToEdit(id) {
    navigate("/edit/student/" + id);
  }

  function goToView(id) {
    navigate("/student/profile/" + id);
  }

  function goToDelete(id) {
    axios({
      url: apiUrl + "/delete/student/" + id,
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

  return (
    <>
      <Container>
        <h3 className="text-center mb-4 py-2 text-primary fw-bold text-danger">
          LIST OF STUDENTS
        </h3>

        <InputGroup className="mb-3" style={{ width: "100%" }}>
          {" "}
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder=" Type Student Name to search"
            onChange={(e) => setSearchByFirstName(e.target.value)}
          />
        </InputGroup>

        <button
          className="btn btn-success ms-3 mt-2 float-end"
          onClick={goToAddStudentPage}
        >
          Add Student +
        </button>

        <table className="table text-center table-hover mt-5">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr>
                <td className="text-center align-middle">
                  <img
                    src={student.image || "/profile.png"}
                    width="50"
                    height="50"
                    alt="pic"
                    className="d-block mx-auto"
                    style={{ objectFit: "cover" }}
                  />
                </td>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.rollNumber}</td>
                <td>{student.year}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    title="View Student"
                    onClick={() => goToView(student._id)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    variant="outline-primary"
                    title="Edit Student"
                    className="ms-2"
                    onClick={() => goToEdit(student._id)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    title="Delete Student"
                    className="ms-2"
                    onClick={() => goToDelete(student._id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        {/* ---------Modal code ------------- */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>Student has been Deleted successfully👍</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default StudentList;
