<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Iniciar sesion con tus datos</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>


<form class="formulario" method="POST" action="/">
    <div class="campo">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            placeholder="Tu Email"
            name="email"
            value="correo.correo@correo.com"
            
        />
    </div>
    <div class="campo">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            placeholder="Tu Password"
            name="password"
            value="123456"
        />
    </div>
    <input type="submit" class="boton" value="Iniciar sesion">
</form>

<div class="acciones">
    <a href="/crear-cuenta">¿Aun no tienes cuenta? Crear una</a>
    <a href="/olvide">¿Olvidaste tu password?</a>
</div>