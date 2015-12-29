# SlugSearch for UCSC

#### Rewriting the current UCSC class search page 


SlugSearch for desktop is an extension of mobile SlugSearch, which is a CMPS 115 Introduction to Software Engineering project for the [Team Hipster group](https://github.com/Andylicious/TeamHipster_IonicSC). The original SlugSearch was written in Ionic, which uses AngularJS for its language of choice. As such, many of the scraping and parsing functions are done using AngularJS, so moving onto the desktop using AngularJS was a time saving effort. 

As such, this project is moving forward using AngularJS and Bootstrap in order to be able to be viewed on the desktop, and better for mobile web views. The Ionic project will be put on hold and will most likely be focused primarily for app deployment in the near future. 

Check out the CMPS115 app project on iOS safari or Chrome/Safari: http://slugsearch.com 

-
**Note:** *SlugSearch is under active development. Anyone is able to contribute and submit pull requests, and those who were interested in being a contributor may email me at ahlien@ucsc.edu 

## Getting Started

**(1)** Clone this repository onto your machine. 

**(2)** Install [node](https://nodejs.org/en/) on your machine

**(3)** Install live-server on your machine by entering the following line on your node shell: `npm install -g live-server`.

**(4)** `cd` into the top-level directory where index.html is located and enter the following command: 

`live-server` 

**(5)** Switch to the developing branch by doing 

`git checkout developing` 

**(6)** Create a new branch of your work by doing 

`git checkout -b TestBranch`

after doing step 5


**(7)** Any changes made to the folder will automatically update the development site. 

**(8)** Tip: Make sure to use the web console to look for flags and updates under the hood, such as what's being delivered to and from the class search server, etc. 

## How to contribute 

Notes: I am unfamiliar with the traditional methodology of open sourced programs, so this README and its intentions are mostly directed towards those who have already contacted me through email or facebook that they are interested in developing for this site. Once I (or any of the contributors) know how to develop a system that can work for any UCSC contributor, we will definitely start implementing them! Call this unorthodox for the year :D! 


**(1)** Check out the TODOs at the bottom of the page to see what is needed for the site. 

**(2)** Drop some inputs on [![Gitter](https://badges.gitter.im/Andylicious/slugsearch_desktop.svg)](https://gitter.im/Andylicious/slugsearch_desktop?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) and we can get to it! 

**(3)** CONTRIBUTORS! Make sure to do your work on the develop branch and create your own branch marking what you are going to do! 

**(4)** If you're from UCSC and you want to get started, email me at ahlien@ucsc.edu on what you're interested in doing. I'm also down for a quick skype/googlehangouts if you want to learn a step-by-step on how to get started, and we can move forward from there! 

**(5)** Report all issues [here](https://github.com/Andylicious/slugsearch_desktop/issues/new)

Note: Live site will reflect the master branch on www.slugsearch.com, so far the site reflects the CMPS 115 project, but once a few key TODOs have been completed, I will be migrating the files over to www.slugsearch.com 

## Developing 

Most of the logic is in script.js where all the configs and controllers are. The file is (thankfully!) coded in a way that makes it easier to read on Sublime text where you can just collapse all the controllers and configs so you can easily get to where you want to go. all of the *_service.js and *.controllers.js were migrated from the CMPS115 project, and are, in theory, fully done and not needed to be worked on further. 

courseData, sharedLinks, sharedProf, and sharedProperties are data structures I used that were relevant from the CMPS 115 project and can be done a bit better, if you're wondering what they were. 

Most development for the core slug search functionality will be under script.js and the html files. 

## How the application works currently 

**(1)** index.html includes script.js, which details the routing specifics. 

**(2)** home.html is dependent on pisaController, which calls pisaparser_service for the GET request to our course resources 

**(3)** The application calls on my server that behaves as a POST request proxy that sends our json to the UCSC Course [pages](https://pisa.ucsc.edu/class_search/) 

**(4)** Through a couple of javascript and angularJS parsing, we display all of our results in the results page. 


##TODOs
Each TODO is going to be categorized by a three-scale difficulty system, EASY, INTERMEDIATE, ADVANCED. Of course, difficulty level is entirely subjective and I could be placing it in an arbitrary system, but the first iteration of the TODO will be for myself and others if they need to see a high-level on what's there to do for the slugsearch project. 

Note, for the ADVANCED section, be sure to email me what you're doing! 

- EASY
 - Make the results page look prettier, an example is found in the Enrolled/Capacity block of HTML
 - Make the home page look prettier.
 - Add a [spinner](http://plnkr.co/edit/BGLUYcylbIVJRz6ztbhf?p=preview) after you press the submit button. 
 - Update the README.md to look better and be more concise. 
 - Populate the About page and the Contact page with more information
- INTERMEDIATE
 - Fix the problem where if you try to make the window smaller, the Table titles get reduced to a "Enrolled/Cap...". 
 - When you refresh the page, go back to home. 
 - UI/UX changes. (A little ambiguous, but I've spent a good 20+ hours trying to get Material Design (like AngularMaterial and AngularBoostrap) to work on the page, but I've settled for normal bootstrap to get the functionality down before design, so if anyone's down to help me on the UI/UX, that'd be awesome! )
 - Add an [Aside](http://mgcrea.github.io/angular-strap/#/asides) so that we can start branching off to more functionality. 
- ADVANCED 
 - Migrate from hrefs to states so that when we go back to Home from Results, we still get 
 - Able to add UI that gets more information for each class can be displayed on either a [modal](http://mgcrea.github.io/angular-strap/#/modals) or a new page. 
 - RateMyProfessor functionality (I've actually already written on for the CMPS115 project, so this will definitely be a must to recreate for Desktop!) 
 - Able to post reviews through the site itself. (Probably going to use GunDB for that one..)
 - Use the Loop bus GPS tracker to write a web app that displays loop bus information. (Make sure not to copy SlugRoute, message me at ahlien@ucsc.edu if you want to help with this.)
 - Dining Hall web scraper (Yes, there's tons of these on the app store, but I'm anticipating this would be a useful functionality for the site. ) 
 - Employee Request system web scraper 
 - Anything else? Email/Contact me!




## Tech involved 
- [Smart Table](http://lorenzofox3.github.io/smart-table-website/)
- [Selectize](https://brianreavis.github.io/selectize.js/)

## Contributor Acknowledgements 

All contributors will be acknowledged here! 

