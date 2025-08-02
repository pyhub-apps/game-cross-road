# [0004] - 입력 시스템과 플레이어 연결 구현

## 📅 작업 정보
- **담당**: Frontend Developer
- **우선순위**: Critical
- **상태**: 📋 대기중
- **예상 소요시간**: 3-4시간
- **의존성**: [0002] React Three Fiber 설정

## 🎯 작업 목표
키보드, 마우스, 터치 입력을 통합 관리하고 플레이어 엔티티와 연결

## 📝 작업 내용
### 구현 사항
- [ ] WebInputManager 완성 (키보드, 마우스, 터치 통합)
- [ ] 입력 버퍼링 시스템 구현 (프레임당 1회 입력 제한)
- [ ] 터치 제스처 인식 (탭, 스와이프)
- [ ] 키보드 입력 매핑 (화살표 키)
- [ ] 입력 이벤트를 게임 커맨드로 변환
- [ ] 디버그용 입력 시각화

### 입력 매핑
```typescript
interface InputMapping {
  keyboard: {
    ArrowUp: 'MOVE_FORWARD',
    ArrowDown: 'MOVE_BACKWARD',
    ArrowLeft: 'MOVE_LEFT',
    ArrowRight: 'MOVE_RIGHT'
  },
  touch: {
    tap: 'MOVE_FORWARD',
    swipeUp: 'MOVE_FORWARD',
    swipeDown: 'MOVE_BACKWARD',
    swipeLeft: 'MOVE_LEFT',
    swipeRight: 'MOVE_RIGHT'
  }
}
```

### 터치 제스처 인식 기준
- 탭: 이동 거리 < 10px, 시간 < 300ms
- 스와이프: 이동 거리 > 30px, 속도 > 0.5px/ms

### 테스트 항목
- [ ] 키보드 입력 반응성 테스트
- [ ] 터치 제스처 정확도 테스트
- [ ] 동시 입력 처리 테스트
- [ ] 입력 버퍼링 동작 확인
- [ ] 모바일 브라우저 호환성 테스트

## 💡 참고사항
- 입력 지연을 최소화하기 위해 이벤트 리스너 최적화
- 모바일에서 의도하지 않은 스크롤/줌 방지
- 접근성을 위한 키보드 네비게이션 지원

## 📦 예상 산출물
- `/src/infrastructure/input/WebInputManager.ts` (개선)
- `/src/infrastructure/input/TouchGestureDetector.ts`
- `/src/infrastructure/input/InputBuffer.ts`
- `/src/game/systems/InputSystem.ts`