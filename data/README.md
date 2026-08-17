# 틈새 사용자 검증 데이터

본 폴더의 모든 데이터는 서비스 가설과 KPI 집계 방식을 설명하기 위해 생성한 **합성 시뮬레이션 데이터**입니다. 실제 사용자 조사 결과가 아닙니다.

## 파일

- `synthetic_validation_sessions.csv`: 가상 참여자 40명, 추천 노출 104세션의 입력·추천·시작·완료·설문 데이터
- `synthetic_event_log.csv`: 랜딩부터 피드백까지 544개 이벤트의 퍼널 로그
- `synthetic_kpi_summary.csv`: KPI 계산식, 분자·분모, 목표값을 정리한 요약

## 핵심 정의

- 추천 시작률 = `routine_start / recommendation_view`
- 시작 후 완료율 = `routine_complete / routine_start`
- 도움됨 긍정률 = 도움됨 점수 4점 이상 응답 / 전체 도움됨 응답
- 다회 체험률 = 2회 이상 이용한 가상 참여자 / 전체 가상 참여자

실제 검증 시 동일한 스키마에 실제 이벤트를 적재하고 `data_source`를 실제 수집 출처로 교체해야 합니다.
