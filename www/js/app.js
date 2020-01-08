// Dom7
var $$ = Dom7;

var serverUrl = "http://www.campolimpopaulista.sp.gov.br/api/process.php";
// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
});

var person = {
  User_Id:"",
  name:"",
  accessToken:"",
  picture:"",
  email:""
};
//when you click facebook button
function FacebookLogin() {        
   FB.login(function(response){
      if(response.status == "connected"){
        person.User_Id = response.authResponse.userID;
        person.accessToken = response.authResponse.accessToken;
        FB.api('/me?fields=id,name,email,picture.type(large)',function(userData){
          person.name = userData.name;
          person.email = userData.email;
          person.picture = userData.picture.url;
          $.ajax({
            url:"index.html",
            method:"POST",
            data:person,
            dataType: 'text',
            success :function(serverResponse){
              if(serverResponse == "success")
                window.location = "/pages/home.html";
            }
          })
        })
      }
   },{score:'public_profile,email,'})
}
$$('#backBtn-forget').on('click', function () {
  window.location = "index.html";
});
$$('#backBtn-sign').on('click', function () {
  window.location = "index.html";
});
//when you click forget signup button
$$('#forget-signup').on('click', function () {
  var email = $$('#emailName').val();
  if(email == ""){
    app.dialog.alert("Email is not Exist", "Error");
    return;
  }
  checkinternet(function(){
    var url = serverUrl + "/ForgetPassword?Email=" + email;
    app.preloader.show();
    app.request.get(url,function(data){
      app.preloader.hide();
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        app.dialog.alert("We sent an email to your inbox, please check your inbox to get the new password", "Error");
      } else if (obj.status == "error"){
        switch(obj.status_type){
          case "1":
            app.dialog.alert(obj.Message, "Error");
            break;
          case "2":
            app.dialog.alert(obj.Message, "Error");
            break;
          case "3":
            app.dialog.alert(obj.Message, "Error");
            break;
        }
      }
    });
  });
});
function checkinternet(success,failed)
{
  $.ajax({
    url: "http://www.google.com",
    success: function(data) {
      success();
    },
    error: function(data) {
      failed();
      app.dialog.alert("No Connection");
    }
  });
}

//when you click login button
var URL = serverUrl + "/Login?Email=" + username + "&Password=" + password;
$$('#loginBtn').on('click', function () {
  var username = $$('#username').val();
  var password = $$('#password').val();
  var jsonOrder = {
    name : username,
    password : password
  };
  console.log(window.localStorage);
  checkinternet(function(success){
    var url = serverUrl + "/Login?Email=" + username + "&Password=" + password;
    app.preloader.show();
    app.request.get(url,function(data){
      app.preloader.hide();
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        window.localStorage.User_Id = obj.User_Id;    
        window.location = "/pages/home.html";
      }
      else if(obj.status == "error"){
        if(obj.status_type == "1"){
          app.dialog.alert("Email or Password not Blank", "Error");
        } else if (obj.status_type == "2"){
          app.dialog.alert("Email or Password not Exist", "Error");
        }
      }
    });
  });
});

//when you click signup button
$$('#SignupBtn').on('click',function(){
  var firstname = $$('#sign_firstname').val();
  var lastname = $$('#sign_lastname').val();
  var email = $$('#sign_email').val();
  var phoneNumber = $$('#sign_phoneNumber').val();
  var password = $$('#sign_password').val();
  var password_confirm = $$('#sign_password_confirm').val();
  var CPF = $$('#sign_CPF').val();
  var checkFlag = $$('#sign_check').prop('checked');
  sendUserInfomation(firstname,lastname,email,phoneNumber,password,password_confirm,checkFlag,CPF);
})
function sendUserInfomation(firstname,lastname,email,phoneNumber,password,password_confirm,checkFlag,CPF){
  if(username == ""){
    console.log("username is null");
  } else {
    if(email == "") {
      console.log("email is null");
    } else {
      if(phoneNumber == ""){
        console.log("phoneNumber is null");
      } else {
        if (password != password_confirm) {
          console.log("password is no correct");
        } else {
          if(CPF == ""){
            console.log("CPF is no correct");
          } else {
            if (!checkFlag){
              console.log("password is no correct");
            } else {
              checkinternet(function(){
                var url = serverUrl + "/SignUp?Email="+email+"&Password="+password+"&Name="+firstname+"&Last Name="+lastname+"&Cellphone="+phoneNumber+"&CPF="+CPF;
                app.preloader.show();
                app.request.get(url,function(data){
                  app.preloader.hide();
                  var resultObj = JSON.parse(data);

                  if(resultObj.status == "ok"){
                    if(resultObj.status_type){
                      app.dialog.alert(obj.Message,"SignUp");
                    } else{
                      app.dialog.alert("SignUp is successed", "SignUp");
                    }
                  } else {
                    if(resultObj.status_type == "1"){
                      app.dialog.alert(resultObj.Message,"Error");
                    } else if(resultObj.status_type == "2"){
                      app.dialog.alert(resultObj.Message,"Error");
                    } else if(resultObj.status_type == "3"){
                      app.dialog.alert(resultObj.Message,"Error");
                    }
                  }
                });
              });
            }
          }
        }
      }
    }
  }
}

window.fbAsyncInit = function() {
      FB.init({
        appId            : '251332208702255',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.12'
      });
    };

  (function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
