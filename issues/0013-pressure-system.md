# [0013] - 압박 시스템 (3초 타이머) 구현

## 📅 작업 정보
- **담당**: Backend Developer
- **우선순위**: Medium
- **상태**: 📋 대기중
- **예상 소요시간**: 3-4시간
- **의존성**: [0007] 카메라 시스템, [0004] 입력 시스템

## 🎯 작업 목표
플레이어가 3초간 움직이지 않으면 화면이 강제로 스크롤되는 압박 시스템 구현

## 📝 작업 내용
### 구현 사항
- [ ] PressureSystem 클래스 구현
- [ ] 입력 감지 및 타이머 리셋 로직
- [ ] 경고 표시 시스템 (2초 시점)
- [ ] 강제 스크롤 시작 로직
- [ ] 플레이어 밀림 감지 및 게임 오버
- [ ] 압박 상태 시각적 피드백

### 압박 시스템 사양
```typescript
interface PressureConfig {
  inactivityThreshold: 3000; // ms
  warningTime: 2000; // ms (경고 시작)
  scrollSpeed: 1.0; // units per second
  acceleration: 0.1; // speed increase per second
  maxSpeed: 2.0; // maximum scroll speed
}
```

### 상태 머신
```typescript
enum PressureState {
  IDLE = 'idle',
  WARNING = 'warning',
  SCROLLING = 'scrolling',
  CRITICAL = 'critical' // 플레이어가 거의 화면 밖
}
```

### 시각적 피드백
1. **2초 (경고)**: 화면 가장자리 붉은색 점멸
2. **2.5초**: 점멸 속도 증가, 경고음
3. **3초 (스크롤)**: 화면 흔들림, 강제 스크롤 시작
4. **위험**: 플레이어가 화면 하단 근처일 때 강조

### 플레이어 상태 체크
```typescript
interface PlayerBounds {
  screenBottom: 0;
  dangerZone: 2; // 화면 하단에서 2 유닛
  deathZone: -1; // 화면 밖
}
```

### 테스트 항목
- [ ] 타이머 정확도 테스트 (3초)
- [ ] 입력 시 타이머 리셋 확인
- [ ] 경고 표시 타이밍 테스트
- [ ] 스크롤 속도 일관성 확인
- [ ] 플레이어 밀림 감지 정확도

## 💡 참고사항
- 게임 일시정지 시 타이머도 정지
- 게임 오버 시 압박 시스템 중지
- 난이도에 따라 타이머 조정 가능하도록 설계

## 📦 예상 산출물
- `/src/game/systems/PressureSystem.ts`
- `/src/game/timers/InactivityTimer.ts`
- `/src/renderer/effects/PressureWarning.tsx`
- `/src/game/validators/PlayerBoundsChecker.ts`