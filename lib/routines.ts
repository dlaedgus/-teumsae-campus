export type Minutes = 20 | 30 | 40 | 60 | 90;
export type Energy = "drained" | "tired" | "steady" | "charged";
export type Goal = "focus" | "review" | "admin" | "recharge" | "movement" | "connect";
export type Place = "library" | "classroom" | "cafe" | "outside" | "transit" | "anywhere";
export type Tool = "laptop" | "tablet" | "paper" | "phone" | "none";
export type Blocker = "unclear" | "tired" | "distracted" | "overloaded" | "place" | "none";

export type Answers = {
  minutes: Minutes;
  energy: Energy;
  goal: Goal;
  place: Place;
  tool: Tool;
  blocker: Blocker;
};

export type AnswerValue = Answers[keyof Answers];

export type Question = {
  key: keyof Answers;
  shortLabel: string;
  title: string;
  description: string;
  options: readonly {
    value: AnswerValue;
    label: string;
    note: string;
  }[];
};

export const questions: readonly Question[] = [
  {
    key: "minutes",
    shortLabel: "시간",
    title: "다음 일정까지 실제로 쓸 수 있는 시간은 얼마인가요?",
    description: "이동과 정리 시간을 빼고, 지금 바로 사용할 수 있는 시간을 골라주세요.",
    options: [
      { value: 20, label: "20분", note: "작은 일 하나를 닫기" },
      { value: 30, label: "30분", note: "짧게 몰입하고 정리하기" },
      { value: 40, label: "40분", note: "결과물 한 덩어리 남기기" },
      { value: 60, label: "60분", note: "집중과 전환을 함께 구성하기" },
      { value: 90, label: "90분 이상", note: "두 번의 실행 구간으로 나누기" },
    ],
  },
  {
    key: "energy",
    shortLabel: "에너지",
    title: "지금 몸과 머리의 에너지는 어느 쪽인가요?",
    description: "평소 컨디션이 아니라, 이 순간 바로 실행할 수 있는 수준을 기준으로 골라주세요.",
    options: [
      { value: "drained", label: "거의 방전", note: "회복부터 필요해요" },
      { value: "tired", label: "조금 지침", note: "작게 시작하면 가능해요" },
      { value: "steady", label: "보통", note: "한 가지에 집중할 수 있어요" },
      { value: "charged", label: "꽤 충전", note: "하나를 확실히 끝낼 수 있어요" },
    ],
  },
  {
    key: "goal",
    shortLabel: "목표",
    title: "이번 공강이 끝났을 때 무엇이 남으면 좋을까요?",
    description: "해야 하는 일보다, 공강이 끝난 뒤 확인하고 싶은 변화를 골라주세요.",
    options: [
      { value: "focus", label: "과제 진도", note: "제출 가능한 결과를 남기기" },
      { value: "review", label: "시험 준비", note: "기억과 이해를 확인하기" },
      { value: "admin", label: "밀린 일 정리", note: "작은 업무를 닫아두기" },
      { value: "recharge", label: "머리 환기", note: "다음 수업 전 에너지 되찾기" },
      { value: "movement", label: "몸 움직이기", note: "굳은 몸과 집중을 깨우기" },
      { value: "connect", label: "사람과 연결", note: "부담 없는 연락 하나 남기기" },
    ],
  },
  {
    key: "place",
    shortLabel: "장소",
    title: "지금 가장 현실적으로 머물 수 있는 곳은 어디인가요?",
    description: "이상적인 장소가 아니라, 5분 안에 도착하거나 이미 머무는 곳을 골라주세요.",
    options: [
      { value: "library", label: "도서관", note: "조용한 자리와 책상 사용" },
      { value: "classroom", label: "빈 강의실", note: "넓은 책상과 말하기 가능" },
      { value: "cafe", label: "카페", note: "적당한 소음과 음료" },
      { value: "outside", label: "야외", note: "걷기와 화면 없는 활동" },
      { value: "transit", label: "이동 중", note: "앉거나 서서 짧게 실행" },
      { value: "anywhere", label: "어디든 괜찮음", note: "가장 가까운 곳에서 시작" },
    ],
  },
  {
    key: "tool",
    shortLabel: "도구",
    title: "지금 가장 편하게 사용할 수 있는 도구는 무엇인가요?",
    description: "준비하러 이동하지 않고, 현재 손에 있는 도구를 기준으로 골라주세요.",
    options: [
      { value: "laptop", label: "노트북", note: "문서와 과제 작업 가능" },
      { value: "tablet", label: "태블릿", note: "읽기와 필기 모두 가능" },
      { value: "paper", label: "종이·필기구", note: "정리와 회상에 집중" },
      { value: "phone", label: "휴대폰만", note: "짧은 기록과 연락 가능" },
      { value: "none", label: "도구 없이", note: "걷기와 생각 정리에 집중" },
    ],
  },
  {
    key: "blocker",
    shortLabel: "방해 요인",
    title: "지금 시작을 가장 방해하는 것은 무엇인가요?",
    description: "추천의 첫 단계를 바꾸는 질문입니다. 가장 가까운 하나만 골라주세요.",
    options: [
      { value: "unclear", label: "뭘 할지 모름", note: "결과물부터 작게 정해야 해요" },
      { value: "tired", label: "몸이 지침", note: "호흡과 자세부터 바꿔야 해요" },
      { value: "distracted", label: "집중이 흐림", note: "방해 요소를 먼저 닫아야 해요" },
      { value: "overloaded", label: "할 일이 너무 많음", note: "하나만 남기는 정리가 필요해요" },
      { value: "place", label: "장소가 불편함", note: "실행 가능한 자리부터 찾아야 해요" },
      { value: "none", label: "딱히 없음", note: "바로 핵심 행동으로 들어갈 수 있어요" },
    ],
  },
] as const;

type RoutineTemplate = {
  id: string;
  goal: Goal;
  title: string;
  summary: string;
  prepare: string;
  shortTask: string;
  mediumTask: string;
  longTask: string;
  secondTask: string;
  close: string;
  tools: readonly Tool[];
  places: readonly Place[];
  energies: readonly Energy[];
  blockers: readonly Blocker[];
  minMinutes: Minutes;
  maxMinutes: Minutes;
};

const routineTemplates: readonly RoutineTemplate[] = [
  {
    id: "deliverable-sprint",
    goal: "focus",
    title: "제출 단위 한 덩어리",
    summary: "막연한 과제를 제출 가능한 가장 작은 결과로 잘라 끝까지 가져갑니다.",
    prepare: "과제 파일을 열고 이번 공강의 완료 기준을 한 줄로 적기",
    shortTask: "가장 쉬운 문단이나 문제 한 개를 완성하기",
    mediumTask: "초안 한 단락 또는 계산 한 묶음을 완성하기",
    longTask: "핵심 파트 한 개를 초안에서 검토까지 끝내기",
    secondTask: "완성한 부분을 읽고 빠진 근거와 다음 작업을 표시하기",
    close: "파일을 저장하고 다음 시작점을 한 문장으로 남기기",
    tools: ["laptop", "tablet"],
    places: ["library", "classroom", "cafe", "anywhere"],
    energies: ["steady", "charged", "tired"],
    blockers: ["unclear", "distracted", "overloaded", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "three-point-outline",
    goal: "focus",
    title: "과제 구조 세 꼭지",
    summary: "작업 도구가 부족해도 과제의 뼈대와 다음 시작점을 남기는 루틴입니다.",
    prepare: "과제 주제를 한 문장으로 다시 적기",
    shortTask: "들어갈 내용 세 가지를 순서대로 정리하기",
    mediumTask: "서론·핵심·결론의 요지를 각각 두 문장으로 적기",
    longTask: "전체 목차와 각 단락의 근거를 한 줄씩 채우기",
    secondTask: "가장 먼저 작성할 단락의 첫 문장을 구체화하기",
    close: "작업 가능한 자리에서 바로 이어갈 첫 행동을 표시하기",
    tools: ["paper", "phone", "tablet"],
    places: ["outside", "transit", "classroom", "cafe", "anywhere"],
    energies: ["drained", "tired", "steady"],
    blockers: ["unclear", "place", "overloaded"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "mobile-micro-finish",
    goal: "focus",
    title: "휴대폰으로 끝내는 작은 과제",
    summary: "이동 중에도 가능한 조사·정리·메모만 골라 과제의 멈춤을 줄입니다.",
    prepare: "과제 안내와 마감 조건을 휴대폰에서 다시 확인하기",
    shortTask: "필요한 자료 세 개를 저장하고 한 줄씩 요약하기",
    mediumTask: "자료 다섯 개를 모아 주장과 근거로 분류하기",
    longTask: "자료 조사와 개요 메모를 함께 완성하기",
    secondTask: "컴퓨터에서 이어서 할 작업 순서를 세 단계로 적기",
    close: "메모 제목을 과제명으로 바꾸고 가장 위에 다음 행동을 고정하기",
    tools: ["phone"],
    places: ["transit", "outside", "cafe", "anywhere"],
    energies: ["tired", "steady", "charged"],
    blockers: ["place", "unclear", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "active-recall-loop",
    goal: "review",
    title: "회상과 오답 한 바퀴",
    summary: "읽기보다 먼저 기억을 꺼내고, 모르는 부분만 다시 보는 시험 준비 루틴입니다.",
    prepare: "오늘 확인할 범위를 한 단원 또는 세 개 개념으로 제한하기",
    shortTask: "책을 덮고 핵심 개념 다섯 개를 적은 뒤 바로 확인하기",
    mediumTask: "핵심 질문 열 개에 답하고 틀린 항목만 다시 풀기",
    longTask: "한 단원 회상 테스트와 오답 복습을 한 번 완료하기",
    secondTask: "틀린 이유를 유형별로 나누고 다시 한 번 회상하기",
    close: "다음 복습 때 첫 번째로 볼 오답 세 개를 표시하기",
    tools: ["paper", "tablet", "laptop"],
    places: ["library", "classroom", "cafe", "anywhere"],
    energies: ["steady", "charged", "tired"],
    blockers: ["distracted", "overloaded", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "one-page-map",
    goal: "review",
    title: "한 장 개념 지도",
    summary: "흩어진 내용을 한 장에 연결해 이해가 비는 부분을 찾습니다.",
    prepare: "가운데에 오늘 정리할 핵심 개념 하나를 적기",
    shortTask: "관련 개념 네 개를 선으로 연결하고 관계를 표시하기",
    mediumTask: "정의·예시·반례를 한 장 안에 배치하기",
    longTask: "한 단원의 개념 관계와 자주 틀리는 지점을 한 장으로 정리하기",
    secondTask: "지도를 보지 않고 구조를 말한 뒤 빠진 연결을 보완하기",
    close: "이해가 약한 연결 두 개에 다음 복습 표시를 남기기",
    tools: ["paper", "tablet", "laptop"],
    places: ["library", "classroom", "cafe", "anywhere"],
    energies: ["tired", "steady", "charged"],
    blockers: ["unclear", "overloaded", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "walk-and-recall",
    goal: "review",
    title: "걸으며 말하는 복습",
    summary: "화면을 보기 어려운 장소에서는 기억을 소리 내어 꺼내는 방식으로 바꿉니다.",
    prepare: "복습할 질문 세 개를 휴대폰 메모에 적거나 머릿속으로 정하기",
    shortTask: "걸으며 각 질문의 답을 한 번씩 설명하기",
    mediumTask: "핵심 개념을 처음 듣는 사람에게 말하듯 순서대로 설명하기",
    longTask: "한 단원을 세 구간으로 나눠 설명하고 막힌 부분을 기록하기",
    secondTask: "막힌 질문만 다시 설명하고 한 문장 답을 남기기",
    close: "정확히 말하지 못한 개념 두 개를 다음 복습 목록에 넣기",
    tools: ["none", "phone"],
    places: ["outside", "transit", "anywhere"],
    energies: ["drained", "tired", "steady"],
    blockers: ["place", "distracted", "tired"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "three-tabs-close",
    goal: "admin",
    title: "열린 일 세 건 닫기",
    summary: "작지만 계속 신경 쓰이던 업무를 세 건만 골라 완료 상태로 바꿉니다.",
    prepare: "메일·일정·제출 목록에서 오늘 닫을 세 건만 고르기",
    shortTask: "가장 짧은 업무 두 건을 바로 처리하기",
    mediumTask: "답장·예약·제출 확인 세 건을 순서대로 완료하기",
    longTask: "밀린 업무를 긴급도순으로 정리하고 상위 다섯 건을 처리하기",
    secondTask: "남은 업무의 날짜와 다음 행동을 명확히 적기",
    close: "완료된 항목을 지우고 내일 첫 업무 하나만 남기기",
    tools: ["laptop", "tablet", "phone"],
    places: ["library", "classroom", "cafe", "transit", "anywhere"],
    energies: ["tired", "steady", "charged"],
    blockers: ["overloaded", "unclear", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "deadline-map",
    goal: "admin",
    title: "마감과 다음 행동 정리",
    summary: "일이 너무 많을 때는 처리보다 우선순위와 첫 행동을 명확히 만드는 데 집중합니다.",
    prepare: "머릿속의 할 일을 전부 한 곳에 꺼내 적기",
    shortTask: "마감이 가까운 세 가지에 날짜와 첫 행동을 붙이기",
    mediumTask: "할 일을 이번 주·다음 주·보류로 나누고 상위 세 개를 정하기",
    longTask: "전체 일정과 과제 마감을 달력에 배치하고 충돌을 정리하기",
    secondTask: "가장 위험한 일정 하나의 준비 작업을 바로 시작하기",
    close: "다음 공강에 시작할 한 가지를 목록 맨 위에 고정하기",
    tools: ["paper", "phone", "tablet", "laptop"],
    places: ["library", "classroom", "cafe", "transit", "anywhere"],
    energies: ["drained", "tired", "steady"],
    blockers: ["overloaded", "unclear", "distracted"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "inbox-ten",
    goal: "admin",
    title: "받은 편지함 열 건 정리",
    summary: "휴대폰만 있어도 답장·보관·삭제로 미뤄 둔 소통 비용을 줄입니다.",
    prepare: "최근 받은 메시지와 메일에서 처리 기준을 답장·보관·삭제로 정하기",
    shortTask: "가장 오래된 항목 다섯 건을 처리하기",
    mediumTask: "중요 항목부터 열 건을 처리하고 필요한 일정은 바로 등록하기",
    longTask: "받은 편지함과 저장한 알림을 훑어 미처리 항목을 모두 분류하기",
    secondTask: "답장이 필요한 항목만 모아 짧게 회신하기",
    close: "추가 작업이 필요한 항목에 날짜와 담당자를 표시하기",
    tools: ["phone", "laptop", "tablet"],
    places: ["transit", "cafe", "library", "anywhere"],
    energies: ["tired", "steady", "charged"],
    blockers: ["overloaded", "place", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "screenless-reset",
    goal: "recharge",
    title: "화면 없는 감각 리셋",
    summary: "새로운 정보를 더 넣지 않고 시선과 호흡을 바꿔 다음 수업의 집중력을 준비합니다.",
    prepare: "휴대폰을 가방에 넣고 어깨와 턱의 힘을 풀기",
    shortTask: "천천히 걸으며 보이는 것과 들리는 것을 번갈아 관찰하기",
    mediumTask: "걷기·호흡·물 마시기를 순서대로 반복하기",
    longTask: "조용한 동선을 걷고 앉아서 충분히 쉬는 구간을 함께 갖기",
    secondTask: "남은 피로를 확인하고 다음 수업에 필요한 준비만 하기",
    close: "물을 마시고 다음 장소로 서두르지 않게 이동하기",
    tools: ["none", "phone"],
    places: ["outside", "classroom", "anywhere"],
    energies: ["drained", "tired", "steady"],
    blockers: ["tired", "distracted", "place"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "quiet-recovery",
    goal: "recharge",
    title: "조용한 자리에서 회복",
    summary: "움직임보다 안정이 필요한 상태에서 자극을 줄이고 몸의 긴장을 낮춥니다.",
    prepare: "조용한 자리를 잡고 알림을 모두 끄기",
    shortTask: "눈을 감고 천천히 호흡한 뒤 목과 손목을 풀기",
    mediumTask: "10분 휴식과 가벼운 스트레칭을 번갈아 진행하기",
    longTask: "짧은 수면 또는 깊은 휴식 뒤 천천히 몸을 깨우기",
    secondTask: "다음 수업에 필요한 물건만 꺼내며 상태를 전환하기",
    close: "물 한 잔과 가벼운 세안으로 마무리하기",
    tools: ["none", "phone"],
    places: ["library", "classroom", "anywhere"],
    energies: ["drained", "tired"],
    blockers: ["tired", "distracted", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "food-and-reset",
    goal: "recharge",
    title: "간단히 채우고 정리하기",
    summary: "배고픔과 피로가 섞였을 때 무리한 몰입보다 회복과 다음 준비를 함께 끝냅니다.",
    prepare: "필요한 음료나 간식을 하나만 고르고 자리를 정하기",
    shortTask: "천천히 먹으며 화면을 보지 않고 몸의 상태를 확인하기",
    mediumTask: "식사·물 마시기·짧은 산책을 차례로 진행하기",
    longTask: "충분히 식사하고 걷기와 휴식으로 소화를 돕기",
    secondTask: "다음 일정에 필요한 준비물과 이동 시간을 확인하기",
    close: "자리와 가방을 정리하고 여유 있게 이동하기",
    tools: ["none", "phone"],
    places: ["cafe", "outside", "anywhere"],
    energies: ["drained", "tired", "steady"],
    blockers: ["tired", "place", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "campus-loop",
    goal: "movement",
    title: "캠퍼스 한 바퀴",
    summary: "목적지를 하나 정한 걷기로 몸을 깨우고 다음 수업 전까지 돌아옵니다.",
    prepare: "다음 수업 장소를 기준으로 돌아올 수 있는 동선을 정하기",
    shortTask: "빠른 걸음으로 건물 한 바퀴를 걷기",
    mediumTask: "캠퍼스 동선을 걸으며 중간에 계단 한 구간을 포함하기",
    longTask: "긴 산책과 가벼운 스트레칭을 두 구간으로 나누기",
    secondTask: "돌아오는 길에는 속도를 낮추고 호흡을 정리하기",
    close: "물을 마시고 다음 수업 장소에 5분 일찍 도착하기",
    tools: ["none", "phone"],
    places: ["outside", "anywhere"],
    energies: ["tired", "steady", "charged"],
    blockers: ["distracted", "tired", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "desk-stretch",
    goal: "movement",
    title: "자리에서 푸는 전신 루틴",
    summary: "멀리 움직이기 어려운 장소에서 조용히 몸을 깨우는 구성입니다.",
    prepare: "주변을 확인하고 의자에서 안전하게 움직일 공간을 만들기",
    shortTask: "목·어깨·손목·허리를 차례로 풀기",
    mediumTask: "상체 스트레칭과 짧은 계단 걷기를 번갈아 진행하기",
    longTask: "전신 스트레칭과 건물 안 걷기를 두 세트 진행하기",
    secondTask: "불편한 부위를 중심으로 한 번 더 천천히 풀기",
    close: "호흡을 가라앉히고 물을 마신 뒤 자리를 정리하기",
    tools: ["none"],
    places: ["library", "classroom", "cafe", "transit", "anywhere"],
    energies: ["drained", "tired", "steady"],
    blockers: ["place", "tired", "distracted"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "errand-route",
    goal: "movement",
    title: "미뤄 둔 이동 한 번",
    summary: "걷기와 작은 심부름을 결합해 움직인 결과가 남도록 합니다.",
    prepare: "프린트·반납·구매 중 지금 끝낼 한 가지 목적지를 정하기",
    shortTask: "가장 가까운 목적지까지 빠르게 다녀오기",
    mediumTask: "두 개 목적지를 효율적인 순서로 연결해 다녀오기",
    longTask: "캠퍼스 안 미뤄 둔 이동 업무 세 건을 동선으로 묶기",
    secondTask: "돌아오는 길에 다음 수업 준비물을 확인하기",
    close: "완료한 일을 지우고 이동 기록을 정리하기",
    tools: ["phone", "none"],
    places: ["outside", "transit", "anywhere"],
    energies: ["steady", "charged", "tired"],
    blockers: ["overloaded", "place", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "one-clear-message",
    goal: "connect",
    title: "한 사람에게 구체적인 안부",
    summary: "여러 사람을 훑기보다 한 사람에게 답하기 쉬운 메시지 하나를 보냅니다.",
    prepare: "지금 떠오르는 사람 중 답장을 재촉하지 않을 한 명을 고르기",
    shortTask: "구체적인 기억이나 질문이 담긴 안부 한 번 보내기",
    mediumTask: "미뤄 둔 답장을 정리하고 필요한 약속 하나를 제안하기",
    longTask: "가까운 사람 두 명에게 각각 다른 내용의 연락을 남기기",
    secondTask: "답장이 오면 이어갈 질문을 한 줄로 준비하기",
    close: "보낸 뒤에는 답장을 기다리지 않고 다음 일정으로 전환하기",
    tools: ["phone", "laptop", "tablet"],
    places: ["library", "classroom", "cafe", "outside", "transit", "anywhere"],
    energies: ["drained", "tired", "steady", "charged"],
    blockers: ["unclear", "distracted", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "study-sync",
    goal: "connect",
    title: "스터디 동료와 10분 정렬",
    summary: "긴 회의 대신 진행 상황과 다음 행동만 맞추는 짧은 연결입니다.",
    prepare: "공유할 진행 상황과 막힌 점을 각각 한 줄로 적기",
    shortTask: "메시지로 진행 상황과 필요한 도움을 명확히 보내기",
    mediumTask: "10분 통화나 대화로 현재 상태와 다음 마감을 합의하기",
    longTask: "함께 할 일과 각자 할 일을 나누고 공유 문서를 정리하기",
    secondTask: "합의한 내용을 한 문단으로 정리해 다시 공유하기",
    close: "다음 확인 시점과 각자의 첫 행동을 남기기",
    tools: ["phone", "laptop", "tablet", "paper"],
    places: ["classroom", "cafe", "outside", "anywhere"],
    energies: ["steady", "charged", "tired"],
    blockers: ["overloaded", "unclear", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
  {
    id: "face-to-face-checkin",
    goal: "connect",
    title: "짧은 대면 체크인",
    summary: "가까운 사람과 지금 가능한 짧은 대화만 나누고 부담 없이 마칩니다.",
    prepare: "근처에 있는 사람 중 짧게 말을 걸 수 있는 한 명을 떠올리기",
    shortTask: "최근 상황을 묻고 내 근황도 한 문장으로 나누기",
    mediumTask: "음료나 산책을 함께하며 서로의 이번 주 한 가지를 듣기",
    longTask: "식사나 긴 산책으로 충분히 대화하되 종료 시간을 먼저 정하기",
    secondTask: "다음에 이어갈 이야기를 한 가지 남기기",
    close: "고맙다는 말을 전하고 다음 일정으로 자연스럽게 이동하기",
    tools: ["none", "phone"],
    places: ["classroom", "cafe", "outside", "anywhere"],
    energies: ["tired", "steady", "charged"],
    blockers: ["distracted", "place", "none"],
    minMinutes: 20,
    maxMinutes: 90,
  },
] as const;

const labelMap = {
  minutes: { 20: "20분", 30: "30분", 40: "40분", 60: "60분", 90: "90분 이상" },
  energy: { drained: "거의 방전", tired: "조금 지침", steady: "보통", charged: "꽤 충전" },
  goal: { focus: "과제 진도", review: "시험 준비", admin: "밀린 일 정리", recharge: "머리 환기", movement: "몸 움직이기", connect: "사람과 연결" },
  place: { library: "도서관", classroom: "빈 강의실", cafe: "카페", outside: "야외", transit: "이동 중", anywhere: "어디든 괜찮음" },
  tool: { laptop: "노트북", tablet: "태블릿", paper: "종이·필기구", phone: "휴대폰만", none: "도구 없이" },
  blocker: { unclear: "뭘 할지 모름", tired: "몸이 지침", distracted: "집중이 흐림", overloaded: "할 일이 너무 많음", place: "장소가 불편함", none: "방해 요인 없음" },
} as const;

const placeGuidance: Record<Place, string> = {
  library: "출입이 적고 소음이 낮은 자리를 고르세요.",
  classroom: "다음 수업에 방해되지 않는 범위에서 넓은 책상을 활용하세요.",
  cafe: "콘센트보다 오래 앉아도 편한 자리를 우선하세요.",
  outside: "그늘과 돌아올 시간을 먼저 확인하세요.",
  transit: "화면을 오래 보지 않아도 되는 행동부터 고르세요.",
  anywhere: "5분 안에 도착할 수 있는 가장 가까운 자리에서 시작하세요.",
};

const blockerWarmup: Record<Blocker, string> = {
  unclear: "이번 공강에 남길 결과를 한 문장으로 먼저 정하기",
  tired: "물을 마시고 네 번 깊게 호흡한 뒤 자세를 바꾸기",
  distracted: "알림을 끄고 지금 쓰지 않을 탭과 앱을 모두 닫기",
  overloaded: "할 일 세 개만 적고 지금 할 하나에 밑줄 긋기",
  place: "5분 안에 실행 가능한 자리나 동선을 먼저 확보하기",
  none: "필요한 것만 꺼내고 바로 첫 행동을 시작하기",
};

const energyReason: Record<Energy, string> = {
  drained: "에너지가 거의 남지 않아 준비 문턱을 낮추고 회복 여유를 확보했습니다.",
  tired: "조금 지친 상태에서도 끝낼 수 있도록 핵심 범위를 작게 잡았습니다.",
  steady: "현재 집중력을 한 가지 결과에 모을 수 있도록 구성했습니다.",
  charged: "충분한 에너지를 활용하되 공강 안에 끝나는 범위로 제한했습니다.",
};

const blockerReason: Record<Blocker, string> = {
  unclear: "첫 단계에서 완료 기준을 먼저 정합니다.",
  tired: "호흡과 자세를 바꾼 뒤 핵심 행동으로 들어갑니다.",
  distracted: "방해 요소를 닫는 시간을 루틴에 포함했습니다.",
  overloaded: "여러 할 일 중 하나만 남기도록 시작 단계를 설계했습니다.",
  place: "현재 장소에서 실제로 가능한 행동만 남겼습니다.",
  none: "별도 준비를 줄이고 핵심 행동에 시간을 더 배분했습니다.",
};

const adaptableVariants: Record<
  Goal,
  readonly [
    { title: string; summary: string; task: string },
    { title: string; summary: string; task: string },
    { title: string; summary: string; task: string },
  ]
> = {
  focus: [
    {
      title: "과제의 다음 시작점",
      summary: "현재 장소와 도구 안에서 과제를 다시 시작하기 쉬운 상태로 만듭니다.",
      task: "과제의 완료 기준을 한 줄로 정하고 가장 먼저 만들 내용 하나를 구체화하기",
    },
    {
      title: "과제 구조 세 꼭지",
      summary: "문서를 바로 만들기 어려워도 과제의 뼈대와 순서는 남길 수 있습니다.",
      task: "과제에 들어갈 핵심 세 가지를 정하고 작성하거나 풀 순서를 정리하기",
    },
    {
      title: "핵심 근거 한 묶음",
      summary: "지금 가능한 방식으로 주장과 근거를 연결해 다음 작업의 부담을 줄입니다.",
      task: "핵심 주장 하나와 이를 뒷받침할 근거 세 가지를 구체적으로 정리하기",
    },
  ],
  review: [
    {
      title: "말로 꺼내는 복습",
      summary: "화면이나 책상 없이도 기억을 먼저 꺼내 이해가 비는 곳을 찾습니다.",
      task: "오늘 범위의 핵심 개념 다섯 개를 보지 않고 설명한 뒤 막힌 항목을 기억하기",
    },
    {
      title: "세 문장 개념 정리",
      summary: "복잡한 내용을 정의·예시·차이의 세 문장으로 압축합니다.",
      task: "가장 중요한 개념을 정의·예시·비슷한 개념과의 차이로 나누어 설명하기",
    },
    {
      title: "모르는 것 세 가지",
      summary: "이미 아는 내용을 반복하기보다 다음 복습 지점을 선명하게 남깁니다.",
      task: "답하기 어려운 질문 세 개를 만들고 지금 설명할 수 있는 범위까지 답하기",
    },
  ],
  admin: [
    {
      title: "가장 가까운 일 하나",
      summary: "도구가 부족할 때는 처리보다 가장 먼저 닫을 일을 명확히 정합니다.",
      task: "해야 할 일을 떠올린 뒤 오늘 가장 먼저 끝낼 한 가지와 첫 행동을 정하기",
    },
    {
      title: "마감 순서 다시 세우기",
      summary: "흩어진 할 일을 마감과 부담 기준으로 다시 정렬합니다.",
      task: "할 일 세 가지를 마감 순서로 놓고 각각의 다음 행동을 한 문장으로 정하기",
    },
    {
      title: "미뤄 둔 결정 닫기",
      summary: "처리 도구가 없어도 계속 신경 쓰이던 결정 하나는 끝낼 수 있습니다.",
      task: "미뤄 둔 선택 한 가지의 기준을 세 개로 줄이고 지금 결론을 정하기",
    },
  ],
  recharge: [
    {
      title: "자극을 줄이는 리셋",
      summary: "현재 자리에서 새 정보를 더 넣지 않고 몸과 시선의 긴장을 낮춥니다.",
      task: "시선을 멀리 두고 천천히 호흡하며 목·어깨·손목의 힘을 차례로 풀기",
    },
    {
      title: "다음 수업 전 회복",
      summary: "움직임이 제한된 장소에서도 짧은 휴식과 준비를 함께 끝냅니다.",
      task: "알림과 화면을 멈추고 조용히 쉬었다가 다음 수업 준비물만 확인하기",
    },
    {
      title: "호흡과 감각 정리",
      summary: "장소를 옮기지 않고도 호흡과 주변 감각에 집중해 머리를 환기합니다.",
      task: "보이는 것·들리는 것·몸의 감각을 차례로 확인하며 호흡 속도를 낮추기",
    },
  ],
  movement: [
    {
      title: "자리에서 몸 깨우기",
      summary: "멀리 이동하기 어려운 곳에서도 방해되지 않는 범위로 몸을 풉니다.",
      task: "목·어깨·손목·허리를 차례로 풀고 가능한 범위에서 짧게 걷기",
    },
    {
      title: "짧은 이동 루프",
      summary: "현재 장소를 기준으로 돌아올 수 있는 짧은 동선을 만듭니다.",
      task: "다음 일정에 늦지 않는 동선을 정해 걷고 돌아오며 호흡을 정리하기",
    },
    {
      title: "굳은 몸 전환하기",
      summary: "큰 동작보다 지금 안전하게 할 수 있는 작은 움직임을 이어갑니다.",
      task: "앉기·서기·걷기를 번갈아 하며 가장 불편한 부위를 천천히 풀기",
    },
  ],
  connect: [
    {
      title: "한 사람을 위한 안부",
      summary: "지금 연락하기 어렵다면 다음에 바로 전할 구체적인 한 문장을 준비합니다.",
      task: "떠오르는 한 사람에게 묻고 싶은 구체적인 질문과 내 근황 한 문장을 정하기",
    },
    {
      title: "함께할 일 정렬하기",
      summary: "연락 수단이 제한돼도 다음 대화에서 맞출 핵심 내용을 먼저 정리합니다.",
      task: "함께하는 일의 현재 상태·막힌 점·다음 행동을 각각 한 문장으로 정하기",
    },
    {
      title: "가벼운 대화 준비",
      summary: "부담 없는 연결을 위해 짧게 나눌 주제와 종료 시점을 미리 정합니다.",
      task: "가까운 사람과 나눌 근황 하나와 상대에게 물을 질문 하나를 구체화하기",
    },
  ],
};

const adaptableFrame: Record<Goal, { prepare: string; close: string }> = {
  focus: {
    prepare: "지금 가능한 방식으로 과제의 완료 기준을 한 문장으로 정하기",
    close: "다음에 이어갈 첫 행동을 기억하거나 한 문장으로 남기기",
  },
  review: {
    prepare: "오늘 확인할 범위를 개념 세 개 또는 질문 세 개로 제한하기",
    close: "정확히 설명하지 못한 내용 두 개를 다음 복습 대상으로 정하기",
  },
  admin: {
    prepare: "머릿속의 할 일을 세 가지로 줄이고 가장 급한 하나를 정하기",
    close: "남은 일 중 다음에 시작할 한 가지와 시점을 분명히 정하기",
  },
  recharge: {
    prepare: "현재 자리에서 알림과 자극을 줄이고 몸의 긴장을 확인하기",
    close: "물을 마시고 다음 일정에 필요한 준비만 천천히 확인하기",
  },
  movement: {
    prepare: "주변을 확인하고 지금 안전하게 움직일 수 있는 범위를 정하기",
    close: "호흡을 가라앉히고 다음 일정에 늦지 않게 이동 준비하기",
  },
  connect: {
    prepare: "지금 떠오르는 사람 한 명과 나누고 싶은 주제를 정하기",
    close: "답이나 만남을 재촉하지 않고 다음에 이어갈 한 문장을 기억하기",
  },
};

export type RoutineStep = {
  label: string;
  minutes: number;
  task: string;
};

export type Recommendation = {
  id: string;
  title: string;
  summary: string;
  reason: string;
  outcome: string;
  place: string;
  tool: string;
  placeTip: string;
  matchLine: string;
  steps: readonly RoutineStep[];
};

export function getAnswerLabel<Key extends keyof Answers>(key: Key, value: Answers[Key]) {
  const labels = labelMap[key] as Record<string, string>;
  return labels[String(value)];
}

export function isAnswersComplete(answers: Partial<Answers>): answers is Answers {
  return questions.every((question) => answers[question.key] !== undefined);
}

function templateScore(template: RoutineTemplate, answers: Answers) {
  let score = 0;
  score += template.tools.includes(answers.tool) ? 14 : -18;
  score += template.places.includes(answers.place) ? 10 : -5;
  score += template.energies.includes(answers.energy) ? 6 : 0;
  score += template.blockers.includes(answers.blocker) ? 7 : 0;
  score += answers.minutes >= template.minMinutes && answers.minutes <= template.maxMinutes ? 5 : -6;

  const signature = `${template.id}-${answers.minutes}-${answers.energy}-${answers.place}-${answers.tool}-${answers.blocker}`;
  let hash = 0;
  for (let index = 0; index < signature.length; index += 1) {
    hash = (hash * 31 + signature.charCodeAt(index)) % 997;
  }
  return score + hash / 10000;
}

function taskForMinutes(template: RoutineTemplate, minutes: Minutes) {
  if (minutes <= 30) return template.shortTask;
  if (minutes <= 60) return template.mediumTask;
  return template.longTask;
}

function buildSteps(
  template: RoutineTemplate,
  answers: Answers,
  adaptedTask?: string,
  adaptedPrepare?: string,
  adaptedClose?: string,
): RoutineStep[] {
  const total = answers.minutes;
  const prepare = total === 20 ? 3 : total === 30 ? 4 : total === 40 ? 5 : total === 60 ? 7 : 10;
  const close = total === 20 ? 4 : total === 30 ? 5 : total === 40 ? 7 : total === 60 ? 8 : 10;
  const prepareTask =
    answers.blocker === "none"
      ? adaptedPrepare ?? template.prepare
      : blockerWarmup[answers.blocker];
  const closeTask = adaptedClose ?? template.close;

  if (total === 90) {
    const reset = 5;
    const core = total - prepare - close - reset;
    const first = Math.floor(core / 2);
    const second = core - first;
    return [
      { label: "준비", minutes: prepare, task: prepareTask },
      { label: "1차 실행", minutes: first, task: adaptedTask ?? template.longTask },
      { label: "전환", minutes: reset, task: "자리에서 일어나 물을 마시고 시선을 멀리 두기" },
      {
        label: "2차 실행",
        minutes: second,
        task: adaptedTask
          ? "첫 실행에서 정리한 내용을 검토하고 다음 행동을 한 단계 더 구체화하기"
          : template.secondTask,
      },
      { label: "마무리", minutes: close, task: closeTask },
    ];
  }

  if (total === 60) {
    const reset = 4;
    return [
      { label: "준비", minutes: prepare, task: prepareTask },
      {
        label: "핵심",
        minutes: total - prepare - close - reset,
        task: adaptedTask ?? template.mediumTask,
      },
      { label: "전환", minutes: reset, task: "몸을 펴고 지금까지 한 일을 한 문장으로 확인하기" },
      { label: "마무리", minutes: close, task: closeTask },
    ];
  }

  return [
    { label: "준비", minutes: prepare, task: prepareTask },
    {
      label: "핵심",
      minutes: total - prepare - close,
      task: adaptedTask ?? taskForMinutes(template, total),
    },
    { label: "마무리", minutes: close, task: closeTask },
  ];
}

function buildRecommendation(template: RoutineTemplate, answers: Answers): Recommendation {
  const sameGoalTemplates = routineTemplates.filter((candidate) => candidate.goal === answers.goal);
  const variationIndex = Math.max(0, sameGoalTemplates.indexOf(template));
  const needsAdaptation =
    !template.tools.includes(answers.tool) || !template.places.includes(answers.place);
  const adaptation = adaptableVariants[answers.goal][variationIndex];
  const outcome = needsAdaptation
    ? adaptation.task
    : taskForMinutes(template, answers.minutes);
  const toolPreparation =
    answers.tool === "none"
      ? "도구 없이 준비합니다."
      : `${getAnswerLabel("tool", answers.tool)} 기준으로 준비합니다.`;
  return {
    id: template.id,
    title: needsAdaptation ? adaptation.title : template.title,
    summary: needsAdaptation ? adaptation.summary : template.summary,
    reason: `${energyReason[answers.energy]} ${blockerReason[answers.blocker]}${
      needsAdaptation ? " 선택한 장소와 도구에서도 가능한 행동으로 바꿨습니다." : ""
    }`,
    outcome,
    place: getAnswerLabel("place", answers.place),
    tool: getAnswerLabel("tool", answers.tool),
    placeTip: `${placeGuidance[answers.place]} ${toolPreparation}`,
    matchLine: `${getAnswerLabel("minutes", answers.minutes)} · ${getAnswerLabel("energy", answers.energy)} · ${getAnswerLabel("goal", answers.goal)}`,
    steps: buildSteps(
      template,
      answers,
      needsAdaptation ? adaptation.task : undefined,
      needsAdaptation ? adaptableFrame[answers.goal].prepare : undefined,
      needsAdaptation ? adaptableFrame[answers.goal].close : undefined,
    ),
  };
}

export function createRecommendations(answers: Answers): Recommendation[] {
  return routineTemplates
    .filter((template) => template.goal === answers.goal)
    .map((template) => ({ template, score: templateScore(template, answers) }))
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
    .map(({ template }) => buildRecommendation(template, answers));
}
