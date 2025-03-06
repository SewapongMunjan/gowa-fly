const Flight = require('../models/Flight');
const aviationApi = require('../utils/aviationApi');

/**
 * Search flights
 * @route GET /api/flights/search
 * @access Public
 */
exports.searchFlights = async (req, res) => {
    try {
        const { from, to, date, returnDate, passengers, cabinClass } = req.query;
        
        // Validate required parameters
        if (!from || !to || !date) {
            return res.status(400).json({ 
                message: 'กรุณาระบุสนามบินต้นทาง, สนามบินปลายทาง และวันที่เดินทาง' 
            });
        }

        // Search flights from API
        const apiResponse = await aviationApi.searchFlightsByRoute(from, to, date);
        
        if (!apiResponse.data || apiResponse.data.length === 0) {
            return res.status(404).json({ message: 'ไม่พบเที่ยวบินที่ตรงกับเงื่อนไขการค้นหา' });
        }

        // Transform API data to our model format
        const flights = apiResponse.data.map(apiFlightData => 
            aviationApi.transformFlightData(apiFlightData)
        );

        // If return flight is requested, search for return flights
        let returnFlights = [];
        if (returnDate) {
            const returnApiResponse = await aviationApi.searchFlightsByRoute(to, from, returnDate);
            
            if (returnApiResponse.data && returnApiResponse.data.length > 0) {
                returnFlights = returnApiResponse.data.map(apiFlightData => 
                    aviationApi.transformFlightData(apiFlightData)
                );
            }
        }

        res.status(200).json({
            success: true,
            count: flights.length,
            returnFlightsCount: returnFlights.length,
            flights,
            returnFlights
        });
    } catch (error) {
        console.error('Search flights error:', error);
        res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการค้นหาเที่ยวบิน', 
            error: error.message 
        });
    }
};

/**
 * Get flight details
 * @route GET /api/flights/:id
 * @access Public
 */
exports.getFlightDetails = async (req, res) => {
    try {
        const flightId = req.params.id;
        
        // Try to find in our database first
        let flight = await Flight.findOne({ apiFlightId: flightId });
        
        // If not found in DB, fetch from API
        if (!flight) {
            const apiResponse = await aviationApi.getFlightById(flightId);
            
            if (!apiResponse.data || apiResponse.data.length === 0) {
                return res.status(404).json({ message: 'ไม่พบเที่ยวบิน' });
            }
            
            const flightData = aviationApi.transformFlightData(apiResponse.data[0]);
            
            // Save to our database for future requests
            flight = await Flight.create(flightData);
        }
        
        res.status(200).json({
            success: true,
            flight
        });
    } catch (error) {
        console.error('Get flight details error:', error);
        res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเที่ยวบิน', 
            error: error.message 
        });
    }
};

/**
 * Get popular routes
 * @route GET /api/flights/popular
 * @access Public
 */
exports.getPopularRoutes = async (req, res) => {
    try {
        // This would typically come from analytics data
        // For demo purposes, we'll return hardcoded popular routes
        const popularRoutes = [
            {
                from: {
                    city: 'กรุงเทพ',
                    airport: 'สุวรรณภูมิ',
                    iataCode: 'BKK',
                    country: 'ไทย'
                },
                to: {
                    city: 'เชียงใหม่',
                    airport: 'ท่าอากาศยานเชียงใหม่',
                    iataCode: 'CNX',
                    country: 'ไทย'
                },
                price: 1590,
                imageUrl: 'https://source.unsplash.com/800x600/?chiangmai'
            },
            {
                from: {
                    city: 'กรุงเทพ',
                    airport: 'สุวรรณภูมิ',
                    iataCode: 'BKK',
                    country: 'ไทย'
                },
                to: {
                    city: 'ภูเก็ต',
                    airport: 'ท่าอากาศยานภูเก็ต',
                    iataCode: 'HKT',
                    country: 'ไทย'
                },
                price: 1890,
                imageUrl: 'https://source.unsplash.com/800x600/?phuket'
            },
            {
                from: {
                    city: 'กรุงเทพ',
                    airport: 'สุวรรณภูมิ',
                    iataCode: 'BKK',
                    country: 'ไทย'
                },
                to: {
                    city: 'โตเกียว',
                    airport: 'นาริตะ',
                    iataCode: 'NRT',
                    country: 'ญี่ปุ่น'
                },
                price: 15900,
                imageUrl: 'https://source.unsplash.com/800x600/?tokyo'
            },
            {
                from: {
                    city: 'กรุงเทพ',
                    airport: 'สุวรรณภูมิ',
                    iataCode: 'BKK',
                    country: 'ไทย'
                },
                to: {
                    city: 'สิงคโปร์',
                    airport: 'ชางงี',
                    iataCode: 'SIN',
                    country: 'สิงคโปร์'
                },
                price: 6900,
                imageUrl: 'https://source.unsplash.com/800x600/?singapore'
            },
            {
                from: {
                    city: 'กรุงเทพ',
                    airport: 'สุวรรณภูมิ',
                    iataCode: 'BKK',
                    country: 'ไทย'
                },
                to: {
                    city: 'ฮ่องกง',
                    airport: 'เช็กแลปก๊ก',
                    iataCode: 'HKG',
                    country: 'ฮ่องกง'
                },
                price: 8500,
                imageUrl: 'https://source.unsplash.com/800x600/?hongkong'
            },
            {
                from: {
                    city: 'กรุงเทพ',
                    airport: 'สุวรรณภูมิ',
                    iataCode: 'BKK',
                    country: 'ไทย'
                },
                to: {
                    city: 'โซล',
                    airport: 'อินชอน',
                    iataCode: 'ICN',
                    country: 'เกาหลีใต้'
                },
                price: 11900,
                imageUrl: 'https://source.unsplash.com/800x600/?seoul'
            }
        ];
        
        res.status(200).json({
            success: true,
            count: popularRoutes.length,
            routes: popularRoutes
        });
    } catch (error) {
        console.error('Get popular routes error:', error);
        res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเส้นทางยอดนิยม', 
            error: error.message 
        });
    }
};

/**
 * Get flight status
 * @route GET /api/flights/status/:flightNumber
 * @access Public
 */
exports.getFlightStatus = async (req, res) => {
    try {
        const { flightNumber } = req.params;
        
        if (!flightNumber) {
            return res.status(400).json({ message: 'กรุณาระบุหมายเลขเที่ยวบิน' });
        }
        
        const apiResponse = await aviationApi.searchFlightByNumber(flightNumber);
        
        if (!apiResponse.data || apiResponse.data.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลเที่ยวบิน' });
        }
        
        const flightData = aviationApi.transformFlightData(apiResponse.data[0]);
        
        res.status(200).json({
            success: true,
            flight: flightData
        });
    } catch (error) {
        console.error('Get flight status error:', error);
        res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถานะเที่ยวบิน', 
            error: error.message 
        });
    }
};