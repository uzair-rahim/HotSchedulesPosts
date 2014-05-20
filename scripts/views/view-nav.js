define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-nav"
	],
	function($, Cookie, App, Utils, Marionette, Template){
	"use strict";

	var ViewNav = Marionette.ItemView.extend({
		tagName : "div",
		className : "navigation",
		template: Template,
		events : {
			"click #nav-button" 		: "showMenu",
			"click #jobs" 				: "jobs",
			"click #candidates" 		: "candidates",
			"click #network" 			: "network",
			"click #messages" 			: "messages",
			"click #settings" 			: "settings",
			"click #account-settings" 	: "accountSettings",
			"click #profile-settings" 	: "profileSettings",
			"click #logout" 			: "logout"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Nav view initialized...");
		},

		onShow : function(options){
			var tab = "jobs";
			if(typeof this.options.tab !== "undefined"){
				tab = this.options.tab
			}

			$("#nav-button").text(tab);

			$(document).on("click", function(event){
				var element = $(event.target).attr("id");
				var windowWidth = $(window).width();
				if(element !== "nav-button" && windowWidth <= 600){
					$("#nav-menu").css("display", "none");
				}

				if(element !== "settings"){
					$("#settings-flyout").css("display", "none");
				}
			});

			$(window).on("resize", function(){
				var windowWidth = $(window).width();
				if(windowWidth > 600){
					$("#nav-menu").css("display", "block");	
				}else{
					$("#nav-menu").css("display", "none");	
				}
			});
		},

		showMenu : function(){
			$("#nav-menu").css("display", "block");
		},

		jobs : function(){
			this.route("jobs");
		},

		candidates : function(){
			this.route("candidates");
		},

		network : function(){
			this.route("network");
		},

		messages : function(){
			this.route("messages");
		},

		settings : function(){
			var settings = $("#settings-flyout");
			var isVisible = $(settings).css("display") == "block"
			if(isVisible){
				$(settings).hide();
			}else{
				$(settings).show();
			}
		},

		accountSettings : function(){
			this.route("accountSettings");
		},

		profileSettings : function(){
			this.route("profileSettings");
		},

		logout : function(){
			App.router.navigate("logout", true);
		},

		route : function(fragment){
			if(Backbone.history.fragment === fragment){
				Backbone.history.loadUrl();
			}else{
				App.router.navigate(fragment, true);
			}
		},

		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewNav;
});