import Country from '../models/country.model.js';
import ApiError from '../utils/ApiError.js';

export const getAllCountries = async () => {
  return Country.find().select('country flag iso2 iso3 currency phoneCode').sort({ country: 1 });
};

export const getCountryById = async (id) => {
  const country = await Country.findById(id);
  if (!country) throw ApiError.notFound('Country not found');
  return country;
};

export const getCountryByCode = async (code) => {
  const country = await Country.findOne({
    $or: [{ iso2: code.toUpperCase() }, { iso3: code.toUpperCase() }],
  });
  if (!country) throw ApiError.notFound('Country not found');
  return country;
};
