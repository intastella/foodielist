$(document).ready(function() {
  var defaultLocation = {lat: 37.293042, lng: -121.934290}; // ID TECH
  var geolocation;
  var autocomplete;
  var searchPlace;
  var searchMap;
  var resultsItem;
  var modalObject;
  var scheduleItemHTML;
  
  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
        initDefaultMap();
      }, geoErrors);
    }
  }
  
  function geoErrors(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        initDefaultMap();
        break;
      case error.POSITION_UNAVAILABLE:
        initDefaultMap();
        break;
      case error.TIMEOUT:
        initDefaultMap();
        break;
      case error.UNKNOWN_ERROR:
        initDefaultMap();
        break;
    }
  }
  
  function initDefaultMap() {
    if (geolocation === undefined) {
      geolocation = defaultLocation;
    }
    
    // Default Map
    var defaultMap = new google.maps.Map(document.getElementById('map'), {
      center: geolocation,
      zoom: 15,
      disableDefaultUI: true
    });
    
    initSearch(geolocation);
  }
  
  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-input-field'), {
      types: ['geocode']
    });
    
    autocomplete.addListener('place_changed', getPlaceAndSearch);
  }
  
  function getPlaceAndSearch() {
    searchPlace = autocomplete.getPlace();
    initSearch(searchPlace.geometry.location);
  }
  
  function initSearch(LatLng) {
    $('.search-results__list').empty();
    $('.search-results__loading').addClass('search-results__loading--visible');
    
    searchMap = new google.maps.Map(document.getElementById('map'), {
      center: LatLng,
      zoom: 10,
      disableDefaultUI: true
    });
    
    var searchRequest = {
      location: LatLng,
      radius: '10000',
      type: 'restaurant'
    };
    
    var service = new google.maps.places.PlacesService(searchMap);
    service.nearbySearch(searchRequest, getResults);
  }
  
  function getResults(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
    
      
      if (pagination.hasNextPage) {
        pagination.nextPage();
      } else {
        $('.search-results__loading').removeClass('search-results__loading--visible');
      }
      
      for (var i = 0; i < results.length; i++) {
        // console.log(results[i]);
        var resultID = {
          placeId: results[i].place_id
        };
        
        service = new google.maps.places.PlacesService(searchMap);
        service.getDetails(resultID, displayResults);
      }
    } else {
      return;
    }
  }
  
  function displayResults(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var name = "Name not available";
      var rating = "Rating not available";
      var photo = "<i class='fa fa-camera search-results__list-item-image-icon'></i>";
      
      if (place.name !== undefined) {
        name = place.name;
      }
      
      if (place.rating !== undefined) {
        rating = place.rating;
      }
      
      if (place.photos !== undefined) {
        var photoURL = place.photos[0].getUrl({ 'maxWidth': 130, 'maxHeight': 130 });
        
        if (photoURL !== undefined) {
          photo = "<img src='"+ photoURL +"'>";
        }
      }
      
      var schedule = "Open: ";
      var scheduleAllDays = false;
      
      if (place.opening_hours !== undefined) {
        var activeClass = " search-results__list-item-schedule-day--active";
        var activeMon = "";
        var activeTues = "";
        var activeWed = "";
        var activeThur = "";
        var activeFri = "";
        var activeSat = "";
        var activeSun = "";
        for (var i = 0; i < place.opening_hours.periods.length; i++) {
          if (place.opening_hours.periods[i].open.day === 0 && place.opening_hours.periods[i].open.time === '0000') {
            scheduleAllDays = true;
          } else {
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
        }
        
        if ((activeMon !== "" && activeTues !== "" && activeWed !== "" && activeThur !== "" && activeFri !== "" && activeSat !== "" && activeSun !== "") || scheduleAllDays === true) {
          schedule = "Open every day";
        } else {
          schedule += "<span class='search-results__list-item-schedule-day"+ activeMon +"'>M</span>"; 
          schedule += "<span class='search-results__list-item-schedule-day"+ activeTues +"'>T</span>"; 
          schedule += "<span class='search-results__list-item-schedule-day"+ activeWed +"'>W</span>"; 
          schedule += "<span class='search-results__list-item-schedule-day"+ activeThur +"'>T</span>"; 
          schedule += "<span class='search-results__list-item-schedule-day"+ activeFri +"'>F</span>"; 
          schedule += "<span class='search-results__list-item-schedule-day"+ activeSat +"'>S</span>"; 
          schedule += "<span class='search-results__list-item-schedule-day"+ activeSun +"'>S</span>";
        }
      } else {
        schedule = "Schedule Not Available";
      }
      
      var resultsItemTemplate = "";
      resultsItemTemplate += "<li class='search-results__list-item' data-place-id='+"+ place.place_id +"'>";
        resultsItemTemplate += "<div class='search-results__list-item-image'>";
          resultsItemTemplate += photo;
        resultsItemTemplate += "</div>";
        resultsItemTemplate += "<div class='search-results__list-item-info'>";
          resultsItemTemplate += "<div class='search-results__list-item-title'>"+ name +"</div>";
          resultsItemTemplate += "<div class='search-results__list-item-rating'>"+ rating +"</div>";
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
      bindAddButtons();
    } else {
      return;
    }
  }
  
  function unbindAddButtons() {
    $('.search-results__list-item-button--add').off('click');
  }
  
  function bindAddButtons() {
    unbindAddButtons();
    
    $('.search-results__list-item-button--add').on('click', function() {
      resultsItem = $(this).closest('.search-results__list-item');
      var resultItemPlaceID = resultsItem.data('place-id');
      var resultsItemInnerHTML = resultsItem.html();
      scheduleItemHTML = "<li class='schedule__list-item' data-place-id="+ resultItemPlaceID +">"+ resultsItemInnerHTML +"</li>";
      
      if (!$('.schedule').hasClass('schedule--filled')) {
        $('.schedule').addClass('schedule--filled');
      }
      
      modalObject = $('.modal');
      modalObject.find('.modal__place').html(scheduleItemHTML);
      modalObject.addClass('modal--open');
      
      setTimeout(function(){
        modalObject.addClass('modal--visible');
      }, 10);
    });
  }
  
  function unbindRemoveButtons() {
    $('.search-results__list-item-button--remove').off('click');
  }
  
  function bindRemoveButtons() {
    unbindRemoveButtons();
    
    $('.search-results__list-item-button--remove').on('click', function() {
      var targetItem = $(this).closest('.schedule__list-item');
      var targetOriginal = targetItem.data('place-id');
      $('.search-results__list').find('[data-place-id="' + targetOriginal + '"]').removeClass('hidden');
      targetItem.remove();
    });
  }
  
  geolocate();
  initAutocomplete();
  
  $('.search__schedule-button').click(function() {
    $('.schedule').addClass('schedule--active');
  });
  
  $('.schedule__header-close').click(function() {
    $('.schedule').removeClass('schedule--active');
  });
  
  $('.modal__close').click(function() {
    modalObject.addClass('modal--closed');
    
    setTimeout(function() {
      modalObject.removeClass('modal--closed modal--visible modal--open');
    }, 250);
  });
  
  $('.modal__list-item-button').click(function() {
    var targetDay = $(this).data('target-day');
    resultsItem.addClass('hidden');
    $('.schedule__list-day--'+ targetDay).append(scheduleItemHTML);
    modalObject.addClass('modal--closed');
    
    setTimeout(function() {
      modalObject.removeClass('modal--closed modal--visible modal--open');
      
      setTimeout(function() {
        $('.search__schedule-button-inner').addClass('search__schedule-button-inner--pulse');
        
        setTimeout(function() {
          $('.search__schedule-button-inner').removeClass('search__schedule-button-inner--pulse');
        }, 1000);
      }, 100);
    }, 250);
    
    bindRemoveButtons();
  });
});