# Rumbo al PPER

App de estudio, no oficial, para la prueba de conocimiento del certificado de **Patrón Profesional de Embarcaciones de Recreo (PPER)**, con el temario de la Resolución de 11 de junio de 2026 de la Dirección General de la Marina Mercante ([BOE-A-2026-15822](https://www.boe.es/boe/dias/2026/07/20/pdfs/BOE-A-2026-15822.pdf)).

**Abrir la app: https://josehino.github.io/rumbo-pper/**

- Los 19 temas del examen, cada uno con cinco etapas: fichas de lección, verdadero o falso contra el reloj, parejas, cifras clave y examen del tema.
- 89 preguntas oficiales de las convocatorias de abril de 2025, noviembre de 2025 y abril de 2026, publicadas por el [Ministerio de Transportes y Movilidad Sostenible](https://www.transportes.gob.es/marina-mercante/titulaciones/titulos-profesionales-formacion-maritima-documentos-y-guardia-de-la-gente-de-mar/titulaciones-profesionales/examenes-y-pruebas-nacionales), y 218 preguntas de práctica.
- Simulacro de 30 preguntas en 60 minutos, los tres exámenes oficiales completos y repaso espaciado de los fallos.
- Se instala en el móvil y funciona sin conexión. El progreso se guarda en el dispositivo.

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
