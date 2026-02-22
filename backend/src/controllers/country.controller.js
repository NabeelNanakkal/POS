import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as countryService from '../services/country.service.js';

export const getAllCountries = asyncHandler(async (req, res) => {
  const countries = await countryService.getAllCountries();
  res.json(ApiResponse.success({ count: countries.length, countries }));
});

export const getCountryById = asyncHandler(async (req, res) => {
  const country = await countryService.getCountryById(req.params.id);
  res.json(ApiResponse.success(country));
});

export const getCountryByCode = asyncHandler(async (req, res) => {
  const country = await countryService.getCountryByCode(req.params.code);
  res.json(ApiResponse.success(country));
});
