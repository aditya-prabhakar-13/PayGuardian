interface HemiDonutProps {
  spent: number;
  budget: number;
}

export function HemiDonut({ spent, budget }: HemiDonutProps) {
  const percentage = Math.min(Math.max(spent / budget, 0), 1);
  
  // SVG Arc calculation
  // Radius = 40, Center = (50, 50)
  // Circumference of half circle = Math.PI * r = ~125.66
  const r = 40;
  const cx = 50;
  const cy = 45; // Shifted slightly up
  const dashArray = Math.PI * r;
  const dashOffset = dashArray * (1 - percentage);

  // Gradient based on spent %
  const getStrokeColor = () => {
    if (percentage > 0.9) return "url(#dangerGradient)";
    if (percentage > 0.75) return "url(#warnGradient)";
    return "url(#safeGradient)";
  };

  return (
    <div className="relative w-full aspect-[2/1] flex flex-col items-center justify-end overflow-hidden">
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full drop-shadow-lg"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="safeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
            <stop offset="100%" stopColor="#10b981" /> {/* emerald-500 */}
          </linearGradient>
          <linearGradient id="warnGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" /> {/* amber-500 */}
            <stop offset="100%" stopColor="#ef4444" /> {/* red-500 */}
          </linearGradient>
          <linearGradient id="dangerGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" /> {/* red-500 */}
            <stop offset="100%" stopColor="#b91c1c" /> {/* red-700 */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#1f2937" /* gray-800 */
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Progress Fill */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 1s ease-in-out, stroke 0.5s ease" }}
        />
      </svg>
      
      {/* Absolute positioning for inner text so it sits neatly in the donut hole */}
      <div className="absolute bottom-2 flex flex-col items-center">
        <span className="text-3xl font-bold tracking-tight text-white">
          ₹{spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </span>
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Spent
        </span>
      </div>
    </div>
  );
}
