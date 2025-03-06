import React from 'react';
import './PassengerInfo.css';

const PassengerInfo = ({ passengers, onChange }) => {
  const titleOptions = {
    'ผู้ใหญ่': ['นาย', 'นาง', 'นางสาว'],
    'เด็ก': ['ด.ช.', 'ด.ญ.'],
    'ทารก': ['ด.ช.', 'ด.ญ.']
  };

  const nationalities = [
    'ไทย', 'ลาว', 'กัมพูชา', 'เวียดนาม', 'พม่า', 'มาเลเซีย', 'สิงคโปร์',
    'อินโดนีเซีย', 'ฟิลิปปินส์', 'เกาหลีใต้', 'ญี่ปุ่น', 'จีน', 'อินเดีย',
    'ออสเตรเลีย', 'นิวซีแลนด์', 'อเมริกัน', 'อังกฤษ', 'ฝรั่งเศส', 'เยอรมัน',
    'สวิส', 'อิตาลี', 'สเปน', 'รัสเซีย', 'อื่นๆ'
  ];

  // Check if date is in the future
  const isFutureDate = (date) => {
    return new Date(date) > new Date();
  };

  // Calculate maximum date of birth for each passenger type
  const getMaxDateOfBirth = (type) => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    switch (type) {
      case 'ทารก':
        // Min age 0, max age 2 years
        const infantDate = new Date(today);
        infantDate.setFullYear(today.getFullYear() - 2);
        return infantDate.toISOString().split('T')[0];
      case 'เด็ก':
        // Min age 2, max age 12 years
        const childDate = new Date(today);
        childDate.setFullYear(today.getFullYear() - 12);
        return childDate.toISOString().split('T')[0];
      case 'ผู้ใหญ่':
        // Min age 12 years, no max
        const adultDate = new Date(today);
        adultDate.setFullYear(today.getFullYear() - 100); // Arbitrary max of 100 years
        return adultDate.toISOString().split('T')[0];
      default:
        return dateString;
    }
  };

  // Calculate minimum date of birth for each passenger type
  const getMinDateOfBirth = (type) => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    switch (type) {
      case 'ทารก':
        // Min age 0, max age 2 years
        return dateString;
      case 'เด็ก':
        // Min age 2, max age 12 years
        const childDate = new Date(today);
        childDate.setFullYear(today.getFullYear() - 2);
        return childDate.toISOString().split('T')[0];
      case 'ผู้ใหญ่':
        // Min age 12 years, no max
        const adultDate = new Date(today);
        adultDate.setFullYear(today.getFullYear() - 12);
        return adultDate.toISOString().split('T')[0];
      default:
        return dateString;
    }
  };

  return (
    <div className="passenger-info-container">
      {passengers.map((passenger, index) => (
        <div key={index} className="passenger-form">
          <h3>ผู้โดยสารคนที่ {index + 1} ({passenger.type})</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`title-${index}`}>คำนำหน้า</label>
              <select
                id={`title-${index}`}
                value={passenger.title}
                onChange={(e) => onChange(index, 'title', e.target.value)}
                required
              >
                <option value="">เลือกคำนำหน้า</option>
                {titleOptions[passenger.type].map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor={`firstName-${index}`}>ชื่อจริง</label>
              <input
                type="text"
                id={`firstName-${index}`}
                value={passenger.firstName}
                onChange={(e) => onChange(index, 'firstName', e.target.value)}
                placeholder="ชื่อจริงตามหนังสือเดินทาง"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`lastName-${index}`}>นามสกุล</label>
              <input
                type="text"
                id={`lastName-${index}`}
                value={passenger.lastName}
                onChange={(e) => onChange(index, 'lastName', e.target.value)}
                placeholder="นามสกุลตามหนังสือเดินทาง"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`dateOfBirth-${index}`}>วันเกิด</label>
              <input
                type="date"
                id={`dateOfBirth-${index}`}
                value={passenger.dateOfBirth}
                onChange={(e) => onChange(index, 'dateOfBirth', e.target.value)}
                min={getMaxDateOfBirth(passenger.type)}
                max={getMinDateOfBirth(passenger.type)}
                required
              />
              <small className="form-hint">
                {passenger.type === 'ทารก' && 'อายุต่ำกว่า 2 ปี'}
                {passenger.type === 'เด็ก' && 'อายุ 2-11 ปี'}
                {passenger.type === 'ผู้ใหญ่' && 'อายุ 12 ปีขึ้นไป'}
              </small>
            </div>
            <div className="form-group">
              <label htmlFor={`nationality-${index}`}>สัญชาติ</label>
              <select
                id={`nationality-${index}`}
                value={passenger.nationality}
                onChange={(e) => onChange(index, 'nationality', e.target.value)}
                required
              >
                <option value="">เลือกสัญชาติ</option>
                {nationalities.map((nationality) => (
                  <option key={nationality} value={nationality}>{nationality}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="passport-section">
            <h4>ข้อมูลหนังสือเดินทาง</h4>
            <p className="passport-note">
              *จำเป็นสำหรับเที่ยวบินระหว่างประเทศเท่านั้น
            </p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`passportNumber-${index}`}>หมายเลขหนังสือเดินทาง</label>
                <input
                  type="text"
                  id={`passportNumber-${index}`}
                  value={passenger.passportNumber}
                  onChange={(e) => onChange(index, 'passportNumber', e.target.value)}
                  placeholder="หมายเลขหนังสือเดินทาง"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`passportExpiry-${index}`}>วันหมดอายุ</label>
                <input
                  type="date"
                  id={`passportExpiry-${index}`}
                  value={passenger.passportExpiry}
                  onChange={(e) => onChange(index, 'passportExpiry', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {passenger.passportExpiry && !isFutureDate(passenger.passportExpiry) && (
                  <span className="error-message">
                    วันหมดอายุต้องเป็นวันในอนาคต
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="passenger-divider"></div>
        </div>
      ))}
    </div>
  );
};

export default PassengerInfo;