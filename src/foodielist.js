$(document).ready(function() {
  var resultsCount = 0;
  var resultsCountLimit = 50;
  var location = {lat: 34.123123, lng: -118.174470};
  
  var map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 15,
    disableDefaultUI: true
  });
  
  function displayMap() {
    var searchRequest = {
      location: location,
      radius: '5000',
      type: 'restaurant'
    };
    
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(searchRequest, getResults);
  }
  
  function getResults(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (pagination.hasNextPage) {
        pagination.nextPage();
      }
      
      for (var i = 0; i < results.length; i++) {
        // console.log(results[i]);
                
        var resultID = {
          placeId: results[i].place_id
        };
        
        service = new google.maps.places.PlacesService(map);
        service.getDetails(resultID, displayResults);
      }
      
      resultsCount += results.length;
      // console.log(resultsCount);
      
    } else {
      return;
    }
  }
  
  function displayResults(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      
      var schedule = "";
      
      // console.log(place.opening_hours.weekday_text.length);
      
      if (place.opening_hours !== undefined) {
        for (var i = 0; i < place.opening_hours.weekday_text.length; i++) {
          schedule += place.opening_hours.weekday_text[i] + "<br>";
        }
      } else {
        schedule += "Hours Not Available";
      }
      
      var resultsItemTemplate = "<li class='search-results__list-item'><div class='search-results__list-item-title'>"+ place.name +"</div><div class='search-results__list-item-rating'>"+ place.rating +"</div><div class='search-results__list-item-days'>"+ schedule +"</div><button class='search-results__list-item-button search-results__list-item-button--add'>Add to Schedule</button><button class='search-results__list-item-button search-results__list-item-button--remove'>X</button></li>";
      
      $('.search-results__list').append(resultsItemTemplate);
      bindButtons();
    } else {
      return;
    }
  }
  
  function unbindButtons() {
    $('.search-results__list-item-button--add').off('click');
  }
  
  function bindButtons() {
    unbindButtons();
    
    $('.search-results__list-item-button').on('click', function() {
      
      if ($(this).hasClass('search-results__list-item-button--add')) {
        var resultsItem = $(this).parent();
        var resultsItemInnerHTML = resultsItem.html();
        var scheduleItemHTML = "<li class='schedule__list-item'>"+ resultsItemInnerHTML +"</li>";
        
        if (!$('.schedule').hasClass('schedule--filled')) {
          $('.schedule').addClass('schedule--filled');
        }
        
        $('.schedule__list').append(scheduleItemHTML);
        resultsItem.addClass('hidden');
      }
      
      if ($(this).hasClass('search-results__list-item-button--remove')) {
        $(this).parent().remove();
      }
      
    });
  }
  
  // function unbindScheduleButtons() {
  //   
  // }
  // 
  // function bindScheduleButtons() {
  //   unbindScheduleButtons();
  // }
  
  displayMap();
});