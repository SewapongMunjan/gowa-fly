import React, { useState, useEffect } from 'react';
import './FlightFilter.css';

const FlightFilter = ({ flights, onFilterChange }) => {
  // Initial state for filters
  const [filters, setFilters] = useState({
    airlines: [],
    departureTime: [],
    arrivalTime: [],
    price: {
      min: 0,
      max: 50000
    },
    duration: {
      max: 24 * 60 // 24 hours in minutes
    },
    stops: [],
    sort: 'price-asc'
  });

  // Available airlines from flights data
  const [availableAirlines, setAvailableAirlines] = useState([]);
  // Price range from flights data
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  // Duration maximum from flights data
  const [maxDuration, setMaxDuration] = useState(24 * 60); // 24 hours in minutes

  // Initialize available filters from flights data
  useEffect(() => {
    if (flights && flights.length > 0) {
      // Extract unique airlines
      const airlines = [...new Set(flights.map(flight => flight.airline.name))];
      setAvailableAirlines(airlines);

      // Determine price range
      const prices = flights.map(flight => flight.price.economy);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange({ 
        min: Math.floor(minPrice / 100) * 100, // Round down to nearest 100
        max: Math.ceil(maxPrice / 100) * 100   // Round up to nearest 100
      });
      setFilters(prev => ({
        ...prev,
        price: {
          min: Math.floor(minPrice / 100) * 100,
          max: Math.ceil(maxPrice / 100) * 100
        }
      }));

      // Determine max duration
      const durations = flights.map(flight => flight.duration);
      const maxDur = Math.max(...durations);
      setMaxDuration(maxDur + 60); // Add 1 hour buffer
      setFilters(prev => ({
        ...prev,
        duration: {
          max: maxDur + 60
        }
      }));
    }
  }, [flights]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    let newFilters = { ...filters };

    switch (filterType) {
      case 'airline':
        // Toggle airline selection
        if (newFilters.airlines.includes(value)) {
          newFilters.airlines = newFilters.airlines.filter(airline => airline !== value);
        } else {
          newFilters.airlines = [...newFilters.airlines, value];
        }
        break;

      case 'departureTime':
        // Toggle departure time selection
        if (newFilters.departureTime.includes(value)) {
          newFilters.departureTime = newFilters.departureTime.filter(time => time !== value);
        } else {
          newFilters.departureTime = [...newFilters.departureTime, value];
        }
        break;

      case 'arrivalTime':
        // Toggle arrival time selection
        if (newFilters.arrivalTime.includes(value)) {
          newFilters.arrivalTime = newFilters.arrivalTime.filter(time => time !== value);
        } else {
          newFilters.arrivalTime = [...newFilters.arrivalTime, value];
        }
        break;

      case 'priceMin':
        newFilters.price.min = parseInt(value);
        break;

      case 'priceMax':
        newFilters.price.max = parseInt(value);
        break;

      case 'durationMax':
        newFilters.duration.max = parseInt(value);
        break;

      case 'stops':
        // Toggle stops selection
        if (newFilters.stops.includes(value)) {
          newFilters.stops = newFilters.stops.filter(stop => stop !== value);
        } else {
          newFilters.stops = [...newFilters.stops, value];
        }
        break;

      case 'sort':
        newFilters.sort = value;
        break;

      default:
        break;
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      airlines: [],
      departureTime: [],
      arrivalTime: [],
      price: {
        min: priceRange.min,
        max: priceRange.max
      },
      duration: {
        max: maxDuration
      },
      stops: [],
      sort: 'price-asc'
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  // Format duration for display
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return `${hours} ชั่วโมง`;
  };

  // Time slot options for departure and arrival
  const timeSlots = [
    { id: 'early-morning', label: '00:00 - 06:00', display: 'เช้าตรู่' },
    { id: 'morning', label: '06:00 - 12:00', display: 'เช้า' },
    { id: 'afternoon', label: '12:00 - 18:00', display: 'บ่าย' },
    { id: 'evening', label: '18:00 - 24:00', display: 'เย็น/ค่ำ' }
  ];

  return (
    <div className="flight-filter">
      <div className="filter-header">
        <h3>กรองเที่ยวบิน</h3>
        <button className="reset-filters" onClick={handleResetFilters}>
          รีเซ็ตตัวกรอง
        </button>
      </div>

      <div className="filter-section">
        <h4>เรียงตาม</h4>
        <div className="sort-options">
          <div className="sort-option">
            <input
              type="radio"
              id="sort-price-asc"
              name="sort"
              value="price-asc"
              checked={filters.sort === 'price-asc'}
              onChange={() => handleFilterChange('sort', 'price-asc')}
            />
            <label htmlFor="sort-price-asc">ราคา (ต่ำไปสูง)</label>
          </div>
          <div className="sort-option">
            <input
              type="radio"
              id="sort-price-desc"
              name="sort"
              value="price-desc"
              checked={filters.sort === 'price-desc'}
              onChange={() => handleFilterChange('sort', 'price-desc')}
            />
            <label htmlFor="sort-price-desc">ราคา (สูงไปต่ำ)</label>
          </div>
          <div className="sort-option">
            <input
              type="radio"
              id="sort-duration"
              name="sort"
              value="duration"
              checked={filters.sort === 'duration'}
              onChange={() => handleFilterChange('sort', 'duration')}
            />
            <label htmlFor="sort-duration">ระยะเวลาบิน (สั้นที่สุด)</label>
          </div>
          <div className="sort-option">
            <input
              type="radio"
              id="sort-departure"
              name="sort"
              value="departure"
              checked={filters.sort === 'departure'}
              onChange={() => handleFilterChange('sort', 'departure')}
            />
            <label htmlFor="sort-departure">เวลาออกเดินทาง (เช้าไปค่ำ)</label>
          </div>
          <div className="sort-option">
            <input
              type="radio"
              id="sort-arrival"
              name="sort"
              value="arrival"
              checked={filters.sort === 'arrival'}
              onChange={() => handleFilterChange('sort', 'arrival')}
            />
            <label htmlFor="sort-arrival">เวลามาถึง (เช้าไปค่ำ)</label>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>สายการบิน</h4>
        <div className="airline-options">
          {availableAirlines.map(airline => (
            <div className="filter-option" key={airline}>
              <input
                type="checkbox"
                id={`airline-${airline}`}
                value={airline}
                checked={filters.airlines.includes(airline)}
                onChange={() => handleFilterChange('airline', airline)}
              />
              <label htmlFor={`airline-${airline}`}>{airline}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>เวลาออกเดินทาง</h4>
        <div className="time-options">
          {timeSlots.map(slot => (
            <div className="filter-option" key={`dep-${slot.id}`}>
              <input
                type="checkbox"
                id={`dep-${slot.id}`}
                value={slot.id}
                checked={filters.departureTime.includes(slot.id)}
                onChange={() => handleFilterChange('departureTime', slot.id)}
              />
              <label htmlFor={`dep-${slot.id}`}>
                <span className="time-slot-label">{slot.display}</span>
                <span className="time-slot-hours">{slot.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>เวลามาถึง</h4>
        <div className="time-options">
          {timeSlots.map(slot => (
            <div className="filter-option" key={`arr-${slot.id}`}>
              <input
                type="checkbox"
                id={`arr-${slot.id}`}
                value={slot.id}
                checked={filters.arrivalTime.includes(slot.id)}
                onChange={() => handleFilterChange('arrivalTime', slot.id)}
              />
              <label htmlFor={`arr-${slot.id}`}>
                <span className="time-slot-label">{slot.display}</span>
                <span className="time-slot-hours">{slot.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>ราคา</h4>
        <div className="price-range">
          <div className="price-range-inputs">
            <div className="price-input">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="100"
                value={filters.price.min}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />
              <div className="price-value">
                ฿{formatPrice(filters.price.min)}
              </div>
            </div>
            <div className="price-input">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step="100"
                value={filters.price.max}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />
              <div className="price-value">
                ฿{formatPrice(filters.price.max)}
              </div>
            </div>
          </div>
          <div className="price-range-display">
            <span>฿{formatPrice(filters.price.min)}</span>
            <span>ถึง</span>
            <span>฿{formatPrice(filters.price.max)}</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>ระยะเวลาบิน</h4>
        <div className="duration-filter">
          <input
            type="range"
            min={0}
            max={maxDuration}
            value={filters.duration.max}
            onChange={(e) => handleFilterChange('durationMax', e.target.value)}
          />
          <div className="duration-value">
            ไม่เกิน {formatDuration(filters.duration.max)}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>จำนวนแวะ</h4>
        <div className="stops-options">
          <div className="filter-option">
            <input
              type="checkbox"
              id="stops-0"
              value={0}
              checked={filters.stops.includes(0)}
              onChange={() => handleFilterChange('stops', 0)}
            />
            <label htmlFor="stops-0">ไม่แวะ (บินตรง)</label>
          </div>
          <div className="filter-option">
            <input
              type="checkbox"
              id="stops-1"
              value={1}
              checked={filters.stops.includes(1)}
              onChange={() => handleFilterChange('stops', 1)}
            />
            <label htmlFor="stops-1">แวะ 1 ครั้ง</label>
          </div>
          <div className="filter-option">
            <input
              type="checkbox"
              id="stops-2plus"
              value={2}
              checked={filters.stops.includes(2)}
              onChange={() => handleFilterChange('stops', 2)}
            />
            <label htmlFor="stops-2plus">แวะ 2+ ครั้ง</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightFilter;