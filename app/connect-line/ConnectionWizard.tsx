"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  connectionQuestions,
  createConnectionProfile,
  isConnectionComplete,
  type ConnectionAnswers,
  type ConnectionValue,
} from "@/lib/connection-profile";

import styles from "./connect-line.module.css";

type Phase = "questions" | "loading" | "result" | "done";

const loadingMessages = [
  "선택한 정보 범위를 정리하고 있습니다.",
  "목적에 맞는 최소 권한과 비교하고 있습니다.",
  "행동 전에 필요한 확인 규칙을 점검하고 있습니다.",
  "보관 기간과 제외 항목을 확인하고 있습니다.",
] as const;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function ConnectionWizard() {
  const [answers, setAnswers] = useState<Partial<ConnectionAnswers>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("questions");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [editingCompletedAnswers, setEditingCompletedAnswers] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);

  const completedCount = connectionQuestions.filter(
    (question) => answers[question.key] !== undefined,
  ).length;
  const completionPercent = Math.round(
    (completedCount / connectionQuestions.length) * 100,
  );
  const currentQuestion = connectionQuestions[stepIndex];
  const completeAnswers = isConnectionComplete(answers) ? answers : null;
  const profile = useMemo(
    () => (completeAnswers ? createConnectionProfile(completeAnswers) : null),
    [completeAnswers],
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const panel = panelRef.current;
    const heading = headingRef.current;
    if (!panel || !heading) return;

    panel.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    heading.focus({ preventScroll: true });
  }, [phase, stepIndex]);

  useEffect(() => {
    if (phase !== "loading") return;

    const totalDuration = prefersReducedMotion() ? 320 : 2400;
    const interval = totalDuration / loadingMessages.length;
    const timers: number[] = [];

    for (let index = 1; index < loadingMessages.length; index += 1) {
      timers.push(
        window.setTimeout(() => setLoadingIndex(index), interval * index),
      );
    }

    timers.push(
      window.setTimeout(() => setPhase("result"), totalDuration),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase]);

  useEffect(
    () => () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    },
    [],
  );

  function beginAnalysis() {
    setIsAdvancing(false);
    setLoadingIndex(0);
    setPhase("loading");
  }

  function selectAnswer(value: ConnectionValue) {
    if (isAdvancing) return;

    const nextAnswers = {
      ...answers,
      [currentQuestion.key]: value,
    } as Partial<ConnectionAnswers>;
    const nextIsComplete = isConnectionComplete(nextAnswers);
    const shouldReturnToResult = editingCompletedAnswers && nextIsComplete;

    setAnswers(nextAnswers);
    setIsAdvancing(true);

    const advance = () => {
      advanceTimerRef.current = null;
      setEditingCompletedAnswers(false);

      if (shouldReturnToResult || (stepIndex === connectionQuestions.length - 1 && nextIsComplete)) {
        beginAnalysis();
        return;
      }

      setStepIndex((current) => Math.min(current + 1, connectionQuestions.length - 1));
      setIsAdvancing(false);
    };

    advanceTimerRef.current = window.setTimeout(
      advance,
      prefersReducedMotion() ? 0 : 180,
    );
  }

  function openStep(index: number) {
    if (answers[connectionQuestions[index].key] === undefined) return;
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setEditingCompletedAnswers(isConnectionComplete(answers));
    setIsAdvancing(false);
    setStepIndex(index);
    setPhase("questions");
  }

  function goPrevious() {
    if (stepIndex === 0) return;
    setEditingCompletedAnswers(isConnectionComplete(answers));
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function resetWizard() {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setAnswers({});
    setStepIndex(0);
    setPhase("questions");
    setLoadingIndex(0);
    setEditingCompletedAnswers(false);
    setIsAdvancing(false);
  }

  function reviewAnswers() {
    setEditingCompletedAnswers(true);
    setStepIndex(0);
    setPhase("questions");
  }

  function getAnswerLabel(index: number) {
    const question = connectionQuestions[index];
    const answer = answers[question.key];
    return question.options.find((option) => option.value === answer)?.label;
  }

  return (
    <div className={styles.wizardShell} ref={panelRef}>
      <div className={styles.wizardTopbar}>
        <div>
          <p className={styles.wizardEyebrow}>연결 범위 설계</p>
          <p className={styles.progressText}>
            {completedCount}개 선택 완료 · 전체 {connectionQuestions.length}개
          </p>
        </div>
        {completedCount > 0 && phase === "questions" ? (
          <button className={styles.textButton} type="button" onClick={resetWizard}>
            처음부터
          </button>
        ) : null}
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="설정 설계 진행률"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={completionPercent}
      >
        <span
          className={styles.progressFill}
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      {completedCount > 0 && phase !== "loading" && phase !== "done" ? (
        <nav className={styles.answerHistory} aria-label="선택한 답변 수정">
          <p className={styles.historyLabel}>선택 기록</p>
          <ol className={styles.answerList}>
            {connectionQuestions.map((question, index) => {
              const answerLabel = getAnswerLabel(index);
              if (!answerLabel) return null;

              return (
                <li key={question.key}>
                  <button
                    className={`${styles.answerButton} ${
                      phase === "questions" && stepIndex === index
                        ? styles.answerButtonCurrent
                        : ""
                    }`}
                    type="button"
                    onClick={() => openStep(index)}
                    aria-current={
                      phase === "questions" && stepIndex === index ? "step" : undefined
                    }
                  >
                    <span>{question.shortLabel}</span>
                    <strong>{answerLabel}</strong>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      {phase === "questions" ? (
        <section className={styles.questionPanel} aria-labelledby="connection-question-title">
          <p className={styles.stepLabel}>
            질문 {stepIndex + 1} / {connectionQuestions.length} · {currentQuestion.shortLabel}
          </p>
          <h3
            className={styles.questionTitle}
            id="connection-question-title"
            ref={headingRef}
            tabIndex={-1}
          >
            {currentQuestion.title}
          </h3>
          <p className={styles.questionDescription}>{currentQuestion.description}</p>

          <fieldset className={styles.optionFieldset} disabled={isAdvancing}>
            <legend className={styles.visuallyHidden}>{currentQuestion.title}</legend>
            <div className={styles.optionGrid}>
              {currentQuestion.options.map((option) => {
                const checked = answers[currentQuestion.key] === option.value;
                return (
                  <label
                    className={`${styles.optionCard} ${
                      checked ? styles.optionCardSelected : ""
                    }`}
                    key={option.value}
                  >
                    <input
                      className={styles.optionRadio}
                      type="radio"
                      name={currentQuestion.key}
                      value={option.value}
                      checked={checked}
                      onChange={() => selectAnswer(option.value)}
                    />
                    <span className={styles.optionCopy}>
                      <span className={styles.optionHeading}>
                        <strong>{option.label}</strong>
                        {option.flag ? (
                          <span
                            className={`${styles.optionFlag} ${
                              option.flag === "caution" ? styles.optionFlagCaution : ""
                            }`}
                          >
                            {option.flag === "recommended" ? "권장" : "주의"}
                          </span>
                        ) : null}
                      </span>
                      <span className={styles.optionNote}>{option.note}</span>
                    </span>
                    <span className={styles.selectionMark} aria-hidden="true">
                      {checked ? "선택됨" : "선택"}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className={styles.questionFooter}>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={goPrevious}
              disabled={stepIndex === 0 || isAdvancing}
            >
              이전 질문
            </button>
            <p className={styles.autoAdvanceNote} aria-live="polite">
              {isAdvancing
                ? "선택을 반영하고 있습니다."
                : "항목을 고르면 다음 질문으로 자동 이동합니다."}
            </p>
          </div>
        </section>
      ) : null}

      {phase === "loading" ? (
        <section
          className={styles.loadingPanel}
          aria-labelledby="connection-loading-title"
          aria-busy="true"
        >
          <p className={styles.stepLabel}>설정안 분석</p>
          <h3
            className={styles.loadingTitle}
            id="connection-loading-title"
            ref={headingRef}
            tabIndex={-1}
          >
            나에게 맞는 연결 범위를 설계하고 있습니다.
          </h3>
          <p className={styles.loadingLead}>
            넓은 권한보다 목적에 필요한 최소 범위를 우선해 비교합니다.
          </p>
          <div className={styles.loadingBar} aria-hidden="true">
            <span />
          </div>
          <ol className={styles.loadingSteps}>
            {loadingMessages.map((message, index) => {
              const state =
                index < loadingIndex ? "complete" : index === loadingIndex ? "current" : "pending";
              return (
                <li
                  className={`${styles.loadingStep} ${
                    state === "complete"
                      ? styles.loadingStepComplete
                      : state === "current"
                        ? styles.loadingStepCurrent
                        : ""
                  }`}
                  key={message}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{message}</p>
                  <strong>
                    {state === "complete" ? "확인" : state === "current" ? "분석 중" : "대기"}
                  </strong>
                </li>
              );
            })}
          </ol>
          <p className={styles.visuallyHidden} role="status" aria-live="polite">
            {loadingMessages[loadingIndex]}
          </p>
        </section>
      ) : null}

      {phase === "result" && profile ? (
        <section className={styles.resultPanel} aria-labelledby="connection-result-title">
          <div className={styles.resultHeader}>
            <div>
              <p className={styles.stepLabel}>나의 연결 설정안</p>
              <h3
                className={styles.resultTitle}
                id="connection-result-title"
                ref={headingRef}
                tabIndex={-1}
              >
                {profile.name}
              </h3>
            </div>
            <span className={styles.riskBadge}>{profile.riskLabel}</span>
          </div>
          <p className={styles.resultSummary}>{profile.summary}</p>

          <dl className={styles.factGrid}>
            <div>
              <dt>선택한 AI</dt>
              <dd>{profile.ai}</dd>
            </div>
            <div>
              <dt>주요 목적</dt>
              <dd>{profile.purpose}</dd>
            </div>
            <div>
              <dt>권한 노출 수준</dt>
              <dd>{profile.riskLabel}</dd>
            </div>
            <div>
              <dt>기억 기간</dt>
              <dd>{profile.retention}</dd>
            </div>
            <div>
              <dt>처리 위치</dt>
              <dd>이 화면의 시뮬레이션</dd>
            </div>
            <div>
              <dt>실제 데이터 전송</dt>
              <dd>없음</dd>
            </div>
          </dl>

          <div className={styles.scopeComparison}>
            <article className={styles.scopeCard}>
              <p>내가 요청한 범위</p>
              <h4>{profile.selectedAccess}</h4>
              <span>선택한 보호 수준과 기간을 함께 적용</span>
            </article>
            <article className={`${styles.scopeCard} ${styles.scopeCardRecommended}`}>
              <p>목적에 필요한 최소 권장 범위</p>
              <h4>{profile.recommendedAccess}</h4>
              <span>{profile.recommendedRule}</span>
            </article>
          </div>

          {profile.isScopeBroaderThanNeeded ? (
            <aside className={styles.scopeWarning} aria-label="권한 범위 주의">
              <strong>선택한 범위에 현재 목적과 관련 없거나 더 넓은 정보가 포함될 수 있습니다.</strong>
              <p>
                먼저 최소 권장 범위로 사용해 본 뒤, 부족한 기능이 확인될 때 권한을 한 단계씩
                추가하는 편이 안전합니다.
              </p>
            </aside>
          ) : (
            <aside className={styles.scopeNotice} aria-label="권한 범위 안내">
              <strong>현재 목적과 비교해 과도하게 넓은 범위는 아닙니다.</strong>
              <p>실제 연결 시에도 항목과 기간을 다시 확인하고 필요한 정보만 선택하세요.</p>
            </aside>
          )}

          <div className={styles.resultColumns}>
            <article className={styles.detailCard}>
              <p className={styles.detailLabel}>행동 규칙</p>
              <h4>사용자가 정한 선 안에서만</h4>
              <p>{profile.actionPolicy}</p>
            </article>
            <article className={styles.detailCard}>
              <p className={styles.detailLabel}>항상 제외할 정보와 행동</p>
              <ul className={styles.exclusionList}>
                {profile.exclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <article className={styles.planCard}>
            <div className={styles.planHeading}>
              <p className={styles.detailLabel}>권한을 넓히지 않고 시작하는 방법</p>
              <h4>3단계 실행 계획</h4>
            </div>
            <ol className={styles.planList}>
              {profile.steps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </article>

          <aside className={styles.simulatorNotice}>
            <strong>이 결과는 권한 설계 시뮬레이션입니다.</strong>
            <p>
              이 페이지는 휴대폰, AI 계정, 인터넷 기록, 메신저, 일정 또는 파일에 실제로
              접근하지 않았으며 어떤 정보도 외부 AI로 전송하지 않았습니다.
            </p>
          </aside>

          <div className={styles.resultActions}>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => setPhase("done")}
            >
              설정안 확인 완료
            </button>
            <button className={styles.secondaryButton} type="button" onClick={reviewAnswers}>
              선택 다시 보기
            </button>
            <button className={styles.textButton} type="button" onClick={resetWizard}>
              처음부터
            </button>
          </div>
        </section>
      ) : null}

      {phase === "done" && profile ? (
        <section className={styles.donePanel} aria-labelledby="connection-done-title">
          <p className={styles.stepLabel}>설계 완료</p>
          <h3
            className={styles.doneTitle}
            id="connection-done-title"
            ref={headingRef}
            tabIndex={-1}
          >
            {profile.name} 설정안이 준비되었습니다.
          </h3>
          <p className={styles.doneLead}>
            실제 연결이 완료된 것은 아닙니다. 이 페이지에서 고른 내용은 휴대폰이나 AI 계정으로
            전송되지 않았습니다. 실제 서비스에서는 이 설정안을 확인한 뒤 각 권한을 별도로
            승인해야 합니다.
          </p>
          <div className={styles.doneSummary}>
            <div>
              <span>시작 범위</span>
              <strong>{profile.recommendedAccess}</strong>
            </div>
            <div>
              <span>행동 원칙</span>
              <strong>{profile.recommendedRule}</strong>
            </div>
          </div>
          <div className={styles.resultActions}>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => setPhase("result")}
            >
              결과 다시 보기
            </button>
            <button className={styles.secondaryButton} type="button" onClick={resetWizard}>
              새 설정안 만들기
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
