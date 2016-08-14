$(document).ready(function() {
  var map;
  var request;
  var resultTemplate;

  function initMap() {
    var pyrmont = {lat: -33.867, lng: 151.195};

    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });
    
    request = {
      location: pyrmont,
      radius: '500',
      query: 'restaurant'
    };
    
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  }
  
  initMap();
  
  function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    } else {
      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
        resultTemplate = "<li><div class='search-results__list-item-title'>"+ results[i].name +"</div><div class='search-results__list-item-rating'>"+ results[i].rating +"</div></li>";
        
        $('.search-results__list').append(resultTemplate);
      }
    }
  }
});