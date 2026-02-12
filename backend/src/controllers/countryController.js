import Country from '../models/Country.js';

// Get all countries
export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find()
      .select('country flag iso2 iso3 currency phoneCode')
      .sort({ country: 1 });

    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries,
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching countries',
      error: error.message,
    });
  }
};

// Get country by ID
export const getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);

    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found',
      });
    }

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching country',
      error: error.message,
    });
  }
};

// Get country by ISO code
export const getCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const country = await Country.findOne({
      $or: [
        { iso2: code.toUpperCase() },
        { iso3: code.toUpperCase() },
      ],
    });

    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found',
      });
    }

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching country',
      error: error.message,
    });
  }
};
