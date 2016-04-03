//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {
alert('Entrando');
CargarTabla();

//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        
        Nombre: "required",
        Correo: "required",
        Slogan: "required",
        Mision: "required",
        Vision: "required",
        Subdominio: "required",
        Direccion: "required",
        Telefono1: "required",
        Telefono2: "required",
        

    },
    messages: {

        Nombre: "Debes escribir lo solicitado",
        Correo: "Debes escribir lo solicitado",
        Slogan: "Debes escribir lo solicitado",
        Mision: "Debes escribir lo solicitado",
        Vision: "Debes escribir lo solicitado",
        Subdominio: "Debes escribir lo solicitado",
        Direccion: "Debes escribir lo solicitado",
        Telefono1: "Debes escribir lo solicitado",
        Telefono2: "Debes escribir lo solicitado",

       

        
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


   
  });
    //=========== FIN DEL DOCUMENT READY================

    //======INICIO DE FUNCIONES ============

 function CargarTabla()
    {

var gridData = GetElementos();
//you need to include the shieldui css and js assets in order for the grids to work //
var table = $("#TablaNewOrganization").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/organizations",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = {organization:items[0].data};
                           

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/organizations",
                               
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
                           var newItem = {organization:items[0].data};

                            $.ajax({
                                type: "PUT",
                                url: "http://localhost:3000/api/v1/organizations/" + newItem.organization.id ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                          var newItem = {organization:items[0].data};
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/rols/"  + newItem.organization.id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        name: { path: "name", type: String },
                        email: { path: "email", type: String },
                        slogan: { path: "slogan", type: String },
                        logo: { path: "logo", type: String },
                        mission: { path: "mission", type: String },
                        view: { path: "view", type: String },
                        subdomain: { path: "subdomain", type: String },
                        address: { path: "address", type: String },
                        phone_number: { path: "phone_number", type: String },
                        phone_number_two: { path: "phone_number_two", type: String },

                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Id"},
                { field: "name", title: "Nombre de la Compañia"},
                { field: "email", title: "Email"},
                { field: "slogan", title: "Slogan"},
                { field: "logo", title: "Logo"},
                { field: "mission", title: "Mision"},
                { field: "view", title: "Vision"},
                { field: "subdomain", title: "Subdominio"},
                { field: "address", title: "Direccion"},
                { field: "phone_number", title: "Telefono 1"},
                { field: "phone_number_two", title: "Telefono 2"},
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
                            caption: "Reset Book List",
                            click: function (e) {
                                var grid = this;
                                $.ajax({
                                    type: "PUT",
                                    url: "http://localhost:3000/api/v1/organizations"
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
        url: 'http://localhost:3000/api/v1/organizations',
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
              alert(data.Idn),
              alert(data.Rif)
              alert(data.Nombre)
              alert(data.Direccion)
              alert(data.Correo)
              alert(data.Telefono)
              alert(data.Mision)
              alert(data.Vision)
            });
    }

    //Guardar elementos en DataBase
     function GuardarFuncion() {        
      //Capturar datos del formulario
      var Nombre = document.getElementById("txtNombre").value;
      var Correo = document.getElementById("txtCorreo").value;
      var Slogan = document.getElementById("txtSlogan").value;
      var Logo = document.getElementById("txtFoto").value;
      var Mision = document.getElementById("txtMision").value;
      var Vision = document.getElementById("txtVision").value; 
      var Subdominio= document.getElementById("txtSubdominio").value; 
      var Direccion = document.getElementById("txtDireccion").value;    
      var Telefono1 = document.getElementById("txtTelefono1").value;
      var Telefono2 = document.getElementById("txtTelefono2").value;
      


      //Agregamos los datos capturados a un arreglo => arr
      var arr = {name:Nombre,email:Correo,slogan:Slogan,logo:Logo,
                  mission:Mision, view:Vision, subdomain:Subdominio, address:Direccion, 
                  phone_number:Telefono1, phone_number_two:Telefono2};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/organizations',
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
          var table = $('#TablaNewOrganization').dataTable();
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
       var IdOrganization = document.getElementById("txtIdOrganization").value;
      var Nombre = document.getElementById("txtNombre").value;
      var Correo = document.getElementById("txtCorreo").value;
      var Slogan = document.getElementById("txtSlogan").value;
      var Logo = document.getElementById("txtFoto").value;
      var Mision = document.getElementById("txtMision").value;
      var Vision = document.getElementById("txtVision").value; 
      var Subdominio= document.getElementById("txtSubdominio").value; 
      var Direccion = document.getElementById("txtDireccion").value;    
      var Telefono1 = document.getElementById("txtTelefono1").value;
      var Telefono2 = document.getElementById("txtTelefono2").value;
      var Status = 1;
      


      //Agregamos los datos capturados a un arreglo => arr
      var arr = { id:IdOrganization, name:Nombre,email:Correo,slogan:Slogan,logo:Logo,
                  mission:Mision, view:Vision, subdomain:Subdominio, address:Direccion, 
                  phone_number:Telefono1, phone_number_two:Telefono2, status:Status };
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/organizations',
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
          var table = $('#TablaNewOrganization').dataTable();
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
     var IdOrganization = document.getElementById("txtIdOrganization").value;
     var Status = 0;
      


      //Agregamos los datos capturados a un arreglo => arr
      var arr = { id:IdOrganization, status:Status };     
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/organizations/+id',
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
          var table = $('#TablaNewOrganization').dataTable();
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
  message: "¿Esta seguro de guardar esto?",
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
  message: "¿Esta seguro de guardar esto?",
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
  message: "¿Esta seguro de guardar esto?",
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