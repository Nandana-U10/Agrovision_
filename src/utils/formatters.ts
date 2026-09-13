export function calculatePacketAgeSeconds(timestampIso: string | null | undefined): number | null {
  if (!timestampIso) return null;
  const packetTime = new Date(timestampIso).getTime();
  if (isNaN(packetTime)) return null;
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - packetTime) / 1000));
  return diffSec;
}

export function formatValue(val: number | null | undefined, decimals = 1, unit = ''): string {
  if (val === null || val === undefined || isNaN(val)) {
    return unit ? `-- ${unit}` : '--';
  }
  return `${val.toFixed(decimals)}${unit ? ' ' + unit : ''}`;
}

export function formatTimeToDry(
  seconds: number | null | undefined,
  formattedStr?: string | null,
  estimatedDryTimestamp?: string | null
): string {
  if (formattedStr && formattedStr.trim()) {
    return formattedStr;
  }
  
  let targetSeconds = seconds;
  
  if ((targetSeconds === null || targetSeconds === undefined) && estimatedDryTimestamp) {
    const dryTime = new Date(estimatedDryTimestamp).getTime();
    if (!isNaN(dryTime)) {
      targetSeconds = Math.max(0, Math.floor((dryTime - Date.now()) / 1000));
    }
  }
  
  if (targetSeconds === null || targetSeconds === undefined || isNaN(targetSeconds) || targetSeconds <= 0) {
    return '--h --m';
  }

  const hours = Math.floor(targetSeconds / 3600);
  const minutes = Math.floor((targetSeconds % 3600) / 60);
  
  const hPad = String(hours).padStart(2, '0');
  const mPad = String(minutes).padStart(2, '0');

  return `${hPad}h ${mPad}m`;
}
