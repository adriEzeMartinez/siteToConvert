$(document).ready(function(){
    
    //Load Home panel
    loadMyPanel();
    //Load Types
    getTickers("Merval");
    getTickers("BatFinex");
    getTickers("Nasdaq");
    getTickers("DowJones");
    //Indicadores
    loadIndicadores();
    //CoinDashboard
    loadMarketCoinDashboard();

    /*
    * End Session
    * */
    $("#EndSession").on("click", function()
    {
        localStorage.setItem('username', null);
        localStorage.setItem('name', null);
        localStorage.setItem('surname', null);
        localStorage.setItem('country', null);
        localStorage.setItem('sessionHashTrade', null);
        localStorage.setItem('time', null);

        window.location.href = "index.html";

        return false;
    });

    /*
    * Ajustes section link
    * */
    $("#AjustesLink").on("click", function(){
        $(".panel_main").hide();
        $("#AjustesSection").show();
        $('.panel_aside').removeClass('active');
        $('.panel_aside__open').removeClass('active');
        $('.panel_aside__over').removeClass('active');
        $('.collapse').collapse('hide')
        // $('.item_label').find('input').val('');
        // $(".item_label").appendTo('.especie_indicadores_container')
        $("#MiPanelSection .custom-input").val('');
        /* Reorder */
        // $('.especie_indicadores_container .item_label').sort(function(a,b) {
           // return $(a).find('input').data('indicator-id') > $(b).find('input').data('indicator-id');
       // }).appendTo('.especie_indicadores_container');
       return false;
   });

    /*
    * Panel Robot
    * */
    $("#PanelRobot").on("click", function(){
        $("#AjustesSection input").val('');
        $("#AjustesSection").hide();
        $("#MsgResult").html('');
        $("#MiPanelSection").show();
        $('.panel_aside').removeClass('active');
        $('.panel_aside__open').removeClass('active');
        $('.panel_aside__over').removeClass('active');
        loadIndicadores();
        loadMyPanel();
        $('#especie_collapse').collapse('hide');
    });
    
     /*
    * Panel Coin Dashboard
    * */
    $("#PanelCoinDashboard").on("click", function(){
        $("#AjustesSection input").val('');
        $("#AjustesSection").hide();
        $("#MsgResult").html('');
        $("#MiPanelSection").show();
        $('.panel_aside').removeClass('active');
        $('.panel_aside__open').removeClass('active');
        $('.panel_aside__over').removeClass('active');
        loadIndicadores();
        //loadMyPanel();
        loadMarketCoinDashboard();
        $('#especie_collapse').collapse('hide');
    });
    
     /*
    * Panel Portfolio
    * */
    $("#PanelPortfolio").on("click", function(){
        $("#AjustesSection input").val('');
        $("#AjustesSection").hide();
        $("#MsgResult").html('');
        $("#MiPanelSection").show();
        $('.panel_aside').removeClass('active');
        $('.panel_aside__open').removeClass('active');
        $('.panel_aside__over').removeClass('active');
        loadIndicadores();
        loadMyPanel();
        $('#especie_collapse').collapse('hide');
    });

    /*
    * Notifications
    * */
    $("#PanelNotificaciones").on("click", function()
    {
        $("#NotifModal").modal("show");
        loadNotifs();
        return false;
    });

    /*
    * Input Number
    * */
   $(document).on("keypress keyup blur", ".custom-input--number", function(event){
    // $(".custom-input--number").on("keypress keyup blur",function (event) {    
       // $(this).val($(this).val().replace(/[^\d].+/, ""));
       // if ((event.which < 48 || event.which > 57)) {
       //     event.preventDefault();
       // }
       $(this).val($(this).val().replace(/[^0-9\.]/g,''));
       if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
           event.preventDefault();
       }
   });


    /*
    * Add Ticker
    * */
    $("body").on("click", ".especies-container span", function()
    {
        var daItem = $(this);

        $.ajax({
            url: 'do.php?action=AddTicker&type='+$(this).text(),
            dataType: 'json',
            type: 'GET',
            async: true,
            success: function (data) 
            {
                if(data == "OK")
                {
                    $(daItem).remove();
                    loadMyPanel();
                }
                else
                {
                    alert("No se pudo agregar el elemento. Vuelva a intentarlo mas tarde.");
                }
            }
        });

        return false;
    });

    /*
    * DO simulation
    * */
    $("body").on("click", "#SimularButton", function()
    {
        //especie_single__table
        var pass = true;
        $("#AlertEspecies").html('');

        $.each($(".especie_single__table input"), function(i,item)
        {
            if($.trim($(item).val()) == "")
            {
                pass = false;
            }
        });
        
        if(!pass)
        {
            $("#AlertEspecies").html('<div class="alert alert-danger"><strong>¡Error!</strong><br /> Debes completar los valores de los indicadores para simular.</div>');
            setTimeout(function(){ $("#AlertEspecies").html(''); }, 6000);
        }
        else
        {
            generateGraph();
        }

        return false;
    });

    /*
    *  Change Password
    * */
    $("#FormCambiarPass").on("submit", function(){

        if($(this).find("input[name='oldPass']").val() == '' || $(this).find("input[name='newPass']").val() == '')
        {
            $("#MsgResult").html('<div class="alert alert-danger"><strong>¡Error!</strong><br /> Por favor completa todos los campos.</div>');
            return false;
        }

        $.ajax({
            url: 'do.php?action=ChangePass',
            type: 'GET',
            data: $(this).serialize(),
            async: true,
            success: function (data) 
            {
                if(data == "OK")
                {
                    $("#FormCambiarPass").find("input").val("");
                    $("#MsgResult").html('<div class="alert alert-success"><strong>Contraseña actualizada</strong><br /> La contraseña se ha cambiado correctamente.</div>');
                }
                else
                {
                    $("#MsgResult").html('<div class="alert alert-danger"><strong>Error</strong><br /> No se pudo cambiar la contraseña, por favor revisa los datos y vuelve a intentarlo.</div>');
                }
            }
        });

        return false;
    });


    function scrollToTop(scrollDuration) {
      const scrollHeight = window.scrollY,
      scrollStep = Math.PI / ( scrollDuration / 15 ),
      cosParameter = scrollHeight / 2;
      var scrollCount = 0,
      scrollMargin,
      scrollInterval = setInterval( function() {
        if ( window.scrollY != 0 ) {
          scrollCount = scrollCount + 1;  
          scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
          window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
      } 
      else clearInterval(scrollInterval); 
  }, 15 );
  }
  $("body").on('click', '.js-btn-ajustes', function(){

        // If Mobile Scroll Top
        if ( $(window).width() <= 992 ) {
          scrollToTop(800);
        }

        //Hide active panels
        $('#especie_collapse').collapse('hide');

        //Load Data
        var tick_element = $(this).parent().parent();
        if ($(this).hasClass('js-btn-ajustes-mobile')) {
            tick_element = tick_element.parent();
        }
        $("#especie_collapse").find(".especie_single__title").html($(tick_element).attr("data-title"));
        $("input[name='TickerId']").val($(this).parent().parent().attr("data-id"));

        $("input[name='SaldoInicial']").val($(this).parent().parent().attr("data-inicial"));
        $("input[name='Compras']").val($(this).parent().parent().attr("data-compras"));
        $("input[name='Ventas']").val($(this).parent().parent().attr("data-ventas"));
        $("input[name='Tenencias']").val($(this).parent().parent().attr("data-tenencias"));
        $("input[name='SaldoFinal']").val($(this).parent().parent().attr("data-final"));
        $("input[name='Ganancia']").val($(this).parent().parent().attr("data-ganancia"));
        $("input[name='Comision']").val($(this).parent().parent().attr("data-comision"));


        //Show panels
        setTimeout(function(){ $('#especie_collapse').collapse('show'); }, 500);

        //Generate Graph
        generateGraph();

        return false;
    });

  $('body').on('click', '.panel_box__close', function(){
    $('#especie_collapse').collapse('hide');
    return false;
});

  $('.panel_aside__open').on('click', function(){
    $('.panel_aside__over').toggleClass('active');
    $('.panel_aside').toggleClass('active');
    $(this).toggleClass('active');
    return false;
});
  $('.panel_aside__over').on('click', function(){
    $('.panel_aside__open').removeClass('active');
    $('.panel_aside').removeClass('active');
    $(this).removeClass('active');
    return false;
});
    //Update && save ticker values
    $("body").on("change", "#SimuladorForm input", function(){
        var update = $(this).attr("data-save");
        $("#HomeTableData table").find("tr[data-id='"+$("input[name='TickerId']").val()+"']").attr($(this).attr("data-save"), $(this).val());
        return false;
    });
    
});

/*
* Get Tickers for sidebar
* */
function getTickers(type)
{
    $.ajax({
        url: 'do.php?action=GetTickers&type='+type,
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (data) 
        {
            if(data.hasOwnProperty('element') && data.element.hasOwnProperty('item') && data.element.item.length > 0)
            {
                $.each(data.element.item, function( i, item ) 
                {
                    $("#Type"+type).append('<span data-ticker-id="'+item.name["-id"]+'">'+item.name["#text"]+'</span>');
                });
            }
        }
    });

    return false;
}

 /*
 * Cargar Panel
 * */
function loadMyPanel()
{
    $.ajax({
        url: 'do.php?action=GetMiPanel',
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (data) 
        {
            $("#HomeTableData table").html("");
            $("#HomeTableData table-sm").html("");

            //$("#HomeTableData table").html('<thead><tr class="table-header"><th>ESPECIE</th><th class="text-center">P. COMPRA</th><th class="text-center">P. VENTA</th><th class="text-center">STOP LOSS</th><th class="text-center">GANANCIA</th><th class="text-center">TENDENCIA</th><th>ESTADO</th><th></th><th></th></tr></thead><tbody></tbody>');
            $("#HomeTableData table").html('<thead><tr class="table-header"><th>ESPECIE</th><th class="text-center">P. COMPRA</th><th class="text-center">P. VENTA</th><th class="text-center">TENDENCIA</th></th><th></th></tr></thead><tbody></tbody>');
            //$("#HomeTableData .table-sm .tickers-data").html('<ul><li>ESPECIE:</li><li>P. COMPRA</li><li>P. VENTA</li><li>STOP LOSS</li><li>GANANCIA</li><li>TENDENCIA</li><li>ESTADO</li><li></li></ul>');
            $("#HomeTableData .table-sm .tickers-data").html('<ul><li>ESPECIE:</li><li>P. COMPRA</li><li>P. VENTA</li><li>TENDENCIA</li><li></li></ul>');

            if(data.hasOwnProperty('element') && data.element.hasOwnProperty('item') && data.element.item.length > 0)
            {
                $.each(data.element.item, function( i, item ) 
                {
                  //$("#HomeTableData table tbody").append('<tr data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><td data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</td><td class="text-center" data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</td><td class="text-center" data-th="P.VENTA">$ '+item.name["#pventa"]+'</td><td class="text-center" data-th="STOP LOSS">$ '+item.name["#stoploss"]+'</td><td class="text-center" data-th="GANANCIA">'+item.name["#ganancia"]+' %</td><td class="text-center" data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +'</td><td data-th="ESTADO"> '+ ( (item.name["#estado"]== 'Comprar') ? '<span class="icon icon-bullet icon-bullet--green"></span> <span class="green">COMPRAR</span>' : ( (item.name["#estado"]== 'Vender') ? '<span class="icon icon-bullet icon-bullet--red"></span> <span class="red">VENDER</span>' : '<span class="icon icon-bullet"></span> <span class="blue">ESPERAR</span>' )  ) +' </td><td class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes"><span class="icon icon-gear"></span></div></td><td class="col-icon col-borrar"><div class="btn-borrar js-btn-borrar"><span class="icon icon-trash"></span></div></td></tr>');
                  //$("#HomeTableData .table-sm .tickers").append('<div class="item"><ul data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><li data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</li><li data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</li><li data-th="P.VENTA">$ '+item.name["#pventa"]+'</li><li data-th="STOP LOSS">$ '+item.name["#stoploss"]+'</li><li data-th="GANANCIA">'+item.name["#ganancia"]+' %</li><li data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +'</li><li data-th="ESTADO"> '+ ( (item.name["#estado"]== 'Comprar') ? '<span class="icon icon-bullet icon-bullet--green"></span> <span class="green">COMPRAR</span>' : ( (item.name["#estado"]== 'Vender') ? '<span class="icon icon-bullet icon-bullet--red"></span> <span class="red">VENDER</span>' : '<span class="icon icon-bullet"></span> <span class="blue">ESPERAR</span>' )  ) +' </li><li><div class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes js-btn-ajustes-mobile"><span class="icon icon-gear"></span></div></div><div class="col-icon col-borrar"><div class="btn-borrar js-btn-ajustes js-btn-borrar-mobile"><span class="icon icon-trash"></span></div></div></li></ul></div>');
                  $("#HomeTableData table tbody").append('<tr data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><td data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</td><td class="text-center" data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</td><td class="text-center" data-th="P.VENTA">$ '+item.name["#pventa"]+' </td><td class="text-center" data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +' </td><td class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes"><span class="icon icon-gear"></span></div></td><td class="col-icon col-borrar"><div class="btn-borrar js-btn-borrar"><span class="icon icon-trash"></span></div></td></tr>');
                  $("#HomeTableData .table-sm .tickers").append('<div class="item"><ul data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><li data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</li><li data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</li><li data-th="P.VENTA">$ '+item.name["#pventa"]+'</li><li data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +'</li><li data-th="ESTADO"> '+ ( (item.name["#estado"]== 'Comprar') ? '<span class="icon icon-bullet icon-bullet--green"></span> <span class="green">COMPRAR</span>' : ( (item.name["#estado"]== 'Vender') ? '<span class="icon icon-bullet icon-bullet--red"></span> <span class="red">VENDER</span>' : '<span class="icon icon-bullet"></span> <span class="blue">ESPERAR</span>' )  ) +' </li><li><div class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes js-btn-ajustes-mobile"><span class="icon icon-gear"></span></div></div><div class="col-icon col-borrar"><div class="btn-borrar js-btn-ajustes js-btn-borrar-mobile"><span class="icon icon-trash"></span></div></div></li></ul></div>');
              });
            }

            else
            {
                $("#HomeTableData").html('<div class="alert alert-info"><strong>No hay datos</strong><br /> No existe datos para mostrar en tu panel.</div>');
            }
            $(".table-sm .tickers").slick({
                infinite: false,
                slidesToShow: 2,
                arrows: false,
                dots: true,
                appendDots: '.table-sm .table-sm--nav .dots',
                responsive: [
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1
                }
            }
            ]
        });
        }
    });

return false;
}

/*
* Load Market Coin Dashboard
*/
function loadMarketCoinDashboard()
{
    $.ajax({
        url: 'do.php?action=GetMiDashboard',
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (data) 
        {
            $("#HomeTableData table").html("");
            $("#HomeTableData table-sm").html("");

            //$("#HomeTableData table").html('<thead><tr class="table-header"><th>ESPECIE</th><th class="text-center">P. COMPRA</th><th class="text-center">P. VENTA</th><th class="text-center">STOP LOSS</th><th class="text-center">GANANCIA</th><th class="text-center">TENDENCIA</th><th>ESTADO</th><th></th><th></th></tr></thead><tbody></tbody>');
            $("#HomeTableData table").html('<thead><tr class="table-header"><th>ESPECIE</th><th class="text-center">P. COMPRA</th><th class="text-center">P. VENTA</th><th class="text-center">TENDENCIA</th></th><th></th></tr></thead><tbody></tbody>');
            //$("#HomeTableData .table-sm .tickers-data").html('<ul><li>ESPECIE:</li><li>P. COMPRA</li><li>P. VENTA</li><li>STOP LOSS</li><li>GANANCIA</li><li>TENDENCIA</li><li>ESTADO</li><li></li></ul>');
            $("#HomeTableData .table-sm .tickers-data").html('<ul><li>ESPECIE:</li><li>P. COMPRA</li><li>P. VENTA</li><li>TENDENCIA</li><li></li></ul>');

            if(data.hasOwnProperty('element') && data.element.hasOwnProperty('item') && data.element.item.length > 0)
            {
                $.each(data.element.item, function( i, item ) 
                {
                  //$("#HomeTableData table tbody").append('<tr data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><td data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</td><td class="text-center" data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</td><td class="text-center" data-th="P.VENTA">$ '+item.name["#pventa"]+'</td><td class="text-center" data-th="STOP LOSS">$ '+item.name["#stoploss"]+'</td><td class="text-center" data-th="GANANCIA">'+item.name["#ganancia"]+' %</td><td class="text-center" data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +'</td><td data-th="ESTADO"> '+ ( (item.name["#estado"]== 'Comprar') ? '<span class="icon icon-bullet icon-bullet--green"></span> <span class="green">COMPRAR</span>' : ( (item.name["#estado"]== 'Vender') ? '<span class="icon icon-bullet icon-bullet--red"></span> <span class="red">VENDER</span>' : '<span class="icon icon-bullet"></span> <span class="blue">ESPERAR</span>' )  ) +' </td><td class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes"><span class="icon icon-gear"></span></div></td><td class="col-icon col-borrar"><div class="btn-borrar js-btn-borrar"><span class="icon icon-trash"></span></div></td></tr>');
                  //$("#HomeTableData .table-sm .tickers").append('<div class="item"><ul data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><li data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</li><li data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</li><li data-th="P.VENTA">$ '+item.name["#pventa"]+'</li><li data-th="STOP LOSS">$ '+item.name["#stoploss"]+'</li><li data-th="GANANCIA">'+item.name["#ganancia"]+' %</li><li data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +'</li><li data-th="ESTADO"> '+ ( (item.name["#estado"]== 'Comprar') ? '<span class="icon icon-bullet icon-bullet--green"></span> <span class="green">COMPRAR</span>' : ( (item.name["#estado"]== 'Vender') ? '<span class="icon icon-bullet icon-bullet--red"></span> <span class="red">VENDER</span>' : '<span class="icon icon-bullet"></span> <span class="blue">ESPERAR</span>' )  ) +' </li><li><div class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes js-btn-ajustes-mobile"><span class="icon icon-gear"></span></div></div><div class="col-icon col-borrar"><div class="btn-borrar js-btn-ajustes js-btn-borrar-mobile"><span class="icon icon-trash"></span></div></div></li></ul></div>');
                  $("#HomeTableData table tbody").append('<tr data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><td data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</td><td class="text-center" data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</td><td class="text-center" data-th="P.VENTA">$ '+item.name["#pventa"]+' </td><td class="text-center" data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +' </td><td class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes"><span class="icon icon-gear"></span></div></td></tr>');
                  $("#HomeTableData .table-sm .tickers").append('<div class="item"><ul data-id="'+item.name["-id"]+'" data-title="'+item.name["#text"]+'" data-inicial="" data-final="" data-compras="" data-ventas="" data-tenencias="" data-ganancia="" data-comision=""><li data-th="ESPECIE"><span class="flag flag-arg"></span> '+item.name["#text"]+'</li><li data-th="P. COMPRA">$ '+item.name["#pcompra"]+'</li><li data-th="P.VENTA">$ '+item.name["#pventa"]+'</li><li data-th="TENDENCIA">'+ ( (item.name["#tendencia"]== 'Subida') ? '<span class="icon icon-up"></span>' : ( (item.name["#tendencia"]== 'Bajada') ? '<span class="icon icon-down"></span>' : '  -- ' )  ) +'</li><li data-th="ESTADO"> '+ ( (item.name["#estado"]== 'Comprar') ? '<span class="icon icon-bullet icon-bullet--green"></span> <span class="green">COMPRAR</span>' : ( (item.name["#estado"]== 'Vender') ? '<span class="icon icon-bullet icon-bullet--red"></span> <span class="red">VENDER</span>' : '<span class="icon icon-bullet"></span> <span class="blue">ESPERAR</span>' )  ) +' </li><li><div class="col-icon col-ajustes"><div class="btn-ajustes js-btn-ajustes js-btn-ajustes-mobile"><span class="icon icon-gear"></span></div></div></li></ul></div>');
              });
            }

            else
            {
                $("#HomeTableData").html('<div class="alert alert-info"><strong>No hay datos</strong><br /> No existe datos para mostrar en tu panel.</div>');
            }
            $(".table-sm .tickers").slick({
                infinite: false,
                slidesToShow: 2,
                arrows: false,
                dots: true,
                appendDots: '.table-sm .table-sm--nav .dots',
                responsive: [
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1
                }
            }
            ]
        });
        }
    });

return false;
}

/*
* Load notifs list
*/
function loadNotifs()
{
    $.ajax({
        url: 'do.php?action=GetNotif',
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (data) 
        {
            $(".tablemodalnotif tbody").html("");

            if(data.hasOwnProperty('element') && data.element.hasOwnProperty('item') && data.element.item.length > 0)
            {
                $.each(data.element.item, function( i, item ) 
                {
                  $(".tablemodalnotif tbody").append('<tr><td data-th="TICKER"><figure><img src="img/'+( (item.country["#text"] == 'AR') ? 'flag-argentina.svg' : 'flag-usa.svg' )+'" alt="País" width="35px" /></figure><div class="content"><span class="name">'+item.name["#text"]+'</span><small class="text-muted">'+item.date+'</small></div></td><td data-th="ESTADO"><span class="'+item.result["#text"]+'">'+item.result["#text"]+'</span></td></tr>');
              });
            }
            else
            {
                $("tablemodalnotif").parent().html('<div class="alert alert-info"><strong>No hay datos</strong><br /> No existe datos para mostrar en tus notificaciones.</div>');
            }
        }
    });

    return false;
}

/*
* Load INdicadores
*/
function loadIndicadores()
{
    $.ajax({
        url: 'do.php?action=GetIndicadores',
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (data) 
        {
            $(".especie_indicadores_container").html("");
            $(".especie_compra_drop").html("");
            $(".especie_venta_drop").html("");

            if(data.hasOwnProperty('element') && data.element.hasOwnProperty('item') && data.element.item.length > 0)
            {
                $.each(data.element.item, function( i, item ) 
                {
                  $(".especie_indicadores_container").append('<div class="item_label"><span>'+item.name["#text"]+'</span><input type="text" data-indicator-id="'+item.name["-id"]+'" class="item_label__input custom-input--number indicatorclass" /></div>');
              });
            }

            //Set drag & drops
            $( ".item_label" ).draggable({
                revert: true,
                revertDuration: 0
            });

            $( ".droppable" ).droppable({
                tolerance: "touch",
                classes: {
                    "ui-droppable-active": "ui-state-active",
                    "ui-droppable-hover": "ui-state-hover"
                },
                drop: function( event, ui ) {
                    $( this )
                    .addClass( "ui-state-highlight" )
                    .find( "p" )
                    .html( "Dropped!" );
                    ui.draggable.detach().appendTo($(this));
                }
            });


        }
    });

    return false;
}
/*
* Generar grafico
*/
function generateGraph()
{
    if($("#canvas").length > 0)
    {
        //Get tickers values
        var tickValues = [];
        var inCompra = [];
        var inVenta = [];

        $.each($(".indicatorclass"), function( i, item ) 
        {
            //Assign val
            tickValues.push("&"+$(item).attr("data-indicator-id")+"="+$(item).val());

            //Clasif
            var especie = $(item).parent().parent().parent().attr("class");

            if(especie == 'especie_compra')
            {
                inCompra.push($(item).attr("data-indicator-id"));
            }
            else if(especie == 'especie_venta')
            {
                inVenta.push($(item).attr("data-indicator-id"));
            }

        });

        //Continue ajax call
        $.ajax({
            url: 'do.php?action=GetGraphData',
            dataType: 'json',
            data : $("#SimuladorForm").serialize()+tickValues.join("")+"&venta="+inVenta.join(",")+"&compra="+inCompra.join(","),
            type: 'GET',
            async: true,
            success: function (data) 
            {
                var datafilled = false;
                var x = [];
                var y = [];
                var tt = [];

                if(data.hasOwnProperty('element') && data.element.hasOwnProperty('item') && data.element.item.length > 0)
                {
                    //Confirm
                    datafilled = true;
                    //fill data
                    $.each(data.element.item, function( i, item ) 
                    {
                        if(item.hasOwnProperty('senal'))
                        {
                            x.push(parseFloat(item.senal.pointx));
                            y.push(parseFloat(item.senal.pointy));
                            tt.push(item.senal.type);
                        }
                    });
                }

                if(datafilled)
                {
                    new Chart(document.getElementById("canvas"), {
                        type: 'line',
                        data: {
                            labels: x,
                            datasets: [{ 
                                data: y,
                                borderColor: "#3e95cd",
                                fill: false
                            }
                            ]
                        },
                        options: {
                            scales:
                            {
                                xAxes: [{
                                    display: true
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return tt[tooltipItem.index];
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}