# Copilot Instructions

Este proyecto usa un flujo Spec-Driven Development.

## Objetivo

Antes de implementar cambios, definir una especificacion clara y verificable.

## Flujo obligatorio

1. Leer primero este archivo y el estado actual del workspace antes de editar.
2. Aclarar requerimientos y restricciones del usuario.
3. Revisar el archivo o superficie concreta involucrada y verificar el estado real del proyecto.
4. Si la tarea depende de ejecucion, comprobar si el servidor de desarrollo o los tests ya estan corriendo.
5. Escribir una especificacion corta (alcance, criterios de aceptacion, fuera de alcance).
6. Confirmar riesgos y supuestos.
7. Implementar en cambios pequenos y trazables.
8. Ejecutar validaciones (build/tests/lint) si existen.
9. Entregar resumen con:
   - Cambios hechos
   - Evidencia de validacion
   - Riesgos pendientes

## Reglas de implementacion

- No cambiar APIs publicas sin justificarlo.
- Evitar refactors grandes fuera del alcance.
- Preferir cambios minimos y reversibles.
- Si faltan datos para una decision critica, preguntar antes de asumir.
- Si el usuario pide pruebas reales de Supabase, usar datos reales y evitar mocks salvo que el usuario los pida explicitamente.
- Si el usuario pide un flujo de UI con shadcn, reutilizar los componentes disponibles y mantener el flujo en una sola pagina con modales/dialogs cuando sea posible.

## Formato de spec recomendado

- Contexto
- Problema
- Objetivo
- No objetivo
- Criterios de aceptacion
- Plan tecnico
- Validacion
- Riesgos
