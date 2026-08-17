# 틈새 — 공강 루틴 추천 서비스

대학생이 다음 수업 전까지 남은 공강을 애매하게 흘려보내지 않도록, 시간·에너지·목표·장소·도구·방해 요인을 바탕으로 실행 가능한 맞춤 루틴을 추천하는 서비스입니다.

GitHub 저장소: https://github.com/dlaedgus/-teumsae-campus

## 서비스 흐름

1. 남은 시간, 현재 에너지, 이번 공강의 목표, 장소, 도구, 방해 요인을 한 화면에 하나씩 선택합니다.
2. 마지막 선택 뒤 1.5초 동안 시간 배분과 실행 가능 조건을 분석합니다.
3. 목표별 3개씩 구성한 18개 후보 중 현재 조건에 맞는 상위 3개를 비교합니다.
4. 20·30·40분은 3단계, 60분은 4단계, 90분은 5단계로 나뉜 루틴을 시작하고 완료합니다.
5. 같은 조건에서 다른 추천을 보거나 여섯 질문으로 돌아가 조건을 수정할 수 있습니다.

## 별도 검증 데이터

검증 결과와 KPI는 웹 서비스 및 이 문서에 노출하지 않고 아래 데이터 파일로만 관리합니다. 자료는 측정 구조를 설명하기 위해 생성한 합성 시뮬레이션 데이터이며 실제 사용자 조사 결과가 아닙니다.

- `data/synthetic_validation_sessions.csv`: 가상 참여자 40명, 추천 노출 104세션
- `data/synthetic_event_log.csv`: 랜딩부터 피드백까지 544개 이벤트
- `data/synthetic_kpi_summary.csv`: 분자·분모·목표값을 포함한 KPI 9개
- `scripts/generate-synthetic-data.mjs`: 동일한 데이터를 재현하는 생성 스크립트와 무결성 검사

모든 원본 행에는 `data_source=synthetic_course_demo`가 들어갑니다. 실제 검증에서는 같은 스키마에 수집 데이터를 넣고 출처 값을 교체하십시오.

## 로컬 실행

필요 환경은 Node.js 20 이상입니다.

```bash
npm install
npm run dev
```

합성 데이터를 다시 생성하려면 다음 명령을 실행합니다.

```bash
npm run data:generate
```

## Vercel 배포

이 저장소는 Vercel에 바로 배포할 수 있는 Next.js 프로젝트입니다. `vercel.json`이 설치와 프로덕션 빌드 명령을 지정합니다.

1. Vercel의 Add New Project에서 `dlaedgus/-teumsae-campus` 저장소를 Import합니다.
2. Project Name은 `teumsae-campus`로 입력합니다.
3. Framework Preset이 Next.js인지 확인합니다.
4. 별도 환경변수 없이 Deploy를 실행합니다.

CLI를 사용한다면 다음 순서로 배포할 수 있습니다.

```bash
npm i -g vercel
vercel
vercel --prod
```

## 기술 구성

- React 19
- Next.js 16 호환 App Router
- TypeScript
- 정적 페이지와 분리한 클라이언트형 6단계 추천 마법사
- 18개 루틴 템플릿의 결정적 조건 매칭
- 순수 CSS 기반 반응형 UI
- 웹 배포와 분리된 CSV 검증 데이터 및 재현 가능한 생성 스크립트

## 실제 검증으로 전환할 때

현재 화면의 시작·완료 동작은 프로토타입 인터랙션입니다. 실제 사용자 데이터를 수집하려면 `landing_view`, `routine_builder_start`, `recommendation_view`, `routine_start`, `routine_complete` 이벤트를 분석 도구나 데이터베이스로 전송하고 개인정보 고지와 동의를 추가해야 합니다.
