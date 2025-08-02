# [0002] - React Three Fiber 초기 설정 및 기본 씬 구성

## 📅 작업 정보
- **담당**: Frontend Developer
- **우선순위**: Critical
- **상태**: 📋 대기중
- **예상 소요시간**: 2-3시간
- **의존성**: 없음

## 🎯 작업 목표
React Three Fiber를 설정하고 기본 3D 씬을 구성하여 게임 렌더링의 기반을 마련

## 📝 작업 내용
### 구현 사항
- [ ] React Three Fiber 및 Three.js 관련 패키지 설치
- [ ] 기본 Canvas 컴포넌트 설정
- [ ] 아이소메트릭 카메라 설정 (45도 각도)
- [ ] 기본 조명 설정 (Ambient + Directional)
- [ ] 개발용 디버그 도구 설정 (OrbitControls, Stats)
- [ ] 반응형 캔버스 크기 조정 구현

### 기술적 고려사항
- 모바일 성능을 위한 픽셀 비율 제한
- WebGL 지원 여부 체크 및 폴백 처리
- 렌더링 최적화 설정 (antialias, shadows)

### 테스트 항목
- [ ] 다양한 브라우저에서 정상 렌더링 확인
- [ ] 반응형 리사이즈 동작 확인
- [ ] 모바일 디바이스에서 성능 테스트

## 💡 참고사항
- React Three Fiber 문서: https://docs.pmnd.rs/react-three-fiber
- 아이소메트릭 카메라 설정 예제 참고

## 📦 예상 산출물
- `/src/renderer/components/GameCanvas.tsx`
- `/src/renderer/components/Camera.tsx`
- `/src/renderer/hooks/useResponsiveSize.ts`