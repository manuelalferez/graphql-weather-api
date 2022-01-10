# 🌦️ GraphQL Weather API
#### A GraphQL Wrapper for the [Open Weather Map API](https://openweathermap.org/api)

Retrieve the current weather for any given city. Since this GraphQL API uses the free-tier of the Open Weather Map API, it is restricted to 60 calls/minute. 

However, feel free to use it for prototyping and demo projects anyways. A live version is available at:

[graphql-weather-api.herokuapp.com](https://graphql-weather-api.herokuapp.com/) 🌈

## How to Use

#### Queries

* getCityByName (`name` *required*, `country` *optional*, `config` *optional*)

*Language and unit system can be specified via `config`.*

#### Example with all weather data

```
query {
  getCityByName(name: "Basel") {
    id
    name
    country
    coord {
      lat
      lon
    }
    today {
      summary {
        title
        description
        icon
        pressure
        sunrise
        sunset
        humidity
        visibility
      }
      temperature {
        actual
        min
        max
      }
      wind {
        speed
      }
      dt
    }
    forecastNextDays {
      summary {
        title
        description
        icon
        pressure
        sunrise
        sunset
        humidity
        visibility
      }
      temperature {
        actual
        min
        max
      }
      wind {
        speed
      }
      dt
    }
  }
}

```

## How to Install

For running this project locally, you must register your own application at [Open Weather Map](https://openweathermap.org/api). Then, create an .env file and add the following variable: `KEY=<YOUR-APP-ID>`

```sh
npm install
npm run dev # Using nodemon for auto-reloading
```
The server starts at http://localhost:4000/


## About

This is a fork on the project of: [https://github.com/konstantinmuenster/graphql-weather-api](https://github.com/konstantinmuenster/graphql-weather-api)
