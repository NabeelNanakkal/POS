import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetchCountries = async () => {
    try {
        console.log("Fetching all countries from API...");
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data;

        const formattedCountries = countries.map(c => {
            const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : null;
            const currency = currencyCode ? c.currencies[currencyCode] : {};
            
            return {
                country: c.name.common,
                flag: c.flag || "",
                iso2: c.cca2,
                iso3: c.cca3,
                capital: c.capital ? c.capital[0] : "N/A",
                region: c.region,
                subregion: c.subregion,
                population: c.population,
                area: c.area,
                languages: c.languages ? Object.values(c.languages) : [],
                phoneCode: c.idd ? (c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : "")) : "",
                timezones: c.timezones || [],
                currency: {
                    name: currency.name || "",
                    code: currencyCode || "",
                    symbol: currency.symbol || ""
                },
                tld: c.tld ? c.tld[0] : "",
                latitude: c.latlng ? c.latlng[0] : 0,
                longitude: c.latlng ? c.latlng[1] : 0
            };
        }).sort((a, b) => a.country.localeCompare(b.country));

        const fileContent = `export const countriesData = ${JSON.stringify(formattedCountries, null, 2)};`;
        const outputPath = path.join(__dirname, 'src', 'utils', 'countriesData.js');

        fs.writeFileSync(outputPath, fileContent);
        console.log(`Successfully wrote ${formattedCountries.length} countries to ${outputPath}`);

    } catch (error) {
        console.error("Error fetching countries:", error.message);
    }
};

fetchCountries();
