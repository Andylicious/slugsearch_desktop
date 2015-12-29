	// create the module and name it SlugSearch
	var SlugSearch = angular.module('SlugSearch', ['ngRoute','ngSanitize','ui.router','ui.select','smart-table','mgcrea.ngStrap']);

	SlugSearch.run(
  [          '$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    }
  ]
)
	// configure our routes
	SlugSearch.config(function($stateProvider,$routeProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/");
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'pisaController'
			})
			.when('/results', {
				templateUrl : 'pages/results.html',
				controller  : 'resultsController'
			})
			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			});

		$stateProvider
			.state("home",{
				url:"/"
			})
			.state("home.results",{
				url:"results"
			})
			.state("about",{
				url:"/about"
			})
			.state("contact",{
				url:"/contact"
			})

	});

	// create the controller and inject Angular's $scope
	SlugSearch.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	});
	SlugSearch.controller('pisaController', function($state, $scope, $http,sharedProperties, PisaService, courseData) {
	  $scope.disabled = undefined;

	  $scope.enable = function() {
	    $scope.disabled = false;
	  };

	  $scope.disable = function() {
	    $scope.disabled = true;
	  };

	  $scope.clear = function() {
	    //$scope.term.selected = sharedProperties.get_term_bind();
	    $scope.term.selected = undefined;
	    $scope.subject.selected = undefined;
	    $scope.reg_stati.selected = undefined;
	    $scope.session.selected = undefined;
	    $scope.generaled.selected = undefined;
	  };

	   $scope.generaleds = [];
	   $scope.generaled = {};
	   
	   $scope.reg_stati = {};
	   $scope.reg_status = [];
	   
	   $scope.session = {};
	   $scope.sessions = [];
	   
	   $scope.term = {};
	   $scope.terms = [];

	   $scope.subject = {};
	   $scope.subjects = [];
	   

	  $scope.submit_classes = function(){
	  	if($scope.term.selected == undefined) sharedProperties.get_term_bind();
	  	else sharedProperties.set_term_bind($scope.term.selected.code);
	  	if($scope.subject.selected == undefined) sharedProperties.get_sub_bind();
	  	else sharedProperties.set_sub_bind($scope.subject.selected.code);
	  	if ($scope.reg_stati.selected == undefined) sharedProperties.get_reg_bind();
	  	else sharedProperties.set_reg_bind($scope.reg_stati.selected.code);
		if($scope.generaled.selected == undefined) sharedProperties.get_ge_bind();
		else sharedProperties.set_ge_bind($scope.generaled.selected.code); 
	    //if($scope.session.selected == undefined) sharedProperties.get_cat_nbr_bind();
	    //else sharedProperties.set_sub_bind($scope.session.selected);
	    console.log($scope.term.selected);
	    console.log(sharedProperties.get_term_bind());

	    var jsonString =
		    "{\"action\":\"" +sharedProperties.get_action()+ "\"," +
		    "\"term_bind\":\"" +sharedProperties.get_term_bind()+ "\"," +
		    "\"reg_bind\":\"" +sharedProperties.get_reg_bind()+ "\"," +
		    "\"sub_bind\":\"" +sharedProperties.get_sub_bind()+ "\"," +
		    "\"cat_op_bind\":\"" +sharedProperties.get_cat_op_bind()+ "\"," +
		    "\"cat_nbr_bind\":\"" +sharedProperties.get_cat_nbr_bind()+ "\"," +
		    "\"title_bind\":\"" +sharedProperties.get_title_bind()+ "\"," +
		    "\"instr_name_bind\":\"" +sharedProperties.get_instr_name_bind()+ "\"," +
		    "\"instr_bind\":\"" +sharedProperties.get_instr_bind()+ "\"," +
		    "\"ge_bind\":\"" +sharedProperties.get_ge_bind()+ "\"," +
		    "\"crse_op_bind\":\"" +sharedProperties.get_crse_op_bind()+ "\"," +
		    "\"crse_from_bind\":\"" +sharedProperties.get_crse_from_bind()+ "\"," +
		    "\"crse_to_bind\":\"" +sharedProperties.get_crse_to_bind()+ "\"," +
		    "\"crse_exact_bind\":\"" +sharedProperties.get_crse_exact_bind()+ "\"," +
		    "\"days_bind\":\"" +sharedProperties.get_days_bind()+ "\"," +
		    "\"times_bind\":\"" +sharedProperties.get_times_bind()+ "\"," +
		    "\"acad_bind\":\""+sharedProperties.get_acad_bind()+"\"}";
	    var jsonObj = JSON.parse(jsonString);
	    var class_data = []
	    //sets up headers for the POST request
		  var posting = $http({
		    method: 'POST',
		    /*posting to /post */
		    url: 'http://198.199.106.134:3412/class',
		    contentType: "text/plain",
		    data: jsonObj
		    })
		  var posting = $http({
        method: 'POST',
	    /*posting to /post */
	    url: 'http://198.199.106.134:3412/class',
	    contentType: "text/plain",
	    data: jsonObj
	    })

	  //if the post request succeeds, we are returned the queried
	  //search page from pisa.ucsc.edu
	    posting.success(function (html) {
	      //sets up parsing variables
	      //console.log(html)
	      if(html.indexOf("Sorry")!=-1){
	        $scope.no_results = "Error: No classes match the criteria"
	      }else{
     
      var tmp = document.implementation.createHTMLDocument();
      tmp.body.innerHTML = html;
      var results = tmp.getElementById('result_table');
      var results_tr = results.getElementsByTagName('tr');
      var course_map;
      var course_id, course_name_short, course_name_long, course_type, course_date, course_time, course_prof;
      var course_cap, course_enrolled, course_avail, course_location;
      var course_links;
      var course_desc;
      var color;
      var course_book_filtered;
      var threshold;


      //results_tr holds the individual class data
      //we propagate our parsing variables with its appropriate
      //inner text
      var regExp = /\(([^)]+)\)/;
      for(var i = 1; i < results_tr.length; i++){
        course_links = results_tr[i].getElementsByTagName('a')[0].getAttribute('href');
        course_books = results_tr[i].getElementsByClassName('SSSBUTTON_CONFIRMLINK')[0].getAttribute('onclick')
        course_books_filtered = regExp.exec(course_books);
        course_id = results_tr[i].getElementsByTagName('td')[0].innerText;
        course_name_short = results_tr[i].getElementsByTagName('td')[1].innerText;
        course_name_long = results_tr[i].getElementsByTagName('td')[2].innerText;
        course_type = results_tr[i].getElementsByTagName('td')[3].innerText;
        course_date = results_tr[i].getElementsByTagName('td')[4].innerText;
        course_time = results_tr[i].getElementsByTagName('td')[5].innerText;
        course_prof = results_tr[i].getElementsByTagName('td')[6].innerText;
        course_cap = results_tr[i].getElementsByTagName('td')[8].innerText;
        course_enrolled = results_tr[i].getElementsByTagName('td')[9].innerText;
        course_avail = results_tr[i].getElementsByTagName('td')[10].innerText;

        //taylor's really fancy color changing code
        //if the course availaility hits a certain point (25% seats remaining),
        //it changes a certain color inside our resultsView
        threshold = course_cap * 0.25;
        if(course_avail == 0){
          color = "red";
        }else if(course_avail > 0 && course_avail < threshold){
          color = "#f39c12"
        }else{
          color = "green"
        }
        course_location = results_tr[i].getElementsByTagName('td')[11].innerText;
        course_map = {course_links, course_name_short, course_name_long, course_id, course_type, course_date, course_time, course_prof, course_cap,
        course_enrolled, course_avail, course_location, color, course_books_filtered};


        //this is our "big" data structure holding all our classes


        class_data.push(course_map);
        ////console.log("----END OF CLASS---")

              }
              }


        $scope.groups = [];
        for(var i = 0; i < class_data.length; i++){
          //here's where i think where we can propagate scope.groups
          var check =
             {name: class_data[i].course_name_short,
             longname: class_data[i].course_name_long,
             type: class_data[i].course_type,
             date: class_data[i].course_date,
             time: class_data[i].course_time,
             prof: class_data[i].course_prof,
             link: class_data[i].course_links,
             book: class_data[i].course_books_filtered[1],
             cap: class_data[i].course_cap,
             link: class_data[i].course_links,
             enrolled: class_data[i].course_enrolled,
             avail: class_data[i].course_avail,
             color: class_data[i].color,
             location: class_data[i].course_location,
             id: i, items:[{subName: 'subbles', subId:'1-2'}]}
             //scope.groups holds our "big" data structure to be
             //used for the ng-repeat inside resultsView
             $scope.groups.push(check);
        }
        console.log($scope.groups);
        courseData.set_pisa($scope.groups);
        $state.go("home.results")
      });

	  $scope.set_link = function(link) {
	    sharedLinks.set_course_link(link);
	  }
	 }
	   PisaService.getPisaFields().then(function(data){
	    console.log(data)
	      $scope.check = data;
	      for(var i = 0; i < data.term_map.term_string.length; i++){
	          $scope.terms[i] = {
	              name: data.term_map.term_string[i],
	              code: data.term_map.term_id[i]
	          }    
	      }
	        for(var i = 0; i < data.reg_status_map.reg_status_string.length; i++){
	          $scope.reg_status[i] = {
	              name: data.reg_status_map.reg_status_string[i],
	              code: data.reg_status_map.reg_status_id[i]
	          }    
	      }
	  for(var i = 0; i < data.subject_map.subject_string.length; i++){
	          $scope.subjects[i] = {
	              name: data.subject_map.subject_string[i],
	              code: data.subject_map.subject_id[i]
	          }    
	      }

	      for(var i = 0; i < data.ge_map.ge_string.length; i++){
	          $scope.generaleds[i] = {
	              name: data.ge_map.ge_string[i],
	              code: data.ge_map.ge_id[i]
	          }    
	      }
	          for(var i = 0; i < data.session_map.session_string.length; i++){
	          $scope.sessions[i] = {
	              name: data.session_map.session_string[i],
	              code: data.session_map.session_id[i]
	          }    
	      }

	     });
    });
    
	SlugSearch.controller('resultsController', ['$scope', 'courseData', function (scope, courseData) {
		//console.log(courseData.get_pisa());
		//$scope.groups = [];

		var course_data = courseData.get_pisa();
		
		//$scope.groups = courseData.get_pisa();
		

	    var
	        nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
	        familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

	    function createRandomItem() {
	        var
	            firstName = nameList[Math.floor(Math.random() * 4)],
	            lastName = familyName[Math.floor(Math.random() * 4)],
	            age = Math.floor(Math.random() * 100),
	            email = firstName + lastName + '@whatever.com',
	            balance = Math.random() * 3000;

	        return{
	            firstName: firstName,
	            lastName: lastName,
	            age: age,
	            email: email,
	            balance: balance
	        };
	    }

			scope.itemsByPage=15;

	    scope.rowCollection = [];
	    for (var j = 0; j < 200; j++) {
	        scope.rowCollection.push(course_data[j]);
	    }
	}]);

	SlugSearch.controller('rowController', function($state,$scope, sharedLinks, sharedProf, courseData) {
		$scope.message = 'Look! I am an about page.';
		$scope.back_button = function(){
			$state.go("home");
		}
		$scope.row_click = function(link,prof,data){
			console.log("Row has been clicked");
			console.log("vm is " + link)

			sharedLinks.set_course_link(link);
		    sharedProf.set_course_prof(prof);
		    sharedLinks.set_books_link(data.book);
		    courseData.set_tmp_course(data);
		}
		
	});


	SlugSearch.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';

	});

	SlugSearch.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

	SlugSearch.filter('propsFilter', function() {
	  return function(items, props) {
	    var out = [];

	    if (angular.isArray(items)) {
	      items.forEach(function(item) {
	        var itemMatches = false;

	        var keys = Object.keys(props);
	        for (var i = 0; i < keys.length; i++) {
	          var prop = keys[i];
	          var text = props[prop].toLowerCase();
	          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
	            itemMatches = true;
	            break;
	          }
	        }

	        if (itemMatches) {
	          out.push(item);
	        }
	      });
	    } else {
	      // Let the output be the input untouched
	      out = items;
	    }

	    return out;
	  }
    });
