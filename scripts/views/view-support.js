define([
		"jquery",
		"jquerycookie",
		"app",
		"utils",
		"marionette",
		"hbs!templates/template-view-support",
		"scripts/collections/collection-support-search",
		"scripts/models/model-delete-admin"
	],
	function($, Cookie, App, Utils, Marionette, Template, CollectionSupportSearch, DeleteAdmin){
	"use strict";

	var ViewSupport = Marionette.ItemView.extend({
		tagName : "div",
		className : "content",
		template: Template,
		events : {
			"click #search-button"	: "search"
		},

		initialize : function(){
			_.bindAll.apply(_, [this].concat(_.functions(this)));
			console.log("Support view initialized...");

			$(document.body).delegate(".grid-list.support li button.destroy.admin", "click", this.removeAdmin);

			this.listenTo(App, "alertPrimaryAction", this.alertPrimaryAction);
			this.listenTo(App, "alertSecondaryAction", this.alertSecondaryAction);
		},

		onShow : function(){
			$("#search-field").keyup(function(event){
				if(event.keyCode == 13){
					$("#search-button").click();
				}
			});
		},

		search : function(){
			var that = this;
			var searchTerm = $("#search-field").val();
			if(searchTerm !== ""){
				var search = new CollectionSupportSearch({string : searchTerm});

					search.fetch({
						success : function(response){
							that.model = response.models;
							that.render();
						},
						error : function(){
							console.log("Error fetching search results...");
							Utils.ShowToast({ message : "Error fetching search results..."});
						}
					});

			}
		},

		alertPrimaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "admin":
					this.completeRemoveAdmin();
				break;
			}
		},

		alertSecondaryAction : function(){
			var listener = $("#app-alert").attr("data-listener");
			switch(listener){
				case "admin":
					this.cancelRemoveAdmin();
				break;
			}
		},

		removeAdmin : function(event){
			var id = $(event.target).attr("id");
			var guid = $(event.target).attr("data-guid");
			var employer = $(event.target).attr("data-employer");
			this.adminID = id;
			this.adminGUID = guid;
			this.adminEmployer = employer;
			Utils.ShowAlert({listener : "admin", primary : true, primaryType : "destroy", primaryText : "Remove", title : "Remove Admin", message : "Are you sure you wan't to remove this admin?" });
		},

		completeRemoveAdmin : function(){
			Utils.HideAlert();

			var deleteAdmin = new DeleteAdmin({id : this.adminID, guid : this.adminEmployer, admin : this.adminGUID});

				deleteAdmin.destroy({
					dataType : "text",
					success : function(response){
						App.router.controller.support();
					},
					error : function(){
						console.log("Error removing admin...");
						Utils.ShowToast({ message : "Error removing admin..."});
					}
				});
		},

		cancelRemoveAdmin : function(){
			Utils.HideAlert();
		},
		
		serializeData : function(){
			var jsonObject = new Object();
				jsonObject.admins = this.model;
				jsonObject.employers = this.model;
				jsonObject.language = App.Language;
			return jsonObject;
		}
		
	});

	return ViewSupport;
});