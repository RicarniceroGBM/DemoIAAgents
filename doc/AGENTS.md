# Instrucciones para editar esta documentación

- Escribe en español y documenta el comportamiento real de la rama actual. Distingue las funciones implementadas de las aspiraciones futuras.
- Antes de describir un contrato, cifra, ruta o comportamiento, verifícalo en el código y en las pruebas. Cita rutas relativas a la raíz del repositorio para que otro agente pueda encontrar la fuente de verdad.
- Mantén esta guía y sus temas en `doc/`. La aplicación no los importa ni los copia a `dist/`; no traslades los documentos a `public/`, `src/`, recursos estáticos ni otro directorio publicado.
- No añadas datos reales de clientes, credenciales, claves, evidencia confidencial ni recomendaciones financieras reales.
- Si cambias navegación, persistencia, contenido, cálculos, pantallas o seguridad, actualiza el tema correspondiente y `doc/README.md` si cambia el índice o el mapa.
- No declares una decisión autorizada, una operación, una validación regulatoria o un análisis de IA como funcional si solo existe un fixture o diálogo.
- Para crear o modificar estas reglas, conserva separado lo que se expone a una aplicación web de lo que solo está disponible en el repositorio y los entornos de desarrollo.

## Fuentes de verdad

1. Implementación de `src/`.
2. Contratos y fixtures de `src/types.ts` y `src/data/demo.ts`.
3. Aserciones en `tests/`.
4. Esta documentación técnica.
5. [README de ejecución](../README.md).
