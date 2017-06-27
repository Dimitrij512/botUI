$(function() {
 

  /** This data of user are using also in botFrom.js */
  var userPreChat;
  var isJuridic;
  
  $('#hideWindow').click(function() {
    
    $("#callMan").show();
    $("#containerBot").empty();
    userPreChat = null;
    isJuridic = null;
    
  });

  $('#showBotWindow').click(function() {
    
    console.log('navigation ..');
    
    console.log(navigator.userAgent); 
    
    if ($('#containerBot').is(':empty')){
      
      $("#callMan").hide();
      $('#containerBot').load('/templates/botWindow.html');
  
    }
  });

});
