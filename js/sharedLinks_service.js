/* sharedLinks hold the links for each individual classes
 * we grab the links from the initial post request, and we send
 * the individual links when resultsView -> courseView
 */
angular.module('SlugSearch').service('sharedLinks',[function(){
  var course_link = "http://crossorigin.me/https://pisa.ucsc.edu/class_search/";
  var books_link = '';
  return {
    get_course_link: function() {
            return course_link;
        },
    set_course_link: function(value){
            course_link += value
           
    },get_books_link: function() {
            return books_link;
        },
    set_books_link: function(value){
    	
    		var filtered_value = value.substr(1,value.indexOf(',')-2);
            books_link += filtered_value
           
    }


      }

}]);