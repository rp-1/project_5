// http://jsfiddle.net/JMPerez/0u0v7e1b/

function ViewModel() {
    var self = this;
    self.places = ko.observableArray([]);

    self.searchString = ko.observable();    // what user entered in search field
    self.map = null;
    
    // Called when an li item is clicked in the main places list
    self.placeListClicked = function(placeClicked) {
        console.log("Place clicked");
        console.log(placeClicked.name);
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
        // Create the html content for the infoWindow
        var mapImg = "https://maps.googleapis.com/maps/api/staticmap?center=" + place.marker.getPosition().lat() + "," + place.marker.getPosition().lng() + "&zoom=20&size=400x400&maptype=hybrid"
        
        var markerContent = "<div class='info-window'><h3>" + place.name + 
            "</h3><img class='info-img' src='" + 
            mapImg + "'><p>" + place.marker.description + "</p>";
        
        if(!self.infoWindow) {
            self.infoWindow = new google.maps.InfoWindow();
        }
        
        self.infoWindow.setContent(markerContent);
        self.infoWindow.open(this.map, place.marker);

    };
    
    this.updatePlaceList = function(places2show) {
        console.log("IN UPDATE PLACE LIST: " + places2show);
        for(var i = 0; i < places2show.length; i++) {
            var htm = "<li>" + places2show[i].name + "</li>";
            $("#place-list").append(htm);
        }
    }
        
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