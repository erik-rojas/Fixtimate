// Dom7
var $$ = Dom7;


var pageUrl = "http://www.campolimpopaulista.sp.gov.br/api/process.php/GetListNews?Page=";
var severUrl = "http://www.campolimpopaulista.sp.gov.br/api/process.php";

var newsArr = [];
var page_count = 0;
var allowInfinite = true;
var typeOccourList =[];
var showAndHidden = false;
var index = -1;
var markers = [];
var marker_icons = [];
var indexs = 0;
var occurrences_location = {};

var User_Id = window.localStorage.User_Id;

var home  = new Framework7({
  root: '#home', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  routes: routes,
});

window.localStorage.newsArr = "";
window.localStorage.NewsItem = "";
window.localStorage.contactList = "";
window.localStorage.occurrencesList = "";
window.localStorage.occursItem ="";
window.localStorage.categorieList = "";
window.localStorage.categorieItem = "";
window.localStorage.aboutInfo = "";
var mapss = null;
var map = null;
var settingMap = null;

function Logout(){
  window.location = "../index.html";
}

$$(document).on('page:init', function (e, page) { //complete
  // Page Data contains all required information about loaded and initialized page
  if(page.name == "home") {
    home.preloader.show();
    checkinternet(function(){
      home.preloader.hide();
      window.localStorage.newsArr = "";
      var url = pageUrl + "0";//sliding news
      home.preloader.show();
      home.request.get(url,function(data){
        home.preloader.hide();

        var obj = JSON.parse(data);
        if(obj.status == "ok"){
          if(newsArr.length < 1){
            newsArr.push(obj);
            window.localStorage.newsArr = window.localStorage.newsArr + data + "&&&";
            initHome();
          }
        } else if(obj == "error"){
          home.dialog.alert(obj.Message,"Error");
        }
      });
    } , function(){
      home.preloader.hide();
        newsArr = [];
        var newsTArr = window.localStorage.newsArr.split('&&&');
        if(newsTArr.length > 1){
          for(var i = 0; i < newsTArr.length - 1; i++){
           var obj = JSON.parse(newsTArr[i]);
           newsArr.push(obj);
          }  
        }
    })
  }
});
function leftBtn(){ //complete
  if(indexs <= 0)
    return;
  var currentIndex = indexs - 1;
  $$('#slideItem').html("");
  var itemHTML = '<a href="#" class="popup-open" data-popup = ".popup-newspage" onclick = "onClickNewsItem(' + newsArr[0].NewsList[currentIndex].news_id + ',' + newsArr[0].NewsList[currentIndex].news_category_id+ ')" id = " ' + newsArr[page_count].NewsList[0].news_id +'">' + 
      '<div class="row">'+
          '<img src="'+ newsArr[0].NewsList[currentIndex].news_image + '" width="200px" height="150px" style = "margin-left:140px;">' + 
          '</div>' + 
          '<div class="row">' + 
          '</div>'+
          '</a>';
  $$('#slideItem').append(itemHTML);
  indexs = currentIndex;
}
function rightBtn(){ //complete
  if(indexs >= 3)
    return;
  var currentIndex = indexs + 1;
  $$('#slideItem').html("");
  var itemHTML = '<a href="#" class="popup-open" data-popup = ".popup-newspage" onclick = "onClickNewsItem(' + newsArr[0].NewsList[currentIndex].news_id + ',' + newsArr[0].NewsList[currentIndex].news_category_id+ ')" id = " ' + newsArr[page_count].NewsList[0].news_id +'">' + 
      '<div class="row">'+
          '<img src="'+ newsArr[0].NewsList[currentIndex].news_image + '" width="200px" height="150px" style = "margin-left:140px;">' + 
          '</div>' + 
          '<div class="row">' + 
          '</div>'+
          '</a>';
  $$('#slideItem').append(itemHTML);
  indexs = currentIndex;
}
function initHome(){
  //for(var i =0 ; i < 4;i++){
  var itemHTML = '<a href="#" class="popup-open" data-popup = ".popup-newspage" onclick = "onClickNewsItem(' + newsArr[page_count].NewsList[0].news_id + ',' + newsArr[page_count].NewsList[0].news_category_id+ ')" id = " ' + newsArr[page_count].NewsList[0].news_id +'">' + 
      '<div class="row">'+
        '<img src="'+ newsArr[page_count].NewsList[0].news_image + '" width="200px" height="150px" style = "margin-left: 170px;">' + 
      '</div>' + 
      '<div class="row">' + 
      '</div>'+
      '</a>';
  $$('#slideItem').append(itemHTML);
  itemHTML = "";
  //}
  for(var i = 0; i < newsArr[page_count].NewsList.length;i++){
    var itemHTML =
      '<li onclick = "onClickNewsItem(' + newsArr[page_count].NewsList[i].news_id + ',' + newsArr[page_count].NewsList[i].news_category_id+ ')" class="item-content" id = "' + newsArr[page_count].NewsList[i].news_id + '">' + 
        '<a href="#" class="item-link item-content popup-open" data-popup = ".popup-newspage">'+
          '<div class="item-media"><img src="' + newsArr[page_count].NewsList[i].news_image + '" width="100"/></div>' +
          '<div class="item-inner">' +
            '<div class="item-title-row">' +
              '<div class="item-title">' + newsArr[page_count].NewsList[i].news_title + '</div>' +
            '</div>' +
            '<div class="item-text">' + newsArr[page_count].NewsList[i].news_short_description + '</div>' +
          '</div>' +
        '</a>' + 
      '</li>';
    $$('#uls').append(itemHTML);
    itemHTML = "";
  } //complete
}

var onClickNewsItem = function(newsId,news_category_id){
  $$('#newsItem').html("");
  home.preloader.show();
  checkinternet(function(){
    window.localStorage.NewsItem = "";
    home.preloader.hide();
    var url = severUrl + "/GetNews?News_Id=" + newsId;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      var obj = JSON.parse(data);
      window.localStorage.NewsItem = window.localStorage.NewsItem + data + "&&&";
      console.log(window.localStorage.NewsItem);
      var itemHTML = '<div class="block-title">' + obj.news_title + '</div>' +
          '<div class="block block-strong">' +
          '<img src = "' + obj.news_image+ '" style = "width:' +window.innerWidth +'px;">' +
          '</div>' +   
          '<div class="block block-strong">' + obj.news_content +  
          '</div>' + 
          '<div class="block block-footer">' + obj.news_hour + "-------" + obj.news_date+ '</div>' + 
          '</div>';
      $$('#newsItem').append(itemHTML);
    });
  } ,function(){
    home.preloader.hide();
    var newsObjArr = window.localStorage.NewsItem.split("&&&");
    for(var j = 0 ; j< newsObjArr.length-1;j++){
      var obj = JSON.parse(newsObjArr[j]);
      if(obj.news_category_id == news_category_id){
        var itemHTML = '<div class="block-title">' + obj.news_title + '</div>' +
          '<div class="block block-strong">' +
          '<img src = "' + obj.news_image+ '" style = "width:' +window.innerWidth +'px;">' +
          '</div>' +   
          '<div class="block block-strong">' + obj.news_content +  
          '</div>' + 
          '<div class="block block-footer">' + obj.news_hour + "-------" + obj.news_date+ '</div>' + 
          '</div>';
        $$('#newsItem').append(itemHTML);
        break;
      }
    }
  }); //complete
}//complete
var response_view = function(){
  $$('#all_message').html("");
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    window.localStorage.contactList = "";//if you connected internet , localStorage clear.
    var url = severUrl + "/GetListContacts?User_Id=" + User_Id;//User_Id
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      var obj = JSON.parse(data);
      window.localStorage.contactList = window.localStorage.contactList + data + "&&&";
      if(obj.status == "ok"){
        for(var i =0;i < obj.ContactsList.length;i++){
          if(obj.ContactsList[i].is_response == "0"){ //sent
            var itemHTML =
            '<div class="message message-sent"  style="padding-top: 30px;">'+
              '<div class="message-content">' + 
                '<div class="message-header">' + obj.ContactsList[i].date + "____" + obj.ContactsList[i].hour + '</div>' +
                '<div class="message-bubble">' + 
                  '<div class="message-text">' + "Me:"+obj.ContactsList[i].mensagem + '</div>' + 
                '</div>' + 
            '</div>';
            $$('#all_message').append(itemHTML);
          }
          else if (obj.ContactsList[i].is_response == "1"){ //response
            var itemHTML =
            '<div class="message message-received"  style="padding-top: 30px;">'+
              '<div class="message-content">' + 
                '<div class="message-title">' + obj.ContactsList[i].date + '</div>' +
                '<div class="message-bubble">' + 
                  '<div class="message-text">' + "Sever:"+obj.ContactsList[i].mensagem + '</div>' + 
                '</div>' + 
              '<div class="message-footer">' + obj.ContactsList[i].hour + '</div>' + 
            '</div>';
            $$('#all_message').append(itemHTML);
          }
        }
      } else if(obj.status == "error"){
        if(obj.status_type == "1"){
          home.dialog.alert(obj.Message , "Error");
        }
      }
    });
  } , function(){
    home.preloader.hide();
    var ContactListTArr = window.localStorage.contactList.split("&&&");

    for(var k =0 ; k < ContactListTArr.length -1;k++){
      var obj = JSON.parse(ContactListTArr[i]);
      for(var i =0;i < obj.ContactsList.length;i++){
        if(obj.ContactsList[i].is_response == "0"){ //sent
              var itemHTML =
              '<div class="message message-sent"  style="padding-top: 50px;">'+
                '<div class="message-content">' + 
                  '<div class="message-header">' + obj.ContactsList[i].date + "____" + obj.ContactsList[i].hour + '</div>' +
                  '<div class="message-bubble">' + 
                    '<div class="message-text">' + "Me:"+obj.ContactsList[i].mensagem + '</div>' + 
                  '</div>' + 
              '</div>';
              $$('#all_message').append(itemHTML);
          }
          else if (obj.ContactsList[i].is_response == "1"){ //response
            var itemHTML =
            '<div class="message message-received"  style="padding-top: 50px;">'+
              '<div class="message-content">' + 
                '<div class="message-title">' + obj.ContactsList[i].date + '</div>' +
                '<div class="message-bubble">' + 
                  '<div class="message-text">' + "Sever:"+ obj.ContactsList[i].mensagem + '</div>' + 
                '</div>' + 
              '<div class="message-footer">' + obj.ContactsList[i].hour + '</div>' + 
            '</div>';
            $$('#all_message').append(itemHTML);
          }
        }
      }
  });//complete
} //complete

var send_contact = function(){
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    var url = severUrl + "/SendContact?Message=" + $$('#contact_text').val() + "&User_Id=" + User_Id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        home.dialog.alert("", "Success");
      } else if (obj.status == "error"){
        home.dialog.alert(obj.Message, "error");
      }
    });  
  }, function(){
    home.preloader.hide();
    home.dialog.alert("You dont have internet connection please try again.","Error");    
  })//complete
}//complete

function sendProfileInfo(firstname,lastname,email,password,phoneNumber,user_id){
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    var url = severUrl + "/userEditProfile?Email=" + email + "&Password=" +password + "&Name=" + firstname + "&Last_Name=" + lastname + "&Cellphone=" + phoneNumber + "&User_Id=" + user_id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        home.dialog.alert("Your profile is updated", "Success");
      } else if(obj.status == "error"){
        if(obj.status_type == "1"){
          home.dialog.alert(obj.Message, "Error");
        } else if(obj.status_type == "2"){
          home.dialog.alert(obj.Message, "Error");
        }
      }
    });
  },function(){
    //failed
    home.preloader.hide();
    home.dialog.alert("You dont have internet connection please try again.","Error"); 
  });
}//complete

function initGoogleMapView(){
  $$('#google_categorie').html("");
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    var url = severUrl + "/MapGetListCategories?User_Id=" + User_Id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      window.localStorage.categorieList = "";
      window.localStorage.categorieList += data;
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        for(var i =0 ; i < obj.CategoriesList.length;i++){
          var objs = {
            "id": obj.CategoriesList[i].categorie_id,
            "icon":obj.CategoriesList[i].categorie_pin_marker
          }
          marker_icons.push(objs);
          var itemHTML =
          '<div onclick="onClickCategorieItem(' + obj.CategoriesList[i].categorie_id +')" class="swiper-slide" id = "'+ "categorie_" + obj.CategoriesList[i].categorie_id +'" style = "background-color:#0d232b;width:'+ window.innerWidth / 3+ 'px; margin-right:10px;">'+
            '<a href="#" class="item-link list-button">'+
              '<div class="item">'+
                '<div class="item-media">' + 
                  '<img src="' + obj.CategoriesList[i].categorie_icon + '" style="width: 40px;height: 40px;">'+
                '</div>' + 
                '<div class="row">' +
                  '<div class = "item-title">' + obj.CategoriesList[i].categorie_name + '</div>' 
                '</div>'+
              '</div>'+
            '</a>'+
          '</div>';
          $$('#google_categorie').append(itemHTML);
          itemHTML = "";
        }
      } else if(obj.status == "error"){
        if(obj.status_type == "1"){
          obj.dialog.alert(obj.Message , "Error");
        }
      }
    });
  } , function(){
    home.preloader.hide();
    home.dialog.alert("Connection Failed","Error");
  });
}//complete

var onClickCategorieItem = function(categorieId){
  if(markers.length > 0)
    deleteMarkers();
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    var url = severUrl + "/MapGetPoints?User_Id=" + User_Id+"&Categorie_Id="+categorieId;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      var obj = JSON.parse(data);
      console.log(obj);    
      if(obj.status == "ok"){
        for(var i =0 ; i< obj.points.length;i++){
          placeMarkerAndPanTo(obj.points[i].Latitude, obj.points[i].Longitude,categorieId);
        }
      } else if(obj.status == "error"){
        home.dialog.alert(obj.Message,"Error");
      }
    });
  }, function(){
    home.preloader.hide();
    home.dialog.alert("Connection Failed", "Error");
    //failed
  });
}//complete

var onClickMyOccuencesItem = function(occursId) {
  $$('#occursItem').html("");
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    var url = severUrl + "/GetOccour?Occour_Id="+ occursId +"&User_Id=" + User_Id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      window.localStorage.occursItem = window.localStorage.occursItem + data + "&&&";
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        if(obj.responses.length == 0){
          home.dialog.alert("No occurrencesItem", "Error");  
        } else {
          for(var i =0 ; i < obj.responses.length;i++){
            var itemHTML = '<div class="block-title">' + obj.responses[i].date +'</div>' + 
                  '<div class="block block-strong">' + obj.responses[i].message + 
                  '</div>' +
                  '<div class="block block-footer">' + obj.responses[i].hour + '</div>'
            $$('#occursItem').append(itemHTML);   
          }
        }
      } else if(obj.status == "error"){
        home.dialog.alert(obj.Message , "Error");
      }
    });  
  }, function(){
      home.preloader.hide();
      var occuencesArr = window.localStorage.occursItem.split("&&&");
      for(var k =0 ; k < occuencesArr.length -1;k++){
        var obj = JSON.parse(occuencesArr[k]);
        if(obj.status == "ok")
        {
          if(obj.responses.length == 0){
            home.dialog.alert("No occurrencesItem", "Error");  
          } else {
            for(var i =0 ; i < obj.responses.length;i++){
              var itemHTML = '<div class="block-title">' + obj.responses[i].date +'</div>' + 
                    '<div class="block block-strong">' + obj.responses[i].message + 
                    '</div>' +
                    '<div class="block block-footer">' + obj.responses[i].hour + '</div>'
              $$('#occursItem').append(itemHTML);   
            }
          }
        } else if(obj.status == "error"){
          home.dialog.alert(obj.Message , "Error");
        }
      }
  });
}//complete
function onSetting(){
  $$('#aboutId').html("");
  
  home.preloader.show();
  checkinternet(function(){
    window.localStorage.aboutInfo = ""; 
    
    home.preloader.hide();
    var url = severUrl + "/aboutPage?User_Id=" + User_Id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      window.localStorage.aboutInfo += data;
      //var addressArr = obj.address.split(',');
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        var itemHTML = '<div class="row">'+
        '<img src="'+ obj.image +'" style="margin: auto;">'+
        '</div>'+
        '<div class="row">'+
        '<div class="list col-md-1">'+
        '</div>'+
        '<div class="list col-md-3">'+
          '<ul>'+
            '<li class = "item-content item-input">'+
              '<span>'+ obj.address +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
                '<span>'+ obj.phone +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
              // '<span style="text-align: center;">+192-2356-452</span>'+
            '</li>'+
          '</ul>'+
        '</div>'+
        '<div class="col-md-7">'+
          '<a href="#" class="col button button-fill button-round popup-open" data-popup = ".popup-map" onclick = "about_mapBtn()" style="margin-top: 84px;">Map</a>'+
        '</div>'+
        '<div class="col-md-1">'+
        '</div>'+
      '</div>'+
      '<br>'+
      '<br>'+
      '<div class="row">'+
        '<a href="tel:'+ obj.phone +'" class="external col button button-fill button-round" onclick="about_callBtn()" style="background-color: green;width: 200px;margin: auto;">Call Shop'+
        '</a>'+
        '</div>';

        $$('#aboutId').append(itemHTML);
      } else {
        home.dialog.alert("Information is not Exist","Error"); 
      }
    });
  },function(){
    home.preloader.hide();
    if(window.localStorage.aboutInfo == "")
      return;
    var obj = JSON.parse(window.localStorage.aboutInfo);
    if(obj.status == "ok"){
        var itemHTML = '<div class="row">'+
        '<img src="'+ obj.image +'" style="margin: auto;">'+
        '</div>'+
        '<div class="row">'+
        '<div class="list col-md-1">'+
        '</div>'+
        '<div class="list col-md-3">'+
          '<ul>'+
            '<li class = "item-content item-input">'+
              '<span>'+ obj.address +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
                '<span>'+ obj.phone +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
              // '<span style="text-align: center;">+192-2356-452</span>'+
            '</li>'+
          '</ul>'+
        '</div>'+
        '<div class="col-md-7">'+
          '<a href="#" class="col button button-fill button-round popup-open" popup-open =".popup-map" onclick = "about_mapBtn()" style="margin-top: 84px;">Map</a>'+
        '</div>'+
        '<div class="col-md-1">'+
        '</div>'+
      '</div>'+
      '<br>'+
      '<br>'+
      '<div class="row">'+
        '<a href="tel:'+ obj.phone +'" class="external col button button-fill button-round" onclick="about_callBtn()" style="background-color: green;width: 200px;margin: auto;">Call Shop'+
        '</a>'+
        '</div>';

        $$('#aboutId').append(itemHTML);
      } else {
        home.dialog.alert("Information is not Exist","Error");    
      }
    //home.dialog.alert("Connection Failed","Error");
  })
}
function initAboutInformation(){
  $$('#aboutId').html("");
  
  home.preloader.show();
  checkinternet(function(){
    window.localStorage.aboutInfo = ""; 
    
    home.preloader.hide();
    var url = severUrl + "/aboutPage?User_Id=" + User_Id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      window.localStorage.aboutInfo = data;
      //var addressArr = obj.address.split(',');
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        var itemHTML = '<div class="row">'+
        '<img src="'+ obj.image +'" style="margin: auto;">'+
        '</div>'+
        '<div class="row">'+
        '<div class="list col-md-1">'+
        '</div>'+
        '<div class="list col-md-3">'+
          '<ul>'+
            '<li class = "item-content item-input">'+
              '<span>'+ obj.address +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
                '<span>'+ obj.phone +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
              // '<span style="text-align: center;">+192-2356-452</span>'+
            '</li>'+
          '</ul>'+
        '</div>'+
        '<div class="col-md-7">'+
          '<a href="#" class="col button button-fill button-round popup-open" data-popup =".popup-map" onclick = "about_mapBtn()" style="margin-top: 84px;">Map</a>'+
        '</div>'+
        '<div class="col-md-1">'+
        '</div>'+
      '</div>'+
      '<br>'+
      '<br>'+
      '<div class="row">'+
        '<a href="tel:'+ obj.phone +'" class="external col button button-fill button-round" onclick="about_callBtn()" style="background-color: green;width: 200px;margin: auto;">Call Shop'+
        '</a>'+
        '</div>';

        $$('#aboutId').append(itemHTML);
      } else {
        home.dialog.alert("Information is not Exist","Error"); 
      }
    });
  },function(){
    home.preloader.hide();
    if(window.localStorage.aboutInfo == "")
      return;
    var obj = JSON.parse(window.localStorage.aboutInfo);
    if(obj.status == "ok"){
        var itemHTML = '<div class="row">'+
        '<img src="'+ obj.image +'" style="margin: auto;">'+
        '</div>'+
        '<div class="row">'+
        '<div class="list col-md-1">'+
        '</div>'+
        '<div class="list col-md-3">'+
          '<ul>'+
            '<li class = "item-content item-input">'+
              '<span>'+ obj.address +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
                '<span>'+ obj.phone +'</span>'+
            '</li>'+
            '<li class = "item-content item-input">'+
              // '<span style="text-align: center;">+192-2356-452</span>'+
            '</li>'+
          '</ul>'+
        '</div>'+
        '<div class="col-md-7">'+
          '<a href="#" class="col button button-fill button-round popup-open" data-popup =".popup-map" onclick = "about_mapBtn()" style="margin-top: 84px;">Map</a>'+
        '</div>'+
        '<div class="col-md-1">'+
        '</div>'+
      '</div>'+
      '<br>'+
      '<br>'+
      '<div class="row">'+
        '<a href="tel:'+ obj.phone +'" class="external col button button-fill button-round" onclick="about_callBtn()" style="background-color: green;width: 200px;margin: auto;">Call Shop'+
        '</a>'+
        '</div>';

        $$('#aboutId').append(itemHTML);
      } else {
        home.dialog.alert("Information is not Exist","Error");    
      }
    //home.dialog.alert("Connection Failed","Error");
  })
}//complete
function about_mapBtn(){
  $$('#addressText').html("");
  home.preloader.show();
    checkinternet(function(){
      home.preloader.hide();  
      settingUIInitMap(); 
      if(window.localStorage.aboutInfo == "")
        return;
      var obj = JSON.parse(window.localStorage.aboutInfo); 
      var latitude = obj.latitude;
      var longitude = obj.longitude;
      var latLag = new google.maps.LatLng(latitude,longitude);

      var marker = new google.maps.Marker({
        position: latLag,
        map: settingMap
      });
      markers.push(marker);
      settingMap.panTo(latLag);

      var itemHTML = '<span>' + obj.address + '</span>';
      $$('#addressText').append(itemHTML); 
    },function(){
      home.preloader.hide();
      home.dialog.alert("Connection Failed" , "Error");
  });
}
function about_callBtn(){
  console.log(2);
}
function initSendOccurrences(){
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    window.localStorage.occurrencesList = "";
    var url = severUrl + "/GetListTypeOccours?User_Id=" + User_Id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      window.localStorage.occurrencesList += data;
      var obj = JSON.parse(data);
      if(obj.status == "ok"){ 
        for(var i =0 ; i < obj.TypeOccoursList.length;i++){
          typeOccourList.push(obj.TypeOccoursList[i]);
          var innerHtml = '<option value = "' + obj.TypeOccoursList[i].type_occour_id + '">' + 
                           obj.TypeOccoursList[i].type_occour_nome + '</option>';
          $$('#type_select').append(innerHtml);
        }
      } else if(obj.status == "error"){
        home.dialog.alert(obj.Message, "error");
      }
    });
  }, function(){
    home.preloader.hide();
    var obj = JSON.parse(window.localStorage.occurrencesList);
    if(obj.status == "ok"){ 
        for(var i =0 ; i < obj.TypeOccoursList.length;i++){
          typeOccourList.push(obj.TypeOccoursList[i]);
          var innerHtml = '<option value = "' + obj.TypeOccoursList[i].type_occour_id + '">' + 
                           obj.TypeOccoursList[i].type_occour_nome + '</option>';
          $$('#type_select').append(innerHtml);
        }
      } else if(obj.status == "error"){
        home.dialog.alert(obj.Message, "error");
      }
  });
}//complete
var onClickOcuurenceSend = function(){ //mangus
  var id = User_Id;
  var description = $$('#description').val();
  var youraddress = $$('#address_city').val();
  var occurs_type = $$('#type_select').val();
  console.log(occurrences_location);
  var url = severUrl + "/UploadOccour?User_Id=" + User_Id + "&Address=" + "av.Masul123" + "&Message=" + description + "&Latitude=" + occurrences_location.lat + "&Longitude=" + occurrences_location.lng + "&Type_Occur_Id=" + occurs_type;
  home.preloader.show();
  $("#uploadform").ajaxSubmit({
     url: url,
     type: "Post",
     success: function (data) {
        home.preloader.hide();
        console.log(data);
        var obj = JSON.parse(data);
        if(obj.status == "ok"){
          showSuccessOcuurenceItem(obj);
        } else if(obj.status == "error"){
          if(obj.status_type == "1"){
            showFailedOcuurenceItem(obj)
            //home.dialog.alert(obj.Message,"Error");
          }
          else if(obj.status_type == "2"){
            showFailedOcuurenceItem(obj)
            //home.dialog.alert(obj.Message,"Error");
          }
        }
     }
  });
}
function showSuccessOcuurenceItem(obj){
  $$('#successID').html("");
  var itemHTML = '<div class = row>' +
          '<h2>' + "Awesome" + '</h2>' + 
          '<h3>' + obj.protocol + '</h3>' + 
          '</div>';
  $$('#successID').append(itemHTML);
}
function showFailedOcuurenceItem(obj){
  $$('#successID').html("");
  var itemHTML = '<div class = row>' +
          '<h2>' + "Sorry, Retry Send." + '</h2>' + 
          '<h3>' + obj.Message + '</h3>' + 
          '</div>';
  $$('#successID').append(itemHTML);
}
function showAllOccurs(obj){
  for(var i = 0; i < obj.count ;i++){
    var itemHTML =
    '<li onclick = "onClickMyOccuencesItem(' + obj.occurrences[i].occours_id + ')" class="item-content" id = "' + obj.occurrences[i].occours_id + '">' + 
      '<a href="#" class="item-link item-content popup-open" data-popup = ".popup-occurs">'+
        '<div class="item-media"><img src="' + obj.occurrences[i].image + '" width="100"/></div>' +
        '<div class="item-inner">' +
          '<div class="item-title-row">' +
            '<div class="item-title">' + obj.occurrences[i].address + '</div>' +
            '<div class="item-after">' + obj.occurrences[i].date+ '</div>' +
          '</div>' +
          '<div class="item-subtitle">'+ obj.occurrences[i].hour +'</div>' +
          '<div class="item-title">' + obj.occurrences[i].message +'</div>' +
          '<div class = "row">' +  
            '<div class="item-title">' + "latitude:" +obj.occurrences[i].latitude + '</div>' + 
            '<div class="item-title">' + "longitude:"+obj.occurrences[i].longitude + '</div>' + 
          '</div>' + 
          '<div class ="item-text">' + obj.occurrences[i].status + '</div>' + 
        '</div>' +
      '</a>' + 
    '</li>';
    $$('#occurence_uls').append(itemHTML);
    itemHTML = "";
  }
}
var onClickOccursShow = function(){
  $$('#occurence_uls').html("");
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    window.localStorage.occurrencesList = "";
    var url = severUrl + "/GetMyOccours?User_Id=" + User_Id;
    home.preloader.show();
    home.request.get(url,function(data){
      home.preloader.hide();
      window.localStorage.occurrencesList += data;
      var obj = JSON.parse(data);
      if(obj.status == "ok"){
        if(obj.count > 0) {
          //success
          showAllOccurs(obj);
        } else {
          home.dialog.alert("You have not occurrences","Alert");
        }
      } else if(obj.status == "error"){
        if(obj.status_type == "1"){
         home.dialog.alert(obj.Message,"Error"); 
        }
      }
    });
  } , function(){
    home.preloader.hide();
    var occursArr = JSON.parse(window.localStorage.occurrencesList);
    if(obj.status == "ok"){
      if(obj.count > 0) {
        //success
        showAllOccurs(obj);
      } else {
        home.dialog.alert("You have not occurrences","Alert");
      }
    } else if(obj.status == "error"){
      if(obj.status_type == "1"){
       home.dialog.alert(obj.Message,"Error"); 
      }
    }
  });
}//complete
function checkinternet(success,failed)
{
  $.ajax({
    url: 'http://www.baidu.com',
    success: function(data) {
      success();
    },
    error: function(data) {
      failed();
    }
  });
}

$$('#homeBtn').on('click',function(){
  showAndHidden = false;
  var str = occurrencesView.el.className;
  var strArr =str.split(" ");
  for(var i =0 ; i< strArr.length;i++){
    if(strArr[i] == "tab-active"){
      strArr[i]= "";
    }
  }

  var str = contactView.el.className;
  var strArr =str.split(" ");
  for(var i =0 ; i< strArr.length;i++){
    if(strArr[i] == "tab-active"){
      strArr[i]= "";
    }
  }

  var str = aboutView.el.className;
  var strArr =str.split(" ");
  for(var i =0 ; i< strArr.length;i++){
    if(strArr[i] == "tab-active"){
      strArr[i]= "";
    }
  }
  googleView.el.className = "page-next";
});//complete
$$('#mapBtn').on('click',function(){
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    showAndHidden = !showAndHidden;
      if(showAndHidden){
        showGoogleMap();
        initMap();
        initGoogleMapView();
      }
      else
        hideGoogleMap();
  }, function(){
    home.preloader.hide();
    //failed
    home.dialog.alert("Connection Failed");
  });
});//complete
$$('#occurrencesBtn').on('click',function(){
  
  AddressGoogleMap();

  initSendOccurrences();
  showAndHidden = false;
  var str = homeView.el.className;
  var strArr =str.split(" ");
  for(var i =0 ; i< strArr.length;i++){
    if(strArr[i] == "tab-active"){
      strArr[i]= "";
    }
  }

  var str = contactView.el.className;
  var strArr =str.split(" ");
  for(var i =0 ; i< strArr.length;i++){
    if(strArr[i] == "tab-active"){
      strArr[i]= "";
    }
  }

  var str = aboutView.el.className;
  var strArr =str.split(" ");
  for(var i =0 ; i< strArr.length;i++){
    if(strArr[i] == "tab-active"){
      strArr[i]= "";
    }
  }

  googleView.el.className = "page-next";
});//complete
$$('#contactBtn').on('click',function(){
  //$('#Contact_profile').attr('src', window.localStorage.image);
  showAndHidden = false;
  var str = occurrencesView.el.className;
    var strArr =str.split(" ");
    for(var i =0 ; i< strArr.length;i++){
      if(strArr[i] == "tab-active"){
        strArr[i]= "";
      }
    }

    var str = homeView.el.className;
    var strArr =str.split(" ");
    for(var i =0 ; i< strArr.length;i++){
      if(strArr[i] == "tab-active"){
        strArr[i]= "";
      }
    }

    var str = aboutView.el.className;
    var strArr =str.split(" ");
    for(var i =0 ; i< strArr.length;i++){
      if(strArr[i] == "tab-active"){
        strArr[i]= "";
      }
    }

  googleView.el.className = "page-next";
});//complete
$$('#aboutBtn').on('click',function(){
  initAboutInformation();
  showAndHidden = false;
  var str = occurrencesView.el.className;
    var strArr =str.split(" ");
    for(var i =0 ; i< strArr.length;i++){
      if(strArr[i] != "tab-active"){
        strArr[i]= "";
      }
    }

    var str = homeView.el.className;
    var strArr =str.split(" ");
    for(var i =0 ; i< strArr.length;i++){
      if(strArr[i] != "tab-active"){
        strArr[i]= "";
      }
    }

    var str = contactView.el.className;
    var strArr =str.split(" ");
    for(var i =0 ; i< strArr.length;i++){
      if(strArr[i] != "tab-active"){
        strArr[i]= "";
      }
    }

  googleView.el.className = "page-next";
});//complete
$$('#sendBtn').on('click',function(){
});
$$('#profile_send').on('click',function(){
  var firstname = $$('#profile_firstname').val();
  var lastname = $$('#profile_lastname').val();
  var email = $$('#profile_email').val();
  var password = $$('#profile_password').val();
  var phoneNumber = $$('#profile_phoneNumber').val();
  var user_id = User_Id;
  sendProfileInfo(firstname,lastname,email,password,phoneNumber,user_id);
})
function checkStatusCondition(obj){
  if(obj.status == "ok")
    return true;
  else if(obj.status == "error")
    return false;
}

$$('.infinite-scroll-content').on('infinite', function () {
  if (!allowInfinite) return;
  allowInfinite = false;
  //made by mangus
  setTimeout(function () {
    allowInfinite = true;
    home.preloader.show();
    checkinternet(function(){
      home.preloader.hide();
        page_count ++;
        var url = pageUrl + page_count;
        home.request.get(url,function(data){
          var obj = JSON.parse(data);
          if(checkStatusCondition(obj)){
            newsArr.push(obj);
            var pageHTML = "";
            if(newsArr[page_count].NewsList.length > 1 && newsArr[page_count].NewsList){
              for(var i = 0 ; i < newsArr[page_count].NewsList.length;i++){
                var itemHTML =
                    '<li onclick = "onClickNewsItem(' + newsArr[page_count].NewsList[i].news_id + ')" class="item-content" id = "' + newsArr[page_count].NewsList[i].news_id + '">' + 
                      '<a href="#'+ newsArr[page_count].NewsList[i].news_id +'/" class="item-link item-content popup-open" data-popup = ".popup-newspage">'+
                        '<div class="item-media"><img src="' + newsArr[page_count].NewsList[i].news_image + '" width="100"/></div>' +
                        '<div class="item-inner">' +
                          '<div class="item-title-row">' +
                            '<div class="item-title">' + newsArr[page_count].NewsList[i].news_title + '</div>' +
                          '</div>' +
                          '<div class="item-text">' + newsArr[page_count].NewsList[i].news_short_description + '</div>' +
                        '</div>' +
                      '</a>' + 
                    '</li>';
                $$('#uls').append(itemHTML);
                  itemHTML = "";
              } 
            }
            home.ptr.done();
        }
      });
    } , function(){
      home.preloader.hide();
      home.dialog.alert("Connection Failed" , "Error");
        //failed
    });
  }, 1000);
});//complete


//home.html
var homeView = home.views.create('#view-home', {
  url: '/home/'
});
var occurrencesView = home.views.create('#view-occurrences', {
  url: '/occurrences/'
});
var aboutView = home.views.create('#view-about', {
  url: '/about/'
});
var contactView = home.views.create('#view-contact', {
  url: '/contact/'
});
var googleView = home.views.create('#view-google', {
  url: '/googleMap/'
});


function showGoogleMap(){

  for(var idx = 0 ; idx < home.views.length;idx++){
    var str = home.views[idx].el.className;
    var strArr =str.split(" ");
    for(var i =0 ; i< strArr.length;i++){
      if(strArr[i] == "tab-active"){
        index = idx;
        break;
      }
    }
    if (index != -1)
      break;
  }

  var str = home.views[index].el.className;
  var strArr =str.split(" ");
  for(var i =0 ; i< strArr.length;i++){
    if(strArr[i] == "tab-active"){
      strArr[i]= "";
    }
  }
  var tagname = "";
  for(var i =0 ; i< strArr.length;i++){
    if(i == strArr.length-1){
      tagname += strArr[i]
    }
    else
      tagname += strArr[i] + " ";
  }
  home.views[index].el.className = tagname;
  googleView.el.className = "page-content";
}
function hideGoogleMap(){
  var str = home.views[index].el.className;
  str += " " +"tab-active";
  home.views[index].el.className = str;

  googleView.el.className = "page-next";
  index = -1;
}

function settingUIInitMap(){
  settingMap = new google.maps.Map(document.getElementById('map_settingUI'), {
    zoom: 8,
    center: {lat: -34.397, lng: 150.644},
  });
  
}
function initMap() {
  home.preloader.show();
    checkinternet(function(){
      home.preloader.hide();
        mapss = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: {lat: -34.397, lng: 150.644},
      });
    },function(){
      home.preloader.hide();
      home.dialog.alert("Connection Failed" , "Error");
  });
}//complete
function deleteMarkers() {
  setMapOnAll(null);
  markers = [];
}
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function placeMarkerAndPanTo(lat,Lng,id) {
  var icoImage = "";
  for(var i = 0 ; i < marker_icons.length;i++){
    if(marker_icons[i].id == id){
      icoImage = marker_icons[i].icon;
      break;
    }
  }
  var latLag = new google.maps.LatLng(lat,Lng);
  var marker = new google.maps.Marker({
    position: latLag,
    icon: icoImage,
    map: mapss
  });
  markers.push(marker);
  mapss.panTo(latLag);
}

function setPointByAddress(location){
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
  map.panTo(location); 
}
window.localStorage.image ="";
$(function () {
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
  });

  function imageIsLoaded(e) {
    window.localStorage.image = e.target.result;
    $('#myImg').attr('src', e.target.result);
    $('#yourImage').attr('src', e.target.result);
  };

function AddressGoogleMap(){
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    map = new google.maps.Map(document.getElementById('map_address'), {
    zoom: 8,
    center: {lat: -34.397, lng: 150.644},
    });
    var geocoder = new google.maps.Geocoder();

    $$('#searchBtn').on('click',function(){
      geocodeAddress(geocoder, map);

    })
  }, function(){
    home.preloader.hide();
    home.dialog.alert("Connection Failed" ,"Error");
  });
}

function geocodeAddress(geocoder, resultsMap) {
  var city_Address = $$('#address_city').val();
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=["+ city_Address + "]&sensor = true";
  home.request.get(url,function(data){
    var obj = JSON.parse(data);
    if(obj.status == "OK"){
      var location = obj.results[0].geometry.location;
      occurrences_location = obj.results[0].geometry.location;
      setPointByAddress(location);
      
      $('#latitude').val(occurrences_location.lat);
      $('#longitude').val(occurrences_location.lng);

    } else {
        alert('Geocode was not successful for the following reason: ');
    }
  });
}
var checkedInternetFlag = false;
window.onload = function() {
  $('#Contact_profile').attr('src', window.localStorage.image);
  home.preloader.show();
  checkinternet(function(){
    home.preloader.hide();
    checkedInternetFlag = true;
  }, function(){
    home.preloader.hide();
    checkedInternetFlag = false;
    home.dialog.alert("Connection Failed" ,"Error");
  });
}