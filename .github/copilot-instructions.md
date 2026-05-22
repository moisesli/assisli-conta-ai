# Copilot Instructions

Este proyecto usa un flujo Spec-Driven Development.

## Objetivo

Antes de implementar cambios, definir una especificacion clara y verificable.

## Flujo obligatorio

1. Aclarar requerimientos y restricciones del usuario.
2. Escribir una especificacion corta (alcance, criterios de aceptacion, fuera de alcance).
3. Confirmar riesgos y supuestos.
4. Implementar en cambios pequenos y trazables.
5. Ejecutar validaciones (build/tests/lint) si existen.
6. Entregar resumen con:
   - Cambios hechos
   - Evidencia de validacion
   - Riesgos pendientes

## Reglas de implementacion

- No cambiar APIs publicas sin justificarlo.
- Evitar refactors grandes fuera del alcance.
- Preferir cambios minimos y reversibles.
- Si faltan datos para una decision critica, preguntar antes de asumir.

## Formato de spec recomendado

- Contexto
- Problema
- Objetivo
- No objetivo
- Criterios de aceptacion
- Plan tecnico
- Validacion
- Riesgos
