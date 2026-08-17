import RoutineWizard from "@/components/RoutineWizard";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="틈새 홈">
          틈새
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#how">서비스 소개</a>
          <a href="#maker">루틴 만들기</a>
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
            다음 수업까지 20분이든 90분이든, 지금의 시간과 에너지부터 장소와
            도구까지 살펴 한 가지 실행 루틴을 제안합니다. 무엇을 할지 고민하는
            시간부터 줄여보세요.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#maker">
              내 공강 설계하기
            </a>
            <a className="text-link" href="#how">
              서비스 방식 보기
            </a>
          </div>
          <dl className="hero-stats" aria-label="서비스 핵심 수치">
            <div>
              <dt>조건 분석</dt>
              <dd>1.5초</dd>
            </div>
            <div>
              <dt>맞춤 질문</dt>
              <dd>6개</dd>
            </div>
            <div>
              <dt>추천 후보</dt>
              <dd>18개</dd>
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
            <h3>고민을 질문으로 바꿉니다</h3>
            <p>
              여섯 가지 상태를 한 번에 하나씩 고르면, 복잡한 계획 없이도 지금의
              조건을 정리할 수 있습니다.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>실행할 수 있는 안만 남깁니다</h3>
            <p>
              장소와 도구를 기준으로 우선순위를 조정하고, 맞지 않는 행동은 같은
              목표의 실행 가능한 방식으로 바꿉니다.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>다른 방향까지 비교합니다</h3>
            <p>
              한 가지 정답 대신 현재 조건에서 가능한 상위 세 가지를 보여주고 바로
              실행할 수 있게 만듭니다.
            </p>
          </article>
        </div>
      </section>

      <section className="maker-section" id="maker" aria-labelledby="maker-title">
        <div className="section-heading">
          <p className="eyebrow">직접 사용해 보기</p>
          <h2 id="maker-title">지금 공강에 맞는 루틴을 만드세요.</h2>
          <p>
            여섯 번의 짧은 선택을 마치면, 현재 조건에서 실행 가능한 세 가지 방향을
            비교해 한 루틴으로 정리합니다.
          </p>
        </div>
        <RoutineWizard />
      </section>

      <footer className="site-footer">
        <div>
          <a className="wordmark" href="#top">
            틈새
          </a>
          <p>애매한 공강을 실행 가능한 한 덩어리로.</p>
        </div>
        <div>
          <span>서비스</span>
          <a href="#how">소개</a>
          <a href="#maker">루틴 만들기</a>
        </div>
        <div>
          <span>사용 흐름</span>
          <a href="#maker">6개 질문 답하기</a>
          <a href="#maker">맞춤 루틴 실행하기</a>
        </div>
        <p className="footer-note">틈새 · 공강 루틴 추천 서비스 · 2026</p>
      </footer>
    </main>
  );
}
