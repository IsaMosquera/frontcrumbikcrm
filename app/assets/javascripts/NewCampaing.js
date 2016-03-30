//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {

//Cargar DataTable
CargarTabla();
//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        Nombre: "required",
        FechaInicio: "required",
        FechaFinal: "required",
        TipoCliente: "required",
        Descripcion: "required",
        EdadInicio: "required",
        EdadFinal: "required",
        Sexo: "required",
        Operador: "required",
        TipoActividad: "required", 
        Flayer: "required",
    },
    messages: {
  
        Nombre: "debe escribir un nombre",
        FechaInicio: "debe seleccionar una fecha de inicio",
        FechaFinal: "debe seleccionar una fecha de culminación",
        TipoCliente: "debe seleccionar el tipo de cliente",
        Descripcion: "debe escribir una descripción sobre esta campaña",
        EdadInicio: "debe indicar la edad inicial del usuario que puede observar la campaña",
        EdadFinal: "debe indicar la edad final del usuario que puede observar la campaña",
        Sexo: "debe indicar el sexo al cual va dirijido la campaña",
        Operador: "debe seleccionar a un Operador",
        TipoActividad: "debe seleccionar el tipo de actividad", 
        Flayer: "debe seleccionar una imagen para la campaña",        
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
var table = $("#TablaCampaing").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/advertcampains",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = items[0];
                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/advertcampains",
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
                                url: "http://localhost:3000/api/v1/advertcampains" + items[0].data.Id,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/advertcampains" + items[0].data.Id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        name: { path: "name", type: String },
                        startdate: { path: "startdate", type: Date },
                        enddate: { path: "enddate", type: Date },
                        description: { path: "description", type: String },
                        customertypes_id: { path: "customertypes_id", type: String },
                        startage: { path: "startage", type: Number },
                        endage: { path: "endage", type: Number },
                        sex: { path: "sex", type: String },
                        image: { path: "image", type: String },
                        activitietypes_id: { path: "activitietypes_id", type: String },
                        operators_id: { path: "operators_id", type: String },
                        
                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "name", title: "Nombre de la campaña" },
                { field: "startdate", title: "Fecha de Inicio"},
                { field: "enddate", title:  "Fecha de finalizacion"},
                { field: "description", title: "Tipo de Camapaña Publicitaria" },
                { field: "customertypes_id", title: "Clientes Tipo" },
                { field: "startage", title: "Edad Inicial" },
                { field: "endage", title: "Edad Final" },
                { field: "sex", title: "Orientada al Sexo" },
                { field: "image", title: "Imagen" },
                { field: "activitietypes_id", title: "Actividad" },
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
                                    url: "http://localhost:3000/api/v1/advertcampains"
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
        url: 'http://localhost:3000/api/v1/advertcampains',
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
              alert(data.id),
              alert(data.Nombre)
              alert(data.FechaInicio)
              alert(data.FechaFinal)
              alert(data.Descripcion)
              alert(data.TipoCliente)
              alert(data.EdadInicio)
              alert(data.EdadFinal)
              alert(data.Sexo)
              alert(data.Operador)
              alert(data.Flayer)
              alert(data.TipoActividad)

            });
    }

    //Guardar elementos en DataBase
     function GuardarCampaing() {        
      //Capturar datos del formulario
      var id = document.getElementById('txtId').value;
      var Nombre = document.getElementById("txtNombre").value;
      var FechaInicio = document.getElementById("txtFechaInicio").value;
      var FechaFinal = document.getElementById('txtFechaFinal').value;
      var Descripcion= document.getElementById('txtDescripcion').value;
      var TipoCliente= document.getElementById('cmbTipoCliente').value;
      var EdadInicio= document.getElementById('txtEdadIinicio').value;
      var EdadFinal= document.getElementById('txtEdadFinal').value;
      var Sexo= document.getElementById('cmbSexo').value;
      var Flayer= document.getElementById('txtFlayer').value;
      var TipoActividad= document.getElementById('cmbTipoActividad').value;
      var estatus= 1;
      
      //Agregamos los datos capturados a un arreglo => arr
         var arr = { id:id, Nombre:Nombre,FechaInicio:FechaInicio,FechaFinal:FechaFinal,Descripcion:Descripcion, 
                     TipoCliente:TipoCliente,EdadInicio:EdadInicio,EdadFinal:EdadFinal,Sexo:Sexo, Flayer:Flayer,
                     TipoActividad:TipoActividad,Estatus:Estatus};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/advertcampains',
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
          var table = $('#TablaCampaing').dataTable();
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

    function ModificarCampaingn() {   

      var id = document.getElementById('txtId').value;
      var Nombre = document.getElementById("txtNombre").value;
      var FechaInicio = document.getElementById("txtFechaInicio").value;
      var FechaFinal = document.getElementById('txtFechaFinal').value;
      var Descripcion= document.getElementById('txtDescripcion').value;
      var TipoCliente= document.getElementById('cmbTipoCliente').value;
      var EdadInicio= document.getElementById('txtEdadIinicio').value;
      var EdadFinal= document.getElementById('txtEdadFinal').value;
      var Sexo= document.getElementById('cmbSexo').value;
      var Flayer= document.getElementById('txtFlayer').value;
      var TipoActividad= document.getElementById('cmbTipoActividad').value;
      var estatus= 1;
      
      //Agregamos los datos capturados a un arreglo => arr
         var arr = { id:id, Nombre:Nombre,FechaInicio:FechaInicio,FechaFinal:FechaFinal,Descripcion:Descripcion, 
                     TipoCliente:TipoCliente,EdadInicio:EdadInicio,EdadFinal:EdadFinal,Sexo:Sexo, Flayer:Flayer,
                     TipoActividad:TipoActividad,Estatus:Estatus};
      //Evento ajax para enviar los datos
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/advertcampains',
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
          var table = $('#TablaCampaing').dataTable();
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

    function EliminarCampaing() {      
      
      var id = document.getElementById('txtId').value;
      var Nombre = document.getElementById("txtNombre").value;
      var FechaInicio = document.getElementById("txtFechaInicio").value;
      var FechaFinal = document.getElementById('txtFechaFinal').value;
      var Descripcion= document.getElementById('txtDescripcion').value;
      var TipoCliente= document.getElementById('cmbTipoCliente').value;
      var EdadInicio= document.getElementById('txtEdadIinicio').value;
      var EdadFinal= document.getElementById('txtEdadFinal').value;
      var Sexo= document.getElementById('cmbSexo').value;
      var Flayer= document.getElementById('txtFlayer').value;
      var TipoActividad= document.getElementById('cmbTipoActividad').value;
      var estatus= 0;
      
      //Agregamos los datos capturados a un arreglo => arr
     var arr = { id:id, Nombre:Nombre,FechaInicio:FechaInicio,FechaFinal:FechaFinal,Descripcion:Descripcion, 
                 TipoCliente:TipoCliente,EdadInicio:EdadInicio,EdadFinal:EdadFinal,Sexo:Sexo, Flayer:Flayer,
                 TipoActividad:TipoActividad,Estatus:Estatus};
      //Evento ajax para enviar los datos
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:5414/api/v1/campaings',
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
          var table = $('#TablaCampaing').dataTable();
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
  message: "¿Esta seguro de modificar esta campaña?",
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
  message: "¿Esta seguro de Eliminar esta campaña?",
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
        EliminarCampaing();
      }
          }
      
    }
  
});
     
    }
//============FIN DE LAS FUNCIONES============

    function cargarcomboRoles()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:5414/api/v1/Roles',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].Idn+"'>" + data[i].Nombre + "</option>";

                }
                $("#cmbRol").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      }