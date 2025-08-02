# [0012] - 점수 시스템 구현

## 📅 작업 정보
- **담당**: Backend Developer
- **우선순위**: Medium
- **상태**: 📋 대기중
- **예상 소요시간**: 2-3시간
- **의존성**: [0006] 그리드 이동 시스템

## 🎯 작업 목표
플레이어의 전진에 따른 점수 계산 및 최고 점수 관리 시스템 구현

## 📝 작업 내용
### 구현 사항
- [ ] ScoreManager 클래스 구현
- [ ] 점수 계산 로직 (최고 Y 좌표 추적)
- [ ] 현재 점수 실시간 업데이트
- [ ] 최고 점수 저장 및 불러오기
- [ ] 점수 변경 이벤트 발행
- [ ] 점수 관련 통계 수집

### 점수 계산 규칙
```typescript
interface ScoreRules {
  pointsPerForward: 1; // 앞으로 한 칸당 1점
  trackHighestY: true; // 최고 Y 좌표가 점수
  bonusPoints: {
    // 향후 확장용
    milestone: { 50: 10, 100: 25, 200: 50 }
  };
}
```

### 점수 데이터 구조
```typescript
interface ScoreData {
  currentScore: number;
  highScore: number;
  sessionHighScore: number;
  statistics: {
    totalMoves: number;
    backwardMoves: number;
    lateralMoves: number;
    playTime: number;
  };
}
```

### 저장 시스템
- localStorage 키: 'crossy_road_score'
- 자동 저장: 게임 오버 시
- 데이터 검증: 부정 점수 방지

### 이벤트 발행
```typescript
interface ScoreEvents {
  'score:update': { current: number };
  'score:new_high': { score: number };
  'score:milestone': { milestone: number };
}
```

### 테스트 항목
- [ ] 점수 증가 정확도 테스트
- [ ] 최고 점수 갱신 로직 테스트
- [ ] 저장/불러오기 동작 확인
- [ ] 이벤트 발행 및 구독 테스트
- [ ] 데이터 무결성 검증

## 💡 참고사항
- 점수는 뒤로 가도 감소하지 않음
- 브라우저 새로고침 시에도 최고 점수 유지
- 향후 리더보드 연동을 위한 확장성 고려

## 📦 예상 산출물
- `/src/game/managers/ScoreManager.ts`
- `/src/game/storage/ScoreStorage.ts`
- `/src/game/hooks/useScore.ts`
- `/src/game/types/ScoreTypes.ts`