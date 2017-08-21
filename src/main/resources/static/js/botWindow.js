$(function() {
 

  /** This data of user are using also in botFrom.js */
  var userPreChat;
  var isJuridic;
  var isHasOperator = false;
  
  $('#hideWindow').click(function() {
    
    // web socket disconnect
    disconnect();
  
    
    $("#callMan").show();
    $("#containerBot").empty();
    userPreChat = null;
    isJuridic = null;    
  });

  $('#showBotWindow').click(function() {
   
    if ($('#containerBot').is(':empty')){
      
      $("#callMan").hide();
      $('#containerBot').load('/templates/botWindow.html');
  
    }
  }); 
});
