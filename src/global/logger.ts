export function logInfo(message: string, meta?: Record<string, unknown>) {
  console.log(formatLog("info", message, meta));
}

export function logError(message: string, error?: unknown, meta?: Record<string, unknown>) {
  const errorMeta = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { error };

  console.error(formatLog("error", message, { ...meta, ...errorMeta }));
}

function formatLog(level: string, message: string, meta?: Record<string, unknown>) {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  return JSON.stringify(entry);
}
