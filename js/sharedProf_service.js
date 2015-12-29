/* sharedProf holds the professor variable from between 
 * clicking on an element in resultsView, to the course details view
 */

angular.module('SlugSearch').service('sharedProf',[function(){
  var course_prof = "";
  return {
    get_course_prof: function() {
            return course_prof;
        },
    set_course_prof: function(value){
            course_prof = value;
    }


      }


}]);