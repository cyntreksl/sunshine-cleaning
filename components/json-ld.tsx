export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const jsonLd = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data.map((node) =>
          Object.fromEntries(Object.entries(node).filter(([key]) => key !== "@context")),
        ),
      }
    : data;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />;
}
