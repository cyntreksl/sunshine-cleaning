import type { ServiceRecord } from "@/content/types";

const paths: Record<ServiceRecord["icon"], React.ReactNode> = {
  home: <><path d="M5 13.5 16 4l11 9.5"/><path d="M8.5 12v15h15V12M13 27v-8h6v8"/></>,
  sparkle: <><path d="M16 3c.5 6.7 3.3 9.5 10 10-6.7.5-9.5 3.3-10 10-.5-6.7-3.3-9.5-10-10 6.7-.5 9.5-3.3 10-10Z"/><path d="M25 22c.2 2.3 1.2 3.3 3.5 3.5-2.3.2-3.3 1.2-3.5 3.5-.2-2.3-1.2-3.3-3.5-3.5 2.3-.2 3.3-1.2 3.5-3.5Z"/></>,
  keys: <><circle cx="11" cy="13" r="6"/><path d="m15.5 17.5 10 10M21 23l3-3M24 26l3-3"/></>,
  bed: <><path d="M5 25V10M27 25v-9a4 4 0 0 0-4-4H5v13M5 18h22M9 12V8h7v4"/><path d="M5 25v3M27 25v3"/></>,
  office: <><path d="M6 28V6h14v22M20 13h6v15M10 11h2M15 11h2M10 16h2M15 16h2M10 21h2M15 21h2M23 18h1"/></>,
  brush: <><path d="m8 5 15 15M20 3l9 9-7 7-9-9 7-7Z"/><path d="M14 16c-7 1-10 5-10 12 4-2 8-1 12-5 2-2 1-5-2-7Z"/></>,
};

export function ServiceIcon({ icon }: { icon: ServiceRecord["icon"] }) {
  return (
    <svg className="service-icon" viewBox="0 0 32 32" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}
