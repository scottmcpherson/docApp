FormHelper = function(options){
   options = options || {};
   this.fields = options.formFields;
   this.formId = options.formId;
   this.formName = options.title || "";

};
FormHelper.prototype = {
   
   constructor: FormHelper,
   
};
_.extend(FormHelper.prototype, {
   mapToObject: function(options, callback) {

      var formObj  = {}; 
      var that = this;

      _.each(this.fields, function(i){
         formObj.formId = that.formId;
         formObj.forVal = i.children[0].htmlFor;
         formObj.type   = i.children[1].type;
         callback(null, formObj);
      });    
   },

   buildObjArray: function(options, callback) {
      var fieldsArray = [];
      
      _.each(this.fields, function(i){
         var docObj = {
            fieldId : i.dataset.id,
            forVal  : i.children[0].htmlFor,
            val     : i.children[1].value
         };
         fieldsArray.push(docObj);
      });
      callback(null, {
         formId: this.formId,
         formName: this.formName,
         fields: fieldsArray
      });
   }

});

_.extend(FormHelper, {
   constructObject: function(options, callback) {
      return new FormHelper(options).mapToObject(options, callback);
   }, 
   getObjArray: function(options, callback) {
      return new FormHelper(options).buildObjArray(options, callback);
   }

});

Handlebars.registerHelper("formatFields", function(data){
   var id = data._id || "";
   var value = data.label || "";
   var textInput =   '<div class="draggable-persisted" data-id="'+ id +'"> \
                        <div class="buttons-container"><button type="button" class="trash btn btn-default btn-sm"><span class="glyphicon glyphicon-trash"></span></button></div> \
                        <div class="form-group"> \
                           <input type="text" class="form-control labels" placeholder="Label" value="'+ value +'"> \
                           <input type="text" name="client-name" class="form-control" id="client-name" placeholder="Name this field"> \
                        </div> \
                     </div>';

   var textArea =   '<div class="draggable-persisted" data-id="'+ id +'"> \
                        <div class="buttons-container"><button type="button" class="trash btn btn-default btn-sm"><span class="glyphicon glyphicon-trash"></span></button></div> \
                        <div class="form-group"> \
                           <input type="text" class="form-control labels" placeholder="Label" value="'+ value +'"> \
                           <textarea name="about-client" class="form-control" rows="3"></textarea> \
                        </div> \
                     </div>';

   var date =       '<div class="draggable-persisted" data-id="'+ id +'"> \
                        <div class="buttons-container"><button type="button" class="trash btn btn-default btn-sm"><span class="glyphicon glyphicon-trash"></span></button></div> \
                        <div class="form-group"> \
                           <input type="text" class="form-control labels" placeholder="Label" value="'+ value +'"> \
                           <input type="date" name="date-added" class="form-control" id="date-added"> \
                        </div> \
                     </div>';
   if(data.type === "text") { return new Handlebars.SafeString(textInput); };
   if(data.type === "textarea") { return new Handlebars.SafeString(textArea); };
   if(data.type === "date") { return new Handlebars.SafeString(date); };
});
Handlebars.registerHelper("formatDocFields", function(data) {
   var id = data._id || "";
   var value = data.label || "";
   var labelFor = data.forVal || "";
   var textInput =   '<div class="doc-field"> \
                        <div class="form-group" data-id="'+ id +'"> \
                           <label for="'+ labelFor +'">'+ value +'</label>\
                           <input type="text" name="'+ labelFor +'" class="form-control" placeholder="Name this field"> \
                        </div> \
                     </div>';

   var textArea =   '<div class="doc-field"> \
                        <div class="form-group" data-id="'+ id +'"> \
                           <label for="'+ labelFor +'">'+ value +'</label>\
                           <textarea name="'+ labelFor +'" class="form-control" rows="3"></textarea> \
                        </div> \
                     </div>';

   var date =       '<div class="doc-field"> \
                        <div class="form-group" data-id="'+ id +'"> \
                           <label for="'+ labelFor +'">'+ value +'</label>\
                           <input type="date" name="'+ labelFor +'" class="form-control"> \
                        </div> \
                     </div>';
   if(data.type === "text") { return new Handlebars.SafeString(textInput); };
   if(data.type === "textarea") { return new Handlebars.SafeString(textArea); };
   if(data.type === "date") { return new Handlebars.SafeString(date); };
});













