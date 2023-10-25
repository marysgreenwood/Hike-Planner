//Project 1 - Team Fabulous
//Selectors for HTML Elements
var userState = document.querySelector("#user-state"); //State search input field
var userPark = document.querySelector("#user-park"); //Park search input field
var userDate = document.querySelector("#user-date"); //Date search input field
var submit = document.querySelector("#submitBtn"); //Submit button for search input fields
var weatherDisplay = document.querySelector("#weather-display"); //Display container for selected day's weather
var resultsDisplay = document.querySelector("#results-display"); //Displays buttons for results
var infoContainer = document.querySelector("#info-container"); //div containing park and weather info

//Variables for calendar
var date = moment().format("YYYY-MM-DD");
var dateMax = moment().add(4, "days").format("YYYY-MM-DD");

//Selectors for park information
var currentTemp = document.getElementById("current-temp");
var currentWind = document.getElementById("current-wind");
var currentHumidity = document.getElementById("current-humidity");
var parkName = document.getElementById("park-name");
var parkLocation = document.getElementById("park-location");
var parkActivities = document.getElementById("park-activities");
// var parkAmenities = document.getElementById("park-amenities");
var parkCode = "";
var parkLat = 0;
var parkLon = 0;
//var parkLink = $('#park-url');

//function to unhide hidden elements

function showElement(elmt) {
  if (elmt.classList.contains("hide")) {
    elmt.classList.remove("hide");
  }
}

//Call to weather API to get forecast
var getWeatherData = function (park) {
  //Weather API stuff
};

//Call to park API to get park info
var getParkData = function (event) {
  event.preventDefault();
  showElement(resultsDisplay);
  var parkName = userPark.value.trim();
  var stateCode = userState.value;
  var stateUrl =
    "https://developer.nps.gov/api/v1/parks?api_key=mQeAwUWTr41jOO5rCy7tm8oFaLVV4kFa7clCHQyI&limit=10&stateCode=" +
    stateCode;
  var parkUrl =
    "https://developer.nps.gov/api/v1/parks?q=" +
    parkName +
    "&api_key=mQeAwUWTr41jOO5rCy7tm8oFaLVV4kFa7clCHQyI&limit=10";
  if (parkName !== "") {
    //Fetch park API when park name is searched
    fetch(parkUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        console.log(parkName);
        resultsDisplay.innerHTML = "";
        for (var i = 0; i < data.data.length; i++) {
          var x = document.createElement("button");
          resultsDisplay.appendChild(x);
          x.innerHTML = data.data[i].fullName;
          x.value = data.data[i].parkCode;
          x.addEventListener("click", function () {
            parkCode = this.value;
            console.log(parkCode);
          });
          x.addEventListener("click", getParkById);
          x.addEventListener("click", getFiveDay);
        }
      })
      .catch(function (error) {
        alert("It didnt work");
      });
  } else if (stateCode !== "") {
    //Fetch park API when state is selected
    fetch(stateUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        console.log(stateCode);
        resultsDisplay.innerHTML = "";
        for (var i = 0; i < data.data.length; i++) {
          var x = document.createElement("button");
          resultsDisplay.appendChild(x);
          x.innerHTML = data.data[i].fullName;
          x.value = data.data[i].parkCode;
          x.addEventListener("click", function () {
            parkCode = this.value;
            console.log(parkCode);
          });
          x.addEventListener("click", getParkById);
          x.addEventListener("click", getFiveDay);
        }
      });
    // .catch(function (error) {
    //   alert('It didnt work');
    // });
  } else {
    console.log("fix it!");
  }
};

//Displays park information to the page
var getParkById = function (event) {
  event.preventDefault();
  showElement(infoContainer);
  var parkCodeUrl =
    "https://developer.nps.gov/api/v1/parks?api_key=mQeAwUWTr41jOO5rCy7tm8oFaLVV4kFa7clCHQyI&limit=1&parkCode=" +
    parkCode;

  //Fetches park info based on specific park code
  fetch(parkCodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      parkLat = data.data[0].latitude;
      parkLon = data.data[0].longitude;
      console.log(parkLat, parkLon);
      parkName.innerHTML = data.data[0].fullName;
      parkLocation.innerHTML =
        "<strong>Address:</strong><br>" +
        data.data[0].addresses[0].line1 +
        " " +
        data.data[0].addresses[0].city +
        ", " +
        data.data[0].addresses[0].stateCode;
      parkActivities.innerHTML = "";
      parkActivities.innerHTML =
        "<strong>Activities:</strong><br>" + data.data[0].activities[0].name;
      for (i = 1; i < data.data[0].activities.length; i++) {
        parkActivities.innerHTML =
          parkActivities.innerHTML + ", " + data.data[0].activities[i].name;
      }
      //parkLink.attr('href', data.data[0].url)

      parkImages = [];
      for (var i = 0; i < data.data[0].images.length; i++) {
        parkImages.push({
          url: data.data[0].images[i].url,
          altText: data.data[0].images[i].altText,
        });
      }
      console.log(parkImages);
      //store carousel items in array
      var slideOne = document.getElementById("first-slide");
      var slideTwo = document.getElementById("second-slide");
      var slideThree = document.getElementById("third-slide");
      var slideFour = document.getElementById("fourth-slide");
      var slides = [slideOne, slideTwo, slideThree, slideFour];
      for (var i = 0; i < slides.length; i++) {
        slides[i].setAttribute("src", parkImages[i].url);
        slides[i].setAttribute("alt", parkImages[i].altText);
      }
    });
};

//Gets five day forecast and displays on the weather display
var getFiveDay = function () {
  var fiveDayApi =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    parkLat +
    "&lon=" +
    parkLon +
    "&units=imperial&appid=44ff41a4d8b49abe43f662ec93cbb1a6";

  fetch(fiveDayApi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (i = 0; i < 40; i += 8) {
        var iconcode = data.list[i].weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
        var weatherDate = data.list[i].dt * 1000;
        var date_ob = new Date(weatherDate);
        var year = date_ob.getFullYear();
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var date = ("0" + date_ob.getDate()).slice(-2);
        var forecastDate = year + "-" + month + "-" + date;
        if (userDate.value === forecastDate) {
          $("#icon").attr("src", iconurl);
          document.getElementById("weather-header").innerHTML =
            "<strong>Forecast for " + forecastDate + "</strong>";
          currentTemp.innerHTML =
            "Temp: " + data.list[i].main.temp + "&deg; fahrenheit";
          currentWind.innerHTML = "Wind: " + data.list[i].wind.speed + "Mph";
          currentHumidity.innerHTML =
            "Humidity: " + data.list[i].main.humidity + "%";
        }
      }
    });
  // // .catch(function (error) {
  // //   alert('It didnt work');
  // })
};

//Saves searched park to local storage
var savePark = function () {
  //Get park name & date
  var stateSearchIndex = userState.selectedIndex;
  var stateSearch = userState[stateSearchIndex].text.trim();
  var parkSearch = userPark.value.trim();
  //Save Date of planned trip
  var datePicker = userDate.value;
  var dateYear = datePicker.slice(0, 4);
  var dateStart = datePicker.slice(5, 10);
  var dateSearch = dateStart + "-" + dateYear;
  var currentSearch = { stateSearch, parkSearch, dateSearch };
  //Save park name to local storage
  if (dateSearch != "" && (stateSearchIndex > 0 || parkSearch != "")) {
    var previousSearches =
      JSON.parse(window.localStorage.getItem("previousSearches")) || [];
    previousSearches.push(currentSearch);
    if (previousSearches.length > 10) {
      previousSearches.shift();
    }
    window.localStorage.setItem(
      "previousSearches",
      JSON.stringify(previousSearches)
    );
  }
};
//display search history
var showSearchHistory = function () {
  var previousSearches =
    JSON.parse(localStorage.getItem("previousSearches")) || [];
  if (previousSearches == []) {
    return;
  } else {
    for (var i = 0; i < previousSearches.length; i++) {
      var searchItem = document.createElement("li");
      searchItem.textContent =
        previousSearches[i].stateSearch +
        previousSearches[i].parkSearch +
        ", " +
        previousSearches[i].dateSearch;
      searchItem.style.listStyle = "none";
      document.getElementById("search-history").appendChild(searchItem);
    }
  }
};

//Updates date on calendar
var updateDate = function () {
  userDate.min = date;
  userDate.max = dateMax;
  document.getElementById("user-date").valueAsDate = new Date();
};

//Listeners for inputs and button clicks
console.log(date);
console.log(dateMax);
console.log(userDate.Value);
updateDate();
showSearchHistory();
submit.addEventListener("click", getParkData);
submit.addEventListener("click", savePark);


