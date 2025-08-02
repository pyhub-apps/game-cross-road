# [0011] - 충돌 감지 시스템 구현

## 📅 작업 정보
- **담당**: Backend Developer
- **우선순위**: Medium
- **상태**: 📋 대기중
- **예상 소요시간**: 3-4시간
- **의존성**: [0010] 장애물 시스템, [0005] 플레이어 캐릭터

## 🎯 작업 목표
플레이어와 장애물/환경 간의 충돌을 감지하고 적절한 게임 이벤트 발생

## 📝 작업 내용
### 구현 사항
- [ ] AABB 충돌 감지 알고리즘 구현
- [ ] 충돌 타입별 처리 로직
- [ ] 공간 분할을 통한 충돌 검사 최적화
- [ ] 충돌 이벤트 발행 시스템
- [ ] 플랫폼 탑승 로직 (통나무/거북이)
- [ ] 디버그용 충돌 영역 시각화

### 충돌 타입 및 결과
```typescript
interface CollisionTypes {
  vehicle: {
    result: 'GAME_OVER',
    effect: 'instant'
  },
  water: {
    result: 'CHECK_PLATFORM',
    effect: 'conditional'
  },
  platform: {
    result: 'SAFE',
    effect: 'attach_movement'
  },
  boundary: {
    result: 'GAME_OVER',
    effect: 'instant'
  }
}
```

### AABB 충돌 검사
```typescript
interface AABB {
  min: Vector3;
  max: Vector3;
}

function checkCollision(a: AABB, b: AABB): boolean {
  return (
    a.min.x <= b.max.x && a.max.x >= b.min.x &&
    a.min.y <= b.max.y && a.max.y >= b.min.y &&
    a.min.z <= b.max.z && a.max.z >= b.min.z
  );
}
```

### 최적화 전략
- 그리드 기반 공간 분할
- 레이어별 충돌 마스크
- 브로드페이즈 → 내로우페이즈
- 이동 객체만 검사

### 특수 케이스 처리
1. 물 위에서 플랫폼 체크
2. 플랫폼 탑승 시 이동 동기화
3. 화면 경계 충돌 감지

### 테스트 항목
- [ ] 정확한 충돌 감지 확인
- [ ] 프레임 독립적 충돌 검사
- [ ] 고속 이동 시 터널링 방지
- [ ] 성능 테스트 (많은 장애물)
- [ ] 플랫폼 탑승/하차 동작 확인

## 💡 참고사항
- 충돌 박스는 시각적 모델보다 약간 작게 설정 (관대한 판정)
- 연속 충돌 감지로 빠른 객체도 놓치지 않도록
- 충돌 시 즉각적인 피드백 제공

## 📦 예상 산출물
- `/src/core/systems/CollisionSystem.ts` (개선)
- `/src/game/systems/CollisionHandler.ts`
- `/src/game/utils/SpatialGrid.ts`
- `/src/game/debug/CollisionDebugger.ts`