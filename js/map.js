

function ViewModel() {
    var self = this;
    self.places = ko.observableArray([]);
    self.infoWindows =[];
    self.infoWindow = null;
    self.searchString = ko.observable();    // what user entered in search field
    self.map = null;
    
    // use this for unordered list of places to track last selected entry
    self.lastPlaceSelected = null;
    self.lastZ = null;
    // Called when an li item is clicked in the main places list
    self.placeClicked = function(placeClicked, event) {
        console.log(event.target);
        self.lastZ = placeClicked.marker.getZIndex();
        // We want to highlight the current selected place in unordered list
        // So we'll want to deselect the previous selection.
        if(self.lastPlaceSelected) {
            self.lastPlaceSelected.isSelected(false);
            self.lastPlaceSelected.marker.setZIndex(self.lastZ);
            console.log("LAST Z IS " + self.lastZ);
        }

        placeClicked.isSelected(true);
        placeClicked.marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        self.lastPlaceSelected = placeClicked;
        self.showInfo(placeClicked);
    }

    // called every time a character is added or edited in main search bar
    self.searchString.subscribe(function(value) {

        if (value !== '') {

            for (var i = 0; i < self.places().length; i++) {
                var search_string = value.toLowerCase().trim();
                // get the whole name of place
                var full_name = self.places()[i].name.toLowerCase();
                
                // split it up into individual words so we can match any term
                var term_array = full_name.split(" ");
                var matchFound = false;
                
                // Iterate through each term in the name looking for a match
                // If match is found show the marker
                for(var x = 0; x < term_array.length; x++) {
                    if( (term_array[x].substr(0, search_string.length) === search_string)  || 
                    (full_name.substr(0, search_string.length) === search_string) ) {
                        console.log("if " + term_array[x] + " equals " + search_string);
                        matchFound = true;
                        self.places()[i].marker.setMap(self.map);
                        self.places()[i].isActive(true);
                        break;
                    }
                }
                
                if(!matchFound) {
                    if(self.infoWindow) {
                        self.infoWindow.close();
                    }
                    self.places()[i].isActive(false);
                    self.places()[i].marker.setMap(null);
                }
            }
        } else {
            for(var i = 0; i < self.places().length; i++) {
                self.places()[i].marker.setMap(self.map);
                self.places()[i].isActive(true);
                self.places()[i].isSelected(false);
            }
        }
    });
    
    self.init = function() {
        
        // Set up some error handling
        window.onerror = function () {
            self.showErrorMsg("GENERAL ERROR");
        }
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
                    var marker = new google.maps.Marker({position:place.position, 
                                name:place.name});
                    
                    marker.image = place.image;
                    marker.setMap(self.map);
                    marker.setZIndex(i);

                    // Add event listener to capture clicks on individual markers
                    // When clicked, each marker will show info pop up
                    google.maps.event.addListener(marker, 'click', (function(placeCopy) {
                        return function() {
                            self.placeClicked(placeCopy);
                            self.showInfo(placeCopy);
                        }
                    }) (place));

                    // Make the marker an object of the place object
                    place.marker = marker;
                    self.places.push(place);
                }

            },
            error: function(obj, textStatus, errorThrown) {
                self.showErrorMsg("JSON READ ERROR");
            }
        
            });
    };
    
   
    self.createMap = function() {

        // First set the map options
        var mapOptions = {
            center: {lat: 36.15546, lng: -86.82967},
            // Style from online style editor: https://snazzymaps.com/style/17/bright-and-bubbly
            styles: [{"featureType":"water","stylers":[{"color":"#19a0d8"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"weight":6}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#e85113"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-40}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#efe9e4"},{"lightness":-20}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"road.highway","elementType":"labels.icon"},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","stylers":[{"lightness":20},{"color":"#efe9e4"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":-100}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"hue":"#11ff00"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"lightness":100}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"hue":"#4cff00"},{"saturation":58}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#f0e4d3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efe9e4"},{"lightness":-10}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"simplified"}]}],
            zoom: 10,
            disableDefaultUI: true,
            pancontrol: false,
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
        
        // Resize map responsively when browser is resized.
        // http://hsmoore.com/blog/keep-google-map-v3-centered-when-browser-is-resized/
        google.maps.event.addDomListener(window, "resize", function() {
            var center = self.map.getCenter();
            google.maps.event.trigger(self.map, "resize");
            self.map.setCenter(center);
        });
    };
    
    
    self.showInfo = function(place) {

        // Create the html content for the infoWindow
        $('.info-window').empty();
        var markerContent = "<div class='info-window'><h3>" + place.name + 
            "</h3><p class='info-window-yelp-rating'></p><img class='info-window-main-img' src='" + 
            place.image + "'><div class='info-window-yelp'>Retrieving Yelp stuff...</div></div>";
        
        if(!self.infoWindow) {
            self.infoWindow = new google.maps.InfoWindow();
        }
        
        self.infoWindow.setContent(markerContent);
        self.infoWindow.open(this.map, place.marker);
        
//http://stackoverflow.com/questions/5416160/listening-for-the-domready-event-for-google-maps-infowindow-class
        // Very first infoWindow would not show ajax content. This is a fix
        google.maps.event.addListener(self.infoWindow, 'domready', function() {
            // Pass yelp id from data model AND the dom element you wish to append
            // the yelp info to. Doing this to accomodate instances where we may
            // want yelp info to go somewhere other than an info window. Flexible.
            var domElement = $('.info-window');
            self.getYelpInfo(place.yelpId, domElement);
        });
    };
    
    self.updatePlaceList = function(places2show) {
        for(var i = 0; i < places2show.length; i++) {
            var htm = "<li>" + places2show[i].name + "</li>";
            $("#place-list").append(htm);
        }
    };
    
    self.showErrorMsg = function(e) {
        var fallbackUrl = "https://www.google.com/search?q=hot+chicken&ie=" +
                "utf-8&oe=utf-8#q=hot+chicken+nashville";
        var html = "<h2>Something ain't right!</h2>";
        html += "<p>An error occurred while retrieving your hot chicken map.</p>";
        html += "<p>Check your connection and please try again.</p>";
        html += "<p>If all else fails, and you've got a serious hankering " +
                "for hot chicken, try <a href='" + fallbackUrl + "'>searching " +
                "for hot chicken on Google</a>";
       $("body").addClass("global-error");
        $(".global-error").html(html);
        console.log(e);
    };
    
    self.getYelpInfo = function(placeName, domElement) {
   
        var auth = {

          myConsumerKey: "b5sbMuBxHo5ZqlIJJtRxJQ",
          myConsumerSecret: "z3jXptGnGyBQVMconwRbnELfUaw",
          myAccessToken: "2iDJU47MJqKTOdO-uNXDLrtI_nrU2_pd",
          myAccessTokenSecret: "3_S71q7_PYycDDZoDXZoQJ2bEd8",
          myServiceProvider: {
            signatureMethod: "HMAC-SHA1"
          }
        };

        var apiUrl = 'http://api.yelp.com/v2/business/' + placeName;

        var accessor = {
          consumerSecret: auth.myConsumerSecret,
          tokenSecret: auth.myAccessTokenSecret
        };

        var params = [];
        params.push(['callback', 'yelpCallback']); // must have this! Or errors.
        params.push(['jsonpCallback', 'yelpCallback']);
        params.push(['oauth_consumer_key', auth.myConsumerKey]);
        params.push(['oauth_consumer_secret', auth.myConsumerSecret]);
        params.push(['oauth_token', auth.myAccessToken]);
        params.push(['oauth_signature_method', 'HMAC-SHA1']);

        var message = {
            'action': apiUrl,
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
            // jsonp does not generate explicit errors that json does. So here is a workaround
            // http://geekswithblogs.net/intermark/archive/2014/03/17/jquery.ajax-datatype-jsonpndasherror-handler-not-called.aspx
            'timeout': 5000, // a lot of time for the request to be successfully completed
            'error': function(x, t, m) {
                console.log("IN ERROR: " + t);
                var placeUrl = "http://www.yelp.com/biz/" + placeName;
                var html = "Error retrieving yelp data.";
                html += "<p>Try visiting <a href='" + placeUrl + "'>yelp</a> to read more.</p>";
                $(".info-window-yelp").html(html);
            },

          //'jsonpCallback': 'yelpCallback',
          'success': function(data, text, XMLHttpRequest) {
              console.log("IN SUCCESS");
              var html = "";
              for(var i = 0; i < data.location.display_address.length; i++) {
                  html += "<p>" + data.location.display_address[i] + "</p>";
              }
              html += "<p>" + data.display_phone + "</p>";
              html += "<hr>";
              html += "<img src='" + data.rating_img_url + "'>";
              html += "<p class='review-text'>" + data.review_count + " reviews on Yelp";
              html += "<h5>What people are saying...</h5>";
              html += '"' + data.snippet_text + '"';
            html += "<p><a href='" + data.url + "'>More from Yelp</a>";
            $(".info-window-yelp").html(html);
          }
    });
};
        
    self.init();
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