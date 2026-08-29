type ResponsiveImageProps = {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
};

const widths = [480, 768, 1200, 1536];
const sourceSet = (name: string, format: "avif" | "webp") =>
  widths.map((width) => `/images/${name}-${width}.${format} ${width}w`).join(", ");

export function ResponsiveImage({ name, alt, className, eager = false, sizes = "(max-width: 800px) 100vw, 50vw" }: ResponsiveImageProps) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={sourceSet(name, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={sourceSet(name, "webp")} sizes={sizes} />
      <img
        src={`/images/${name}-1200.webp`}
        alt={alt}
        width="1536"
        height="1024"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
