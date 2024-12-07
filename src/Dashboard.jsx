import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { API_ENDPOINT } from './Api';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    /* Verify if User is in Session in LocalStorage */
    useEffect(() => {
        const fetchDecodedUserID = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = JSON.parse(token);
                const decoded_token = decode(response.data.token);

                // Set the decoded token as user data
                setUser(decoded_token); // Assuming you want to store decoded token in the state
            } catch (error) {
                navigate('/login');
            }
        };

        fetchDecodedUserID();
    }, [navigate]);

    /* Logout Function */
    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <>
            <Navbar bg="success" data-bs-theme="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home" className="me-auto">
                        Naga College Foundation, Inc.
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="#users">Users</Nav.Link>
                            <Nav.Link href="#departments">Departments</Nav.Link>
                            <Nav.Link href="#courses">Courses</Nav.Link>
                            <NavDropdown
                                title={user ? `Hello: ${user.username}` : 'More'}
                                id="basic-nav-dropdown"
                                align="end"
                                aria-label="User profile menu"
                            >
                                <NavDropdown.Item href="#">
                                    <FaUser className="me-2" />
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#">
                                    <FaCog className="me-2" />
                                    Settings
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#" onClick={handleLogout}>
                                    <FaSignOutAlt className="me-2" />
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Dashboard;
