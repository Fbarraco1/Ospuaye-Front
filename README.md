# Sistema Web OSPUAYE — Frontend

Aplicación web de gestión de reintegros para la **Obra Social de los Profesionales Universitarios del Agua y la Energía Eléctrica (OSPUAYE)**, desarrollada como Práctica Profesionalizante de la Tecnicatura Universitaria en Programación (UTN — Facultad Regional Mendoza).

El sistema permite a los **afiliados** cargar y consultar solicitudes de reintegro (Oftalmología y Ortopedia), a los **médicos auditores** evaluarlas, y al **personal administrativo** gestionar el proceso completo, incluyendo el padrón de afiliados y grupos familiares.

Este repositorio contiene el **frontend** de la aplicación. El backend (API REST) se encuentra en un repositorio separado.

---

## 🧩 Stack Tecnológico

- **React** — Librería para la construcción de interfaces basadas en componentes.
- **TypeScript** — Tipado estático sobre JavaScript.
- **Vite** — Entorno de desarrollo y build.
- **HTML5 / CSS3** — Estructura y estilos.
- **Axios / Fetch API** — Comunicación con la API REST del backend.
- **ESLint** — Linter para mantener la calidad y consistencia del código.

---

## 👥 Roles del sistema

| Rol | Funcionalidad principal |
|---|---|
| **Afiliado** | Registro/login, carga de solicitudes de reintegro, subida de documentación, consulta de historial y estado de trámites. |
| **Médico Auditor** | Revisión de solicitudes pendientes, evaluación de documentación, aprobación/rechazo médico. |
| **Administrador** | Gestión de usuarios, beneficiarios, médicos, empresas, domicilios, grupos familiares y aprobación final de reintegros. |

---

## ⚙️ Requisitos previos

Antes de comenzar, asegurate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- Acceso a una instancia del **backend de OSPUAYE** corriendo (local o desplegado), ya que el frontend consume su API REST.

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

   Verificar/crear el archivo de variables de entorno (`.env`) con la URL base de la API, por ejemplo:

   ```env
   VITE_API_URL=http://localhost:9000
   ```

4. **Ejecutar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir la aplicación**

   Acceder desde el navegador a la URL que indique la consola (por defecto suele ser `http://localhost:5173`).

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

El frontend forma parte de una arquitectura **cliente-servidor basada en API REST**:

- El **cliente** (esta aplicación) gestiona la interacción con el usuario y realiza solicitudes HTTP a la API.
- El **servidor** (backend en Java + Spring Boot) procesa la lógica de negocio, gestiona la persistencia en MySQL y expone los endpoints REST.

Esta separación permite escalabilidad, mantenibilidad y una clara división de responsabilidades entre las capas del sistema.

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
- **Base de datos:** MySQL

---

## 👨‍💻 Equipo de desarrollo

Proyecto desarrollado en el marco de la Práctica Profesionalizante — UTN Facultad Regional Mendoza.

- **Francisco Barraco** — Desarrollo Full Stack
- **Juan Emilio Frery** — Desarrollo Full Stack
- **Lic. Leandro Spadaro** — Tutor institucional / Dueño del Producto (OSPUAYE)
- **Ing. Diego Cornejo** — Scrum Master

Metodología de trabajo: **Scrum**, con sprints de 2 semanas, tablero Kanban en Trello y estimaciones mediante Planning Poker.

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos y de práctica profesional para OSPUAYE. Su uso, distribución o reutilización está sujeto a la autorización de la organización y de los autores.
