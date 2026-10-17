import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Modal, Button, Form, InputGroup, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../components/Pagination";
const apiUrl = import.meta.env.VITE_API_URL;
function CourseList() {
  let navigate = useNavigate();
  let [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  let [isDelete, setIsDelete] = useState(false);
  let [searchByCourseName, setSearchByCourseName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 5;

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios({
      url: apiUrl + "/courses",
      method: "get",
      params: {
        courseFullName: searchByCourseName,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setCourses(result.data.data);
          setTotalPages(result.data.pagination.totalPages);
          setTotalRecords(result.data.pagination.totalRecords);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isDelete, searchByCourseName, currentPage]);

  const handleClose = () => {
    setShow(false);
    setIsDelete(true);
  };

  function goToAddCoursePage() {
    navigate("/add/course");
  }

  function goToDelete(id) {
    axios({
      url: apiUrl + "/delete/course/" + id,
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
    navigate("/edit/course/" + id);
  }

  return (
    <>
      <Container>
        <h3 className="text-center mb-4 py-2 text-primary fw-bold text-danger">
          LIST OF COURSES
        </h3>

        <InputGroup className="mb-3" style={{ width: "100%" }}>
          {" "}
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder=" Type Course Name to search"
            onChange={(e) => {
              setSearchByCourseName(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>

        <button
          className="btn btn-success ms-3 mt-2 float-end"
          onClick={goToAddCoursePage}
        >
          Add Course +
        </button>

        <table className="table text-center table-hover mt-5">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Course Short Name</th>
              <th>Intake</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr>
                <td>{course.courseCode}</td>
                <td>{course.courseFullName}</td>
                <td>{course.courseShortName}</td>
                <td>{course.totalIntake}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    title="Edit Course"
                    onClick={() => goToEdit(course._id)}
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    variant="outline-danger"
                    title="Delete course"
                    className="ms-2"
                    onClick={() => goToDelete(course._id)}
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
          <Modal.Body>Course has been Deleted successfully👍</Modal.Body>
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

export default CourseList;
