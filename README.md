# 틈새 — 공강 루틴 추천 서비스

대학생이 다음 수업 전까지 남은 공강을 애매하게 흘려보내지 않도록, 시간·에너지·목적·장소를 바탕으로 실행 가능한 3단계 루틴을 추천하는 서비스입니다.

GitHub 저장소: https://github.com/dlaedgus/-teumsae-campus

## 서비스 흐름

1. 남은 시간 20·40·60·90분 중 하나를 선택합니다.
2. 현재 에너지, 이번 공강의 목적, 머물 장소를 선택합니다.
3. 조건에 맞춘 준비·핵심·마무리 루틴을 확인합니다.
4. 루틴을 시작하고 완료한 뒤 다른 조건으로 다시 추천받을 수 있습니다.

## 사용자 검증 KPI

검증 결과는 웹 서비스에 노출하지 않고 별도 데이터 파일로 관리합니다. 아래 결과는 측정 구조를 설명하기 위해 생성한 합성 시뮬레이션 데이터이며 실제 사용자 조사 결과가 아닙니다.

| KPI | 계산 | 합성 결과 | 목표 |
| --- | --- | ---: | ---: |
| 추천 시작률 | routine_start / recommendation_view | 72.1% | 65% |
| 시작 후 완료율 | routine_complete / routine_start | 73.3% | 65% |
| 평균 도움됨 점수 | helpfulness_score 평균 | 4.14/5 | 4.0/5 |
| 도움됨 긍정률 | 4점 이상 / 전체 응답 | 80.0% | 75% |
| 다회 체험률 | 2회 이상 가상 참여자 / 전체 가상 참여자 | 70.0% | 50% |

## 데이터 파일

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
- 순수 CSS 기반 반응형 UI
- 웹 배포와 분리된 CSV 검증 데이터 및 재현 가능한 생성 스크립트

## 실제 검증으로 전환할 때

현재 화면의 시작·완료 동작은 프로토타입 인터랙션입니다. 실제 사용자 데이터를 수집하려면 `landing_view`, `routine_builder_start`, `recommendation_view`, `routine_start`, `routine_complete` 이벤트를 분석 도구나 데이터베이스로 전송하고 개인정보 고지와 동의를 추가해야 합니다.
