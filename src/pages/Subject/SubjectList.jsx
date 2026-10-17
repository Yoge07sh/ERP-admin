import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Modal, Button, Form, InputGroup, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../components/Pagination";
const apiUrl = import.meta.env.VITE_API_URL;

function SubjectList() {
  let navigate = useNavigate();
  let [subjects, setSubjects] = useState([]);
  const [show, setShow] = useState(false);
  let [isDelete, setIsDelete] = useState(false);
  let [searchBySubjectName, setSearchBySubjectName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios({
      url: apiUrl + "/subjects",
      method: "get",
      params: {
        subjectFullName: searchBySubjectName,
        pageNo: currentPage,
        limit: limit,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setSubjects(result.data.data);

          setTotalPages(result.data.pagination.totalPages);

          setTotalRecords(result.data.pagination.totalRecords);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isDelete, searchBySubjectName, currentPage]);

  const handleClose = () => {
    setShow(false);
  };

  function goToEdit(id) {
    console.log("Navigating to edit subject with ID:", id);
    navigate("/edit/subject/" + id);
  }

  function goToAddSubjectPage() {
    navigate("/add/subject");
  }

  function goToDelete(id) {
    axios({
      url: apiUrl + "/delete/subject/" + id,
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setIsDelete((prev) => !prev);
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <>
      {" "}
      <Container>
        <h3 className="text-center mb-4 py-2 text-primary fw-bold text-danger">
          LIST OF SUBJECTS
        </h3>

        <InputGroup className="mb-3" style={{ width: "100%" }}>
          {" "}
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder=" Type Subject Name to search"
            onChange={(e) => {
              setSearchBySubjectName(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>

        <button
          className="btn btn-success ms-3 mt-2 float-end"
          onClick={goToAddSubjectPage}
        >
          Add Subject +
        </button>

        <table className="table text-center table-hover mt-5">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Short Name</th>
              <th>Subject Category</th>
              <th>Subject Type</th>
              <th>Credit Score</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr>
                <td>{subject.subjectCode}</td>
                <td>{subject.subjectNickName}</td>
                <td>{subject.subjectCategory}</td>
                <td>{subject.subjectType}</td>
                <td>{subject.creditScore}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    title="Edit Subject"
                    onClick={() => goToEdit(subject._id)}
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    variant="outline-danger"
                    title="Delete Subject"
                    className="ms-2"
                    onClick={() => goToDelete(subject._id)}
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
          <Modal.Body>Subject has been Deleted successfully👍</Modal.Body>
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

export default SubjectList;
