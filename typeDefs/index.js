const { gql } = require("apollo-server");

const typeDefs = gql`
  type City {
    id: ID
    name: String
    country: String
    coord: Coordinates
    today: Weather
    forecastNextDays: [Weather]
  }

  type Coordinates {
    lon: Float
    lat: Float
  }

  type Summary {
    title: String
    description: String
    icon: String
    pressure: Int
    sunrise: Int
    sunset: Int
    humidity: Int
    visibility: Int
  }

  type Temperature {
    actual: Float
    min: Float
    max: Float
  }

  type Wind {
    speed: Float
  }

  type Weather {
    summary: Summary
    temperature: Temperature
    wind: Wind
    timestamp: Int
  }

  input ConfigInput {
    units: Unit
    lang: Language
  }

  type Query {
    getCityByName(name: String!, country: String, config: ConfigInput): City
    getCityById(id: [String!], config: ConfigInput): [City]
  }

  enum Unit {
    metric
    imperial
    kelvin
  }

  enum Language {
    af
    al
    ar
    az
    bg
    ca
    cz
    da
    de
    el
    en
    eu
    fa
    fi
    fr
    gl
    he
    hi
    hr
    hu
    id
    it
    ja
    kr
    la
    lt
    mk
    no
    nl
    pl
    pt
    pt_br
    ro
    ru
    sv
    se
    sk
    sl
    sp
    es
    sr
    th
    tr
    ua
    uk
    vi
    zh_cn
    zh_tw
    zu
  }
`;

module.exports = {
  typeDefs,
};
