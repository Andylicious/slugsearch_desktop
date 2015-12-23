/* SharedProperties serve to hold all of the relevant data needed for
 * the post request. search.html will propagate the variables, and 
 * the nodejs server will receive them and send them into resultsView.
 *
 */
angular.module('SlugSearch').service('sharedProperties', [function() {
    var term_string = "";

    var action = "results";
    var term_bind = "2160";
    var reg_bind = "0";
    var sub_bind = "";
    //sub_bind becomes session_code
    var cat_op_bind = "=";
    var cat_nbr_bind = "";
    var title_bind = '';
    var instr_name_bind = "=";
    var instr_bind = "";
    var ge_bind = "";
    var crse_op_bind = "=";
    var crse_from_bind = "";
    var crse_to_bind = "";
    var crse_exact_bind = "";
    var days_bind = "";
    var times_bind = "";
    var acad_bind = "";
    var all_pisa;

    return {
        get_term_string: function(){
            return term_string;
        },
        get_term_bind: function() {
            return term_bind;
        },
        get_action: function() {
            return action;
        },
                get_pisa: function(){
            return all_pisa;
        },
        set_pisa: function(value){
            all_pisa = value;
        },
        get_term_bind: function() {
           return term_bind;
        },
        get_reg_bind: function() {
           return reg_bind;
        },
        get_sub_bind: function() {
           return sub_bind;
        },
        get_cat_op_bind: function() {
           return cat_op_bind;
        },
        get_cat_nbr_bind: function() {
           return cat_nbr_bind;
        },
        get_title_bind: function() {
           return title_bind;
        },
        get_instr_name_bind: function() {
           return instr_name_bind;
        },
        get_instr_bind: function() {
           return instr_bind;
        },
        get_ge_bind: function() {
           return ge_bind;
        },
        get_crse_op_bind: function() {
           return crse_op_bind;
        },
        get_crse_from_bind: function() {
           return crse_from_bind;
        },
        get_crse_to_bind: function() {
           return crse_to_bind;
        },
        get_crse_exact_bind: function() {
           return crse_exact_bind;
        },
        get_days_bind: function() {
           return days_bind;
        },
        get_times_bind: function() {
            return times_bind;
        },
        get_acad_bind: function() {
            return acad_bind;
        },
        set_action: function(value) {
            action = value;
        },
        set_term_string: function(value){
            term_string = value;
        },
        set_term_bind: function(value) {
            term_bind = value;
        },
        set_reg_bind: function(value) {
            reg_bind = value;
        },
        set_sub_bind: function(value) {
            sub_bind = value;
        },
        set_cat_op_bind: function(value) {
            cat_op_bind = value;
        },
        set_cat_nbr_bind: function(value) {
            cat_nbr_bind = value;
        },
        set_title_bind: function(value) {
            title_bind = value;
        },
        set_instr_name_bind: function(value) {
            instr_name_bind = value;
        },
        set_instr_bind: function(value) {
            instr_bind = value;
        },
        set_ge_bind: function(value) {
            ge_bind = value;
        },
        set_crse_op_bind: function(value) {
            crse_op_bind = value;
        },
        set_crse_from_bind: function(value) {
            crse_from_bind = value;
        },
        set_crse_to_bind: function(value) {
            crse_to_bind = value;
        },
        set_crse_exact_bind: function(value) {
            crse_exact_bind = value;
        },
        set_days_bind: function(value) {
            days_bind = value;
        },
        set_times_bind: function(value) {
            times_bind = value;
        },
        set_acad_bind: function(value) {
            acad_bind = value;
        }

    }
}]);
