# [0009] - 레인 타입별 렌더링 구현

## 📅 작업 정보
- **담당**: Frontend Developer
- **우선순위**: High
- **상태**: 📋 대기중
- **예상 소요시간**: 4-5시간
- **의존성**: [0008] 절차적 맵 생성

## 🎯 작업 목표
도로, 강, 잔디 등 각 레인 타입을 복셀 스타일로 렌더링

## 📝 작업 내용
### 구현 사항
- [ ] 레인별 복셀 타일 모델 생성
- [ ] 레인 React Three Fiber 컴포넌트 구현
- [ ] 인스턴스드 메시를 활용한 대량 렌더링
- [ ] 레인별 머티리얼 및 텍스처 설정
- [ ] 동적 레인 로딩/언로딩 시스템
- [ ] 레인 장식 요소 추가 (나무, 바위 등)

### 레인 타입별 디자인
```typescript
interface LaneDesigns {
  grass: {
    baseColor: '#4CAF50',
    texture: 'grass_voxel',
    decorations: ['tree', 'rock', 'flower']
  },
  road: {
    baseColor: '#424242',
    texture: 'asphalt_voxel',
    decorations: ['road_line', 'manhole']
  },
  river: {
    baseColor: '#2196F3',
    texture: 'water_voxel',
    animated: true,
    decorations: ['lily_pad', 'reed']
  }
}
```

### 렌더링 최적화
- 인스턴스드 메시로 동일 타일 대량 렌더링
- LOD (Level of Detail) 시스템
- 프러스텀 컬링으로 화면 밖 객체 제외
- 텍스처 아틀라스 사용

### 복셀 타일 사양
- 크기: 1x1x0.2 유닛
- 복셀 해상도: 8x8x2
- 변형: 각 타입별 3-5개 변형

### 테스트 항목
- [ ] 대량 레인 렌더링 성능 테스트
- [ ] 다양한 레인 조합 시각 확인
- [ ] 동적 로딩/언로딩 동작 확인
- [ ] 모바일 성능 테스트 (60fps)
- [ ] 메모리 사용량 모니터링

## 💡 참고사항
- MagicaVoxel로 제작한 에셋 사용
- 물 애니메이션은 셰이더로 구현
- 향후 계절/날씨 변화를 위한 확장성 고려

## 📦 예상 산출물
- `/src/renderer/components/lanes/GrassLane.tsx`
- `/src/renderer/components/lanes/RoadLane.tsx`
- `/src/renderer/components/lanes/RiverLane.tsx`
- `/src/renderer/components/LaneRenderer.tsx`
- `/src/renderer/materials/LaneMaterials.ts`
- `/public/assets/voxels/` (복셀 모델들)