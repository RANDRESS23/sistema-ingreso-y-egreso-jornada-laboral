# 📘 Sistema de Ingreso y Egreso de Jornada Laboral

Este proyecto implementa un **sistema completo de control de jornada laboral**, permitiendo que un trabajador:

1. Ingrese un **código único**  
2. Inicie su jornada con un botón  
3. Vea un **cronómetro en tiempo real**  
4. Termine su jornada con otro botón  
5. Registre automáticamente en base de datos:  
   - Hora de entrada  
   - Hora de salida  
   - Duración total trabajada  

El sistema fue diseñado siguiendo buenas prácticas:  
**código limpio, modular, escalable y con manejo de errores real**.

---

# 🛠️ Tecnologías Utilizadas

## **Frontend**
### **Next.js (App Router)**
Elegido porque:
- Permite crear APIs y frontend en un solo entorno.
- Excelente performance.
- Arquitectura moderna basada en Server / Client Components.
- Reduce complejidad en el desarrollo del backend.

### **TailwindCSS**
Elegido porque:
- Permite diseñar interfaces rápidamente.
- No requiere escribir CSS manual.
- Perfecto para pruebas técnicas con tiempo limitado.
- Produce un diseño limpio, consistente y fácil de mantener.

---

## **Backend**
### **Next.js API Routes**
Ventajas:
- Backend integrado sin necesidad de Express.
- Código más simple y mantenible.
- Rápida comunicación con los componentes del frontend.

---

## **Base de Datos**
### **SQLite + Prisma ORM**
Elegido porque:
- No requiere instalación ni configuración adicional.
- Ideal para pruebas técnicas y ambientes locales.
- Prisma facilita:
  - Queries tipadas
  - Migraciones
  - Validación automática
  - Estructura clara del modelo

**Modelo utilizado:**

```prisma
model WorkSession {
  id        Int      @id @default(autoincrement())
  code      String
  startTime DateTime
  endTime   DateTime?
  totalMs   Int?
  createdAt DateTime @default(now())
}

# 🔥 Características del Sistema
## ✔ Inicio de jornada
El trabajador ingresa su código y presiona Iniciar Jornada.
El sistema:
- Verifica que no exista otra jornada activa
- Crea un registro en la base de datos
- Redirige al cronómetro

## ✔ Cronómetro en tiempo real
- Calculo continuo desde startTime
- Actualización cada segundo
- Funciona incluso si se recarga la página

## ✔ Fin de jornada
El sistema:
- Busca la jornada activa
- Registra endTime
- Calcula totalMs
- Guarda todo en la base de datos

# 🚨 Manejo de Errores (Requisito de Consigna)
La consigna pedía al menos dos errores justificados y manejados.
El proyecto maneja más de dos, pero los principales son:

## ❌ Error 1: Iniciar una jornada ya activa
Validación en ´´´/api/start´´´.
Si el código ya tiene una sesión sin cerrar:
´´´
{ "error": "Ya tienes una jornada activa" }
´´´
- Código: ´´´409 Conflict´´´
Justificación: evita jornadas duplicadas.

## ❌ Error 2: Finalizar sin tener una jornada activa
Validación en ´´´/api/end´´´.
Si el código no tiene una entrada activa:
´´´
{ "error": "No tienes una jornada activa" }
´´´
- Código: ´´´404 Not Found´´´
Justificación: evita registros inválidos.

# 🧠 Decisiones Técnicas
## ✔ Next.js + API Routes
- Permite fullstack con una sola tecnología
- Reduce complejidad y depende menos de infraestructura externa

## ✔ Prisma
- Código más claro
- Validación automática
- Migraciones reales

## ✔ SQLite
- Perfecto para pruebas técnicas
- Zero-config

## ✔ TailwindCSS
- Permite avanzar rápido en UI
- Diseño limpio y consistente