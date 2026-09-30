# Chapter 전체 시연영상

2026-09-30 콘텐츠 수정: 단계별 짧은 영상 6개 계약을 **Chapter별 전체 영상 2개**로 대체한다. Walkthrough의 각 step은 개념·과정 설명이며 영상 파일을 요구하지 않는다.

| 파일 | 전체 시연 내용 | 현재 화면 |
| --- | --- | --- |
| `01-internal-data.mp4` | CSV 변환 → 요약 CSV → 원본 업로드 → SharePoint List 구성 → Agent 연결 → 테스트 → Teams | Chapter 01 마지막 Video62% / Narrative38% |
| `02-external-data.mp4` | API Key 발급 → Copilot 제작 지시 → HTML 생성 → HTML 실행·키 입력 → 외부 데이터 연결·Dashboard 확인 | Chapter 02 마지막 Narrative38% / Video62% |

**Film 02는 Copilot에게 자연어로 지시하고 실제 실행 가능한 HTML Dashboard 파일이 만들어지는 과정을 반드시 포함한다.** 생성한 Dashboard의 입력창에 사용자 Alpha Vantage API Key를 넣는다. HTML source에 키를 하드코딩하지 않는다.

Python 로컬 서버는 `assets/videos/` 디렉터리 목록의 기존 파일명을 읽어 자동 감지한다. 없는 MP4를 요청하지 않는다. `file://` 또는 디렉터리 목록을 제공하지 않는 서버에서는 해당 파일을 넣은 뒤 `script.js`의 `chapters[n].film.available`을 `true`로 설정한다. HTML 구조 변경은 필요 없다. 기존 단계별 파일명을 추가해도 새 구조는 재생하지 않는다.

`chapters[n].film`에서 video / label / title / source / caption / duration / captions / timeline / markers를 관리한다. `duration: null`은 실제 metadata에서 길이를 읽는다. 파일이 없으면 video element를 만들지 않고 전체 시연 대기 면과 스크롤 가능한 모든 단계를 표시한다. 손상 파일은 player를 제거하고 오류와 재시도를 표시하며 seek를 비활성화한다. 명시적 retry는 교체한 파일을 새로 요청한다.

Chapter당 player 하나, 자동재생 없음, 스크롤·viewport 변경에서 source와 재생 위치 유지. 화면 밖/숨긴 탭에서는 일시정지한다. 영상은16:9 H.264 MP4 권장, 원본을 자르지 않는 contain. 음성이 있으면 실제 한국어 `.vtt`를 추가하고 `captions` 경로를 지정한다. 현재 실제 영상·자막·길이·타임코드는 미제공이다.

## 영상과 Narrative 동기화

`script.js` 상단의 `internalFilmTimeline` 7개 / `externalFilmTimeline` 5개 항목을 편집한다. 모든 `start` / `end`는 현재 `null`이다. 실제 편집본의 초 단위 시작·종료를 넣고 `step`, `label`, `title`, `description`, `indexTitle`을 수정하면 HTML을 고칠 필요가 없다.

```js
{
  start: null, // 실제 편집본의 시작 초
  end: null,   // 실제 편집본의 종료 초
  step: "01",
  label: "PREPARE",
  indexTitle: "Excel → CSV",
  title: "Excel을 AI가 읽는 데이터로.",
  description: "Copilot을 활용해 원본 데이터를 CSV 형식으로 정리합니다."
}
```

둘 다 유한한 숫자이며 `0 ≤ start < end ≤ 실제 영상 길이`이고 다른 구간과 겹치지 않을 때만 활성화한다. 종료와 다음 시작이 같은 것은 허용한다. 일부 미정·중복·음수·역순·범위 밖 구간은 seek 비활성이다. 미정 단계가 있어도 유효한 다른 단계는 사용할 수 있다. 영상 모드의 빈 구간에서는 active를 지우고 구간 밖이라고 표시한다. 스크롤 복습은 모든 단계에서 독립적으로 사용할 수 있다.

## 동일한 스크롤 스토리 / 두 모드

두 Film은 하나의 공통 controller를 쓴다. Desktop1100px 이상 Film01은 sticky 영상 왼쪽, Film02는 sticky 영상 오른쪽. Narrative는 작은 내부 scrollbar 없이 페이지 전체 스크롤의70svh 단계로 이어진다. Tablet/mobile은 둘 다 static VIDEO → STEP01 → STEP02… . Video는 breakpoint에서 이동/재생성하지 않는다.

기본/직접 스크롤은 **스크롤로 복습**: viewport46% 지점의 단계가 active이며, progress는 실제 장면 안의 스크롤 위치다. 모든 timecode가 null이어도 정상 동작한다. 임의의 시간과 무관하며 label도 영상 progress와 구분한다.

Native play/seeking 또는 유효한 step button은 **영상과 동기화**: `currentTime`이 해당 구간에 들어가면 그 scene의 번호·label·title·설명이 강조되고 player 아래 단계와 실제 구간 progress가 바뀐다. 스크롤 위치·focus는 이동하지 않는다. 재생 중 직접 스크롤하면 복습 모드로 전환되어 timeupdate가 덮어쓰지 않는다. 다시 play하거나 player 아래 “영상 단계 동기화”를 선택하면 currentTime을 따른다. 유효 cue 없는 경우 scroll story를 유지한다. 영상 구간 밖은 active 없이 dash; 직접 scroll로 언제든 전체 과정 복습 가능.

Step의 유효 button은 같은 video를 seek하며 play/pause를 유지한다. 시간이 없거나 잘못되면 button disabled. 자동재생·자동 스크롤·자동 focus 없음. 실제 파일·편집 시간은 아직 미제공이며 제품에는 임의 영상 길이/초를 넣지 않았다.

## 추가 영상 내부 Chapter Marker

기존 확장 계약은 유지한다. 실제 전체 film 편집본의 타임코드가 확정되면 `markers: []`에 `{ seconds: 실제초, label: 단계명 }`을 추가할 수 있다. 실제 길이 내 유효한 marker만 영상 밖 보조 탐색 버튼으로 표시한다. 기본 단계 탐색은 위 timeline의 editorial step button을 사용하며 markers는 선택사항이다. 버튼은 같은 영상의 currentTime을 이동하며 자동재생하지 않는다. 별도 클립과 step video를 요구하지 않는다. Marker가 없으면 이 보조 UI는 숨겨진다.

영상을 준비할 때 표시되는 API Key를 화면에서 가린다. 본 프로토타입은 키나 회사 데이터를 저장하거나 외부로 업로드하지 않는다.
