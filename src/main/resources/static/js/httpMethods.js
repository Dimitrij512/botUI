
var host = 'http://localhost:8082'

function getPobutUser(personalAccount) {
  var theResponse;
  $.ajax({
    type: 'GET',
    url: host + '/chat/customer/physical/' + personalAccount,
    contentType: 'application/json',
    async: true,

    success: function(response) {

      userPreChat = response;
      
      userPreChat.clientId = response.accountNumber;

      if (response != '') {

        $('.loader').hide();
        $('#media').load('/templates/selectAppeals.html');

      } else {
        $('.loader').hide();

        $("#personalAccount").css("border", "1px solid red");
        $('#errorUserPobut').html('<p style="color:red;"> Вибачте, неправильно введено' +
          '<br>особовий рахунок, уточніть будь ласка </p>');

        $('#formDiv').show();
      }

    },
    error: function(jqXHR) {
      $('.loader').hide();
      $("#personalAccount").css("border", "1px solid red");

      $('#errorUserPobut').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');

    },
  });
}

function getJuridicUser(contractNumber) {

  var theResponse;

  var juridicUser = {

    "contractNumber": contractNumber
  }

  $.ajax({
    type: 'POST',
    url: host + '/chat/customer/juridical',
    data: JSON.stringify(juridicUser),
    contentType: 'application/json; charset=utf-8',
    success: function(response) {
      
      userPreChat = response;
      userPreChat.clientId = response.contractNumber;

      if (response !== '') {
        $('.loader').hide();

        $('#media').load('/templates/selectAppealsJuridic.html');

      } else {
        $('.loader').hide();
        $('#formDiv').show();

        $("#contractNumber").css("border", "1px solid red");
        $('#errorRequestJuridic').html(
          '<p style="color:red;"> Просимо уточнити номер договору</p>');
      }
    },
    error: function(jqXHR) {
      
      $('.loader').hide();
      $('#formDiv').show();

      $("#contractNumber").css("border", "1px solid red");

      $('#errorRequestJuridic').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');
    },
  });
}

function getEnergyReportPobut(accountNumber) {
  $.ajax({
    type: 'GET',
    url: host + '/chat/customer/physical/' + accountNumber + '/report',
    contentType: 'application/json',
    success: function(response) {

      if (response !== '') {

        $('.loader').hide();

        $('#showDataForUser').html('<p> Шановний споживач, <br> на даний момент за Вашою адресою : <br> ' + response.fullAddress +
          '<br> проводяться ' + response.scenario +
          '<br> орієнтований час включення : <br>' + response.endTurnOff +
          '<br> Просимо вибачення за незручності !</p>');

      } else {

        $('.loader').hide();

        $("#showDataForUser").html('<p style="color:red;"> За Вашою адресою вимкнення не зареєстровані.' +
          '<br> Для детальної інформації зверніться за телефоном : ' +
          '<br> 0 800 50 40 20 (безкоштовно)' +
          '<br> &nbsp &nbsp &nbsp &nbsp або ' +
          '<br> (0342) 59 40 20 </p>');
      }
    },
    error: function(jqXHR) {

      $('.loader').hide();
      $('#showDataForUser').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');
    },
  });
}

function getEnergyReportJuridic(contractNumber, counterNumber) {

  var juridicUser = {

    "contractNumber": contractNumber,

  }

  $.ajax({
    type: 'POST',
    url: host + '/chat/customer/juridical/report',
    data: JSON.stringify(juridicUser),
    contentType: 'application/json; charset=utf-8',
    success: function(response) {

      if (response !== '') {

        $('.loader').hide();

        $('#showDataForUser').html(getListJuridicTurnOff(response));
      } else {
        $('.loader').hide();

        $("#showDataForUser").html('<p style="color:red;"> За Вашим номером договору вимкнення не зареєстровані.' +
          '<br> Для детальної інформації зверніться за телефоном : ' +
          '<br> 0 800 50 40 20 (безкоштовно)' +
          '<br> &nbsp &nbsp &nbsp &nbsp або ' +
          '<br> (0342) 59 40 20 </p>');
      }
    },
    error: function(jqXHR) {
      $('.loader').hide();
      $('#showDataForUser').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');
    },
  });

}

function getListJuridicTurnOff(juridicUsers) {
  var text = '<p> Шановний споживач, <br> на даний момент в електромережах' +
    '<br> від яких живляться Ваші електроустановки : '

  var textReturn = text;
  var apology = '<br> Просимо вибачення за незручності !</p>'

  juridicUsers.forEach(juridicUser => {
    textReturn = textReturn.concat('<hr>' + ' за адресою : ' + juridicUser.fullAddress + '<br>' +
      'проводяться ' + juridicUser.scenario + '<br>' +
      'орієнтований час включення : <br>' +
      juridicUser.endTurnOff)
  });
  textReturn = textReturn.concat(apology);

  return textReturn;
}

function getBillCustomer(accountNumber) {
  var today = getCurrentDate();
  $.ajax({
    type: 'GET',
    url: host + '/chat/customer/physical/' + accountNumber + '/bill',
    contentType: 'application/json',
    success: function(response) {
      $('.loader').hide();
      
      if(response > 0){
      $('#showDataForUser').html('<p> Шановний споживач, <br>станом на  : ' + today +
        ' <br> Вам до оплати : ' + response + ' грн. </p>');
      }else{
        var bill = response;
        
        $('#showDataForUser').html('<p> Шановний споживач, <br>станом на  : ' + today +
            ' <br> у Вас переплата : ' + bill.substring(1) + ' грн. </p>');
      }
    },
    error: function(jqXHR) {
      $('.loader').hide();
      $('#showDataForUser').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');
    },
  });

}

function saveIndicatorForThreeZoneCounter(accountNumber) {

  var indicatorThreeZone = {

    "peakIndicator": $("#fullfpeak").val(),

    "halfPeakIndicator": $("#halfPeak").val(),

    "nightIndicator": $("#nightIndicator3").val(),
  }
  
  if($("#phoneNumber").val() !== ''){
    indicatorThreeZone.phoneNumber = $("#phoneNumber").val()
  }

  $.ajax({
    type: 'POST',
    url: host + '/chat/customer/physical/' + accountNumber + '/indicator/threezone',
    data: JSON.stringify(indicatorThreeZone),
    contentType: 'application/json; charset=utf-8',
    success: function(response) {

      $('.loader').hide();

      
      if($("#phoneNumber").val() !== ''){
        
        $('#showDataForUser').html('<p>' + response  + ' Протягом доби Вам буде відправлено смс повідомлення з сумою до оплати </p>');
        
      }else{
        
        $('#showDataForUser').html('<p>' + response + ' </p>');
      }

      $('#showDataForUser').show();
    },
    error: function(jqXHR) {

      $('.loader').hide();

      $("#fullfpeak").css("border", "1px solid red");
      $("#halfPeak").css("border", "1px solid red");
      $("#nightIndicator3").css("border", "1px solid red");
      $('#errorRequest3').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');
      $('#showDataForUser').show();

    },
  });

}

function saveIndicatorForTwoZoneCounter(accountNumber) {

  var indicatorTwoZone = {

    "dayIndicator": $("#dayIndicator2").val(),

    "nightIndicator": $("#nightIndicator2").val()
  }
  
  if($("#phoneNumber").val() !== ''){
    
    indicatorTwoZone.phoneNumber = $("#phoneNumber").val()
  }

  $.ajax({
    type: 'POST',
    url: host + '/chat/customer/physical/' + accountNumber + '/indicator/twozone',
    data: JSON.stringify(indicatorTwoZone),
    contentType: 'application/json; charset=utf-8',
    success: function(response) {

      $('.loader').hide();

      if($("#phoneNumber").val() !==''){
        
        $('#showDataForUser').html('<p>' + response  + ' Протягом доби Вам буде відправлено смс повідомлення з сумою до оплати </p>');
        
      }else{
        
        $('#showDataForUser').html('<p>' + response + ' </p>');
      }

      $('#showDataForUser').show();

    },
    error: function(jqXHR) {

      $('.loader').hide();

      $("#dayIndicator2").css("border", "1px solid red");
      $("#nightIndicator2").css("border", "1px solid red");
      $('#errorRequest2').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');
      $('#showDataForUser').show();
    },
  });

}

function saveIndicatorForOneZoneCounter(accountNumber) {


  var indicator = {

    "indicator": $("#indicator").val()
  }
  
  if($("#phoneNumber").val() !== ''){
    indicator.phoneNumber = $("#phoneNumber").val()
  }

  $.ajax({
    type: 'POST',
    url: host + '/chat/customer/physical/' + accountNumber + '/indicator/onezone',
    data: JSON.stringify(indicator),
    contentType: 'application/json; charset=utf-8',
    success: function(response) {

      $('.loader').hide();
      
      if($("#phoneNumber").val() !== ''){
        
        $('#showDataForUser').html('<p>' + response  + ' <br>Протягом доби Вам буде відправлено смс повідомлення з сумою до оплати </p>');
        
      }else{
        
        $('#showDataForUser').html('<p>' + response + ' </p>');
      }
      
      $('#showDataForUser').show();
    },
    error: function(jqXHR) {
      $('.loader').hide();

      $("#indicator").css("border", "1px solid red");
      $('#errorIndicator').html('<p style="color:red;">' + jqXHR.responseText + ' </p>');
      $('#showDataForUser').show();
    },
  });

}

function saveRateOfOperator(dialogId, rate){
  
  $.ajax({
    type: 'POST',
    url: host + '/chat/settingRate/' + dialogId + '/' + rate,
    data: JSON.stringify(""),
    contentType: 'application/json; charset=utf-8',
    success: function(response) {
      console.log("all good: " + rate)
    },
    error: function(jqXHR) {
      console.log("all bad: " + rate)
    },
  });
}

function sendComplaint(complaintText, email) {
  
  var complaint = {
      'clientId': userPreChat.clientId,
      'text':complaintText,
      'email':email
  } 

  $.ajax({
    type: 'POST',
    url: host + '/chat/complaint',
    data: JSON.stringify(complaint),
    contentType: 'application/json; charset=utf-8',
    success: function(response) {
      $('.loader').hide();
      
      let selectForUser = isJuridic ? '/templates/selectAppealsJuridic.html' : '/templates/selectAppeals.html';
      $( ".btn-complaint" ).empty();

      $('#media').load(selectForUser);
/* 
      $("#showDataForUser").html('<p style="color:red;"> Вашу скаргу зафіксовано' +
          '<br> Відповідь на Вашу скаргу буде вислано Вам на електронну пошту' +
          '<br> яку Ви вказали при реєстрації скарги.' +
          '<br> (0342) 59 40 20 </p>');  */ 
    },
    error: function(jqXHR) {
      console.log(jqXHR);     
      $('.loader').hide();

    },
  });

}


function loadInputForIndexes(zone) {
  if (zone == '1') {
    $('#showDataForUser').load('/templates/oneZone.html');
  } else if (zone == '2') {
    $('#showDataForUser').load('/templates/twoZone.html');
  } else if (zone == '3') {
    $('#showDataForUser').load('/templates/threeZone.html');
  }
}


function getCurrentDate() {

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  today = dd + '-' + mm + '-' + yyyy;
  
  return today;

}