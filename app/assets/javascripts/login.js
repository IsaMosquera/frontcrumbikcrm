
//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {
//Cargar DataTable
//CargarTabla();
//Cargar Combobox
//cargarcomboPais();
//cargarcomboEstado();

//Validar documento, configurar
 
//Eventos en botones de el formulario
$('#Enviar').on("click",function(e) {
  // your stuff}
  
    e.preventDefault();
    Enviar();

    //ConfirmGuardar();
  
}); 



   
  });
    //=========== FIN DEL DOCUMENT READY================

    //======INICIO DE FUNCIONES ============

  function CargarTabla()
    {

var gridData = GetElementos();
//you need to include the shieldui css and js assets in order for the grids to work //
var table = $("#TablaCiudad").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/cities",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = {city:items[0].data};
                           

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/cities",
                               
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
                           var newItem = {city:items[0].data};

                            $.ajax({
                                type: "PUT",
                                url: "http://localhost:3000/api/v1/cities/" + newItem.city.id ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                          var newItem = {city:items[0].data};
                            $.ajax({
                                type: "DELETE",
                                url: "hhttp://localhost:3000/api/v1/cities/"  + newItem.city.id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        description: { path: "description", type: String },
                        state_id: { path: "state.description", type: String },
                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Código", width: "120px" },
                { field: "description", title: "Ciudad", width: "80px" },
                { field: "state_id", title: "Estado", width: "80px" },
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
                                    url: "http://localhost:3000/api/v1/cities"
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
        url: 'http://localhost:3000/api/v1/cities',
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
              alert(data.IdCiudad),                     
              alert(data.Pais)
              alert(data.Estado)
              alert(data.Ciudad)
              alert(data.Estatus)

            });
    }

    //Guardar elementos en DataBase
     function Enviar() {        
      //Capturar datos del formulario

      var email =  document.getElementById("txtemail").value;
      var contrasena =  document.getElementById("txtpassword").value;
      //var Estatus = 1;


      //Agregamos los datos capturados a un arreglo => arr
      var arr = { email:email,password:contrasena};

      //Agregamos los datos capturados de arr a un arreglo llamado city
      var user = arr;
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://127.0.0.1:3000/login',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(data) {
          alert(data.email);
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          //var table = $('#TablaCiudad').dataTable();
                      // Example call to reload from original file
                      //table.fnReloadAjax();
                    },
        //Si algo falla en el API indica
        error: function() {
          alert("Error al almacenar los datos"); 
          
          
           // e.preventDefault();
        }
                  });

    }

    function ModificarCity() {        

      var IdCiudad = document.getElementById("txtIdCiudad").value;
      var Pais = document.getElementById("cmbPais").value;
      var Estado =  document.getElementById("cmbEstado").value;
      var Ciudad =  document.getElementById("txtCiudad").value;
      var Estatus = 1;


      //Agregamos los datos capturados a un arreglo => arr
      var city = { IdCiudad:id,country:Pais,state:Estado,description:Ciudad,status:Estatus };
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/cities',
        type: 'PUT',
        //Enviamos el arreglo ar
        data: JSON.stringify(city),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Modificados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaCiudad').dataTable();
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

    function EliminarCity() {        

      var IdCiudad = document.getElementById("txtIdCiudad").value;
      var Estatus = 0;


      //Agregamos los datos capturados a un arreglo => arr
      var arr = { IdCiudad:id,status:Estatus };
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/cities/+id',
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
          var table = $('#TablaCiudad').dataTable();
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
  message: "¿Esta seguro de guardar esta Ciudad?",
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
        GuardarCity();
      }
          }
      
    }
  
});
     
    }

      function ConfirmModificar() {     
     bootbox.dialog({
  message: "¿Esta seguro de modificar esta Ciudad?",
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
        ModificarCity();
      }
          }
      
    }
  
});
     
    }

     function ConfirmEliminar() {     
     bootbox.dialog({
  message: "¿Esta seguro de Eliminar esta Ciudad?",
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
        EliminarCity();
      }
          }
      
    }
  
});
     
    }


    // ===========C A R F G A R  C O M B O X ======================

 function cargarcomboPais()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/countrys',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].description + "</option>";

                }
                $("#cmbPais").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 

   function cargarcomboEstado()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/states',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].description + "</option>";

                }
                $("#cmbEstado").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      }
//============FIN DE LAS FUNCIONES============