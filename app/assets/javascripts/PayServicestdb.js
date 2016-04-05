
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
      minlength: 8,
       maxlength: 40,
       //lettersonly: true
        number: true
    },
    password: {
      required: true,
      minlength: 4,
       maxlength: 6,
      number:true
    //   ,number: true
    },
     codcustomer: {
      required: true,
      minlength: 4,
       maxlength: 10,
      number:true
    //   ,number: true
    },
     mount: {
      required: true,
      minlength: 4,
       maxlength: 6,
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
    ConfirmGuardar();
  }
}); 
$('#Modificar').on("click",function(e) {
  // your stuff}
  if ($("#form").valid()) {
    e.preventDefault();
    ConfirmModificar();
  }
}); 
$('#Eliminar').on("click",function(e) {
  // your stuff}
  if ($("#form").valid()) {
    e.preventDefault();
    ConfirmEliminar();
  }
}); 



   
  });
    //=========== FIN DEL DOCUMENT READY================

    //======INICIO DE FUNCIONES ============

   
    //FUNCION PARA OBTENER ELEMENTOS PARTICULARES DEL SERVICIO

    function GetElementos() {
      jQuery.support.cors = true;
      $.ajax({
        url: 'http://localhost:5414/api/v1/Funciones',
        type: 'GET',
        dataType: 'json',            
        success: function (data) {                
          WriteResponse(data);
        },
        error: function (x, y, z) {
          alert(x + '\n' + y + '\n' + z);
        }
      });        
    }
           // Luego de obtener el JSON esta funcion lo escribe donde pidamos
    function WriteResponse(data) {        

            $.each(data, function (index, data) {                        
              alert(data.Idn),
              alert(data.Nombre)
              alert(data.Descripcion)
            });
    }
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
     function GuardarFuncion() {        
      //Capturar datos del formulario
      var codTDC = document.getElementById("txtCodTDC").value;
      var Password = document.getElementById("txtPassword").value;
      var bank_id = $("#cmbBank :selected").attr('value');
      var codcustomer = document.getElementById("txtCedula").value;
      var mount = document.getElementById("txtMonto").value;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { codtdb:codTDC,password:Password,bank_id:bank_id,mount: mount,codcustomer: codcustomer};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3001/api/v1/tdbcheck',
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

    function ModificarFuncion() {        

       var Nombre = document.getElementById("txtNombre").value;
      var Descripcion = document.getElementById("txtDescripcion").value;
       var Idn = document.getElementById("txtIdn").value;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Idn:Idn,Nombre:Nombre,Descripcion:Descripcion};
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:5414/api/v1/Funcion/',
        type: 'PUT',
        //Enviamos el arreglo ar
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Almacenados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaFuncion').dataTable();
                      // Example call to reload from original file
                      table.fnReloadAjax();
                    },
        //Si algo falla en el API indica
        error: function() {
          bootbox.alert("Error al modificar los datos", function() {
          
          });
           // e.preventDefault();
        }
                  });
    }

    function EliminarFuncion() {        

     var Nombre = document.getElementById("txtNombre").value;
      var Descripcion = document.getElementById("txtDescripcion").value;
       var Idn = document.getElementById("txtIdn").value;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Idn:Idn,Nombre:Nombre,Descripcion:Descripcion};
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:5414/api/v1/Funcion/10',
        type: 'DELETE',
        //Enviamos el arreglo ar
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Eliminados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaFuncion').dataTable();
                      // Example call to reload from original file
                      table.fnReloadAjax();
                    },
        //Si algo falla en el API indica
        error: function() {
          bootbox.alert("Error al eliminar los datos", function() {
          
          });
           // e.preventDefault();
        }
                  });
    }
function validarSalida(){
 
}
    




// ========== FUNCIONES PARA MENSAJE DE CONFIRMACION ================


  function ConfirmGuardar() {     
     bootbox.dialog({
  message: "¿Esta seguro de esta transacción?",
  title: "Confirmación",
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
        GuardarFuncion();
      }
          }
      
    }
  
});
     
    }

      function ConfirmModificar() {     
     bootbox.dialog({
  message: "¿Esta seguro de modificar esta función?",
  title: "Confirmación",
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
        ModificarFuncion();
      }
          }
      
    }
  
});
     
    }

     function ConfirmEliminar() {     
     bootbox.dialog({
  message: "¿Esta seguro de Eliminar esta Función?",
  title: "Confirmación",
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
        EliminarFuncion();
      }
          }
      
    }
  
});
     
    }
//============FIN DE LAS FUNCIONES============