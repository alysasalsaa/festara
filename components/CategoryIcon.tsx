export default function CategoryIcon({ id, color, size = 32 }: { id: string; color: string; size?: number }) {
  const s = size;
  const props = { width: s, height: s, viewBox: "0 0 32 32", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (id) {
    case "wedding-organizer":
      return (
        <svg {...props}>
          <circle cx="11" cy="8" r="4"/>
          <circle cx="21" cy="8" r="4"/>
          <path d="M4 26c0-5 3-8 7-8h10c4 0 7 3 7 8"/>
          <path d="M16 14v5M13 17h6"/>
        </svg>
      );
    case "event-organizer":
      return (
        <svg {...props}>
          <rect x="4" y="9" width="24" height="18" rx="2"/>
          <path d="M10 5v6M22 5v6M4 15h24"/>
          <circle cx="11" cy="21" r="1.5" fill={color}/>
          <circle cx="16" cy="21" r="1.5" fill={color}/>
          <circle cx="21" cy="21" r="1.5" fill={color}/>
        </svg>
      );
    case "photographer":
      return (
        <svg {...props}>
          <path d="M4 23V14a2 2 0 0 1 2-2h3l2-4h10l2 4h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>
          <circle cx="16" cy="17" r="4"/>
          <circle cx="16" cy="17" r="2" fill={color} fillOpacity="0.2"/>
        </svg>
      );
    case "venue":
      return (
        <svg {...props}>
          <path d="M4 28h24M7 28V18L16 6l9 12v10"/>
          <rect x="12" y="20" width="8" height="8" rx="1"/>
          <path d="M10 14h3M19 14h3M10 19h3M19 19h3"/>
        </svg>
      );
    case "dekorasi":
      return (
        <svg {...props}>
          <path d="M16 4s-6 5-6 11a6 6 0 0 0 12 0C22 9 16 4 16 4z"/>
          <path d="M16 16v8M12 22l4 3 4-3"/>
          <circle cx="16" cy="28" r="2"/>
        </svg>
      );
    case "merchandise-wisuda":
      return (
        <svg {...props}>
          <path d="M4 13l12-5 12 5-12 5-12-5z"/>
          <path d="M28 13v7"/>
          <path d="M10 16v7c0 3 6 5 6 5s6-2 6-5v-7"/>
          <circle cx="28" cy="22" r="1.5" fill={color}/>
        </svg>
      );
    case "catering":
      return (
        <svg {...props}>
          <path d="M4 26h24M16 8v18"/>
          <path d="M8 12c0-4 3-7 8-7s8 3 8 7H8z"/>
          <path d="M6 17h20"/>
          <path d="M9 22h14"/>
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="12"/>
          <path d="M16 10v6l4 4"/>
        </svg>
      );
  }
}