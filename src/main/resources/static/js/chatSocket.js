$(function() {
  
  var defauldRateOfOperator = 5;
  
  $( "#sendMessage" ).click(function() {
    sendMesage();
  });
  
  $('#endChat').click(function() {
    
    $('#media').load('/templates/selectRait.html');
    $('.input-group').empty();
    disconnect();
    
  });
  
  $("#selectRate").change(function() {
    $("#selectRate option:selected").each(function() {
      var rate = $(this).val();
      
      if(validation.isNumber(rate) && rate <= defauldRateOfOperator){
        console.log("send rate : " + rate);
        
        saveRateOfOperator(dataOperator.dialog_id, rate);
      }
      
      $("#callMan").show();
      $("#containerBot").empty();
      userPreChat = null;
      isJuridic = null;  
      
    });
  });
})


function createChat(){
  console.log("create chat");
  var stompClient = null;
  var dataOperator = null;
  var host = 'http://localhost:8082';
  
  connect();
 
}
  
  //Create web socket connection to the server
  function connect() {
    var maxRate = 5;    
    var socket = new SockJS(host + '/chat/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame)=> {
      
      console.log('Connected: ' + frame);
      
      $('.loader').show();
      
      stompClient.subscribe('/queue/'+ userPreChat.clientId , function(data) {

        var dataBody = JSON.parse(data.body);
        
        if(dataBody.id !== undefined){
          $('.loader').hide();
          
          dataOperator = dataBody;
          
          //httpmethod
          saveRateOfOperator(dataOperator.dialog_id, maxRate);
          
          $('#media').load('/templates/chat.html');
          $('#footer').load('/templates/chatFooter.html');

        }else if(dataBody.text !== undefined){
          
          $("#chat ul li:last").after('<li class="left clearfix"><span class="chat-img pull-left"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">Диспетчер</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>'+ getCurrnetTime() +'</small></div><p>'+ dataBody.text +'</p></div></li>');
        
        }else if(dataBody.ended) {
          $("#chat ul li:last").after('<li class="left clearfix"><span class="chat-img pull-left"></span><div class="chat-body clearfix"><div class="header"><strong class="primary-font">Диспетчер</strong> <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>'+ getCurrnetTime() +'</small></div><p>Диспетчер залишив чат. Зверніться на гарячу лінію !</p></div></li>');
        }
      });
        
        
        let urlForSend = isJuridic ? '/chat/connect/juridical/' : '/chat/connect/physical/';
        
        stompClient.send(urlForSend + userPreChat.clientId);

    });
  }

  // web socket disconnect
  function disconnect() {
    if (stompClient != null) {
     
      stompClient.send("/chat/operator/"+ dataOperator.id, {}, JSON.stringify({
        'text': 'Клієнт завершив чат !',
        'dialog_id': dataOperator.dialog_id        
      }));
      
      stompClient.disconnect();
    }
  }

  //Sent message to the server
  function sendMesage() {
  
      let message = $('#message').val()
      
      $('#message').val('')
      $("#chat ul li:last").after('<li class="right clearfix"><span class="chat-img pull-right"></span><div class="chat-body clearfix"><div class="header"><small class=" text-muted"><span class="glyphicon glyphicon-time"></span>'+ getCurrnetTime() + '</small><strong class="pull-right primary-font"> Ви </strong></div><p>'+ message +'</p></div></li>');
      
      stompClient.send("/chat/operator/"+ dataOperator.id, {}, JSON.stringify({
        'text': message,
        'dialog_id': dataOperator.dialog_id        
      }));
}
  
function getCurrnetTime(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var seconds = today.getSeconds();

  if(dd<10) {
      dd = '0'+dd;
  } 

  if(mm<10) {
      mm = '0'+mm;
  }
  
  if(hours < 10){
    hours = '0'+hours;
  }
  
  if(minutes<10){
    minutes = '0'+minutes;
  }
  
  if(seconds<10){
    seconds = '0'+seconds
  }

  return today =  hours + ':' + minutes + ':' + seconds
  
}  
  