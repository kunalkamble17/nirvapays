import logo from '../assets/nirvapay-logo.png'

export default function BrandLogo({ className = '', imageClassName = '', showWordmark = false, subtitle }) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 rounded-[1.25rem] bg-white/95 p-2 shadow-lg shadow-slate-900/8 ring-1 ring-slate-200/80 dark:bg-slate-800 dark:ring-slate-600">
        <img
          src={logo}
          alt="NirvaPay"
          className={`h-14 w-auto object-contain drop-shadow-sm ${imageClassName}`}
        />
      </div>
      {showWordmark && (
        <div className="min-w-0">
          <div className="truncate text-lg font-bold tracking-[0.14em] text-slate-900 dark:text-slate-100 sm:text-xl sm:tracking-[0.18em]">NirvaPay</div>
          {subtitle && <div className="truncate text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">{subtitle}</div>}
        </div>
      )}
    </div>
  )
}
