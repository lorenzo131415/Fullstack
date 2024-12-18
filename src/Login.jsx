import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { FaUser, FaLock } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { API_ENDPOINT } from '/src/Api/api.jsx';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_ENDPOINT}/api/auth/login`, {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', JSON.stringify(token));
      setError('');
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar style={{ backgroundColor: '#023020', padding: '1rem 0' }} variant="dark">
        <Container>
          <Navbar.Brand 
            href="#home" 
            style={{
              color: '#FFFFFF', 
              fontWeight: 'bold', 
              fontFamily: 'monospace', 
              fontSize: '1.8rem'
            }}
          >
            Class Record
          </Navbar.Brand>
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
                  boxShadow: '0 4px 8px rgb(2, 48, 32)',
                }}
              />
            </div>
            <div className="card shadow" style={{ borderRadius: '12px', padding: '20px', backgroundColor: '#023020', borderColor: '#FFFFFF' }}>
              <div className="card-body">
                <h5 className="text-center mb-4 fs-3 fw-bold" style={{ color: '#023020', fontFamily: 'monospace' }}>Login</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label style={{ color: '#FFFFFF' }}>Username:</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#FFFFFF' }}>
                        <FaUser />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                          backgroundColor: '#023020',
                          borderRadius: '8px',
                          border: '1px solid #ccc',
                          color: '#FFFFFF',
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label style={{ color: '#FFFFFF' }}>Password:</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#FFFFFF' }}>
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          backgroundColor: '#023020',
                          borderRadius: '8px',
                          border: '1px solid #ccc',
                          color: '#FFFFFF',
                        }}
                      />
                    </div>
                  </Form.Group>

                  {error && <p className="text-danger">{error}</p>}

                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading} 
                    className="w-100" 
                    style={{ 
                      borderRadius: '8px', 
                      backgroundColor: '#023020', 
                      border: '1px solid #FFFFFF', 
                    }}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p style={{ color: '#FFFFFF' }}>
                    Don't have an account? {''}
                    <a href="/register" className="text-success fw-bold" style={{ textDecoration: 'none', color: '#FFFFFF', fontFamily: 'monospace' }}>
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
