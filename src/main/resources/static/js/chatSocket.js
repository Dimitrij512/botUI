$(function() {
    
  $( "#sendMessage" ).click(function() {
    sendMesage();
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
    
    var socket = new SockJS(host + '/chat/chat-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame)=> {
      
      console.log('Connected: ' + frame);
      
      $('.loader').show();
      
      stompClient.subscribe('/queue/'+ userPreChat.accountNumber , function(data) {

        var dataBody = JSON.parse(data.body);
        
        console.log("Data ID : " + dataBody.id);
        
        if(dataBody.id !== undefined){
          $('.loader').hide();
          
          dataOperator = dataBody;
          $('#media').load('/templates/chat.html');
          $('#footer').load('/templates/chatFooter.html');

        }else if(dataBody.text !== undefined){
          console.log(dataBody.text);
          $("#showMessage").append( "<p>"+ dataBody.text +"</p>" );
        }else {
          console.log(dataBody);
        }

        console.log('In method');
        console.log(JSON.parse(data.body));
//        
//        console.log('Data: ' + data);
//        console.log('operator_name: ' + dataOperator.operator_name);
//        console.log('dialog_id: ' + dataOperator.dialog_id);
        
      });
      
      //if (socket.readyState === 1) {
        
        stompClient.send("/chat/connect/" + userPreChat.accountNumber);
//        
//        console.log("readyState : " + socket.readyState);
        
        //sendMesage();
        //disconnect();
      //}
    });
  }

  // web socket disconnect
  function disconnect() {
    if (stompClient != null) {
      stompClient.disconnect();
    }
  }

  //Sent message to the server
  function sendMesage() {
         
      let message = $('#message').val()
      
      $('#message').val('')
      $( "#showMessage").append( "<p>"+ message +"</p>" );
      
      console.log(message);
      stompClient.send("/chat/operator/"+ dataOperator.id, {}, JSON.stringify({
        'text': message,
        'dialog_id': dataOperator.dialog_id        
      }));
      
      console.log('end method');
}
  