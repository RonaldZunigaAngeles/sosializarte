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

El portafolio de la landing muestra [Solid Maker](https://solidmaker.mx/) y [Chilangos RC](https://chilangosrc.com/) como ejemplos de presencia web y de una web que evolucionó hacia un portal. La Home presenta los resultados de GL Dental, Solid Maker y el caso comercial en operación [En Cabeza Ajena](https://sosializarte.com/casos/en-cabeza-ajena/).

## Estructura del sitio

| Ruta | Propósito |
| --- | --- |
| [`/`](https://sosializarte.com/) | Home general: Web, Automatización e IA. |
| [`/paginas-web/`](https://sosializarte.com/paginas-web/) | Landing especializada en páginas web y el proceso de QA. |
| [`/casos/en-cabeza-ajena/`](https://sosializarte.com/casos/en-cabeza-ajena/) | Caso real en operación: prospección de especialistas, IA, CRM, automatización y métricas con corte fechado. |
| `/privacidad` | Aviso de privacidad. |
| `/sitemap.xml` | Sitemap con la Home y Páginas Web. |

La Home incluye un **demo de agenda de citas**. Su función es mostrar ese caso de uso, no atender como asistente general de ventas de todo el sitio.

## Código y publicación

El sitio es estático y utiliza HTML, CSS y JavaScript. Se publica en **GitHub Pages** con el dominio configurado en `CNAME`.

- Repositorio: [RonaldZunigaAngeles/sosializarte](https://github.com/RonaldZunigaAngeles/sosializarte)
- Rama de producción: `main`
- Home: `index.html`
- Landing web: `paginas-web/index.html`
- Caso ECA: `casos/en-cabeza-ajena/index.html`
- Sitemap: `sitemap.xml`

La rama `feature/sosializarte-2.0` se utilizó para desarrollar y revisar la versión 2.0 antes de integrarla a producción. Para futuros cambios conviene partir de la versión actual de `main`.

Para revisar el sitio localmente desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/`, `http://localhost:8000/paginas-web/` y `http://localhost:8000/casos/en-cabeza-ajena/`. La vista local permite revisar el diseño y la navegación; los servicios externos dependen de la conexión y su configuración.

## Contacto y medición

La Home tiene un formulario de contacto que envía mediante Formspree. El mensaje de éxito aparece cuando el servicio confirma el envío. También hay enlaces a WhatsApp en ambas páginas.

**GoatCounter** mide las visitas a la Home y a Páginas Web. Además, el sitio envía estos eventos:

| Evento | Cuándo se registra |
| --- | --- |
| `contacto-whatsapp-home` | Clic en un enlace de WhatsApp de la Home. |
| `contacto-whatsapp-paginas-web` | Clic en un enlace de WhatsApp de la landing. |
| `contacto-formulario-home` | Formspree confirmó un envío del formulario. |
| `contacto-whatsapp-caso-eca` | Clic al WhatsApp desde la página del caso ECA; no confirma envío de mensaje. |

Los eventos no incluyen nombre, correo, teléfono ni contenido del mensaje. Un clic en WhatsApp representa intención de contacto; no confirma que se haya enviado el mensaje. GA4 y Meta Pixel no están activos mientras no haya identificadores reales.

## SEO y estado de revisión

Ambas páginas tienen título, descripción, URL canónica y permiten indexación. `sitemap.xml` incluye Home, Páginas Web y el caso En Cabeza Ajena. La Home ya figuraba indexada en Google Search Console; la indexación de `/paginas-web/` se solicitó el **29 de septiembre de 2026** y queda pendiente de confirmación por Google.

Validaciones realizadas: revisión visual y navegación móvil, enlaces y mensajes precargados de WhatsApp, visualización del FAQ, envío exitoso del formulario con recepción del correo y visitas de ambas páginas en GoatCounter.

Pendientes de revisión:

- Confirmar en GoatCounter los eventos de contacto después de acciones reales.
- Revisar los casos de error y validación del formulario.
- Comprobar el estado del sitemap y la indexación de `/paginas-web/` en Search Console.
- Actualizar los datos estructurados de la Home para la oferta actual.
- Revisar la vigencia de cifras, testimonios y compromisos comerciales publicados.


## Caso de éxito en operación: En Cabeza Ajena (ECA)

**Publicación web:** 26 de octubre de 2026. **Inicio operativo:** 15 de octubre de 2026. **Corte de indicadores:** 26 de octubre de 2026.

### Objetivo de negocio y alcance

Diseñar un proceso de investigación, prospección y seguimiento de especialistas en salud mental para el proyecto de entrevistas *En Cabeza Ajena*, conducido por Alejandra Carvajal. La colaboración se presenta como **operación activa con resultados preliminares**, no como ventas ya cerradas.

Capacidades implementadas por SOSIALIZARTE:

1. Investigación y selección de especialistas en fuentes profesionales públicas.
2. CRM en Google Sheets para datos de perfil, origen, estatus comercial e historial de contactos y seguimientos.
3. Apoyo de IA para investigar perfiles y redactar invitaciones personalizadas, con revisión humana.
4. Make para procesamiento controlado de campañas de email, integrado al CRM y sujeto a aprobación previa.
5. Seguimiento comercial manual y personalizado: respuestas, dudas, objeciones y coordinación con producción.
6. Medición del avance y optimización mediante contactos, respuestas, negociaciones y cierres confirmados.

### Indicadores iniciales (corte 2026-10-26)

| Métrica | Valor | Base y significado |
| --- | ---: | --- |
| Identificados | 126 | Especialistas incorporados a la base de prospección |
| Contactados | 87 | Contactos registrados con acercamiento comercial |
| Respuestas comerciales | 10 | Contactos con respuesta |
| Tasa de respuesta | 11.5% | 10 / 87 × 100 = 11.494%, redondeado a un decimal |
| En negociación | 4 | Oportunidades activas sin venta cerrada |
| Participaciones pagadas | 0 | Ningún pago confirmado al corte |

Las barras del embudo en la página de detalle se representan con base en 126 identificados; la tasa de respuesta tiene denominador 87 contactos registrados. **No presentar negociaciones, llamadas, fechas propuestas ni promesas de pago como ventas confirmadas.** No publicar ingresos como reales sin evidencia de pago.

### Archivos y cambio funcional

- index.html: añade ECA a la sección Resultados, tarjeta de Casos de éxito, mención en la prueba social y carrusel de texto, y ajusta el CTA general. Mantiene casos y funcionalidades existentes.
- casos/en-cabeza-ajena/index.html: página autónoma y responsiva con contexto, reto, metodología de seis pasos, métricas, embudo, advertencias y CTA comercial.
- sitemap.xml: agrega la nueva ruta canónica indexable y actualiza fecha de modificación de Home.
- README.md: alcance, métricas, reglas de confidencialidad, validación y mantenimiento.
- La nueva página reutiliza la paleta de marca (#FF642E, #F7F4EF, #0d0d0d) y tipografías Bricolage Grotesque y DM Sans. No requiere librerías de JavaScript adicionales.
- GoatCounter mide la página mediante el script existente. El CTA de WhatsApp de la página de detalle utiliza el evento contacto-whatsapp-caso-eca. Un clic no implica que se envió un mensaje.
- El cambio **no modifica** Make, el CRM de Google Sheets, los datos de especialistas, el chatbot ni el formulario de contacto.

### Protección de datos y autorización

- No exponer nombres de especialistas prospectados, teléfonos, correos, domicilios, conversaciones, fechas particulares de negociación ni capturas del CRM.
- No atribuir testimonios a Alejandra ni usar su imagen o logo sin permiso. Lo publicado es descripción del servicio, no una recomendación atribuida.
- Confirmar con la conductora la autorización para utilización comercial pública del nombre del proyecto y futuras menciones o materiales; si hay objeción, retirar o anonimizar el caso.
- Mantener la leyenda **Operación activa · Resultados preliminares** hasta contar con nueva evidencia de resultados confirmados.

### Mantenimiento mensual de métricas

1. Revisar datos consolidados del CRM, duplicados, fecha de cada respuesta y cierres; distinguir primeros contactos de seguimientos.
2. Validar pagos con evidencia autorizada y calcular respuesta = respuestas comerciales / contactos registrados × 100 (redondear un decimal).
3. Actualizar **simultáneamente** cifras y fechas de corte en las dos secciones de index.html y en todos los indicadores, barras, etiquetas y notas de casos/en-cabeza-ajena/index.html.
4. Actualizar esta tabla y el lastmod de las páginas modificadas en sitemap.xml.
5. Comprobar coherencia entre portada, página de detalle y README; no publicar estimaciones o expectativas como hechos.
6. Revisar cambios mediante rama/PR, publicar en main y comprobar que aparecen en GitHub Pages.

### QA y validación de liberación

- Navegación desde Home a ECA, enlace de regreso a Home y CTA WhatsApp con mensaje precargado.
- Verificar sitemap, etiquetas title/description/canonical/robots/OG, semántica de títulos y textos legibles.
- Revisar responsividad a 320, 375, 768 y 1440 píxeles; overflow, contraste, teclado y preferencia de movimiento reducido.
- Verificar tasa (10/87=11.5% redondeado), estados (4 negociaciones y 0 pagados) y fecha de corte en todas las vistas.
- Confirmar que GL Dental, Solid Maker, formularios, menú y medición de la Home no cambian de comportamiento.
- Validar enlace público HTTP 200 después de la fusión a main y el registro real de visitas/clic en GoatCounter. Distinguir pruebas realizadas de revisiones visuales o analíticas pendientes.
- La inclusión en sitemap no garantiza indexación en Google; comprobar Search Console posteriormente.

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

