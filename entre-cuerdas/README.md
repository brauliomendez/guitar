# Entre cuerdas

Asistente personal de guitarra en HTML, CSS y JavaScript, sin instalación ni compilación.

Abre `dist/index.html` en tu navegador. También puedes iniciar una vista local con `python -m http.server 4173 --bind 127.0.0.1 --directory dist` y visitar http://127.0.0.1:4173.

## Uso

- **Explorar el mástil:** pulsa cualquier posición para escucharla; filtra por nota o escala y elige entre Do/Re/Mi y C/D/E.
- **Biblioteca de acordes:** 12 fundamentales y 8 tipos (96 acordes), diagramas de dedos, cejillas y escucha. Elige la nota base debajo del mástil y el tipo de acorde en su familia. El capotraste (trastes 1–9) mantiene la forma de los dedos y sube el sonido. El mástil y los diagramas muestran trastes reales. Puedes añadir el acorde a tu secuencia conservando su capotraste.
- **Alternativas con capotraste:** desde «Alternativas con capo» o debajo de la familia de acordes, compara formas que conservan el acorde que suena. Por ejemplo, Fa mayor puede tocarse con forma de Mi y capo 1; Si menor, con forma de La menor y capo 2. Se muestran tres propuestas y se pueden desplegar las otras seis. La clasificación es orientativa: evita cejillas y pondera dedos, extensión y altura del capo. «Escuchar» permite comparar sin cambiar la selección; «Usar esta forma» actualiza forma y capo juntos. El acorde seleccionado se guarda al recargar. El registro y la distribución de notas pueden variar; para una canción, el capo debe mantenerse en un mismo traste y adaptarse toda la progresión.
- **Identificar acorde:** en la Biblioteca, cambia a «Identificar acorde» y marca una posición por cuerda. Vuelve a pulsarla para quitarla. Las cuerdas no seleccionadas quedan silenciadas. El panel muestra acordes identificados, inversiones según la nota más grave y lecturas alternativas. Reconoce tríadas, séptimas comunes, sextas, sus2/sus4 y add9; también reconoce séptimas dominantes, menores y mayores sin quinta, indicando la nota omitida (por ejemplo, Do7 `x32310` sin Sol). Prioriza las coincidencias completas. Otras combinaciones incompletas o más complejas pueden no coincidir. Puedes escuchar la posición y abrir una forma habitual de los tipos de la biblioteca. Este modo usa trastes reales sin capotraste.
- **Progresiones:** explora ocho patrones con explicaciones, grados y dos canciones por patrón con búsquedas de Google por título, artista y acordes. Seleccionar una tarjeta solo cambia el detalle; «Practicar esta progresión» carga el patrón simplificado en tu secuencia. Añade, elimina y reordena acordes. Cada uno tiene de 1 a 32 pulsos. El tempo (30–220 BPM) determina los segundos indicados junto a cada acorde. Incluye bucle, metrónomo y sonido de acordes independientes.

- **Secuencia por grados:** elige «Por grados» en «Tu secuencia», una tonalidad y la escala mayor o menor natural. Pulsa los grados diatónicos para componer un borrador, o escribe `VI-I-iv`. En Do mayor esto produce La mayor, Do mayor y Fa menor: las mayúsculas indican mayor, las minúsculas menor y ° disminuido. La raíz de cada grado se calcula desde la escala seleccionada. Admite séptimas (`V7`, `ii7`, `Imaj7`), sus2/sus4 y alteraciones (`♭VII`, `#iv`). La vista previa no cambia la secuencia hasta pulsar «Usar patrón en secuencia», que la sustituye con cuatro pulsos por acorde y sin capo. Después puedes editar cada grado, duración y orden. Cambiar de tonalidad transporta los pasos con grado; los acordes libres quedan intactos. Cambiar manualmente un acorde o su capo en «Por acordes» lo convierte en libre.

La secuencia y los ajustes del reproductor se guardan en este navegador cuando el almacenamiento local está disponible. No se sincronizan entre dispositivos ni entre la dirección local y una dirección publicada. Cambiar de sección detiene el reproductor; cambiar de pestaña lo pausa. Puedes reproducir con la barra espaciadora cuando el foco no está en un control. Pulsa la cabecera «▷ ACORDE» de una tarjeta (o una zona libre de la tarjeta) para saltar a ese acorde: si está sonando, reinicia su primer pulso y continúa desde ahí; si está en pausa, conserva la pausa.

Afinación estándar E2 A2 D3 G3 B3 E4. El mástil se muestra de frente para una guitarra diestra, con la sexta cuerda (Mi grave) arriba y la pala a la derecha; los diagramas de acordes, con la sexta cuerda a la izquierda. El sonido se sintetiza mediante Web Audio; no requiere micrófono ni archivos de audio. Do7 utiliza una posición habitual sin quinta. Las fuentes de Google son opcionales: sin conexión se usan las del sistema.

## Archivos

- `dist/music.js`: notas, escalas, ortografía musical y posiciones.
- `dist/theory.js`: identificación de acordes y conversión de grados.
- `dist/workshop.js`: interfaz del identificador y constructor por grados.
- `dist/audio.js`: síntesis de cuerda pulsada y metrónomo.
- `dist/app.js`: estado, controles y secuenciador.
- `dist/progressions.js`: catálogo de patrones y fuentes de canciones.
- `dist/library.js`: biblioteca y carga de patrones.
- `dist/fretboard.js`: mástil, diagramas y visualización del capotraste.
- `dist/styles.css`: diseño adaptable y accesibilidad de foco.

La integración WebMCP opcional permite configurar una progresión; se detecta automáticamente si el navegador la soporta.

## Comprobaciones y versiones

Ejecuta `node --test tests/*.test.cjs` desde esta carpeta. Incluye las 96 posiciones, transposición con capotraste, nombres de escalas, validación del catálogo, identificación e inversiones, y grados diatónicos en las doce tonalidades.

El repositorio Git está en la carpeta superior `Guitar`. La etiqueta `v1-inicial` conserva la primera versión anterior a esta iteración.

## Prueba visual: mástil clásico

El diseño de la rama `experiment/mastil-clasico`, integrado en `master`, incorpora un diapasón de madera oscura, trastes metálicos, cejuela clara y pala ranurada con clavijas. Usa CSS y SVG propios, sin dependencias 3D ni recursos de imágenes externos. Las tres cuerdas graves tienen acabado entorchado y las agudas, acabado de nailon. La separación de trastes sigue una progresión decreciente, limitada por el tamaño mínimo de los controles. En pantallas estrechas y vistas de 15/24 trastes se conserva el desplazamiento horizontal. Las notas, capotraste, identificación y reproducción utilizan los mismos controles y datos musicales.
