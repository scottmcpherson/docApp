Session.setDefault("currentFormId", "");

Template.buildForm.helpers({
   slideRight: function() {
      return ((Session.equals("active", "docs") || Session.equals("active", "forms")) && Session.equals("subNavActive", false)) ? "slide-right" : "";
   }
});
Template.dragElements.rendered = function(){
   $(".draggable").draggable({
      connectToSortable: "#sortable",
      cursor: "move",
      helper: "clone",
      revert: "invalid"
   });
};
Template.formFields.rendered = function() {
   var that = this;
   Session.set("currentFormId", this.data.form._id);

   $('#sortable').sortable({

      revert: 100,
      placeholder: "ui-form-state-highlight",
      cursor: "move",
      // containment: "parent",
     
      stop: function( event, ui ) {

         var newRank = ui.item.index();

         var allSortables = $('.draggable-persisted');

         if(ui.item.hasClass("new-item")) {
            var droppedType = ui.item.children()[0].id;
            ui.item.remove();
            if (droppedType === "text" || droppedType === "textarea" || droppedType === "date") {
               
               FormFields.insert({
                  formId: that.data.form._id,
                  label: "",
                  forVal: "",
                  type: droppedType,
                  rank: newRank
               });
               ui.item.removeClass("new-item");
               _.each(allSortables, function(item, index){

                  if (index >= newRank) {
                     var id = $(allSortables[index]).data("id");
                     FormFields.update(id, { $inc: { rank: 1 }});
                     
                  }
               });   
              
            } else {
               // handle invalid drop form input types
               alert("invalid type");
            }
           
         } 
      },
      update: function( event, ui ) {
         var allSortables = $(event.target).children('.draggable-persisted');
         // console.log("this",this)

        
         _.each(allSortables, function( item, index ) {
            var id = $(item).data('id');
            // console.log(
            //    "id: ", id,
            //    "index: ", index
            //    );
            FormFields.update(id, { $set: { rank: index }}, function(error) {
               Log("formFields updated");
            });
            Meteor.call('updateDocRanks', {
               formId: Session.get("currentFormId"),
               fieldId: id,
               rank: index
            }, function(error, doc) {
               if(!error) {
                  console.log("success doc updated!!!", doc);
               } else {
                  console.log("error!!!", error);
               }
            });
            // console.log("formId: ", Session.get("currentFormId"));
         });
      }
   });
   $( "#sortable" ).disableSelection();
   
}

Template.field.events({
   "click .trash": function(e) {
      e.preventDefault();    
      FormFields.remove(this._id, function(error) {
         if (!error) {
            var allFields = $('.draggable-persisted');
            _.each(allFields, function(item, index) {
               var id = $(item).data("id");
               FormFields.update(id, { $set: { rank: index }});
            });
         }  
      });
   },
   "keyup .labels": function(e) {
      e.preventDefault();
      if (e.keyCode === 13) {
         var val = String(e.target.value || "").trim();
         var newVal = val.replace(/\s/g, '');
         // console.log(newVal); 
         FormFields.update(this._id, { $set: { label: val, forVal: newVal }}, function(error) {
            if(error) {
               console.log(error);
            } else {
               console.log("success");
            }

         });

      }
      
    
   }
});


Template.formFields.events({
   'click .save' : function (){
      var id = this.form._id
      var fields = $('.form-group');
      var formObj = { formId: id, formFields: fields };
      FormHelper.constructObject(formObj, function(err, fieldObj) {
         if(err) {
            // console.log("error detected: ", err);
         } else {
            FormFields.insert(fieldObj);
            // console.log( "fieldObj: ", fieldObj );
         }
         
      });
 
   }
});