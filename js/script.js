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
			.when('/course',{
				templateUrl : 'pages/course.html',
				controller : 'courseController'
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
			.state("course",{
				url:"/course"
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

	SlugSearch.controller('rowController', function($state,$scope,$http, sharedLinks, sharedProf, courseData) {
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
			var labs_arr = [];
			$scope.curr_arr = [];
		    //  console.log(sharedLinks.get_course_link())
    		$http.get(sharedLinks.get_course_link())
    		   .then(function(response){
    		     var tmp = document.implementation.createHTMLDocument();
     		    tmp.body.innerHTML = response.data;
         		//  console.log(tmp.body.innerHTML);
       			var desc_arr = [];
		        var http_arr = [];
		        var desc = tmp.getElementsByClassName('detail_table');
		        //  console.log("Below is the desc");
		        //  console.log(desc)
         
               for(var i = 0; i < desc.length; i++){
                 if(desc[i].innerHTML.indexOf("Description") !=-1){
                 //  console.log("Found the description at index = " + i);
                 var descri = desc[i].getElementsByTagName("td");
                 $scope.description = descri[0].innerHTML
                 }
                 if(desc[i].innerHTML.indexOf("Associated Discussion Sections or Labs") !=-1){
                  var labs_odd = desc[i].getElementsByClassName("odd");
                  var labs_even = desc[i].getElementsByClassName("even");
                  labs_arr.push(labs_odd);
                  labs_arr.push(labs_even);
                 }
                }

			   //console.log(labs_arr.length)
			   var curr_iter = 0;
			   for(var i = 0; i < labs_arr.length; i++){
			     for(var j = 0; j < labs_arr[i].length; j++){
			       var td_elem = labs_arr[i][j].getElementsByTagName("td");
                   $scope.curr_arr[curr_iter] = {   name: td_elem[0].innerHTML,
						                            type: td_elem[1].innerHTML,
						                            date: td_elem[3].innerHTML, 
						                            time: td_elem[4].innerHTML,
						                            instructor: td_elem[5].innerHTML,
						                            location: td_elem[6].innerHTML,
						                            enrolled: td_elem[7].innerHTML,
						                            cap: td_elem[8].innerHTML,
						                            wait: td_elem[9].innerHTML,
						                            waitcapacity: td_elem[10].innerHTML
                   }
                 curr_iter = curr_iter + 1;

                 }
                }
		          //at the very end you want
		          var desc = "" //a very long string
		          var open_or_close ="" //a simple string that indicates if its open or closed
		          var discussion_SECTIONS = "" //get all the discussion sections
		          //and possibly their related enrollment, capacity, status
             });


		  var ratings_prof=["Katznelson, Yonatan","Bauerle, Frank","Quinn, Ralph","Eastman, Mark","Mendes, Bruno","Tantalo, Patrick","Tonay, Veronica","Migliore, Edward","Kaun, David","Aptheker, Bettina","Bhattacharya, Nandini","Zavanelli, Mary","Mackey, Wesley","Schleich, Tom","Roland, Randa","Andrews, Frank","Mitchell, Richard","Dalbey, Mike","Zihlman, Adrienne","Steinacker, Adriane","Marinovic, Baldo","Guerra, Francesca","Palleros, Daniel","Mathiowetz, Dean","Flannery, Mary","Thompson, Bruce","Bowman, Barry","Rothwell, Wendy","Fung, K.C","Berman, Abraham","Shepherd, Robert","Bogomolni, Roberto","Cardilla, Kim","Gamel, Mary-Kay","Martyna, Wendy","Switkes, Eugene","Karlton, Hester","Chude-Sokei, Louis","Crosby, Faye","Moulds, Gerald","Christy, Alan","Kawamoto, Alan","Wirls, Dan","Lasar, Matthew","Calierno, Carlos","Arondekar, Anjali","Gonzalez, Julie","Singaram, Bakthan","Feldman, J.F.","Franca, Paulo","Baker, Mark","Limbrick, Peter","Di Blas, Andrea","Larrabee, Tracy","Lodha, Suresh","Arthur, Derede","Garaud, Pascale","McDowell, Charles","Akhtar, Nameera","Kuttner, Fred","Schliech, Tom","Anderson, Roger","Bernasconi, Claude","Pratkanis, Anthony","Greene, Jody","Roberti, Trevor","Azmitia, Margarita","Haddad, Brent","Mogel, Jen","Isbister, John","Tamkun, John","Coonerty, Ryan","Elbaum, Bernard","Kim, L.S.","Lipschutz, Ronnie","Pandey, Annapurna","Robinson, Forrest","Aladro-Font, Jordi","Catlos, Brian","Habicht-Mauche, Judith","Millhauser, Glenn","Neuman, Dard","Ogren, Linda","Tchamni, Avi","Brahm, Gabe","Delgado, Guillermo","Gong, Allison","Seth, Vanita","Pandey, Triloki","Connery, Chris","Oteng, Maxwell","Simon, Ezequias","Crane, David","Griggs, Gary","Guha Thakurta, Raja","Braslau, Rebecca","Faunce, Biff K.","Leaper, Campbell","Scheie, Danny","Cameron, E","Kamehiro, Stacy","Lunine, Brij","McCloskey, Jim","Tappero, Sue","Tromba, Tony","Campbell, Walter","Field, Rebecca","Gjerde, Per","Haney, Craig","Hunter, Donna","Reinarman, Craig","Yang-Murray, Alice","Bass, Jamey","Dent, Gina","Ellis, Jon","Gomez, J.C.","Rava, Annalisa","Todd, Jude","Wilson, James","Gibbs, Ray","Graham, Paul","Hamilton, Roxanne","Scripture, Dan","Sinervo, Barry","Washburn, Jan","Baumgarten, Murray","Centineo, Giulia","Cope, David","Hinck, Lindsay","Morris, Robin","Bridgeman, Bruce","Fischer, A. E.","Hankamer, Jorge","Morris, Maria","Mostkoff, Peter","Romero, Alvaro","Szasz, Andrew","Thompson, Jill","Cooperstein, Bruce","Elsey, Angela","Hedrick, Charles","Honig, Emily","Parker, Ingrid","Poblete, Juan","Simonton, Katie","Urban, Michael","Walsh, Tom","Bertram, Eva","Carson, Ben","Chen, Nancy","Dunkin, Robin","Gustafson, Irene","Hamel, Gildas","Hastie, Amelie","Todorov, Andrey","Beecher, Jonathan","Dobkin, Carlos","Foley, Kathy","Godzich, Wlad","Gruhn, Isebill","Newberry, Ellen","Pogson, Grant","Polecritti, C. L.","Seymour, Travis","Shaw, Carolyn","Smith, David","Van Gelder, Allen","Wessman, David","Anthony, David","Benjamin, Ilan","Fang, Jerome","Jones, William","Kamakaka, Rohinton","King, Robin","Loik, Michael","Lubeck, Paul","Marotti, William","Schlesinger, Zack","Tamanoi, Hirotaka","Thomas, Megan","Wohlfeiler, Richard","Ash, Doris","Hester, Karlton","Kletzer, Lori","Marion, Justin","Noller, Harry","Perez, Ariel","Roby, Pamela","Wilson, Margaret","Wittman, Donald","Cooper, Catherine","Gallagher, Patty","Kenez, Peter","Knisely, Lindsay","Murray, Derrick","Potts, Donald","Rose, Tricia","Bettie, Julie","Callanan, Maureen","Christianson, James","Crews, Phil","Dorfan, David","Glass, Ronald","Leicester, Marshall","Miller, Ethan","Perera, Nirshan","Saxton, William","Schwartz, Hilde","Steiner, Andrea","Walsh, Carl E.","Abbink, Emily","Bailey, Delbert","Barsimantov, James","Bowin, John","Gil, Ricard","Harding, Susan","Jannarone, Kimberly","Jonas, Suzanne","Leikin, Anatole","Meister, Bob","Rogoff, Barbara","Baden, Bob","Bazeghi, Cyrus","Calsoyas, Candace","Draper, David","Fitzmaurice, Tim","Frisk, Jerome","Frymer, Paul","Hoffman, David","Lim, Yuhon","Miller, Leta","Navarro, Marta","Perla, Hector","Soussloff, Catherine","Zhang, Jin","Ehrhardt, Torsten","Guevara, Dan","Lay, Thorne","Mester, R. Armin","Milligan, Lauren","Neu, Jerome","Thorne, Avril","Winther, Rasmus","Wolf-Meyer, Matthew","Aguirre, Anthony","Barcelo, Brenda","Berger, Martin","Chung, Sandy","Crow, Ben","Feldheim, David","Langridge, Ruth","Lokey, Scott","Marr, Margaret","Schechter, John","Schoenman, Roger","Silver, Kiva","Weaver, Amy","Cooppan, Vilashini","Gaitet, Pascale","Goff, Robert","Lozano, Benjamin","Najera-Rameriez, Olga","Pudup, Mary Beth","Robertson, Dena","Spearot, Alan","Thangavelu, Kirtana","Xu, Bangteng","Abrams, Elizabeth","Bernardi, Giacomo","Brandwajn, Alexandre","Carlstroem, Catherine","Chaufan, Claudia","Cooper, Stewart","Diaz, Maria Elena","Foxtree, Jean","Gillman, Susan","Hendricks, Margo","Horne, Jennifer","Keenan, David","Lee, Jeremy","McWilliams, Mallory","Radhika, Mongia","Scott, William","Wilson, Robert","Wu, Thomas","Ares, Manuel","Brundage, David","Chuang, Patrick","Dean, Carolyn","Fritsch, Greg","Fukurai, Hiroshi","Gerster, Carol","Hutchison, Greta","Kinoshita, Sharon","Lau, Kimberly","McCarthy, Matthew D","Merchant, Tanya","Pasotti, Eleonora","Read, Benjamin","Rexach, Michael","Seara, Ana Maria","Suckiel, Ellen","Sullivan, Bill","Taiz, Lincoln","Achinstein, Betty","Aso, Noriko","Bhalla, Needhi","Burke, Edmund","Cheng, Weixin","Doak, Dan","Errington, Shelly","Flegal, Russell","Fujita, Sakae","Ginzburg, Viktor","Langdale, Allan","O'Neill, Edward","Rossman-Benjamin, Tammi","Sackett, John","Vevea, Jack","Vogt, Steven","Wang, Su Hua","Wells, Gordon","Westerkamp, Lynn","Yildiz, Fitnat","Brenneis, Donald","Brown, M.","Desa, Subhas","Feliu, Veronica","Greider, Brett","Gweon, Gey-Hong","Holsclaw, Doug","Hu, Minghui","Jordan, Leif","Juarez, Chelsey","Kellogg, Doug","Loeffler, Toby","Manduchi, Roberto","Nickell, William","Parmeter, Sarah-Hope","Perry, K.C.","Perry, Katie","Pommerenke, Kai","Tellez, Kip","Archimedes, Sandy","Balakrishnan, Gopal","Basu, Dilip","Bierman, James","Camblin, Caren","Cooper, Scott","Dupuis, Melanie","Fisher, Gary","Grieson, Ronald","Hong, Christine","Jurica, Melissa","Konopelski, Joe","Levine, Bruce","Long, Darrell","Lopez, Leslie","Lyon, Bruce","Montgomery, Ryan","Pedrotti, Ken","Prencipe, Tonia","Ramirez, Catherine","Ramirez, Renya","Yan, Huibin","Zahler, Alan","Aissen, Judith","Arnett, Jeff","Basserman, Gerry","Beal, Tandy","Burton-Carvajal, Julianne","Dunbar, Bill","Elkaim, Gabriel","Fatemi, Farnaz","Hartzog, Grant","Honnef, Theo","Knittle, Elise","Kudela, Rapheal","Ochoa, Marcia","Ortiz, Leo","Otte, Richard","Padgett, Jaye","Pullum, Geoffrey","Rangell, Paul","Schaefer, Neil","Smith, Graeme","Vrielink, Alice","Caldwell, Melissa","Chemers, Michael","Evangelatou, Maria","Ferguson, Joel","Goldfrank, Wally","Gorsky, Suzanne","Harris-Frisk, Judith","Ivey, Linda","Kimball, Julie","Lee, Herbie","Momsen, Dorian","Monroe, Cameron","Pastor, Manuel","Press, Daniel","Scherbart, Ryan","Stamp, Shelley","Sweat, Stephen","Warren, Michael","West, Candace","Alley, Ken","Andrews, Larry","Birnbaum, Raoul","Cordova, Holly","Cox, Guy","Dominy, Nathaniel","Doris, John","Felton, Lori","Galloway, Allison","Garcia-Luna-Aceves, J.J","Gruesz, Kirsten","Hagen, Joy","Hoffman, Ruth","Kottas, Athanasios","Massoud, Mark","Mathews, Andrew","Nielsen, Jason","Pittermann, Jarmila","Ramirez, Paco","Ricco, George","Sanso, Bruno","Selden, Daniel","Shaffer, Scott","Weiss, Peter","White, Judith","Yamashita, Karen","Carter, Sue","Cioc, Mark","Das, Kuntal","Germann, Ken","Grabe, Shelly","Hammack, Phillip","Hershatter, Gail","Hoy, Jocelyn","Huginnie, Yvette","Karplus, Kevin","Kramer, Shawn","Lau, David","Lemansec, Herve","Levinson, Robert","Lunden, Anya","Martinez-Galarce, Marco","Mason, Geoffrey","Massaro, Dominic","Mehta, Rita","Pang, Alex","Quill, Lawrence","Reardon, Jennifer","Renau, Jose","Rodriguez, Abel","Sandoval, Gabriella","Silver, Mary","Storm, Benjamin","Whitehead, Jim","Williams, Terrie","Aizenman, Joshua","Betzer, Sarah","Bryant-Anderson, Rachel","Clapham, Matthew","Cochlin, Rena","Crichton, Eg","Crowson, Jeffery","Davis, Angela","Gonzalez- Pagani, Maria","Gusarson, Donald","Gwyn, Melissa","Haughwout, Margaretha","Jackson, Earl","Jansen, Virginia","Kalantary, Afsaneh","Kletzer, Ken","Klevan, Robert","Larkin, Bruce","Martinez, Alma","Martinez-Echazabal, Lourdes","Nichols, Nick","Ortiz, Paul","Poole, Jennifer","Primack, Joel","Schultz, Dawson","Skenazy, Paul","White, Kim","Zhou, Hong","Atwood, William","Barad, Karen","Bartlett, Lora","Brodie, Jean","Chute, Mahlon","Clear, Annette","Dinishak, Janette","Fisher, Andrew","Frank, Dana","Gifford-Gonzales, Diane","Gonzalez, Jennifer","Guthman, Julie","Heer, Lisa","Heusch, Clemens","Hoffman, Tony","Holman, Ted","Hurtado, Aida","Hutchison, Michael","Kay, Kathleen","Metcalf, J.P.","Michalski, Robert","Musacchio, John","Narayan, Onuttom","Nygaard, L","O'Malley, Gregory","Oprea, Ryan","Petersen, Steve","Ritz, Steve","Rofel, Lisa","Schaar, John","Schlag, Martine","Somers, Robin","Traugott, Mark","Yonge, Christopher","Zachos, James","Bassi, Karen","Blackburn, Courtney","Bulman, George","Frisk, Judith","Hoover, Merrit","Lewis, Debra","McCalman, Phil","Megharbi, Nora","Montgomery, Richard","Prado, Raquel","Ram, Deepak","Robinson, Jonathan","Shibata, Yoshihito","Sinha, Mrinal","Wang, Hong","Wilmers, Chris","Anderson, Mark","Baron, Brandin","Brandt, Scott","Brodsky, Emily","Bullock, Heather","Deutsch, Josh","Edmunds, Kate","Flanagan, Cormac","Foster, Maureen","Fregoso, Rosa-Linda","Haber, Howard","Harrington, David","Kaupp, Jennifer","Males, Mike","Mantey, Patrick","Murray, Soraya","Murray, Steven","Rajan, Ravi","Rivas, Cecilia","Rotkin, Mike","Rubin, Seth","Saposnek, Don","Shakouri, Ali","Silva, Denise","Strome, Susan","Whittaker, S.J.","Zurbriggen, Eileen","Adams, Phil","Borrego, John","Chen, Bin","Christian, Laura","Costa, Daniel","De Alfaro, Luca","Del Carpio, Citlalli","Domhoff, G. William","Farkas, Donka","Friedman, Susan","Gautier, Christiane","Georgiou, George","Gerdes, Ingeborg","Giges, Bob","Hillaker, Todd","Ishibashi, Chiyoko","Jhala, Arnav","Lee, Juhee","Lin, Doug","Linger, Dan","Lord, Chip","Milutinovic, Dejan","Monsen, Katie","Ottemann, Karen","Richards, Alan","Richardson, Daniel","Ryan, Mike","Sack, Warren","Sangrey, Trevor","Stienacker, Adrianne","Stockwell, Bob","Tannenbaum, Julie","Todd, James","Vukovich, Daniel","Yamamoto, Naoko","Abadi, Martin","Abrams, Zsuzsanna","Akeson, Mark","Alley, Jason","Andonian, Krikor","Arzaga, Rich","Bernstein, Rebecca","Caballero-Robb, Maria Elena","Callon, Jack","Chan, Pak","Degarmo, Erica","Eaton, Kent","Erin, Kate","Freeman, Carol","Gleissman, Stephen","Gould, Deborah","Gray, Herman","Greenberg, Miriam","Helmbold, David","Hitchcock, Miriam","Jablonski, Noria","Jeltema, Tesla","Kehler, Edward","Kirk-Clausen, Veronica","Koch, Paul","Krusoe, Nancy","Lynn, Jenny","McKay, Steve","Moodie, Megan","O'Hara, Matthew","Regan, Lisa","Roth, Paul","Rothman, Don","Sanford, Jeremy","Schmidt, Holger","Schwartz, Susan","Sharp, Buchanan","Silleras-Fernandez, Nuria","Swezey, Sean","Takagi, Dana","Tarikh, Ishmael","Taylor, Marcia","Treadwell, Nina","Walton-Hadlock, Steve","Wardrip-Fruin, Noah","Youmans, GM","Zuniga, Martha","Achlioptas, Dimitris","Adams-Kane, J.P","Alvarez, Sonia","Beller, Jonathan","Binder, Caitlin ","Brummel, Nicholas","Burns, Sean","Carroll, Lorentina","Croll, Don","Dine, Michael","Farquhar, Dion","Fitchen, Patti","Francis, Johanna","Friedman, Dan","Gareau, Brian","Gleeson, Shannon","Guthaus, Matthew","Hallinan, Conn","Holl, Karen","Ito, Junko","Jones, Catherine","Koch, Bill","Kotowski, Jan","Langhout, Regina","Lynch, John P.","Marlovits, John","Moody, Ingrid","Moore, Andy","Morse, Margaret","Norris, Lisa","Ouni, Slim","Perry, Pamela","Qing, Jie","Shaw, David","Singh, Nirvikar","Stone, Abraham","Ten Cate, Balder","Terdiman, Dick","Thaler, M","Ursell, Michael","Vazquez, Gustavo","Williams, Susan","Ambutter, Cassie","Anand, Pranav","Archer, Dane","Atkinson, Tyler","Bosso, Bob","Brandt, Kristen","Brasoveanu, Adrian","Castillo, Pedro","Childs, John","Deamer, David","deHaan, Ed","Desjardins, Jacques","Dong, Chongying","Fiore, Giacomo","Frangos, Maria","Gong, Qi","Gray, Chris Hables","Greenberg, Mariam","Hawkes, Ellen","Hoppie, Bryce","Klett, Joseph","Knopf, Jeffrey","Liu, Qiang","Lusztig, Irene","Magnat, Virginie","McKercher, Patrick","Millman, M","Mock, John","Moore, Casey","Moschetti, Thomas","Mulvaney, Dustin","Murai, Emily","Newman, John","Nilsen, Aaron","Nunez, Frank","Profumo, Stefano","Romero-Marco, Alvaro","Silver, M. E.","Tao, Hai","Thorn, David","Todd, Drew","Trifonova, Temenuga","Tromba, Anthony","Tulaczyk, Slawek","Warmuth, Manfred","Whitehead, Nathan","Wilson, Nicole","Woo, Deborah","Yost, Jennifer","Zavaleta, Erika","Zehr, J.P","Zeigler, Nancy","Zyzik, Eve","Ardestani, Ehsan","Arredondo, Gabriela","Barahona, Byron","Boeger, Hinrich","Boltje, Robert","Brooks, George","Bruland, Ken","Bury, Jeffrey","Cailloux, Renee","Campos, Darshan Elena","Cheng, A. (meg)","Crane, Sheila","Davis, James","Detar, Liddy","Edwards, Christopher","Fernando, Mayanthi","Fox, Jonathan","Franko, Mark","Hannah, H.L.","Hicks, Michael","Issa, Nouma","Jackson, Chris","Liu, Rosa","Longo, Philip","Longo, Regina","McGuire, Grant","Mohammad, K. Silem","Morton, Michelle","Musch, Kim","Noren (kramer), Shawn","Olsen, Brad","Peffer, John","Rabkin, Sarah","Ravelo, A. Christina","Rountree, Cathleen","Sahota, Guriqbal","Samuels, Jessica","Schonbek, Maria","Schumm, Bruce","Sher, Alexander","Sloan, Lisa","Stoller, N","Tassio, Michael","Terhaar, Terry","Tomlinson, Jack","Torres-Mateluna, Ricard","V, Natasha","Watts, Lewis","Weissman, Martin","White, Aaronette","Williams, Quentin","Yeakel, Justin","Young, Gary","Aldrich, Eric","Amis, Margaret","Anderson, E.W.","Beal, Amy","Beem, Lucas","Bridges, F.","Byrne, Catherine","Camps, Manel","Carr, Emily","Carter, Steve","Clarke, Duncan","Daniel, Sharon","Derr, Jennifer","Deutsch, Nathaniel","Domhoff, Joel","Dommel, Hans Peter","Fazzino, J.M","Flanagan, Veronica","Flinspach, Susan","Fritz, Donald","Fusari, Margaret","Gilbert, Greg","Goff, Lynda","Halk, Erica","Handschuh, Catherine","Hogan, T","Hoy, David","jacobs, Rebecca","Kingsbury, Donald","Laughlin, Greg","LU, Flora","Meininger, Aaron","Mendoza, Barbara","Moses, Kalema","Obrazcka, Katia","Pack, Larry","Paterson, Susan","Patton, Gary","Poynor, Valerie","Pratorius, Chris","Ramos-Castro, .","Ravenna, Federico","Sandovalhernandez, Jesus","Schaeffer-Grabiel, Felicity","Shanbrom, Corey","Smith, James","Stephens, Elizabeth","Stevens, Elizabeth","Strayer, R.W.","Thorsett, Stephen","Trujillo, Larry","Tsing, Anna","Tzankova, Zdravka","Warburton, Edward","Wong, Tiffany","Xifara, Tatiana","Zwald, Zachary","Abraham, Ralph","Bachman, Erik","Bloch, Stefano","Brahinsky, Joshua","Chen, Jia-Yuh","Darling, Janina","Engel, Braden","Estes, James","Fairlie, Robert","Fardis, Armin","Felix, Adrian","Fletcher, Allie","Gorry, Christopher Aspen","Isaacs, James","Juan, Gomez","Kidd, Brian","Kuchta, Shawn","Kuskey, Jessica","Landau, Greg","Lauderdale, Todd","Letourneau, Deborah","Levin, Rachel","Lieber, Jeffrey","Lonetree, Amy","LY, Boreth","Melillo, Stephanie","Mori, Cindy","Nauert, Paul","Osbourne, Scott","Paiement, Nicole","Palafox, Jose","Pease-Alvarez, Cindy","Petrie, Alan","Polecritti, Cindy","Price, Darby","Puragra, Raja","Ritola, Tonya","Rockosi, Connie","Rosen, Oren","Ruben, Giulia","Saltikov, Chad","Schalk, Terry","Schoenfeld, Vera","Shastry, Sriram","Springer, Melanie","Stone, Victoria","Sumarna, Undang","Supina, P. D.","Tan, Wang-Chiew","Varma, Anujan","Watkins, Zachary","Watson, Mary Virginia","Werner, Linda","Williams, Donald","Yost, Megan","Zhitomirskii, Michail","Atkinson, Charles","Beard, Jessica","Bennett, Elizabeth","Bernick, David","Brown, George","Carroll, Ryan","Castillo-Trelles, Carolina","Daehnke, John","Davis, Bill","Dewey, Rachel","Dlugosch, Katrina","Durand, Alice","Fankushen, Jesse","Franco, Jamie","Glatzmaier, Gary","Hancock, Quentin","Hay, John","Hibbert-Jones, Dee","Johnson, Robert Preston","Kallay, Geza","Kanagawa, Katie","Keilen, Sean","Khan, Aliyah","Kilpatrick, Marm","Konomi, Emiko","Linington, Roger","Londow, David","Mackey, Nathaniel","Maginnis, Patrice","Martin, Laura","Millard-Ball, Adam","Morrissey, Nicolas","Moss, John","Nava, Steve","Osorio, Ernestina","Pagani Gonzalez, Maria Victoria","Parekh, Surya","Payne, Cynthia","Perks, Micah","Pluhar, Chris","Polyzotis, Neoklis","Quaid, Andrea","Ralston, Amy","Reti, Jay","Ritscher, Lee","Sadjadpour, Hamid","Scheese, Emily","Schrader, Sarah","Shapiro, Lauren","Shemek, Deanna","Shin, Sangho","Shotwell, Allison","Siegel, Sheilah","Sison Mangus, Marilou","Skardon, John","Sloan-Pace, Emily","spagnolo, Francesco","Stratton, Carra","Tajima, Bohn","Teichroeb, Julie","Terrell, Sue","Vandenberg, Phil","Wagers, Matt","Wang, Yiman","Weygandt, Clara","Yasur-Landau, Assaf","Young, Peter","Zavella, Patricia","Abdelaaty, Lamis","Akella, Ram","Atanasoski, Neda","Balmforth, Niel","Banuelos, LU","Belanger, Dave","Belenkiy, Max","Blackmore, Chelsea","Buchanan, Noah","Bunch, George","Candiani, Vera","Carr, Mark","Chemers, Martin","Chen, Christopher","Chen, Shaowei","Cheung, Y.","Chin, Tammy","Coffman, Chris","Cole, Ethan","Cooper, Anna","Cooper, Natalie","Coronado, Amena","Cortés, Jorge","Craighead, Tim","Cuthbert, David","Daccarett, Paula","Davidenko, Nicolas","Drum, Meredith","Ezerova, Maria","Farhadian, Thea","Fernald, Julian","Fortney, Jonathan","Freccero, Carla","Freeman, Maria","Frick, Winifred","Furniss, Amy","Galuszka, Frank","Gaunt, Joshua","Gordon, June","Gu, Grace","Hanks, Brian","Hendren, Stacey","Hollander, Eli","Hourigan, Jeremy","Isaacson, Michael","Jacobs, Jason","Jones, Ian","Jordan, John O.","Kahana, Jonathan","Kelly, Lindsay","Krosoe, Nancy","Ku, Jacqueline","Kubby, Joel","Kurniawan, Sri","Leiva, Fernando","Lim, Jamus Jerome","Locks, Norman","Lombardi, Amy","Lowe, Todd","Mascharak, Pradip","McDade, Jennie","Mercado, Angelo","Moberg-Robinson, Emily","Moschkovich, Judit","Najarro, Adela","Naschel, Larry","O'Neil, Deva","Parker, Jennifer","Pizzuti, Grace","Poulsen, Melissa","Rich, Ruby","Rifaqat, Zeb","Riordan, Michael","Rodriguez, Jason","Rosenzweig, Laura","Ryan, Beth","Segal, Louis","Snickars, E","Stone, Michael","Suazo, Matt","Thometz, Nicole","Tucey, Cynthia","Turnbull, Stephen","Veenstra, Kerry","Walker, Marilyn","Walsh, Judy","Waters, Christina","Wecksler, Aaron","Zepeda, Susy","Zhang, YI","Aguilera, Elizabeth","Anderson, Clarissa","Antrobus, Roz","Archer, Nicole","Armstead, James","Aspaugh, Erik","Benito-Menendez, Paula","Berman, Nathaniel","Bivens, Hunter","Brose, Margaret","Bunch, Roger","Burman-Hall, Linda","Conard, Kristen","Conge, Patrick","Connelly, Sean","Coulter, Steven","Crofts, Scott","D'Amore, Antonia","Dasgupta, Samit","Deal, Amy Rose","Deich, Molly","Dooley, Michael","Duane, Timothy","Dudley, Sherwood","Falcón, Sylvanna","Fiber, Jeannie","Fox, Laurel","Franzell, Kathryn","Fribley, Benjamin","Gavande, Gabriela","Gillon, Sean","Heald, Abigail","Helmer, Kimberly","Hobbs, Gary","Jackson Jr., Earl","Keagy, Rini","Kephart, Curtis","Kingdon, Russel","Kiziltan, Bulent","Knacke, Roger","Koo, David","Kramer, Alexandra","Kumar, Mythili","La Berge, Michele","Lancaster, Helen","Laskin, Lee","Lee, Jimin","Love, Alan","Martinez-Guerrero, Olga","Mason, Jeff","McDonald, William","McWhite, Karen Francis","Medeiros, Tom","Migler-Vondollen, Theresa","Miller, Tyrus","Moglen, Helene","Mohammed, Teresa Pane","Moore, Jonathan","Mortensen, Kaija","Muldawer, Dave","Mullane, Carol","Nickel, Barry","Noe, Alva","Osborn, ED","Paik, Jee","Panayotova, Dora","Perry, Kathleen","Peterson, Maya","Pursley, Darlene","Rettus, Sara","Rigelhaupt, Jess","Sanders-Self, Melissa","Scala, Mark","Schatz, Kate","Sellin, Yara","Shin, Cecil","Silver, Eli","Stewart, Glenn","Stoddard, Trish","Takahashi, Robin","Talton, Jerry","Tombari, Joseph","Tsethlikai, Monica","Turchin, Julie","Whitworth, Paul","Widamin, Jean","Wood, Andrew","Zuo, Yi","Archer, Cam","Athens, Alison","Bacon, Christopher","Bakker, Sarah","Berman-Hall, Linda","Berney, Apryl","Boykoff, Max","Bravo De Guenni, Lelys","Brown Childs, John","Clementz, Mark","Coe, Robert","Crichton-Driera, Michael","Dierkes, Ulrich","Donaldson, Bryan","Donohue, Cathryn","Epstein, Barbara","Erickson, Shelley","Esfarjani, Keivan","Fitzsimmons, Margaret","Fox-Dobbs, Kena","Friedlander, Benjamin","Fruhling, Zachary","Gail, Geraldine","Gaytan, Marie Sarita","Gee, Allison","Glesser, Adam","Guo, Owen","Haas, Lisbeth","Hays, Cynthia","Hays, Shannon","Hirsch, Daniel","Hope-Parmeter, Sarah","Jin, Michael","Jin, Yishi","Kersey, Jon","Kim, Audrey","Kim, Hi Kyung","Kim, Jungmi","Klahn, Norma","Kuhn, Carey","Kurnoff, Shirley","Lariviere, Jonathan","Leslie, Juliana","Lindemann, Kristy","Liu, Wentai","Lo, Hui-Chi","Lonergan, Julia","Lowell, Karen","Marks, Christopher","Martinez, Carolina","Mateas, Michael","McClure, Conor","McDonald, Willaim","McKinley, Kyle","Michelman, Scott","Mosqueda, Eduardo","Mossoti, Travis","Mullin, Terry","Nakahara, Tamao","Nishimura, Yoko","Noyes, Chad","obrien, Greg","Omid, Mohamadi","Orlandi, Nicoletta ","Paradise, James","Paytan, Adina","Pearson, Erik","Peterson, Tawnya","Pohl, Ira","Racelis, Alex","Radmacher, Kim","Redfern, Terry","Reichart, Isabel","Remak-Honnef, Elizabeth","Roos, Elaine","Rutherford, Danilyn","Saijo, Hikaru","Sarran, Marina","Schafer, Andrew","Schuetze, Craig","Sen Gupta, Abhijit","Shapiro, Helen","Shennan, Carol","Sher, Anna","Solomon, Danny","Sommer, Ulrickson","Stuart, Josh","Sullivan, Elaine","Tabing, Felicia","Tamas, Melissa","Toosarvandani, Maziar","Trumbull, Robert","Tsai, Yen-Ling","Valdez, Kinan","Vigilant, Veronica","Vogel, Erin","Weitsman, Jonathan","Whitley-Putz, Lene","Williams, Franklin","Williamson, Stanley","Woosley, Stanford","Wu, Ting Ting","Wu, Yuefeng","Adler, Les","Aguirre, Cara","Akca, Ozden","Albright, Adam","Amador, Sarah","Anjaria, Jon","Appleton, Jon","Axarlian, Gabriel","Axel, Brian","Baldini, Donna","Bearns, Stuyvesant Galard","Berman, Phillip","Blood, H.Christian","Bourgain, Marina","Buck, R.F.","Burton, Kia P.","Bustillos, Ernesto","Byrd, Christy","Campbell, Jeremy","Carlise, Charles","Cauchon, Benjamin","Chan, Stephanie","Chatfield, Melissa","Chennells, Anthony","Chin, Angelina","Ching, Vignette","Chisholm, Andrew","Crook, Peter","Cummings, Justin","D'Harcourt, Ashlynn","Dalle-Ore, Christina","Day, Alex","De La Rosa, Gabriela","Delgado, Grace","Delunas, Andrew","Dimock, Chase","Elsea, Peter","Ferree, Patrick","Fiddmont, Valerie","Finberg, Keegan","Fitzgerald, Joe","Foley, Mary","Forsberg, Camilla","Garcia, Martin","Gomoll, Lucian","Haussler, David","Hawley, Kate","Hoechst, Heidi","Holocher, Paul Alexander","HU, Litze","Hugginie, Yvette","Inciarte, Monique","Jesse, Alexandra","Jewell, Leila","Johnson, Tyler","Keep, Rene","Kelso, Dennis","Kent, Patrick","Kirchner, Jesse","Koopman, Colin","Krumholz, Mark","Kudela, Raphael","Kusic-Heady, Kristen","Lehrer, Tom","Lewis, Danielle","Li, Yat","Lortie, Marie","Los Huertos, Marc","Lovett, Nicholas","Loving, Joleen","Lyness, Claire","Magee, Michael","Mangel, Marc","Mason, Stacey","McGranahan, Lucas","McMahon, Kelton","McMillen, Jennifer","Meister, Robert","Meites, Noah","Menendez, Jonathan","Michals, Sarah","Monroy, Liza","Moriarty, Eugene","Morris, Eli","Narasimhan, Ravi","Narath, Albert","Nitz, Frederic","Noren-Kramer, Shawn","Nygreen, Kysa","Okamoto, Shigeko","Pagani Gonzalez, Victoria","Partch, Carrie","Paulson, Justin","Peterschmidt, Megan","Petersen, Luba","Polansky, Larry","Porter, Eric","Pourmand, Nader","Prelinger, Richard","Prochaska, J.X.","Radovan, Amy","Raimondi, Pete","Ramirez, Christopher","Rees, Clea","Roberts, Elizabeth","Rosen, Jacob","Rosenblum, Bruce","Rowe, Christie","Rudolph, Matthew","Ruiz, Susana","Samokhina, Natalya","Sampath, Raj","Sanders, Daniela","Saya, Suleman","Schein, Rebecca","Schiffrin, Andrew","Schilz, Lisa","Scott, Judy","Scott, Suzanne","Shawn, Jerome","Shawn, Kramer","Spanbock, Benjamin","Stein-Rosen, Galia","Stucky, Amy","Sudan, Toufic","Talamantes, Frank","Teodorescu, Mircea","Thomas, Jake","Thomas, Monika","Thompson, Liana","Turner, Dan","Vangelder, Alan","Venegas, Yolanda","Vesco, Shawna","Vesecky, John","Wales, Sandra","Williams, David","Wilson, Carter","Yahm, Sara","Zeamer, Charlotte","Allen, Terry","Aproberts-Warren, Maggie","Araujo, Steven","Arulanantham, E.","Baker, Judith","Banks, Thomas","Bayne, Melissa","Beitiks, Emily","Bjorland, Clayton","Blahetka, Russ","Blumenfeld, Lev","Boal, Iain","Botsford, Lydia","Breakspear, Anthony","Britton, Emma","Brooks, E.L.","Buck, Zoe","Caballero, Julian","Cabot, Heath","Caple, Zachary","Carberry, Mira","Cardenas, Roosbelinda","Carlise, Chuck","Cohen, Whitney","Collins, Lindsey","Contos, Paul","Cook, Mea","Corbett, Rebecca","Cortella, Anne","Cruz, Cindy","Cummins, Eric","Curtiss, Casey","Delaney, Peggy","Denner, Jill","Dolan, Alicia","Engineer, Urmi","Erai, Michelle","Eric, Scott","Fajardo, Kale","Farkas, Donka","Fatemi, Tara","Feld, Ari","Finkelstein, Myra","Foster, Sesshu","Franc, Cameron","Frazier, Melissa","Garrick-Bethell, Ian","Gerloff, Dietlind","Gomez-Rivas, Camilo","Goodman, David","Goodman, Rachel","Gorden, Kea","Green, Cynthia","Green, Erik","Green, Richard Ed","Groppi, Karen","Halk, Erica","Halpern, Rob","Hansen, Bob","Heald, Abigail","Helou, Ariane","Herold, Kara","Hughey, Richard","Hwang, Clifford","Jacobson, Brianna","Jech, Dawn","Jones, Charlotte","Kar, Rosie","Karr, Kendra","Kaur, Inderjit","Kendall, Jake","Kinney, Edith","Kulikov, Dmitry","Lally, Katie","Lau, Kimberly","Laws, Kenneth","Leal, Enrique","London, Rebecca","Lopez, Marcos","Madar, Heather","Malone, Laur","Martineau, Katherine","Matera, Marc","Mathews, Bill","Mayfield, Kim","McCaughey, Catherine","McGowen, Sean","McKenzie, Elizabeth","McLaugnlin, Kevin","Miltunovic, Dejan","Mitchell, Nicholas","Moeller, Michael","Moratti, William","Mueller, Karsten","Mukherjee, Sanchita","Murphy, Brandon","Nasser, J.J.","Nieves, Diana","Noren Kramer, Shawn","Obraczka, Katia","Orourke, Sean","Orser, Kristen","Ota, Pauline","Palmer, Christian","Parmelly, Bryce","Parsons, Reid","Peck, Licia","Perkins, Tracy","Petersen, Stephen","Petrie, M","Phillips, James","Pires, George","Potika, Katerina","Prabhakar, Prema","Prochaka, Jason","Purucker, Jeb","Ramirez, F","Ramirez-Ruiz, Enrico","Ravelo, Ana","Ring, Joseph","Rodriguez, Russell","Romano, Sarah","Roome, Ben","Ross, Kevin","Rozhon, Edward","Salazar, Lauryn","Sanfilippo, Brenda","Sauthoff, Wilson","Scherer, Kayoko","Schleich, Thomas","Seene, Marissa","Segale, Matthew","Sharma, Shruti","Shearer, Heather","Sher, Sasha","Silberstein, Gary","Silva-Chavez, Katie","Sirrine, Rob","Sivak, Andrew","Smith, Brad","Smith, Donald R.","Smythe, Ayana","Snickars, Eric","Sood, Sanjay","Sparks, Antoinette","Staiano, Renzo","Stammerjohn, Sharon","Staufenbiel, Brian","Stein, Deborah","Sury, Sharath","Swanson, Reid","Syedullah, Jasmine","Tarjan, Maxine","Taylor, Jennifer","Teeple, David","Terry, Rebecca","Thompson, Elisabeth","Thompson, J.F.","Tollefson, Alan","Tribble, Melissa","Vasudevamurthy, Jagadeesh","Venegas, Yolanda","Vollmer, Karl","Wang, Andy","Watrous, Susan","Weaver, Harlan","Weise, Michael","Westbrook, Dillion","White, Tina","Wise, Nina","Wolter, Lynsey","Wood, Dalia","Woomer, Becky","Yukawa, Keiko","Affourtit, Lorraine","Akeson, Mark","Allman, Troy","Ayzner, Alex","Barber, Adelia","Barron, Manuel","Benjamin, Fribley","Benshoff, Harry","Bivens, A.H","Bockus, Andrew","Brooks, Amra","Bryan, David","Chambers, Lindsay","Chen, Nai-Chia","Choi, Jae Hoon","Cima, Allan","Conn, Brian","Cooperman, Alexandra","Coulter, Bill","Cruz, Laura","Davis, Karen","Davis, Marilyn","Dayton, Richard","Dreisbach, Sandra","Dunne, Max","Eberhart, M","Einstein, Benjamin","Ellison, Erin","Enoch, Melissa","Epps, Harland","Erin , Kate ","Fain, Lucas","Fehren-Schmitz, Lars","Finnegan, Noah ","Foland, Brent","Forrest, Christopher","Friedman, Josh","Frobshier, Tim","Gamburd, Alexander","Gan, Elaine","George, Alexander","Getoor, Lise","Glass, Kathy","Guha Thakurta, Puragra","Hamilton, Charles","Hayes, Grey","Heady, Walter","Hefty, Adam","Hollenbeck, Todd","Hoover, Mrinal","Hutchinson, Greta","Hutton, Mirabai","Jacobs, Laura","Kalami, Proshot","Kanavarioti, Anastasia","Kipps, Margo","Kumaran, Laxmi","Lee, Dongwook","Loeffler, Tony","Lokey, Robert","Lopiccalo, K.C.","Lovell, Emily","Mai, Trieu","Manke, Art","Marriott, David","Mayer, Sarah","McIlwaine, Penelope","Mehinovic, Vedran","Melville, Mike","Mester, Armin","Monroe, James","Morri, Joe","Mortensen, K.M","N. K, Shawn","Navarro, Gabriel","Noard, Kent","Noren, S.","Norren, Shawn","Norren Kramer, Shawn","Palkovacs, Eric","Peacock , Melissa ","Phebus, Bruce","Pollock, Jacob","Pratt, Bryan","Press, Daniel","Ramnath, Maia","Ridum, Mark","Romero, Alexander","Romero, Alicia","Scagliotti, Teresa","Schubert, Richard","Sharma, Bineet","Smeltzer, Erica","Smith, Glenn","Snyder, Mark","Steiner, Adrienne","Stoddart, P.L","Thorne, Lay","Thorpe, Todd","Treanor, Mike","Venturi, Daniele","Villarreal, Anthony","Watkins, James","Weaver, Mary","Wellman, David","Wiefling, Kimberly","Williams, Franklin","Wise, Carol","Zaleha, Bernard","Zuckerman, Nathaniel"]
		  var ratings_links=["/ShowRatings.jsp?tid=160090","/ShowRatings.jsp?tid=153659","/ShowRatings.jsp?tid=25504","/ShowRatings.jsp?tid=180620","/ShowRatings.jsp?tid=490408","/ShowRatings.jsp?tid=144099","/ShowRatings.jsp?tid=144017","/ShowRatings.jsp?tid=218123","/ShowRatings.jsp?tid=110723","/ShowRatings.jsp?tid=12444","/ShowRatings.jsp?tid=1047838","/ShowRatings.jsp?tid=205049","/ShowRatings.jsp?tid=93360","/ShowRatings.jsp?tid=505319","/ShowRatings.jsp?tid=760742","/ShowRatings.jsp?tid=172354","/ShowRatings.jsp?tid=172347","/ShowRatings.jsp?tid=1161116","/ShowRatings.jsp?tid=13929","/ShowRatings.jsp?tid=1418895","/ShowRatings.jsp?tid=359485","/ShowRatings.jsp?tid=339002","/ShowRatings.jsp?tid=153672","/ShowRatings.jsp?tid=320890","/ShowRatings.jsp?tid=281191","/ShowRatings.jsp?tid=175963","/ShowRatings.jsp?tid=153687","/ShowRatings.jsp?tid=162217","/ShowRatings.jsp?tid=567267","/ShowRatings.jsp?tid=1221415","/ShowRatings.jsp?tid=110725","/ShowRatings.jsp?tid=318094","/ShowRatings.jsp?tid=887861","/ShowRatings.jsp?tid=43841","/ShowRatings.jsp?tid=431292","/ShowRatings.jsp?tid=893429","/ShowRatings.jsp?tid=519482","/ShowRatings.jsp?tid=174808","/ShowRatings.jsp?tid=332230","/ShowRatings.jsp?tid=355999","/ShowRatings.jsp?tid=162896","/ShowRatings.jsp?tid=176781","/ShowRatings.jsp?tid=133601","/ShowRatings.jsp?tid=189661","/ShowRatings.jsp?tid=175505","/ShowRatings.jsp?tid=166900","/ShowRatings.jsp?tid=492498","/ShowRatings.jsp?tid=162374","/ShowRatings.jsp?tid=162208","/ShowRatings.jsp?tid=147560","/ShowRatings.jsp?tid=160089","/ShowRatings.jsp?tid=207286","/ShowRatings.jsp?tid=424840","/ShowRatings.jsp?tid=187808","/ShowRatings.jsp?tid=454068","/ShowRatings.jsp?tid=330804","/ShowRatings.jsp?tid=500767","/ShowRatings.jsp?tid=303918","/ShowRatings.jsp?tid=220084","/ShowRatings.jsp?tid=421157","/ShowRatings.jsp?tid=70827","/ShowRatings.jsp?tid=793099","/ShowRatings.jsp?tid=116543","/ShowRatings.jsp?tid=74180","/ShowRatings.jsp?tid=43837","/ShowRatings.jsp?tid=117315","/ShowRatings.jsp?tid=214377","/ShowRatings.jsp?tid=489744","/ShowRatings.jsp?tid=456399","/ShowRatings.jsp?tid=45439","/ShowRatings.jsp?tid=177134","/ShowRatings.jsp?tid=439427","/ShowRatings.jsp?tid=501750","/ShowRatings.jsp?tid=140221","/ShowRatings.jsp?tid=542300","/ShowRatings.jsp?tid=219464","/ShowRatings.jsp?tid=130409","/ShowRatings.jsp?tid=217107","/ShowRatings.jsp?tid=352333","/ShowRatings.jsp?tid=213690","/ShowRatings.jsp?tid=53762","/ShowRatings.jsp?tid=624629","/ShowRatings.jsp?tid=269110","/ShowRatings.jsp?tid=894203","/ShowRatings.jsp?tid=220052","/ShowRatings.jsp?tid=397558","/ShowRatings.jsp?tid=539907","/ShowRatings.jsp?tid=131684","/ShowRatings.jsp?tid=217673","/ShowRatings.jsp?tid=43843","/ShowRatings.jsp?tid=355422","/ShowRatings.jsp?tid=327417","/ShowRatings.jsp?tid=11766","/ShowRatings.jsp?tid=183470","/ShowRatings.jsp?tid=326054","/ShowRatings.jsp?tid=363906","/ShowRatings.jsp?tid=375245","/ShowRatings.jsp?tid=352610","/ShowRatings.jsp?tid=227941","/ShowRatings.jsp?tid=183494","/ShowRatings.jsp?tid=339458","/ShowRatings.jsp?tid=246626","/ShowRatings.jsp?tid=273821","/ShowRatings.jsp?tid=290974","/ShowRatings.jsp?tid=318562","/ShowRatings.jsp?tid=53454","/ShowRatings.jsp?tid=333018","/ShowRatings.jsp?tid=139766","/ShowRatings.jsp?tid=162761","/ShowRatings.jsp?tid=485420","/ShowRatings.jsp?tid=329910","/ShowRatings.jsp?tid=379177","/ShowRatings.jsp?tid=344210","/ShowRatings.jsp?tid=221479","/ShowRatings.jsp?tid=179193","/ShowRatings.jsp?tid=503172","/ShowRatings.jsp?tid=224949","/ShowRatings.jsp?tid=332299","/ShowRatings.jsp?tid=258665","/ShowRatings.jsp?tid=226310","/ShowRatings.jsp?tid=566251","/ShowRatings.jsp?tid=290001","/ShowRatings.jsp?tid=159759","/ShowRatings.jsp?tid=172331","/ShowRatings.jsp?tid=649488","/ShowRatings.jsp?tid=292831","/ShowRatings.jsp?tid=299484","/ShowRatings.jsp?tid=351617","/ShowRatings.jsp?tid=484695","/ShowRatings.jsp?tid=1256998","/ShowRatings.jsp?tid=345004","/ShowRatings.jsp?tid=463689","/ShowRatings.jsp?tid=327783","/ShowRatings.jsp?tid=187543","/ShowRatings.jsp?tid=96029","/ShowRatings.jsp?tid=85781","/ShowRatings.jsp?tid=607028","/ShowRatings.jsp?tid=74185","/ShowRatings.jsp?tid=432210","/ShowRatings.jsp?tid=357843","/ShowRatings.jsp?tid=315432","/ShowRatings.jsp?tid=53543","/ShowRatings.jsp?tid=327421","/ShowRatings.jsp?tid=43845","/ShowRatings.jsp?tid=313660","/ShowRatings.jsp?tid=154538","/ShowRatings.jsp?tid=558355","/ShowRatings.jsp?tid=397683","/ShowRatings.jsp?tid=827422","/ShowRatings.jsp?tid=232632","/ShowRatings.jsp?tid=1101747","/ShowRatings.jsp?tid=254811","/ShowRatings.jsp?tid=186443","/ShowRatings.jsp?tid=11765","/ShowRatings.jsp?tid=285977","/ShowRatings.jsp?tid=263073","/ShowRatings.jsp?tid=376746","/ShowRatings.jsp?tid=317726","/ShowRatings.jsp?tid=648838","/ShowRatings.jsp?tid=53539","/ShowRatings.jsp?tid=419055","/ShowRatings.jsp?tid=155252","/ShowRatings.jsp?tid=184954","/ShowRatings.jsp?tid=348816","/ShowRatings.jsp?tid=367584","/ShowRatings.jsp?tid=362963","/ShowRatings.jsp?tid=492905","/ShowRatings.jsp?tid=1876378","/ShowRatings.jsp?tid=374094","/ShowRatings.jsp?tid=356062","/ShowRatings.jsp?tid=1858461","/ShowRatings.jsp?tid=562114","/ShowRatings.jsp?tid=859195","/ShowRatings.jsp?tid=467062","/ShowRatings.jsp?tid=403559","/ShowRatings.jsp?tid=268931","/ShowRatings.jsp?tid=469045","/ShowRatings.jsp?tid=187820","/ShowRatings.jsp?tid=501754","/ShowRatings.jsp?tid=320889","/ShowRatings.jsp?tid=74183","/ShowRatings.jsp?tid=418298","/ShowRatings.jsp?tid=228995","/ShowRatings.jsp?tid=218871","/ShowRatings.jsp?tid=760216","/ShowRatings.jsp?tid=524997","/ShowRatings.jsp?tid=300268","/ShowRatings.jsp?tid=453505","/ShowRatings.jsp?tid=187844","/ShowRatings.jsp?tid=419515","/ShowRatings.jsp?tid=74184","/ShowRatings.jsp?tid=189651","/ShowRatings.jsp?tid=572821","/ShowRatings.jsp?tid=569936","/ShowRatings.jsp?tid=1054761","/ShowRatings.jsp?tid=153681","/ShowRatings.jsp?tid=233053","/ShowRatings.jsp?tid=216312","/ShowRatings.jsp?tid=87784","/ShowRatings.jsp?tid=420719","/ShowRatings.jsp?tid=506434","/ShowRatings.jsp?tid=219140","/ShowRatings.jsp?tid=768207","/ShowRatings.jsp?tid=435423","/ShowRatings.jsp?tid=136264","/ShowRatings.jsp?tid=1680544","/ShowRatings.jsp?tid=1403879","/ShowRatings.jsp?tid=224129","/ShowRatings.jsp?tid=248047","/ShowRatings.jsp?tid=348511","/ShowRatings.jsp?tid=504924","/ShowRatings.jsp?tid=604377","/ShowRatings.jsp?tid=1106739","/ShowRatings.jsp?tid=623191","/ShowRatings.jsp?tid=568539","/ShowRatings.jsp?tid=217991","/ShowRatings.jsp?tid=326725","/ShowRatings.jsp?tid=371686","/ShowRatings.jsp?tid=534203","/ShowRatings.jsp?tid=222440","/ShowRatings.jsp?tid=139774","/ShowRatings.jsp?tid=1493260","/ShowRatings.jsp?tid=211537","/ShowRatings.jsp?tid=333989","/ShowRatings.jsp?tid=412311","/ShowRatings.jsp?tid=241935","/ShowRatings.jsp?tid=490056","/ShowRatings.jsp?tid=719254","/ShowRatings.jsp?tid=352281","/ShowRatings.jsp?tid=45342","/ShowRatings.jsp?tid=529010","/ShowRatings.jsp?tid=310586","/ShowRatings.jsp?tid=1475543","/ShowRatings.jsp?tid=402773","/ShowRatings.jsp?tid=95550","/ShowRatings.jsp?tid=724990","/ShowRatings.jsp?tid=429575","/ShowRatings.jsp?tid=373752","/ShowRatings.jsp?tid=579125","/ShowRatings.jsp?tid=1039530","/ShowRatings.jsp?tid=366666","/ShowRatings.jsp?tid=407156","/ShowRatings.jsp?tid=1105705","/ShowRatings.jsp?tid=1186910","/ShowRatings.jsp?tid=465778","/ShowRatings.jsp?tid=311139","/ShowRatings.jsp?tid=578577","/ShowRatings.jsp?tid=575221","/ShowRatings.jsp?tid=565185","/ShowRatings.jsp?tid=541870","/ShowRatings.jsp?tid=383339","/ShowRatings.jsp?tid=586647","/ShowRatings.jsp?tid=421550","/ShowRatings.jsp?tid=210725","/ShowRatings.jsp?tid=320888","/ShowRatings.jsp?tid=1156283","/ShowRatings.jsp?tid=373317","/ShowRatings.jsp?tid=594336","/ShowRatings.jsp?tid=187890","/ShowRatings.jsp?tid=240612","/ShowRatings.jsp?tid=726060","/ShowRatings.jsp?tid=279916","/ShowRatings.jsp?tid=205734","/ShowRatings.jsp?tid=1240829","/ShowRatings.jsp?tid=1069616","/ShowRatings.jsp?tid=288890","/ShowRatings.jsp?tid=372290","/ShowRatings.jsp?tid=421373","/ShowRatings.jsp?tid=305674","/ShowRatings.jsp?tid=309674","/ShowRatings.jsp?tid=420045","/ShowRatings.jsp?tid=832882","/ShowRatings.jsp?tid=328498","/ShowRatings.jsp?tid=367590","/ShowRatings.jsp?tid=602377","/ShowRatings.jsp?tid=43836","/ShowRatings.jsp?tid=355522","/ShowRatings.jsp?tid=1802411","/ShowRatings.jsp?tid=356599","/ShowRatings.jsp?tid=1103237","/ShowRatings.jsp?tid=1626658","/ShowRatings.jsp?tid=382517","/ShowRatings.jsp?tid=134135","/ShowRatings.jsp?tid=191238","/ShowRatings.jsp?tid=921327","/ShowRatings.jsp?tid=607121","/ShowRatings.jsp?tid=325937","/ShowRatings.jsp?tid=421438","/ShowRatings.jsp?tid=284636","/ShowRatings.jsp?tid=421376","/ShowRatings.jsp?tid=215985","/ShowRatings.jsp?tid=156391","/ShowRatings.jsp?tid=421105","/ShowRatings.jsp?tid=397058","/ShowRatings.jsp?tid=892165","/ShowRatings.jsp?tid=575784","/ShowRatings.jsp?tid=1387315","/ShowRatings.jsp?tid=377582","/ShowRatings.jsp?tid=1309295","/ShowRatings.jsp?tid=1150085","/ShowRatings.jsp?tid=412272","/ShowRatings.jsp?tid=156434","/ShowRatings.jsp?tid=428766","/ShowRatings.jsp?tid=430906","/ShowRatings.jsp?tid=264244","/ShowRatings.jsp?tid=236378","/ShowRatings.jsp?tid=1334712","/ShowRatings.jsp?tid=350077","/ShowRatings.jsp?tid=219874","/ShowRatings.jsp?tid=133828","/ShowRatings.jsp?tid=285001","/ShowRatings.jsp?tid=318186","/ShowRatings.jsp?tid=217674","/ShowRatings.jsp?tid=420379","/ShowRatings.jsp?tid=1221800","/ShowRatings.jsp?tid=567524","/ShowRatings.jsp?tid=430909","/ShowRatings.jsp?tid=484035","/ShowRatings.jsp?tid=352864","/ShowRatings.jsp?tid=890630","/ShowRatings.jsp?tid=393012","/ShowRatings.jsp?tid=328062","/ShowRatings.jsp?tid=416983","/ShowRatings.jsp?tid=484694","/ShowRatings.jsp?tid=488529","/ShowRatings.jsp?tid=570571","/ShowRatings.jsp?tid=442634","/ShowRatings.jsp?tid=126497","/ShowRatings.jsp?tid=756741","/ShowRatings.jsp?tid=1132540","/ShowRatings.jsp?tid=335874","/ShowRatings.jsp?tid=853734","/ShowRatings.jsp?tid=183457","/ShowRatings.jsp?tid=1524046","/ShowRatings.jsp?tid=400824","/ShowRatings.jsp?tid=1260319","/ShowRatings.jsp?tid=454081","/ShowRatings.jsp?tid=202395","/ShowRatings.jsp?tid=575432","/ShowRatings.jsp?tid=380846","/ShowRatings.jsp?tid=1070801","/ShowRatings.jsp?tid=601674","/ShowRatings.jsp?tid=43838","/ShowRatings.jsp?tid=813802","/ShowRatings.jsp?tid=83706","/ShowRatings.jsp?tid=162370","/ShowRatings.jsp?tid=213656","/ShowRatings.jsp?tid=921359","/ShowRatings.jsp?tid=354376","/ShowRatings.jsp?tid=316726","/ShowRatings.jsp?tid=1985217","/ShowRatings.jsp?tid=129976","/ShowRatings.jsp?tid=1401049","/ShowRatings.jsp?tid=756467","/ShowRatings.jsp?tid=330540","/ShowRatings.jsp?tid=374670","/ShowRatings.jsp?tid=304658","/ShowRatings.jsp?tid=326051","/ShowRatings.jsp?tid=155771","/ShowRatings.jsp?tid=1411016","/ShowRatings.jsp?tid=529744","/ShowRatings.jsp?tid=574127","/ShowRatings.jsp?tid=363391","/ShowRatings.jsp?tid=347795","/ShowRatings.jsp?tid=110726","/ShowRatings.jsp?tid=428763","/ShowRatings.jsp?tid=414534","/ShowRatings.jsp?tid=421375","/ShowRatings.jsp?tid=289836","/ShowRatings.jsp?tid=419807","/ShowRatings.jsp?tid=43840","/ShowRatings.jsp?tid=705987","/ShowRatings.jsp?tid=367295","/ShowRatings.jsp?tid=498459","/ShowRatings.jsp?tid=428765","/ShowRatings.jsp?tid=264945","/ShowRatings.jsp?tid=587548","/ShowRatings.jsp?tid=424410","/ShowRatings.jsp?tid=817474","/ShowRatings.jsp?tid=172351","/ShowRatings.jsp?tid=430911","/ShowRatings.jsp?tid=362771","/ShowRatings.jsp?tid=212821","/ShowRatings.jsp?tid=150003","/ShowRatings.jsp?tid=421597","/ShowRatings.jsp?tid=367298","/ShowRatings.jsp?tid=620628","/ShowRatings.jsp?tid=571546","/ShowRatings.jsp?tid=1772283","/ShowRatings.jsp?tid=1111235","/ShowRatings.jsp?tid=219138","/ShowRatings.jsp?tid=156442","/ShowRatings.jsp?tid=357340","/ShowRatings.jsp?tid=53672","/ShowRatings.jsp?tid=317677","/ShowRatings.jsp?tid=486152","/ShowRatings.jsp?tid=351409","/ShowRatings.jsp?tid=831749","/ShowRatings.jsp?tid=971689","/ShowRatings.jsp?tid=53639","/ShowRatings.jsp?tid=340145","/ShowRatings.jsp?tid=1409167","/ShowRatings.jsp?tid=316717","/ShowRatings.jsp?tid=1184226","/ShowRatings.jsp?tid=12447","/ShowRatings.jsp?tid=456497","/ShowRatings.jsp?tid=355407","/ShowRatings.jsp?tid=183039","/ShowRatings.jsp?tid=489207","/ShowRatings.jsp?tid=81309","/ShowRatings.jsp?tid=207287","/ShowRatings.jsp?tid=621549","/ShowRatings.jsp?tid=186919","/ShowRatings.jsp?tid=219302","/ShowRatings.jsp?tid=53535","/ShowRatings.jsp?tid=935465","/ShowRatings.jsp?tid=43834","/ShowRatings.jsp?tid=958923","/ShowRatings.jsp?tid=156436","/ShowRatings.jsp?tid=475318","/ShowRatings.jsp?tid=1943318","/ShowRatings.jsp?tid=1258312","/ShowRatings.jsp?tid=1289153","/ShowRatings.jsp?tid=1419114","/ShowRatings.jsp?tid=187799","/ShowRatings.jsp?tid=630127","/ShowRatings.jsp?tid=337122","/ShowRatings.jsp?tid=629674","/ShowRatings.jsp?tid=405084","/ShowRatings.jsp?tid=1579425","/ShowRatings.jsp?tid=921542","/ShowRatings.jsp?tid=358569","/ShowRatings.jsp?tid=418826","/ShowRatings.jsp?tid=408953","/ShowRatings.jsp?tid=870043","/ShowRatings.jsp?tid=807125","/ShowRatings.jsp?tid=1267826","/ShowRatings.jsp?tid=999872","/ShowRatings.jsp?tid=541531","/ShowRatings.jsp?tid=299477","/ShowRatings.jsp?tid=247191","/ShowRatings.jsp?tid=183366","/ShowRatings.jsp?tid=1341667","/ShowRatings.jsp?tid=820891","/ShowRatings.jsp?tid=326055","/ShowRatings.jsp?tid=93361","/ShowRatings.jsp?tid=584066","/ShowRatings.jsp?tid=421379","/ShowRatings.jsp?tid=900979","/ShowRatings.jsp?tid=412185","/ShowRatings.jsp?tid=1702804","/ShowRatings.jsp?tid=497401","/ShowRatings.jsp?tid=207289","/ShowRatings.jsp?tid=821772","/ShowRatings.jsp?tid=783467","/ShowRatings.jsp?tid=1268887","/ShowRatings.jsp?tid=577323","/ShowRatings.jsp?tid=287279","/ShowRatings.jsp?tid=1787461","/ShowRatings.jsp?tid=251590","/ShowRatings.jsp?tid=633781","/ShowRatings.jsp?tid=430401","/ShowRatings.jsp?tid=74181","/ShowRatings.jsp?tid=1515368","/ShowRatings.jsp?tid=1139006","/ShowRatings.jsp?tid=1209640","/ShowRatings.jsp?tid=350768","/ShowRatings.jsp?tid=1001793","/ShowRatings.jsp?tid=179604","/ShowRatings.jsp?tid=464559","/ShowRatings.jsp?tid=649662","/ShowRatings.jsp?tid=363357","/ShowRatings.jsp?tid=1696526","/ShowRatings.jsp?tid=158616","/ShowRatings.jsp?tid=397464","/ShowRatings.jsp?tid=758447","/ShowRatings.jsp?tid=429649","/ShowRatings.jsp?tid=459969","/ShowRatings.jsp?tid=173569","/ShowRatings.jsp?tid=78257","/ShowRatings.jsp?tid=353267","/ShowRatings.jsp?tid=236178","/ShowRatings.jsp?tid=146974","/ShowRatings.jsp?tid=1110701","/ShowRatings.jsp?tid=619214","/ShowRatings.jsp?tid=1222436","/ShowRatings.jsp?tid=214925","/ShowRatings.jsp?tid=965892","/ShowRatings.jsp?tid=187803","/ShowRatings.jsp?tid=358058","/ShowRatings.jsp?tid=903867","/ShowRatings.jsp?tid=627676","/ShowRatings.jsp?tid=1110791","/ShowRatings.jsp?tid=1018245","/ShowRatings.jsp?tid=131712","/ShowRatings.jsp?tid=1625311","/ShowRatings.jsp?tid=421864","/ShowRatings.jsp?tid=408956","/ShowRatings.jsp?tid=755516","/ShowRatings.jsp?tid=463180","/ShowRatings.jsp?tid=635765","/ShowRatings.jsp?tid=916775","/ShowRatings.jsp?tid=358654","/ShowRatings.jsp?tid=1136744","/ShowRatings.jsp?tid=172340","/ShowRatings.jsp?tid=218122","/ShowRatings.jsp?tid=575882","/ShowRatings.jsp?tid=1496549","/ShowRatings.jsp?tid=847604","/ShowRatings.jsp?tid=325441","/ShowRatings.jsp?tid=630345","/ShowRatings.jsp?tid=1006320","/ShowRatings.jsp?tid=406619","/ShowRatings.jsp?tid=1255794","/ShowRatings.jsp?tid=928363","/ShowRatings.jsp?tid=183374","/ShowRatings.jsp?tid=1382214","/ShowRatings.jsp?tid=349390","/ShowRatings.jsp?tid=402625","/ShowRatings.jsp?tid=569989","/ShowRatings.jsp?tid=961833","/ShowRatings.jsp?tid=515771","/ShowRatings.jsp?tid=1589417","/ShowRatings.jsp?tid=357300","/ShowRatings.jsp?tid=215971","/ShowRatings.jsp?tid=497161","/ShowRatings.jsp?tid=1865414","/ShowRatings.jsp?tid=302851","/ShowRatings.jsp?tid=1380626","/ShowRatings.jsp?tid=212134","/ShowRatings.jsp?tid=64636","/ShowRatings.jsp?tid=508370","/ShowRatings.jsp?tid=432211","/ShowRatings.jsp?tid=566323","/ShowRatings.jsp?tid=373664","/ShowRatings.jsp?tid=1103487","/ShowRatings.jsp?tid=358472","/ShowRatings.jsp?tid=1110393","/ShowRatings.jsp?tid=620971","/ShowRatings.jsp?tid=1105594","/ShowRatings.jsp?tid=373657","/ShowRatings.jsp?tid=913794","/ShowRatings.jsp?tid=629552","/ShowRatings.jsp?tid=943969","/ShowRatings.jsp?tid=413717","/ShowRatings.jsp?tid=842560","/ShowRatings.jsp?tid=569081","/ShowRatings.jsp?tid=454089","/ShowRatings.jsp?tid=1210454","/ShowRatings.jsp?tid=406649","/ShowRatings.jsp?tid=833736","/ShowRatings.jsp?tid=423445","/ShowRatings.jsp?tid=567490","/ShowRatings.jsp?tid=576595","/ShowRatings.jsp?tid=820857","/ShowRatings.jsp?tid=1108010","/ShowRatings.jsp?tid=577407","/ShowRatings.jsp?tid=895635","/ShowRatings.jsp?tid=1111495","/ShowRatings.jsp?tid=374774","/ShowRatings.jsp?tid=1123708","/ShowRatings.jsp?tid=573880","/ShowRatings.jsp?tid=240796","/ShowRatings.jsp?tid=1070419","/ShowRatings.jsp?tid=1114042","/ShowRatings.jsp?tid=1541171","/ShowRatings.jsp?tid=187636","/ShowRatings.jsp?tid=579543","/ShowRatings.jsp?tid=828755","/ShowRatings.jsp?tid=1055257","/ShowRatings.jsp?tid=629252","/ShowRatings.jsp?tid=691015","/ShowRatings.jsp?tid=414452","/ShowRatings.jsp?tid=854779","/ShowRatings.jsp?tid=217889","/ShowRatings.jsp?tid=544666","/ShowRatings.jsp?tid=614340","/ShowRatings.jsp?tid=1081706","/ShowRatings.jsp?tid=1516759","/ShowRatings.jsp?tid=339657","/ShowRatings.jsp?tid=1290902","/ShowRatings.jsp?tid=366507","/ShowRatings.jsp?tid=343270","/ShowRatings.jsp?tid=1411974","/ShowRatings.jsp?tid=1906264","/ShowRatings.jsp?tid=403089","/ShowRatings.jsp?tid=217675","/ShowRatings.jsp?tid=213661","/ShowRatings.jsp?tid=1449625","/ShowRatings.jsp?tid=1468282","/ShowRatings.jsp?tid=172322","/ShowRatings.jsp?tid=578601","/ShowRatings.jsp?tid=821718","/ShowRatings.jsp?tid=417155","/ShowRatings.jsp?tid=471292","/ShowRatings.jsp?tid=1146710","/ShowRatings.jsp?tid=1072951","/ShowRatings.jsp?tid=334354","/ShowRatings.jsp?tid=165695","/ShowRatings.jsp?tid=217676","/ShowRatings.jsp?tid=213654","/ShowRatings.jsp?tid=793783","/ShowRatings.jsp?tid=431680","/ShowRatings.jsp?tid=1598501","/ShowRatings.jsp?tid=847603","/ShowRatings.jsp?tid=1853129","/ShowRatings.jsp?tid=1544048","/ShowRatings.jsp?tid=1145921","/ShowRatings.jsp?tid=1178300","/ShowRatings.jsp?tid=315124","/ShowRatings.jsp?tid=149218","/ShowRatings.jsp?tid=454054","/ShowRatings.jsp?tid=1541394","/ShowRatings.jsp?tid=1057451","/ShowRatings.jsp?tid=1956436","/ShowRatings.jsp?tid=340454","/ShowRatings.jsp?tid=431179","/ShowRatings.jsp?tid=1702016","/ShowRatings.jsp?tid=365920","/ShowRatings.jsp?tid=1403885","/ShowRatings.jsp?tid=816089","/ShowRatings.jsp?tid=516900","/ShowRatings.jsp?tid=1016393","/ShowRatings.jsp?tid=1707384","/ShowRatings.jsp?tid=1211172","/ShowRatings.jsp?tid=1069797","/ShowRatings.jsp?tid=834684","/ShowRatings.jsp?tid=437671","/ShowRatings.jsp?tid=621625","/ShowRatings.jsp?tid=1287748","/ShowRatings.jsp?tid=815652","/ShowRatings.jsp?tid=921808","/ShowRatings.jsp?tid=1106416","/ShowRatings.jsp?tid=623187","/ShowRatings.jsp?tid=420720","/ShowRatings.jsp?tid=1456323","/ShowRatings.jsp?tid=400534","/ShowRatings.jsp?tid=826789","/ShowRatings.jsp?tid=355715","/ShowRatings.jsp?tid=625524","/ShowRatings.jsp?tid=895634","/ShowRatings.jsp?tid=681174","/ShowRatings.jsp?tid=699116","/ShowRatings.jsp?tid=326731","/ShowRatings.jsp?tid=484688","/ShowRatings.jsp?tid=421380","/ShowRatings.jsp?tid=1254797","/ShowRatings.jsp?tid=971381","/ShowRatings.jsp?tid=172326","/ShowRatings.jsp?tid=1293835","/ShowRatings.jsp?tid=486337","/ShowRatings.jsp?tid=464557","/ShowRatings.jsp?tid=53638","/ShowRatings.jsp?tid=1978781","/ShowRatings.jsp?tid=970030","/ShowRatings.jsp?tid=1368096","/ShowRatings.jsp?tid=871590","/ShowRatings.jsp?tid=400823","/ShowRatings.jsp?tid=596981","/ShowRatings.jsp?tid=291007","/ShowRatings.jsp?tid=187542","/ShowRatings.jsp?tid=1756803","/ShowRatings.jsp?tid=429647","/ShowRatings.jsp?tid=880699","/ShowRatings.jsp?tid=1448536","/ShowRatings.jsp?tid=1073316","/ShowRatings.jsp?tid=236161","/ShowRatings.jsp?tid=903228","/ShowRatings.jsp?tid=583338","/ShowRatings.jsp?tid=1265900","/ShowRatings.jsp?tid=812113","/ShowRatings.jsp?tid=1629656","/ShowRatings.jsp?tid=958961","/ShowRatings.jsp?tid=279955","/ShowRatings.jsp?tid=1192693","/ShowRatings.jsp?tid=1219778","/ShowRatings.jsp?tid=962067","/ShowRatings.jsp?tid=166898","/ShowRatings.jsp?tid=527533","/ShowRatings.jsp?tid=399178","/ShowRatings.jsp?tid=205736","/ShowRatings.jsp?tid=924376","/ShowRatings.jsp?tid=1664899","/ShowRatings.jsp?tid=131665","/ShowRatings.jsp?tid=623193","/ShowRatings.jsp?tid=1705555","/ShowRatings.jsp?tid=757969","/ShowRatings.jsp?tid=473360","/ShowRatings.jsp?tid=1647807","/ShowRatings.jsp?tid=454539","/ShowRatings.jsp?tid=1756373","/ShowRatings.jsp?tid=1100721","/ShowRatings.jsp?tid=1065741","/ShowRatings.jsp?tid=149293","/ShowRatings.jsp?tid=510773","/ShowRatings.jsp?tid=425175","/ShowRatings.jsp?tid=1303045","/ShowRatings.jsp?tid=956206","/ShowRatings.jsp?tid=53540","/ShowRatings.jsp?tid=585980","/ShowRatings.jsp?tid=126496","/ShowRatings.jsp?tid=1118850","/ShowRatings.jsp?tid=413007","/ShowRatings.jsp?tid=640399","/ShowRatings.jsp?tid=1824739","/ShowRatings.jsp?tid=1210536","/ShowRatings.jsp?tid=1257446","/ShowRatings.jsp?tid=1114843","/ShowRatings.jsp?tid=962049","/ShowRatings.jsp?tid=794339","/ShowRatings.jsp?tid=312122","/ShowRatings.jsp?tid=1972515","/ShowRatings.jsp?tid=481588","/ShowRatings.jsp?tid=1106879","/ShowRatings.jsp?tid=1205471","/ShowRatings.jsp?tid=469447","/ShowRatings.jsp?tid=1261052","/ShowRatings.jsp?tid=571533","/ShowRatings.jsp?tid=220439","/ShowRatings.jsp?tid=241936","/ShowRatings.jsp?tid=919882","/ShowRatings.jsp?tid=1048232","/ShowRatings.jsp?tid=1703745","/ShowRatings.jsp?tid=1144205","/ShowRatings.jsp?tid=580046","/ShowRatings.jsp?tid=547175","/ShowRatings.jsp?tid=1110889","/ShowRatings.jsp?tid=966925","/ShowRatings.jsp?tid=242745","/ShowRatings.jsp?tid=211547","/ShowRatings.jsp?tid=762591","/ShowRatings.jsp?tid=916942","/ShowRatings.jsp?tid=482360","/ShowRatings.jsp?tid=883909","/ShowRatings.jsp?tid=400820","/ShowRatings.jsp?tid=593764","/ShowRatings.jsp?tid=1878961","/ShowRatings.jsp?tid=517370","/ShowRatings.jsp?tid=214912","/ShowRatings.jsp?tid=1253333","/ShowRatings.jsp?tid=821372","/ShowRatings.jsp?tid=357339","/ShowRatings.jsp?tid=187831","/ShowRatings.jsp?tid=1199801","/ShowRatings.jsp?tid=1987856","/ShowRatings.jsp?tid=1450627","/ShowRatings.jsp?tid=1150402","/ShowRatings.jsp?tid=960068","/ShowRatings.jsp?tid=401125","/ShowRatings.jsp?tid=359493","/ShowRatings.jsp?tid=53537","/ShowRatings.jsp?tid=968914","/ShowRatings.jsp?tid=1696969","/ShowRatings.jsp?tid=845237","/ShowRatings.jsp?tid=567491","/ShowRatings.jsp?tid=335871","/ShowRatings.jsp?tid=625138","/ShowRatings.jsp?tid=575840","/ShowRatings.jsp?tid=1258787","/ShowRatings.jsp?tid=1237400","/ShowRatings.jsp?tid=464548","/ShowRatings.jsp?tid=187834","/ShowRatings.jsp?tid=355063","/ShowRatings.jsp?tid=1760214","/ShowRatings.jsp?tid=579033","/ShowRatings.jsp?tid=1754870","/ShowRatings.jsp?tid=630646","/ShowRatings.jsp?tid=1700941","/ShowRatings.jsp?tid=1802099","/ShowRatings.jsp?tid=1425236","/ShowRatings.jsp?tid=213650","/ShowRatings.jsp?tid=521273","/ShowRatings.jsp?tid=578615","/ShowRatings.jsp?tid=1391012","/ShowRatings.jsp?tid=631823","/ShowRatings.jsp?tid=763028","/ShowRatings.jsp?tid=340139","/ShowRatings.jsp?tid=371680","/ShowRatings.jsp?tid=488736","/ShowRatings.jsp?tid=1848921","/ShowRatings.jsp?tid=1259189","/ShowRatings.jsp?tid=702223","/ShowRatings.jsp?tid=756470","/ShowRatings.jsp?tid=1431917","/ShowRatings.jsp?tid=1506115","/ShowRatings.jsp?tid=414399","/ShowRatings.jsp?tid=904289","/ShowRatings.jsp?tid=1116173","/ShowRatings.jsp?tid=1108161","/ShowRatings.jsp?tid=740473","/ShowRatings.jsp?tid=1476379","/ShowRatings.jsp?tid=176029","/ShowRatings.jsp?tid=1035376","/ShowRatings.jsp?tid=1542293","/ShowRatings.jsp?tid=1447","/ShowRatings.jsp?tid=1454146","/ShowRatings.jsp?tid=806539","/ShowRatings.jsp?tid=1760321","/ShowRatings.jsp?tid=1296366","/ShowRatings.jsp?tid=380845","/ShowRatings.jsp?tid=434111","/ShowRatings.jsp?tid=1879120","/ShowRatings.jsp?tid=419987","/ShowRatings.jsp?tid=705843","/ShowRatings.jsp?tid=1586954","/ShowRatings.jsp?tid=1564443","/ShowRatings.jsp?tid=1649966","/ShowRatings.jsp?tid=1144656","/ShowRatings.jsp?tid=195287","/ShowRatings.jsp?tid=1798465","/ShowRatings.jsp?tid=1268259","/ShowRatings.jsp?tid=833827","/ShowRatings.jsp?tid=1986502","/ShowRatings.jsp?tid=1366389","/ShowRatings.jsp?tid=1915143","/ShowRatings.jsp?tid=566836","/ShowRatings.jsp?tid=494374","/ShowRatings.jsp?tid=373171","/ShowRatings.jsp?tid=928572","/ShowRatings.jsp?tid=1138935","/ShowRatings.jsp?tid=1261053","/ShowRatings.jsp?tid=213974","/ShowRatings.jsp?tid=352312","/ShowRatings.jsp?tid=583506","/ShowRatings.jsp?tid=574804","/ShowRatings.jsp?tid=1621761","/ShowRatings.jsp?tid=194575","/ShowRatings.jsp?tid=1355004","/ShowRatings.jsp?tid=1198152","/ShowRatings.jsp?tid=1186130","/ShowRatings.jsp?tid=1823562","/ShowRatings.jsp?tid=1455286","/ShowRatings.jsp?tid=1789114","/ShowRatings.jsp?tid=1545368","/ShowRatings.jsp?tid=1865404","/ShowRatings.jsp?tid=1860111","/ShowRatings.jsp?tid=347794","/ShowRatings.jsp?tid=501696","/ShowRatings.jsp?tid=748016","/ShowRatings.jsp?tid=1137795","/ShowRatings.jsp?tid=896699","/ShowRatings.jsp?tid=1821772","/ShowRatings.jsp?tid=217677","/ShowRatings.jsp?tid=1252803","/ShowRatings.jsp?tid=629884","/ShowRatings.jsp?tid=494654","/ShowRatings.jsp?tid=356796","/ShowRatings.jsp?tid=386229","/ShowRatings.jsp?tid=353137","/ShowRatings.jsp?tid=1260973","/ShowRatings.jsp?tid=628807","/ShowRatings.jsp?tid=1089845","/ShowRatings.jsp?tid=1846090","/ShowRatings.jsp?tid=1301723","/ShowRatings.jsp?tid=374402","/ShowRatings.jsp?tid=1657900","/ShowRatings.jsp?tid=641237","/ShowRatings.jsp?tid=1736741","/ShowRatings.jsp?tid=1175558","/ShowRatings.jsp?tid=625373","/ShowRatings.jsp?tid=1678609","/ShowRatings.jsp?tid=1721006","/ShowRatings.jsp?tid=1530513","/ShowRatings.jsp?tid=1127502","/ShowRatings.jsp?tid=1884240","/ShowRatings.jsp?tid=1820313","/ShowRatings.jsp?tid=1379992","/ShowRatings.jsp?tid=705250","/ShowRatings.jsp?tid=877988","/ShowRatings.jsp?tid=1412754","/ShowRatings.jsp?tid=654538","/ShowRatings.jsp?tid=1882056","/ShowRatings.jsp?tid=921356","/ShowRatings.jsp?tid=1106113","/ShowRatings.jsp?tid=283320","/ShowRatings.jsp?tid=53453","/ShowRatings.jsp?tid=1046920","/ShowRatings.jsp?tid=1195248","/ShowRatings.jsp?tid=1324993","/ShowRatings.jsp?tid=1751296","/ShowRatings.jsp?tid=571518","/ShowRatings.jsp?tid=549709","/ShowRatings.jsp?tid=382957","/ShowRatings.jsp?tid=520271","/ShowRatings.jsp?tid=971094","/ShowRatings.jsp?tid=43842","/ShowRatings.jsp?tid=1181434","/ShowRatings.jsp?tid=1129205","/ShowRatings.jsp?tid=417237","/ShowRatings.jsp?tid=516920","/ShowRatings.jsp?tid=1953468","/ShowRatings.jsp?tid=1754748","/ShowRatings.jsp?tid=344212","/ShowRatings.jsp?tid=1787095","/ShowRatings.jsp?tid=821588","/ShowRatings.jsp?tid=547894","/ShowRatings.jsp?tid=316506","/ShowRatings.jsp?tid=1433374","/ShowRatings.jsp?tid=1903260","/ShowRatings.jsp?tid=1463909","/ShowRatings.jsp?tid=162210","/ShowRatings.jsp?tid=382986","/ShowRatings.jsp?tid=575151","/ShowRatings.jsp?tid=559092","/ShowRatings.jsp?tid=1350437","/ShowRatings.jsp?tid=1543205","/ShowRatings.jsp?tid=856321","/ShowRatings.jsp?tid=1288612","/ShowRatings.jsp?tid=835518","/ShowRatings.jsp?tid=1239594","/ShowRatings.jsp?tid=625322","/ShowRatings.jsp?tid=1365797","/ShowRatings.jsp?tid=962055","/ShowRatings.jsp?tid=1825625","/ShowRatings.jsp?tid=187814","/ShowRatings.jsp?tid=1942726","/ShowRatings.jsp?tid=1647814","/ShowRatings.jsp?tid=1647918","/ShowRatings.jsp?tid=926248","/ShowRatings.jsp?tid=1544017","/ShowRatings.jsp?tid=744921","/ShowRatings.jsp?tid=1914509","/ShowRatings.jsp?tid=1284638","/ShowRatings.jsp?tid=670177","/ShowRatings.jsp?tid=569993","/ShowRatings.jsp?tid=1035679","/ShowRatings.jsp?tid=810425","/ShowRatings.jsp?tid=629881","/ShowRatings.jsp?tid=878469","/ShowRatings.jsp?tid=861771","/ShowRatings.jsp?tid=1497769","/ShowRatings.jsp?tid=1781037","/ShowRatings.jsp?tid=1210537","/ShowRatings.jsp?tid=1420606","/ShowRatings.jsp?tid=1035183","/ShowRatings.jsp?tid=1610408","/ShowRatings.jsp?tid=730551","/ShowRatings.jsp?tid=43835","/ShowRatings.jsp?tid=146600","/ShowRatings.jsp?tid=1641103","/ShowRatings.jsp?tid=1887438","/ShowRatings.jsp?tid=1105310","/ShowRatings.jsp?tid=1278332","/ShowRatings.jsp?tid=648583","/ShowRatings.jsp?tid=523760","/ShowRatings.jsp?tid=1418525","/ShowRatings.jsp?tid=1262246","/ShowRatings.jsp?tid=1101721","/ShowRatings.jsp?tid=350789","/ShowRatings.jsp?tid=710113","/ShowRatings.jsp?tid=590465","/ShowRatings.jsp?tid=1058952","/ShowRatings.jsp?tid=1557982","/ShowRatings.jsp?tid=1843907","/ShowRatings.jsp?tid=922669","/ShowRatings.jsp?tid=1245585","/ShowRatings.jsp?tid=972602","/ShowRatings.jsp?tid=1971649","/ShowRatings.jsp?tid=1801060","/ShowRatings.jsp?tid=420381","/ShowRatings.jsp?tid=1852560","/ShowRatings.jsp?tid=963712","/ShowRatings.jsp?tid=705286","/ShowRatings.jsp?tid=1906610","/ShowRatings.jsp?tid=1816465","/ShowRatings.jsp?tid=1541679","/ShowRatings.jsp?tid=574833","/ShowRatings.jsp?tid=897903","/ShowRatings.jsp?tid=1389844","/ShowRatings.jsp?tid=1784124","/ShowRatings.jsp?tid=433041","/ShowRatings.jsp?tid=367829","/ShowRatings.jsp?tid=1397575","/ShowRatings.jsp?tid=919055","/ShowRatings.jsp?tid=1295050","/ShowRatings.jsp?tid=1057712","/ShowRatings.jsp?tid=960698","/ShowRatings.jsp?tid=464554","/ShowRatings.jsp?tid=1860417","/ShowRatings.jsp?tid=604232","/ShowRatings.jsp?tid=1418859","/ShowRatings.jsp?tid=187817","/ShowRatings.jsp?tid=1677894","/ShowRatings.jsp?tid=202076","/ShowRatings.jsp?tid=1168719","/ShowRatings.jsp?tid=1585300","/ShowRatings.jsp?tid=848935","/ShowRatings.jsp?tid=612843","/ShowRatings.jsp?tid=630377","/ShowRatings.jsp?tid=187821","/ShowRatings.jsp?tid=855223","/ShowRatings.jsp?tid=1817330","/ShowRatings.jsp?tid=932736","/ShowRatings.jsp?tid=795464","/ShowRatings.jsp?tid=418306","/ShowRatings.jsp?tid=211108","/ShowRatings.jsp?tid=1626922","/ShowRatings.jsp?tid=1957907","/ShowRatings.jsp?tid=113650","/ShowRatings.jsp?tid=1607950","/ShowRatings.jsp?tid=497403","/ShowRatings.jsp?tid=817553","/ShowRatings.jsp?tid=565882","/ShowRatings.jsp?tid=1552528","/ShowRatings.jsp?tid=1801310","/ShowRatings.jsp?tid=1552722","/ShowRatings.jsp?tid=959842","/ShowRatings.jsp?tid=1258547","/ShowRatings.jsp?tid=472113","/ShowRatings.jsp?tid=1701769","/ShowRatings.jsp?tid=12446","/ShowRatings.jsp?tid=580441","/ShowRatings.jsp?tid=1163933","/ShowRatings.jsp?tid=1895931","/ShowRatings.jsp?tid=757960","/ShowRatings.jsp?tid=1115041","/ShowRatings.jsp?tid=1238496","/ShowRatings.jsp?tid=1865418","/ShowRatings.jsp?tid=181514","/ShowRatings.jsp?tid=600244","/ShowRatings.jsp?tid=960435","/ShowRatings.jsp?tid=966116","/ShowRatings.jsp?tid=435088","/ShowRatings.jsp?tid=1043842","/ShowRatings.jsp?tid=1949080","/ShowRatings.jsp?tid=822731","/ShowRatings.jsp?tid=1729911","/ShowRatings.jsp?tid=1362583","/ShowRatings.jsp?tid=668826","/ShowRatings.jsp?tid=584602","/ShowRatings.jsp?tid=1697825","/ShowRatings.jsp?tid=1509914","/ShowRatings.jsp?tid=1989576","/ShowRatings.jsp?tid=627938","/ShowRatings.jsp?tid=750309","/ShowRatings.jsp?tid=1079469","/ShowRatings.jsp?tid=842912","/ShowRatings.jsp?tid=172339","/ShowRatings.jsp?tid=960189","/ShowRatings.jsp?tid=900590","/ShowRatings.jsp?tid=207288","/ShowRatings.jsp?tid=176756","/ShowRatings.jsp?tid=560077","/ShowRatings.jsp?tid=862596","/ShowRatings.jsp?tid=1256700","/ShowRatings.jsp?tid=421013","/ShowRatings.jsp?tid=1212488","/ShowRatings.jsp?tid=1700855","/ShowRatings.jsp?tid=822349","/ShowRatings.jsp?tid=1212149","/ShowRatings.jsp?tid=629874","/ShowRatings.jsp?tid=861799","/ShowRatings.jsp?tid=1273968","/ShowRatings.jsp?tid=1642299","/ShowRatings.jsp?tid=541546","/ShowRatings.jsp?tid=1221176","/ShowRatings.jsp?tid=1743623","/ShowRatings.jsp?tid=1544728","/ShowRatings.jsp?tid=1592985","/ShowRatings.jsp?tid=1650388","/ShowRatings.jsp?tid=1080240","/ShowRatings.jsp?tid=1883634","/ShowRatings.jsp?tid=1421964","/ShowRatings.jsp?tid=1786111","/ShowRatings.jsp?tid=640123","/ShowRatings.jsp?tid=414253","/ShowRatings.jsp?tid=1799796","/ShowRatings.jsp?tid=1371295","/ShowRatings.jsp?tid=1799291","/ShowRatings.jsp?tid=1872926","/ShowRatings.jsp?tid=586666","/ShowRatings.jsp?tid=1324268","/ShowRatings.jsp?tid=1028258","/ShowRatings.jsp?tid=575403","/ShowRatings.jsp?tid=819363","/ShowRatings.jsp?tid=1214934","/ShowRatings.jsp?tid=1364996","/ShowRatings.jsp?tid=737078","/ShowRatings.jsp?tid=304666","/ShowRatings.jsp?tid=568150","/ShowRatings.jsp?tid=1657006","/ShowRatings.jsp?tid=962748","/ShowRatings.jsp?tid=711826","/ShowRatings.jsp?tid=1805804","/ShowRatings.jsp?tid=1493977","/ShowRatings.jsp?tid=956001","/ShowRatings.jsp?tid=1262349","/ShowRatings.jsp?tid=1709945","/ShowRatings.jsp?tid=1697753","/ShowRatings.jsp?tid=1458091","/ShowRatings.jsp?tid=1538112","/ShowRatings.jsp?tid=74186","/ShowRatings.jsp?tid=1827496","/ShowRatings.jsp?tid=753424","/ShowRatings.jsp?tid=630817","/ShowRatings.jsp?tid=577905","/ShowRatings.jsp?tid=1534027","/ShowRatings.jsp?tid=1826689","/ShowRatings.jsp?tid=1422285","/ShowRatings.jsp?tid=1920292","/ShowRatings.jsp?tid=1976159","/ShowRatings.jsp?tid=1501957","/ShowRatings.jsp?tid=641230","/ShowRatings.jsp?tid=1815899","/ShowRatings.jsp?tid=1439969","/ShowRatings.jsp?tid=418589","/ShowRatings.jsp?tid=901665","/ShowRatings.jsp?tid=1486019","/ShowRatings.jsp?tid=573184","/ShowRatings.jsp?tid=1104309","/ShowRatings.jsp?tid=892796","/ShowRatings.jsp?tid=1736063","/ShowRatings.jsp?tid=1305061","/ShowRatings.jsp?tid=943209","/ShowRatings.jsp?tid=282827","/ShowRatings.jsp?tid=623192","/ShowRatings.jsp?tid=1941652","/ShowRatings.jsp?tid=432209","/ShowRatings.jsp?tid=1861781","/ShowRatings.jsp?tid=547104","/ShowRatings.jsp?tid=1816267","/ShowRatings.jsp?tid=1984001","/ShowRatings.jsp?tid=361294","/ShowRatings.jsp?tid=881012","/ShowRatings.jsp?tid=955302","/ShowRatings.jsp?tid=1235866","/ShowRatings.jsp?tid=1284636","/ShowRatings.jsp?tid=258664","/ShowRatings.jsp?tid=454092","/ShowRatings.jsp?tid=1450439","/ShowRatings.jsp?tid=187547","/ShowRatings.jsp?tid=852297","/ShowRatings.jsp?tid=1859226","/ShowRatings.jsp?tid=963124","/ShowRatings.jsp?tid=1988302","/ShowRatings.jsp?tid=1801174","/ShowRatings.jsp?tid=1148168","/ShowRatings.jsp?tid=1295312","/ShowRatings.jsp?tid=751702","/ShowRatings.jsp?tid=1263850","/ShowRatings.jsp?tid=631826","/ShowRatings.jsp?tid=1072942","/ShowRatings.jsp?tid=857639","/ShowRatings.jsp?tid=343155","/ShowRatings.jsp?tid=1113882","/ShowRatings.jsp?tid=770666","/ShowRatings.jsp?tid=43844","/ShowRatings.jsp?tid=893819","/ShowRatings.jsp?tid=831174","/ShowRatings.jsp?tid=928323","/ShowRatings.jsp?tid=770146","/ShowRatings.jsp?tid=757695","/ShowRatings.jsp?tid=401112","/ShowRatings.jsp?tid=963119","/ShowRatings.jsp?tid=1667803","/ShowRatings.jsp?tid=1475609","/ShowRatings.jsp?tid=1861761","/ShowRatings.jsp?tid=1953126","/ShowRatings.jsp?tid=1148171","/ShowRatings.jsp?tid=1262222","/ShowRatings.jsp?tid=529106","/ShowRatings.jsp?tid=859971","/ShowRatings.jsp?tid=761126","/ShowRatings.jsp?tid=1987862","/ShowRatings.jsp?tid=668239","/ShowRatings.jsp?tid=215980","/ShowRatings.jsp?tid=581247","/ShowRatings.jsp?tid=810384","/ShowRatings.jsp?tid=624093","/ShowRatings.jsp?tid=1848923","/ShowRatings.jsp?tid=480980","/ShowRatings.jsp?tid=635976","/ShowRatings.jsp?tid=1511473","/ShowRatings.jsp?tid=1232349","/ShowRatings.jsp?tid=1858042","/ShowRatings.jsp?tid=824385","/ShowRatings.jsp?tid=1327143","/ShowRatings.jsp?tid=1006713","/ShowRatings.jsp?tid=1796103","/ShowRatings.jsp?tid=1141966","/ShowRatings.jsp?tid=581005","/ShowRatings.jsp?tid=401130","/ShowRatings.jsp?tid=929308","/ShowRatings.jsp?tid=355581","/ShowRatings.jsp?tid=876392","/ShowRatings.jsp?tid=1650879","/ShowRatings.jsp?tid=1805147","/ShowRatings.jsp?tid=970194","/ShowRatings.jsp?tid=1129206","/ShowRatings.jsp?tid=240940","/ShowRatings.jsp?tid=552247","/ShowRatings.jsp?tid=894581","/ShowRatings.jsp?tid=949993","/ShowRatings.jsp?tid=1106255","/ShowRatings.jsp?tid=1723909","/ShowRatings.jsp?tid=832852","/ShowRatings.jsp?tid=923579","/ShowRatings.jsp?tid=1812581","/ShowRatings.jsp?tid=1543316","/ShowRatings.jsp?tid=1104953","/ShowRatings.jsp?tid=1345420","/ShowRatings.jsp?tid=1291914","/ShowRatings.jsp?tid=1100895","/ShowRatings.jsp?tid=1297215","/ShowRatings.jsp?tid=1146434","/ShowRatings.jsp?tid=710116","/ShowRatings.jsp?tid=1308590","/ShowRatings.jsp?tid=1872479","/ShowRatings.jsp?tid=1861779","/ShowRatings.jsp?tid=1796530","/ShowRatings.jsp?tid=1418914","/ShowRatings.jsp?tid=1417141","/ShowRatings.jsp?tid=1529072","/ShowRatings.jsp?tid=2000965","/ShowRatings.jsp?tid=822183","/ShowRatings.jsp?tid=1202045","/ShowRatings.jsp?tid=1972513","/ShowRatings.jsp?tid=574683","/ShowRatings.jsp?tid=1591940","/ShowRatings.jsp?tid=1963474","/ShowRatings.jsp?tid=1700695","/ShowRatings.jsp?tid=1123434","/ShowRatings.jsp?tid=628342","/ShowRatings.jsp?tid=772340","/ShowRatings.jsp?tid=1549348","/ShowRatings.jsp?tid=1140480","/ShowRatings.jsp?tid=817900","/ShowRatings.jsp?tid=652166","/ShowRatings.jsp?tid=1082778","/ShowRatings.jsp?tid=1438096","/ShowRatings.jsp?tid=367409","/ShowRatings.jsp?tid=1498440","/ShowRatings.jsp?tid=1882102","/ShowRatings.jsp?tid=934192","/ShowRatings.jsp?tid=1882794","/ShowRatings.jsp?tid=1914698","/ShowRatings.jsp?tid=815686","/ShowRatings.jsp?tid=240524","/ShowRatings.jsp?tid=654854","/ShowRatings.jsp?tid=773047","/ShowRatings.jsp?tid=625553","/ShowRatings.jsp?tid=837212","/ShowRatings.jsp?tid=703690","/ShowRatings.jsp?tid=1881428","/ShowRatings.jsp?tid=1834401","/ShowRatings.jsp?tid=1544714","/ShowRatings.jsp?tid=1902793","/ShowRatings.jsp?tid=1740316","/ShowRatings.jsp?tid=808600","/ShowRatings.jsp?tid=1697457","/ShowRatings.jsp?tid=622255","/ShowRatings.jsp?tid=993533","/ShowRatings.jsp?tid=575271","/ShowRatings.jsp?tid=1727378","/ShowRatings.jsp?tid=1777354","/ShowRatings.jsp?tid=172336","/ShowRatings.jsp?tid=1562764","/ShowRatings.jsp?tid=1292914","/ShowRatings.jsp?tid=1636125","/ShowRatings.jsp?tid=1145925","/ShowRatings.jsp?tid=1256637","/ShowRatings.jsp?tid=1616321","/ShowRatings.jsp?tid=414536","/ShowRatings.jsp?tid=1804221","/ShowRatings.jsp?tid=870612","/ShowRatings.jsp?tid=1227560","/ShowRatings.jsp?tid=1884361","/ShowRatings.jsp?tid=1581421","/ShowRatings.jsp?tid=2018219","/ShowRatings.jsp?tid=1732321","/ShowRatings.jsp?tid=1886546","/ShowRatings.jsp?tid=1214156","/ShowRatings.jsp?tid=997911","/ShowRatings.jsp?tid=1751247","/ShowRatings.jsp?tid=1523262","/ShowRatings.jsp?tid=626625","/ShowRatings.jsp?tid=1950280","/ShowRatings.jsp?tid=1140433","/ShowRatings.jsp?tid=1901839","/ShowRatings.jsp?tid=643371","/ShowRatings.jsp?tid=1988918","/ShowRatings.jsp?tid=1682128","/ShowRatings.jsp?tid=186449","/ShowRatings.jsp?tid=866133","/ShowRatings.jsp?tid=649544","/ShowRatings.jsp?tid=757317","/ShowRatings.jsp?tid=1574766","/ShowRatings.jsp?tid=1727778","/ShowRatings.jsp?tid=705289","/ShowRatings.jsp?tid=1120125","/ShowRatings.jsp?tid=611916","/ShowRatings.jsp?tid=381738","/ShowRatings.jsp?tid=1969667","/ShowRatings.jsp?tid=874219","/ShowRatings.jsp?tid=817471","/ShowRatings.jsp?tid=702599","/ShowRatings.jsp?tid=832851","/ShowRatings.jsp?tid=1105967","/ShowRatings.jsp?tid=1799666","/ShowRatings.jsp?tid=1065395","/ShowRatings.jsp?tid=891200","/ShowRatings.jsp?tid=1886834","/ShowRatings.jsp?tid=1971907","/ShowRatings.jsp?tid=1478316","/ShowRatings.jsp?tid=414542","/ShowRatings.jsp?tid=329376","/ShowRatings.jsp?tid=762291","/ShowRatings.jsp?tid=574987","/ShowRatings.jsp?tid=1389036","/ShowRatings.jsp?tid=961752","/ShowRatings.jsp?tid=1985871","/ShowRatings.jsp?tid=597902","/ShowRatings.jsp?tid=2019132","/ShowRatings.jsp?tid=851003","/ShowRatings.jsp?tid=487959","/ShowRatings.jsp?tid=454939","/ShowRatings.jsp?tid=1692341","/ShowRatings.jsp?tid=1069321","/ShowRatings.jsp?tid=1143875","/ShowRatings.jsp?tid=1378541","/ShowRatings.jsp?tid=1768038","/ShowRatings.jsp?tid=1903322","/ShowRatings.jsp?tid=566135","/ShowRatings.jsp?tid=894582","/ShowRatings.jsp?tid=1860821","/ShowRatings.jsp?tid=1904413","/ShowRatings.jsp?tid=859504","/ShowRatings.jsp?tid=1536090","/ShowRatings.jsp?tid=922460","/ShowRatings.jsp?tid=1551567","/ShowRatings.jsp?tid=1877396","/ShowRatings.jsp?tid=1332881","/ShowRatings.jsp?tid=1912205","/ShowRatings.jsp?tid=1549894","/ShowRatings.jsp?tid=1975003","/ShowRatings.jsp?tid=1112877","/ShowRatings.jsp?tid=1468386","/ShowRatings.jsp?tid=1482491","/ShowRatings.jsp?tid=1775268","/ShowRatings.jsp?tid=1969473","/ShowRatings.jsp?tid=1857446","/ShowRatings.jsp?tid=1907820","/ShowRatings.jsp?tid=1802618","/ShowRatings.jsp?tid=577522","/ShowRatings.jsp?tid=1988885","/ShowRatings.jsp?tid=1161524","/ShowRatings.jsp?tid=1401785","/ShowRatings.jsp?tid=1299486","/ShowRatings.jsp?tid=1538370","/ShowRatings.jsp?tid=1418522","/ShowRatings.jsp?tid=1966386","/ShowRatings.jsp?tid=607196","/ShowRatings.jsp?tid=1169339","/ShowRatings.jsp?tid=1611408","/ShowRatings.jsp?tid=1989778","/ShowRatings.jsp?tid=1548018","/ShowRatings.jsp?tid=1190686","/ShowRatings.jsp?tid=1875583","/ShowRatings.jsp?tid=769335","/ShowRatings.jsp?tid=1289630","/ShowRatings.jsp?tid=1107767","/ShowRatings.jsp?tid=1075632","/ShowRatings.jsp?tid=784923","/ShowRatings.jsp?tid=801143","/ShowRatings.jsp?tid=1796226","/ShowRatings.jsp?tid=1259902","/ShowRatings.jsp?tid=678431","/ShowRatings.jsp?tid=1271094","/ShowRatings.jsp?tid=1974578","/ShowRatings.jsp?tid=1837382","/ShowRatings.jsp?tid=1149052","/ShowRatings.jsp?tid=1413714","/ShowRatings.jsp?tid=1676488","/ShowRatings.jsp?tid=1273967","/ShowRatings.jsp?tid=1543786","/ShowRatings.jsp?tid=1899450","/ShowRatings.jsp?tid=810457","/ShowRatings.jsp?tid=1544252","/ShowRatings.jsp?tid=1091780","/ShowRatings.jsp?tid=1388062","/ShowRatings.jsp?tid=1698848","/ShowRatings.jsp?tid=2003548","/ShowRatings.jsp?tid=1256029","/ShowRatings.jsp?tid=992584","/ShowRatings.jsp?tid=416183","/ShowRatings.jsp?tid=2020023","/ShowRatings.jsp?tid=499007","/ShowRatings.jsp?tid=1234681","/ShowRatings.jsp?tid=1111493","/ShowRatings.jsp?tid=634105","/ShowRatings.jsp?tid=454078","/ShowRatings.jsp?tid=1949299","/ShowRatings.jsp?tid=1863203","/ShowRatings.jsp?tid=1643315","/ShowRatings.jsp?tid=1145928","/ShowRatings.jsp?tid=629261","/ShowRatings.jsp?tid=414545","/ShowRatings.jsp?tid=1200950","/ShowRatings.jsp?tid=1801058","/ShowRatings.jsp?tid=1674637","/ShowRatings.jsp?tid=1872588","/ShowRatings.jsp?tid=2031741","/ShowRatings.jsp?tid=1210108","/ShowRatings.jsp?tid=1106118","/ShowRatings.jsp?tid=1907629","/ShowRatings.jsp?tid=1306420","/ShowRatings.jsp?tid=1546862","/ShowRatings.jsp?tid=924440","/ShowRatings.jsp?tid=1474316","/ShowRatings.jsp?tid=1000640","/ShowRatings.jsp?tid=1215411","/ShowRatings.jsp?tid=1294726","/ShowRatings.jsp?tid=2049798","/ShowRatings.jsp?tid=1969174","/ShowRatings.jsp?tid=567682","/ShowRatings.jsp?tid=1816498","/ShowRatings.jsp?tid=1540880","/ShowRatings.jsp?tid=1217713","/ShowRatings.jsp?tid=1918529","/ShowRatings.jsp?tid=868242","/ShowRatings.jsp?tid=928542","/ShowRatings.jsp?tid=1994455","/ShowRatings.jsp?tid=2021722","/ShowRatings.jsp?tid=1985772","/ShowRatings.jsp?tid=684834","/ShowRatings.jsp?tid=1117960","/ShowRatings.jsp?tid=1403078","/ShowRatings.jsp?tid=926834","/ShowRatings.jsp?tid=1695958","/ShowRatings.jsp?tid=1050748","/ShowRatings.jsp?tid=863408","/ShowRatings.jsp?tid=1208782","/ShowRatings.jsp?tid=927165","/ShowRatings.jsp?tid=1552061","/ShowRatings.jsp?tid=1693693","/ShowRatings.jsp?tid=1096441","/ShowRatings.jsp?tid=810671","/ShowRatings.jsp?tid=626639","/ShowRatings.jsp?tid=1969662","/ShowRatings.jsp?tid=942860","/ShowRatings.jsp?tid=1755697","/ShowRatings.jsp?tid=1987377","/ShowRatings.jsp?tid=1501366","/ShowRatings.jsp?tid=1704426","/ShowRatings.jsp?tid=1382642","/ShowRatings.jsp?tid=1986700","/ShowRatings.jsp?tid=1475599","/ShowRatings.jsp?tid=1948278","/ShowRatings.jsp?tid=686285","/ShowRatings.jsp?tid=997129","/ShowRatings.jsp?tid=1029154","/ShowRatings.jsp?tid=761313","/ShowRatings.jsp?tid=1956922","/ShowRatings.jsp?tid=1970077","/ShowRatings.jsp?tid=1290137","/ShowRatings.jsp?tid=1730159","/ShowRatings.jsp?tid=821267","/ShowRatings.jsp?tid=1147139","/ShowRatings.jsp?tid=1922460","/ShowRatings.jsp?tid=1802050","/ShowRatings.jsp?tid=1262957","/ShowRatings.jsp?tid=1097502","/ShowRatings.jsp?tid=984811","/ShowRatings.jsp?tid=815757","/ShowRatings.jsp?tid=873625","/ShowRatings.jsp?tid=797183","/ShowRatings.jsp?tid=1985589","/ShowRatings.jsp?tid=959211","/ShowRatings.jsp?tid=1069368","/ShowRatings.jsp?tid=972875","/ShowRatings.jsp?tid=1552719","/ShowRatings.jsp?tid=766395","/ShowRatings.jsp?tid=1904988","/ShowRatings.jsp?tid=1923281","/ShowRatings.jsp?tid=1413618","/ShowRatings.jsp?tid=1967887","/ShowRatings.jsp?tid=793574","/ShowRatings.jsp?tid=1144279","/ShowRatings.jsp?tid=856921","/ShowRatings.jsp?tid=1148338","/ShowRatings.jsp?tid=1991495","/ShowRatings.jsp?tid=1902480","/ShowRatings.jsp?tid=919254","/ShowRatings.jsp?tid=1938998","/ShowRatings.jsp?tid=1992456","/ShowRatings.jsp?tid=1974347","/ShowRatings.jsp?tid=1237703","/ShowRatings.jsp?tid=1439970","/ShowRatings.jsp?tid=1589006","/ShowRatings.jsp?tid=1001148","/ShowRatings.jsp?tid=1883746","/ShowRatings.jsp?tid=793780","/ShowRatings.jsp?tid=1576075","/ShowRatings.jsp?tid=1577818","/ShowRatings.jsp?tid=786900","/ShowRatings.jsp?tid=1383440","/ShowRatings.jsp?tid=966146","/ShowRatings.jsp?tid=1377652","/ShowRatings.jsp?tid=1429633","/ShowRatings.jsp?tid=1541080","/ShowRatings.jsp?tid=1751435","/ShowRatings.jsp?tid=1012470","/ShowRatings.jsp?tid=1910849","/ShowRatings.jsp?tid=1803117","/ShowRatings.jsp?tid=1403235","/ShowRatings.jsp?tid=1682818","/ShowRatings.jsp?tid=1431864","/ShowRatings.jsp?tid=1403488","/ShowRatings.jsp?tid=1173848","/ShowRatings.jsp?tid=1825140","/ShowRatings.jsp?tid=1145914","/ShowRatings.jsp?tid=1137796","/ShowRatings.jsp?tid=1033049","/ShowRatings.jsp?tid=1086636","/ShowRatings.jsp?tid=1667791","/ShowRatings.jsp?tid=1058629","/ShowRatings.jsp?tid=1867104","/ShowRatings.jsp?tid=1228356","/ShowRatings.jsp?tid=1453605","/ShowRatings.jsp?tid=990623","/ShowRatings.jsp?tid=1799553","/ShowRatings.jsp?tid=1050024","/ShowRatings.jsp?tid=1702790","/ShowRatings.jsp?tid=1393741","/ShowRatings.jsp?tid=1726063","/ShowRatings.jsp?tid=1989884","/ShowRatings.jsp?tid=1905371","/ShowRatings.jsp?tid=966133","/ShowRatings.jsp?tid=901104","/ShowRatings.jsp?tid=1010598","/ShowRatings.jsp?tid=1824524","/ShowRatings.jsp?tid=1705967","/ShowRatings.jsp?tid=2024352","/ShowRatings.jsp?tid=1447117","/ShowRatings.jsp?tid=955766","/ShowRatings.jsp?tid=1873440","/ShowRatings.jsp?tid=822871","/ShowRatings.jsp?tid=1899649","/ShowRatings.jsp?tid=487462","/ShowRatings.jsp?tid=774749","/ShowRatings.jsp?tid=1775657","/ShowRatings.jsp?tid=2028415","/ShowRatings.jsp?tid=975737","/ShowRatings.jsp?tid=852265","/ShowRatings.jsp?tid=833829","/ShowRatings.jsp?tid=1452124","/ShowRatings.jsp?tid=1050108","/ShowRatings.jsp?tid=1349602","/ShowRatings.jsp?tid=1237560","/ShowRatings.jsp?tid=1857934","/ShowRatings.jsp?tid=1748355","/ShowRatings.jsp?tid=1833500","/ShowRatings.jsp?tid=1882014","/ShowRatings.jsp?tid=1599320","/ShowRatings.jsp?tid=1592282","/ShowRatings.jsp?tid=1136743","/ShowRatings.jsp?tid=1361441","/ShowRatings.jsp?tid=1231439","/ShowRatings.jsp?tid=1983103","/ShowRatings.jsp?tid=1620040","/ShowRatings.jsp?tid=1988606","/ShowRatings.jsp?tid=640125","/ShowRatings.jsp?tid=630410","/ShowRatings.jsp?tid=1841096","/ShowRatings.jsp?tid=1591040","/ShowRatings.jsp?tid=1027062","/ShowRatings.jsp?tid=916202","/ShowRatings.jsp?tid=793549","/ShowRatings.jsp?tid=846727","/ShowRatings.jsp?tid=889658","/ShowRatings.jsp?tid=1474315","/ShowRatings.jsp?tid=774101","/ShowRatings.jsp?tid=2013928","/ShowRatings.jsp?tid=2033207","/ShowRatings.jsp?tid=1323177","/ShowRatings.jsp?tid=1191160","/ShowRatings.jsp?tid=2039155","/ShowRatings.jsp?tid=1001391","/ShowRatings.jsp?tid=1986749","/ShowRatings.jsp?tid=1532627","/ShowRatings.jsp?tid=734734","/ShowRatings.jsp?tid=1949707","/ShowRatings.jsp?tid=1898692","/ShowRatings.jsp?tid=1000062","/ShowRatings.jsp?tid=1926044","/ShowRatings.jsp?tid=981295","/ShowRatings.jsp?tid=2010007","/ShowRatings.jsp?tid=1967335","/ShowRatings.jsp?tid=659640","/ShowRatings.jsp?tid=1921240","/ShowRatings.jsp?tid=1678017","/ShowRatings.jsp?tid=677499","/ShowRatings.jsp?tid=1988074","/ShowRatings.jsp?tid=1986219","/ShowRatings.jsp?tid=1676486","/ShowRatings.jsp?tid=1145927","/ShowRatings.jsp?tid=2045021","/ShowRatings.jsp?tid=2045876","/ShowRatings.jsp?tid=1291353","/ShowRatings.jsp?tid=1389486","/ShowRatings.jsp?tid=1830525","/ShowRatings.jsp?tid=1596493","/ShowRatings.jsp?tid=141673","/ShowRatings.jsp?tid=1991107","/ShowRatings.jsp?tid=1993379","/ShowRatings.jsp?tid=2005182","/ShowRatings.jsp?tid=2016007","/ShowRatings.jsp?tid=1503361","/ShowRatings.jsp?tid=1700331","/ShowRatings.jsp?tid=833828","/ShowRatings.jsp?tid=960623","/ShowRatings.jsp?tid=1452299","/ShowRatings.jsp?tid=1650284","/ShowRatings.jsp?tid=1980105","/ShowRatings.jsp?tid=1988344","/ShowRatings.jsp?tid=687589","/ShowRatings.jsp?tid=1328524","/ShowRatings.jsp?tid=1964340","/ShowRatings.jsp?tid=1462089","/ShowRatings.jsp?tid=1737217","/ShowRatings.jsp?tid=1428114","/ShowRatings.jsp?tid=1903083","/ShowRatings.jsp?tid=1380628","/ShowRatings.jsp?tid=2016386","/ShowRatings.jsp?tid=2031356","/ShowRatings.jsp?tid=1145918","/ShowRatings.jsp?tid=802832","/ShowRatings.jsp?tid=819671","/ShowRatings.jsp?tid=690648","/ShowRatings.jsp?tid=1830754","/ShowRatings.jsp?tid=2040444","/ShowRatings.jsp?tid=1258366","/ShowRatings.jsp?tid=1176618","/ShowRatings.jsp?tid=1804214","/ShowRatings.jsp?tid=2012454","/ShowRatings.jsp?tid=996562","/ShowRatings.jsp?tid=1649736","/ShowRatings.jsp?tid=1950078","/ShowRatings.jsp?tid=1126038","/ShowRatings.jsp?tid=1510337","/ShowRatings.jsp?tid=1279030","/ShowRatings.jsp?tid=892982","/ShowRatings.jsp?tid=1940362","/ShowRatings.jsp?tid=1982741","/ShowRatings.jsp?tid=987674","/ShowRatings.jsp?tid=1366530","/ShowRatings.jsp?tid=1388064","/ShowRatings.jsp?tid=2049053","/ShowRatings.jsp?tid=1145916","/ShowRatings.jsp?tid=1388061","/ShowRatings.jsp?tid=1408783","/ShowRatings.jsp?tid=1408781","/ShowRatings.jsp?tid=1949990","/ShowRatings.jsp?tid=2031456","/ShowRatings.jsp?tid=1912517","/ShowRatings.jsp?tid=1187152","/ShowRatings.jsp?tid=2028079","/ShowRatings.jsp?tid=2023766","/ShowRatings.jsp?tid=1129208","/ShowRatings.jsp?tid=439896","/ShowRatings.jsp?tid=1938339","/ShowRatings.jsp?tid=2019929","/ShowRatings.jsp?tid=1145922","/ShowRatings.jsp?tid=907563","/ShowRatings.jsp?tid=1887995","/ShowRatings.jsp?tid=1700435","/ShowRatings.jsp?tid=1145924","/ShowRatings.jsp?tid=1904869","/ShowRatings.jsp?tid=1921252","/ShowRatings.jsp?tid=2013905","/ShowRatings.jsp?tid=1647784","/ShowRatings.jsp?tid=1986891","/ShowRatings.jsp?tid=1501056","/ShowRatings.jsp?tid=2051276","/ShowRatings.jsp?tid=1465371","/ShowRatings.jsp?tid=1330642","/ShowRatings.jsp?tid=1382633","/ShowRatings.jsp?tid=911919","/ShowRatings.jsp?tid=903397","/ShowRatings.jsp?tid=1805060","/ShowRatings.jsp?tid=1004727","/ShowRatings.jsp?tid=2044449","/ShowRatings.jsp?tid=1063078"]

		  //console.log(sharedProf.get_course_prof());
		  var check_prof = sharedProf.get_course_prof();
		  var prof_last_name = check_prof.substr(0,check_prof.indexOf(',')+2)
		  prof_last_name = prof_last_name.replace(/,/g,', ')
		  //console.log("|" + prof_last_name +"|");
		  var prof_index;
		  $scope.prof_name = sharedProf.get_course_prof();
		  var found = false;
		  for(var i = 0; i < ratings_prof.length; i++){
		    if(ratings_prof[i].indexOf(prof_last_name) !== -1){

		      prof_index = i;
		      i = ratings_prof.length;
		      found = true;
		    }
		  }

            return $http.get('http://crossorigin.me/http://www.ratemyprofessors.com/' + ratings_links[prof_index])
              .then(function(response){
                 var tmp = document.implementation.createHTMLDocument();
                    tmp.body.innerHTML = response.data;
                    ////console.log("tmp.body = " + tmp.body.innerHTML);
                    var Quality = tmp.getElementsByClassName('grade');
                    //  console.log(Quality)
                    var Class = tmp.getElementsByClassName('class');
                    var Report = tmp.getElementsByClassName('commentsParagraph');
                    var Rating = tmp.getElementsByClassName('rating');

                    var Type = tmp.getElementsByClassName('rating-type')
                    var slider_info = tmp.getElementsByClassName('rating-slider');
                    var date_info = tmp.getElementsByClassName('date')




                    $scope.comments_block = [];



                    $scope.quality_score = "";
                    $scope.average_grade = "";
                    $scope.easiness_score = "";
                    $scope.clarity_score = "";
                    $scope.helpfulness_score = "";

                    //console.log(Quality);
                    if(found == true){
                      var helpfulness = slider_info[0].innerText.trim().split(/[ ,]+/);
                      var clarity = slider_info[1].innerText.trim().split(/[ ,]+/);
                      var easiness = slider_info[2].innerText.trim().split(/[ ,]+/);
                      $scope.quality_score = Quality[0].innerText;
                      $scope.average_grade = Quality[1].innerText;
                      for(var i = 0; i < Report.length; i++){
                        var report_side = Report[i].innerText.trim();
                        var date_comment = date_info[i].innerText.trim();
                        var report_comments = Class[i+1].innerText.trim();
                        var report_type = Type[i].innerText.trim();
                        var course = report_comments.split(/[ ,]+/);
                        var course_name = course[0];
                        var course_credit = course[1] + " " + course[2] + " " + course[3];
                        var course_attendence = course[4] + " " + course[5];


                      $scope.comments_block[i] = { side: report_side,
                                                  date: date_comment,
                                                  type: report_type,
                                                  comments: {
                                                              name: course_name,
                                                              credit: course_credit,
                                                              attendence: course_attendence
                                                            }
                                                 }
                      }

                    $scope.easiness_score = easiness[1];
                    $scope.clarity_score = clarity[1];
                    $scope.helpfulness_score = helpfulness[1];



                      
                    }else{
                      $scope.quality_score = "Score not found on RMP. N/A";
                      $scope.average_grade = "Grade not found on RMP. N/A";
                      
                    }


                  

                    //$scope.average_grade = Quality[1].innerText

         });
		    console.log("Going into the state...");
		    $state.go('course');
		
		}
		
	});

	SlugSearch.controller('courseController', function($scope) {
		console.log("Doing work on the courseController")

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
