define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-account-verification"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewAccountVerification = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #continue"	: "continue",
			"click #resend"		: "resendPIN",
			"click #help-icon"	: "showHelp",
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Account Verification view initialized...");
		},

		continue : function(){
			console.log("Continue...");

			var pin = $("#pincode").val();

			if(pin === ""){
				Utils.ShowToast({message : "PIN is required"});
			}else{

				var that = this;
				var restURL = Utils.GetURL("/services/rest/user/");
				var user = Utils.GetUserSession();
				
				$.ajax({
					url : restURL+user.guid+"/verify",
					type : "POST",
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					data : {"verificationCode" : pin},
	    			success : function(){
	    				App.router.navigate("findBusiness", true);
	    			},
	    			error : function(response){
	    				if(response.status === 400){
	    					console.log("Invalid PIN Code...");
							Utils.ShowToast({ message : "Invalid PIN Code"});
	    				}
	    			}
				});

			}
			
		},

		resendPIN : function(){
			var that = this;
			var restURL = Utils.GetURL("/services/rest/user/");
			var user = Utils.GetUserSession();
			
			$.ajax({
				url : restURL+user.guid+"/resendEmail",
				type : "GET",
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	    		success : function(){
	    			Utils.ShowToast({ message : "We've sent you another PIN"});
	    		},
	    		error : function(response){
	    			if(response.status === 400){
	    				console.log("Error resending PIN...");
						Utils.ShowToast({ message : "Error resending PIN"});
	    			}
	    		}
			});
		},

		showHelp : function(){
			Utils.ShowHelp();
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.user = this.model,
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewAccountVerification;
});