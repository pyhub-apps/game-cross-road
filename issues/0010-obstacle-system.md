# [0010] - 장애물 생성 및 이동 로직 구현

## 📅 작업 정보
- **담당**: Backend Developer
- **우선순위**: High
- **상태**: 📋 대기중
- **예상 소요시간**: 4-5시간
- **의존성**: [0008] 절차적 맵 생성, [0009] 레인 렌더링

## 🎯 작업 목표
도로의 차량과 강의 통나무 등 동적 장애물을 생성하고 이동시키는 시스템 구현

## 📝 작업 내용
### 구현 사항
- [ ] ObstacleSpawner 시스템 구현
- [ ] 장애물 타입별 이동 패턴 정의
- [ ] 객체 풀링을 통한 장애물 재사용
- [ ] 레인별 장애물 생성 규칙 적용
- [ ] 화면 밖 장애물 자동 제거
- [ ] 장애물 속도 및 간격 조정 시스템

### 장애물 타입
```typescript
interface ObstacleTypes {
  vehicle: {
    types: ['car', 'truck', 'bus'],
    speed: [1, 3], // units per second
    length: [1, 2, 3], // grid units
    lane: 'road'
  },
  log: {
    types: ['log', 'turtle_group'],
    speed: [0.5, 1.5],
    length: [2, 3, 4],
    lane: 'river'
  }
}
```

### 생성 패턴
```typescript
interface SpawnPattern {
  interval: number; // 초 단위
  groupSize: [min: number, max: number];
  gap: [min: number, max: number]; // 그룹 내 간격
  direction: 'left' | 'right';
}
```

### 객체 풀 설정
- 차량: 타입별 20개
- 통나무: 타입별 15개
- 재사용 조건: 화면 밖 + 2 유닛

### 난이도별 조정
```typescript
interface DifficultySettings {
  easy: { speedMultiplier: 1.0, density: 0.3 },
  medium: { speedMultiplier: 1.5, density: 0.5 },
  hard: { speedMultiplier: 2.0, density: 0.7 }
}
```

### 테스트 항목
- [ ] 장애물 생성 빈도 테스트
- [ ] 이동 속도 일관성 확인
- [ ] 객체 풀 재사용 동작 확인
- [ ] 메모리 누수 방지 테스트
- [ ] 다양한 난이도에서 플레이 가능성 확인

## 💡 참고사항
- 프레임 독립적 이동 (deltaTime 사용)
- 장애물 간 최소 간격 보장
- 플레이어 시작 위치 근처는 안전하게

## 📦 예상 산출물
- `/src/game/systems/ObstacleSpawner.ts`
- `/src/game/systems/ObstacleMovement.ts`
- `/src/game/entities/ObstacleFactory.ts`
- `/src/game/config/ObstaclePatterns.ts`
- `/src/shared/pools/ObstaclePool.ts`