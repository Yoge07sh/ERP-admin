import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup, Container, Modal } from "react-bootstrap";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../components/Pagination";

const apiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");
function FacultyMappingList() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleAdd = () => {
    navigate("/add/facultymapping");
  };
  const [facultyMapping, setFacultyMapping] = useState([]);

  // Separate search states
  const [sessionSearch, setSessionSearch] = useState("");
  const [facultyNameSearch, setFacultyNameSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  // Loading state
  const [loading, setLoading] = useState(false);

  // Get faculty mapping data
  const getFacultyMapping = async () => {
    try {
      setLoading(true);

      const res = await axios({
        url: apiUrl + "/get/facultymapping",
        method: "get",
        params: {
          page: page,
          limit: limit,
          session: sessionSearch,
          facultyName: facultyNameSearch,
        },
      });

      setFacultyMapping(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotalRecords(res.data.pagination.totalRecords);
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get data whenever page or search changes
  useEffect(() => {
    getFacultyMapping();
  }, [page, sessionSearch, facultyNameSearch]);

  // Session search
  const handleSessionSearch = (e) => {
    setSessionSearch(e.target.value);

    // Reset pagination
    setPage(1);
  };

  const handleClose = () => {
    setShow(false);
  };

  // Faculty name search
  const handleFacultyNameSearch = (e) => {
    setFacultyNameSearch(e.target.value);

    // Reset pagination
    setPage(1);
  };
  //handle edit
  const handleEdit = (id) => {
    navigate("/edit/facultymapping/" + id);
  };
  //handle delete
  const handleDelete = async (id) => {
    try {
      const res = await axios({
        url: apiUrl + "/delete/facultyMapping/" + id,
        method: "delete",
      });

      if (res.data.success) {
        setShow(true);
        await getFacultyMapping();
      }
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <Container>
      <h3 className="text-center mb-4 py-2 text-primary fw-bold text-danger">
        FACULTY TEACHING DETAIL
      </h3>

      {/* Search Section */}
      <div className="row mb-3">
        {/* Session Search */}
        <div className="col-md-4">
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-calendar"></i>
            </InputGroup.Text>

            <Form.Control
              type="text"
              value={sessionSearch}
              onChange={handleSessionSearch}
              placeholder="Search by Session"
            />
          </InputGroup>
        </div>

        {/* Faculty Name Search */}
        <div className="col-md-4">
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-person"></i>
            </InputGroup.Text>

            <Form.Control
              type="text"
              value={facultyNameSearch}
              onChange={handleFacultyNameSearch}
              placeholder="Search by Faculty Name"
            />
          </InputGroup>
        </div>

        {/* Add Button */}
        <div className="col-md-4">
          <Button className="btn btn-success float-end" onClick={handleAdd}>
            Add Faculty Mapping +
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table text-center table-hover mt-5">
          <thead>
            <tr>
              <th>Session</th>
              <th>Faculty Name</th>
              <th>Course</th>
              <th>Branch</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Subject</th>
              <th>LoadPerWeek</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10">Loading...</td>
              </tr>
            ) : facultyMapping.length > 0 ? (
              facultyMapping.map((mapping) => (
                <tr key={mapping._id}>
                  <td>{mapping.session}</td>

                  <td>
                    {mapping.facultyId?.firstName} {mapping.facultyId?.lastName}
                  </td>

                  <td>{mapping.course?.courseShortName}</td>

                  <td>{mapping.branch?.branchShortName}</td>

                  <td>{mapping.year}</td>

                  <td>{mapping.semester}</td>

                  <td>{mapping.section}</td>

                  <td>{mapping.subjectId?.subjectNickName}</td>

                  <td>{mapping.loadPerWeek}</td>

                  <td>
                    <Button
                      variant="outline-primary"
                      title="Edit Faculty Mapping"
                      onClick={() => handleEdit(mapping._id)}
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      variant="outline-danger"
                      title="Delete Faculty Mapping"
                      className="ms-2"
                      onClick={() => handleDelete(mapping._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Faculty Teaching Detail has been Deleted successfully👍
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FacultyMappingList;
