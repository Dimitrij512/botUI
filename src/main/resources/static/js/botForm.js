var validation = {

  isNotEmpty: function(str) {
    var pattern = /\S+/;
    return pattern.test(str);
  },
  isNumber: function(str) {
    var pattern = /^\d+$/;
    return pattern.test(str);
  },
  isLength: function(str) {
    return str.length == 8;
  },
  isPhoneNumber: function(str){
    var pattern = /^(\+38|0)\d{7,10}$/;
    return pattern.test(str);
  },
  isEmail: function(str){
    var pattern = /\S+@\S+\.\S+/;
    return pattern.test(str);
  },

};

/** This select downloads to page the form for data entry of user after chose the type of user */
$(function() {
  var selectedUser = null;
  $("#selectUser").change(function() {
    $("#selectUser option:selected").each(function() {
      selectedUser = $(this).val();
      if (selectedUser === 'juridic') {
        $('#formDiv').load('/templates/juridicUser.html');
      } else if (selectedUser === 'pobut') {
        $('#formDiv').load('/templates/pobutUserForm.html');
      } else {
        $('#media').load('/templates/chat.html');
        $('#footer').load('/templates/chatFooter.html');
      }
    });

  });
  
  $(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        if(selectedUser != null && selectedUser === 'pobut'){
          $('#submitPobutUser').click();
        }else if (selectedUser != null && selectedUser === 'juridic') {
          $('#submitJuridicUser').click();
        }  
    }
  }); 

  $("#submitPobutUser").click(function() {

    isJuridic = false;
    let inputValue = $("#personalAccount").val();
    let isNumber = validation.isNumber(inputValue);
    let isNotEmpty = validation.isNotEmpty(inputValue);
    let isLength = validation.isLength(inputValue);

    if (isNumber && isNotEmpty && isLength) {

      $("#personalAccount").css("border", "");
      $('#errorUserPobut').empty();

      $('#selectUser').attr('disabled', 'disabled');
      $('.loader').show();
      $('#formDiv').hide();

      getPobutUser($('#personalAccount').val());

    } else {

      $("#personalAccount").css("border", "1px solid red");
      $('#errorUserPobut').html('<p style="color:red;"> Некоректно введено особовий рахунок </p>');

    }

  });
  

  $("#submitJuridicUser").click(function() {

    isJuridic = true;

    let inputContractNumber = $("#contractNumber").val();

    let isNotEmptyContract = validation.isNotEmpty(inputContractNumber);

    if (!(isNotEmptyContract)) {

      $("#contractNumber").css("border", "1px solid red");
      $('#errorContractNumber').html('<p style="color:red;"> Поле не може бути пустим </p>');
      $('#errorRequestJuridic').empty();

    } else {

      $("#contractNumber").css("border", "");
      $('#errorContractNumber').empty();
      $('#errorRequestJuridic').empty();

    }

    if (isNotEmptyContract) {

      $("#contractNumber").css("border", "");
      $('#errorContractNumber').empty();
      $('#errorRequestJuridic').empty();

      $('.loader').show();
      $('#selectUser').attr('disabled', 'disabled');
      $('#formDiv').hide();

      getJuridicUser($('#contractNumber').val());

    }

  });

  $("#submitBill1").click(function() {

    let inputValue = $("#indicator").val();
    let inputPhoneNumber = $("#phoneNumber").val();
    let isNumber = validation.isNumber(inputValue);
    let isNotEmpty = validation.isNotEmpty(inputValue);

    let isPhoneNumber = inputPhoneNumber === ''? true : validation.isPhoneNumber(inputPhoneNumber);
    
      if(!isPhoneNumber){
        $("#phoneNumber").css("border", "1px solid red");
        $('#errorPhoneNumber').html('<p style="color:red;"> Невіний формат </p>'); 
      }else{
        $("#phoneNumber").css("border", "");
        $('#errorPhoneNumber').empty();
      }

      
    if(!isNumber){
      $("#indicator").css("border", "1px solid red");
      $('#errorIndicator').html('<p style="color:red;"> Некоректно введений показник </p>');
    }else{
      $("#indicator").css("border", "");
      $('#errorIndicator').empty();
    }
    
    if (isNumber && isPhoneNumber) {
      $('#selectAppeals').attr('disabled', 'disabled');
      $('.loader').show();
      $('#showDataForUser').hide();

      saveIndicatorForOneZoneCounter(userPreChat.accountNumber);
    }
    
  });

  $("#submitBill2").click(function() {

    let validInputDay = true;
    let validInputNight = true;

    let inputValue1 = $("#dayIndicator2").val();
    let isNumber1 = validation.isNumber(inputValue1)
    let isNotEmpty1 = validation.isNotEmpty(inputValue1);

    let inputValue2 = $("#nightIndicator2").val();
    let isNumber2 = validation.isNumber(inputValue2)
    let isNotEmpty2 = validation.isNotEmpty(inputValue2);
    
    let inputPhoneNumber = $("#phoneNumber").val();
    
    let isPhoneNumber = inputPhoneNumber === ''? true : validation.isPhoneNumber(inputPhoneNumber);

    if(!isPhoneNumber){
      $("#phoneNumber").css("border", "1px solid red");
      $('#errorPhoneNumber').html('<p style="color:red;"> Невірний формат </p>');
      
    }else{
      $("#phoneNumber").css("border", "");
      $('#errorPhoneNumber').empty();
    }
    
    if (!(isNumber1 && isNotEmpty1)) {

      $("#dayIndicator2").css("border", "1px solid red");
      $('#errorIndicatorDay').html('<p style="color:red;"> Некоректно введений показник </p>');
      validInputDay = false;

    } else {

      $("#dayIndicator2").css("border", "");
      $('#errorIndicatorDay').empty();
    }

    if (!(isNumber2 && isNotEmpty2)) {

      $("#nightIndicator2").css("border", "1px solid red");
      $('#errorIndicatorNight').html('<p style="color:red;"> Некоректно введений показник </p>');
      validInputNight = false;

    } else {

      $("#nightIndicator2").css("border", "");
      $('#errorIndicatorNight').empty();
    }

    if (validInputDay && validInputNight && isPhoneNumber) {

      $('#selectAppeals').attr('disabled', 'disabled');
      $('.loader').show();
      $('#showDataForUser').hide();

      saveIndicatorForTwoZoneCounter(userPreChat.accountNumber);
    }

  });

  $("#submitBill3").click(function() {

    let isValidFullfpeak = true;
    let isValidHalfPeak = true;
    let isValidNight = true;

    let inputValue1 = $("#fullfpeak").val();
    let isNumber1 = validation.isNumber(inputValue1)
    let isNotEmpty1 = validation.isNotEmpty(inputValue1);

    let inputValue2 = $("#halfPeak").val();
    let isNumber2 = validation.isNumber(inputValue2)
    let isNotEmpty2 = validation.isNotEmpty(inputValue2);

    let inputValue3 = $("#nightIndicator3").val();
    let isNumber3 = validation.isNumber(inputValue3);
    let isNotEmpty3 = validation.isNotEmpty(inputValue3);
    
    let inputPhoneNumber = $("#phoneNumber").val();
    
    let isPhoneNumber = inputPhoneNumber === ''? true : validation.isPhoneNumber(inputPhoneNumber);

    if(!isPhoneNumber){
      $("#phoneNumber").css("border", "1px solid red");
      $('#errorPhoneNumber').html('<p style="color:red;"> Невірний формат </p>');
      
    }else{
      $("#phoneNumber").css("border", "");
      $('#errorPhoneNumber').empty();
    }
    
    if (!(isNumber1 && isNotEmpty1)) {

      $("#fullfpeak").css("border", "1px solid red");
      $('#errorFullfpeak').html('<p style="color:red;"> Некоректно введений показник </p>');

      isValidFullfpeak = false;

    } else {

      $("#fullfpeak").css("border", "");
      $('#errorFullfpeak').empty();
    }

    if (!(isNumber2 && isNotEmpty2)) {

      $("#halfPeak").css("border", "1px solid red");
      $('#errorHalfPeak').html('<p style="color:red;"> Некоректно введений показник </p>');
      isValidHalfPeak = false;

    } else {

      $("#halfPeak").css("border", "");
      $('#errorHalfPeak').empty();
    }

    if (!(isNumber3 && isNotEmpty3)) {

      $("#nightIndicator3").css("border", "1px solid red");
      $('#errorNightIndicator3').html('<p style="color:red;"> Некоректно введений показник </p>');
      isValidNight = false;

    } else {

      $("#nightIndicator3").css("border", "");
      $('#errorNightIndicator3').empty();
    }

    if (isValidFullfpeak && isValidHalfPeak && isValidNight && isPhoneNumber) {

      $('#selectAppeals').attr('disabled', 'disabled');
      $('.loader').show();
      $('#showDataForUser').hide();

      saveIndicatorForThreeZoneCounter(userPreChat.accountNumber);

    }

  });
  
  $("#sendComplaint").click(function(){
    $('.loader').show();
    let email = $("#emailComplaint").val();
    let textComplaint = $('#comment_text').val();

    if(validation.isEmail(email)){
        $("#emailComplaint").css("border", "");
        $('#errorEmailComplaint').empty();
        sendComplaint(textComplaint, email);
    }else{
      $("#emailComplaint").css("border", "1px solid red");
      $('#errorEmailComplaint').html('<p style="color:red;"> Некоректно введений електронна пошта </p>');
    }
  });
  
  $("#canselComplaint").click(function(){
    
    let selectForUser = isJuridic ? '/templates/selectAppealsJuridic.html' : '/templates/selectAppeals.html';
    
      $( ".btn-complaint" ).empty();
      $('#media').load(selectForUser);
  });
  

  $("#selectAppeals").change(function() {

    $("#selectAppeals option:selected").each(function() {

      var appeal = $(this).val();
      
      if (appeal === 'consultation') {

        $("#showDataForUser").empty();
        createChat();

      } else if (appeal === 'lackOfElectricity') {

        if (isJuridic) {

          $("#showDataForUser").empty();
          $('.loader').show();
          $('#selectAppeals').attr('disabled', 'disabled');

          getEnergyReportJuridic(userPreChat.contractNumber, userPreChat.counterNumber);

        } else {

          $("#showDataForUser").empty();
          $('#selectAppeals').attr('disabled', 'disabled');
          $('.loader').show();

          getEnergyReportPobut(userPreChat.accountNumber);

        }

      } else if (appeal === 'amountDue') {

        $("#showDataForUser").empty();
        $('#selectAppeals').attr('disabled', 'disabled');
        $('.loader').show();

        getBillCustomer(userPreChat.accountNumber);

      } else if (appeal === 'indexes') {
        
        if (!isCanGiveIndexes()) {
          $("#showDataForUser").html('<p style="color:red;"> Вибачте, показники приймаються' +
            '<br> з 20 числа поточного місяця ' +
            '<br> по 1 число наступного місяця!</p>');
        } else {
          loadInputForIndexes(userPreChat.activeScaleCount);
        }
      } else if (appeal === 'complaint') {

        $('#media').load('/templates/complaint.html');
        $('#footer').load('/templates/submitButtonForComplaint.html');
        
        
      } else if (appeal === 'default') {

        $("#showDataForUser").empty();
      }
    });
  });
});

function textAreaAdjust(o) {
  o.style.height = "1px";
  o.style.height = (10+o.scrollHeight)+"px";
}

function isCanGiveIndexes() {
  var date = new Date();
  var numberDay = date.getDate();
  return (numberDay >= 20 || 1 == numberDay) ? true : false;
}
