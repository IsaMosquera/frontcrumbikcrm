
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


    //Guardar elementos en DataBase
     function Enviar() {        
      //Capturar datos del formulario
      var nombre = document.getElementById("txtNombre").value;
      var email =  document.getElementById("txtEmail").value;
      var contrasena =  document.getElementById("txtPassword").value;
      var contrasena1 = document.getElementById("txtPassword1").value;
      //var Estatus = 1;
      if (contrasena != contrasena1) {
                  alert("Contraseñas NO coinciden")
                }
else
{
      //Agregamos los datos capturados a un arreglo => arr
      var data = {name:nombre,email:email,password:contrasena};
      var user = {user:data}
      //Evento ajax para enviar los datos
      $.ajax({
         
        //Ruta para enviar el servicio
        url: 'http://127.0.0.1:3000/register',
        type: 'POST',
        //Enviamos el arreglo ar
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        async: false,
        //Si todo funciona bien entra al sucess
        success: function(data) {
          if (data == 1) 
          {
            //alert("GUARDANDO");
            window.location.replace("http://127.0.0.1:3002/front/organization");
          }
          else
          {
          alert("Ya este usuario existe");
          
          }
                    },
        //Si algo falla en el API indica
        error: function() {
          alert("Error al almacenar los datos"); 
          
          
           // e.preventDefault();
        }
                  });
    }

    }

