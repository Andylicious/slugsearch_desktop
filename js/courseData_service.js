/* SharedProperties serve to hold all of the relevant data needed for
 * the post request. search.html will propagate the variables, and 
 * the nodejs server will receive them and send them into resultsView.
 *
 */
angular.module('SlugSearch').service('courseData', [function($ionicLoading) {

    var tmp_course;
    var bookmarks = [];
    var all_pisa;

    return {
        get_tmp_course: function() {
            return tmp_course;
        },
        get_pisa: function(){
            return all_pisa;
        },
        set_pisa: function(value){
            all_pisa = value;
        },
        set_tmp_course: function(value) {
            tmp_course = value;
        },
        get_bookmarks: function(){
            return bookmarks;
        },
        in_bookmarks: function(){
            if(bookmarks.indexOf(tmp_course)!=-1){
                return true;
            }else{
                return false;
            }
        },
        push_bookmarks: function(value){
 
            if(bookmarks.indexOf(tmp_course)!=-1){
             
            }else{
                bookmarks.push(tmp_course);
            }
            
        },
        get_bookmarks_size: function(){
            return bookmarks.length;
        }

    }
}]);
