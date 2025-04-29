import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

/**
 * Configuración global de la aplicación
 * Este archivo centraliza todas las variables de entorno y configuraciones
 * necesarias para el funcionamiento de la aplicación.
 */

/**
 * Registra y retorna la configuración global de la aplicación
 * @returns {Object} Objeto de configuración con las siguientes propiedades:
 * @property {Object} database - Configuración de la base de datos
 * @property {string} database.database - Nombre de la base de datos
 * @property {string} database.host - Host de la base de datos
 * @property {string} database.password - Contraseña de la base de datos
 * @property {number} database.port - Puerto de la base de datos
 * @property {string} database.schemaAuth - Esquema de autenticación
 * @property {string} database.schemaCore - Esquema principal
 * @property {string} database.username - Usuario de la base de datos
 * @property {Object} mail - Configuración del servicio de correo
 * @property {string} mail.host - Host del servidor de correo
 * @property {number} mail.port - Puerto del servidor de correo
 * @property {string} mail.user - Usuario del servidor de correo
 * @property {string} mail.pass - Contraseña del servidor de correo
 * @property {string} mail.from - Dirección de correo remitente
 * @property {string} mail.fromName - Nombre del remitente
 * @property {string} apiKey - Clave API para servicios externos
 * @property {string} jwtSecret - Clave secreta para JWT
 * @property {number} port - Puerto en el que se ejecutará la aplicación
 * @property {string} appUrl - URL base de la aplicación
 */
export const config = registerAs('config', () => {
  return {
    database: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      schemaAuth: process.env.DB_SCHEMA_AUTH,
      schemaCore: process.env.DB_SCHEMA_CORE,
      username: process.env.DB_USER,
    },
    mail: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10),
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM_ADDRESS,
      fromName: process.env.MAIL_FROM_NAME,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    port: parseInt(process.env.PORT, 10),
    appUrl: process.env.APP_URL,
  };
});
