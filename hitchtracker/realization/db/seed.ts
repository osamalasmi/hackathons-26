import { db } from "./index";
import { users, drivers, routes, route_points } from "./schema";
import {eq} from "drizzle-orm";

async function main() {
    // Opruimen in omgekeerde volgorde, zodat het script opnieuw te draaien is
    await db.delete(route_points);
    await db.delete(routes);
    await db.delete(drivers);
    await db.delete(users);

    // 1. Passagier en chauffeur
    const [user] = await db
        .insert(users)
        .values({ name: "Sara", lastname: "Jansen", age: 29, land: "Nederland" })
        .returning();

    const [driver] = await db
        .insert(drivers)
        .values({
            name: "Vic",
            lastname: "Benali",
            age: 20,
            working_days: 5,
            working_years: 7,
            service_since: 2019,
            language: "Engels, Arabisch",
            license_number: "NL-123456",
            license_photo: "/dummy/license.jpg",
            profile_photo: "/dummy/ahmed.jpg",
            vehicle_plate: "GX-482-K",
        })
        .returning();

    // 2. De rit, met de schattingen
    const [route] = await db
        .insert(routes)
        .values({
            from: "Centraal Station",
            to: "Hotel Parkzicht, Museumplein 4",
            date: "2026-10-01",
            time: "14:32:00",
            estimated_price: "18.50",
            estimated_distance: "7.20",
            estimated_duration: 18,
            status: "completed",
            user_id: user.id,
            driver_id: driver.id,
        })
        .returning();

    // 3. De GPS-punten van de rit
    await db.insert(route_points).values([
        { route_id: route.id, latitude: "52.379100", longitude: "4.900300", time: "14:32:00" },
        { route_id: route.id, latitude: "52.377000", longitude: "4.899000", time: "14:35:00" },
        { route_id: route.id, latitude: "52.374500", longitude: "4.899500", time: "14:38:00" },
        { route_id: route.id, latitude: "52.372500", longitude: "4.896000", time: "14:41:00" },
        { route_id: route.id, latitude: "52.369500", longitude: "4.894000", time: "14:44:00" },
        { route_id: route.id, latitude: "52.365000", longitude: "4.890000", time: "14:47:00" },
        { route_id: route.id, latitude: "52.361000", longitude: "4.886000", time: "14:50:00" },
        { route_id: route.id, latitude: "52.357900", longitude: "4.881200", time: "14:53:00" },
    ]);

    // Nu nog vast ingevuld. In de app worden ze berekend uit route_points.
    await db
        .update(routes)
        .set({ final_price: "19.40", final_distance: "7.60", final_duration: 21 })
        .where(eq(routes.id, route.id));

    console.log("Seed klaar: rit", route.id);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});