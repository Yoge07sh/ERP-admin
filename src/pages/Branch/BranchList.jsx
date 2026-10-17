import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Modal, Button, Form, InputGroup, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../components/Pagination";
const apiUrl = import.meta.env.VITE_API_URL;
function BranchList() {
  let navigate = useNavigate();
  let [branches, setBranches] = useState([]);
  const [show, setShow] = useState(false);
  let [isDelete, setIsDelete] = useState(false);
  let [searchByBranchName, setSearchByBranchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios({
      url: apiUrl + "/branches",
      method: "get",
      params: {
        branchFullName: searchByBranchName,
        pageNo: currentPage,
        limit: limit,
      },
    })
      .then((result) => {
        if (result.data.success) {
          setBranches(result.data.data);
          setTotalPages(result.data.pagination.totalPages);
          setTotalRecords(result.data.pagination.totalRecords);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isDelete, searchByBranchName, currentPage]);

  const handleClose = () => {
    setShow(false);
    setIsDelete(true);
  };

  function goToAddBranchPage() {
    navigate("/add/branch");
  }

  function goToDelete(id) {
    axios({
      url: apiUrl + "/delete/branch/" + id,
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
    navigate("/edit/branch/" + id);
  }

  return (
    <>
      <Container>
        <h3 className="text-center mb-4 py-2 text-primary fw-bold text-danger">
          LIST OF BRANCHES
        </h3>

        <InputGroup className="mb-3" style={{ width: "100%" }}>
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder=" Type Branch Name to search"
            onChange={(e) => {
              setSearchByBranchName(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>

        <button
          className="btn btn-success ms-3 mt-2 float-end"
          onClick={goToAddBranchPage}
        >
          Add Branch +
        </button>

        <table className="table text-center table-hover mt-5">
          <thead>
            <tr>
              <th>Branch Code</th>
              <th>Branch Name</th>
              <th>Branch Short Name</th>
              <th>Intake</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr>
                <td>{branch.branchCode}</td>
                <td>{branch.branchFullName}</td>
                <td>{branch.branchShortName}</td>
                <td>{branch.branchIntake}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    title="Edit Branch"
                    onClick={() => goToEdit(branch._id)}
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    variant="outline-danger"
                    title="Delete Branch"
                    className="ms-2"
                    onClick={() => goToDelete(branch._id)}
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
          <Modal.Body>Branch has been Deleted successfully👍</Modal.Body>
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

export default BranchList;
