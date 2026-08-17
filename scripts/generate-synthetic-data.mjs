import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "public", "data");
fs.mkdirSync(outputDir, { recursive: true });

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffled(values, seed) {
  const result = [...values];
  const random = seededRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function repeated(value, count) {
  return Array.from({ length: count }, () => value);
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filename, columns, rows) {
  const lines = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ];
  fs.writeFileSync(path.join(outputDir, filename), `${lines.join("\n")}\n`, "utf8");
}

const statuses = shuffled(
  [
    ...repeated("completed", 55),
    ...repeated("abandoned", 20),
    ...repeated("not_started", 29),
  ],
  20260817,
);

const attributePlans = {
  time_band: {
    completed: { morning: 15, afternoon: 24, evening: 16 },
    abandoned: { morning: 4, afternoon: 10, evening: 6 },
    not_started: { morning: 5, afternoon: 15, evening: 9 },
  },
  gap_bucket: {
    completed: { "20-39": 10, "40-59": 20, "60-89": 17, "90+": 8 },
    abandoned: { "20-39": 7, "40-59": 6, "60-89": 4, "90+": 3 },
    not_started: { "20-39": 11, "40-59": 8, "60-89": 6, "90+": 4 },
  },
  energy_segment: {
    completed: { low: 10, medium: 29, high: 16 },
    abandoned: { low: 8, medium: 8, high: 4 },
    not_started: { low: 11, medium: 12, high: 6 },
  },
};

function buildAttributeQueues(plan, seed) {
  return Object.fromEntries(
    Object.entries(plan).map(([status, counts], statusIndex) => {
      const values = Object.entries(counts).flatMap(([value, count]) => repeated(value, count));
      return [status, shuffled(values, seed + statusIndex * 97)];
    }),
  );
}

const attributeQueues = Object.fromEntries(
  Object.entries(attributePlans).map(([attribute, plan], index) => [
    attribute,
    buildAttributeQueues(plan, 3400 + index * 1000),
  ]),
);
const attributeCursors = Object.fromEntries(
  Object.keys(attributePlans).map((attribute) => [
    attribute,
    { completed: 0, abandoned: 0, not_started: 0 },
  ]),
);

function takeAttribute(attribute, status) {
  const cursor = attributeCursors[attribute][status];
  attributeCursors[attribute][status] += 1;
  return attributeQueues[attribute][status][cursor];
}

const participantSessionCounts = [
  ...repeated(1, 12),
  ...repeated(2, 10),
  ...repeated(3, 8),
  ...repeated(4, 6),
  ...repeated(5, 2),
  ...repeated(7, 2),
];

const participantPool = shuffled(
  participantSessionCounts.flatMap((count, participantIndex) =>
    repeated(`P${String(participantIndex + 1).padStart(3, "0")}`, count),
  ),
  7788,
);

const gapRanges = {
  "20-39": [20, 39],
  "40-59": [40, 59],
  "60-89": [60, 89],
  "90+": [90, 115],
};
const energyScores = { low: [1, 2], medium: [3], high: [4, 5] };
const hourRanges = { morning: [9, 11], afternoon: [12, 16], evening: [17, 20] };
const goalOptions = ["focus", "recharge", "movement", "small_task"];
const locations = ["library", "cafe", "outside", "lounge"];
const routineByCategory = {
  study: ["강의노트 핵심 3줄 정리", "과제 소단위 한 개 완성", "시험 범위 5문제 복습"],
  recovery: ["화면 없이 천천히 걷기", "호흡과 물 마시기", "조용한 자리에서 눈 쉬기"],
  exercise: ["캠퍼스 한 바퀴 걷기", "계단과 스트레칭 루틴", "가벼운 야외 움직임"],
  admin: ["메일과 일정 세 개 정리", "제출 목록 우선순위 정리", "다음 수업 준비물 점검"],
};
const random = seededRandom(481516);

function randomInteger(minimum, maximum) {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

function categoryFor(goal, energySegment) {
  if (goal === "focus") return "study";
  if (goal === "small_task") return "admin";
  if (goal === "movement" && energySegment !== "low") return "exercise";
  return "recovery";
}

function recommendedMinutesFor(bucket) {
  const choices = {
    "20-39": [10, 15, 20],
    "40-59": [25, 30, 35],
    "60-89": [40, 45, 55],
    "90+": [55, 60, 75],
  };
  const values = choices[bucket];
  return values[randomInteger(0, values.length - 1)];
}

const records = statuses.map((status, index) => {
  const timeBand = takeAttribute("time_band", status);
  const gapBucket = takeAttribute("gap_bucket", status);
  const energySegment = takeAttribute("energy_segment", status);
  const [gapMinimum, gapMaximum] = gapRanges[gapBucket];
  const [hourMinimum, hourMaximum] = hourRanges[timeBand];
  const energyValues = energyScores[energySegment];
  const goal = goalOptions[randomInteger(0, goalOptions.length - 1)];
  const category = categoryFor(goal, energySegment);
  const routineOptions = routineByCategory[category];
  const recommendedMinutes = recommendedMinutesFor(gapBucket);
  const dayOffset = index % 10;
  const day = 4 + dayOffset;
  const hour = randomInteger(hourMinimum, hourMaximum);
  const minute = [0, 10, 20, 30, 40, 50][randomInteger(0, 5)];
  const started = status !== "not_started" ? 1 : 0;
  const completed = status === "completed" ? 1 : 0;

  return {
    data_source: "synthetic_course_demo",
    participant_id: participantPool[index],
    session_id: `S${String(index + 1).padStart(4, "0")}`,
    session_no: 0,
    occurred_at: `2026-08-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+09:00`,
    day_type: day === 8 || day === 9 ? "weekend" : "weekday",
    time_band: timeBand,
    gap_minutes: randomInteger(gapMinimum, gapMaximum),
    gap_bucket: gapBucket,
    energy_score: energyValues[randomInteger(0, energyValues.length - 1)],
    energy_segment: energySegment,
    location: locations[randomInteger(0, locations.length - 1)],
    goal,
    recommended_category: category,
    recommended_routine: routineOptions[randomInteger(0, routineOptions.length - 1)],
    recommended_minutes: recommendedMinutes,
    recommendation_shown: 1,
    started,
    start_delay_sec: started ? randomInteger(8, 93) : "",
    completion_status: status,
    completed,
    actual_minutes:
      status === "completed"
        ? Math.max(1, Math.round(recommendedMinutes * (0.8 + random() * 0.35)))
        : status === "abandoned"
          ? Math.max(1, Math.round(recommendedMinutes * (0.15 + random() * 0.55)))
          : "",
    survey_responded: 0,
    helpfulness_score: "",
    reuse_intent_score: "",
    feedback_tag: "",
  };
});

const sessionNumberByParticipant = new Map();
for (const record of records) {
  const nextNumber = (sessionNumberByParticipant.get(record.participant_id) ?? 0) + 1;
  sessionNumberByParticipant.set(record.participant_id, nextNumber);
  record.session_no = nextNumber;
}

const completedIndices = shuffled(
  records.map((record, index) => (record.completed ? index : -1)).filter((index) => index >= 0),
  91011,
).slice(0, 44);
const abandonedIndices = shuffled(
  records.map((record, index) => (record.completion_status === "abandoned" ? index : -1)).filter((index) => index >= 0),
  121314,
).slice(0, 6);
const surveyIndices = shuffled([...completedIndices, ...abandonedIndices], 151617);
const helpfulnessScores = shuffled(
  [...repeated(5, 20), ...repeated(4, 20), ...repeated(3, 7), ...repeated(2, 3)],
  181920,
);
const reuseScores = shuffled(
  [...repeated(5, 20), ...repeated(4, 19), ...repeated(3, 7), ...repeated(2, 3), 1],
  212223,
);

surveyIndices.forEach((recordIndex, surveyIndex) => {
  const record = records[recordIndex];
  const helpfulness = helpfulnessScores[surveyIndex];
  record.survey_responded = 1;
  record.helpfulness_score = helpfulness;
  record.reuse_intent_score = reuseScores[surveyIndex];
  record.feedback_tag =
    helpfulness >= 4
      ? surveyIndex % 2 === 0
        ? "fit_time"
        : "easy_start"
      : record.completion_status === "abandoned"
        ? "too_long"
        : record.energy_segment === "low"
          ? "low_energy"
          : "irrelevant";
});

const sessionColumns = [
  "data_source",
  "participant_id",
  "session_id",
  "session_no",
  "occurred_at",
  "day_type",
  "time_band",
  "gap_minutes",
  "gap_bucket",
  "energy_score",
  "energy_segment",
  "location",
  "goal",
  "recommended_category",
  "recommended_routine",
  "recommended_minutes",
  "recommendation_shown",
  "started",
  "start_delay_sec",
  "completion_status",
  "completed",
  "actual_minutes",
  "survey_responded",
  "helpfulness_score",
  "reuse_intent_score",
  "feedback_tag",
];

writeCsv("synthetic_validation_sessions.csv", sessionColumns, records);

const eventRows = [];
let eventNumber = 1;
function addEvent(sessionId, participantId, occurredAt, eventName, funnelStep, eventValue = "") {
  eventRows.push({
    data_source: "synthetic_course_demo",
    event_id: `EV${String(eventNumber).padStart(4, "0")}`,
    session_id: sessionId,
    participant_id: participantId,
    occurred_at: occurredAt,
    event_name: eventName,
    funnel_step: funnelStep,
    event_value: eventValue,
  });
  eventNumber += 1;
}

for (const record of records) {
  addEvent(record.session_id, record.participant_id, record.occurred_at, "landing_view", 1);
  addEvent(record.session_id, record.participant_id, record.occurred_at, "routine_builder_start", 2);
  addEvent(record.session_id, record.participant_id, record.occurred_at, "recommendation_view", 3, record.recommended_category);
  if (record.started) addEvent(record.session_id, record.participant_id, record.occurred_at, "routine_start", 4);
  if (record.completed) addEvent(record.session_id, record.participant_id, record.occurred_at, "routine_complete", 5);
  if (record.survey_responded) addEvent(record.session_id, record.participant_id, record.occurred_at, "feedback_submit", 6, record.helpfulness_score);
}

for (let index = 105; index <= 142; index += 1) {
  const sessionId = `S${String(index).padStart(4, "0")}`;
  const minute = (index * 7) % 60;
  const occurredAt = `2026-08-${String(4 + (index % 10)).padStart(2, "0")}T13:${String(minute).padStart(2, "0")}:00+09:00`;
  addEvent(sessionId, "", occurredAt, "landing_view", 1);
  if (index <= 118) addEvent(sessionId, "", occurredAt, "routine_builder_start", 2);
}

writeCsv(
  "synthetic_event_log.csv",
  ["data_source", "event_id", "session_id", "participant_id", "occurred_at", "event_name", "funnel_step", "event_value"],
  eventRows,
);

const summaryRows = [
  { metric: "landing_sessions", numerator: 142, denominator: "", value: 142, unit: "sessions", target: "", definition: "landing_view 고유 세션" },
  { metric: "builder_start_rate", numerator: 118, denominator: 142, value: 83.1, unit: "percent", target: 75, definition: "routine_builder_start / landing_view" },
  { metric: "recommendation_reach_rate", numerator: 104, denominator: 118, value: 88.1, unit: "percent", target: 80, definition: "recommendation_view / routine_builder_start" },
  { metric: "routine_start_rate", numerator: 75, denominator: 104, value: 72.1, unit: "percent", target: 65, definition: "routine_start / recommendation_view" },
  { metric: "start_to_complete_rate", numerator: 55, denominator: 75, value: 73.3, unit: "percent", target: 65, definition: "routine_complete / routine_start" },
  { metric: "helpfulness_mean", numerator: 207, denominator: 50, value: 4.14, unit: "score_1_to_5", target: 4, definition: "helpfulness_score 평균" },
  { metric: "helpfulness_positive_rate", numerator: 40, denominator: 50, value: 80, unit: "percent", target: 75, definition: "helpfulness_score 4점 이상 비율" },
  { metric: "reuse_intent_mean", numerator: 204, denominator: 50, value: 4.08, unit: "score_1_to_5", target: 4, definition: "reuse_intent_score 평균" },
  { metric: "repeat_tester_rate", numerator: 28, denominator: 40, value: 70, unit: "percent", target: 50, definition: "2회 이상 이용한 가상 참여자 비율" },
];
writeCsv(
  "synthetic_kpi_summary.csv",
  ["metric", "numerator", "denominator", "value", "unit", "target", "definition"],
  summaryRows,
);

const count = (predicate) => records.filter(predicate).length;
const eventCount = (eventName) => eventRows.filter((row) => row.event_name === eventName).length;
const assertEqual = (actual, expected, label) => {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, received ${actual}`);
};

assertEqual(records.length, 104, "session count");
assertEqual(new Set(records.map((record) => record.participant_id)).size, 40, "participant count");
assertEqual(count((record) => record.started === 1), 75, "started count");
assertEqual(count((record) => record.completed === 1), 55, "completed count");
assertEqual(count((record) => record.survey_responded === 1), 50, "survey count");
assertEqual(records.reduce((sum, record) => sum + (Number(record.helpfulness_score) || 0), 0), 207, "helpfulness score sum");
assertEqual(records.reduce((sum, record) => sum + (Number(record.reuse_intent_score) || 0), 0), 204, "reuse score sum");
assertEqual(eventCount("landing_view"), 142, "landing events");
assertEqual(eventCount("routine_builder_start"), 118, "builder start events");
assertEqual(eventCount("recommendation_view"), 104, "recommendation events");
assertEqual(eventCount("routine_start"), 75, "routine start events");
assertEqual(eventCount("routine_complete"), 55, "routine complete events");
assertEqual(eventCount("feedback_submit"), 50, "feedback events");

fs.writeFileSync(
  path.join(outputDir, "README.md"),
  `# 틈새 사용자 검증 데이터\n\n본 폴더의 모든 데이터는 서비스 가설과 KPI 집계 방식을 설명하기 위해 생성한 **합성 시뮬레이션 데이터**입니다. 실제 사용자 조사 결과가 아닙니다.\n\n## 파일\n\n- \`synthetic_validation_sessions.csv\`: 가상 참여자 40명, 추천 노출 104세션의 입력·추천·시작·완료·설문 데이터\n- \`synthetic_event_log.csv\`: 랜딩부터 피드백까지 544개 이벤트의 퍼널 로그\n- \`synthetic_kpi_summary.csv\`: KPI 계산식, 분자·분모, 목표값을 정리한 요약\n\n## 핵심 정의\n\n- 추천 시작률 = \`routine_start / recommendation_view\`\n- 시작 후 완료율 = \`routine_complete / routine_start\`\n- 도움됨 긍정률 = 도움됨 점수 4점 이상 응답 / 전체 도움됨 응답\n- 다회 체험률 = 2회 이상 이용한 가상 참여자 / 전체 가상 참여자\n\n실제 검증 시 동일한 스키마에 실제 이벤트를 적재하고 \`data_source\`를 실제 수집 출처로 교체해야 합니다.\n`,
  "utf8",
);

console.log(`Generated ${records.length} sessions, ${eventRows.length} events, and ${summaryRows.length} KPI rows.`);
