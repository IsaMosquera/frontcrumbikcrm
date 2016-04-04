
   $(document).ready(function() {

 
//Eventos en botones de el formulario
$('#Enviar').on("click",function(e) {
  // your stuff}
  
    e.preventDefault();
    Enviar();

    //ConfirmGuardar();
  
}); 



   
  });
    //=========== FIN DEL DOCUMENT READY================



   
    //Guardar elementos en DataBase
     function Enviar() {        
      //Capturar datos del formulario

      var email =  document.getElementById("txtemail").value;
      var contrasena =  document.getElementById("txtpassword").value;
      //var Estatus = 1;


      //Agregamos los datos capturados a un arreglo => arr
      var arr = {email:email,password:contrasena};

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
<<<<<<< HEAD
          
          if (data == 1) 
          {
            alert("Usuario No existe")
          }
          else
          {
          alert("Bienvenido");
          window.location.replace("http://127.0.0.1:3002/front/organization");
          }
=======
          alert(data.email);
<<<<<<< HEAD
           // e.preventDefault();
=======
         
>>>>>>> cae8c23cd55bbecdfe540e41a30c9841d5cbd4d5
>>>>>>> be9d9f0fbe77f0ec907c942c4d75ba40f44ef319
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

   
    



