export default {
    schema: "./src/db/schema/*",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: "./src/db/sqlite.db",
    },
};
