# Sosializarte

**Web, automatización e inteligencia artificial para negocios.**

Sosializarte ayuda a negocios y profesionistas a construir una presencia digital útil, simplificar procesos y aplicar IA cuando existe un caso de uso claro. Una página web puede ser el punto de partida y crecer después con formularios, WhatsApp, agenda, integraciones y asistentes.

Sitio: [sosializarte.com](https://sosializarte.com/)

## Qué ofrecemos

- **Páginas web:** presencia profesional, experiencia adaptable a móvil, canales de contacto, SEO técnico básico y analítica.
- **Automatización:** procesos, formularios, citas, WhatsApp e integraciones entre herramientas según el alcance de cada proyecto.
- **Inteligencia artificial:** chatbots y asistentes orientados a tareas concretas, cuando aportan valor al negocio.

No hay precios fijos publicados en el sitio. Cada propuesta se define por objetivos y alcance.

## Cómo trabajamos

Primero entendemos el negocio y la forma en que sus clientes lo contactan. Después proponemos, desarrollamos, **probamos antes de publicar** y acompañamos la evolución acordada. La experiencia de más de 16 años en pruebas de software respalda la atención a navegación, enlaces, formularios, dispositivos, contenido y funcionamiento del recorrido de contacto.

El portafolio de la landing muestra [Solid Maker](https://solidmaker.mx/) y [Chilangos RC](https://chilangosrc.com/) como ejemplos de presencia web y de una web que evolucionó hacia un portal.

## Estructura del sitio

| Ruta | Propósito |
| --- | --- |
| [`/`](https://sosializarte.com/) | Home general: Web, Automatización e IA. |
| [`/paginas-web/`](https://sosializarte.com/paginas-web/) | Landing especializada en páginas web y el proceso de QA. |
| `/privacidad` | Aviso de privacidad. |
| `/sitemap.xml` | Sitemap con la Home y Páginas Web. |

La Home incluye un **demo de agenda de citas**. Su función es mostrar ese caso de uso, no atender como asistente general de ventas de todo el sitio.

## Código y publicación

El sitio es estático y utiliza HTML, CSS y JavaScript. Se publica en **GitHub Pages** con el dominio configurado en `CNAME`.

- Repositorio: [RonaldZunigaAngeles/sosializarte](https://github.com/RonaldZunigaAngeles/sosializarte)
- Rama de producción: `main`
- Home: `index.html`
- Landing web: `paginas-web/index.html`
- Sitemap: `sitemap.xml`

La rama `feature/sosializarte-2.0` se utilizó para desarrollar y revisar la versión 2.0 antes de integrarla a producción. Para futuros cambios conviene partir de la versión actual de `main`.

Para revisar el sitio localmente desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/` y `http://localhost:8000/paginas-web/`. La vista local permite revisar el diseño y la navegación; los servicios externos dependen de la conexión y su configuración.

## Contacto y medición

La Home tiene un formulario de contacto que envía mediante Formspree. El mensaje de éxito aparece cuando el servicio confirma el envío. También hay enlaces a WhatsApp en ambas páginas.

**GoatCounter** mide las visitas a la Home y a Páginas Web. Además, el sitio envía estos eventos:

| Evento | Cuándo se registra |
| --- | --- |
| `contacto-whatsapp-home` | Clic en un enlace de WhatsApp de la Home. |
| `contacto-whatsapp-paginas-web` | Clic en un enlace de WhatsApp de la landing. |
| `contacto-formulario-home` | Formspree confirmó un envío del formulario. |

Los eventos no incluyen nombre, correo, teléfono ni contenido del mensaje. Un clic en WhatsApp representa intención de contacto; no confirma que se haya enviado el mensaje. GA4 y Meta Pixel no están activos mientras no haya identificadores reales.

## SEO y estado de revisión

Ambas páginas tienen título, descripción, URL canónica y permiten indexación. `sitemap.xml` incluye las dos URLs. La Home ya figuraba indexada en Google Search Console; la indexación de `/paginas-web/` se solicitó el **29 de septiembre de 2026** y queda pendiente de confirmación por Google.

Validaciones realizadas: revisión visual y navegación móvil, enlaces y mensajes precargados de WhatsApp, visualización del FAQ, envío exitoso del formulario con recepción del correo y visitas de ambas páginas en GoatCounter.

Pendientes de revisión:

- Confirmar en GoatCounter los eventos de contacto después de acciones reales.
- Revisar los casos de error y validación del formulario.
- Comprobar el estado del sitemap y la indexación de `/paginas-web/` en Search Console.
- Actualizar los datos estructurados de la Home para la oferta actual.
- Revisar la vigencia de cifras, testimonios y compromisos comerciales publicados.

## Mantenimiento

El mantenimiento y las mejoras se acuerdan por proyecto. Pueden incluir actualización de contenido, revisión de enlaces y formularios, soporte de integraciones y nuevas secciones. Las funcionalidades de mayor alcance se evalúan por separado.

## Cuestionarios de proyecto

Los cuatro cuestionarios usan `cuestionarios.js` para navegación, validación y envío:

| Archivo | Uso |
| --- | --- |
| `cuestionario-web.html` | Página nueva: datos de contacto y necesidades del negocio. |
| `cuestionario-rediseno.html` | Mejoras de una web existente; el chatbot es opcional. |
| `cuestionario.html` | Expediente de implementación; preguntas frecuentes e información del asistente pueden completarse después. |
| `cuestionario-overnet.html` | Cuestionario específico de Grupo Overnet. |

### Pruebas y autollenado

El botón **Auto-llenar para pruebas** está oculto en la vista normal. Para habilitarlo, agregar `?modo=pruebas` a cualquiera de las cuatro rutas. Ejemplo: `/cuestionario.html?modo=pruebas`.

El autollenado utiliza datos ficticios. No envía automáticamente: hay que recorrer los pasos y pulsar Enviar. Los envíos en ese modo incluyen `modo_pruebas=si` y un asunto con `[PRUEBA]`. El parámetro controla la interfaz; no es un mecanismo de autenticación.

### Avances y recepción

**Guardar avance** habilita guardado local en ese navegador; **Recuperar avance** restaura campos, casillas, tratamientos y sección. Los borradores de pruebas y de clientes se guardan por separado. No se guardan archivos adjuntos. Solo se elimina el borrador automáticamente cuando Formspree confirma el envío. El cliente también puede eliminar el avance guardado sin borrar lo que está llenando.

Cada solicitud lleva `tipo_cuestionario`, `id_solicitud`, `origen` y `modo_pruebas`. Esto permite organizar una futura integración; todavía no hay conexión automática de estos cuestionarios con Google Sheets.

Validación del cambio del 1 de octubre de 2026: pruebas de DOM con respuestas simuladas del servidor para los cuatro cuestionarios, autollenado oculto por defecto, correo inválido, borradores, chatbot condicional, horarios libres, filas de tratamientos y prevención de doble envío. Queda pendiente confirmar recepción real en Formspree/correo, adjuntos y revisión en un iPhone físico.

