# Prompts para Arquitecto de Software

Este documento contiene prompts predefinidos y contexto para que el agente AI actúe como un **Arquitecto de Software**, facilitando solicitudes concretas y resultados precisos en el desarrollo del proyecto.

---

## 🎯 Contexto del Agente

Actúa como un Arquitecto de Software senior con experiencia en:
- Clean Architecture y principios SOLID
- TypeScript/Node.js con ESM
- Patrones de diseño (Repository, Service, Factory, Strategy, etc.)
- Testing con Vitest y TDD
- Análisis de trade-offs arquitectónicos
- Documentación técnica clara y concisa

**Directrices generales:**
- Prioriza la separación de responsabilidades
- Propón soluciones escalables y mantenibles
- Justifica decisiones arquitectónicas con pros/contras
- Incluye ejemplos de código concretos
- Menciona implicaciones de testing
- Considera la evolución futura del código

---

## 📋 Prompts Predefinidos

### 1. Análisis Arquitectónico

```
Analiza la arquitectura actual del proyecto en clean-architecture/ y:
1. Identifica las capas existentes (domain, application, infrastructure, composition, shared)
2. Verifica que se respeten las dependencias entre capas
3. Detecta violaciones de Clean Architecture o SOLID
4. Sugiere mejoras específicas con ejemplos de código
5. Documenta el flujo de datos entre capas con un diagrama textual
```

### 2. Diseño de Nueva Funcionalidad

```
Diseña la arquitectura para [DESCRIPCIÓN DE LA FUNCIONALIDAD] siguiendo estos pasos:
1. Define las entidades de dominio necesarias (domain/)
2. Especifica los casos de uso/servicios de aplicación (application/)
3. Diseña los repositorios e infraestructura (infrastructure/)
4. Crea el punto de composición/inyección de dependencias (composition/)
5. Proporciona código TypeScript completo para cada capa
6. Incluye tests unitarios para los casos de uso principales
7. Documenta las decisiones arquitectónicas tomadas

Restricciones:
- TypeScript estricto (strict: true, noUncheckedIndexedAccess: true)
- ESM puro (module: nodenext)
- Tests con Vitest usando aliases (@domain, @application, etc.)
```

### 3. Refactorización Arquitectónica

```
Refactoriza [ARCHIVO/MÓDULO] para mejorar su arquitectura:
1. Identifica code smells y violaciones de principios
2. Propón una estructura mejorada con separación de responsabilidades
3. Muestra el código antes/después con comentarios explicativos
4. Actualiza tests afectados
5. Lista los beneficios de la refactorización
6. Menciona posibles riesgos o trade-offs
```

### 4. Implementación de Patrón de Diseño

```
Implementa el patrón [NOMBRE_PATRÓN] para [CONTEXTO_ESPECÍFICO]:
1. Explica por qué este patrón es adecuado para el problema
2. Diseña las interfaces/abstracciones necesarias
3. Implementa el patrón completo en TypeScript
4. Proporciona ejemplos de uso
5. Escribe tests que demuestren el patrón funcionando
6. Documenta cuándo usar y cuándo evitar este patrón

Patrones comunes: Repository, Factory, Strategy, Observer, Dependency Injection, Builder, Adapter
```

### 5. Diseño de API/Contrato

```
Diseña el contrato/API para [SERVICIO/MÓDULO]:
1. Define interfaces TypeScript con tipos completos
2. Especifica parámetros de entrada y salidas esperadas
3. Documenta casos de error y excepciones
4. Proporciona ejemplos de uso del contrato
5. Considera versionado y retrocompatibilidad
6. Incluye validaciones y tipos de guard cuando aplique
```

### 6. Estrategia de Testing

```
Define la estrategia de testing para [COMPONENTE]:
1. Identifica qué debe testearse (unidad, integración, e2e)
2. Diseña mocks/stubs para dependencias externas
3. Escribe tests de ejemplo para casos críticos
4. Configura fixtures y test data builders
5. Documenta convenciones de naming de tests
6. Establece métricas de cobertura objetivo
```

### 7. Análisis de Dependencias

```
Analiza las dependencias del módulo [NOMBRE_MÓDULO]:
1. Dibuja un diagrama de dependencias (textual)
2. Identifica dependencias circulares
3. Detecta acoplamiento excesivo
4. Propón inversión de dependencias donde aplique
5. Sugiere abstracciones para reducir acoplamiento
6. Verifica cumplimiento del Principio de Inversión de Dependencias
```

### 8. Documentación Arquitectónica

```
Documenta la arquitectura de [MÓDULO/SISTEMA]:
1. Propósito y responsabilidades
2. Diagrama de componentes (textual/ASCII)
3. Flujos de datos principales
4. Decisiones arquitectónicas (ADRs)
5. Dependencias externas e internas
6. Puntos de extensión y configuración
7. Ejemplos de uso comunes
```

### 9. Code Review Arquitectónico

```
Realiza un code review arquitectónico de [ARCHIVO/PR]:
1. Verifica adherencia a Clean Architecture
2. Revisa cumplimiento de SOLID
3. Evalúa naming y claridad del código
4. Detecta duplicación o lógica que debe extraerse
5. Revisa manejo de errores y edge cases
6. Sugiere mejoras concretas con ejemplos
7. Prioriza feedback (crítico, importante, sugerencia)
```

### 10. Migración/Evolución

```
Planifica la migración de [COMPONENTE_ACTUAL] a [NUEVA_ARQUITECTURA]:
1. Analiza el estado actual (as-is)
2. Define el estado objetivo (to-be)
3. Diseña pasos incrementales de migración
4. Identifica riesgos y estrategias de mitigación
5. Propón un plan de rollback
6. Establece criterios de éxito
7. Estima esfuerzo y complejidad
```

---

## 🛠️ Comandos de Referencia Rápida

```bash
# Navegar al proyecto
cd clean-architecture

# Instalar dependencias
npm install

# Ejecutar tests
npm run test

# Ejecutar tests en modo watch
npm run test -- --watch

# Ejecutar aplicación en desarrollo
npm run dev

# Verificar tipos TypeScript
npx tsc --noEmit

# Ejecutar un test específico
npm run test -- tests/shared/health.spec.ts
```

---

## 📐 Estructura de Capas (Clean Architecture)

```
clean-architecture/
├── src/
│   ├── domain/           # Entidades, reglas de negocio puras
│   ├── application/      # Casos de uso, servicios de aplicación
│   ├── infrastructure/   # Implementaciones (repos, APIs, DB)
│   ├── composition/      # Inyección de dependencias, wiring
│   └── shared/          # Utilidades compartidas
├── tests/               # Tests espejando estructura de src/
└── main.ts             # Entry point
```

**Reglas de dependencia:**
- `domain/` no depende de nada
- `application/` depende solo de `domain/`
- `infrastructure/` depende de `domain/` y `application/`
- `composition/` orquesta todas las capas

---

## 🎨 Plantillas de Código

### Entidad de Dominio
```typescript
// src/domain/entities/User.ts
export type UserId = string;

export interface User {
  id: UserId;
  email: string;
  name: string;
  createdAt: Date;
}

export const createUser = (
  id: UserId,
  email: string,
  name: string
): User => {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  return {
    id,
    email,
    name,
    createdAt: new Date(),
  };
};
```

### Caso de Uso (Application)
```typescript
// src/application/usecases/GetUserUseCase.ts
import type { User, UserId } from '@domain/entities/User';
import type { UserRepository } from '@domain/repositories/UserRepository';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: UserId): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    return user;
  }
}
```

### Repositorio (Infrastructure)
```typescript
// src/infrastructure/repositories/InMemoryUserRepository.ts
import type { User, UserId } from '@domain/entities/User';
import type { UserRepository } from '@domain/repositories/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<UserId, User> = new Map();

  async findById(id: UserId): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}
```

### Test Unitario
```typescript
// tests/application/usecases/GetUserUseCase.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserUseCase } from '@application/usecases/GetUserUseCase';
import { InMemoryUserRepository } from '@infrastructure/repositories/InMemoryUserRepository';
import { createUser } from '@domain/entities/User';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new GetUserUseCase(repository);
  });

  it('should return user when exists', async () => {
    const user = createUser('1', 'test@example.com', 'Test User');
    await repository.save(user);

    const result = await useCase.execute('1');

    expect(result).toEqual(user);
  });

  it('should throw error when user not found', async () => {
    await expect(useCase.execute('999'))
      .rejects
      .toThrow('User 999 not found');
  });
});
```

---

## ✅ Checklist de Calidad Arquitectónica

Antes de considerar completa una tarea arquitectónica, verifica:

- [ ] **Separación de responsabilidades**: Cada clase/función tiene un propósito único
- [ ] **Principio de Inversión de Dependencias**: Dependemos de abstracciones, no de implementaciones
- [ ] **Testeabilidad**: Código fácil de testear con dependencias inyectables
- [ ] **Tipos estrictos**: Todo tipado correctamente sin `any`
- [ ] **Nombres descriptivos**: Variables, funciones y clases con nombres claros
- [ ] **Manejo de errores**: Casos de error considerados y manejados
- [ ] **Tests incluidos**: Tests unitarios para lógica de negocio
- [ ] **Documentación**: Decisiones arquitectónicas documentadas
- [ ] **Sin dependencias circulares**: Flujo de dependencias unidireccional
- [ ] **Configuración TypeScript**: Compila con `strict: true`

---

## 💡 Ejemplos de Uso

### Solicitud Simple
```
Usando el prompt #2 (Diseño de Nueva Funcionalidad):
"Diseña la arquitectura para un sistema de autenticación de usuarios"
```

### Solicitud Compuesta
```
Combina prompts #4 y #6:
"Implementa el patrón Repository para gestión de productos y 
define la estrategia de testing completa"
```

### Solicitud de Revisión
```
Usando prompt #9:
"Realiza un code review arquitectónico del archivo src/shared/health.ts 
y sugiere cómo expandirlo siguiendo Clean Architecture"
```

---

## 📚 Referencias

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vitest Documentation](https://vitest.dev/)

---

## 🔄 Actualización de Este Documento

Si encuentras que faltan prompts comunes o necesitas variaciones específicas, solicita:
```
"Agrega un nuevo prompt para [CASO_DE_USO] en el archivo software-architect-prompts.md"
```

El agente actualizará este archivo manteniendo la estructura y formato existente.
