//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {
//Cargar DataTable
CargarTabla();
//Cargar Combobox
cargarComboUsuario();
cargarComboRol();

//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        Usuario: "required",
        Rol: "required",
        
    },
    messages: {
        Usuario: "Debes seleccionar un usuario",
        Rol: "Debes seleccionar un rol",
       
    },
    messages: {
        
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

    //======INICIO DE FUNCIONES ============

  function CargarTabla()
    {

var gridData = GetElementos();
//you need to include the shieldui css and js assets in order for the grids to work //
var table = $("#TablaUsuarioRol").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/userrols",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = {userrol:items[0].data};
                           

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/userrols",
                               
                                dataType: "json",
                                data: newItem,
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
                           var newItem = {userrol:items[0].data};

                            $.ajax({
                                type: "PUT",
                                url: "http://localhost:3000/api/v1/userrols/" + newItem.userrol.id ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                          var newItem = {userrol:items[0].data};
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/userrols/"  + newItem.userrol.id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        user_id: { path: "user.name", type: String },
                        rol_id: { path: "rol.name", type: String },
                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Código", width: "120px" },
                { field: "user_id", title: "Usuario", width: "80px" },
                { field: "rol_id", title: "Rol", width: "80px" },
                {
                    width: 140,
                    title: " ",
                    buttons: [
                        { commandName: "edit", caption: "Editar" },
                        { commandName: "delete", caption: "Eliminar" }
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
                            caption: "Resetear Lista",
                            click: function (e) {
                                var grid = this;
                                $.ajax({
                                    type: "PUT",
                                    url: "http://localhost:3000/api/v1/userrols"
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
        url: 'http://localhost:3000/api/v1/userrols',
        type: 'GET',
        dataType: 'json',            
        success: function (data) {                
         return data; 
        },
        error: function (x, y, z) {
          alert(x + '\n' + y + '\n' + z);
        }
      });        
    }
      //Al hacer clic en la tabla carga los campos en los TXT
    
    //FUNCION PARA OBTENER ELEMENTOS PARTICULARES DEL SERVICIO

           // Luego de obtener el JSON esta funcion lo escribe donde pidamos
    function WriteResponse(data) {        

            $.each(data, function (index, data) {   
              alert(data.IdUsuarioRol),                     
              alert(data.Usuario)
              alert(data.Rol)
            });
    }

    //Guardar elementos en DataBase
     function GuardarUserRols() {        
      //Capturar datos del formulario

      var IdUsuarioRol = document.getElementById("txtIdUsuarioRol").value;
      var Usuario =  document.getElementById("cmbUsuario").value;
      var Rol =  document.getElementById("cmbTipoRol").value;
      //var Estatus = 1;


      //Agregamos los datos capturados a un arreglo => arr
      var userrol = { id:IdUsuarioRol,user_id:Usuario,rol_id:Rol};

      //Agregamos los datos capturados de arr a un arreglo llamado city
      var userrol = arr;
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/userrols',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(userrol),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Almacenados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaUsuarioRol').dataTable();
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

    function ModificarUserRols() {        

      var IdUsuarioRol = document.getElementById("txtIdUsuarioRol")
      var Usuario =  document.getElementById("cmbUsuario").value;
      var Rol =  document.getElementById("cmbTipoRol").value;
      //var Estatus = 1;


      //Agregamos los datos capturados a un arreglo => arr
      var userrol = { id:IdUsuarioRol,user_id:Usuario,rol_id:Rol};
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/userrols',
        type: 'PUT',
        //Enviamos el arreglo ar
        data: JSON.stringify(userrol),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Modificados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaUsuarioRol').dataTable();
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

    function EliminarUserRols() {        

      var Usuario =  document.getElementById("cmbUsuario").value;
      var Rol =  document.getElementById("cmbTipoRol").value;
      //var Estatus = 1;


      //Agregamos los datos capturados a un arreglo => arr
      var userrol = { user_id:Usuario,rol_id:Rol};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/userrols/+id',
        type: 'DELETE',
        //Enviamos el arreglo ar
        data: JSON.stringify(userrol),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Eliminados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaUsuarioRol').dataTable();
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
  message: "¿Esta seguro de guardar el usuario con el rol asignado?",
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
        GuardarUserRols();
      }
          }
      
    }
  
});
     
    }

      function ConfirmModificar() {     
     bootbox.dialog({
  message: "¿Esta seguro de modificar el usuario con el rol asignado?",
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
        ModificarUserRols();
      }
          }
      
    }
  
});
     
    }

     function ConfirmEliminar() {     
     bootbox.dialog({
  message: "¿Esta seguro de Eliminar el usuario con el rol asignado?",
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
        EliminarUserRols();
      }
          }
      
    }
  
});
     
    }


    // ===========C A R F G A R  C O M B O X ======================

 function cargarComboUsuario()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/users',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].name + "</option>";

                }
                $("#cmbUsuario").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 

   function cargarComboRol()
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


//============FIN DE LAS FUNCIONES============