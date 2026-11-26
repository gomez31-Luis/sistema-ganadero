# Sistema Ganadero

Aplicación web para la gestión integral de un rancho ganadero, desarrollada con **Spring Boot** y **MongoDB**.

## Funcionalidades principales

* **Autenticación y seguridad**: inicio de sesión con Spring Security, contraseñas encriptadas con BCrypt, opción de *Recordarme* y cierre automático de sesión por inactividad.
* **Recuperación de contraseña**: envío de enlace temporal por correo electrónico (SMTP) mediante tokens con expiración de 1 hora.
* **Gestión de ganado**: registro individual de animales, consulta general y seguimiento de becerros, con soporte para carga de imágenes.
* **Control reproductivo y partos**: registro y consulta de eventos reproductivos y partos.
* **Registro de toros**: control de compra de toros.
* **Administración de usuarios y perfil**: alta, listado, eliminación y edición de perfil de usuario.

## Requisitos

* **Java 25**
* **MongoDB** ejecutándose localmente en `mongodb://localhost:27017` (base de datos `sistema_ganadero`)
* **Maven Wrapper** incluido en el proyecto (`mvnw` / `mvnw.cmd`)

## Variables de entorno

Antes de ejecutar la aplicación (especialmente para el envío de correos de recuperación y la firma de cookies *Recordarme*), configura las siguientes variables de entorno (puedes guiarte con `.env.example`):

| Variable | Descripción |
| :--- | :--- |
| `MAIL_USERNAME` | Correo electrónico usado para enviar mensajes SMTP (Gmail). |
| `MAIL_PASSWORD` | Contraseña de aplicación de Gmail para SMTP. |
| `REMEMBER_ME_KEY` | Clave secreta para firmar las cookies de sesión *Recordarme*. |

Ejemplo en PowerShell:

```powershell
$env:MAIL_USERNAME="tu-correo@gmail.com"
$env:MAIL_PASSWORD="tu-app-password"
$env:REMEMBER_ME_KEY="una-clave-secreta-segura"
```

## Ejecución

### En Windows
Puedes usar el script incluido:
```powershell
.\Iniciar_Sistema.bat
```
O ejecutar directamente con Maven Wrapper:
```powershell
.\mvnw.cmd spring-boot:run
```

### En Linux / macOS
```bash
./mvnw spring-boot:run
```

Una vez iniciado, abre en el navegador:
```text
http://localhost:8085
```

## Pruebas

```powershell
.\mvnw.cmd test
```

## Tecnologías

* **Java 25** & **Spring Boot 4.0.6** (WebMVC, Security, Data MongoDB, Mail)
* **MongoDB**
* **HTML, CSS y JavaScript** (interfaz estática en `src/main/resources/static`)
