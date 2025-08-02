# [0008] - 절차적 맵 생성 시스템 구현

## 📅 작업 정보
- **담당**: Backend Developer
- **우선순위**: High
- **상태**: 📋 대기중
- **예상 소요시간**: 5-6시간
- **의존성**: [0006] 그리드 이동 시스템

## 🎯 작업 목표
PRD의 규칙에 따라 절차적으로 맵을 생성하는 시스템 구현

## 📝 작업 내용
### 구현 사항
- [ ] MapGenerator 클래스 완성
- [ ] 레인 타입 정의 (GRASS, ROAD, RIVER)
- [ ] 맵 생성 규칙 엔진 구현
- [ ] 청크 기반 무한 맵 생성
- [ ] 난이도에 따른 생성 파라미터 조정
- [ ] JSON 기반 규칙 설정 시스템

### 맵 생성 규칙 (PRD 기준)
```typescript
interface GenerationRules {
  road: {
    minConsecutive: 1,
    maxConsecutive: 4,
    vehicleDensity: 0.3,
    speedRange: [1, 3]
  },
  river: {
    minConsecutive: 1,
    maxConsecutive: 3,
    platformDensity: 0.4,
    flowSpeed: 1
  },
  safeZone: {
    frequency: [5, 10], // 5~10 레인마다
    minWidth: 1,
    maxWidth: 3
  }
}
```

### 청크 시스템
```typescript
interface ChunkSystem {
  chunkSize: 20; // 레인 단위
  activeChunks: 3; // 동시 활성 청크 수
  generateAhead: 10; // 플레이어보다 앞서 생성할 레인 수
}
```

### 난이도 진행
- 0-50 레인: 쉬움 (낮은 밀도, 느린 속도)
- 50-150 레인: 보통 (중간 밀도, 중간 속도)
- 150+ 레인: 어려움 (높은 밀도, 빠른 속도)

### 테스트 항목
- [ ] 생성 규칙 준수 확인
- [ ] 연속 레인 제한 테스트
- [ ] 안전 지대 빈도 테스트
- [ ] 청크 전환 시 끊김 없음 확인
- [ ] 메모리 사용량 모니터링

## 💡 참고사항
- 시드 기반 생성으로 재현 가능한 맵 생성
- 향후 테마 추가를 위한 확장 가능한 구조
- 성능을 위해 화면 밖 레인은 단순화된 데이터로 유지

## 📦 예상 산출물
- `/src/game/generation/MapGenerator.ts` (개선)
- `/src/game/generation/LaneFactory.ts`
- `/src/game/generation/GenerationRules.ts`
- `/src/game/generation/ChunkManager.ts`
- `/src/shared/data/defaultMapRules.json`