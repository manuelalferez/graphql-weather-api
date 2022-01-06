const axios = require("axios");
const { UserInputError } = require("apollo-server");
const LAT = "47.5584";
const LON = "7.5733";
const WEATHER_API_BY_SEVEN_DAYS = `https://api.openweathermap.org/data/2.5/onecall?appid=${process.env.KEY}`;
const WEATHER_API_BY_NAME = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.KEY}`;

const resolvers = {
  Query: {
    getCityByName: async (obj, args, context, info) => {
      // name is required | country and config are optional
      const { name, country, config } = args;
      let urlByName = `${WEATHER_API_BY_NAME}&q=${name}`;

      // Add other fields if possible
      if (country) urlByName = urlByName + `,${country}`;
      if (config && config.units)
        urlByName = urlByName + `&units=${config.units}`;
      if (config && config.lang) urlByName = urlByName + `&lang=${config.lang}`;
      try {
        let { data, status } = await axios.get(urlByName);
        const dataByName = data;

        // By default, any invalid country code is ignored by the API
        // In this case, the API returns data for any city that matches the name
        // To prevent false positives, an error is thrown if country codes don't match
        if (country && country.toUpperCase() !== data.sys.country) {
          throw new UserInputError("Country code was invalid", {
            invalidArgs: { country: country },
          });
        }

        let urlBySevenDays = `${WEATHER_API_BY_SEVEN_DAYS}&lat=${data.coord.lat}&lon=${data.coord.lon}`;
        data = await axios.get(urlBySevenDays);
        const dataBySevenDays = data;

        return {
          id: dataByName.id,
          name: dataByName.name,
          country: dataByName.sys.country,
          coord: dataByName.coord,
          today: {
            summary: {
              title: dataByName.weather[0].main,
              description: dataByName.weather[0].description,
              icon: dataByName.weather[0].icon,
              pressure: dataBySevenDays.data.current.pressure,
              sunrise: dataBySevenDays.data.current.sunrise,
              sunset: dataBySevenDays.data.current.sunset,
              humidity: dataBySevenDays.data.current.humidity,
              visibility: dataBySevenDays.data.current.visibility,
            },
            temperature: {
              actual: dataByName.main.temp,
              min: dataByName.main.temp_min,
              max: dataByName.main.temp_max,
            },
            wind: {
              speed: dataBySevenDays.data.current.wind_speed,
            },
            timestamp: dataBySevenDays.data.current.dt,
          },
          lastSevenDays: dataBySevenDays.data.daily.map((item) => {
            return {
              summary: {
                title: dataByName.weather[0].main,
                description: dataByName.weather[0].description,
                icon: dataByName.weather[0].icon,
                pressure: dataBySevenDays.data.current.pressure,
                sunrise: dataBySevenDays.data.current.sunrise,
                sunset: dataBySevenDays.data.current.sunset,
                humidity: dataBySevenDays.data.current.humidity,
                visibility: dataBySevenDays.data.current.visibility,
              },
              temperature: {
                actual: dataByName.main.temp,
                min: dataByName.main.temp_min,
                max: dataByName.main.temp_max,
              },
              wind: {
                speed: dataBySevenDays.data.current.wind_speed,
              },
              timestamp: dataBySevenDays.data.current.dt,
            };
          }),
        };
      } catch (e) {
        return e;
      }
    },
  },
};

module.exports = {
  resolvers,
};
