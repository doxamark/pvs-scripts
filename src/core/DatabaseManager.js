import odbc from 'odbc';
import dotenv from 'dotenv';
import { createLogger, transports, format } from 'winston';

// Load environment variables from .env file
dotenv.config();

class DatabaseManager {
  constructor() {
    this.uid = process.env.DB_UID;
    this.pwd = process.env.DB_PWD;
    this.dsn = process.env.DB_DSN;
    this.conn = null;

    this.logger = createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'database.log' })
      ]
    });
  }

  async _connect() {
    try {
      const connStr = `DSN=${this.dsn};UID=${this.uid};PWD=${this.pwd}`;
      this.conn = await odbc.connect(connStr);
      this.logger.info('Connection established successfully.');
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`);
      throw error;
    }
  }

  async _disconnect() {
    if (this.conn) {
      await this.conn.close();
    }
  }

  async insert(query) {
    try {
      await this._connect();
      await this.conn.query(query);
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`);
    } finally {
      await this._disconnect();
    }
  }

  async insertWithIdentity(query) {
    try {
      await this._connect();
      await this.conn.query(query);

      const identity = await this.conn.query('SELECT @@Identity as LastID');

      await this.conn.commit()
      return identity[0].LastID
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`);
    } finally {
      await this._disconnect();
    }
  }

  async fetch(query) {
    try {
      await this._connect();
      const result = await this.conn.query(query);
      // Convert result to JSON format
      const jsonResults = result.map(row => {
        const jsonRow = {};
        for (const [key, value] of Object.entries(row)) {
          jsonRow[key] = value;
        }
        return jsonRow;
      });
      
      return jsonResults;
    } catch (error) {
      this.logger.error(`An error occurred: ${error.message}`);
      return [];
    } finally {
      await this._disconnect();
    }
  }
}

export default DatabaseManager;
