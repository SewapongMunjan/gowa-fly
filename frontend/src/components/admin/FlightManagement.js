import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Loader from '../../common/Loader';
import './FlightManagement.css';

const FlightManagement = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [flightStatuses, setFlightStatuses] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFlightData, setNewFlightData] = useState({
    flightNumber: '',
    airline: {
      name: '',
      iataCode: ''
    },
    departure: {
      airport: '',
      iataCode: '',
      terminal: '',
      gate: '',
      scheduledTime: '',
      city: '',
      country: ''
    },
    arrival: {
      airport: '',
      iataCode: '',
      terminal: '',
      gate: '',
      scheduledTime: '',
      city: '',
      country: ''
    },
    status: 'จองแล้ว',
    aircraft: {
      model: '',
      registration: ''
    },
    price: {
      economy: 0,
      business: 0,
      firstClass: 0
    },
    seatsAvailable: {
      economy: 100,
      business: 20,
      firstClass: 10
    }
  });

  const flightsPerPage = 10;

  // Fetch flights and statuses on component mount
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll fetch from Aviation API directly
        // In a real app, you'd fetch from your backend
        const response = await api.get('/flights/popular');
        
        // Transform data to match Flight model
        const transformedFlights = response.data.routes.map((route, index) => ({
          _id: `flight-${index}`,
          flightNumber: `TH${1000 + index}`,
          airline: {
            name: 'Thai Airways',
            iataCode: 'TG',
            logo: 'https://content.airhex.com/content/logos/airlines_TG_200_200_s.png'
          },
          departure: {
            airport: route.from.airport,
            iataCode: route.from.iataCode,
            terminal: 'T1',
            gate: `G${10 + index}`,
            scheduledTime: new Date(Date.now() + 86400000), // tomorrow
            city: route.from.city,
            country: route.from.country
          },
          arrival: {
            airport: route.to.airport,
            iataCode: route.to.iataCode,
            terminal: 'T2',
            gate: `G${20 + index}`,
            scheduledTime: new Date(Date.now() + 86400000 + 7200000), // tomorrow + 2 hours
            city: route.to.city,
            country: route.to.country
          },
          status: 'จองแล้ว',
          aircraft: {
            model: 'Boeing 787',
            registration: `HS-TG${100 + index}`
          },
          duration: 120, // 2 hours in minutes
          price: {
            economy: route.price,
            business: route.price * 2.5,
            firstClass: route.price * 4
          },
          seatsAvailable: {
            economy: 100,
            business: 20,
            firstClass: 10
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        
        setFlights(transformedFlights);
        
        // Set available statuses
        setFlightStatuses([
          'จองแล้ว',
          'ยกเลิก',
          'ดีเลย์',
          'เที่ยวบินเข้า',
          'เที่ยวบินออก',
          'อยู่ระหว่างเดินทาง',
          'ถึงที่หมายแล้ว',
          'เปลี่ยนเส้นทาง',
          'ไม่ทราบสถานะ'
        ]);
        
        setError(null);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลเที่ยวบิน');
        console.error('Error fetching flights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [refreshTrigger]);

  // Filter flights based on search term
  const filteredFlights = flights.filter(
    flight =>
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure.iataCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival.iataCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Open flight details modal
  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFlight(null);
    setShowAddModal(false);
    setDeleteConfirmation(null);
  };

  // Handle flight status update
  const handleUpdateStatus = async (flight, newStatus) => {
    // In a real app, you'd call your API here
    try {
      // Simulate API call
      setLoading(true);
      
      // Update flight in state
      const updatedFlights = flights.map(f => 
        f._id === flight._id ? { ...f, status: newStatus } : f
      );
      
      setFlights(updatedFlights);
      
      if (selectedFlight && selectedFlight._id === flight._id) {
        setSelectedFlight({ ...selectedFlight, status: newStatus });
      }
      
      alert('อัปเดตสถานะเที่ยวบินสำเร็จ');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัปเดตสถานะเที่ยวบิน');
      console.error('Error updating flight status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (flight) => {
    setDeleteConfirmation(flight);
  };

  // Handle flight deletion
  const handleDeleteFlight = async () => {
    if (!deleteConfirmation) return;
    
    try {
      setLoading(true);
      
      // Update state
      setFlights(flights.filter(flight => flight._id !== deleteConfirmation._id));
      
      if (selectedFlight && selectedFlight._id === deleteConfirmation._id) {
        setShowModal(false);
        setSelectedFlight(null);
      }
      
      // Close confirmation
      setDeleteConfirmation(null);
      
      alert('ลบเที่ยวบินสำเร็จ');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลบเที่ยวบิน');
      console.error('Error deleting flight:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle searching new flights from Aviation API
  const handleRefreshFlights = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle add new flight
  const handleAddFlight = () => {
    setShowAddModal(true);
  };

  // Handle new flight form input change
  const handleNewFlightChange = (e, section, field) => {
    if (section) {
      setNewFlightData({
        ...newFlightData,
        [section]: {
          ...newFlightData[section],
          [field]: e.target.value
        }
      });
    } else {
      setNewFlightData({
        ...newFlightData,
        [field]: e.target.value
      });
    }
  };

  // Handle save new flight
  const handleSaveNewFlight = (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create new flight object
      const newFlight = {
        ...newFlightData,
        _id: `flight-${flights.length + 1}`,
        duration: calculateDuration(
          new Date(newFlightData.departure.scheduledTime),
          new Date(newFlightData.arrival.scheduledTime)
        ),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to flights array
      setFlights([...flights, newFlight]);
      
      // Close modal
      setShowAddModal(false);
      
      // Reset form
      setNewFlightData({
        flightNumber: '',
        airline: {
          name: '',
          iataCode: ''
        },
        departure: {
          airport: '',
          iataCode: '',
          terminal: '',
          gate: '',
          scheduledTime: '',
          city: '',
          country: ''
        },
        arrival: {
          airport: '',
          iataCode: '',
          terminal: '',
          gate: '',
          scheduledTime: '',
          city: '',
          country: ''
        },
        status: 'จองแล้ว',
        aircraft: {
          model: '',
          registration: ''
        },
        price: {
          economy: 0,
          business: 0,
          firstClass: 0
        },
        seatsAvailable: {
          economy: 100,
          business: 20,
          firstClass: 10
        }
      });
      
      alert('เพิ่มเที่ยวบินสำเร็จ');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเพิ่มเที่ยวบิน');
      console.error('Error adding flight:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate flight duration in minutes
  const calculateDuration = (departureTime, arrivalTime) => {
    return Math.round((arrivalTime - departureTime) / 60000);
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

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  // Format for datetime-local input
  const formatDateTimeInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'จองแล้ว':
        return 'status-scheduled';
      case 'ยกเลิก':
        return 'status-cancelled';
      case 'ดีเลย์':
        return 'status-delayed';
      case 'อยู่ระหว่างเดินทาง':
        return 'status-active';
      case 'ถึงที่หมายแล้ว':
        return 'status-landed';
      case 'เปลี่ยนเส้นทาง':
        return 'status-diverted';
      default:
        return 'status-unknown';
    }
  };

  if (loading && flights.length === 0) {
    return <Loader />;
  }

  return (
    <div className="flight-management">
      <h1>จัดการเที่ยวบิน</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="flight-management-tools">
        <div className="search-bar">
          <input
            type="text"
            placeholder="ค้นหาเที่ยวบิน..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="flight-actions">
          <button className="add-flight-btn" onClick={handleAddFlight}>
            <i className="fas fa-plus"></i> เพิ่มเที่ยวบิน
          </button>
          <button className="refresh-btn" onClick={handleRefreshFlights} disabled={loading}>
            <i className="fas fa-sync-alt"></i> ดึงข้อมูลล่าสุด
          </button>
        </div>

        <div className="flight-count">
          แสดง {currentFlights.length} จาก {filteredFlights.length} รายการ
        </div>
      </div>

      <div className="flight-table-container">
        <table className="flight-table">
          <thead>
            <tr>
              <th>เที่ยวบิน</th>
              <th>เส้นทาง</th>
              <th>วันที่ออกเดินทาง</th>
              <th>เวลา</th>
              <th>สถานะ</th>
              <th>ราคา (ชั้นประหยัด)</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {currentFlights.map(flight => (
              <tr key={flight._id}>
                <td>
                  <div className="flight-info">
                    <img 
                      src={flight.airline.logo} 
                      alt={flight.airline.name} 
                      className="airline-logo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/airline-placeholder.png';
                      }}
                    />
                    <div>
                      <div className="flight-number">{flight.flightNumber}</div>
                      <div className="airline-name">{flight.airline.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flight-route">
                    <div>{flight.departure.iataCode} - {flight.arrival.iataCode}</div>
                    <div className="route-cities">
                      {flight.departure.city} - {flight.arrival.city}
                    </div>
                  </div>
                </td>
                <td>{formatDate(flight.departure.scheduledTime).split(' ')[0]}</td>
                <td>{formatTime(flight.departure.scheduledTime)} - {formatTime(flight.arrival.scheduledTime)}</td>
                <td>
                  <select
                    className={`status-select ${getStatusBadgeClass(flight.status)}`}
                    value={flight.status}
                    onChange={(e) => handleUpdateStatus(flight, e.target.value)}
                  >
                    {flightStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>฿{flight.price.economy.toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleViewDetails(flight)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(flight)}
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

      {filteredFlights.length > 0 ? (
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
          <p>ไม่พบข้อมูลเที่ยวบินที่ตรงกับการค้นหา</p>
        </div>
      )}

      {/* Flight Details Modal */}
      {showModal && selectedFlight && (
        <div className="modal-overlay">
          <div className="modal flight-details-modal">
            <div className="modal-header">
              <h2>รายละเอียดเที่ยวบิน</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flight-details">
              <div className="flight-detail-header">
                <div className="flight-info">
                  <img 
                    src={selectedFlight.airline.logo} 
                    alt={selectedFlight.airline.name} 
                    className="airline-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/airline-placeholder.png';
                    }}
                  />
                  <div>
                    <div className="flight-number">{selectedFlight.flightNumber}</div>
                    <div className="airline-name">{selectedFlight.airline.name}</div>
                  </div>
                </div>
                <div className="flight-status">
                  <span className={`status-badge ${getStatusBadgeClass(selectedFlight.status)}`}>
                    {selectedFlight.status}
                  </span>
                </div>
              </div>
              
              <div className="flight-route-details">
                <div className="route-stop">
                  <div className="airport-code">{selectedFlight.departure.iataCode}</div>
                  <div className="airport-name">{selectedFlight.departure.airport}</div>
                  <div className="city-name">{selectedFlight.departure.city}, {selectedFlight.departure.country}</div>
                  <div className="flight-time">{formatTime(selectedFlight.departure.scheduledTime)}</div>
                  <div className="flight-date">{formatDate(selectedFlight.departure.scheduledTime).split(' ')[0]}</div>
                  <div className="terminal-gate">
                    Terminal {selectedFlight.departure.terminal}, Gate {selectedFlight.departure.gate}
                  </div>
                </div>
                
                <div className="route-line">
                  <div className="route-duration">
                    <span>{Math.floor(selectedFlight.duration / 60)}ชม. {selectedFlight.duration % 60}น.</span>
                  </div>
                </div>
                
                <div className="route-stop">
                  <div className="airport-code">{selectedFlight.arrival.iataCode}</div>
                  <div className="airport-name">{selectedFlight.arrival.airport}</div>
                  <div className="city-name">{selectedFlight.arrival.city}, {selectedFlight.arrival.country}</div>
                  <div className="flight-time">{formatTime(selectedFlight.arrival.scheduledTime)}</div>
                  <div className="flight-date">{formatDate(selectedFlight.arrival.scheduledTime).split(' ')[0]}</div>
                  <div className="terminal-gate">
                    Terminal {selectedFlight.arrival.terminal}, Gate {selectedFlight.arrival.gate}
                  </div>
                </div>
              </div>
              
              <div className="flight-detail-section">
                <h3>ข้อมูลทั่วไป</h3>
                <div className="detail-row">
                  <span className="detail-label">เครื่องบิน:</span>
                  <span className="detail-value">{selectedFlight.aircraft.model}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ทะเบียนเครื่องบิน:</span>
                  <span className="detail-value">{selectedFlight.aircraft.registration}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">สถานะ:</span>
                  <select
                    className={`status-select ${getStatusBadgeClass(selectedFlight.status)}`}
                    value={selectedFlight.status}
                    onChange={(e) => handleUpdateStatus(selectedFlight, e.target.value)}
                  >
                    {flightStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flight-detail-section">
                <h3>ราคาตั๋ว</h3>
                <div className="detail-row">
                  <span className="detail-label">ชั้นประหยัด:</span>
                  <span className="detail-value">฿{selectedFlight.price.economy.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ชั้นธุรกิจ:</span>
                  <span className="detail-value">฿{selectedFlight.price.business.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ชั้นหนึ่ง:</span>
                  <span className="detail-value">฿{selectedFlight.price.firstClass.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flight-detail-section">
                <h3>ที่นั่งว่าง</h3>
                <div className="detail-row">
                  <span className="detail-label">ชั้นประหยัด:</span>
                  <span className="detail-value">{selectedFlight.seatsAvailable.economy} ที่นั่ง</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ชั้นธุรกิจ:</span>
                  <span className="detail-value">{selectedFlight.seatsAvailable.business} ที่นั่ง</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ชั้นหนึ่ง:</span>
                  <span className="detail-value">{selectedFlight.seatsAvailable.firstClass} ที่นั่ง</span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                ปิด
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteClick(selectedFlight)}
              >
                ลบเที่ยวบิน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Flight Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal add-flight-modal">
            <div className="modal-header">
              <h2>เพิ่มเที่ยวบินใหม่</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSaveNewFlight}>
              <div className="form-section">
                <h3>ข้อมูลเที่ยวบิน</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="flight-number">หมายเลขเที่ยวบิน</label>
                    <input
                      type="text"
                      id="flight-number"
                      value={newFlightData.flightNumber}
                      onChange={(e) => handleNewFlightChange(e, null, 'flightNumber')}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="airline-name">สายการบิน</label>
                    <input
                      type="text"
                      id="airline-name"
                      value={newFlightData.airline.name}
                      onChange={(e) => handleNewFlightChange(e, 'airline', 'name')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="airline-iata">รหัสสายการบิน (IATA)</label>
                    <input
                      type="text"
                      id="airline-iata"
                      value={newFlightData.airline.iataCode}
                      onChange={(e) => handleNewFlightChange(e, 'airline', 'iataCode')}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>ข้อมูลการออกเดินทาง</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dep-airport">สนามบินต้นทาง</label>
                    <input
                      type="text"
                      id="dep-airport"
                      value={newFlightData.departure.airport}
                      onChange={(e) => handleNewFlightChange(e, 'departure', 'airport')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dep-iata">รหัสสนามบิน (IATA)</label>
                    <input
                      type="text"
                      id="dep-iata"
                      value={newFlightData.departure.iataCode}
                      onChange={(e) => handleNewFlightChange(e, 'departure', 'iataCode')}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dep-city">เมือง</label>
                    <input
                      type="text"
                      id="dep-city"
                      value={newFlightData.departure.city}
                      onChange={(e) => handleNewFlightChange(e, 'departure', 'city')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dep-country">ประเทศ</label>
                    <input
                      type="text"
                      id="dep-country"
                      value={newFlightData.departure.country}
                      onChange={(e) => handleNewFlightChange(e, 'departure', 'country')}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dep-terminal">Terminal</label>
                    <input
                      type="text"
                      id="dep-terminal"
                      value={newFlightData.departure.terminal}
                      onChange={(e) => handleNewFlightChange(e, 'departure', 'terminal')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dep-gate">Gate</label>
                    <input
                      type="text"
                      id="dep-gate"
                      value={newFlightData.departure.gate}
                      onChange={(e) => handleNewFlightChange(e, 'departure', 'gate')}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dep-time">วันและเวลาออกเดินทาง</label>
                    <input
                      type="datetime-local"
                      id="dep-time"
                      value={formatDateTimeInput(newFlightData.departure.scheduledTime)}
                      onChange={(e) => handleNewFlightChange(e, 'departure', 'scheduledTime')}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>ข้อมูลการมาถึง</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="arr-airport">สนามบินปลายทาง</label>
                    <input
                      type="text"
                      id="arr-airport"
                      value={newFlightData.arrival.airport}
                      onChange={(e) => handleNewFlightChange(e, 'arrival', 'airport')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="arr-iata">รหัสสนามบิน (IATA)</label>
                    <input
                      type="text"
                      id="arr-iata"
                      value={newFlightData.arrival.iataCode}
                      onChange={(e) => handleNewFlightChange(e, 'arrival', 'iataCode')}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="arr-city">เมือง</label>
                    <input
                      type="text"
                      id="arr-city"
                      value={newFlightData.arrival.city}
                      onChange={(e) => handleNewFlightChange(e, 'arrival', 'city')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="arr-country">ประเทศ</label>
                    <input
                      type="text"
                      id="arr-country"
                      value={newFlightData.arrival.country}
                      onChange={(e) => handleNewFlightChange(e, 'arrival', 'country')}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="arr-terminal">Terminal</label>
                    <input
                      type="text"
                      id="arr-terminal"
                      value={newFlightData.arrival.terminal}
                      onChange={(e) => handleNewFlightChange(e, 'arrival', 'terminal')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="arr-gate">Gate</label>
                    <input
                      type="text"
                      id="arr-gate"
                      value={newFlightData.arrival.gate}
                      onChange={(e) => handleNewFlightChange(e, 'arrival', 'gate')}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="arr-time">วันและเวลามาถึง</label>
                    <input
                      type="datetime-local"
                      id="arr-time"
                      value={formatDateTimeInput(newFlightData.arrival.scheduledTime)}
                      onChange={(e) => handleNewFlightChange(e, 'arrival', 'scheduledTime')}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>ข้อมูลเครื่องบิน</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="aircraft-model">รุ่น</label>
                    <input
                      type="text"
                      id="aircraft-model"
                      value={newFlightData.aircraft.model}
                      onChange={(e) => handleNewFlightChange(e, 'aircraft', 'model')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="aircraft-reg">ทะเบียน</label>
                    <input
                      type="text"
                      id="aircraft-reg"
                      value={newFlightData.aircraft.registration}
                      onChange={(e) => handleNewFlightChange(e, 'aircraft', 'registration')}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>ราคา</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price-economy">ชั้นประหยัด (บาท)</label>
                    <input
                      type="number"
                      id="price-economy"
                      value={newFlightData.price.economy}
                      onChange={(e) => handleNewFlightChange(e, 'price', 'economy')}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price-business">ชั้นธุรกิจ (บาท)</label>
                    <input
                      type="number"
                      id="price-business"
                      value={newFlightData.price.business}
                      onChange={(e) => handleNewFlightChange(e, 'price', 'business')}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price-first">ชั้นหนึ่ง (บาท)</label>
                    <input
                      type="number"
                      id="price-first"
                      value={newFlightData.price.firstClass}
                      onChange={(e) => handleNewFlightChange(e, 'price', 'firstClass')}
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>จำนวนที่นั่ง</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="seats-economy">ชั้นประหยัด</label>
                    <input
                      type="number"
                      id="seats-economy"
                      value={newFlightData.seatsAvailable.economy}
                      onChange={(e) => handleNewFlightChange(e, 'seatsAvailable', 'economy')}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="seats-business">ชั้นธุรกิจ</label>
                    <input
                      type="number"
                      id="seats-business"
                      value={newFlightData.seatsAvailable.business}
                      onChange={(e) => handleNewFlightChange(e, 'seatsAvailable', 'business')}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="seats-first">ชั้นหนึ่ง</label>
                    <input
                      type="number"
                      id="seats-first"
                      value={newFlightData.seatsAvailable.firstClass}
                      onChange={(e) => handleNewFlightChange(e, 'seatsAvailable', 'firstClass')}
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>สถานะ</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="flight-status">สถานะเที่ยวบิน</label>
                    <select
                      id="flight-status"
                      value={newFlightData.status}
                      onChange={(e) => handleNewFlightChange(e, null, 'status')}
                      className={`status-select ${getStatusBadgeClass(newFlightData.status)}`}
                    >
                      {flightStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
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
              <h2>ยืนยันการลบเที่ยวบิน</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="confirmation-content">
              <p>
                คุณแน่ใจหรือไม่ว่าต้องการลบเที่ยวบิน{' '}
                <strong>{deleteConfirmation.flightNumber}</strong>?
              </p>
              <p>
                เส้นทาง: {deleteConfirmation.departure.city} ({deleteConfirmation.departure.iataCode}) - {deleteConfirmation.arrival.city} ({deleteConfirmation.arrival.iataCode})
              </p>
              <p>
                วันที่: {formatDate(deleteConfirmation.departure.scheduledTime).split(' ')[0]}
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
                onClick={handleDeleteFlight}
              >
                ลบเที่ยวบิน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightManagement;