export type ApiErrorLike = { message?: string; status?: number; body?: unknown };

export function extractServerMessage(body: unknown): string | undefined {
  if (typeof body === "string") return body;
  if (body && typeof body === "object" && "error" in body) {
    const maybe = (body as Record<string, unknown>).error;
    if (typeof maybe === "string") return maybe;
  }
  return undefined;
}

export function parseError(e: unknown): { status?: number; raw: string; serverMsg?: string } {
  const err = e as ApiErrorLike | undefined;
  return {
    status: err?.status,
    raw: String(err?.message ?? ""),
    serverMsg: extractServerMessage(err?.body),
  };
}

export function chooseMessage(
  fallback: string,
  ctx: { status?: number; raw: string; serverMsg?: string },
  rules?: {
    alreadyExistsMsg?: string;
    validationMsg?: string;
    cannotDeleteMsg?: string;
  }
): string {
  const raw = ctx.raw;
  const serverMsg = ctx.serverMsg ?? "";
  if (
    rules?.alreadyExistsMsg &&
    (ctx.status === 409 || /already exists/i.test(raw) || /already exists/i.test(serverMsg))
  ) {
    return rules.alreadyExistsMsg;
  }
  if (rules?.validationMsg && (/validation/i.test(raw) || /validation/i.test(serverMsg))) {
    return rules.validationMsg;
  }
  if (rules?.cannotDeleteMsg && (raw.includes("Cannot delete category") || ctx.status === 409)) {
    return rules.cannotDeleteMsg;
  }
  return fallback;
}
