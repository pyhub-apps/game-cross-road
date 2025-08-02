# [0007] - 카메라 시스템 구현

## 📅 작업 정보
- **담당**: Frontend Developer
- **우선순위**: High
- **상태**: 📋 대기중
- **예상 소요시간**: 3-4시간
- **의존성**: [0002] React Three Fiber 설정, [0005] 플레이어 캐릭터

## 🎯 작업 목표
아이소메트릭 뷰 카메라를 구현하고 플레이어 추적 및 압박 시스템을 위한 강제 스크롤 구현

## 📝 작업 내용
### 구현 사항
- [ ] 아이소메트릭 카메라 설정 (45도 각도)
- [ ] 플레이어 추적 카메라 로직
- [ ] 부드러운 카메라 이동 (lerp)
- [ ] 강제 스크롤 시스템 (압박용)
- [ ] 카메라 바운더리 설정
- [ ] 반응형 카메라 줌 레벨 조정

### 카메라 사양
```typescript
interface CameraConfig {
  type: 'orthographic';
  position: { x: 10, y: 10, z: 10 };
  rotation: { x: -45°, y: 45°, z: 0° };
  zoom: {
    desktop: 50,
    tablet: 40,
    mobile: 30
  };
  followSpeed: 0.1; // lerp factor
}
```

### 카메라 추적 규칙
1. 플레이어 Y 위치가 화면 중앙보다 위로 가면 추적 시작
2. 플레이어가 아래로 이동해도 카메라는 내려가지 않음
3. 강제 스크롤 시 일정 속도로 위로 이동

### 압박 시스템 카메라 동작
```typescript
interface PressureScroll {
  speed: 1.0; // units per second
  startDelay: 3000; // ms after last input
  warningTime: 2000; // ms before scroll starts
}
```

### 테스트 항목
- [ ] 다양한 화면 비율에서 뷰 확인
- [ ] 플레이어 추적 부드러움 테스트
- [ ] 강제 스크롤 타이밍 정확도
- [ ] 카메라 경계 제한 동작 확인
- [ ] 성능 테스트 (60fps 유지)

## 💡 참고사항
- Three.js OrthographicCamera 사용
- 모바일 세로 모드 고려한 뷰포트 계산
- 개발 중에는 OrbitControls로 디버깅 가능하도록

## 📦 예상 산출물
- `/src/renderer/components/GameCamera.tsx`
- `/src/renderer/systems/CameraSystem.ts`
- `/src/game/systems/PressureSystem.ts`
- `/src/renderer/hooks/useViewport.ts`