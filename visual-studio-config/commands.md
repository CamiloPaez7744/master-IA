# Mejores Atajos de Teclado para VS Code (Perfil Desarrollador)

Esta lista incluye los atajos más útiles basados en la configuración actual y las extensiones instaladas en tu perfil `Node.code-profile`.

## 🔧 Configuración Personalizada (Detectada en tu perfil)

Estos atajos han sido configurados explícitamente en tu archivo de perfil:

| Atajo                           | Acción                        | Descripción                                                             |
| ------------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `Alt` + `Numpad 7`              | **Trigger Inline Suggestion** | Fuerza la aparición de sugerencias en línea (útil para Copilot/Gemini). |
| `Ctrl` + `Shift` + `*` (Numpad) | **Gemini Code Assist**        | Abre el asistente de Gemini en el editor.                               |

> **Nota:** Se ha desactivado `Ctrl` + `I` para Gemini, probablemente para evitar conflictos con el Inline Chat de Copilot.

## 🚀 Esenciales para Desarrolladores

### General

| Atajo                  | Acción                                                 |
| ---------------------- | ------------------------------------------------------ |
| `Ctrl` + `Shift` + `P` | **Paleta de Comandos** (Acceso a todo).                |
| `Ctrl` + `P`           | **Quick Open** (Abrir archivo por nombre rápidamente). |
| `Ctrl` + `Shift` + `N` | Nueva ventana de VS Code.                              |
| `Ctrl` + `,`           | Abrir Configuración.                                   |
| `Ctrl` + `` ` ``       | Mostrar/Ocultar Terminal integrado.                    |
| `Ctrl` + `B`           | Mostrar/Ocultar Barra Lateral.                         |

### Edición y Código

| Atajo                       | Acción                                                                            |
| --------------------------- | --------------------------------------------------------------------------------- |
| `Alt` + `↑` / `↓`           | **Mover línea** arriba/abajo.                                                     |
| `Shift` + `Alt` + `↑` / `↓` | **Copiar línea** arriba/abajo.                                                    |
| `Ctrl` + `D`                | **Selección múltiple** (selecciona la siguiente ocurrencia de la palabra actual). |
| `Ctrl` + `Shift` + `L`      | Seleccionar **todas** las ocurrencias de la palabra actual.                       |
| `Ctrl` + `/`                | Comentar/Descomentar línea.                                                       |
| `Shift` + `Alt` + `A`       | Comentar/Descomentar bloque.                                                      |
| `Shift` + `Alt` + `F`       | **Formatear documento** (Usará Prettier según tu config).                         |
| `F2`                        | **Renombrar símbolo** (Refactorización segura en todo el proyecto).               |
| `Ctrl` + `.`                | **Quick Fix** (Acciones rápidas / correcciones de código).                        |

### Navegación

| Atajo                  | Acción                                                      |
| ---------------------- | ----------------------------------------------------------- |
| `F12`                  | **Ir a la definición**.                                     |
| `Alt` + `F12`          | **Peek Definition** (Ver definición sin salir del archivo). |
| `Shift` + `F12`        | **Ver referencias** (Dónde se usa este símbolo).            |
| `Ctrl` + `Shift` + `O` | **Ir a Símbolo** en el archivo actual (@).                  |
| `Ctrl` + `T`           | **Ir a Símbolo** en todo el workspace (#).                  |
| `Alt` + `←` / `→`      | Navegar atrás/adelante en el historial de cursor.           |
| `Ctrl` + `G`           | Ir a línea específica.                                      |

## 🧩 Extensiones Instaladas

### GitHub Copilot

_Nota: Copilot suele sugerir automáticamente, pero puedes controlar su comportamiento._
| Atajo | Acción |
|-------|--------|
| `Tab` | Aceptar sugerencia (Ghost text). |
| `Ctrl` + `Enter` | Abrir panel de sugerencias de Copilot (10 soluciones). |
| `Ctrl` + `I` | **Inline Chat** (Preguntar a Copilot sobre el código seleccionado). |

### GitLens & Git Graph

| Atajo                       | Acción                                                            |
| --------------------------- | ----------------------------------------------------------------- |
| `Ctrl` + `Shift` + `G`, `G` | Abrir vista de Control de Código Fuente (Git).                    |
| (Desde Paleta)              | Escribe `Git Graph: View Git Graph` para ver el historial visual. |

### Otras Extensiones Útiles

- **Paste JSON as Code**: Usa `Ctrl` + `Shift` + `P` y busca `Paste JSON as Code` para generar tipos automáticamente.
- **Error Lens**: Muestra errores en línea. Usa `F8` para saltar al siguiente error/advertencia.
- **Console Ninja**: Muestra logs directamente en el editor junto al código que los genera.

## 💡 Tips Pro

1.  **Multi-cursor con ratón**: Mantén presionado `Alt` y haz clic en diferentes lugares para escribir en múltiples sitios a la vez.
2.  **Column Selection**: Mantén `Shift` + `Alt` y arrastra el ratón para seleccionar un bloque rectangular de texto.
3.  **Zen Mode**: `Ctrl` + `K`, `Z` para modo sin distracciones.
