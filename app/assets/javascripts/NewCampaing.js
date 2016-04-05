//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {

//Cargar DataTable
CargarTabla();

//Cargar Combos

cargarComboTipoCliente();
cargarComboOperador();
cargarComboActividad();
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
                            var newItem = {advertcampain:items[0].data};
                           

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/advertcampains",
                               
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
                           var newItem = {advertcampain:items[0].data};

                            $.ajax({
                                type: "PUT",
                                url: "http://localhost:3000/api/v1/advertcampains/" + newItem.advertcampain.id ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                          var newItem = {advertcampain:items[0].data};
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/advertcampains/"  + newItem.advertcampain.id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id : { path: "id", type: String },
                        name: { path: "name", type: String },
                        startdate: { path: "startdate", type: Date },
                        enddate: { path: "enddate", type: Date },
                        description: { path: "description", type: String },
                        customertype_id: { path: "customertype.description", type: String },
                        startage: { path: "startage", type: Number },
                        endage: { path: "endage", type: Number },
                        sex: { path: "sex", type: String },
                        image: { path: "image", type: String },
                        activitietype_id: { path: "activitietype.name", type: String },
                        operator: { path: "operator", type: String },

      //Evento ajax para enviar los datos
                        
                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Código" },
                { field: "name", title: "Nombre de la campaña" },
                { field: "startdate", title: "Fecha de Inicio"},
                { field: "enddate", title:  "Fecha de finalizacion"},
                { field: "description", title: "Tipo de Camapaña Publicitaria" },
                { field: "customertype_id", title: "Tipo de Cliente" },
                { field: "startage", title: "Edad Inicial" },
                { field: "endage", title: "Edad Final" },
                { field: "sex", title: "Orientada al Sexo" },
                { field: "image", title: "Imagen" },
                { field: "activitietype_id", title: "Tipo de Actividad" },
                {
                    width: 150,
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
                            caption: "Twittear",
                            click: function (e) {
                                var grid = this;
                                $.ajax({
                                    type: "GET",
                                    url: "http://127.0.0.1:3000/api/v1/advertcampains"
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

      var Nombre = document.getElementById("txtNombre").value;
      var FechaInicio = document.getElementById("txtFechaInicio").value;
      var FechaFinal = document.getElementById('txtFechaFinal').value;
      var Descripcion= document.getElementById('txtDescripcion').value;
      var TipoCliente= document.getElementById('cmbTipoCliente').value;
      var EdadInicio= document.getElementById('txtEdadInicio').value;
      var EdadFinal= document.getElementById('txtEdadFinal').value;
      var Sexo= document.getElementById('cmbSexo').value;
      var Flayer= document.getElementById('txtFlayer').value;
      var TipoActividad= document.getElementById('cmbActividad').value;
      var Operador = document.getElementById("cmbOperador").value;
      
      //Agregamos los datos capturados a un arreglo => arr
         var advertcampain = { name:Nombre,startdate:FechaInicio,enddate:FechaFinal,description:Descripcion, 
                     customertype:TipoCliente,startage:EdadInicio,endage:EdadFinal,sex:Sexo, image:Flayer,
                     operator:Operador,activitietype:TipoActividad};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/advertcampains',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(advertcampain),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Almacenados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
         // var table = $('#TablaCampaing').dataTable();
                      // Example call to reload from original file
                    //  table.fnReloadAjax();
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

     var idCampana = document.getElementById('txtId').value;
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
      var Operador = document.getElementById("cmbOperador").value;
 
      
      //Agregamos los datos capturados a un arreglo => arr
         var arr = { idCampana:id,name:Nombre,startdate:FechaInicio,enddate:FechaFinal,description:Descripcion, 
                     customertype:TipoCliente,startage:EdadInicio,endage:EdadFinal,sex:Sexo, image:Flayer,
                     operator:Operador,activitietype:TipoActividad};
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
      
      var idCampana = document.getElementById('txtId').value;
      var estatus= 0;
      
      //Agregamos los datos capturados a un arreglo => arr
         var arr = { idCampana:id,status:Estatus};
      //Evento ajax para enviar los datos
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'localhost:3000/api/v1/advertcampains/+id',
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
        GuardarCampaing();
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
            url: 'http://localhost:3000/api/v1/advertcampains',
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


      //===================Cargar Combobox

 function cargarComboTipoCliente()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/customertypes',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].description + "</option>";

                }
                $("#cmbTipoCliente").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 


 function cargarComboOperador()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/operators',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].name +" " + data[i].last_name + "</option>";

                }
                $("#cmbOperador").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 

 function cargarComboActividad()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/activitietypes',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].name + "</option>";

                }
                $("#cmbActividad").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 
