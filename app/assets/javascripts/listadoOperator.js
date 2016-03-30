//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {


//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        
        Nombre: "required",
        Apellido: "required",     
 

        

    },
    messages: {
        
        Nombre: "Debes escribir un nombre",
        Apellido: "Debes escribir un apellido",

        

        
    }
})

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


//Cargar DataTable
CargarTabla();

   
  });
    //=========== FIN DEL DOCUMENT READY================

    //======INICIO DE FUNCIONES ============

 function CargarTabla()
    {

//you need to include the shieldui css and js assets in order for the grids to work //
var table = $("#grid").shieldGrid({
            dataSource: {
                url: 'http://www.prepbootstrap.com/Content/data/shortGridData.js',
                data: gridData,
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        age: { path: "age", type: Number },
                        name: { path: "name", type: String },
                        company: { path: "company", type: String },
                        month: { path: "month", type: Date },
                        isActive: { path: "isActive", type: Boolean },
                        email: { path: "email", type: String },
                        transport: { path: "transport", type: String }
                    }
                }
            },
            sorting: {
                multiple: true
            },
            rowHover: false,
            columns: [
                { field: "name", title: "Person Name", width: "120px" },
                { field: "age", title: "Age", width: "80px" },
                { field: "company", title: "Company Name" },
                { field: "month", title: "Date of Birth", format: "{0:MM/dd/yyyy}", width: "120px" },
                { field: "isActive", title: "Active" },
                { field: "email", title: "Email Address", width: "250px" },
                { field: "transport", title: "Custom Editor", width: "120px", editor: myCustomEditor },
                {
                    width: "104px",
                    title: "",
                    buttons: [
                        { cls: "deleteButton", commandName: "delete", caption: "<img src='http://www.prepbootstrap.com/Content/images/template/BootstrapEditableGrid/delete.png' /><span></span>" }
                    ]
                }
            ],
            editing: {
                enabled: true,
                event: "click",
                type: "cell",
                confirmation: {
                    "delete": {
                        enabled: true,
                        template: function (item) {
                            alert("I am an alert box!");
                            return "Delete row with ID = " + item.id
                            alert("2");
                        }
                    }
                }
            },
            events:
            {
                getCustomEditorValue: function (e) {
                    e.value = $("#dropdown").swidget().value();
                    $("#dropdown").swidget().destroy();
                }
            }
        });


    

    


    }
    
        function myCustomEditor(cell, item) {
            $('<div id="dropdown"/>')
                .appendTo(cell)
                .shieldDropDown({
                    dataSource: {
                        data: ["motorbike", "car", "truck"]
                    },
                    value: !item["transport"] ? null : item["transport"].toString()
                }).swidget().focus();
        }

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
              alert(data.Apellido)
              alert(data.Fecha_Nac)
              alert(data.Correo)
            });
    }

    //Guardar elementos en DataBase
     function GuardarFuncion() {        
      //Capturar datos del formulario
      var Tipo_Rol = document.getElementById('cmbTipoRol').value;
      var Nombre = document.getElementById("txtNombre").value;
      var Apellido = document.getElementById("txtApellido").value;
      var Sexo = document.getElementById('cmbSexo').value;
      var Fecha_Nac= document.getElementById('txtFechaNacimiento').value;
      var Ciudad = document.getElementById('cmbCiudad').value;
      var Correo = document.getElementById('txtCorreo').value;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Tipo_Rol:Tipo_Rol,Nombre:Nombre,Apellido:Apellido,Sexo:Sexo,Fecha_Nac:Fecha_Nac,Ciudad:Ciudad,Correo:Correo };
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:5414/api/v1/Funcion',
        type: 'POST',
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
          var table = $('#TablaOperator').dataTable();
                      // Example call to reload from original file
                      table.fnReloadAjax();
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

      var Tipo_Rol = document.getElementById('cmbTipoRol').value;
      var Nombre = document.getElementById("txtNombre").value;
      var Apellido = document.getElementById("txtApellido").value;
      var Sexo = document.getElementById('cmbSexo').value;
      var Fecha_Nac= document.getElementById('txtFechaNacimiento').value;
      var Ciudad = document.getElementById('cmbCiudad').value;
      var Correo = document.getElementById('txtCorreo').value;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Tipo_Rol:Tipo_Rol,Nombre:Nombre,Apellido:Apellido,Sexo:Sexo,Fecha_Nac:Fecha_Nac,Ciudad:Ciudad,Correo:Correo };
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
          var table = $('#TablaOperator').dataTable();
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

      var Tipo_Rol = document.getElementById('cmbTipoRol').value;
      var Nombre = document.getElementById("txtNombre").value;
      var Apellido = document.getElementById("txtApellido").value;
      var Sexo = document.getElementById('cmbSexo').value;
      var Fecha_Nac= document.getElementById('txtFechaNacimiento').value;
      var Ciudad = document.getElementById('cmbCiudad').value;
      var Correo = document.getElementById('txtCorreo').value;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Tipo_Rol:Tipo_Rol,Nombre:Nombre,Apellido:Apellido,Sexo:Sexo,Fecha_Nac:Fecha_Nac,Ciudad:Ciudad,Correo:Correo };
      
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
          var table = $('#TablaOperator').dataTable();
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
  message: "¿Esta seguro de guardar esta Función?",
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