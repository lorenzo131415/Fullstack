import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaSignOutAlt, FaEdit, FaTrash, FaPlus, FaEye} from 'react-icons/fa';
import Swal from 'sweetalert2';
import './Dashboard.css';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false); 
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false); 
    const [newUser, setNewUser] = useState({
        fullname: '',
        username: '',
        password: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({
        fullname: '',
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecodedUserID = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const parsedToken = JSON.parse(token);
                const decodedToken = jwtDecode(parsedToken);
                setUser(decodedToken);

                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${parsedToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const usersData = await response.json();
                setUsers(usersData);
            } catch (error) {
                console.error('Error:', error);
                navigate('/login');
            }
        };

        fetchDecodedUserID();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleView = (userToView) => {
        setSelectedUser(userToView);
        setShowModal(true);
    };

    const handleUpdate = (userToUpdate) => {
        setUpdatedUser({
            fullname: userToUpdate.fullname,
            username: userToUpdate.username,
            password: '', 
        });
        setSelectedUser(userToUpdate);
        setShowUpdateUserModal(true);
    };

    const handleDelete = async (id) => {
        const userIdToDelete = id || user.user_id;

        if (!userIdToDelete) {
            Swal.fire('Error', 'User ID is missing', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the user!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e53935',
            cancelButtonColor: '#1e88e5',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const token = JSON.parse(localStorage.getItem('token'));
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/users/${userIdToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }

                Swal.fire('Deleted!', 'The user has been deleted.', 'success');
                setUsers(users.filter(user => user.user_id !== userIdToDelete));
            } catch (error) {
                Swal.fire('Error', 'There was an issue deleting the user.', 'error');
            }
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullname: newUser.fullname,
                    username: newUser.username,
                    password: newUser.password,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
    
            Swal.fire('Success', 'User has been created.', 'success');
    
            const token = JSON.parse(localStorage.getItem('token'));
            const usersResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!usersResponse.ok) {
                throw new Error('Failed to fetch users');
            }
    
            const usersData = await usersResponse.json();
            setUsers(usersData); 
    
            setShowAddUserModal(false); 
        } catch (error) {
            Swal.fire('Error', 'There was an issue creating the user.', 'error');
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser || !selectedUser.user_id) {
            Swal.fire('Error', 'User details are missing or invalid.', 'error');
            return;
        }  
    
        const updatedUserData = {
            fullname: updatedUser.fullname,
            username: updatedUser.username,
            ...(updatedUser.password && { password: updatedUser.password }),  
        };
    
        const token = JSON.parse(localStorage.getItem('token'));
        if (!token) {
            Swal.fire('Error', 'Token is missing. Please log in again.', 'error');
            return;
        }
    
        const apiUrl = `${import.meta.env.VITE_API_ENDPOINT}/api/users/${selectedUser.user_id}`;
    
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUserData),
            });
    
            const responseBody = await response.json(); 
    
            if (!response.ok) {
                throw new Error(`Failed to update user. Message: ${responseBody.error || responseBody.message}`);
            }
    
            Swal.fire('Success', 'User details updated successfully.', 'success');
    
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.user_id === selectedUser.user_id ? { ...user, ...updatedUserData } : user
                )
            );
    
            setShowUpdateUserModal(false);
        } catch (error) {
            Swal.fire('Error', `There was an issue updating the user: ${error.message}`, 'error');
        }
    };
    
    return (
        <>
            <Navbar style={{ backgroundColor: '	#023020', padding: '1.2rem 0', fontFamily: 'Arial, sans-serif' }} variant="dark">
                <Container>
                    <Navbar.Brand href="#home" style={{ color: '#	#023020', fontSize: '3.5rem', fontWeight: 'bold' }}>
                        Deans List
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <NavDropdown title={user ? `Hello, ${user.username}` : 'User Menu'} id="user-nav-dropdown">
                            <NavDropdown.Item onClick={handleLogout} style={{ color: '#333', fontSize: '1.1rem' }}>
                                <FaSignOutAlt className="me-2" /> Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Button
                            variant="primary"
                            className="ms-2"
                            onClick={() => setShowAddUserModal(true)} 
                            style={{
                                backgroundColor: '#5F8575',
                                borderColor: '#5F8575',
                                fontSize: '1.2rem',
                                padding: '0.8rem 1.4rem',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#007bff'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#00d2ff'}
                        >
                            <FaPlus className="me-2" /> Add User
                        </Button>
                    </Nav>z
                </Container>
            </Navbar>

            <Container className="mt-4">
                <h2 style={{ color: '	#023020', fontWeight: 'bold', fontFamily: 'monospace' }}>Student List</h2>
                <Table striped bordered hover responsive className="table-hover shadow-lg" 
                    style={{
                        backgroundColor: '#2a2a2a',
                        color: '#f8f9fa',
                        borderRadius: '10px',
                        borderColor: '#555',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}>
                    <thead className="bg-dark text-white">
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.username}</td>
                                <td>{user.fullname}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleView(user)} className="me-2">
                                        <FaEye />
                                    </Button>
                                    <Button variant="warning" onClick={() => handleUpdate(user)} className="me-2">
                                        <FaEdit />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(user.user_id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Modal for viewing user */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>View User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <h5>Username: {selectedUser.username}</h5>
                            <p>Full Name: {selectedUser.fullname}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for updating user */}
            <Modal show={showUpdateUserModal} onHide={() => setShowUpdateUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form>
                            <Form.Group controlId="formFullname">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={updatedUser.fullname}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, fullname: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </Form.Group>
                            <Form.Group controlId="formUsername" className="mt-2">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={updatedUser.username}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                                    placeholder="Enter username"
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mt-2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={updatedUser.password}
                                    onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
                                    placeholder="Enter new password (leave empty to keep current)"
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateUserModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateUser}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for adding user */}
            <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFullname">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.fullname}
                                onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                                placeholder="Enter full name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername" className="mt-2">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                placeholder="Enter username"
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mt-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="Enter password"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddUser}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Dashboard;
