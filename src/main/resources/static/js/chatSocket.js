

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
      
      stompClient.subscribe('/queue/'+ userPreChat.accountNumber , function(data) {
        
    
        console.log(data);
        if(data.operator_name != null){
          dataOperator = data;
        }else {
          console.log(data.text);
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
      $( "#showMessage").append( "<p>ha"+ message +"</p>" );
      
      stompClient.send("/chat/operator/"+ dataOperator.operator_name, {}, JSON.stringify({
        'text': $('#message').val(),
        'dialog_id': dataOperator.dialog_id        
      }));
}