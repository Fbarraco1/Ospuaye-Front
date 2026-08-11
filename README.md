# Sistema Web OSPUAYE — Frontend

Aplicación web de gestión de reintegros para la **Obra Social de los Profesionales Universitarios del Agua y la Energía Eléctrica (OSPUAYE)**, desarrollada como Práctica Profesionalizante de la Tecnicatura Universitaria en Programación (UTN — Facultad Regional Mendoza).

El sistema permite a los **afiliados** cargar y consultar solicitudes de reintegro (Oftalmología y Ortopedia), a los **médicos auditores** evaluarlas, y al **personal administrativo** gestionar el proceso completo, incluyendo el padrón de afiliados y grupos familiares.

Este repositorio contiene el **frontend** de la aplicación. Consume la API REST expuesta por el [backend de OSPUAYE](https://github.com/Juani17/backendPasantias), desarrollado en Java con Spring Boot.

---

## 🧩 Stack Tecnológico

- **React** — Librería para la construcción de interfaces basadas en componentes.
- **TypeScript** — Tipado estático sobre JavaScript.
- **Vite** — Entorno de desarrollo y build.
- **HTML5 / CSS3** — Estructura y estilos.
- **Axios / Fetch API** — Comunicación con la API REST del backend.
- **ESLint** — Linter para mantener la calidad y consistencia del código.

---

## 👥 Roles y accesos

| Funcionalidad | Afiliado | Médico Auditor | Administrador |
|---|:---:|:---:|:---:|
| Registro / Login | ✔️ | ✔️ | ✔️ |
| Carga de reintegros | ✔️ | ❌ | ✔️ |
| Subida de documentación | ✔️ | ✔️ (solo lectura) | ✔️ |
| Evaluación médica | ❌ | ✔️ | ❌ |
| Cambio de estado (auditoría) | ❌ | ✔️ | ❌ |
| Aprobación final del reintegro | ❌ | ❌ | ✔️ |
| Registro de pago | ❌ | ❌ | ✔️ |
| Consulta de historial | ✔️ | ✔️ (solo pedidos asignados) | ✔️ |

> Tabla de accesos idéntica a la implementada del lado del backend, para asegurar consistencia entre ambos repositorios.

---

## ⚙️ Requisitos previos

Antes de comenzar, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- El **[backend de OSPUAYE](https://github.com/Juani17/backendPasantias)** corriendo (local o desplegado), ya que el frontend depende de su API REST para funcionar. Ver las instrucciones de instalación en ese repositorio.

---

## 🚀 Instalación y ejecución en desarrollo

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Fbarraco1/OspuayeFront.git
   cd OspuayeFront
   ```

2. **Instalar las dependencias**

   ```bash
   npm install
   ```

3. **Configurar la conexión con el backend**

   Crear un archivo `.env` en la raíz del proyecto con la URL base de la API. Por defecto, el backend corre en el puerto `8080` (según su configuración en `application.properties`):

   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. **Ejecutar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir la aplicación**

   Acceder desde el navegador a la URL que indique la consola (por defecto suele ser `http://localhost:5173`).

> ⚠️ Si el backend no está corriendo o la URL configurada en `VITE_API_URL` no coincide con su puerto, el frontend no podrá autenticar usuarios ni cargar datos.

---

## 📦 Build para producción

Para generar la versión optimizada de producción:

```bash
npm run build
```

Los archivos generados se guardan en la carpeta `dist/`, listos para ser desplegados en un servidor web.

Para previsualizar el build localmente:

```bash
npm run preview
```

---

## 🏗️ Arquitectura

El frontend forma parte de una arquitectura **cliente-servidor basada en API REST**, en conjunto con el backend:

- El **cliente** (esta aplicación) gestiona la interacción con el usuario y realiza solicitudes HTTP a la API.
- El **servidor** ([backend en Java + Spring Boot](https://github.com/Juani17/backendPasantias)) procesa la lógica de negocio, gestiona la persistencia en MySQL y expone los endpoints REST consumidos aquí.

Esta separación permite escalabilidad, mantenibilidad y una clara división de responsabilidades entre las capas del sistema.

### Flujo de una solicitud de reintegro (visualizado en el frontend)

```
Solicitado → Pendiente de Revisión Médica → En Revisión Médica → 
Observado (opcional) → Pendiente de Revisión Administrativa → 
Aprobado / Rechazado → Pagado
```

---

## 📁 Estructura del proyecto (resumen)

```
OspuayeFront/
├── public/            # Archivos estáticos
├── src/                # Código fuente de la aplicación
├── index.html          # Punto de entrada HTML
├── vite.config.ts       # Configuración de Vite
├── tsconfig.json        # Configuración de TypeScript
├── eslint.config.js     # Configuración de ESLint
└── package.json
```

---

## 🌐 Despliegue

El sistema fue desplegado en un entorno productivo utilizando:

- **Servidor:** DonWeb (IaaS sobre Ubuntu Linux)
- **Contenerización:** Docker
- **Base de datos:** MySQL (consumida por el backend)

---

## 👨‍💻 Equipo de desarrollo

Proyecto desarrollado en el marco de la Práctica Profesionalizante — UTN Facultad Regional Mendoza.

- **Francisco Barraco** — Desarrollo Full Stack
- **Juan Emilio Frery** — Desarrollo Full Stack
- **Lic. Leandro Spadaro** — Tutor institucional / Dueño del Producto (OSPUAYE)
- **Ing. Diego Cornejo** — Scrum Master

Metodología de trabajo: **Scrum**, con sprints de 2 semanas, tablero Kanban en Trello y estimaciones mediante Planning Poker.

---

## 🔗 Repositorios relacionados

- Backend: [backendPasantias](https://github.com/Juani17/backendPasantias)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos y de práctica profesional para OSPUAYE. Su uso, distribución o reutilización está sujeto a la autorización de la organización y de los autores.
