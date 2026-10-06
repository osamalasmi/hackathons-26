import {date, integer, numeric, pgTable, time, varchar} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name"),
    lastname: varchar("lastname"),
    age: integer("age"),
    land: varchar("land"),
});

export const drivers = pgTable("drivers", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name"),
    lastname: varchar("lastname"),
    age: integer("age"),
    working_days: integer("working_days"),
    working_years: integer("working_years"),
    service_since: integer("service_since"),
    language: varchar("language"),
    license_number: varchar("license_number"),
    license_photo: varchar("license_photo"),
    profile_photo: varchar("profile_photo"),
    vehicle_plate: varchar("vehicle_plate"),
})

export const routes = pgTable("routes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    from: varchar("from", {length: 255}),
    to: varchar("to", {length: 255}),
    date: date("date"),
    time: time("time"),
    estimated_price: numeric("estimated_price", {precision: 10, scale: 2}),
    estimated_distance: numeric("estimated_distance", {precision: 10, scale: 2}),
    estimated_duration: integer("estimated_duration"),
    final_price: numeric("final_price", {precision: 10, scale: 2}),
    final_distance: numeric("final_distance", {precision: 10, scale: 2}),
    final_duration: integer("final_duration"),
    status: varchar("status", {length: 50}),
    user_id: integer("user_id")
        .notNull()
        .references(() => users.id),
    driver_id: integer("driver_id")
        .notNull()
        .references(() => drivers.id),
});

export const route_points = pgTable("route_points", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    route_id: integer("route_id")
        .notNull()
        .references(() => routes.id),
    latitude: numeric("latitude", {precision: 9, scale: 6}),
    longitude: numeric("longitude", {precision: 9, scale: 6}),
    time: time("time"),
});