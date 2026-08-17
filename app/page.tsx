"use client";

import { useMemo, useState } from "react";

type Energy = "low" | "steady" | "high";
type Goal = "focus" | "reset" | "admin" | "connect";
type Place = "quiet" | "cafe" | "outside" | "anywhere";
type RoutineStatus = "ready" | "running" | "done";

const minuteOptions = [20, 40, 60, 90];

const energyOptions: { value: Energy; label: string; note: string }[] = [
  { value: "low", label: "방전", note: "쉬면서 회복" },
  { value: "steady", label: "보통", note: "가볍게 몰입" },
  { value: "high", label: "충전", note: "하나를 확실히" },
];

const goalOptions: { value: Goal; label: string }[] = [
  { value: "focus", label: "과제 진도" },
  { value: "reset", label: "머리 환기" },
  { value: "admin", label: "밀린 일 정리" },
  { value: "connect", label: "사람과 연결" },
];

const placeOptions: { value: Place; label: string }[] = [
  { value: "quiet", label: "도서관" },
  { value: "cafe", label: "카페" },
  { value: "outside", label: "야외" },
  { value: "anywhere", label: "상관없음" },
];

const goalCopy: Record<
  Goal,
  { title: string; outcome: string; main: string; close: string }
> = {
  focus: {
    title: "한 덩어리 끝내기",
    outcome: "다음 수업 전에 결과물이 눈에 보이도록 범위를 작게 잘랐습니다.",
    main: "가장 작은 제출 단위 한 개 완성",
    close: "다음 시작점을 한 줄로 남기기",
  },
  reset: {
    title: "생각을 비우는 리셋",
    outcome: "쉬는 시간에도 선택하느라 지치지 않도록 움직임과 정리를 묶었습니다.",
    main: "화면 없이 천천히 걷기",
    close: "물 마시고 다음 수업 자리 잡기",
  },
  admin: {
    title: "미뤄 둔 일 털어내기",
    outcome: "작지만 계속 신경 쓰이던 일을 한 번에 닫는 구성입니다.",
    main: "메일·일정·제출 항목 세 개 처리",
    close: "남은 항목을 내일 목록으로 이동",
  },
  connect: {
    title: "짧고 부담 없는 연결",
    outcome: "긴 약속 대신 지금 가능한 한 번의 연락에 집중합니다.",
    main: "한 사람에게 구체적인 안부 보내기",
    close: "답장을 기다리지 않고 다음 일정 준비",
  },
};

const placeCopy: Record<Place, string> = {
  quiet: "소음이 적은 자리",
  cafe: "콘센트보다 편한 좌석",
  outside: "그늘이 있는 동선",
  anywhere: "가장 가까운 자리",
};

const energyWarmup: Record<Energy, string> = {
  low: "휴대폰을 뒤집어 두고 4번 깊게 호흡",
  steady: "필요한 것만 꺼내고 방해 요소 닫기",
  high: "오늘 끝낼 한 문장을 먼저 적기",
};

function splitMinutes(total: number) {
  const warmup = total <= 20 ? 3 : total <= 40 ? 5 : 8;
  const close = total <= 20 ? 4 : total <= 60 ? 7 : 10;
  return [warmup, total - warmup - close, close];
}

const funnelData = [
  { label: "랜딩 방문", count: 142, percent: 100, conversion: "기준" },
  { label: "추천 입력 시작", count: 118, percent: 83.1, conversion: "83.1%" },
  { label: "추천 확인", count: 104, percent: 73.2, conversion: "88.1%" },
  { label: "루틴 시작", count: 75, percent: 52.8, conversion: "72.1%" },
  { label: "루틴 완료", count: 55, percent: 38.7, conversion: "73.3%" },
];

const gapPerformance = [
  { label: "20—39분", sessions: 28, start: 60.7, complete: 58.8 },
  { label: "40—59분", sessions: 34, start: 76.5, complete: 76.9 },
  { label: "60—89분", sessions: 27, start: 77.8, complete: 81.0 },
  { label: "90분 이상", sessions: 15, start: 73.3, complete: 72.7 },
];

export default function Home() {
  const [minutes, setMinutes] = useState(40);
  const [energy, setEnergy] = useState<Energy>("steady");
  const [goal, setGoal] = useState<Goal>("focus");
  const [place, setPlace] = useState<Place>("quiet");
  const [routineStatus, setRoutineStatus] = useState<RoutineStatus>("ready");
  const [rating, setRating] = useState<number | null>(null);

  const routine = useMemo(() => {
    const [warmup, main, close] = splitMinutes(minutes);
    const copy = goalCopy[goal];
    return {
      ...copy,
      place: placeCopy[place],
      steps: [
        { label: "준비", minutes: warmup, task: energyWarmup[energy] },
        { label: "핵심", minutes: main, task: copy.main },
        { label: "마무리", minutes: close, task: copy.close },
      ],
    };
  }, [energy, goal, minutes, place]);

  const generateRoutine = () => {
    setRoutineStatus("ready");
    setRating(null);
  };

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="틈새 홈">
          틈새
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#how">서비스 소개</a>
          <a href="#maker">루틴 만들기</a>
          <a href="#validation">검증 결과</a>
        </nav>
        <a className="header-cta" href="#maker">
          지금 추천받기
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">대학생 공강 의사결정 서비스</p>
          <h1>
            남는 시간이 아니라,
            <br />
            <span>쓸 수 있는 시간.</span>
          </h1>
          <p className="hero-lede">
            다음 수업까지 20분이든 90분이든, 지금의 에너지와 목적에 맞는
            한 가지 루틴을 제안합니다. 무엇을 할지 고민하는 시간부터 줄여보세요.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#maker">
              내 공강 설계하기
            </a>
            <a className="text-link" href="#validation">
              검증 방식 먼저 보기
            </a>
          </div>
          <dl className="hero-stats" aria-label="서비스 핵심 수치">
            <div>
              <dt>추천 생성</dt>
              <dd>10초 이내</dd>
            </div>
            <div>
              <dt>입력 항목</dt>
              <dd>4개</dd>
            </div>
            <div>
              <dt>루틴 구성</dt>
              <dd>3단계</dd>
            </div>
          </dl>
        </div>

        <aside className="schedule-card" aria-label="추천 루틴 예시">
          <div className="schedule-topline">
            <span>오늘의 틈새</span>
            <span>13:20—14:00</span>
          </div>
          <p className="schedule-kicker">40분 · 보통 에너지</p>
          <h2>한 덩어리 끝내기</h2>
          <div className="schedule-track">
            <div className="track-row">
              <span>13:20</span>
              <div>
                <strong>준비</strong>
                <p>필요한 것만 꺼내기</p>
              </div>
              <b>5분</b>
            </div>
            <div className="track-row active">
              <span>13:25</span>
              <div>
                <strong>핵심</strong>
                <p>가장 작은 제출 단위 완성</p>
              </div>
              <b>28분</b>
            </div>
            <div className="track-row">
              <span>13:53</span>
              <div>
                <strong>마무리</strong>
                <p>다음 시작점 남기기</p>
              </div>
              <b>7분</b>
            </div>
          </div>
          <div className="schedule-footer">
            <span>다음 수업</span>
            <strong>14:00 · 공학관</strong>
          </div>
        </aside>
      </section>

      <section className="principles" id="how" aria-labelledby="principles-title">
        <div className="section-heading compact">
          <p className="eyebrow">왜 틈새인가</p>
          <h2 id="principles-title">공강의 문제는 시간보다 결정입니다.</h2>
        </div>
        <div className="principle-grid">
          <article>
            <span>01</span>
            <h3>고민을 입력으로 바꿉니다</h3>
            <p>시간, 에너지, 목적, 장소만 고르면 선택지를 더 늘리지 않습니다.</p>
          </article>
          <article>
            <span>02</span>
            <h3>끝낼 수 있는 크기로 자릅니다</h3>
            <p>막연한 “과제하기” 대신 다음 수업 전 결과가 남는 단위로 제안합니다.</p>
          </article>
          <article>
            <span>03</span>
            <h3>시작과 완료를 측정합니다</h3>
            <p>추천을 본 횟수가 아니라 실제 시작률과 완료율을 핵심 KPI로 봅니다.</p>
          </article>
        </div>
      </section>

      <section className="maker-section" id="maker" aria-labelledby="maker-title">
        <div className="section-heading">
          <p className="eyebrow">직접 사용해 보기</p>
          <h2 id="maker-title">지금 공강에 맞는 루틴을 만드세요.</h2>
          <p>정답을 찾는 설문이 아닙니다. 현재 상태에 가장 실행하기 쉬운 안을 고릅니다.</p>
        </div>

        <div className="maker-grid">
          <form
            className="routine-form"
            onSubmit={(event) => {
              event.preventDefault();
              generateRoutine();
            }}
          >
            <fieldset>
              <legend>
                <span>1</span> 다음 수업까지 몇 분 남았나요?
              </legend>
              <div className="choice-grid four">
                {minuteOptions.map((value) => (
                  <button
                    className={minutes === value ? "choice selected" : "choice"}
                    key={value}
                    onClick={() => setMinutes(value)}
                    type="button"
                    aria-pressed={minutes === value}
                  >
                    <strong>{value}</strong>
                    <small>분</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <span>2</span> 지금 에너지는 어떤가요?
              </legend>
              <div className="choice-grid three">
                {energyOptions.map((option) => (
                  <button
                    className={energy === option.value ? "choice selected" : "choice"}
                    key={option.value}
                    onClick={() => setEnergy(option.value)}
                    type="button"
                    aria-pressed={energy === option.value}
                  >
                    <strong>{option.label}</strong>
                    <small>{option.note}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <span>3</span> 이번 공강에서 얻고 싶은 것은요?
              </legend>
              <div className="choice-grid two">
                {goalOptions.map((option) => (
                  <button
                    className={goal === option.value ? "choice selected" : "choice"}
                    key={option.value}
                    onClick={() => setGoal(option.value)}
                    type="button"
                    aria-pressed={goal === option.value}
                  >
                    <strong>{option.label}</strong>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <span>4</span> 어디에서 시간을 보낼까요?
              </legend>
              <div className="choice-grid two">
                {placeOptions.map((option) => (
                  <button
                    className={place === option.value ? "choice selected" : "choice"}
                    key={option.value}
                    onClick={() => setPlace(option.value)}
                    type="button"
                    aria-pressed={place === option.value}
                  >
                    <strong>{option.label}</strong>
                  </button>
                ))}
              </div>
            </fieldset>

            <button className="generate-button" type="submit">
              이 조건으로 루틴 만들기
            </button>
          </form>

          <article className={`routine-result ${routineStatus}`} aria-live="polite">
            <div className="result-topline">
              <span>추천 결과</span>
              <span>{minutes}분 루틴</span>
            </div>

            {routineStatus === "done" ? (
              <div className="complete-state">
                <p className="complete-number">완료</p>
                <h3>공강을 결과로 바꿨습니다.</h3>
                <p>완벽하게 했는지보다 정한 시간 안에 끝까지 간 것을 기록했습니다.</p>
                <div className="rating-box">
                  <p>이 추천이 얼마나 도움이 되었나요?</p>
                  <div aria-label="도움됨 평가">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        aria-pressed={rating === score}
                        className={rating === score ? "selected" : ""}
                        key={score}
                        onClick={() => setRating(score)}
                        type="button"
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <span>{rating ? `${rating}점으로 기록했습니다.` : "1점 낮음 · 5점 높음"}</span>
                </div>
                <button type="button" onClick={() => setRoutineStatus("ready")}>
                  다른 조건으로 다시 만들기
                </button>
              </div>
            ) : (
              <>
                <p className="result-location">추천 장소 · {routine.place}</p>
                <h3>{routine.title}</h3>
                <p className="result-reason">{routine.outcome}</p>

                <ol className="result-steps">
                  {routine.steps.map((step, index) => (
                    <li key={step.label}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <small>{step.label}</small>
                        <strong>{step.task}</strong>
                      </div>
                      <b>{step.minutes}분</b>
                    </li>
                  ))}
                </ol>

                <div className="result-summary">
                  <span>예상 종료</span>
                  <strong>지금부터 {minutes}분 뒤</strong>
                </div>

                {routineStatus === "running" ? (
                  <div className="running-actions">
                    <p>루틴이 진행 중입니다. 마치면 완료를 기록해 주세요.</p>
                    <button type="button" onClick={() => setRoutineStatus("done")}>
                      루틴 완료하기
                    </button>
                  </div>
                ) : (
                  <button
                    className="start-button"
                    type="button"
                    onClick={() => setRoutineStatus("running")}
                  >
                    이 루틴 시작하기
                  </button>
                )}
              </>
            )}
          </article>
        </div>
      </section>

      <section className="validation-section" id="validation" aria-labelledby="validation-title">
        <div className="validation-heading">
          <div>
            <p className="eyebrow">사용자 검증 대시보드</p>
            <h2 id="validation-title">추천을 봤는지가 아니라, 실제로 움직였는지를 봤습니다.</h2>
          </div>
          <p>
            랜딩부터 추천, 시작, 완료, 피드백까지 이어지는 행동 퍼널을 기준으로
            서비스 가설을 점검했습니다.
          </p>
        </div>

        <div className="data-notice" role="note">
          <strong>과제용 합성 데이터</strong>
          <p>
            아래 결과는 KPI 구조와 분석 방법을 보여주기 위해 생성한 시뮬레이션입니다.
            실제 사용자 조사 결과가 아니며, 실제 검증 시 같은 스키마에 수집 데이터를 교체합니다.
          </p>
          <span>2026.08.04—08.13 · 가상 참여자 40명 · 추천 노출 104세션</span>
        </div>

        <div className="metric-grid" aria-label="핵심 KPI">
          <article>
            <div className="metric-topline"><span>핵심 KPI 01</span><b>목표 65%</b></div>
            <strong>72.1<small>%</small></strong>
            <h3>추천 시작률</h3>
            <p>추천을 확인한 104세션 중 75세션이 루틴을 실제로 시작했습니다.</p>
            <span className="target-result">목표 대비 +7.1%p</span>
          </article>
          <article>
            <div className="metric-topline"><span>핵심 KPI 02</span><b>목표 65%</b></div>
            <strong>73.3<small>%</small></strong>
            <h3>시작 후 완료율</h3>
            <p>루틴을 시작한 75세션 중 55세션이 마지막 단계까지 완료했습니다.</p>
            <span className="target-result">목표 대비 +8.3%p</span>
          </article>
          <article>
            <div className="metric-topline"><span>품질 KPI</span><b>목표 4.0</b></div>
            <strong>4.14<small>/5</small></strong>
            <h3>평균 도움됨 점수</h3>
            <p>피드백 50건 중 40건이 4점 이상으로, 긍정 응답률은 80.0%입니다.</p>
            <span className="target-result">목표 대비 +0.14점</span>
          </article>
          <article>
            <div className="metric-topline"><span>행동 KPI</span><b>목표 50%</b></div>
            <strong>70.0<small>%</small></strong>
            <h3>다회 체험률</h3>
            <p>가상 참여자 40명 중 28명이 파일럿 기간에 두 번 이상 체험했습니다.</p>
            <span className="target-result">Retention이 아닌 체험 빈도</span>
          </article>
        </div>

        <div className="analysis-grid">
          <article className="analysis-panel funnel-panel">
            <div className="panel-heading">
              <div><span>행동 퍼널</span><h3>142번의 방문이 55번의 완료로 이어졌습니다.</h3></div>
              <p>각 전환율은 바로 이전 단계 기준</p>
            </div>
            <div className="funnel-chart">
              {funnelData.map((item, index) => (
                <div className="funnel-row" key={item.label}>
                  <div className="funnel-label">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item.label}</strong>
                  </div>
                  <div className="funnel-bar-track">
                    <div className="funnel-bar" style={{ width: `${item.percent}%` }} />
                  </div>
                  <b>{item.count}</b>
                  <small>{item.conversion}</small>
                </div>
              ))}
            </div>
            <p className="chart-note">가장 큰 개선 지점은 추천 확인 이후 실제 시작으로 넘어가는 구간입니다.</p>
          </article>

          <article className="analysis-panel segment-panel">
            <div className="panel-heading">
              <div><span>공강 길이별</span><h3>60—89분 구간에서 가장 강했습니다.</h3></div>
              <p>시작률 · 시작 후 완료율</p>
            </div>
            <div className="legend" aria-hidden="true">
              <span><i className="start-swatch" />시작률</span>
              <span><i className="complete-swatch" />완료율</span>
            </div>
            <div className="segment-chart">
              {gapPerformance.map((item) => (
                <div className="segment-row" key={item.label}>
                  <div className="segment-label"><strong>{item.label}</strong><span>{item.sessions}세션</span></div>
                  <div className="double-bars">
                    <div><span style={{ width: `${item.start}%` }} /><b>{item.start.toFixed(1)}%</b></div>
                    <div><span style={{ width: `${item.complete}%` }} /><b>{item.complete.toFixed(1)}%</b></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="chart-note">40분 미만에서는 더 짧은 10분 루틴을 우선 제시하는 개선이 필요합니다.</p>
          </article>
        </div>

        <div className="learning-grid">
          <article>
            <span>검증 가설</span>
            <h3>상태에 맞춘 한 가지 제안은 선택 부담을 줄이고 시작률을 높인다.</h3>
            <p>노출 수나 페이지 체류시간보다 추천 이후의 시작 행동을 성공 기준으로 설정했습니다.</p>
          </article>
          <article>
            <span>핵심 발견</span>
            <h3>시간 여유보다 낮은 에너지가 미시작과 중단에 더 크게 연결됐습니다.</h3>
            <p>낮은 에너지 세션의 시작률은 62.1%, 시작 후 완료율은 55.6%였습니다.</p>
          </article>
          <article>
            <span>다음 실험</span>
            <h3>방전 상태에는 3단계 대신 10분짜리 단일 회복 행동을 먼저 제시합니다.</h3>
            <p>다음 버전에서는 낮은 에너지 세그먼트의 시작률 70%를 목표로 비교합니다.</p>
          </article>
        </div>

        <div className="method-download">
          <div className="method-copy">
            <p className="eyebrow">측정 방법</p>
            <h3>분자와 분모가 보이는 KPI만 사용했습니다.</h3>
            <dl>
              <div><dt>추천 시작률</dt><dd>routine_start ÷ recommendation_view</dd></div>
              <div><dt>시작 후 완료율</dt><dd>routine_complete ÷ routine_start</dd></div>
              <div><dt>도움됨 긍정률</dt><dd>4점 이상 응답 ÷ 전체 도움됨 응답</dd></div>
              <div><dt>다회 체험률</dt><dd>2회 이상 참여자 ÷ 전체 가상 참여자</dd></div>
            </dl>
          </div>
          <div className="download-box">
            <span>검증 데이터 내려받기</span>
            <h3>집계값뿐 아니라 원본 행까지 확인할 수 있습니다.</h3>
            <a href="/data/synthetic_validation_sessions.csv" download>세션 데이터 CSV <small>104행</small></a>
            <a href="/data/synthetic_event_log.csv" download>이벤트 로그 CSV <small>544행</small></a>
            <a href="/data/synthetic_kpi_summary.csv" download>KPI 요약 CSV <small>9개 지표</small></a>
            <p>모든 파일의 data_source는 synthetic_course_demo로 표시됩니다.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div><a className="wordmark" href="#top">틈새</a><p>애매한 공강을 실행 가능한 한 덩어리로.</p></div>
        <div><span>서비스</span><a href="#how">소개</a><a href="#maker">루틴 만들기</a><a href="#validation">검증 결과</a></div>
        <div><span>데이터</span><a href="/data/synthetic_validation_sessions.csv">세션 CSV</a><a href="/data/synthetic_event_log.csv">이벤트 CSV</a></div>
        <p className="footer-note">Course prototype · Synthetic validation data · 2026</p>
      </footer>
    </main>
  );
}
