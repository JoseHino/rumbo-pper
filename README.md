# Rumbo al PPER

App de estudio, no oficial, para la prueba de conocimiento del certificado de **Patrón Profesional de Embarcaciones de Recreo (PPER)**, con el temario de la Resolución de 11 de junio de 2026 de la Dirección General de la Marina Mercante ([BOE-A-2026-15822](https://www.boe.es/boe/dias/2026/07/20/pdfs/BOE-A-2026-15822.pdf)).

**Abrir la app: https://pper.rumboalexamen.es/**

- Los 19 temas del examen, cada uno con cinco etapas: fichas de lección, verdadero o falso contra el reloj, parejas, cifras clave y examen del tema.
- 445 preguntas oficiales de 15 convocatorias (de octubre de 2017 a noviembre de 2026), publicadas por el [Ministerio de Transportes y Movilidad Sostenible](https://www.transportes.gob.es/marina-mercante/titulaciones/titulos-profesionales-formacion-maritima-documentos-y-guardia-de-la-gente-de-mar/titulaciones-profesionales/examenes-y-pruebas-nacionales) con su plantilla oficial de respuestas, y 218 preguntas de práctica. Las 326 anteriores a 2025 se han revisado contra la normativa vigente: las que preguntan normas derogadas o cambiadas llevan un aviso visible (rojo si la respuesta puede no valer hoy, ámbar si la norma cambió pero la respuesta sigue valiendo y gris si ya no está en el temario de 2026).
- Sección «Claves»: el examen pregunta a pregunta (desde 2019 cada número cae siempre en la misma norma), los datos que más se repiten en las convocatorias, las preguntas oficiales que ya han salido más de una vez y prácticas solo con ellas.
- Simulacro de 30 preguntas en 60 minutos, los 15 exámenes oficiales completos y repaso espaciado de los fallos.
- Para entrar hay que crear una cuenta gratuita con verificación del correo (código de 6 cifras). El progreso se guarda en la cuenta y se sincroniza entre dispositivos.
- Se instala en el móvil y funciona sin conexión una vez iniciada la sesión.

Los contenidos están redactados a partir de la normativa vigente publicada en el BOE a 7 de octubre de 2026. Ante cualquier duda, manda el BOE.

## Instalar en el móvil

- **iPhone (Safari):** botón Compartir y «Añadir a pantalla de inicio».
- **Android (Chrome):** menú ⋮ e «Instalar aplicación».

## Actualizar el contenido

Cada tema está en `fuente/content` (un archivo por tema) y el código de la app en `fuente/app`. Para regenerar `index.html` con Node.js, desde la raíz del repositorio:

```
node fuente/scripts/build_data.js fuente fuente/app_data.json
node fuente/scripts/build_app.js fuente - index.html
```
