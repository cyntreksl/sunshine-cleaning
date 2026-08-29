export function SunshineMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true" className={className}>
      <circle cx="26" cy="26" r="9" fill="currentColor" />
      <path d="M26 2v9M26 41v9M2 26h9M41 26h9M9 9l7 7M36 36l7 7M43 9l-7 7M16 36l-7 7" />
      <path className="brand-sweep" d="M13 29c8 7 20 8 29 1" />
    </svg>
  );
}

export function Brand() {
  return (
    <a className="brand" href="/" aria-label="Sunshine Cleaning home">
      <SunshineMark />
      <span>
        Sunshine
        <small>Cleaning · York</small>
      </span>
    </a>
  );
}
