/* the intial "control hub" for getting the pisa data drop down menu
 * this is pretty much completed and doesn't need any other extra work
 *
 */

(function() {

    angular.module('SlugSearch').factory('PisaService', ['sharedProperties','$http', '$q','courseData', PisaService])


    function PisaService (sharedProperties,$http, $q) {

        return {

            getPisaFields: function () {

                var parsePisa = function (response) {

                    var tmp = document.implementation.createHTMLDocument();
                    tmp.body.innerHTML = response.data;
                    //console.log("tmp.body = " + tmp.body.innerHTML);
                    

                    var term = tmp.getElementById('term_dropdown');

                    var session = tmp.getElementById('Session');
                    var reg_status = tmp.getElementById('reg_status');
                    var subject = tmp.getElementById('subject');
                    var ge = tmp.getElementById('ge');


                    //console.log("Term = " + term + " With length = " + term.length);

                    var term_id = [];
                    var session_id = [];
                    var reg_status_id = [];
                    var subject_id = [];
                    var ge_id = [];

                    var term_string = [];
                    var session_string = [];
                    var reg_status_string = [];
                    var subject_string = [];
                    var ge_string = [];

                    for(var i = 0; i < term.length; i++){
                        var tmp_term = term[i];
                        term_id.push(tmp_term.value);
                        term_string.push(tmp_term.innerText);
                    }

                    for (var i = 0; i < session.length; i++){
                    	var tmp_session = session[i];
                    	session_id.push(tmp_session.value);
                    	session_string.push(tmp_session.innerText);
                    }

                     for (var i = 0; i < reg_status.length; i++){
                    	var tmp_reg_status = reg_status[i];
                    	reg_status_id.push(tmp_reg_status.value);
                    	reg_status_string.push(tmp_reg_status.innerText);
                    }

                     for (var i = 0; i < subject.length; i++){
                    	var tmp_subject = subject[i];
                    	subject_id.push(tmp_subject.value);
                    	subject_string.push(tmp_subject.innerText);
                    }
                    
                     for (var i = 0; i < ge.length; i++){
                    	var tmp_ge = ge[i];
                    	ge_id.push(tmp_ge.value);
                    	ge_string.push(tmp_ge.innerText);
                    }

   
                    var term_map = {term_string, term_id};
                    sharedProperties.set_term_bind(term_map.term_id[0]);
                    sharedProperties.set_term_string(term_map.term_string[0]);
                    var session_map = {session_string, session_id};
                    var reg_status_map = {reg_status_string, reg_status_id};
                    var subject_map = {subject_string, subject_id};   
                    var ge_map = {ge_string, ge_id};


                    var pisa_results = { term_map,session_map,reg_status_map,subject_map,ge_map };
                    sharedProperties.set_pisa(pisa_results);
                    return pisa_results;
                }


                var promise = $http.get('http://crossorigin.me/https://pisa.ucsc.edu/class_search/')
                            .then(function(response){
                                return parsePisa(response);
                            });
                            return promise;
            }

            

        }

    }
})();