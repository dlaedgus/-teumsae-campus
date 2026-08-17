export type AiChoice = "gpt" | "claude" | "gemini" | "copilot" | "perplexity" | "auto";
export type Purpose = "schedule" | "messages" | "research" | "study" | "routine" | "assistant";
export type AccessScope = "input" | "web" | "productivity" | "messages" | "files" | "broad";
export type Automation = "info" | "draft" | "confirm" | "safe_auto" | "broad_auto" | "maximum";
export type GuardLevel = "strict" | "personal" | "institutional" | "baseline";
export type Retention = "session" | "day" | "week" | "month" | "saved" | "revoke";

export type ConnectionAnswers = {
  ai: AiChoice;
  purpose: Purpose;
  access: AccessScope;
  automation: Automation;
  guard: GuardLevel;
  retention: Retention;
};

export type ConnectionValue = ConnectionAnswers[keyof ConnectionAnswers];

export type ConnectionQuestion = {
  key: keyof ConnectionAnswers;
  shortLabel: string;
  title: string;
  description: string;
  options: readonly {
    value: ConnectionValue;
    label: string;
    note: string;
    flag?: "recommended" | "caution";
  }[];
};

export const connectionQuestions: readonly ConnectionQuestion[] = [
  {
    key: "ai",
    shortLabel: "AI",
    title: "어떤 AI를 중심으로 활용하고 싶으신가요?",
    description:
      "선호를 고르는 단계입니다. 선택한 AI로 데이터가 전송되거나 계정이 연결되지는 않습니다.",
    options: [
      { value: "gpt", label: "GPT", note: "여러 종류의 일을 폭넓게 처리" },
      { value: "claude", label: "Claude", note: "긴 글과 문서 작업에 집중" },
      { value: "gemini", label: "Gemini", note: "Google 기반 작업과 함께 활용" },
      { value: "copilot", label: "Copilot", note: "Microsoft 기반 작업과 함께 활용" },
      { value: "perplexity", label: "Perplexity", note: "검색과 정보 조사에 활용" },
      { value: "auto", label: "아직 모르겠음", note: "목적에 맞는 방식을 먼저 설계", flag: "recommended" },
    ],
  },
  {
    key: "purpose",
    shortLabel: "목적",
    title: "AI와 연결해 가장 먼저 해결하고 싶은 일은 무엇인가요?",
    description: "한 번에 모든 기능을 연결하지 않고, 가장 가치가 큰 한 가지부터 시작합니다.",
    options: [
      { value: "schedule", label: "일정과 할 일", note: "오늘의 우선순위와 마감 정리" },
      { value: "messages", label: "메시지 보조", note: "대화 요약과 답장 초안" },
      { value: "research", label: "검색과 정보", note: "자료 수집과 비교 정리" },
      { value: "study", label: "공부와 문서", note: "선택한 자료의 요약과 학습" },
      { value: "routine", label: "생활 루틴", note: "알림과 반복 일정 관리" },
      { value: "assistant", label: "개인 비서", note: "여러 일을 하나씩 확장" },
    ],
  },
  {
    key: "access",
    shortLabel: "정보 범위",
    title: "AI가 어디까지 참고하도록 설계할까요?",
    description:
      "현재 선택은 시뮬레이션용이며 실제 권한 요청이 아닙니다. 잠금 파일과 인증정보는 항상 제외합니다.",
    options: [
      { value: "input", label: "직접 입력한 내용만", note: "가장 적은 정보로 시작", flag: "recommended" },
      { value: "web", label: "인터넷 기록까지", note: "지정한 기간과 사이트만 참고" },
      { value: "productivity", label: "일정과 할 일까지", note: "선택한 캘린더와 알림만" },
      { value: "messages", label: "선택한 대화까지", note: "대화방과 기간을 직접 지정", flag: "caution" },
      { value: "files", label: "직접 고른 파일까지", note: "파일 선택기로 고른 항목만" },
      { value: "broad", label: "넓은 범위 요청", note: "민감정보 노출 가능성이 커 비추천", flag: "caution" },
    ],
  },
  {
    key: "automation",
    shortLabel: "자동화",
    title: "AI가 어느 정도까지 행동해도 될까요?",
    description:
      "발송, 게시, 삭제, 결제, 계정 변경은 어떤 선택에서도 자동 실행 대상으로 추천하지 않습니다.",
    options: [
      { value: "info", label: "정보만 알려주기", note: "읽고 정리한 결과만 제공" },
      { value: "draft", label: "초안까지 만들기", note: "실행은 사용자가 직접", flag: "recommended" },
      { value: "confirm", label: "매번 확인 후 실행", note: "모든 행동 전에 승인 요청" },
      { value: "safe_auto", label: "낮은 위험만 자동", note: "승인된 알림과 정리만" },
      { value: "broad_auto", label: "중요한 일만 확인", note: "나머지는 자동 처리", flag: "caution" },
      { value: "maximum", label: "최대한 자동 처리", note: "단계적 확대가 필요한 선택", flag: "caution" },
    ],
  },
  {
    key: "guard",
    shortLabel: "보호 수준",
    title: "민감한 정보는 어느 수준까지 제외할까요?",
    description:
      "비밀번호, 인증번호, 신분증 원본, 잠금·암호화·시스템 파일은 모든 수준에서 기본 차단합니다.",
    options: [
      { value: "strict", label: "엄격하게 보호", note: "금융·건강·대화·사진·위치·비공개 문서 제외", flag: "recommended" },
      { value: "personal", label: "개인 영역 보호", note: "금융·건강·사적 대화·사진·위치 제외" },
      { value: "institutional", label: "학교·직장 자료 보호", note: "비공개 문서와 금융·건강 정보 제외" },
      { value: "baseline", label: "기본 보호만", note: "필수 차단 항목 외에는 범위에 포함", flag: "caution" },
    ],
  },
  {
    key: "retention",
    shortLabel: "기억 기간",
    title: "참고한 내용을 얼마나 오래 기억하게 할까요?",
    description: "필요한 기간만 남기고 자동 삭제 시점을 미리 정하는 방식이 안전합니다.",
    options: [
      { value: "session", label: "이용 후 바로 삭제", note: "이번 작업이 끝나면 제거", flag: "recommended" },
      { value: "day", label: "24시간", note: "다음 날 자동 삭제" },
      { value: "week", label: "7일", note: "짧은 프로젝트에 적합" },
      { value: "month", label: "30일", note: "정기적으로 검토 필요" },
      { value: "saved", label: "저장한 내용만", note: "사용자가 고른 결과만 유지" },
      { value: "revoke", label: "철회할 때까지", note: "장기 보관이므로 비추천", flag: "caution" },
    ],
  },
] as const;

const labels = {
  ai: {
    gpt: "GPT",
    claude: "Claude",
    gemini: "Gemini",
    copilot: "Copilot",
    perplexity: "Perplexity",
    auto: "목적에 맞춰 선택",
  },
  purpose: {
    schedule: "일정과 할 일",
    messages: "메시지 보조",
    research: "검색과 정보",
    study: "공부와 문서",
    routine: "생활 루틴",
    assistant: "개인 비서",
  },
  access: {
    input: "직접 입력한 내용만",
    web: "지정한 인터넷 기록",
    productivity: "선택한 일정과 할 일",
    messages: "선택한 대화",
    files: "직접 고른 파일",
    broad: "보호 항목을 제외한 넓은 범위",
  },
  automation: {
    info: "정보만 제공",
    draft: "초안까지 생성",
    confirm: "매번 확인 후 실행",
    safe_auto: "낮은 위험 작업만 자동",
    broad_auto: "중요한 작업만 확인",
    maximum: "최대한 자동 처리 요청",
  },
  guard: {
    strict: "엄격 보호",
    personal: "개인 영역 보호",
    institutional: "학교·직장 자료 보호",
    baseline: "기본 보호",
  },
  retention: {
    session: "이용 후 바로 삭제",
    day: "24시간",
    week: "7일",
    month: "30일",
    saved: "저장한 내용만",
    revoke: "직접 철회할 때까지",
  },
} as const;

const accessScore: Record<AccessScope, number> = {
  input: 0,
  web: 1,
  productivity: 2,
  messages: 3,
  files: 3,
  broad: 5,
};

const automationScore: Record<Automation, number> = {
  info: 0,
  draft: 1,
  confirm: 2,
  safe_auto: 3,
  broad_auto: 4,
  maximum: 5,
};

const retentionScore: Record<Retention, number> = {
  session: 0,
  day: 1,
  week: 2,
  month: 3,
  saved: 2,
  revoke: 5,
};

const guardOpenness: Record<GuardLevel, number> = {
  strict: 0,
  personal: 1,
  institutional: 2,
  baseline: 5,
};

const purposeWeight: Record<Purpose, number> = {
  schedule: 0,
  messages: 2,
  research: 0,
  study: 0,
  routine: 1,
  assistant: 3,
};

const minimumAccess: Record<Purpose, { scope: AccessScope; label: string; rule: string }> = {
  schedule: {
    scope: "productivity",
    label: "선택한 일정·할 일 읽기",
    rule: "일정 추가·변경은 매번 확인",
  },
  messages: {
    scope: "messages",
    label: "선택한 대화방과 기간",
    rule: "답장 발송은 항상 직접 확인",
  },
  research: {
    scope: "web",
    label: "현재 질문과 지정한 검색 기록",
    rule: "메신저와 파일 접근은 제외",
  },
  study: {
    scope: "files",
    label: "사용자가 직접 고른 파일",
    rule: "전체 폴더 접근은 제외",
  },
  routine: {
    scope: "productivity",
    label: "선택한 일정·할 일과 알림",
    rule: "실시간 위치와 메시지는 기본 제외",
  },
  assistant: {
    scope: "input",
    label: "직접 입력한 정보부터 시작",
    rule: "기능별로 권한을 하나씩 추가",
  },
};

const purposeAccessOptions: Record<Purpose, readonly AccessScope[]> = {
  schedule: ["input", "productivity"],
  messages: ["input", "messages"],
  research: ["input", "web"],
  study: ["input", "files"],
  routine: ["input", "productivity"],
  assistant: ["input"],
};

const purposeSteps: Record<Purpose, readonly [string, string, string]> = {
  schedule: [
    "직접 입력한 일정 세 개로 우선순위 정리를 먼저 체험합니다.",
    "선택한 일정과 할 일만 읽어 오늘 계획과 알림 초안을 만듭니다.",
    "일정 추가나 변경은 내용을 확인한 뒤 사용자가 직접 승인합니다.",
  ],
  messages: [
    "예시 대화나 직접 붙여 넣은 내용으로 요약 방식을 먼저 확인합니다.",
    "선택한 대화방과 기간만 읽어 대화 요약과 답장 초안을 만듭니다.",
    "메시지 발송과 첨부파일 공유는 언제나 사용자가 직접 확인합니다.",
  ],
  research: [
    "현재 질문과 직접 고른 검색 결과만으로 비교 정리를 체험합니다.",
    "승인한 기간과 사이트의 기록만 참고해 자료를 분류하고 요약합니다.",
    "정기 브리핑은 주제와 실행 시간을 확인한 뒤 제한적으로 등록합니다.",
  ],
  study: [
    "예시 문서나 직접 고른 파일 한 개로 요약 품질을 먼저 확인합니다.",
    "사용자가 선택한 자료만 읽어 요약과 학습 노트 초안을 만듭니다.",
    "저장 위치와 파일명을 확인한 뒤 사용자가 직접 결과를 저장합니다.",
  ],
  routine: [
    "현재 루틴을 직접 입력해 알림과 순서 제안을 먼저 체험합니다.",
    "선택한 일정과 할 일만 참고해 오늘의 루틴과 알림 초안을 만듭니다.",
    "승인한 알림만 자동 등록하고 다른 행동은 매번 확인합니다.",
  ],
  assistant: [
    "가장 필요한 기능 하나를 정하고 직접 입력한 정보로 먼저 체험합니다.",
    "한 기능이 안정적으로 맞을 때만 필요한 정보 범위를 한 단계 추가합니다.",
    "발송·삭제·결제·계정 변경은 자동화하지 않고 항상 별도 확인합니다.",
  ],
};

const guardExclusions: Record<GuardLevel, string[]> = {
  strict: ["금융·결제 정보", "건강·의료 정보", "사적 대화·사진", "실시간 위치", "학교·직장 비공개 문서"],
  personal: ["금융·결제 정보", "건강·의료 정보", "사적 대화·사진", "실시간 위치"],
  institutional: ["금융·결제 정보", "건강·의료 정보", "학교·직장 비공개 문서"],
  baseline: [],
};

const alwaysExcluded = [
  "비밀번호와 인증번호",
  "신분증 원본",
  "잠금·암호화·시스템 파일",
  "결제·삭제·발송의 자동 실행",
];

export type ConnectionProfile = {
  name: string;
  summary: string;
  riskLabel: "최소 연결" | "제한 연결" | "주의 연결" | "단계적 연결 필요";
  riskScore: number;
  selectedAccess: string;
  recommendedAccess: string;
  recommendedRule: string;
  isScopeBroaderThanNeeded: boolean;
  exclusions: string[];
  actionPolicy: string;
  retention: string;
  steps: readonly [string, string, string];
  ai: string;
  purpose: string;
};

export function getConnectionLabel<Key extends keyof ConnectionAnswers>(
  key: Key,
  value: ConnectionAnswers[Key],
) {
  const map = labels[key] as Record<string, string>;
  return map[String(value)];
}

export function isConnectionComplete(
  answers: Partial<ConnectionAnswers>,
): answers is ConnectionAnswers {
  return connectionQuestions.every((question) => answers[question.key] !== undefined);
}

export function createConnectionProfile(answers: ConnectionAnswers): ConnectionProfile {
  const riskScore =
    accessScore[answers.access] * 3 +
    automationScore[answers.automation] * 4 +
    retentionScore[answers.retention] * 2 +
    guardOpenness[answers.guard] * 3 +
    purposeWeight[answers.purpose];

  const riskLabel =
    riskScore <= 14
      ? "최소 연결"
      : riskScore <= 27
        ? "제한 연결"
        : riskScore <= 40
          ? "주의 연결"
          : "단계적 연결 필요";

  const isExpansionProfile =
    answers.access === "broad" ||
    answers.automation === "broad_auto" ||
    answers.automation === "maximum" ||
    answers.retention === "revoke";

  let name = "가벼운 안내선";
  if (isExpansionProfile) name = "단계형 확장선";
  else if (answers.purpose === "messages" || answers.access === "messages") name = "대화 보조선";
  else if (answers.automation === "confirm") name = "확인형 실행선";
  else if (
    (answers.purpose === "schedule" || answers.purpose === "routine") &&
    answers.automation === "safe_auto"
  ) {
    name = "선택형 루틴선";
  } else if (
    (answers.purpose === "research" || answers.purpose === "study") &&
    (answers.automation === "info" || answers.automation === "draft")
  ) {
    name = "정돈된 작업선";
  }

  const actionPolicy: Record<Automation, string> = {
    info: "읽기와 정리만 수행하고 행동은 실행하지 않음",
    draft: "초안과 실행 방법만 만들고 사용자가 직접 처리",
    confirm: "모든 행동 전에 내용과 대상을 보여주고 승인 요청",
    safe_auto: "승인된 알림·분류만 자동화하고 나머지는 확인",
    broad_auto: "선택은 존중하되 발송·삭제·결제는 항상 별도 확인",
    maximum: "전체 자동화 대신 기능별 검토를 거쳐 단계적으로 확대",
  };

  const minimum = minimumAccess[answers.purpose];
  const ai = getConnectionLabel("ai", answers.ai);
  const purpose = getConnectionLabel("purpose", answers.purpose);

  return {
    name,
    summary: `${ai}를 활용해 ${purpose} 작업을 돕되, 필요한 정보만 선택하고 위험한 행동은 사용자가 확인하는 방식입니다.`,
    riskLabel,
    riskScore,
    selectedAccess: getConnectionLabel("access", answers.access),
    recommendedAccess: minimum.label,
    recommendedRule: minimum.rule,
    isScopeBroaderThanNeeded: !purposeAccessOptions[answers.purpose].includes(
      answers.access,
    ),
    exclusions: [...alwaysExcluded, ...guardExclusions[answers.guard]],
    actionPolicy: actionPolicy[answers.automation],
    retention: getConnectionLabel("retention", answers.retention),
    steps: purposeSteps[answers.purpose],
    ai,
    purpose,
  };
}
