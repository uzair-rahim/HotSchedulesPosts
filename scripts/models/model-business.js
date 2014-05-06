define([
	"backbone",
	"utils"
	],
	function(Backbone, Utils){
	function(Backbone){
		var Business = Backbone.Model.extend({
			defaults : {},

			urlRoot : function(){
				return Utils.GetURL("/services/rest/employer");
			},

			url : function(){
				var url = this.urlRoot();
				return url;
			},

			initialize : function(){
				console.log('Business model initialize...');
			}

		});

		return Business;
	}
);