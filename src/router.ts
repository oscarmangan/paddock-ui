import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from "@tanstack/react-router";
import CalendarPage from "@/pages/calendar/CalendarPage";
import ListingDetailPage from "./pages/listing/ListingDetailPage";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/calendar" });
  },
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace/listings/$id",
  component: ListingDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  calendarRoute,
  listingDetailRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
