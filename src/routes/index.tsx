import { createFileRoute } from "@tanstack/react-router";
import { VelaSite } from "@/components/vela-site";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <VelaSite />;
}
