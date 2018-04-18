$(document).ready(function(){

    var counter = 2;

    $("#addButton").click(function () {

    if(counter>10){
            alert("Only 10 textboxes allow");
            return false;
    }

    var newTextBoxDiv = $(document.createElement('div'))
         .attr("id", 'TextBoxDiv' + counter)
         .attr("class", 'form-group');

    newTextBoxDiv.after().html('<label class="col-sm-2 control-label">Course ID #'+ counter + ': </label>' +
          '<div class="col-sm-10"><input class="form-control" type="text" name="textbox' + counter +
          '" ' + counter + '></div>');

    newTextBoxDiv.appendTo("#formInput");


    counter++;
     });

     $("#removeButton").click(function () {
    if(counter==1){
          alert("No more textbox to remove");
          return false;
       }

    counter--;

        $("#TextBoxDiv" + counter).remove();

     });

     $("#getButtonValue").click(function () {

    var msg = 'Are you sure you want to proceed?';
          alert(msg);
     });
  });
