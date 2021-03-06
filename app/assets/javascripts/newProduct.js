//=======INICIO DE DOCUMENT READY==============

 //EVENTO CUANDO CARGA TODO EL DOCUMENTO
   $(document).ready(function() {
alert('Entrando');
CargarTabla();
//cARGAR COMBOBOX
cargarComboOrganizacion();

//Validar documento, configurar
 $("#form").validate({
  
    rules: {
        
        Nombre: "required",
        Descripcion: "required",     
        Cantidad: "required",
        Precio: "required",  
        FotoProducto: "required", 

    },
    messages: {
        
        Nombre: "Debes escribir un nombre",
        Descripcion: "Debes escribir una Descripcion",
        Cantidad: "Debes escribir una cantidad",
        Precio: "Debes escribir un precio",   
        FotoProducto: "Debe seleccionar una imagen para el Producto",
 
        

        
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
var table = $("#TablaNewProduct").shieldGrid({
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
                        url: "http://localhost:3000/api/v1/products",
                        dataType: "json"
                    },
                    modify: {
                        create: function (items, success, error) {
                            var newItem = {product:items[0].data};
                           

                            $.ajax({
                                type: "POST",
                                url: "http://localhost:3000/api/v1/products",
                               
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
                           var newItem = {product:items[0].data};

                            $.ajax({
                                type: "PUT",
                                url: "http://localhost:3000/api/v1/products/" + newItem.product.id ,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(items[0].data)
                            }).then(success, error);
                        },
                        remove: function (items, success, error) {
                          var newItem = {product:items[0].data};
                            $.ajax({
                                type: "DELETE",
                                url: "http://localhost:3000/api/v1/products/"  + newItem.product.id
                            }).then(success, error);
                        }
                    }
                },
                schema: {
                    fields: {
                        id: { path: "id", type: Number },
                        name: { path: "name", type: String },
                        description: { path: "desccription", type: String },
                        image: { path: "image", type: String },
                        quantity: { path: "quantity", type: Number },
                        organization_id: { path: "organization.name", type: String},
                        price: { path: "price", type: Number },
                    }
                }
            },
            sorting: true,
            rowHover: false,
            columns: [
                { field: "id", title: "Id"},
                { field: "name", title: "Nombre del Producto"},
                { field: "description", title: "Descripcion" },
                { field: "image", title: "Imagen del Producto" },                
                { field: "quantity", title: "Cantidad" },                
                { field: "organization_id", title: "Organizacion" },                
                { field: "price", title: "Precio" },
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
                                    url: "http://localhost:3000/api/v1/products"
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
        url: 'http://localhost:3000/api/v1/products',
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
              alert(data.idProducto),
              alert(data.Nombre)
              alert(data.Descripcion)
              alert(data.Cantidad)
              alert(data.Precio)
              alert(data.FotoProducto)
              alert(data.Organizacion)
            });
    }

    //Guardar elementos en DataBase
     function GuardarFuncion() {        
      //Capturar datos del formulario
      var Nombre = document.getElementById("txtNombre").value;
      var Descripcion = document.getElementById("txtDescripcion").value;
      var Cantidad = document.getElementById("txtCantidad").value;
      var Precio = document.getElementById("txtPrecio").value;
      var FotoProducto = document.getElementById("txtFotoProducto").value;
      var Organizacion = document.getElementById("cmbOrganizacion").value;

      
      //Agregamos los datos capturados a un arreglo => arr
      var product = {name:Nombre,description:Descripcion, image:FotoProducto, quantity:Cantidad,
                  organizacion:Organizacion, price:Precio};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/products',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(product),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(msg) {
          bootbox.alert("Datos Almacenados", function() {
          
          });
           // e.preventDefault();
          //Actualiza la datatable automáticamente
          var table = $('#TablaNewProduct').dataTable();
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

      var idProducto = document.getElementById("txtIdProducto").value;
      var Nombre = document.getElementById("txtNombre").value;
      var Descripcion = document.getElementById("txtDescripcion").value;
      var Cantidad = document.getElementById("txtCantidad").value;
      var Precio = document.getElementById("txtPrecio").value;
      var FotoProducto = document.getElementById("txtFotoProducto").value;
      var Organizacion = document.getElementById("cmbOrganizacion").value;
      
      //Agregamos los datos capturados a un arreglo => arr
      var arr = { id:idProducto, name:Nombre,description:Descripcion, image:FotoProducto, quantity:Cantidad,
                  organizacion:Organizacion, price:Precio};
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/products',
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
          var table = $('#TablaNewProduct').dataTable();
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

      var idProducto = document.getElementById("txtIdProducto").value;
      var Estatus = 0;
      
      //Agregamos los datos capturados a un arreglo => arr
      var arr = { id:idProducto, status:Estatus};
      
      //Evento ajax para enviar los datos
      $.ajax({
        //Ruta para enviar el servicio
        url: 'http://localhost:3000/api/v1/products/+id',
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
          var table = $('#TablaNewProduct').dataTable();
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
  message: "¿Esta seguro de guardar este Producto?",
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
  message: "¿Esta seguro de modificar esto?",
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
  message: "¿Esta seguro de Eliminar este Producto?",
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

    
//CARGAR COMBOBOX


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