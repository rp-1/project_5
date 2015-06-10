

function ViewModel() {
    var self = this;
    self.places = ko.observableArray([]);
    self.infoWindows =[];
    self.searchString = ko.observable();    // what user entered in search field
    self.map = null;
    
    // use this for unordered list of places to track last selected entry
    self.lastPlaceSelected = null;
    
    // Called when an li item is clicked in the main places list
    self.placeListClicked = function(placeClicked) {
        // We want to highlight the current selected place in unordered list
        // So we'll want to deselect the previous selection.
        if(self.lastPlaceSelected) {
            self.lastPlaceSelected.isSelected(false);
        }
        placeClicked.isSelected(true);
        self.lastPlaceSelected = placeClicked;
        self.showInfo(placeClicked);
    }

    // called every time a character is added or edited in main search bar
    self.searchString.subscribe(function(value) {

        if (value !== '') {

            for (var i = 0; i < self.places().length; i++) {
                var search_string = value.toLowerCase();
                var full_tag = self.places()[i].name.toLowerCase();
                var tag_array = full_tag.split(" ");
                var matchFound = false;
                for(var x = 0; x < tag_array.length; x++) {
                    if( (tag_array[x].substr(0, search_string.length) == search_string)  || 
                    (full_tag.substr(0, search_string.length) == search_string) ) {
                        matchFound = true;
                        self.places()[i].marker.setMap(self.map);
                        self.places()[i].isActive(true);
                        break;
                    }
                }
                if(!matchFound) {

                        
                    if(self.infoWindows.length > 0) {
                        console.log("SHOULD KILL WINDOW");
                        self.infoWindows[0].close();
                        self.infoWindows.splice(0, self.infoWindows.length);
                        console.log("LENGTH IS NOW " + self.infoWindows.length);
                    }
                  
                    self.places()[i].isActive(false);
                    self.places()[i].marker.setMap(null);
                }
            }
        } else {
            for(var i = 0; i < self.places().length; i++) {
                self.places()[i].marker.setMap(self.map);
                self.places()[i].isActive(true);
            }
        }
    });
    
    self.init = function() {
        

        // load data via jQuery json call
        $.ajax({
            type: "GET",
            url: "data.json",
            async: true,
            dataType: "json",
            success: function(data) {
                // first create map
                self.createMap();
                
                // Add two key properties to array then add each array element
                // to self.places array. Must add these properties here, rather
                // than in map init or things won't bind correctly. Learned the hard way.
                for(var i = 0; i < data.places.length; i++) {
                    var place = data.places[i];
                    
                    // Must make this observable to react to bool condition in html li element
                    place.isActive = ko.observable(true);
                    place.isSelected = ko.observable(false);
                    
                    //var img = "images/icon_pic.png"; // must be location relative to index.html
                    var marker = new google.maps.Marker({position:place.position, name:place.name, description:place.description});
                    marker.image = place.image;
                    marker.setMap(self.map);

                    // Add event listener to capture clicks on individual markers
                    // When clicked, each marker will show info pop up
                    
                    google.maps.event.addListener(marker, 'click', (function(placeCopy) {
                        return function() {
                            self.showInfo(placeCopy);
                        }
                    }) (place));
                    

                    // Make the marker an object of the place object
                    place.marker = marker;
                    self.places.push(data.places[i]);
                }
                
                // Now that we know we have data, create the map
                //self.createMap();
            },
            error: function(obj, textStatus, errorThrown) {
                // TODO: HTML RESPONSE TO USER AND RETURN
                console.log("Error retrieving json file: " + textStatus + " " + errorThrown);
            }
        
            });
    };
    
   
    this.createMap = function() {

        // First set the map options
        var mapOptions = {
            center: {lat: 36.162664, lng: -86.781602},
            zoom: 10,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            }
        }
       
        // Init map with options just created
        self.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        
        // With map created, now we can add markers
        //self.createMarkersFromData();
        
        // Resize map responsively when browser is resized.
        // http://hsmoore.com/blog/keep-google-map-v3-centered-when-browser-is-resized/
        google.maps.event.addDomListener(window, "resize", function() {
            var center = self.map.getCenter();
            google.maps.event.trigger(self.map, "resize");
            self.map.setCenter(center);
        });
    };
    
    this.createMarkersFromData = function() {

        for(var i = 0; i < self.places().length; i++) {

            var place = self.places()[i];
            //var img = "images/icon_pic.png"; // must be location relative to index.html
            var marker = new google.maps.Marker({position:place.position, name:place.name, description:place.description});
            marker.image = place.image;
            marker.setMap(self.map);
            
            // Add event listener to capture clicks on individual markers
            // When clicked, each marker will show info pop up
            google.maps.event.addListener(marker, 'click', (function(markerCopy) {
                return function() {
                    self.showInfo(markerCopy);
                }
            }) (marker));
            
            // Make the marker an object of the place object
            self.places()[i].marker = marker;
            self.places()[i].isActive = ko.observable(false);
            console.log(self.places()[i].isActive());
            
 
        }
        
        
    };
    
    this.showInfo = function(place) {
        console.log("IN SHOWINFO");
        // Create the html content for the infoWindow
        //$('.info-window').html("");
        var markerContent = "<div class='info-window'><h3>" + place.name + 
            "</h3><img class='info-window-main-img' src='" + 
            place.image + "'></div>";
        /*
        if(!self.infoWindow) {
            self.infoWindow = new google.maps.InfoWindow();
        } else {
            self.infoWindow.close();
            self.infoWindow = null;
            self.infoWindow = new google.maps.InfoWindow();
        }
        */
        console.log("Before for loop infowindows length is " + self.infoWindows.length);
        if(self.infoWindows.length > 0) {
            self.infoWindows[0].close();
            self.infoWindows.splice(0, self.infoWindows.length);
        }
        
        self.infoWindows.push(new google.maps.InfoWindow());
        console.log("INFO WINDOW LENGTH IS " + self.infoWindows.length);
        self.infoWindows[0].setContent(markerContent);
        self.infoWindows[0].open(this.map, place.marker);
        
//http://stackoverflow.com/questions/5416160/listening-for-the-domready-event-for-google-maps-infowindow-class
        // Very first infoWindow would not show ajax content. This is a fix
        google.maps.event.addListener(self.infoWindows[0], 'domready', function() {
            // Pass yelp id from data model AND the dom element you wish to append
            // the yelp info to. Doing this to accomodate instances where we may
            // want yelp info to go somewhere other than an info window. Flexible.
            var domElement = $('.info-window');
            getYelpInfo(place.yelpId, domElement);
        });
        


    };
    
    this.updatePlaceList = function(places2show) {
        for(var i = 0; i < places2show.length; i++) {
            var htm = "<li>" + places2show[i].name + "</li>";
            $("#place-list").append(htm);
        }
    }
        
    self.init();
    

}

function getYelpInfo(placeName, domElement) {

    var auth = {

      consumerKey: "b5sbMuBxHo5ZqlIJJtRxJQ",
      consumerSecret: "z3jXptGnGyBQVMconwRbnELfUaw",
      accessToken: "2iDJU47MJqKTOdO-uNXDLrtI_nrU2_pd",
      accessTokenSecret: "3_S71q7_PYycDDZoDXZoQJ2bEd8",
      serviceProvider: {
        signatureMethod: "HMAC-SHA1"
      }
    };

    var terms = 'http://api.yelp.com/v2/business/' + placeName;

    var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    };

    var params = [];
    params.push(['callback', 'cb']);
    params.push(['oauth_consumer_key', auth.consumerKey]);
    params.push(['oauth_consumer_secret', auth.consumerSecret]);
    params.push(['oauth_token', auth.accessToken]);
    params.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action': terms,
        'method': 'GET',
        'parameters': params
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var pMap = OAuth.getParameterMap(message.parameters);
    pMap.oauth_signature = OAuth.percentEncode(pMap.oauth_signature)


    $.ajax({
      'url': message.action,
      'data': pMap,
      'cache': true,
      'dataType': 'jsonp',
      'jsonpCallback': 'cb',
      'success': function(data, text, XMLHttpRequest) {
          console.log("IN SUCCESS");
          console.log(domElement);
          var html = "<h4>Yelp Reviews</h4>"
          html += "<img src='" + data.rating_img_url + "'>";
          html += data.review_count + " reviews";
        html += "<img src='" + data.image_url + "'>";
          html += "<h5>What they're saying...</h5>";
          html += data.snippet_text;
        $(domElement).append(html);
          //domElement.setContent(html);
      }
    // TODO: HANDLE ERROR 404
    });
}

$(document).ready(function() {
   ko.applyBindings(new ViewModel());
});




function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map-canvas");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
  }
}