import mssql from 'mssql';
import { sqlConfig } from '../db_config/db.sql.config';

export class DatabaseHelper {

  static async query(query: string) {
    const pool = mssql.connect(sqlConfig) as Promise<mssql.ConnectionPool>;

    let response = ((await pool).request().query(query));

    return response;
  }

  static async execute(stored_procedure: string, data: { [c: string | number]: string | number }) {
    const pool = mssql.connect(sqlConfig) as Promise<mssql.ConnectionPool>;

    const request = ((await pool).request()) as mssql.Request;

    for (let key in data) {
      request.input(key, data[key]);
    }

    const result = (await request.execute(stored_procedure));

    return result;
  }
}