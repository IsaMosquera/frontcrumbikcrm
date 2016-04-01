
//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {
//Cargar DataTable
CargarTabla();

//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        Nombre: "required",
        Apellido: "required",
        Cedula: "required",
        Direccion: "required",
        Pais: "required",
        Estado: "required",
        Ciudad: "required",
        Email: "required",
        Telefono: "required",
        TelefonoCelular: "required",
        FechaNacimiento: "required",
        TipoCliente: "required",
        SitioWeb: "required",
        FotoPerfil: "required",
    },
    messages: {
        Nombre: "Debes escribir un nombre",
        Apellido: "Debes escribir un apellido",
        Cedula: "Debes escribir una cedula",
        Direccion: "Debes escribir una direccion",
        Pais: "Debes seleccionar un país",
        Estado: "Debes seleccionar un estado",
        Ciudad: "Debes seleccionar una ciudad",
        Email: "Debes escibir un e-mail",
        Telefono: "Debes escibir un teléfono",
        TelefonoCelular: "Debes escribir un teléfono celular",
        FechaNacimiento: "Debes seleccionar una fecha de nacimiento",
        TipoCliente: "Debes seleccionar un tipo de cliente",
        SitioWeb: "Debes escribir un sitio web",      
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
var table = $("#TablaCliente").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/customers",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = items[0];
                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/customers",
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
                                url: "http://localhost:3000/api/v1/customers" + items[0].data.Id,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/customers" + items[0].data.Id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        name: { path: "name", type: String },
                        last_name: { path: "last_name", type: String },
                        address: { path: "address", type: String},
                        email: { path: "email", type: String},
                        phone: { path: "phone", type: String},
                        celular: { path: "celular", type: String},
                        sex: { path: "sex", type: String},
                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Codigo", width: "120px" },
                { field: "name", title: "Nombre", width: "80px" },
                { field: "last_name", title: "Apellido", width: "80px" },
                { field: "address", title: "Dirección", width: "80px" },
                { field: "email", title: "E-mail", width: "80px" },
                { field: "phone", title: "Teléfono", width: "80px" },
                { field: "celular", title: "Celular", width: "80px" },
                { field: "sex", title: "Sexo", width: "80px" },
                {
                    width: 140,
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
                            caption: "Reset Book List",
                            click: function (e) {
                                var grid = this;
                                $.ajax({
                                    type: "PUT",
                                    url: "http://localhost:3000/api/v1/customers"
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
        url: 'http://localhost:3000/api/v1/customers',
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


      // Luego de obtener el JSON esta funcion lo escribe donde pidamos
    function WriteResponse(data) {        

            $.each(data, function (index, data) {                        
              alert(data.Cedula),
              alert(data.Nombre)
              alert(data.Apellido)
              alert(data.Direccion)
              alert(data.Pais)
              alert(data.Estado)
              alert(data.Ciudad)
              alert(data.Email)
              alert(data.Telefono)
              alert(data.TelefonoCelular)
              alert(data.FechaNacimiento)
              alert(data.TipoCliente)
              alert(data.SitioWeb)
              alert(data.FotoPerfil)
              alert(data.Estatus)  
            });
    }

    //Guardar elementos en DataBase
     function GuardarCustomer() {        
      //Capturar datos del formulario
      var idCustomer = document.getElementById("txtCedula").value;
      var Nombre = document.getElementById("txtNombre").value;
      var Apellido = document.getElementById("txtApellido").value;
      var Direccion = document.getElementById("txtDireccion").value;
      var Cedula = document.getElementById("txtCedula").value;
      var Ciudad = document.getElementById("cmbCiudad").value;
      var Email = document.getElementById("txtEmail").value;
      var Sexo = document.getElementById("cmbSexo").value;
      var Telefono = document.getElementById("txtTelefono").value;
      var TelefonoCelular = document.getElementById("txtTelefonoCelular").value;
      var FechaNacimiento = document.getElementById("txtFechaNacimiento").value;
      var TipoCliente = document.getElementById("cmbTipoCliente").value;
      var SitioWeb = document.getElementById("txtSitioWeb").value;
      var FotoPerfil = document.getElementById("txtFotoPerfil").value;
      var Estatus = 1;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { id:idCustomer,name:Nombre,last_name:Apellido, address:Direccion,city:Ciudad,email:Email,
                  phone:Telefono, celular:TelefonoCelular,birthdate:FechaNacimiento,sex:Sexo,
                  customertype:TipoCliente,website:SitioWeb, image:FotoPerfil, status:Estatus};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/customers',
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
          var table = $('#TablaCustomer').dataTable();
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

    function ModificarCustomer() {        

      var idCustomer = document.getElementById("txtCedula").value;
      var Nombre = document.getElementById("txtNombre").value;
      var Apellido = document.getElementById("txtApellido").value;
      var Direccion = document.getElementById("txtDireccion").value;
      var Cedula = document.getElementById("txtCedula").value;
      var Ciudad = document.getElementById("cmbCiudad").value;
      var Email = document.getElementById("txtEmail").value;
      var Sexo = document.getElementById("cmbSexo").value;
      var Telefono = document.getElementById("txtTelefono").value;
      var TelefonoCelular = document.getElementById("txtTelefonoCelular").value;
      var FechaNacimiento = document.getElementById("txtFechaNacimiento").value;
      var TipoCliente = document.getElementById("cmbTipoCliente").value;
      var SitioWeb = document.getElementById("txtSitioWeb").value;
      var FotoPerfil = document.getElementById("txtFotoPerfil").value;
      var Estatus = 1;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { id:idCustomer,name:Nombre,last_name:Apellido, address:Direccion,city:Ciudad,email:Email,
                  phone:Telefono, celular:TelefonoCelular,birthdate:FechaNacimiento,sex:Sexo,
                  customertype:TipoCliente,website:SitioWeb, image:FotoPerfil, status:Estatus};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/customers',
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
          var table = $('#TablaCustomer').dataTable();
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

    function EliminarCustomer() {        

      var idCustomer = document.getElementById("txtCedula").value;
      var Estatus = 0;

      //Agregamos los datos capturados a un arreglo => arr
      var arr = { id:idCustomer, status:Estatus};
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/customers/+id',
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
          var table = $('#TablaCustomer').dataTable();
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

  bootbox.dialog({
  message: "¿Esta seguro que desea salir de esta ventana?",
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
      }
          }
      
    }
  
});
 
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
        GuardarCustomer();
      }
          }
      
    }
  
});
     
    }

      function ConfirmModificar() {     
     bootbox.dialog({
  message: "¿Esta seguro de modificar este cliente?",
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
        ModificarCustomer();
      }
          }
      
    }
  
});
     
    }

     function ConfirmEliminar() {     
     bootbox.dialog({
  message: "¿Esta seguro de Eliminar este cliente?",
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
        EliminarCostumer();
      }
          }
      
    }
  
});

    
    }
//============FIN DE LAS FUNCIONES============