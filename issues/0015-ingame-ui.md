# [0015] - 인게임 HUD 및 게임오버 화면 구현

## 📅 작업 정보
- **담당**: Frontend Developer
- **우선순위**: Medium
- **상태**: 📋 대기중
- **예상 소요시간**: 4-5시간
- **의존성**: [0012] 점수 시스템, [0003] 게임 상태 관리

## 🎯 작업 목표
게임 플레이 중 표시되는 HUD와 게임 종료 시 표시되는 게임오버 화면 구현

## 📝 작업 내용
### 구현 사항
- [ ] 인게임 HUD 컴포넌트 구현
- [ ] 현재 점수 실시간 표시
- [ ] 압박 시스템 경고 UI
- [ ] 게임오버 화면 구현
- [ ] 점수 요약 및 재시작 버튼
- [ ] 화면 전환 애니메이션

### 인게임 HUD 구조
```typescript
interface GameHUD {
  score: {
    position: 'top-center',
    style: 'large-voxel-numbers',
    animation: 'score-pop' // 점수 증가 시
  },
  pressureWarning: {
    type: 'screen-border-flash',
    color: 'red',
    startAt: 2000 // ms
  }
}
```

### 게임오버 화면 구조
```typescript
interface GameOverScreen {
  title: 'GAME OVER',
  scoreDisplay: {
    current: number,
    best: number,
    isNewRecord: boolean
  },
  buttons: {
    retry: 'TRY AGAIN',
    menu: 'MAIN MENU'
  }
}
```

### HUD 디자인 원칙
- 최소한의 정보만 표시
- 게임 플레이를 방해하지 않는 위치
- 큰 폰트로 가독성 확보
- 투명도 활용으로 시야 확보

### 게임오버 애니메이션
1. 화면 페이드 아웃 (0.5초)
2. 게임오버 텍스트 등장 (0.3초)
3. 점수 표시 (0.3초)
4. 버튼 등장 (0.3초)
5. 신기록 시 축하 효과

### 반응형 고려사항
```scss
// HUD 폰트 크기
.score {
  font-size: clamp(24px, 5vw, 48px);
}

// 게임오버 화면 레이아웃
.game-over-container {
  padding: 5vh 5vw;
  max-width: 500px;
}
```

### 테스트 항목
- [ ] 점수 업데이트 실시간 반영 확인
- [ ] 압박 경고 표시 타이밍 테스트
- [ ] 게임오버 전환 부드러움 확인
- [ ] 버튼 클릭/터치 반응성 테스트
- [ ] 다양한 화면에서 UI 깨짐 없음 확인

## 💡 참고사항
- HUD는 Canvas 위에 오버레이로 표시
- 게임오버 시 입력 차단 처리
- 애니메이션은 성능에 영향 없도록 CSS 사용

## 📦 예상 산출물
- `/src/ui/components/GameHUD.tsx`
- `/src/ui/components/ScoreDisplay.tsx`
- `/src/ui/components/PressureWarning.tsx`
- `/src/ui/screens/GameOverScreen.tsx`
- `/src/ui/styles/GameUI.module.css`