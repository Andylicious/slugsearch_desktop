/* SearchControllers looks at pisaparser_service and hands it off to
 * our HTML, in this case search.html and AppCtrl
 * 
 */

(function() {

  angular.module('SlugSearch').controller('SearchController', ['PisaService', SearchController]);

  function term_button(){
    
  }
  function SearchController(pisaParser) {
    var vm = this;
      pisaParser.getPisaFields().then(
        function (pisa) {
          vm.pisa = pisa;
          //console.log(vm.pisa);
          //how to collect the data structure
         //console.log(vm.pisa.term_map);
         //console.log("String: " + vm.pisa.term_map.term_string[0] + " | Value: " + vm.pisa.term_map.term_id[0]);
         //console.log("String: " + vm.pisa.session_map.session_string[1] + " s| Value: " + vm.pisa.session_map.session_id[1]);               
});

        return vm;
  }

})();

