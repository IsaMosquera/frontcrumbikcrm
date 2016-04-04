
//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {
//Cargar DataTable
CargarTabla();

//Cargar combobox
cargarComboTipoRol();
cargarComboMenuPadre();
//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        Menu: "required",
        TipoRol: "required",
        HREF: "required",
        Padre: "required",
    },
    messages: {
        Menu: "Debe escribir para la opcion del menu",
        TipoRol: "Debe selecconar al rol que pertenece",
        HREF: "Debe escribir una direccion HREF",
        Padre: "Debe seleccionar opcion Padre",      
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
var table = $("#TablaMenu").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/menus",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = {arbol:items[0].data};
                           

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/menus",
                               
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
                           var newItem = {menu:items[0].data};

                            $.ajax({
                                type: "PUT",
                                url: "http://localhost:3000/api/v1/menus/" + newItem.arbol.id ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                          var newItem = {arbol:items[0].data};
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/menus/"  + newItem.arbol.id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        tipo: { path: "tipo.name", type: String },
                        text: { path: "text", type: String },
                        href: { path: "href", type: String},
                        padre_id: { path: "padre_id", type: Number},
                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Codigo", width: "120px" },
                { field: "tipo", title: "Rol", width: "80px" },
                { field: "text", title: "Nombre de la Opcion del Menú", width: "80px" },
                { field: "href", title: "Dirección HREF", width: "80px" },
                { field: "padre_id", title: "Nodo Padre", width: "80px" },
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
                                    url: "http://localhost:3000/api/menus"
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
        url: 'http://localhost:3000/api/v1/menus',
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
              alert(data.IdMenu),
              alert(data.Menu)
              alert(data.TipoRol)
              alert(data.HREF)
              alert(data.Padre)
            });
    }

    //Guardar elementos en DataBase
     function GuardarOpcionMenu() {        
      //Capturar datos del formulario
      var Menu = document.getElementById("txtMenu").value;
      var TipoRol = document.getElementById("cmbTipoRol").value;
      var HREF = document.getElementById("txtHref").value;
      var Padre = document.getElementById("cmbMenuPadre").value;
      
      //Agregamos los datos capturados a un arreglo => arr
      var arbol = {tipo:TipoRol,text:Mneu, href:HREF,padre_id:Padre};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/menus',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(arbol),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Almacenados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaMenu').dataTable();
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

    function ModificarOpcionMenu() {        

      var Menu = document.getElementById("txtMenu").value;
      var TipoRol = document.getElementById("cmbTipoRol").value;
      var HREF = document.getElementById("txtHref").value;
      var Padre = document.getElementById("cmbMenuPadre").value;
      
      //Agregamos los datos capturados a un arreglo => arr
      var arbol = {id:txtIdMenu,tipo:TipoRol,text:Mneu, href:HREF,padre_id:Padre};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/menus',
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
          var table = $('#TablaMenu').dataTable();
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

    function EliminarOpcionMenu() {        

      //Agregamos los datos capturados a un arreglo => arr
      var arbol = {id:txtIdMenu};
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/menus/+id',
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
          var table = $('#TablaMenu').dataTable();
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
  message: "¿Esta seguro de guardar esta nueva opcion?",
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
        GuardarOpcionMenu();
      }
          }
      
    }
  
});
     
    }

      function ConfirmModificar() {     
     bootbox.dialog({
  message: "¿Esta seguro de modificar esta opcion del menu",
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
        ModificarOpcionMenu();
      }
          }
      
    }
  
});
     
    }

     function ConfirmEliminar() {     
     bootbox.dialog({
  message: "¿Esta seguro de Eliminar esta opcion del menu?",
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
        EliminarOpcionMenu();
      }
          }
      
    }
  
});

    
    }

    //CARGAR COMBOS

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

  function cargarComboMenuPadre()
    {
       jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:3000/api/v1/menus',
            type: 'GET',
            dataType: 'json',            
            success: function (data) {                


               var listItems="";

                for (var i=0; i< data.length; i++)
                {
                  listItems+="<option value='" + data[i].id+"'>" + data[i].text + "</option>";

                }
                $("#cmbMenuPadre").html(listItems);
            },
            error: function (x, y, z) {
                alert(x + '\n' + y + '\n' + z);
            }
        }); 
      } 
//============FIN DE LAS FUNCIONES============