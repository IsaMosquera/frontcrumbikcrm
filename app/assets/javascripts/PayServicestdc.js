
//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {

cargarComboBanco();
//Validar documento, configurar
 //Validar documento, configurar
$("#form").validate({

  rules: {
    codtdc: {
      required: true,
      minlength: 4,
       maxlength: 40,
       //lettersonly: true
        number: true
    },
    nametdc: {
      required: true,
      minlength: 4,
       maxlength: 26,
   
      //number:true
    //   ,number: true
    },
     codcustomer: {
      required: true,
      minlength: 4,
       maxlength: 10,
      number:true
    //   ,number: true
    },
     securitycode: {
      required: true,
      minlength: 2,
       maxlength: 4,
      number: true
    //   ,number: true
    },
      mount: {
      required: true,
      minlength: 1,
       maxlength: 10,
      number: true
    //   ,number: true
    }



  }
 
});

//Eventos en botones de el formulario
$('#Guardar').on("click",function(e) {
  // your stuff}
  if ($("#form").valid()) {
    e.preventDefault();
    ConfirmPay();
  }
}); 




   
  });
    //=========== FIN DEL DOCUMENT READY================

    //======INICIO DE FUNCIONES ============

function cargarComboBanco()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3001/api/v1/banks',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].name +"</option>";

                }
                $("#cmbBank").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 
    //Guardar elementos en DataBase
     function ProcesarPago() {        
      //Capturar datos del formulario
      var codtdc = document.getElementById("txtCodTDC").value;
       var nametdc = document.getElementById("txtNameTDC").value;
        var codcustomer = document.getElementById("txtCodCustomer").value;
         var expiredate = document.getElementById("txtExpireDate").value;
          var securitycode = document.getElementById("txtSecurityCode").value;
            var mount = document.getElementById("txtMonto").value;
             var bank_id = $("#cmbBank :selected").attr('value');
    
      //Agregamos los datos capturados a un arreglo => arr
      var arr = { codtdc:codtdc,nametdc:nametdc,
                  bank_id:bank_id,codcustomer: codcustomer,
                  expiredate: expiredate, securitycode: securitycode,
                  mount: mount};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3001/api/v1/tdccheck',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(data) {
          bootbox.alert(data, function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
         
                    },
        //Si algo falla en el API indica
        error: function() {
          bootbox.alert("Error al almacenar los datos", function() {
          
          });
           // e.preventDefault();
        }
                  });

    }




// ========== FUNCIONES PARA MENSAJE DE CONFIRMACION ================


function ConfirmPay() {     
 bootbox.dialog({
  message: "¿Esta seguro de realizar esta transacción?",
  title: "PAGO CON TARJETA DE CREDITO",
  buttons: {
   danger: {
    label: "No estoy seguro",
    className: "btn-danger",
    callback: function() {

    }
  },
  success: {
    label: "Si, Estoy seguro",
    className: "btn-success",
    callback: function() {

      bootbox.hideAll();
      ProcesarPago();
    }
  }

}

});
     
    

  
  
    }

//============FIN DE LAS FUNCIONES============