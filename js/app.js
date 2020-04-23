$(document).ready(function(){



  $.ajaxSetup({
    cache: false
  });

  checkSession();

  /*
  * Mobile Table Slides
  * */
  $('.table-sm--nav .nav-right').on('click', function(){
    $('.table-sm .tickers').slick('slickNext');
  })
  $('.table-sm--nav .nav-left').on('click', function(){
    $('.table-sm .tickers').slick('slickPrev');
  })
  $('.table-sm .tickers').on('beforeChange', function(event, slick, currentSlide, nextSlide){
   var s = $('.tickers').slick('getSlick')['slideCount'];
   var sts = $('.tickers').slick('getSlick')['options']['slidesToShow'];

   if (nextSlide == 0) {
    $('.table-sm .nav-left').addClass('disabled');
    }else{
      $('.table-sm .nav-left').removeClass('disabled');
    }
    if(nextSlide == s-sts){
      $('.table-sm .nav-right').addClass('disabled');
    }else{
      $('.table-sm .nav-right').removeClass('disabled');
    }
  });

    /*
    *  Show password input
    * */
    $('.js-show-password').on('click', function(e){
     e.stopPropagation();
     if ($(this).hasClass('showing-password')) {
      $(this).removeClass('showing-password');
      $(this).parent().find('input[type="text"]').attr('type', 'password');
    }else{
      $(this).addClass('showing-password');
      $(this).parent().find('input[type="password"]').attr('type', 'text');
    }
  })

    $('body').click(function(e){
      $('.showing-password').parent().find('input[type="text"]').attr('type', 'password');
      $('.showing-password').removeClass('showing-password');
    });

    /*
    * Mobile Table
    * */
    if ($(window).width() <= 800) {
      $('body').addClass('table-break');
    }
    $(window).on('resize', function(){
      if ($(this).width() <= 800) {
        $('body').addClass('table-break');
      }else{
        $('body').removeClass('table-break');
      }
    });

    $('.table-xs').basictable({
     breakpoint: 350,
   });


    /*
    *  Create User
    * */
    $("#RegisterForm").on("submit", function(){

      if($(this).find("input[name='newUser']").val() == '' || $(this).find("input[name='newPass']").val() == '')
      {
        $("#MsgResultR").html('<div class="alert alert-danger"><strong>¡Error!</strong><br /> Por favor completa todos los campos.</div>');
        return false;
      }

      $.ajax({
        url: 'do.php?action=Register',
        type: 'GET',
        data: $(this).serialize(),
        async: true,
        success: function (data) 
        {
          if(data == "OK")
          {
            $("#RegisterForm").find("input").val("");
            $("#MsgResultR").html('<div class="alert alert-success"><strong>¡Perfecto!</strong><br /> El registro se ha realizado correctamente.</div>');
          }
          else
          {
            $("#MsgResultR").html('<div class="alert alert-danger"><strong>¡Error!</strong><br /> No se pudo cambiar realizar el registro, por favor revisa los datos y vuelve a intentarlo.</div>');
          }
        }
      });

      return false;
    });

    $("#CrearCuentaButton").on("click", function(){
      $("#LoginBox").hide();
      $("#RegisterBox").show();
      return false;
    });

    $("#IniciarSesionButton").on("click", function(){
      $("#RegisterBox").hide();
      $("#LoginBox").show();
      return false;
    });

  //Login Form
  $("#LoginForm").on("submit", function(){

    if($(this).find("input[name='email']").val() == '' || $(this).find("input[name='password']").val() == '')
    {
      $("#MsgResult").html('<div class="alert alert-danger"><strong>¡Error!</strong><br /> Por favor completa todos los campos.</div>');
      return false;
    }

    $.ajax({
      url: 'do.php?action=Login',
      data: $(this).serialize(),
      dataType: 'json',
      type: 'GET',
      async: true,
      success: function (data) 
      {
        if(data.hasOwnProperty('userinfo'))   
        {
          if(data.userinfo.hasOwnProperty('error'))
          {
            $("#MsgResult").html('<div class="alert alert-danger"><strong>¡Error!</strong><br /> '+data.userinfo.error["#text"]+'</div>');
          }
          else if(data.userinfo.hasOwnProperty('username'))
          {
            localStorage.setItem('username', data.userinfo.username["#text"]);
            localStorage.setItem('name', data.userinfo.name);
            localStorage.setItem('surname', data.userinfo.surname);
            localStorage.setItem('country', data.userinfo.country["#text"]);
            localStorage.setItem('sessionHashTrade', data.sessionHash);
            localStorage.setItem('time', data.time);

            $("#MsgResult").html('<div class="alert alert-success"><strong>¡Perfecto!</strong><br /> Bienvenido <strong>'+data.userinfo.username["#text"]+'</strong>, te estamos redireccionando. Espera un momento...</div>');

                  //Redirect
                  setTimeout(function(){
                    window.location.href = 'panel-base.html';
                  }, 3000);
                }
                else
                {
                  $("#MsgResult").html('<div class="alert alert-info"><strong>Hubo un problema</strong><br /> No se ha podido iniciar la sesión. Por favor vuelva a intentarlo mas tarde.</div>');
                }
              }       
            },
            error: function (data) {
              $("#MsgResult").html('<div class="alert alert-info"><strong>Hubo un problema</strong><br /> No se ha podido contactar con el servidor. Por favor vuelva a intentarlo mas tarde.</div>');
            }
          });

    return false;

  });

});

//Check session storage support
if (!window.localStorage) 
{
  alert("¡Tu navegador está desactualizado! Debes actualizar a la última versión disponible para poder utilizar esta pagina correctamente.");
}

//Check user login
function checkSession()
{
  if (!(localStorage.getItem("sessionHashTrade") === null)) 
  {
    $.ajax({
      url: 'do.php?action=CheckLogin',
      data: { "username" :  localStorage.getItem("username"), "time" :  localStorage.getItem("time"), "name" : localStorage.getItem("name"), "surname" : localStorage.getItem("surname"), "country" : localStorage.getItem("country"), "sessionHashTrade" : localStorage.getItem("sessionHashTrade")},
      dataType: 'json',
      type: 'GET',
      async: true,
      success: function (data) 
      {
        if(!data)
        {
          localStorage.setItem('username', null);
          localStorage.setItem('name', null);
          localStorage.setItem('surname', null);
          localStorage.setItem('country', null);
          localStorage.setItem('sessionHashTrade', null);
          localStorage.setItem('time', null);

          if(!(window.location.href.indexOf("index.html") > -1)) 
          {
            window.location.href = "index.html";
          }
        }
        else
        {
          $(".panel-hidder").show();
          
          if( (window.location.href.indexOf("index.html") > -1) || !(window.location.href.indexOf(".html") > -1) ) 
          {
            window.location.href = "panel-base.html";
          }
        }
      }
    });
  }
  else
  {
    if(!(window.location.href.indexOf("index.html") > -1) && (window.location.href.indexOf(".html") > -1)) 
    {
      window.location.href = "index.html";
    }
  }




}
