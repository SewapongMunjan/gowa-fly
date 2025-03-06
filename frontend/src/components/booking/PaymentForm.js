import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ paymentMethod, onChange }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankTransferInfo, setBankTransferInfo] = useState({
    bank: '',
    accountNumber: '',
    accountName: '',
  });
  const [promptpayNumber, setPromptpayNumber] = useState('');

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date with slash
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Handle card number change
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  // Handle expiry date change
  const handleExpiryDateChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
  };

  // Handle CVV change
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value);
  };

  // Handle bank transfer info change
  const handleBankTransferChange = (e) => {
    setBankTransferInfo({
      ...bankTransferInfo,
      [e.target.name]: e.target.value
    });
  };

  // Handle PromptPay number change
  const handlePromptpayChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPromptpayNumber(value);
  };

  return (
    <div className="payment-form-container">
      <div className="payment-methods">
        <div
          className={`payment-method ${paymentMethod === 'บัตรเครดิต' ? 'active' : ''}`}
          onClick={() => onChange('บัตรเครดิต')}
        >
          <div className="payment-icon">
            <i className="fas fa-credit-card"></i>
          </div>
          <div className="payment-label">บัตรเครดิต</div>
        </div>
        
        <div
          className={`payment-method ${paymentMethod === 'โอนเงิน' ? 'active' : ''}`}
          onClick={() => onChange('โอนเงิน')}
        >
          <div className="payment-icon">
            <i className="fas fa-university"></i>
          </div>
          <div className="payment-label">โอนเงิน</div>
        </div>
        
        <div
          className={`payment-method ${paymentMethod === 'พร้อมเพย์' ? 'active' : ''}`}
          onClick={() => onChange('พร้อมเพย์')}
        >
          <div className="payment-icon">
            <i className="fas fa-mobile-alt"></i>
          </div>
          <div className="payment-label">พร้อมเพย์</div>
        </div>
      </div>
      
      <div className="payment-details">
        {paymentMethod === 'บัตรเครดิต' && (
          <div className="credit-card-form">
            <div className="form-group">
              <label htmlFor="cardNumber">หมายเลขบัตร</label>
              <div className="card-input-wrapper">
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  required
                />
                <div className="card-icons">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-amex"></i>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="cardName">ชื่อผู้ถือบัตร</label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="ชื่อบนบัตร"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">วันหมดอายุ</label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cvv">รหัส CVV</label>
                <input
                  type="password"
                  id="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>
            
            <div className="payment-info">
              <p>
                <i className="fas fa-lock"></i>
                ข้อมูลการชำระเงินของคุณถูกเข้ารหัสอย่างปลอดภัย
              </p>
            </div>
          </div>
        )}
        
        {paymentMethod === 'โอนเงิน' && (
          <div className="bank-transfer-form">
            <div className="bank-accounts">
              <h3>บัญชีธนาคารสำหรับโอนเงิน</h3>
              
              <div className="bank-account">
                <div className="bank-logo">
                  <img src="/assets/images/kbank-logo.png" alt="KBANK" />
                </div>
                <div className="bank-details">
                  <div className="bank-name">ธนาคารกสิกรไทย</div>
                  <div className="account-number">123-4-56789-0</div>
                  <div className="account-name">บริษัท โกวา ฟลาย จำกัด</div>
                </div>
              </div>
              
              <div className="bank-account">
                <div className="bank-logo">
                  <img src="/assets/images/scb-logo.png" alt="SCB" />
                </div>
                <div className="bank-details">
                  <div className="bank-name">ธนาคารไทยพาณิชย์</div>
                  <div className="account-number">987-6-54321-0</div>
                  <div className="account-name">บริษัท โกวา ฟลาย จำกัด</div>
                </div>
              </div>
            </div>
            
            <div className="transfer-instructions">
              <h3>วิธีการชำระเงิน</h3>
              <ol>
                <li>โอนเงินตามจำนวนเงินทั้งหมดที่ระบุในใบแจ้งการชำระเงิน</li>
                <li>บันทึกหลักฐานการโอนเงิน</li>
                <li>อัปโหลดหลักฐานการโอนเงินด้านล่าง</li>
                <li>รอการยืนยันการชำระเงินจากเจ้าหน้าที่</li>
              </ol>
            </div>
            
            <div className="form-group">
              <label htmlFor="transferReceipt">หลักฐานการโอนเงิน</label>
              <input
                type="file"
                id="transferReceipt"
                accept="image/*,.pdf"
              />
              <small>รองรับไฟล์ JPG, PNG, PDF ขนาดไม่เกิน 5MB</small>
            </div>
          </div>
        )}
        
        {paymentMethod === 'พร้อมเพย์' && (
          <div className="promptpay-form">
            <div className="promptpay-qr">
              <img src="/assets/images/promptpay-qr.png" alt="PromptPay QR Code" />
              <div className="promptpay-id">
                <span>พร้อมเพย์ ID: 0-1234-56789-0</span>
                <span>บริษัท โกวา ฟลาย จำกัด</span>
              </div>
            </div>
            
            <div className="transfer-instructions">
              <h3>วิธีการชำระเงิน</h3>
              <ol>
                <li>เปิดแอปธนาคารหรือแอพพลิเคชันที่สนับสนุน พร้อมเพย์</li>
                <li>สแกน QR Code หรือระบุเลขพร้อมเพย์ด้านบน</li>
                <li>ระบุจำนวนเงินตามที่แสดงในใบแจ้งการชำระเงิน</li>
                <li>ตรวจสอบข้อมูลและยืนยันการชำระเงิน</li>
                <li>บันทึกหลักฐานการชำระเงิน</li>
                <li>อัปโหลดหลักฐานการชำระเงินด้านล่าง</li>
              </ol>
            </div>
            
            <div className="form-group">
              <label htmlFor="promptpayReceipt">หลักฐานการชำระเงิน</label>
              <input
                type="file"
                id="promptpayReceipt"
                accept="image/*,.pdf"
              />
              <small>รองรับไฟล์ JPG, PNG, PDF ขนาดไม่เกิน 5MB</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;