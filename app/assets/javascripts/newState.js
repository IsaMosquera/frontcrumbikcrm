
//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {

//Cargar DataTable
CargarTabla();
//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        Pais: "required",
        Estado: "required",

    },
    messages: {
        Pais: "Debes seleccionar un país",
        Estado: "Debes escribir un estado",
        
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

    //======INICIO DECARGAR TABLAS ============
 function CargarTabla()
    {


var gridData = GetElementos();
//you need to include the shieldui css and js assets in order for the grids to work //
var table = $("#TablaEstado").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/states",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = items[0];
                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/states",
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
                                url: "http://localhost:3000/api/v1/states/1" ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/states" + items[0].data.Id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        description: { path: "description", type: String },
                        country_id: { path: "country.description", type: String },

                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Id"},
                { field: "description", title: "Nombre"},
                { field: "country_id", title: "Nombre del Pais"},
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
                                    url: "http://localhost:3000/api/v1/states"
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
        url: 'http://localhost:3000/api/v1/states',
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
              alert(data.idEstado),
              alert(data.Estado)
              alert(data.Pais)
              alert(data.Estatus)
            });
    }

    //Guardar elementos en DataBase
     function GuardarState() {        
      //Capturar datos del formulario
      var Estado = document.getElementById("txtEstado").value;
      var Pais = document.getElementById("cmbPais").value;
      var idEstado = document.getElementById("txtIdEstado").value;
      var Estatus = document.getElementById("txtEstatus").value;
      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Estado:Estado,Pais:Pis,idEstado:idEstado,Estatus:Estatus };
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/states',
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
          var table = $('#TablaEstado').dataTable();
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

    function ModificarState() {        

      var Estado = document.getElementById("txtEstado").value;
      var Pais = document.getElementById("cmbPais").value;
      var idEstado = document.getElementById("txtIdEstado").value;
      var Estatus = document.getElementById("txtEstatus").value;
      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Estado:Estado,Pais:Pis,idEstado:idEstado,Estatus:Estatus };
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/states',
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
          var table = $('#TablaEstado').dataTable();
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

    function EliminarState() {        

      var Estado = document.getElementById("txtEstado").value;
      var Pais = document.getElementById("cmbPais").value;
      var idEstado = document.getElementById("txtIdEstado").value;
      var Estatus = document.getElementById("txtEstatus").value;
      //Agregamos los datos capturados a un arreglo => arr
      var arr = { Estado:Estado,Pais:Pis,idEstado:idEstado,Estatus:Estatus };
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/states/10',
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
          var table = $('#TablaEstado').dataTable();
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
  message: "¿Esta seguro de guardar este Estado?",
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
  message: "¿Esta seguro de modificar este Estado",
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
        ModificarState();
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
        EliminarState();
      }
          }
      
    }
  
});


     
    }
//============FIN DE LAS FUNCIONES============