import ConnectionWizard from "./ConnectionWizard";
import styles from "./connect-line.module.css";

const permissionRows = [
  {
    name: "일정 읽기",
    state: "허용",
    tone: "allowed",
  },
  {
    name: "초안 만들기",
    state: "확인 후",
    tone: "confirm",
  },
  {
    name: "발송·삭제",
    state: "차단",
    tone: "blocked",
  },
] as const;

const principles = [
  {
    number: "01",
    title: "필요한 만큼만",
    description:
      "목적을 이루는 데 꼭 필요한 정보만 고르고, 그보다 넓은 접근은 따로 구분합니다.",
  },
  {
    number: "02",
    title: "행동 전에 확인",
    description:
      "AI가 제안하는 것과 직접 실행하는 것을 나누고, 중요한 행동에는 확인 단계를 둡니다.",
  },
  {
    number: "03",
    title: "언제든 다시 조정",
    description:
      "보관 기간과 허용 범위를 처음부터 정해 두고, 필요가 끝나면 연결을 줄일 수 있게 설계합니다.",
  },
] as const;

export default function ConnectLinePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top" aria-label="연결선 홈">
          연결선
        </a>
        <nav className={styles.nav} aria-label="연결선 주요 메뉴">
          <a href="#method">서비스 방식</a>
          <a href="#planner">설정 설계</a>
        </nav>
        <a className={styles.headerCta} href="#planner">
          내 연결선 만들기
        </a>
      </header>

      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>개인 AI 권한 설계 시뮬레이터</p>
          <h1 id="hero-title">
            내 정보와 AI 사이,
            <br />
            <span>허용할 범위를 먼저 정합니다.</span>
          </h1>
          <p className={styles.heroLead}>
            어떤 AI를 쓸지보다 먼저, 무엇을 보여주고 어떤 행동까지 맡길지
            정합니다. 여섯 번의 선택으로 나에게 맞는 연동 설정안을 확인하세요.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#planner">
              내 연결선 설계하기
            </a>
            <a className={styles.secondaryLink} href="#method">
              설계 방식 알아보기
            </a>
          </div>
          <p className={styles.safetyNotice} role="note">
            이 서비스는 설정을 미리 살펴보는 시뮬레이터입니다. 실제 휴대폰,
            계정, 메신저 또는 파일에 접근하지 않습니다.
          </p>
        </div>

        <aside className={styles.deviceVisual} aria-label="AI 권한 설정 예시">
          <div className={styles.deviceTopline}>
            <span>AI preference</span>
            <span>연결선 설정안</span>
          </div>
          <div className={styles.deviceChoice}>
            <p>선택한 AI</p>
            <strong>GPT</strong>
            <span>일정과 할 일 정리</span>
          </div>
          <div className={styles.permissionPanel}>
            <p className={styles.panelLabel}>허용 범위</p>
            {permissionRows.map((permission) => (
              <div className={styles.permissionRow} key={permission.name}>
                <span>{permission.name}</span>
                <b data-tone={permission.tone}>{permission.state}</b>
              </div>
            ))}
          </div>
          <p className={styles.deviceFooter}>
            사용자가 정한 선 안에서만 제안합니다.
          </p>
        </aside>
      </section>

      <section
        className={styles.methodSection}
        id="method"
        aria-labelledby="method-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>연결선의 기준</p>
          <h2 id="method-title">
            연결의 시작은 더 많은 권한이 아니라,
            <br />
            명확한 경계입니다.
          </h2>
          <p>
            편리함과 통제권을 함께 살펴보고, 지금 필요한 수준의 설정안을
            단계적으로 만듭니다.
          </p>
        </div>
        <div className={styles.principleGrid}>
          {principles.map((principle) => (
            <article className={styles.principleCard} key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={styles.plannerSection}
        id="planner"
        aria-labelledby="planner-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>직접 설계해 보기</p>
          <h2 id="planner-title">나에게 맞는 AI 연동 범위를 설계하세요.</h2>
          <p>
            사용할 AI부터 목적, 정보 범위, 실행 권한, 보호 수준과 보관 기간까지
            한 화면에 하나씩 선택합니다.
          </p>
        </div>
        <ConnectionWizard />
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <a className={styles.wordmark} href="#top">
            연결선
          </a>
          <p>AI와 내 정보 사이의 경계를 먼저 설계합니다.</p>
        </div>
        <div className={styles.footerLinks}>
          <span>서비스</span>
          <a href="#method">설계 원칙</a>
          <a href="#planner">설정안 만들기</a>
        </div>
        <p className={styles.footerNotice}>
          실제 권한 요청이나 데이터 전송이 발생하지 않는 체험형 서비스입니다.
        </p>
        <p className={styles.copyright}>연결선 · AI 권한 설계 시뮬레이터 · 2026</p>
      </footer>
    </main>
  );
}
