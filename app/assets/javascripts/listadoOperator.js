//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {

//Cargar DataTable
CargarTabla();
//Cargar Combos
cargarComboTipoRol();
cargarComboCiudad();
cargarComboOrganizacion();

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



   
  });
    //=========== FIN DEL DOCUMENT READY================
function CargarTabla()
    {

var gridData = GetElementos();
//you need to include the shieldui css and js assets in order for the grids to work //
var table = $("#TablaOperadores").shieldGrid({
            dataSource: {
                events: {
                    error: function (event) {
                        if (event.errorType == "transport") {
                            // transport error is an ajax error; event holds the xhr object
                            alert("transport error: " + event.error.statusText);
                            // reload the data source if the operation that failed was save
                            if (event.operation == "save") {
                                this.read();
                            }
                        }
                        else {
                            // other data source error - validation, etc
                            alert(event.errorType + " error: " + event.error);
                        }
                    }
                },
                remote: {
                    read: {
                        type: "GET",
                        url: "http://localhost:3000/api/v1/operators",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = items[0];
                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/operators",
                                dataType: "json",
                                data: newItem.data,
                                complete: function (xhr) {
                                    if (xhr.readyState == 4) {
                                        if (xhr.status == 201) {
                                            // update the id of the newly-created item with the 
                                            // one returned from the server in the Location hader url
                                            var location = xhr.getResponseHeader("Location");
                                            newItem.data.Id = +location.replace(/^.*?\/([\d]+)$/, "$1");
                                            success();
                                            return;
                                        }
                                    }
                                    error(xhr);
                                }
                            });
                        },
                        update: function (items, success, error) {
                            $.ajax({
                                type: "PUT",
                                url: "http://localhost:3000/api/v1/operators/1" ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/operators" + items[0].data.Id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        name: { path: "name", type: String },
                        last_name: { path: "last_name", type: String },
                        birthdate: { path: "birthdate", type: String },
                        sex: { path: "sex", type: String },                        
                        rol_id: { path: "rol.description", type: String },
                        city_id: { path: "city.description", type: String },
                        organization_id: { path: "organization.name", type: String },
                        user_id: { path: "user_id", type: String },
                        status: { path: "status", type: Number }

                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Id"},
                { field: "name", title: "Nombre del Servicio"},
                { field: "last_name", title: "Apellido"},
                { field: "birthdate", title: "Fecha de Nacimiento"},
                { field: "sex", title: "Sexo"},
                { field: "rol_id", title: "Rol"},
                { field: "city_id", title: "Ciudad"},
                { field: "organization_id", title: "Organizacion"},
                { field: "user_id", title: "Username"},
                {
                    width: 100,
                    title: " ",
                    buttons: [
                        { commandName: "edit", caption: "Edit" },
                        { commandName: "delete", caption: "Delete" }
                    ]
                }
            ],
            toolbar: [
                {
                    buttons: [
                        { commandName: "insert", caption: "Agregar" }
                    ],
                    position: "top"
                },
                {
                    buttons: [
                        {
                            caption: "Reset",
                            click: function (e) {
                                var grid = this;
                                $.ajax({
                                    type: "PUT",
                                    url: "http://localhost:3000/api/v1/operators"
                                }).done(function () {
                                    grid.dataSource.read();
                                });
                            }
                        }
                    ],
                    position: "bottom"
                }
            ],
            paging: {
                pageSize: 5
            },
            editing: {
                enabled: true,
                type: "row"
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
        url: 'http://localhost:3000/api/v1/operators',
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
              alert(data.Username)
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
      var Organizacion = document.getElementById('cmbOrganizacion').value;
      var Username = document.getElementById('txtUserName').value;
      var Status = 1;

      //Agregamos los datos capturados a un arreglo => arr
      var operator = { Tipo_Rol:Tipo_Rol,Nombre:Nombre,Apellido:Apellido,Sexo:Sexo,Fecha_Nac:Fecha_Nac,Ciudad:Ciudad,Organizacion:Organizacion,Username:Username };
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/operators',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(operator),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Almacenados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaOperadores').dataTable();
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

       //Capturar datos del formulario
      var Tipo_Rol = document.getElementById('cmbTipoRol').value;
      var Nombre = document.getElementById("txtNombre").value;
      var Apellido = document.getElementById("txtApellido").value;
      var Sexo = document.getElementById('cmbSexo').value;
      var Fecha_Nac= document.getElementById('txtFechaNacimiento').value;
      var Ciudad = document.getElementById('cmbCiudad').value;
      var Organizacion = document.getElementById('cmbOrganizacion').value;
      var Username = document.getElementById('txtUserName').value;
      var Status = 1;

      //Agregamos los datos capturados a un arreglo => arr
      var operator = { Tipo_Rol:Tipo_Rol,Nombre:Nombre,Apellido:Apellido,Sexo:Sexo,Fecha_Nac:Fecha_Nac,Ciudad:Ciudad,Organizacion:Organizacion,Username:Username };
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/operator',
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
          var table = $('#TablaOperadores').dataTable();
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

      //Capturar datos del formulario
      var Tipo_Rol = document.getElementById('cmbTipoRol').value;
      var Nombre = document.getElementById("txtNombre").value;
      var Apellido = document.getElementById("txtApellido").value;
      var Sexo = document.getElementById('cmbSexo').value;
      var Fecha_Nac= document.getElementById('txtFechaNacimiento').value;
      var Ciudad = document.getElementById('cmbCiudad').value;
      var Organizacion = document.getElementById('cmbOrganizacion').value;
      var Username = document.getElementById('txtUserName').value;
      var Status = 0;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Tipo_Rol:Tipo_Rol,Nombre:Nombre,Apellido:Apellido,Sexo:Sexo,Fecha_Nac:Fecha_Nac,Ciudad:Ciudad,Organizacion:Organizacion,Username:Username };
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/operators/10',
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
          var table = $('#TablaOperadores').dataTable();
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





//===================Cargar Combobox

 function cargarComboCiudad()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/cities',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].description + "</option>";

                }
                $("#cmbCiudad").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 


 function cargarComboTipoRol()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/rols',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].name + "</option>";

                }
                $("#cmbTipoRol").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 

 function cargarComboOrganizacion()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/organizations',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].name + "</option>";

                }
                $("#cmbOrganizacion").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 

//============FIN DE LAS FUNCIONES============