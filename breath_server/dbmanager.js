const { Client } = require('pg');

exports.pgQuery = async (query) => {
  try {
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DBNAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await client.connect();
    const res = await client.query(query);
    //console.log('res:', res);
    await client.end();
    return res;
  } catch (error) {
    console.log('pgquery_query error:', error);
    console.log('query:', query);
    throw error;
  }
}

