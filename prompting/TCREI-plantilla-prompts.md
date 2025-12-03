# Guía y plantilla TCREI para crear buenos prompts

Esta guía está diseñada para ayudar a redactar prompts eficientes y repetibles para herramientas de IA generativa usando el marco TCREI (Task, Context, References, Evaluate, Iterate). Está en español y contiene reglas prácticas, una plantilla lista para usar, ejemplos y una breve rúbrica de evaluación.

---

## Resumen del marco TCREI

- **Task (Tarea):** Define claramente qué quieres que haga la IA. Incluye el formato de salida, restricciones y criterios de éxito.
- **Context (Contexto):** Proporciona información de fondo relevante que la IA necesita para entender el propósito y las limitaciones del resultado.
- **References (Referencias):** Añade ejemplos, enlaces, o fragmentos de texto que muestren el estilo, el tono o el contenido deseado.
- **Evaluate (Evaluar):** Define cómo vas a juzgar la calidad de la salida (puntos de verificación, métricas, criterios de exactitud y relevancia).
- **Iterate (Iterar):** Describe el proceso para refinar el prompt usando la evaluación: qué cambiar, cómo probar y cuándo aceptar el resultado.

---

## Principios generales

- Sé explícito y específico en la sección de Task. Evita ambigüedades.
- Mantén el Context relevante y lo más breve posible: suficiente para entender, no para abrumar.
- Usa References cuando quieras controlar estilo, formato o incluir restricciones técnicas.
- Diseña criterios de Evaluate accionables (listas de comprobación, ejemplos de salida correcta/incorrecta).
- Planea iteraciones pequeñas y con cambios controlados: modifica una cosa por iteración.

---

## Detalle ampliado: Especificar la tarea, Contexto, Referencias, Evaluación e Iteración

Esta sección desarrolla en mayor detalle buenas prácticas y ejemplos concretos para cada componente del marco TCREI. Si ya tienes partes cubiertas en la plantilla principal, usa esto para complementar y enriquecer las instrucciones.

- Especificar la tarea (por qué y qué pedir)

  - La elaboración de un buen aviso comienza con la descripción de la tarea en la que desea que la herramienta le ayude. La tarea es la base de cualquier solicitud: es lo que pide que haga la IA. Sea directo: "Escribe una lista", "Redacta un discurso", "Genera una imagen".
  - Incluya la persona/rol y el formato de salida en la instrucción inicial para reducir ambigüedades:
    - Especificar un personaje: p. ej. "Eres un crítico de cine especializado en cine italiano" o "Actúa como un analista financiero senior".
    - Especificar un formato: p. ej. "Devuélvelo como una tabla Markdown con columnas: título, año, género, resumen (100 palabras)" o "JSON con campos: title, authors, date, summary".
  - Ejemplo completo de tarea con persona y formato:
    - Mensaje: "Eres un crítico de cine especializado en cine italiano. Elabore una tabla que contenga las mejores películas italianas de la década de 1970 y sepárelas en géneros como thrillers, dramas y comedias. Proporcione un resumen de 100 palabras de cada película, así como detalles sobre la producción, incluido el director y el año de estreno."

- Incluir el contexto necesario

  - Cuanto más relevante sea el contexto, mejor será la respuesta. Proporcione objetivos, audiencia, propósito de la tarea y cualquier antecedente o intentos previos.
  - Evite saturar con datos irrelevantes: el contexto debe ser suficiente y pertinente.
  - Ejemplo: en vez de preguntar "¿Cómo se descubrió el ADN?", escriba:
    - "Eres un experto en ciencias que está desarrollando un nuevo plan de estudios en una universidad local. Cuénteme en un par de párrafos atractivos cómo se descubrió el ADN y qué tipo de impacto tuvo en el mundo. Escríbalo de forma que lo entiendan personas no familiarizadas con la ciencia. Los alumnos te han dicho que este curso les parecía árido e ininteligible, así que debes asegurarte de que la explicación capte su atención y cause una buena primera impresión." 

- Proporcionar referencias (cómo y por qué)

  - Las referencias guían tono, estilo y contenido. Pueden ser fragmentos de texto, ejemplos de producto, imágenes o enlaces.
  - Etiquete y estructure las referencias para que la IA entienda cómo usarlas. Buenas prácticas:
    - Use frases de transición: "Consulte estos materiales" o "Utilice los siguientes ejemplos".
    - Use títulos o encabezados para cada referencia cuando haya varias.
    - Para entradas complejas, envuelva referencias con etiquetas estilo XML para marcar inicio y fin. Ejemplo:
      <ejemplo01>
      Texto de ejemplo aquí...
      </ejemplo01>
    - Use etiquetas Markdown (negritas, cursivas) para indicar formato que debe conservarse.
  - No necesita docenas de referencias: 2 a 5 bien escogidas suelen ser suficientes.

- Evaluar resultados (qué comprobar antes de usar salida generada)

  - Evalúe criticidad, exactitud, sesgos y coherencia. Los modelos pueden variar entre ejecuciones.
  - Compruebe:
    - Exactitud factual: validar datos sensibles con fuentes confiables.
    - Formato y parseabilidad: p. ej. JSON válido, fechas en ISO.
    - Adecuación de tono y audiencia.
    - Ausencia de contenido prohibido o inventado (hallucinations).
  - Use una lista de comprobación simple (sí/no) y, si procede, métricas numéricas (0–1) para calibrar mejoras.

- Iterar (ABI — Always Be Iterating)

  - Si la primera salida no cumple, iterar: cambiar una sola cosa por iteración (p. ej. reforzar formato, añadir referencia, ajustar tono).
  - ABI: siempre itere hasta que la salida cumpla criterios. Mantenga un registro de prompts y salidas para auditoría.
  - Plan de iteración sugerido:
    1. Ejecutar y evaluar con la lista de comprobación.
    2. Si fallo de formato, reescribir la instrucción de formato y pedir verificación ("Responde solo con JSON válido").
    3. Si fallo factual, añadir referencias o pedir fuentes.
    4. Re-ejecutar y comparar con la iteración previa.
    5. Límite práctico: 3–5 iteraciones menores antes de reconsiderar la estrategia (dividir la tarea en subtareas, cambiar modelo o herramienta).

---

## Ejemplos

## Plantilla TCREI (lista para copiar)

1) Task (Tarea) — Qué debe hacer la IA

- Objetivo principal: [Describe en una frase clara el objetivo]
- Formato de salida: [por ejemplo: 'JSON con campos: title, summary, tags']
- Extensión: [p.ej. número aproximado de palabras, o límites de caracteres]
- Restricciones: [p.ej. 'no inventar fechas', 'usar lenguaje técnico moderado']
- Criterios de éxito inmediatos (mínimos):
  - [Criterio 1]
  - [Criterio 2]

2) Context (Contexto) — Información de fondo

- Audiencia objetivo: [quién usará la salida]
- Contexto operativo: [p.ej. 'esta salida alimentará un boletín semanal']
- Suposiciones: [p.ej. 'usuario conoce terminología X']
- Información que NO debe considerarse:
  - [p.ej. 'No usar información posterior a 2023-01-01']

3) References (Referencias) — Ejemplos y recursos

- Ejemplo(s) de salida deseada: (incluir 1–3 ejemplos)
  - Ejemplo correcto 1: [pequeño fragmento o JSON válido]
  - Ejemplo incorrecto 1: [qué evitar]
- Enlaces / documentación / guías de estilo: [URLs o títulos]

4) Evaluate (Evaluación) — Cómo evaluar la salida

- Lista de comprobación (sí/no):
  - ¿La salida cumple el formato requerido? [sí/no]
  - ¿Es precisa la información clave? [sí/no]
  - ¿Se ajusta al tono y estilo? [sí/no]
  - ¿No incluye información prohibida? [sí/no]
- Métricas opcionales: precisión factual (0–1), grado de adherencia al estilo (0–1), claridad (0–1)
- Ejemplos de fallo crítico (descartar salida):
  - Contiene datos inventados sensibles
  - Rompe el formato estructurado requerido

5) Iterate (Iterar) — Plan de refinamiento

- Plan de iteración (pasos):
  1. Ejecutar prompt inicial y anotar fallos según "Evaluate".
  2. Ajustar: si el fallo es de formato, reforzar la instrucción de formato; si es factual, añadir referencias; si es estilo, incluir ejemplos adicionales.
  3. Reprobar con la misma evaluación.
  4. Repetir hasta alcanzar criterios de éxito o 5 iteraciones.
- Registro de cambios por iteración: guardar prompt anterior y salida asociada (útil para auditoría).

---

## Ejemplos

Ejemplo 1 — Generar resumen para boletín

Task:
- Objetivo: Resumir un artículo técnico en 5–7 viñetas de máximo 20 palabras cada una.
- Salida: Lista de viñetas en texto plano.

Context:
- Audiencia: Ingenieros de software con experiencia en ML.

References:
- Ejemplo correcto:
  - "- Modelo X reduce latencia en un 30% mediante..."

Evaluate:
- ¿5–7 viñetas? ¿Máx 20 palabras c/u? ¿Tono técnico? ¿Sin aseveraciones no citadas?

Iterate:
- Si las viñetas son demasiado largas, enfatizar límite de palabras y pedir 'contar palabras'.

Ejemplo 2 — Salida JSON estructurada

Task:
- Objetivo: Extraer metadatos de un artículo y devolver JSON con: title, authors[], date, summary.
- Salida: JSON estrictamente validado.

Context:
- Uso: alimenta un pipeline ETL para catálogo de contenidos.

References:
- Ejemplo correcto:
  - {"title":"...","authors":["A. Pérez"],"date":"2024-05-10","summary":"..."}

Evaluate:
- JSON válido (parseable), campos presentes, fecha en ISO, summary ≤ 200 caracteres.

Iterate:
- Si fecha no está en ISO, pedir conversión explícita: "Convierte la fecha a ISO 8601 (YYYY-MM-DD)".

---

## Rúbrica breve de evaluación (0–3)

- 3 — Excelente: cumple todos los criterios, formato correcto, datos relevantes y estilo apropiado.
- 2 — Bueno: pequeños ajustes necesarios (longitud, tono), sin errores críticos.
- 1 — Deficiente: faltan elementos importantes o formato incorrecto, requiere re-work sustancial.
- 0 — Inaceptable: errores críticos (datos inventados, seguridad, formato roto).

---

## Checklist rápida antes de ejecutar el prompt

- [ ] ¿La Task es clara y medible?
- [ ] ¿El Context aporta la información mínima necesaria?
- [ ] ¿Hay al menos 1 Reference (ejemplo o guía de estilo)?
- [ ] ¿Hay criterios de Evaluate definidos?
- [ ] ¿Se definió un plan de Iterate (número máximo de iteraciones o criterio de parada)?

---

## Consejos prácticos y anti-patrones

- Consejo: Empieza con un prompt corto y amplíalo según los fallos.
- Consejo: Cuando trabajes con datos sensibles, añade instrucciones explícitas de no inventar ni extrapolar.
- Anti-patrón: Pedir simultáneamente demasiadas transformaciones (p. ej. "resumir, traducir, clasificar y validar" en un solo paso). Divide en subtareas.
- Anti-patrón: Dar un contexto excesivamente largo e irrelevante — puede confundir al modelo.

---

## Registro mínimo por iteración (ejemplo de plantilla de registro)

- Iteración: 1
- Prompt usado: "[texto del prompt]"
- Salida: "[primeros 100–300 caracteres]"
- Evaluación: Rúbrica y lista de comprobación (detallar fallos)
- Acción siguiente: [p.ej. 'Ajustar formato a JSON y pedir fecha en ISO']

---

## Conclusión

El marco TCREI ayuda a convertir la creación de prompts en un proceso sistemático y reproducible: definir la tarea con precisión, ofrecer el contexto necesario, dar ejemplos claros, evaluar con criterios accionables y refinar mediante iteraciones pequeñas y documentadas.

Usa esta plantilla como punto de partida y adáptala al flujo de trabajo de tu equipo. Guarda cada iteración para crear una biblioteca de prompts robusta y auditables.

---

Archivo generado por: Plantilla TCREI
