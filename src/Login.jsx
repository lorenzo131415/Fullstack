import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { FaUser, FaLock } from 'react-icons/fa'; // Import icons from react-icons
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { API_ENDPOINT } from './Api';

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  const fetchUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // Or decode and set user info if needed
      navigate('/dashboard'); // Redirect to dashboard if logged in
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_ENDPOINT}/api/auth/login`, {
        username,
        passwordx: password, // Use password state but send it as passwordx
      });
      
      localStorage.setItem('token', JSON.stringify(response.data.token)); // Save token
      setUser({ token: response.data.token }); // Optionally set the user data
      setError('');
      setLoading(false);
      
      // Add a delay before redirecting to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Wait for 2 seconds before navigating (adjust time as needed)
  
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message); // Log backend error
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="success" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Naga College Foundation, Inc.</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <Row className="justify-content-md-center vh-100 align-items-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <img
                src="/NCF.jpg"
                alt="NCF Logo"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
              />
            </div>
            <div className="card shadow" style={{ borderRadius: '10px', padding: '20px' }}>
              <div className="card-body">
                <h5 className="text-center mb-4 fs-3 fw-bold">Login</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>Username:</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUser />
                      </span>
                      <Form.Control
                        className="form-control-sm rounded-0"
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>Password:</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        className="form-control-sm rounded-0"
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </Form.Group>

                  {error && <p className="text-danger">{error}</p>}

                  <Button
                    variant="success"
                    className="btn btn-block bg-custom btn-flat rounded-0"
                    size="sm"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login Now'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p>
                    Don't have an account?{' '}
                    <a href="/register" className="text-success">
                      Register here.
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;