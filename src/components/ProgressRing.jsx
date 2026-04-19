export default function ProgressRing({ pct = 0, size = 80, stroke = 6, color = '#C8421A', label }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#292524" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{transition:'stroke-dashoffset 0.5s ease'}}/>
      <text x={size/2} y={size/2 - (label ? 5 : 0)} textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize={size * 0.2} fontWeight="700" fontFamily="monospace">{pct}%</text>
      {label && <text x={size/2} y={size/2 + size*0.18} textAnchor="middle" dominantBaseline="central"
        fill="#6b7280" fontSize={size * 0.13} fontFamily="monospace">{label}</text>}
    </svg>
  )
}
