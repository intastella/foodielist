$(document).ready(function() {
  var location = {lat: 34.123123, lng: -118.174470};
  var paginationButtonVisible = false;
  
  var map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 15,
    disableDefaultUI: true
  });
  
  function displayMap() {
    var searchRequest = {
      location: location,
      radius: '10000',
      type: 'restaurant'
    };
    
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(searchRequest, getResults);
  }
  
  function getResults(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (pagination.hasNextPage) {
        pagination.nextPage();
        paginationButtonVisible = true;
      }
      
      for (var i = 0; i < results.length; i++) {
        // console.log(results[i]);    
        var resultID = {
          placeId: results[i].place_id
        };
        
        service = new google.maps.places.PlacesService(map);
        service.getDetails(resultID, displayResults);
      }
    } else {
      return;
    }
  }
  
  function displayResults(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var photo = "<i class='fa fa-camera search-results__list-item-image-icon'></i>";
      
      if (place.photos !== undefined) {
        var photoURL = place.photos[0].getUrl({ 'maxWidth': 130, 'maxHeight': 130 });
        
        if (photoURL !== undefined) {
          photo = "<img src='"+ photoURL +"'>";
        }
      }
      
      var schedule = "";

      if (place.opening_hours !== undefined) {
        var activeClass = " search-results__list-item-schedule-day--active";
        var activeMon = "";
        var activeTues = "";
        var activeThur = "";
        var activeFri = "";
        var activeSat = "";
        var activeSun = "";
        for (var i = 0; i < place.opening_hours.periods.length; i++) {
          switch (place.opening_hours.periods[i].open.day) {
            case 0:
              activeMon = activeClass;
              break;
            case 1:
              activeTues = activeClass;
              break;
            case 2:
              activeWed = activeClass;
              break;
            case 3:
              activeThur = activeClass;
              break;
            case 4:
              activeFri = activeClass;
              break;
            case 5:
              activeSat = activeClass;
              break;
            case 6:
              activeSun = activeClass;
              break;
          }
        }
        schedule += "<span class='search-results__list-item-schedule-day"+ activeMon +"'>M</span>"; 
        schedule += "<span class='search-results__list-item-schedule-day"+ activeTues +"'>T</span>"; 
        schedule += "<span class='search-results__list-item-schedule-day"+ activeWed +"'>W</span>"; 
        schedule += "<span class='search-results__list-item-schedule-day"+ activeThur +"'>T</span>"; 
        schedule += "<span class='search-results__list-item-schedule-day"+ activeFri +"'>F</span>"; 
        schedule += "<span class='search-results__list-item-schedule-day"+ activeSat +"'>S</span>"; 
        schedule += "<span class='search-results__list-item-schedule-day"+ activeSun +"'>S</span>"; 
      } else {
        schedule = "Schedule Not Available";
      }
      
      var resultsItemTemplate = "";
      resultsItemTemplate += "<li class='search-results__list-item'>";
        resultsItemTemplate += "<div class='search-results__list-item-image'>";
          resultsItemTemplate += photo;
        resultsItemTemplate += "</div>";
        resultsItemTemplate += "<div class='search-results__list-item-info'>";
          resultsItemTemplate += "<div class='search-results__list-item-title'>"+ place.name +"</div>";
          resultsItemTemplate += "<div class='search-results__list-item-rating'>"+ place.rating +"</div>";
          resultsItemTemplate += "<div class='search-results__list-item-schedule'>"+ schedule +"</div>";
        resultsItemTemplate += "</div>";
        resultsItemTemplate += "<div class='search-results__list-item-action'>";
          resultsItemTemplate += "<button class='search-results__list-item-button search-results__list-item-button--add'>";
            resultsItemTemplate += "<i class='fa fa-calendar-check-o' aria-hidden='true'></i>Add";
          resultsItemTemplate += "</button>";
          resultsItemTemplate += "<button class='search-results__list-item-button search-results__list-item-button--remove'>";
            resultsItemTemplate += "<i class='fa fa-calendar-times-o' aria-hidden='true'></i>Remove";
          resultsItemTemplate += "</button>";
        resultsItemTemplate += "</div>";
      resultsItemTemplate += "</li>";
      
      $('.search-results__list').append(resultsItemTemplate);
      if (paginationButtonVisible === true) {
        $('.search-results__show-more').addClass('search-results__show-more--visible');
      }
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
        var resultsItem = $(this).closest('.search-results__list-item');
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
  
  
  var autocomplete;

  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-input-field'), {
      types: ['geocode']
    });
    
    autocomplete.addListener('place_changed', fillInAddress);
  }

  function fillInAddress() {
    var place = autocomplete.getPlace();
  }
  
  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }
  
  displayMap();
  initAutocomplete();
  
  $('.search__schedule-button').click(function() {
    $('.schedule').addClass('schedule--active');
  });
  
  $('.schedule__header-close').click(function() {
    $('.schedule').removeClass('schedule--active');
  });
  
  $('#autocomplete').on('focus', function(){
    geolocate();
  });
});