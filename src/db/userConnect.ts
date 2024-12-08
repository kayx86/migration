import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";

export const AppDataSource = new DataSource({
    type: "postgres", // Database type
    host: "localhost", // Host for your database (you can change it to your DB server's address)
    port: 5432, // Default PostgreSQL port
    username: "macos", // Your PostgreSQL username
    password: "", // Your PostgreSQL password
    database: "telegram", // The database name
    synchronize: true, // Automatically synchronize the schema (use cautiously in production)
    logging: true, // Enable query logging
    entities: [User], // Register entities
});