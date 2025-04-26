# 📝 Contador Persistente - Documentación Técnica

Aplicación de contador global con persistencia en base de datos y reseteo automático tras 20 minutos de inactividad.

## 🛠 Requisitos Técnicos

### 📋 Prerrequisitos

| Herramienta | Versión         | Instalación                               |
|-------------|-----------------|-------------------------------------------|
| Node.js     | 18.x o superior | [Descargar Node.js](https://nodejs.org/)  |
| Git         | 2.x o superior  | [Instalar Git](https://git-scm.com/)      |
| npm         | 9.x o superior  | Viene con Node.js                         |
| VSC         | Última versión  | [VS Code](https://code.visualstudio.com/) | 


### 🧩 Stack Tecnológico
- **Framework**: Next.js 15.2 (JavaScript)
- **Base de Datos**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Autenticación**: Supabase ANON Key
- **Realtime**: Supabase Realtime API

##########################################################################################################################################


## 🚀 Configuración Inicial

🔧 INSTRUCCIONES PARA LA CONFIGURACIÓN E INSTALACIÓN DE LA APLICACIÓN

### 1. CLONAR EL REPOSITORIO

* bash *

git clone https://github.com/tu-usuario/contador-persistente.git
cd contador-persistente

|****************************************************************************************************************************************|

### 2. INSTALAR DEPENDENCIAS

npm install

|****************************************************************************************************************************************|

### 3. CONFIGURAR EL ENTORNO .env

Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

# Prisma (Conexión PGBouncer)
DATABASE_URL="postgresql://postgres:[TU_CONTRASEÑA]@db.[TU_PROYECTO].supabase.co:6543/postgres?pgbouncer=true"

# Prisma (Conexión directa para migraciones)
DIRECT_URL="postgresql://postgres:[TU_CONTRASEÑA]@db.[TU_PROYECTO].supabase.co:5432/postgres"

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL=https://[TU_PROYECTO].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[TU_ANON_KEY]

|****************************************************************************************************************************************|

### 4. CONFIGURACIÓN DE LA BASE DE DATOS - SUPABASE

1. Crear proyecto en Supabase

a. Ingresar a app.supabase.com
b. Crear nuevo proyecto
c. Esperar aprovisionamiento

2. Configurar base de datos

Ejecutar en SQL Editor de Supabase:

-- Tabla principal
CREATE TABLE counter (
  id TEXT PRIMARY KEY DEFAULT 'GLOBAL',
  value INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar valor inicial
INSERT INTO counter (id, value) VALUES ('GLOBAL', 0);

-- Función de reseteo
CREATE OR REPLACE FUNCTION reset_counter_if_needed() 
RETURNS VOID AS $$
BEGIN
  UPDATE counter 
  SET value = 0, last_updated = NOW()
  WHERE id = 'GLOBAL'
    AND value != 0
    AND last_updated < NOW() - INTERVAL '20 minutes';
END;
$$ LANGUAGE plpgsql;


3. Configurar Realtime

a-Ir a Supabase, ingresar al proyecto. En el menu lateral izquierodo, ingresar en realtime.
b-Habilitar replicación para la tabla counter
c-Seleccionar "Inserts, Updates, Deletes"

4. Configurar Cron Job

-- Instalar extensión (solo una vez)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar ejecución cada minuto
SELECT cron.schedule(
  'reset_counter_job',
  '* * * * *', 
  $$SELECT reset_counter_if_needed()$$
);


5. Sincronizar Prisma (opcional para desarrollo local)

Si vas a trabajar con Prisma en desarrollo local, ejecutá los siguientes comandos:

npx prisma generate
npx prisma db pull

npm run dev      # Iniciar servidor de desarrollo con Turbopack
npm run build    # Compilar app para producción
npm run start    # Iniciar servidor en producción
npm run lint     # Ejecutar linter


##########################################################################################################################################

📌 DECISIONES TÉCNICAS

+ Se usó Supabase por su integración fácil con PostgreSQL, soporte de funciones SQL, cron jobs y soporte de canales realtime.

+ Se eligió Prisma como ORM por su facilidad de uso y compatibilidad con Supabase.

+ Se utilizaron Server Actions (Next.js 15.2) para mantener la lógica en el servidor.

+ La lógica de reseteo fue delegada a una función SQL + pg_cron en producción, y eliminada del backend para evitar duplicidad.

+ Se usaron Client Components sólo cuando fue necesario, como WarningMsg que necesita manejar eventos onClick.

+ Los estilos fueron desarrollados con CSS para evitar instalar dependencias como MUI, dado que la app tiene una sola vista y se priorizó mantenerla liviana.

##########################################################################################################################################


🚀 FUNCIONALIDADES ADICIONALES

+ Reseteo automático del contador tras 20 minutos sin cambios, gracias a Supabase pg_cron + función SQL.

+ Alerta visual (WarningMsg) si el contador está a punto de reiniciarse.

+ Loader animado para mejorar experiencia de usuario.

+ Componente Counter reactivo que muestra el valor actualizado automáticamente.
+ 
+ Actualización en tiempo real del contador usando Supabase realtime.

##########################################################################################################################################