const sql = require('mssql');

const config1 = {
    user: process.env.ACCESSCONTROL_DB_USER,
    password: process.env.ACCESSCONTROL_DB_PASSWORD,
    server: process.env.ACCESSCONTROL_DB_HOST,
    database: process.env.ACCESSCONTROL_DB_DBNAME,
    pool: {
        max: 10,
        min: 0,
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
    },
    dialect: 'mssql',
    dialectOptions: {
        instanceName: 'SQLEXPRESS'
    }
}

const poolPromise = new sql.ConnectionPool(config1)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err =>
        console.log('Database Connection Failed!', err)
    )

module.exports = {
    sql, poolPromise
}
