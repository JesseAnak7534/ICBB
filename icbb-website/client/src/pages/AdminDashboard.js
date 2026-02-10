import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiHome,
  FiFileText,
  FiUsers,
  FiMail,
  FiLogOut,
  FiRefreshCw,
  FiEye,
  FiCheck,
  FiUpload,
  FiDownload,
  FiClock,
  FiDollarSign,
  FiX
} from 'react-icons/fi';
import { getApiUrl } from '../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalTraining: 0,
    totalContacts: 0
  });
  const [requests, setRequests] = useState([]);
  const [trainingRegistrations, setTrainingRegistrations] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchDashboardData();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch stats
      const statsRes = await fetch(getApiUrl('/api/admin/stats'), { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
      
      // Fetch service requests
      const requestsRes = await fetch(getApiUrl('/api/admin/requests'), { headers });
      const requestsData = await requestsRes.json();
      if (requestsData.success) {
        setRequests(requestsData.requests);
      }
      
      // Fetch training registrations
      const trainingRes = await fetch(getApiUrl('/api/admin/training'), { headers });
      const trainingData = await trainingRes.json();
      if (trainingData.success) {
        setTrainingRegistrations(trainingData.registrations);
      }
      
      // Fetch contact submissions
      const contactRes = await fetch(getApiUrl('/api/admin/contacts'), { headers });
      const contactData = await contactRes.json();
      if (contactData.success) {
        setContactSubmissions(contactData.contacts);
      }
    } catch (error) {
      toast.error('Error fetching dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/requests/${requestId}/status`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Status updated successfully');
        fetchDashboardData();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const handleFileUpload = async (requestId) => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(getApiUrl(`/api/admin/requests/${requestId}/upload`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        toast.success('File uploaded successfully');
        fetchDashboardData();
        fileInputRef.current.value = '';
      } else {
        toast.error(data.message || 'Failed to upload file');
      }
    } catch (error) {
      toast.error('Error uploading file');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      'in-progress': 'status-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FiFileText /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalRequests}</span>
            <span className="stat-label">Total Requests</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon"><FiClock /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingRequests}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon"><FiCheck /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.completedRequests}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card training">
          <div className="stat-icon"><FiUsers /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalTraining}</span>
            <span className="stat-label">Training Registrations</span>
          </div>
        </div>
        <div className="stat-card contacts">
          <div className="stat-icon"><FiMail /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalContacts}</span>
            <span className="stat-label">Contact Messages</span>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Service Requests</h3>
        <div className="activity-list">
          {requests.slice(0, 5).map(request => (
            <div key={request._id} className="activity-item">
              <div className="activity-info">
                <strong>{request.projectTitle}</strong>
                <span>{request.fullName} - {request.serviceType}</span>
              </div>
              <div className="activity-meta">
                <span className={`status-badge ${getStatusClass(request.status)}`}>
                  {request.status}
                </span>
                <span className="date">{formatDate(request.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="requests-section">
      <div className="section-header">
        <h2>Service Requests</h2>
        <button className="btn btn-secondary" onClick={fetchDashboardData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>
      
      <div className="requests-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Project</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id}>
                <td>{formatDate(request.createdAt)}</td>
                <td>
                  <div className="client-info">
                    <strong>{request.fullName}</strong>
                    <span>{request.email}</span>
                  </div>
                </td>
                <td>{request.projectTitle}</td>
                <td>{request.serviceType}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon"
                      onClick={() => setSelectedRequest(request)}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Details</h3>
              <button className="btn-close" onClick={() => setSelectedRequest(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Client Name:</label>
                  <span>{selectedRequest.fullName}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedRequest.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{selectedRequest.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Institution:</label>
                  <span>{selectedRequest.institution || 'N/A'}</span>
                </div>
                <div className="detail-item full">
                  <label>Project Title:</label>
                  <span>{selectedRequest.projectTitle}</span>
                </div>
                <div className="detail-item full">
                  <label>Description:</label>
                  <p>{selectedRequest.projectDescription}</p>
                </div>
                <div className="detail-item">
                  <label>Service Type:</label>
                  <span>{selectedRequest.serviceType}</span>
                </div>
                <div className="detail-item">
                  <label>Deadline:</label>
                  <span>{selectedRequest.deadline ? formatDate(selectedRequest.deadline) : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${getStatusClass(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
              
              {selectedRequest.clientFiles?.length > 0 && (
                <div className="files-section">
                  <h4>Client Files</h4>
                  <ul>
                    {selectedRequest.clientFiles.map((file, i) => (
                      <li key={i}>
                        <a href={`/uploads/${file}`} target="_blank" rel="noopener noreferrer">
                          <FiDownload /> {file}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="actions-section">
                <h4>Update Status</h4>
                <div className="status-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => updateRequestStatus(selectedRequest._id, 'in-progress')}
                  >
                    Mark In Progress
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={() => updateRequestStatus(selectedRequest._id, 'completed')}
                  >
                    Mark Completed
                  </button>
                </div>
                
                <h4>Upload Results</h4>
                <div className="upload-section">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="form-input"
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleFileUpload(selectedRequest._id)}
                  >
                    <FiUpload /> Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTraining = () => (
    <div className="training-section">
      <div className="section-header">
        <h2>Training Registrations</h2>
        <button className="btn btn-secondary" onClick={fetchDashboardData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>
      
      <div className="requests-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Program</th>
              <th>Role</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {trainingRegistrations.map(reg => (
              <tr key={reg._id}>
                <td>{formatDate(reg.createdAt)}</td>
                <td>{reg.fullName}</td>
                <td>{reg.email}</td>
                <td>{reg.programName}</td>
                <td>{reg.role}</td>
                <td>{reg.experienceLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="contacts-section">
      <div className="section-header">
        <h2>Contact Messages</h2>
        <button className="btn btn-secondary" onClick={fetchDashboardData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>
      
      <div className="messages-list">
        {contactSubmissions.map(contact => (
          <div key={contact._id} className="message-card">
            <div className="message-header">
              <div className="sender-info">
                <strong>{contact.name}</strong>
                <span>{contact.email}</span>
              </div>
              <span className="message-date">{formatDate(contact.createdAt)}</span>
            </div>
            <div className="message-subject">
              <strong>Subject:</strong> {contact.subject}
            </div>
            <div className="message-body">
              {contact.message}
            </div>
            <div className="message-actions">
              <a href={`mailto:${contact.email}`} className="btn btn-primary btn-sm">
                Reply
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <span className="logo-text">ICBB</span>
          <span className="admin-label">Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiHome /> Overview
          </button>
          <button 
            className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FiFileText /> Service Requests
          </button>
          <button 
            className={`nav-item ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => setActiveTab('training')}
          >
            <FiUsers /> Training
          </button>
          <button 
            className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <FiMail /> Messages
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'requests' && 'Service Requests'}
            {activeTab === 'training' && 'Training Registrations'}
            {activeTab === 'contacts' && 'Contact Messages'}
          </h1>
        </header>
        
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading-state">
              <FiRefreshCw className="spin" />
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'requests' && renderRequests()}
              {activeTab === 'training' && renderTraining()}
              {activeTab === 'contacts' && renderContacts()}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
