# Entre cuerdas

Asistente personal de guitarra en HTML, CSS y JavaScript, sin instalación ni compilación.

Abre `dist/index.html` en tu navegador. También puedes iniciar una vista local con `python -m http.server 4173 --bind 127.0.0.1 --directory dist` y visitar http://127.0.0.1:4173.

## Uso

- **Explorar el mástil:** pulsa cualquier posición para escucharla; filtra por nota o escala y elige entre Do/Re/Mi y C/D/E.
- **Biblioteca de acordes:** 12 fundamentales y 7 tipos (84 acordes), diagramas de dedos, cejillas y escucha. El capotraste (trastes 1–9) mantiene la forma de los dedos y sube el sonido. El mástil y los diagramas muestran trastes reales. Puedes añadir el acorde a tu secuencia conservando su capotraste.
- **Progresiones:** explora ocho patrones con explicaciones, grados y dos referencias de canciones por patrón. Seleccionar una tarjeta solo cambia el detalle; «Practicar esta progresión» carga el patrón simplificado en tu secuencia. Añade, elimina y reordena acordes. Cada uno tiene de 1 a 32 pulsos. El tempo (30–220 BPM) determina los segundos indicados junto a cada acorde. Incluye bucle, metrónomo y sonido de acordes independientes.

La secuencia y los ajustes del reproductor se guardan en este navegador cuando el almacenamiento local está disponible. No se sincronizan entre dispositivos ni entre la dirección local y una dirección publicada. Cambiar de sección detiene el reproductor; cambiar de pestaña lo pausa. Puedes reproducir con la barra espaciadora cuando el foco no está en un control.

Afinación estándar E2 A2 D3 G3 B3 E4. El mástil se muestra con la primera cuerda (Mi agudo) arriba; los diagramas de acordes, con la sexta cuerda a la izquierda. El sonido se sintetiza mediante Web Audio; no requiere micrófono ni archivos de audio. Do7 utiliza una posición habitual sin quinta. Las fuentes de Google son opcionales: sin conexión se usan las del sistema.

## Archivos

- `dist/music.js`: notas, escalas, ortografía musical y posiciones.
- `dist/audio.js`: síntesis de cuerda pulsada y metrónomo.
- `dist/app.js`: estado, controles y secuenciador.
- `dist/progressions.js`: catálogo de patrones y fuentes de canciones.
- `dist/library.js`: biblioteca y carga de patrones.
- `dist/fretboard.js`: mástil, diagramas y visualización del capotraste.
- `dist/styles.css`: diseño adaptable y accesibilidad de foco.

La integración WebMCP opcional permite configurar una progresión; se detecta automáticamente si el navegador la soporta.

## Comprobaciones y versiones

Ejecuta `node --test tests/music.test.cjs` desde esta carpeta. Incluye las 84 posiciones, transposición con capotraste, nombres de escalas y validación del catálogo.

El repositorio Git está en la carpeta superior `Guitar`. La etiqueta `v1-inicial` conserva la primera versión anterior a esta iteración.
