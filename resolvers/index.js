const axios = require("axios");
const { UserInputError } = require("apollo-server");
const LAT = "47.5584";
const LON = "7.5733";
const WEATHER_API_BY_SEVEN_DAYS = `https://api.openweathermap.org/data/2.5/onecall?lat=${LAT}}&lon=${LON}&appid=${process.env.KEY}`;
const WEATHER_API_BY_NAME = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.KEY}`;

const resolvers = {
  Query: {
    getCityByName: async (obj, args, context, info) => {
      // name is required | country and config are optional
      const { name, country, config } = args;
      let urlByName = `${WEATHER_API_BY_NAME}&q=${name}`;
      console.log(urlByName);
      // Add other fields if possible
      if (country) urlByName = urlByName + `,${country}`;
      if (config && config.units)
        urlByName = urlByName + `&units=${config.units}`;
      if (config && config.lang) urlByName = urlByName + `&lang=${config.lang}`;
      try {
        const { dataByName } = await axios.get(urlByName);

        if (dataByName == undefined) {
          console.log("Axios didn't fetch anything: dataByName is undefined");
        }

        // By default, any invalid country code is ignored by the API
        // In this case, the API returns data for any city that matches the name
        // To prevent false positives, an error is thrown if country codes don't match
        if (country && country.toUpperCase() !== dataByName.sys.country) {
          throw new UserInputError("Country code was invalid", {
            invalidArgs: { country: country },
          });
        }

        const LAT = dataByName.coord.lat;
        const LON = dataByName.coord.lon;
        let urlBySevenDays = `${WEATHER_API_BY_SEVEN_DAYS}&lat=${LAT}&lon=${LON}`;
        const { dataBySevenDays } = await axios.get(urlBySevenDays);
        console.log("Data by seven days: ");
        console.log(dataBySevenDays);

        return {
          id: dataByName.id,
          name: dataByName.name,
          country: dataByName.sys.country,
          coord: dataByName.coord,
          today: {
            summary: {
              title: dataBySevenDays.current.weather[0].main,
              description: dataBySevenDays.current.weather[0].description,
              icon: dataBySevenDays.current.weather[0].icon,
              pressure: dataBySevenDays.current.pressure,
              sunrise: dataBySevenDays.current.sunrise,
              sunset: dataBySevenDays.current.sunset,
              humidity: dataBySevenDays.current.humidity,
              visibility: dataBySevenDays.current.visibility,
            },
            temperature: {
              actual: dataByName.main.temp,
              min: dataByName.main.temp_min,
              max: dataByName.main.temp_max,
            },
            wind: {
              speed: dataBySevenDays.current.wind_speed,
            },
            timestamp: dataBySevenDays.current.dt,
          },
          lastSevenDays: dataBySevenDays.daily.map((item) => {
            return {
              summary: {
                title: dataBySevenDays.current.weather[0].main,
                description: dataBySevenDays.current.weather[0].description,
                icon: dataBySevenDays.current.weather[0].icon,
                pressure: dataBySevenDays.current.pressure,
                sunrise: dataBySevenDays.current.sunrise,
                sunset: dataBySevenDays.current.sunset,
                humidity: dataBySevenDays.current.humidity,
                visibility: dataBySevenDays.current.visibility,
              },
              temperature: {
                actual: dataByName.main.temp,
                min: dataByName.main.temp_min,
                max: dataByName.main.temp_max,
              },
              wind: {
                speed: dataBySevenDays.current.wind_speed,
              },
              timestamp: dataBySevenDays.current.dt,
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
