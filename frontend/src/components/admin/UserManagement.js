import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Loader from '../../common/Loader';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'user'
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const usersPerPage = 10;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users');
        setUsers(response.data.users);
        setError(null);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    });
    setShowModal(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (user) => {
    setDeleteConfirmation(user);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setDeleteConfirmation(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.put(`/admin/users/${editingUser._id}`, formData);
      
      // Update user in state
      setUsers(users.map(user => 
        user._id === editingUser._id ? response.data.user : user
      ));
      
      // Close modal
      setShowModal(false);
      setEditingUser(null);
      
      alert('อัปเดตข้อมูลผู้ใช้สำเร็จ');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!deleteConfirmation) return;
    
    try {
      setLoading(true);
      await api.delete(`/admin/users/${deleteConfirmation._id}`);
      
      // Remove user from state
      setUsers(users.filter(user => user._id !== deleteConfirmation._id));
      
      // Close confirmation
      setDeleteConfirmation(null);
      
      alert('ลบผู้ใช้สำเร็จ');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลบผู้ใช้');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && users.length === 0) {
    return <Loader />;
  }

  return (
    <div className="user-management">
      <h1>จัดการผู้ใช้งาน</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="user-management-tools">
        <div className="search-bar">
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="user-count">
          แสดง {currentUsers.length} จาก {filteredUsers.length} รายการ
        </div>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ชื่อ-นามสกุล</th>
              <th>อีเมล</th>
              <th>เบอร์โทรศัพท์</th>
              <th>สิทธิ์</th>
              <th>วันที่สมัคร</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-name">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(user)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(user)}
                      disabled={user.role === 'admin'}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      ) : (
        <div className="no-results">
          <p>ไม่พบผู้ใช้ที่ตรงกับการค้นหา</p>
        </div>
      )}

      {/* Edit User Modal */}
      {showModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>แก้ไขข้อมูลผู้ใช้</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label htmlFor="firstName">ชื่อ</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">นามสกุล</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">อีเมล</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role">สิทธิ์</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="user">ผู้ใช้ทั่วไป</option>
                  <option value="admin">ผู้ดูแลระบบ</option>
                </select>
              </div>
              
              <div className="form-buttons">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  ยกเลิก
                </button>
                <button type="submit" className="save-btn">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal confirmation-modal">
            <div className="modal-header">
              <h2>ยืนยันการลบผู้ใช้</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="confirmation-content">
              <p>
                คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้ของ{' '}
                <strong>
                  {deleteConfirmation.firstName} {deleteConfirmation.lastName}
                </strong>
                ?
              </p>
              <p className="warning">การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            </div>
            
            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                ยกเลิก
              </button>
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleDeleteUser}
              >
                ลบผู้ใช้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;