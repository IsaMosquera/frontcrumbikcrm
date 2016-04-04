
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
          
          if (data == 1) 
          {
            alert("Usuario No existe")
          }
          else
          {
          alert("Bienvenido");
          window.location.replace("http://127.0.0.1:3002/front/organization");
          }

          alert(data.email);

                    },
        //Si algo falla en el API indica
        error: function() {
          alert("Error al almacenar los datos"); 
                    
           // e.preventDefault();
        }
                  });

    }

   
    



