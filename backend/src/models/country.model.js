import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    flag: {
      type: String,
      required: true,
    },
    iso2: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 2,
    },
    iso3: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 3,
    },
    capital: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    subregion: {
      type: String,
      trim: true,
    },
    population: {
      type: Number,
    },
    area: {
      type: Number,
    },
    languages: [{
      type: String,
    }],
    phoneCode: {
      type: String,
      trim: true,
    },
    timezones: [{
      type: String,
    }],
    currency: {
      name: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
      },
      symbol: {
        type: String,
        required: true,
      },
    },
    tld: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
countrySchema.index({ country: 1 });
countrySchema.index({ iso2: 1 });
countrySchema.index({ iso3: 1 });
countrySchema.index({ 'currency.code': 1 });

const Country = mongoose.model('Country', countrySchema);

export default Country;
