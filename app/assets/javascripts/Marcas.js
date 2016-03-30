$(document).ready(function() {
     var table = $("#example").DataTable({
        "scrollY":        "200px",
          "scrollX":        "600px",
       //Especificaciones de las Columnas que vienen y deben mostrarse
        "columns" : [
            { data : 'Idn' },
            { data : 'Nombre' },
            { data : 'Descripcion' }
        ],    
       //Especificaciones de la URL del servicio
        "ajax": {
            url: "http://localhost:54114/api/v1/Marcas",
            dataSrc : ''
        }
        
  });  
       //Al Hacer clic en la tabla, obtengo los datos y los cargo a los TextBox
     $('#example tbody').on( 'click', 'tr', function () {
     var Idn = table.row( this ).data().Idn;
     var Nombre = table.row( this ).data().Nombre;
      var Descripcion = table.row( this ).data().Descripcion;
     document.getElementById("txtNombre").value = Nombre;
     document.getElementById("txtDescripcion").value = Descripcion;

  } );
  } );

 // Menu Toggle Script 
      
      $("#menu-toggle").click(function(e) {
          e.preventDefault();
          $("#wrapper").toggleClass("toggled");
      });
   // Funcion que lee el JSON para utilizarlos en Inputs o combobox
 function GetElementos() {
        jQuery.support.cors = true;
        $.ajax({
            url: 'http://localhost:54114/api/v1/Marcas',
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
            alert(data.Descripcion)
        });
            }

 //Al hacer clic en botones llamamos a cualquiera de estas funciones
     function Guardar() {        
                 
          var Nombre = document.getElementById("txtNombre").value;
          
         
         alert("Voy a guardar a " +Nombre + "");
              }

     function Modificar() {        
                 
          var Nombre = document.getElementById("txtNombre").value;
          var Descripcion = document.getElementById("txtDescripcion").value;
         
         alert("Voy a modificar a" + Nombre + Descripcion +"");
              }

    function Eliminar() {        
                 
          var Nombre = document.getElementById("txtNombre").value;
          var Descripcion = document.getElementById("txtDescripcion").value;
         
         alert("Voy a Eliminar a" + Nombre + Descripcion +"");
              }

    function Salir() {        
                 
          var Nombre = document.getElementById("txtNombre").value;
         var Descripcion = document.getElementById("txtDescripcion").value;

         alert("Voy a Salir de la Ventana");
              }