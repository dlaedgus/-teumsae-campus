const MAX_BODY_BYTES = 4_096;
const MAX_EVENTS_PER_RUN = 40;
const RATE_WINDOW_MS = 5 * 60 * 1_000;
const DUPLICATE_WINDOW_MS = 2_000;
const MAX_TRACKED_KEYS = 2_000;
const ROUTE = "/api/validation";

const runWindows = new Map<string, { count: number; startedAt: number }>();
const recentEvents = new Map<string, number>();

const eventNames = [
  "wizard_start",
  "step_complete",
  "recommendation_view",
  "routine_start",
  "routine_complete",
  "feedback_submit",
] as const;

const answerValues = {
  minutes: [20, 30, 40, 60, 90],
  energy: ["drained", "tired", "steady", "charged"],
  goal: ["focus", "review", "admin", "recharge", "movement", "connect"],
  place: ["library", "classroom", "cafe", "outside", "transit", "anywhere"],
  tool: ["laptop", "tablet", "paper", "phone", "none"],
  blocker: ["unclear", "tired", "distracted", "overloaded", "place", "none"],
} as const;

const questionOrder = ["minutes", "energy", "goal", "place", "tool", "blocker"] as const;

const recommendationIds = [
  "deliverable-sprint",
  "three-point-outline",
  "mobile-micro-finish",
  "active-recall-loop",
  "one-page-map",
  "walk-and-recall",
  "three-tabs-close",
  "deadline-map",
  "inbox-ten",
  "screenless-reset",
  "quiet-recovery",
  "food-and-reset",
  "campus-loop",
  "desk-stretch",
  "errand-route",
  "one-clear-message",
  "study-sync",
  "face-to-face-checkin",
] as const;

const fitValues = ["good", "partial", "poor"] as const;
const reuseValues = ["yes", "maybe", "no"] as const;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type EventName = (typeof eventNames)[number];
type QuestionKey = (typeof questionOrder)[number];
type SafeProperties = Record<string, string | number>;

type ValidationEvent = {
  event: EventName;
  runId: string;
  properties: SafeProperties;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(record: Record<string, unknown>, keys: readonly string[]) {
  const actualKeys = Object.keys(record);
  return actualKeys.length === keys.length && actualKeys.every((key) => keys.includes(key));
}

function isOneOf<const T extends readonly unknown[]>(value: unknown, allowed: T): value is T[number] {
  return allowed.some((candidate) => candidate === value);
}

function isEventName(value: unknown): value is EventName {
  return isOneOf(value, eventNames);
}

function isQuestionKey(value: unknown): value is QuestionKey {
  return isOneOf(value, questionOrder);
}

function isAnswerForQuestion(question: QuestionKey, answer: unknown) {
  return isOneOf(answer, answerValues[question]);
}

function parseStepProperties(value: unknown): SafeProperties | null {
  if (!isRecord(value) || !hasExactKeys(value, ["step", "question", "answer"])) return null;

  const { step, question, answer } = value;
  if (!Number.isInteger(step) || typeof step !== "number" || step < 1 || step > questionOrder.length) {
    return null;
  }
  if (!isQuestionKey(question) || questionOrder[step - 1] !== question) return null;
  if (!isAnswerForQuestion(question, answer)) return null;

  return { step, question, answer } as SafeProperties;
}

const recommendationPropertyKeys = [
  "recommendationId",
  "recommendationRank",
  "minutes",
  "energy",
  "goal",
  "place",
  "tool",
  "blocker",
] as const;

function parseRecommendationProperties(
  value: unknown,
  feedback = false,
): SafeProperties | null {
  if (!isRecord(value)) return null;

  const expectedKeys = feedback
    ? [...recommendationPropertyKeys, "helpfulness", "fit", "reuse"]
    : recommendationPropertyKeys;
  if (!hasExactKeys(value, expectedKeys)) return null;

  if (!isOneOf(value.recommendationId, recommendationIds)) return null;
  if (
    typeof value.recommendationRank !== "number" ||
    !Number.isInteger(value.recommendationRank) ||
    value.recommendationRank < 1 ||
    value.recommendationRank > 3
  ) {
    return null;
  }
  if (!isOneOf(value.minutes, answerValues.minutes)) return null;
  if (!isOneOf(value.energy, answerValues.energy)) return null;
  if (!isOneOf(value.goal, answerValues.goal)) return null;
  if (!isOneOf(value.place, answerValues.place)) return null;
  if (!isOneOf(value.tool, answerValues.tool)) return null;
  if (!isOneOf(value.blocker, answerValues.blocker)) return null;

  if (feedback) {
    if (
      typeof value.helpfulness !== "number" ||
      !Number.isInteger(value.helpfulness) ||
      value.helpfulness < 1 ||
      value.helpfulness > 5
    ) {
      return null;
    }
    if (!isOneOf(value.fit, fitValues) || !isOneOf(value.reuse, reuseValues)) return null;
  }

  return Object.fromEntries(
    expectedKeys.map((key) => [key, value[key] as string | number]),
  );
}

function parsePayload(value: unknown): ValidationEvent | null {
  if (!isRecord(value) || !hasExactKeys(value, ["event", "runId", "properties"])) return null;
  if (!isEventName(value.event) || typeof value.runId !== "string" || !uuidPattern.test(value.runId)) {
    return null;
  }

  let properties: SafeProperties | null = null;
  if (value.event === "wizard_start") {
    properties = isRecord(value.properties) && hasExactKeys(value.properties, []) ? {} : null;
  } else if (value.event === "step_complete") {
    properties = parseStepProperties(value.properties);
  } else {
    properties = parseRecommendationProperties(
      value.properties,
      value.event === "feedback_submit",
    );
  }

  if (!properties) return null;
  return { event: value.event, runId: value.runId.toLowerCase(), properties };
}

function firstHeaderValue(value: string | null) {
  return value?.split(",", 1)[0]?.trim() || null;
}

function isSameOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site" || fetchSite === "same-site") return false;

  const originHeader = request.headers.get("origin");
  if (!originHeader) return false;

  let origin: string;
  try {
    origin = new URL(originHeader).origin;
  } catch {
    return false;
  }

  const requestUrl = new URL(request.url);
  const allowedOrigins = new Set([requestUrl.origin]);
  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
  const host = forwardedHost ?? firstHeaderValue(request.headers.get("host"));
  const protocol =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) ??
    requestUrl.protocol.replace(":", "");

  if (host && (protocol === "http" || protocol === "https")) {
    allowedOrigins.add(`${protocol}://${host}`);
  }

  return allowedOrigins.has(origin);
}

async function readLimitedBody(request: Request) {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(body);
  } catch {
    return "";
  }
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function removeOldestEntry<Value>(map: Map<string, Value>) {
  const oldestKey = map.keys().next().value;
  if (oldestKey) map.delete(oldestKey);
}

function isRateLimited(runId: string, now: number) {
  const current = runWindows.get(runId);
  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    if (runWindows.size >= MAX_TRACKED_KEYS) removeOldestEntry(runWindows);
    runWindows.set(runId, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > MAX_EVENTS_PER_RUN;
}

function isRecentDuplicate(event: ValidationEvent, now: number) {
  const fingerprint = JSON.stringify(event);
  const lastSeen = recentEvents.get(fingerprint);
  recentEvents.delete(fingerprint);
  recentEvents.set(fingerprint, now);
  if (recentEvents.size > MAX_TRACKED_KEYS) removeOldestEntry(recentEvents);
  return lastSeen !== undefined && now - lastSeen < DUPLICATE_WINDOW_MS;
}

function reject(request: Request, startedAt: number, status: number, reason: string) {
  console.warn(
    JSON.stringify({
      level: "warn",
      msg: "validation_rejected",
      route: ROUTE,
      requestId: request.headers.get("x-vercel-id"),
      reason,
      ms: Date.now() - startedAt,
    }),
  );
  return jsonResponse({ ok: false, error: reason }, status);
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  if (!isSameOrigin(request)) {
    return reject(request, startedAt, 403, "forbidden_origin");
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    return reject(request, startedAt, 415, "unsupported_media_type");
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isInteger(contentLength) || contentLength < 1) {
      return reject(request, startedAt, 400, "invalid_body");
    }
    if (contentLength > MAX_BODY_BYTES) {
      return reject(request, startedAt, 413, "body_too_large");
    }
  }

  let rawBody: string | null;
  try {
    rawBody = await readLimitedBody(request);
  } catch {
    return reject(request, startedAt, 400, "invalid_body");
  }
  if (rawBody === null) {
    return reject(request, startedAt, 413, "body_too_large");
  }
  if (!rawBody) {
    return reject(request, startedAt, 400, "invalid_body");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return reject(request, startedAt, 400, "invalid_json");
  }

  const validationEvent = parsePayload(body);
  if (!validationEvent) {
    return reject(request, startedAt, 400, "invalid_payload");
  }

  const now = Date.now();
  if (isRateLimited(validationEvent.runId, now)) {
    return reject(request, startedAt, 429, "rate_limited");
  }
  if (isRecentDuplicate(validationEvent, now)) {
    return jsonResponse({ ok: true, duplicate: true }, 200);
  }

  console.log(
    JSON.stringify({
      level: "info",
      msg: "validation_event",
      route: ROUTE,
      requestId: request.headers.get("x-vercel-id"),
      recordedAt: new Date(now).toISOString(),
      runId: validationEvent.runId,
      event: validationEvent.event,
      properties: validationEvent.properties,
      ms: Date.now() - startedAt,
    }),
  );

  return jsonResponse({ ok: true }, 200);
}
