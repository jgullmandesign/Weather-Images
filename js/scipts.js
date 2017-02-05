$(document).ready(function(){
  

  //==============================================================
  // Får ut landet du är i och dess huvudstad från ipapi Api
  
  
  $.getJSON("https://ipapi.co/json/", function(data){
      // Hämtar ut vilket land du befinner dig i med hjlp av ditt ipnummer
      // Sparar landet i variablen country
      var country = data.country;
      // skickar landet till funktionen getCurrentCountryCapitalCity
      getCurrentCountryCapitalCity(country);
    });
  
  function getCurrentCountryCapitalCity(countryCode){
    // Hämtar vilken huvudstad det är i det landet du befinner dig i
    $.get("https://restcountries.eu/rest/v1/alpha?codes=" + countryCode + "", function(data){
      var currentCapitalCity = data[0].capital;
      // skickar huvudstadens namn till getWeather
      getWeather(currentCapitalCity);
    })
  }
  
  

  //==============================================================
  // Får ut väderdatan från apiu Api
  
  
 function getWeather(city){
      // Hämtar vder data från apixus api
    $.get("https://api.apixu.com/v1/forecast.json?key=e5c6bcdb884f449e97904419171101&q=" + city +"&days=5", function(data){

      var weatherType = data.current.condition.text;  // <- Hämtar väder informations text
      var wind = data.current.wind_kph/3.6; // <- Hämtar ut vilken vindhastighet och gör om den till meter/sec
      var windDir = data.current.wind_dir;  // <- Hämtar ut värdet för vilken vindriktning
      var iconType = data.current.condition.code;   //  <-  Hämtar ut vilken icon som är till vädret
      var dayOrNight = data.current.is_day;   //  <-  Hämtar om det är dag eller natt

      $('#city').text(data.location.name);  // <- Skriver ut Huvudstadens namn till id taggen city
      $('#country').text(data.location.country);  // <- Skriver ut Landet till id taggen country
      $('.temp').text(data.current.temp_c); // <- Skriver ut temperaturen till class taggen temp
      $('.description').text(data.current.condition.text);  // <- Skriver ut väder beskrivningen till class taggen description 
      $('.wind').text(wind.toFixed(1)); //  <- Sätter antalet decimaler i vindhastigheten till 1
      
      
      function weatherIcon(iconNumber, dayOrNight){
        // Denna funktionen ändra vder iconen efter vilken typ av vder det är
        for(var i = 0; i < weatherCondition.length; i++){
          // Här kollar man om det är dag eller natt
          if(dayOrNight === 1){
              
            if(iconNumber === weatherCondition[i].code){
              // Här kollar jag om det är tilldelt en väder ikon eller inte
              if($('.weather-icon').has('img')){
                // om det är det så raderas den befintliga
                $('.weather-icon img').remove();
                // och ersätt med den som gäller för stunden
                $('.weather-icon').append('<img src="' + weatherCondition[i].day + '">');
              } else {
                $('.weather-icon').append('<img src="' + weatherCondition[i].day + '">');
              }
            }
          } else {
            // Samma process här fast för om det är natt
            if(iconNumber === weatherCondition[i].code){
              
              if($('.weather-icon').has('img')){
                $('.weather-icon img').remove();
                $('.weather-icon').append('<img src="' + weatherCondition[i].night + '">');
              } else {
                $('.weather-icon').append('<img src="' + weatherCondition[i].night + '">');
              }
            } // <- end if
            
          } // <- end else
        } // <- end for loop
        
      } // <- end function weatherIcon
      
      
      function forecastWeather(icon){
        // Denna funktionen sätter väder ikconen fr komman de dagar
        for(var i = 0; i < weatherCondition.length; i++){

          if(icon === weatherCondition[i].code){
            return weatherCondition[i].day
          }else{
            
          }
        }

      }
      
      
      weatherIcon(iconType, dayOrNight);  // Skickar ikon typ samt om det är natt eller dag för att få ut vilken ikon som skall vara
      getWetherCondition(iconType, dayOrNight);
      getImages(city, dayOrNight);
      getWindDirection(windDir);  // Get the wind direction
      upcomingWeather(iconType); // <- Skickar typ of icon till upcomingWeather
      
      //----------------------------------------
      //  kommande 3 dagars väder

        
        function upcomingWeather(iconType){
          // Funktion för att kolla vilken det kommande vädret är
          var comingDayForecast = "<ul>";

            for(var i = 0; i < data.forecast.forecastday.length; i++){
              //  loopar igenom forcastDay för att få ut vilken ikon som skall användas
              // sätter vilken ikon kod det är till iconTypeForecast
              var iconTypeForecast = data.forecast.forecastday[i].day.condition.code;
              comingDayForecast += "<li>";
              comingDayForecast += '<img src="' + forecastWeather(iconTypeForecast) + '">';
              comingDayForecast += "<h3>" + data.forecast.forecastday[i].date + "</h3>";
              comingDayForecast += '<p class="forecast-temp">' + data.forecast.forecastday[i].day.avgtemp_c + '</p>';
              comingDayForecast += "</li>";
            }
            // Sluter ul taggen
            comingDayForecast += "</ul>";
            // Skriver ut vilken iconkod det är till forecastWeather
            forecastWeather(iconTypeForecast);
            // Skriver ut kommande väder till id taggen comingForecast
            $('#comingForecast').html(comingDayForecast);
        }
        
      
      
    })  // <- end AJAX get function
 }  // <- end getWeather function


 //==============================================================
  
  //  Hämtar ut väderförhållandet
  //  Här får vi ut väderinformationen på svenska
  //  Samt att vi kollar om det är dag eller natt.
  
  function getWetherCondition(code, dayOrNight){
    // apixu api som håller i väderförhållandena på svenska
    $.get("https://www.apixu.com/doc/conditions.json", function(data){
      
      for(var i = 0; i < data.length; i++){
        if(code === data[i].code && dayOrNight === 1){
          $('.description').text(data[i].languages[28].day_text);
        } else if (code === data[i].code && dayOrNight === 0) {
          $('.description').text(data[i].languages[28].night_text);
        }
      }
      //console.log(data);
    })
    
  };
  
 //==============================================================
  
  // Get Flicker Images
  
    
    function getImages(capitalCity){
        // Flickr api hr hämtar vi bilderna 
        var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=9bb1ef3285f869282ecc5e8ff9526ad5&per_page=100&tags=" + capitalCity + "&extras=url_c%2C+url_m%2C+url_q"
        // Här stter vi värder på capitalCity beroende på vad som väljs
        var capitalCity = capitalCity;
        // Här skapar vi en JSON callback funktion
        $.getJSON(url + "&format=json&jsoncallback=?", function(data){

          // Här skapar jag en image array med bilder från flickr som har de mått jag vill ha.
          var imageArray = [];
          for(var i = 0; i < data.photos.photo.length; i++){
            for(var i in data.photos.photo){
              // Här kollar vi så att bild proportionen är 500x333px om det är det så lggs de till i arrayn
              if(data.photos.photo[i].width_m === "500" && data.photos.photo[i].height_m === "333"){
                imageArray.push(data.photos.photo[i].url_m)
              }
            }       
          } // <- end for loop
          
 
          
          var photoHTML = '<ul>';
          
          $.each(imageArray, function(i, photo){
            photoHTML += '<li>';
            
            photoHTML += '<img src="' + photo + '"></li>';
          });
            photoHTML += '</ul>';
          $('#photos').html(photoHTML);
          
        });
      
    };

  
 //==============================================================
  
  //  Huvudstad
  //  Hämtar ut alla länders huvudstad från restcountrys Api
  
  var capitalList = []; // Sparar alla huvudstäder i denna array
  var option = "";  //  Alla select värden sparas i denna variabel
  
  $.get("https://restcountries.eu/rest/v1/all", function(data){
    
    for(var i = 0; i < data.length; i++){
      // Får ut alla huvudstäder och lägger till dem i capitalList
      capitalList.push(data[i].capital);
    };
    
    // Här tar jag bort alla tomma värden.
    capitalList = capitalList.filter(Boolean).sort();

    
    for(var i = 0; i < capitalList.length; i++){
      // Här lägger jag till alla select värden
      option += '<option value="' + capitalList[i] + '">' + capitalList[i] + '</option>';
    };
    
    // Här lägger jag till alla huvudstäder i select boxen
    $('#capitalCitys').append(option);
    
  });  // <--- get request end
  
  // Här uppdateras värdet beroende på vad som väljs i select boxen
  $('#capitalCitys').change(function(){
    var capitalC = $('#capitalCitys').val();
    getWeather(capitalC);
    getImages(capitalC);;
  });
  
  //==============================================================
  // Sid funktionalitet/animationer
  
  // Animera Burger Button
  
  
  $(".container-burger").click(function(){
    $(this).toggleClass("change");
    $('#overlay').toggle("slow", function(){
      
    })
  });
  
  
  // När Siddan Laddar AJAX
  
  $(document).ajaxStart(function(){
    $("#loading-page").show().delay(500);
    $("#overlay").hide();
  });
  
  $(document).ajaxStop(function(){
    $("#overlay").css("display", "flex");
    $("#loading-page").hide().delay(1500);
  });
 
  

});
