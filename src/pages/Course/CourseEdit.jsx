import  { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import universityData from '../../assets/universities.json'

import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const apiUrl = import.meta.env.VITE_API_URL

function CourseEdit() {

    let navigate = useNavigate();
    let params = useParams()
    let [course, setCourse] = useState({})
    let [show, setShow] = useState(false)
    // let [buttonDisabled, setButtonDisabled] = useState(false);

const token = localStorage.getItem("token")

    const handleClose = () => {
        setShow(false);
        navigate('/courses')
    }

    function handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        setCourse((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }

    function doEditCourse(id) {
        axios({
          url: apiUrl+"/edit/course/" + id,
          method: "put",
          data: course,
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
            console.log(err);
          });
    }

    useEffect(() => {
        axios({
            url: apiUrl+'/course/' + params.id,
            method: 'get'
        }).then((result) => {
            setCourse(result.data.data)
        }).catch((err) => {
            alert(err)
        })
    }, [params])



    return (
        <Container className="">
            <Form>
                <h3 className="text-center mb-4 py-2 text-white fw-bold bg-black">UPDATE COURSE</h3>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Course Code :-</Form.Label>
                        <Form.Control
                            type="text"
                            value={course.courseCode}
                            onChange={handleChange}
                            name='courseCode'
                            placeholder="eg: BMC101"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Course Short Name :-</Form.Label>
                        <Form.Control
                            type="text"
                            value={course.courseShortName}
                            onChange={handleChange}
                            name='courseShortName'
                            placeholder="eg: B.Tech"
                        />
                    </Form.Group>
                </Row>


                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Course Full Name :-</Form.Label>
                        <Form.Control
                            type="text"
                            value={course.courseFullName}
                            onChange={handleChange}
                            name='courseFullName'
                            placeholder="eg: Bachelor of Technology"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Total Intake :-</Form.Label>
                        <Form.Control
                            type="number"
                            value={course.totalIntake}
                            onChange={handleChange}
                            name='totalIntake'
                            placeholder="eg:60"
                        />
                    </Form.Group>
                </Row>


                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Affiliated University :-</Form.Label>
                        <Form.Select
                            value={course.affiliatedUniversity}
                            onChange={handleChange}
                            name='affiliatedUniversity'
                        >
                            <option value="">-- Select University --</option>
                            {
                                universityData.map((uni) => (

                                    <option key={uni.id} value={uni.name}>{uni.name}, {uni.location}</option>
                                ))
                            }

                        </Form.Select>
                    </Form.Group>
                </Row>


                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button onClick={() => navigate('/courses')} variant="danger" type="button">
                        Cancel
                    </Button>
                    <Button onClick={() => doEditCourse(course._id)}  variant="success">
                        Edit Course
                    </Button>
                </div>
            </Form>

            {/* ---------Modal code ------------- */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Course Updated successfully👍</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default CourseEdit   