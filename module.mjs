import { module } from "@prisma/composer";
import nomadisaBookingAppWeb from "./service.mjs";

export default module("nomadisa-booking-app", ({ provision }) => {
  provision(nomadisaBookingAppWeb);
});
