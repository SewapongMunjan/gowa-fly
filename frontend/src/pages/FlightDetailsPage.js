import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FlightContext } from '../contexts/FlightContext';
import FlightDetails from '../components/flights/FlightDetails';
import Loader from '../components/common/Loader';
import AlertMessage from '../components/common/AlertMessage';
import './FlightDetailsPage.css';

const FlightDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFlightDetails } = useContext(FlightContext);
  
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFlightDetails = async () => {
      setLoading(true);
      try {
        const response = await getFlightDetails(id);
        
        if (response.success) {
          setFlight(response.flight);
          setError(null);
        } else {
          setError('ไม่พบข้อมูลเที่ยวบิน หรือเกิดข้อผิดพลาดในการโหลดข้อมูล');
          // Redirect to flights page after displaying error
          setTimeout(() => {
            navigate('/flights');
          }, 3000);
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลเที่ยวบิน');
        // Redirect to flights page after displaying error
        setTimeout(() => {
          navigate('/flights');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchFlightDetails();
    } else {
      setError('ไม่พบรหัสเที่ยวบิน');
      navigate('/flights');
    }
  }, [id, getFlightDetails, navigate]);
  
  const handleClose = () => {
    navigate('/flights');
  };
  
  if (loading) {
    return (
      <div className="flight-details-page">
        <div className="container">
          <Loader />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flight-details-page">
      <div className="container">
        {error ? (
          <AlertMessage message={error} type="error" />
        ) : (
          flight && (
            <div className="flight-details-wrapper">
              <FlightDetails flight={flight} onClose={handleClose} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FlightDetailsPage;