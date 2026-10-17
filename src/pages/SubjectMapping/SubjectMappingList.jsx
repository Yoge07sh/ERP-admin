import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import axios from "axios";

import { Modal, Button, Form, InputGroup } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../components/Pagination";
const apiUrl = import.meta.env.VITE_API_URL;

function SubjectMappingList() {
  let navigate = useNavigate();

  let [subjectsmap, setSubjectsmap] = useState([]);

  const [show, setShow] = useState(false);

  let [isDelete, setIsDelete] = useState(false);

  let [searchByCourse, setSearchByCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 5;
  const token = localStorage.getItem("token");

  // =========================
  // GET SUBJECT MAPPINGS
  // =========================
  useEffect(() => {
    axios({
      url: apiUrl + "/subjectsMapped",
      method: "get",
      params: {
        course: searchByCourse,
        pageNo: currentPage,
        limit: limit,
      },
    })
      .then((result) => {
        if (result.data.success) {
          console.log(result.data.data);

          setSubjectsmap(result.data.data);

          setTotalPages(result.data.pagination.totalPages);
          setTotalRecords(result.data.pagination.totalRecords);

          setIsDelete(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isDelete, searchByCourse, currentPage]);
  // =========================
  // CLOSE DELETE MODAL
  // =========================
  const handleClose = () => {
    setShow(false);
    setIsDelete(true);
  };

  // =========================
  // EDIT
  // =========================
  function goToEdit(id) {
    navigate("/edit/subjectMapping/" + id);
  }

  // =========================
  // DELETE
  // =========================
  function goToDelete(id) {
    axios({
      url: apiUrl + "/delete/subjectMapping/" + id,
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
      {/* =========================
          HEADING
      ========================= */}
      <h3 className="text-center mb-4 py-2 text-primary fw-bold text-danger">
        LIST OF SUBJECT MAPPING
      </h3>

      {/* =========================
          SEARCH
      ========================= */}
      <InputGroup className="mb-3" style={{ width: "100%" }}>
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>

        <Form.Control
          type="text"
          placeholder=" Type Course Name to search"
          value={searchByCourse}
          onChange={(e) => {
            setSearchByCourse(e.target.value);
            setCurrentPage(1);
          }}
        />
      </InputGroup>

      {/* =========================
          ADD BUTTON
      ========================= */}
      <button
        className="btn btn-success ms-3 mt-2 float-end"
        onClick={() => navigate("/add/subjectMapping")}
      >
        Map Subject +
      </button>

      {/* =========================
          TABLE
      ========================= */}
      <table className="table text-center table-hover mt-5">
        <thead>
          <tr>
            <th>Session</th>
            <th>Subject</th>
            <th>Course</th>
            <th>Branch</th>
            <th>Year</th>
            <th>Semester</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {subjectsmap.map((subject) => (
            <tr key={subject._id}>
              {/* SESSION */}
              <td>{subject.session}</td>

              {/* SUBJECT */}
              <td>
                {subject.subject?.subjectNickName ||
                  subject.subject?.subjectFullName ||
                  "-"}
              </td>

              {/* COURSE */}
              <td>
                {subject.course?.courseShortName ||
                  subject.course?.courseFullName ||
                  "-"}
              </td>

              {/* BRANCH */}
              <td>
                {subject.branch?.branchShortName ||
                  subject.branch?.branchFullName ||
                  "-"}
              </td>

              {/* YEAR */}
              <td>{subject.year}</td>

              {/* SEMESTER */}
              <td>{subject.semester}</td>

              {/* ACTION */}
              <td>
                <Button
                  variant="outline-primary"
                  title="Edit Subject Mapping"
                  onClick={() => goToEdit(subject._id)}
                >
                  <FaEdit />
                </Button>

                <Button
                  variant="outline-danger"
                  title="Delete Subject Mapping"
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

      {/* =========================
          DELETE SUCCESS MODAL
      ========================= */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Subject Mapping has been Deleted successfully 👍
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SubjectMappingList;
