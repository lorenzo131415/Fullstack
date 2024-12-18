import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { FaUser, FaLock } from 'react-icons/fa';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { API_ENDPOINT } from './Api/api.jsx';

function Register() {
  const navigate = useNavigate();
  const [fullname, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_ENDPOINT}/api/auth/register`, {
        fullname,
        username,
        password: password,
      });

      setError('');
      setLoading(false);
      setShowModal(true); // Show success modal
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during registration');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <>
      <Navbar style={{ backgroundColor: '#023020' }} variant="dark" className="p-4">
        <Container>
          <Navbar.Brand href="/" className="text-light fw-bold fs-2">
            Registration
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="my-5">
        <Row className="justify-content-center vh-100 align-items-center">
          <Col md={6} lg={5} className="bg-light shadow-lg rounded-lg p-4">
            <div className="text-center mb-4">
              <img
                src="/NCF.jpg"
                alt="NCF Logo"
                className="rounded-circle shadow-lg mb-3"
                style={{
                  width: '150px',
                  height: '150px',
                }}
              />
              <h3 className="text-dark mb-4">Register</h3>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFullName" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Full Name"
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>

              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}

              <Button
                variant="primary"
                className="w-100"
                type="submit"
                disabled={loading}
                style={{
                  borderRadius: '8px',
                  backgroundColor: ' #023020',
                  border: '1px solid #FFFFFF',
                }}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-primary">
                  Login here.
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your account has been created successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleModalClose}>Proceed to Login</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Register;
