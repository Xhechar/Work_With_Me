import mssql from 'mssql';
import dotenv from 'dotenv';
import { SqlConfigurations } from '../interfaces/interfaces';

dotenv.config();

export const sqlConfig: SqlConfigurations = ({
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  server: process.env.DB_SERVER as string,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
});

const test_connection = async () => {
  console.log("testing mssql connection ...");
  
  const pool = await mssql.connect(sqlConfig);

  if (pool.connected) {
    console.log("Database connection successfull...");
  } else {
    console.log("Error connecting MSSQL Database. " + mssql.MSSQLError);
  }
}

test_connection();