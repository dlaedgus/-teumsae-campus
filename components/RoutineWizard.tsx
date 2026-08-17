"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  type AnswerValue,
  type Answers,
  createRecommendations,
  getAnswerLabel,
  isAnswersComplete,
  questions,
} from "@/lib/routines";

type Phase = "questions" | "loading" | "result";
type RoutineStatus = "ready" | "running" | "done";

const loadingMessages = [
  "쓸 수 있는 시간을 나누고 있습니다.",
  "장소와 도구에 맞게 실행 순서를 조정하고 있습니다.",
  "바로 시작할 루틴을 정리하고 있습니다.",
] as const;

function revealHeading(heading: HTMLHeadingElement | null, enabled: boolean) {
  if (!heading || !enabled) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  heading.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "center",
  });
  heading.focus({ preventScroll: true });
}

export default function RoutineWizard() {
  const [phase, setPhase] = useState<Phase>("questions");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [routineStatus, setRoutineStatus] = useState<RoutineStatus>("ready");
  const [editing, setEditing] = useState(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const analysisHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const advancingRef = useRef(false);
  const hasInteractedRef = useRef(false);

  const recommendations = useMemo(
    () => (isAnswersComplete(answers) ? createRecommendations(answers) : []),
    [answers],
  );

  const currentQuestion = questions[stepIndex];
  const currentRecommendation = recommendations[recommendationIndex];
  const completedAnswers = questions.filter(
    (question) => answers[question.key] !== undefined,
  );
  const progress = Math.round((completedAnswers.length / questions.length) * 100);

  useEffect(() => {
    if (phase === "questions") {
      const frame = window.requestAnimationFrame(() =>
        revealHeading(questionHeadingRef.current, hasInteractedRef.current),
      );
      return () => window.cancelAnimationFrame(frame);
    }
  }, [phase, stepIndex]);

  useEffect(() => {
    if (phase !== "loading") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timings = reduceMotion ? [0, 90, 180, 270] : [0, 500, 1000, 1500];

    const timers = [
      window.setTimeout(() => setLoadingIndex(1), timings[1]),
      window.setTimeout(() => setLoadingIndex(2), timings[2]),
      window.setTimeout(() => {
        setRecommendationIndex(0);
        setRoutineStatus("ready");
        setPhase("result");
      }, timings[3]),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase]);

  useEffect(() => {
    if (phase === "loading") {
      const frame = window.requestAnimationFrame(() =>
        revealHeading(analysisHeadingRef.current, hasInteractedRef.current),
      );
      return () => window.cancelAnimationFrame(frame);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "result") {
      if (routineStatus === "running") return;
      const frame = window.requestAnimationFrame(() =>
        revealHeading(resultHeadingRef.current, hasInteractedRef.current),
      );
      return () => window.cancelAnimationFrame(frame);
    }
  }, [phase, recommendationIndex, routineStatus]);

  const handleSelect = (value: AnswerValue) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    hasInteractedRef.current = true;
    window.requestAnimationFrame(() => {
      advancingRef.current = false;
    });

    const nextAnswers = {
      ...answers,
      [currentQuestion.key]: value,
    } as Partial<Answers>;

    setAnswers(nextAnswers);

    if (editing && isAnswersComplete(nextAnswers)) {
      setEditing(false);
      setLoadingIndex(0);
      setPhase("loading");
      return;
    }

    if (stepIndex === questions.length - 1) {
      setLoadingIndex(0);
      setPhase("loading");
      return;
    }

    setStepIndex((current) => current + 1);
  };

  const openQuestion = (index: number, editMode = false) => {
    if (routineStatus === "running") return;
    hasInteractedRef.current = true;
    setEditing(editMode);
    setRoutineStatus("ready");
    setStepIndex(index);
    setPhase("questions");
  };

  const resetWizard = () => {
    if (routineStatus === "running") return;
    hasInteractedRef.current = true;
    setAnswers({});
    setStepIndex(0);
    setRecommendationIndex(0);
    setRoutineStatus("ready");
    setEditing(false);
    setPhase("questions");
  };

  const showAnotherRecommendation = () => {
    setRoutineStatus("ready");
    setRecommendationIndex((current) => (current + 1) % recommendations.length);
  };

  return (
    <div className={`wizard-shell phase-${phase}`}>
      <header className="wizard-header">
        <div>
          <p className="wizard-kicker">
            {phase === "questions"
              ? `${stepIndex + 1} / ${questions.length}`
              : phase === "loading"
                ? "조건 분석"
                : "맞춤 추천"}
          </p>
          <p className="wizard-status">
            {phase === "questions"
              ? `${completedAnswers.length}개 답변 완료 · ${progress}%`
              : phase === "loading"
                ? "선택한 조건을 조합하고 있습니다"
                : `${recommendationIndex + 1}번째 추천 · 후보 ${recommendations.length}개`}
          </p>
        </div>
        <button
          className="reset-button"
          disabled={routineStatus === "running"}
          type="button"
          onClick={resetWizard}
        >
          처음부터
        </button>
      </header>

      <nav className="wizard-progress" aria-label="맞춤 질문 진행 단계">
        <div className="progress-track" aria-hidden="true">
          <span
            style={{ width: phase === "questions" ? `${progress}%` : "100%" }}
          />
        </div>
        <ol>
          {questions.map((question, index) => {
            const canVisit = index <= stepIndex || answers[question.key] !== undefined;
            const isCurrent = phase === "questions" && index === stepIndex;
            return (
              <li
                className={`${isCurrent ? "current" : ""} ${
                  answers[question.key] !== undefined ? "complete" : ""
                }`}
                key={question.key}
              >
                <button
                  aria-current={isCurrent ? "step" : undefined}
                  disabled={!canVisit || routineStatus === "running"}
                  onClick={() => openQuestion(index, isAnswersComplete(answers))}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{question.shortLabel}</b>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {phase === "questions" ? (
        <section className="wizard-question" aria-labelledby="wizard-question-title">
          <div className="question-copy">
            <p>질문 {String(stepIndex + 1).padStart(2, "0")}</p>
            <h3 id="wizard-question-title" ref={questionHeadingRef} tabIndex={-1}>
              {currentQuestion.title}
            </h3>
            <p>{currentQuestion.description}</p>
          </div>

          <fieldset>
            <legend className="sr-only">{currentQuestion.title}</legend>
            <div
              className={`wizard-options ${
                currentQuestion.key === "minutes" ? "time-options" : ""
              }`}
            >
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.key] === option.value;
                return (
                  <label
                    className={isSelected ? "wizard-option selected" : "wizard-option"}
                    key={String(option.value)}
                  >
                    <input
                      checked={isSelected}
                      name={currentQuestion.key}
                      onChange={() => handleSelect(option.value)}
                      type="radio"
                      value={String(option.value)}
                    />
                    <span>
                      <strong>{option.label}</strong>
                      {isSelected ? <b>선택됨</b> : null}
                    </span>
                    <small>{option.note}</small>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <footer className="wizard-actions">
            <button
              className="back-button"
              disabled={stepIndex === 0}
              onClick={() => openQuestion(stepIndex - 1, editing)}
              type="button"
            >
              이전 질문
            </button>
            <p>
              {editing
                ? "답을 바꾸면 추천을 바로 다시 분석합니다."
                : "하나를 고르면 다음 질문으로 바로 이동합니다."}
            </p>
          </footer>

          {completedAnswers.length > 0 ? (
            <div className="answer-history" aria-label="현재까지 선택한 답">
              {completedAnswers.map((question) => (
                <button
                  key={question.key}
                  onClick={() =>
                    openQuestion(
                      questions.indexOf(question),
                      editing || isAnswersComplete(answers),
                    )
                  }
                  type="button"
                >
                  <span>{question.shortLabel}</span>
                  <strong>
                    {getAnswerLabel(
                      question.key,
                      answers[question.key] as never,
                    )}
                  </strong>
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {phase === "loading" ? (
        <section className="analysis-state" aria-live="polite" role="status">
          <p className="analysis-count">6가지 조건 확인 완료</p>
          <h3 ref={analysisHeadingRef} tabIndex={-1}>
            지금의 틈새를 맞추고 있습니다.
          </h3>
          <p>{loadingMessages[loadingIndex]}</p>
          <div className="analysis-progress" aria-hidden="true">
            <span />
          </div>
          <ol>
            {loadingMessages.map((message, index) => (
              <li className={index <= loadingIndex ? "active" : ""} key={message}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {message}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {phase === "result" && currentRecommendation && isAnswersComplete(answers) ? (
        <section className="result-stage" aria-labelledby="result-title">
          {routineStatus === "done" ? (
            <div className="complete-state">
              <p className="complete-number">완료</p>
              <h3 id="result-title" ref={resultHeadingRef} tabIndex={-1}>
                정한 시간 안에 한 루틴을 끝냈습니다.
              </h3>
              <p>
                완벽하게 했는지보다, 고민을 행동으로 바꾸고 끝까지 간 것을 기록했습니다.
              </p>
              <div className="complete-actions">
                <button type="button" onClick={showAnotherRecommendation}>
                  같은 조건으로 다른 추천
                </button>
                <button type="button" onClick={resetWizard}>
                  새 공강 설계하기
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="answer-summary" aria-label="선택 조건 요약">
                {questions.map((question) => (
                  <button
                    key={question.key}
                    disabled={routineStatus === "running"}
                    onClick={() => openQuestion(questions.indexOf(question), true)}
                    type="button"
                  >
                    <span>{question.shortLabel}</span>
                    <strong>{getAnswerLabel(question.key, answers[question.key] as never)}</strong>
                  </button>
                ))}
              </div>

              <div className="result-layout">
                <article className={`routine-result ${routineStatus}`}>
                  <div className="result-topline">
                    <span>지금의 틈새</span>
                    <span>{getAnswerLabel("minutes", answers.minutes)} 루틴</span>
                  </div>
                  <p className="result-match">{currentRecommendation.matchLine}</p>
                  <h3 id="result-title" ref={resultHeadingRef} tabIndex={-1}>
                    {currentRecommendation.title}
                  </h3>
                  <p className="result-summary-copy">{currentRecommendation.summary}</p>

                  <div className="result-facts">
                    <div>
                      <span>이렇게 추천한 이유</span>
                      <p>{currentRecommendation.reason}</p>
                    </div>
                    <div>
                      <span>오늘 남길 결과</span>
                      <p>{currentRecommendation.outcome}</p>
                    </div>
                    <div>
                      <span>추천 장소와 도구</span>
                      <p>
                        {currentRecommendation.place} · {currentRecommendation.tool}
                      </p>
                      <small>{currentRecommendation.placeTip}</small>
                    </div>
                  </div>

                  <ol className="result-steps">
                    {currentRecommendation.steps.map((routineStep, index) => (
                      <li key={`${routineStep.label}-${index}`}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <small>{routineStep.label}</small>
                          <strong>{routineStep.task}</strong>
                        </div>
                        <b>{routineStep.minutes}분</b>
                      </li>
                    ))}
                  </ol>

                  <div className="result-summary">
                    <span>예상 종료</span>
                    <strong>지금부터 {answers.minutes}분 뒤</strong>
                  </div>

                  {routineStatus === "running" ? (
                    <div className="running-actions" aria-live="polite" role="status">
                      <p>
                        루틴이 진행 중입니다. 실행 중에는 조건과 추천을 바꿀 수 없습니다.
                        마치면 완료를 기록해 주세요.
                      </p>
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
                </article>

                <aside className="alternative-panel" aria-labelledby="alternative-title">
                  <p>추천 후보</p>
                  <h4 id="alternative-title">같은 조건, 다른 방향</h4>
                  <p>현재 조건에서 실행 가능한 상위 세 가지입니다.</p>
                  <div className="alternative-list">
                    {recommendations.map((recommendation, index) => (
                      <button
                        aria-pressed={recommendationIndex === index}
                        className={recommendationIndex === index ? "selected" : ""}
                        disabled={routineStatus === "running"}
                        key={recommendation.id}
                        onClick={() => {
                          setRecommendationIndex(index);
                          setRoutineStatus("ready");
                        }}
                        type="button"
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{recommendation.title}</strong>
                        <small>{recommendation.outcome}</small>
                      </button>
                    ))}
                  </div>
                  <button
                    className="another-button"
                    disabled={routineStatus === "running"}
                    onClick={showAnotherRecommendation}
                    type="button"
                  >
                    다른 방향으로 한 번 더
                  </button>
                  <button
                    className="edit-button"
                    disabled={routineStatus === "running"}
                    onClick={() => openQuestion(0, true)}
                    type="button"
                  >
                    질문 다시 보기
                  </button>
                </aside>
              </div>
            </>
          )}
        </section>
      ) : null}
    </div>
  );
}
