##UDACITY FRONT END NANODEGREE PROJECT 5
###Find Your Fire: The hottest hot chicken in Nashville

###Purpose:
This project is designed to showcase several web technologies all working together
to provide users with a useful, enjoyable experience.

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
The web page is designed to deliver maximum utility for users of all devices. So we have kept
graphics and design elements to a minimum.

However, the page should be appealing, so we're using a distinctive color palette and a custom
Google Maps color scheme for an appealing, branded look and identity.

The key elements should be quickly and easily obtained. Key elements are defined as:
- Restaurant name
- A picture of the restaurant
- Restaurant address
- Restaurant phone number
- Yelp rating of restaurant (number of stars, total reviews)
- A snippet from the latest Yelp review
- A link to yelp for the restaurant page on Yelp

Some of these restaurants don't have web pages. And many of the ones that do, have very poorly
designed, clumsy sites that make it difficult to find the info you need. So Yelp is the perfect
destination in which to send visitors seeking more information or, say, a pdf of a menu.

We have used media queries to determine what should be shown on what device. For smaller
devices, particularly mobile, we have further simplified the page by removing the list (via CSS)
of restaurants. This greatly increases the utility of the app without any signficiant loss of 
functionality. I can still search by restaurant name interactively. I can still directly
select restaurants on the map.

###Marketing:
In order to make the page "pay for itself" (and hopefully then some), we will investigate the possiblity
of adding sponsored restaurants. Instead of just a banner ad or something that would detract from the
user experience, we might consider highlighting sponsored restaurants in the list, perhaps with a blurb
or "daily specials" link beneath the restaurant name.

To attract users to the site, we will do the usual social and blog posts. We should make sure that any
article that talks about Hot Chicken has a link to Find Your Fire. Additionally, we can develop our own
ads that create interest and inpire use of the site.

A sample banner headline: "That's not your mouth watering. It's your tastebuds sweating." Then we bring up
site info "Who has the hottest hot chicken in Nashville? Find out at FindYourFire.com"

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


