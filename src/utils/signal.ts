export type SignalQuality = 'Excellent' | 'Fair' | 'Weak' | 'Unavailable';

export function getSignalQuality(rssi: number | null | undefined): SignalQuality {
  if (rssi === null || rssi === undefined) return 'Unavailable';
  if (rssi > -70) return 'Excellent';
  if (rssi >= -85) return 'Fair';
  return 'Weak';
}

export function getSignalColorClass(quality: SignalQuality): string {
  switch (quality) {
    case 'Excellent':
      return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    case 'Fair':
      return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    case 'Weak':
      return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    default:
      return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
  }
}
