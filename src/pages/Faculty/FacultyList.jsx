import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Form, InputGroup, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Pagination from "../../components/Pagination";
const apiUrl = import.meta.env.VITE_API_URL;

function FacultyList() {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  let [showSpinner, setShowSpinner] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(false);
  let [file, setFile] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 5;
  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  let [faculties, setFaculties] = useState([]);
  let [searchByFacultyName, setSearchByFacultyName] = useState("");

  useEffect(() => {
    axios({
      url: apiUrl + "/faculties",
      method: "get",
      params: {
        firstName: searchByFacultyName,
        pageNo: currentPage,
        limit: limit,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setFaculties(result.data.data);
          setTotalPages(result.data.pagination.totalPages);
          setTotalRecords(result.data.pagination.totalRecords);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchByFacultyName, currentPage]);

  function doUploadCsv() {
    setShowModal(true);
  }
  function doAddFaculties() {
    setButtonDisabled(true);
    let formData = new FormData();
    formData.append("facultyData", file);
    formData.append("fileName", file.name);
    axios({
      url: apiUrl + "/add/faculties",
      method: "post",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((result) => {
        if (result.data.success) setButtonDisabled(false);
        setShow(true);
        setShowSpinner(false);
      })
      .catch((err) => {
        setShowSpinner(false);
        setButtonDisabled(false);
        alert(err);
      });
  }

  const handleClose = () => {
    setShow(false);
    setShowModal(false);
    navigate("/faculties");
  };

  function goToAddFacultyPage() {
    navigate("/add/faculty");
  }

  function goToEdit(id) {
    navigate("/edit/faculty/" + id);
  }

  function goToDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty?",
    );

    if (!confirmDelete) {
      return;
    }

    axios(
      {
        url: apiUrl + "/delete/faculty/" + id,
        method: "delete",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((result) => {
        if (result.data.success) {
          alert("Faculty deleted successfully");
          setFaculties(faculties.filter((faculty) => faculty._id !== id));
        }
      })
      .catch((err) => {
        console.log(err.message);
        alert("Something went wrong while deleting faculty");
      });
  }

  function goToView(id) {
    navigate("/faculty/profile/" + id);
  }

  return (
    <>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold text-danger">
        LIST OF FACULTIES
      </h3>

      <InputGroup className="mb-3" style={{ width: "100%" }}>
        {" "}
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder=" Type Faculty Name to search"
          onChange={(e) => {
            setSearchByFacultyName(e.target.value);
            setCurrentPage(1);
          }}
        />
      </InputGroup>
      <div className=" d-flex align-content-center gap-2 ms-3 mt-2 float-end">
        <button className="btn btn-sm btn-success" onClick={goToAddFacultyPage}>
          Add Faculty +
        </button>
        <p>Or upload via csv</p>
        <button
          className="btn btn-success btn-sm "
          variant="success"
          disabled={buttonDisabled}
          onClick={doUploadCsv}
        >
          upload Csv
        </button>
      </div>

      <table className="table text-center table-hover mt-5">
        <thead>
          <tr>
            <th>Faculty Image</th>
            <th>FacultyName</th>
            <th>Designation</th>
            <th>Highest Qualification</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((faculty) => (
            <tr>
              <td className="text-center align-middle">
                <img
                  src={faculty.facultyImage || "/profile.png"}
                  width="50"
                  height="50"
                  alt="pic"
                  className="d-block mx-auto"
                  style={{ objectFit: "cover" }}
                />
              </td>
              <td>
                {faculty.firstName} {faculty.lastName}
              </td>
              <td>{faculty.designation}</td>
              <td>{faculty.highestQualification}</td>
              <td>
                <Button
                  variant="outline-warning"
                  title="View Faculty"
                  onClick={() => goToView(faculty._id)}
                >
                  <FaEye />
                </Button>
                <Button
                  variant="outline-primary"
                  title="Edit Faculty"
                  className="ms-2"
                  onClick={() => goToEdit(faculty._id)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  title="Delete Faculty"
                  className="ms-2"
                  onClick={() => goToDelete(faculty._id)}
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
        <Modal.Body>Faculty added successfully</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add faculties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            name="facultyData"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />

          <Button
            variant="success btn-md mt-2"
            disabled={buttonDisabled}
            onClick={doAddFaculties}
          >
            Upload CSV
          </Button>
          <div className="mt-3">
            <p>
              Click below to download a <b>sample CSV file</b> for reference:
            </p>
            <a href="/demo.csv" download>
              <Button variant="success">⬇ Download Demo CSV</Button>
            </a>
          </div>
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

export default FacultyList;
