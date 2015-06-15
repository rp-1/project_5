##UDACITY FRONT END NANODEGREE PROJECT 5
###Find Your Fire: The hottest hot chicken in Nashville

###Purpose:
This project is designed to showcase several web technologies all working together
to provide users with a useful, enjoy experience.

###What it does:
This single page web app allows you to browse a map or list of Hot Chicken joints
in Nashville.

Hot Chicken is a relatively new phenomenon in the culinary world. And it was invented
right here in the Music City. You can read blog posts, search Google, etc for Hot Chicken,
but there is currently no easy way to get a quick, throrough snapshot of what your
options are for Hot Chicken in Nashville. Find your Fire fills that void.

###How to use it:
Simply load the index.html file in your browser or visit http://richpaschall.com/dev/hotchicken/

###UX Strategy:
The web page is designed to deliver maximum utility for users of all devices. So graphics, other
than those appearing in the map marker info windows, or superfluous design elements will come between
the user and the information they seek.

However, the page should be appealing, so we're using a distinctive color palette and a custom
Google Maps color scheme have been created.

We have used media queries to determine what should be shown on what device. For smaller
devices, particularly mobile, we have further simplified the page by removing the list (via CSS)
of restaurants. This greatly increases the utility of the app without any signficiant loss of 
functionality. I can still search by restaurant name interactively. I can still directly
select restaurants on the map.

###Technologies used:
Find Your Fire uses the following technologies:
- Google maps api to show on a map all the restaurants that serve Hot Chicken
- Knockout.js for under-the-hood data manipulation (ViewModel)
- Yelp api for retrieving ratings, reviews and info about any given restaurant
- JSON for the actual data (Model)
- JQUERY for various javascript routines
- Javascript
- Css
- Html


