# Piloto SOS · Previews personalizados

**Estado:** rama de pruebas `feature/previews-sos-piloto`. No altera el sitio productivo, los 15 correos de ECA, los 5 de SOS ni el escenario de Make.

## Arquitectura
- **Una página:** `/p/index.html` y scripts en el mismo directorio.
- **Una sola pestaña de datos:** `Previews` añadida al Google Sheets maestro SOSIALIZARTE — Control de prospectos, `gid=2061104001`.
- **Sin backend:** leer solo el CSV publicado de **esa pestaña**, por medio de HTTPS.
- **Sin envío desde la web:** el botón solo abre WhatsApp del proveedor.
- **Sin alterar datos existentes:** no se insertaron ni movieron columnas o filas de las pestañas operativas. El enlace en "Cola de envío" se incorporará solo tras el QA y una validación de Make en ejecución de prueba.

## Demos disponibles en rama de pruebas
- `?demo=inmobiliaria`
- `?demo=consultorio`
- `?demo=servicio_tecnico`
- `?demo=despacho`
- `?demo=restaurante`
- `?demo=generico`

Todos los demos usan negocios ficticios y no diagnostican a una empresa real.

## Estructura de la pestaña Previews
A ID prospecto | B Clave preview | C Empresa | D Giro | E Hallazgo título | F Hallazgo detalle | G-I Antes 1-3 | J-L Después 1-3 | M Estado | N Validado por | O Fecha validación | P URL preview (fórmula).
- Valores de Estado: `borrador`, `listo`, `pausado`.
- Para generar URL visible: ID, clave, `estado=listo` y `validado por` no vacío.
- La clave debe contener entre 6 y 60 caracteres ASCII alfanuméricos o guiones, debe ser única y NO debe basarse solo en el ID. No usar fórmulas aleatorias volátiles.
- En cada registro incluir solo hallazgos sustentados por datos verificables. No se permite información personal, interna, confidencial ni métricas sin soporte.

## Publicación de datos (manual y bajo aprobación)
1. Revisar todas las celdas de Previews y confirmar que no contienen información sensible.
2. En Google Sheets, **Archivo → Compartir → Publicar en la web**.
3. Seleccionar exclusivamente la pestaña **Previews** (no "Todo el documento") y formato CSV.
4. Revisar "Contenido publicado y configuración": solo Previews debe aparecer publicada. **No compartir el archivo maestro como "Cualquiera con el enlace"**.
5. Construir o copiar la URL pública CSV con `gid=2061104001&single=true&output=csv` y pegarla en `p/config.js`.
6. Probar en navegador incógnito con una clave `estado=listo`. No dar por supuesto que el fetch público funciona hasta comprobarlo en móvil y escritorio.
7. La publicación de una pestaña hace que **todos sus registros** sean públicos en el CSV, aunque los enlaces tengan claves difíciles de adivinar. No utilizar la clave como secreto.

Google advierte que una hoja publicada es accesible públicamente y puede tardar unos minutos en reflejar cambios. Si se detecta información sensible o un error de publicación, dejar el config vacío y detener publicación.

## Integración con la cola (pendiente QA + autorización de producción)
La columna `Cuerpo` en `Cola de envío` (columna F) ya contiene el mensaje completo. El motor de preparación deberá ubicar al destinatario por `ID prospecto`, verificar que se trata de SOS segunda vuelta, que esté elegible y autorizado, y agregar al final una sola línea:
`Preparé una demostración conceptual para su negocio: https://sosializarte.com/p/?c=CLAVE`

No modificar Make ni regenerar, reenviar o sobrescribir mensajes que ya estén Enviados, Preparados para envío, En proceso o en revisión. Los cinco SOS deben tener preview validado; si falta, no enviar ni completar cupo con prospectos nuevos. Los 15 ECA permanecen intactos.

## Pruebas mínimas
- [ ] Cinco demos de giro cargan con encabezados y chat correctos.
- [ ] Responsivo móvil (360 px), tablet y escritorio.
- [ ] Sin `?c`, clave desconocida, estado borrador o clave duplicada: no se muestra propuesta.
- [ ] Contenido con comillas, coma, acentos y saltos de línea: lectura CSV correcta.
- [ ] No se inyecta HTML: todos los datos externos van a `textContent`.
- [ ] No filtrar empresas, datos de correos ni teléfonos de CRM en la pestaña pública.
- [ ] Botón abre mensaje a WhatsApp SOSIALIZARTE, sin conexión ficticia a sistemas del prospecto.
- [ ] GoatCounter mide eventos sin interpretar clic como venta.
- [ ] Envío de prueba a cuenta propia: cuerpo correcto, sin duplicados, sin cambios en filtros Make.
- [ ] Registrar estado de pilotaje y tomar decisión después de 10 días hábiles.

**Importante:** este piloto no está listo para envío en producción hasta publicar datos, probar lectura real, y validar mapeo Make.
