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
      timestamp
    }
  }
}
```