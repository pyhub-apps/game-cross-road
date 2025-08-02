# [0014] - 메인 메뉴 화면 구현

## 📅 작업 정보
- **담당**: Frontend Developer
- **우선순위**: Medium
- **상태**: 📋 대기중
- **예상 소요시간**: 3-4시간
- **의존성**: [0003] 게임 상태 관리

## 🎯 작업 목표
게임 시작 시 표시되는 메인 메뉴 화면을 반응형으로 구현

## 📝 작업 내용
### 구현 사항
- [ ] MainMenu React 컴포넌트 구현
- [ ] 게임 타이틀 및 로고 표시
- [ ] 시작 버튼 구현
- [ ] 최고 점수 표시
- [ ] 반응형 레이아웃 구현
- [ ] 배경 애니메이션 효과

### UI 구조
```typescript
interface MainMenuElements {
  title: {
    text: 'PROJECT CROSSY',
    style: 'voxel-style-font'
  },
  buttons: {
    start: {
      text: 'TAP TO START',
      action: 'startGame'
    }
  },
  displays: {
    highScore: {
      prefix: 'BEST: ',
      value: number
    }
  }
}
```

### 디자인 사양
- 복셀 스타일 폰트 사용
- 미니멀한 UI 디자인
- 대비가 높은 색상 사용
- 큰 터치 영역 (모바일 고려)

### 반응형 브레이크포인트
```scss
// 모바일 세로
@media (max-width: 480px) {
  font-size: 24px;
  button-size: 200x60px;
}

// 태블릿
@media (min-width: 481px) and (max-width: 1024px) {
  font-size: 32px;
  button-size: 250x80px;
}

// 데스크톱
@media (min-width: 1025px) {
  font-size: 48px;
  button-size: 300x100px;
}
```

### 애니메이션
- 타이틀: 부드러운 등장 효과
- 버튼: 호버/탭 시 스케일 효과
- 배경: 서서히 움직이는 구름/도로

### 테스트 항목
- [ ] 다양한 화면 크기에서 레이아웃 확인
- [ ] 터치/클릭 반응성 테스트
- [ ] 최고 점수 표시 정확도
- [ ] 애니메이션 성능 테스트
- [ ] 접근성 테스트 (키보드 네비게이션)

## 💡 참고사항
- CSS-in-JS 또는 CSS Modules 사용
- 웹 폰트 로딩 최적화
- 다크 모드 지원 고려

## 📦 예상 산출물
- `/src/ui/screens/MainMenu.tsx`
- `/src/ui/components/GameTitle.tsx`
- `/src/ui/components/StartButton.tsx`
- `/src/ui/styles/MainMenu.module.css`
- `/public/fonts/voxel-font.woff2`