# 틈새 — 공강 루틴 추천 서비스

대학생이 다음 수업 전까지 남은 공강을 애매하게 흘려보내지 않도록, 시간·에너지·목표·장소·도구·방해 요인을 바탕으로 실행 가능한 맞춤 루틴을 추천하는 서비스입니다.

GitHub 저장소: https://github.com/dlaedgus/-teumsae-campus

## 서비스 흐름

1. 남은 시간, 현재 에너지, 이번 공강의 목표, 장소, 도구, 방해 요인을 한 화면에 하나씩 선택합니다.
2. 마지막 선택 뒤 1.5초 동안 시간 배분과 실행 가능 조건을 분석합니다.
3. 목표별 3개씩 구성한 18개 후보 중 현재 조건에 맞는 상위 3개를 비교합니다.
4. 목표·시간과 에너지·실행 환경을 근거로 왜 이 루틴이 추천되었는지 확인합니다.
5. 20·30·40분은 3단계, 60분은 4단계, 90분은 5단계로 나뉜 루틴을 시작하고 완료합니다.
6. 완료 뒤 만족도·상황 적합도·재사용 의향을 선택형 문항으로 제출할 수 있습니다.

## 익명 사용자 검증

사용자가 화면에서 `익명 사용자 검증에 참여하기`를 직접 선택한 경우에만 아래 이벤트를 Vercel Runtime Logs에 구조화 JSON으로 기록합니다.

- `wizard_start`: 질문 흐름 시작
- `step_complete`: 질문 단계별 선택 완료
- `recommendation_view`: 추천 결과 확인
- `routine_start`: 루틴 시작
- `routine_complete`: 루틴 완료
- `feedback_submit`: 도움됨 1~5점, 상황 적합도, 재사용 의향 제출

각 실행은 브라우저 메모리에만 존재하는 임시 UUID로 연결합니다. 쿠키·로컬 저장소·이름·연락처·자유서술·기기 정보는 수집하지 않습니다. 사용자가 새 공강 설계를 시작하면 기존 UUID는 폐기됩니다. 공개 서비스에는 응답 수, 평균, KPI 또는 다운로드 링크를 표시하지 않습니다.

수집 여부는 Vercel의 `teumsae-campus` 프로젝트에서 **Logs**를 열고 `validation_event`를 검색해 확인할 수 있습니다.

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
- 동의 기반 익명 사용자 검증 이벤트와 완료 후 선택형 피드백
- 웹 배포와 분리된 CSV 검증 데이터 및 재현 가능한 생성 스크립트
