# [0005] - 플레이어 캐릭터 렌더링 및 이동 구현

## 📅 작업 정보
- **담당**: Frontend Developer
- **우선순위**: High
- **상태**: 📋 대기중
- **예상 소요시간**: 4-5시간
- **의존성**: [0002] React Three Fiber 설정, [0004] 입력 시스템

## 🎯 작업 목표
복셀 스타일의 플레이어 캐릭터를 렌더링하고 입력에 따른 이동 구현

## 📝 작업 내용
### 구현 사항
- [ ] 플레이어 복셀 모델 생성 (기본 큐브 조합)
- [ ] 플레이어 React Three Fiber 컴포넌트 구현
- [ ] 플레이어 엔티티 생성 및 컴포넌트 연결
- [ ] 이동 애니메이션 구현 (홉 모션)
- [ ] 방향 전환 시 회전 애니메이션
- [ ] 플레이어 상태 시각화 (대기/이동 중)

### 플레이어 복셀 디자인
```
정면 뷰 (1x1x1.5 유닛):
  ■ (머리)
 ■■■ (몸통)
 ▌ ▌ (다리)
```

### 이동 애니메이션 사양
- 이동 시간: 200ms
- 홉 높이: 0.3 유닛
- 회전 속도: 300도/초
- 이징: ease-out

### 컴포넌트 구조
```typescript
interface PlayerComponents {
  transform: Transform;
  velocity: Velocity;
  collider: Collider;
  player: Player;
  renderable: Renderable;
}
```

### 테스트 항목
- [ ] 그리드 정렬 정확도 테스트
- [ ] 연속 입력 시 이동 부드러움 확인
- [ ] 경계 체크 동작 확인
- [ ] 애니메이션 성능 테스트
- [ ] 다양한 화면 크기에서 비율 확인

## 💡 참고사항
- 모바일 성능을 위해 복잡한 모델 대신 단순한 기하학적 형태 사용
- 이동 중 입력 차단으로 정확한 그리드 이동 보장
- 향후 캐릭터 커스터마이징을 위한 확장 가능한 구조

## 📦 예상 산출물
- `/src/renderer/components/Player.tsx`
- `/src/renderer/models/PlayerModel.ts`
- `/src/game/entities/PlayerEntity.ts`
- `/src/game/systems/PlayerMovementSystem.ts`