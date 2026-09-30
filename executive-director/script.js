"use strict";

// Pretendard is the primary font in CSS on every protocol. HTTP also preloads it.
if (/^https?:$/.test(location.protocol)) {
  const fontPreload = document.createElement("link");
  fontPreload.rel = "preload";
  fontPreload.as = "font";
  fontPreload.type = "font/woff2";
  fontPreload.crossOrigin = "anonymous";
  fontPreload.href = "assets/fonts/PretendardVariable.woff2";
  document.head.append(fontPreload);
}

// Enter actual edited-film seconds here. Null means unknown, never an invented timecode.
// A seek requires BOTH start and end, a non-overlapping interval, and a loaded video.
const internalFilmTimeline = [
  { start: null, end: null, step: "01", label: "PREPARE", indexTitle: "Excel → CSV", title: "Excel을 AI가 읽는 데이터로.", description: "Copilot을 활용해 원본 데이터를 CSV 형식으로 정리합니다." },
  { start: null, end: null, step: "02", label: "STRUCTURE", indexTitle: "요약 CSV 생성", title: "조회하기 좋은 구조로 정리합니다.", description: "SharePoint List에 사용할 요약 CSV를 생성합니다." },
  { start: null, end: null, step: "03", label: "UPLOAD", indexTitle: "원본 CSV 업로드", title: "회사 데이터 공간에 연결합니다.", description: "BMS 원본 CSV를 SharePoint에 업로드합니다." },
  { start: null, end: null, step: "04", label: "ORGANIZE", indexTitle: "SharePoint List 구성", title: "SharePoint List로 구조화합니다.", description: "요약 CSV를 SharePoint List로 가져와 함께 조회·필터·관리합니다." },
  { start: null, end: null, step: "05", label: "CONNECT", indexTitle: "Agent와 데이터 연결", title: "Copilot Agent와 데이터를 연결합니다.", description: "Copilot Studio Agent를 생성하고 SharePoint List를 연결합니다." },
  { start: null, end: null, step: "06", label: "ASK", indexTitle: "Agent 테스트", title: "데이터에 자연어로 질문합니다.", description: "Agent를 테스트하고 기준월·사업부·현장코드를 지정한 답변을 확인합니다." },
  { start: null, end: null, step: "07", label: "USE", indexTitle: "Teams에서 사용", title: "Teams에서 업무에 사용합니다.", description: "Teams에서 Agent를 사용해 같은 데이터를 자연어로 조회합니다." }
];
const externalFilmTimeline = [
  { start: null, end: null, step: "01", label: "ACCESS", indexTitle: "API Key 발급", title: "외부 데이터에 접근합니다.", description: "Alpha Vantage에서 사용자의 API Key를 발급받습니다." },
  { start: null, end: null, step: "02", label: "BUILD", indexTitle: "자연어로 제작 요청", title: "필요한 업무 화면을 말로 설명합니다.", description: "Copilot에게 BMS와 외부시장 데이터를 함께 보여주는 HTML Dashboard 제작을 요청합니다." },
  { start: null, end: null, step: "03", label: "CREATE", indexTitle: "실행 가능한 HTML 생성", title: "Copilot이 실행 가능한 HTML을 만듭니다.", description: "Copilot이 브라우저에서 실행 가능한 HTML Dashboard 파일을 생성합니다." },
  { start: null, end: null, step: "04", label: "CONNECT", indexTitle: "HTML 실행 · Key 입력", title: "API Key를 입력해 외부 데이터를 연결합니다.", description: "HTML을 실행하고 Dashboard의 입력창에 API Key를 넣습니다. Source에 하드코딩하지 않습니다." },
  { start: null, end: null, step: "05", label: "LIVE", indexTitle: "Dashboard 확인", title: "내부 데이터와 외부 데이터를 하나의 화면에서 봅니다.", description: "USD/KRW·Copper·Aluminum·Brent를 연결합니다. 외부지표는 시장환경 참고자료입니다." }
];

// One content source: explanation steps have no video. Each chapter ends with one full film.
const chapters = [
  {
    id: "chapter01",
    title: "내부 데이터를 AI와 연결하다",
    film: {
      id: "film-internal", label: "DEMO FILM 01", source: "INTERNAL DATA",
      title: "내부 데이터 연결의 전체 과정",
      video: "assets/videos/01-internal-data.mp4", available: false, captions: null, duration: null,
      caption: "Excel·CSV에서 SharePoint List, Agent, Teams까지.",
      placeholderDescription: "CSV에서 Agent까지, 연결 과정을 확인합니다.",
      sequence: ["CSV 변환", "SharePoint", "SharePoint List", "Copilot Agent", "Teams"],
      timeline: internalFilmTimeline,
      markers: [] // Add real { seconds, label } only after the full film is provided.
    },
    steps: [
      {
        id: "step-bms", label: "BMS Export", shortLabel: "BMS", source: "BMS",
        title: "업무 데이터를, 밖으로 꺼내다.", headline: ["업무 데이터를,", "밖으로 꺼내다."], actionLabel: "EXPORT", stageKind: "export",
        description: "필요한 기준월과 조회 조건을 확인한 뒤 BMS 데이터를 Excel로 다운로드합니다.",
        screenTitle: "BMS 데이터 내보내기", placeholderAction: "Excel 다운로드",
        caption: "업무 시스템의 데이터를 연결 가능한 출발점으로 가져옵니다.",
        from: "BMS", to: "Excel 다운로드",
        detailTitle: "먼저 확인할 것", detail: "기준월 · 사업부 · 현장코드. 내려받은 데이터의 행과 열이 연결의 출발점입니다."
      },
      {
        id: "step-csv", label: "CSV Structure", shortLabel: "CSV", source: "CSV",
        title: "데이터를, 읽을 수 있는 구조로.", headline: ["데이터를,", "읽을 수 있는 구조로."], actionLabel: "STRUCTURE", stageKind: "structure",
        description: "AI를 활용해 Excel 데이터를 CSV로 정리합니다. 기준월·사업부·현장코드·예산변경의 열 이름과 값 형식을 확인합니다.",
        screenTitle: "AI가 읽을 수 있는 CSV", placeholderAction: "데이터 구조 정리",
        caption: "형식보다 중요한 것은 일관된 열과 값의 구조입니다.",
        from: "Excel", to: "AI가 읽을 수 있는 CSV",
        detailTitle: "구조를 확인합니다", detail: "열 이름, 날짜·숫자 형식, 문자 인코딩, 누락값을 확인합니다. CSV 변환만으로 정확성이 보장되지는 않습니다."
      },
      {
        id: "step-sharepoint", label: "SharePoint List", shortLabel: "SharePoint", source: "SharePoint",
        title: "개인 파일에서, 조직의 데이터로.", headline: ["개인 파일에서,", "조직의 데이터로."], actionLabel: "SHARE", stageKind: "share",
        description: "CSV를 SharePoint로 가져와 List로 구성합니다. 동일한 구조화 데이터를 조회·필터·관리할 수 있는 사내 공용 데이터 공간입니다.",
        screenTitle: "SharePoint List", placeholderAction: "구조화 데이터의 공동 관리",
        caption: "여러 사람이 같은 구조의 데이터를 기준으로 업무를 이어갑니다.",
        from: "CSV", to: "SharePoint List",
        detailTitle: "공유의 기준을 맞춥니다", detail: "열 타입·조회 조건·공유 권한을 확인합니다. 파일을 보관하는 데서 나아가 같은 구조의 데이터를 함께 관리합니다."
      },
      {
        id: "step-agent", label: "Copilot Agent", shortLabel: "Agent", source: "Agent",
        title: "같은 데이터에, 자연어로 질문하다.", headline: ["같은 데이터에,", "자연어로 질문하다."], actionLabel: "ASK", stageKind: "query",
        description: "Copilot Studio Standard Agent의 Knowledge에 데이터를 연결하고 Teams에서 질문합니다. 기준월·사업부·현장코드·예산변경을 특정한 질의에 활용합니다.",
        screenTitle: "Copilot Studio Standard Agent", placeholderAction: "Knowledge 연결과 자연어 질의",
        caption: "조건을 좁힌 조회와 설명에 활용하고, 중요한 계산은 원본에서 확인합니다.",
        from: "Copilot Agent", to: "Teams에서 자연어 질의",
        detailTitle: "교육에서 연결한 Knowledge", knowledge: ["SharePoint List", "BMS 원본 CSV", "HTML Dashboard"],
        limit: "Knowledge retrieval 특성상 전체 Top N, 완전한 전체 합계, 모든 행에 대한 정확한 계산은 한계가 있을 수 있습니다. 중요한 수치는 원본 데이터와 검증합니다."
      }
    ]
  },
  {
    id: "chapter02", title: "외부 데이터를 업무에 연결하다",
    steps: [
      {
        id: "step-api", label: "Alpha Vantage", shortLabel: "ACCESS", actionLabel: "ACCESS", source: "Alpha Vantage", stageKind: "access",
        title: "외부 데이터의 연결을 준비하다.", headline: ["외부 데이터의", "연결을 준비하다."],
        description: "Alpha Vantage에서 API Key를 발급받아 외부 시장 데이터에 접근할 준비를 합니다.",
        screenTitle: "외부 데이터에 접근할 준비", caption: "API Key는 외부 시장 데이터에 접근하기 위한 연결의 시작입니다.",
        from: "Alpha Vantage", to: "API Key 발급"
      },
      {
        id: "step-build", label: "Copilot", shortLabel: "BUILD", actionLabel: "BUILD", source: "Copilot", stageKind: "build",
        title: "필요한 업무 화면을, 말로 만들다.", headline: ["필요한 업무 화면을,", "말로 만들다."],
        description: "BMS 예산변경 데이터와 외부 시장 데이터를 함께 보여주는 HTML Dashboard를 Copilot에게 자연어로 요청합니다.",
        instruction: ["첨부한 BMS 예산변경 데이터를 분석할 수 있는 HTML Dashboard를 만들어줘.", "Alpha Vantage API를 이용해서 USD/KRW, Copper, Aluminum, Brent 데이터도 같이 볼 수 있게 해줘."],
        screenTitle: "자연어 요청에서, 실행 가능한 HTML로", caption: "사람이 필요한 업무를 설명하면, Copilot이 브라우저에서 열 수 있는 도구를 만듭니다.",
        from: "자연어 업무 요청", to: "HTML Dashboard"
      },
      {
        id: "step-connect", label: "HTML Dashboard", shortLabel: "CONNECT", actionLabel: "CONNECT", source: "HTML Dashboard", stageKind: "connect",
        title: "만든 HTML을 열고, 데이터를 연결하다.", headline: ["만든 HTML을 열고,", "데이터를 연결하다."],
        description: "Copilot이 만든 HTML 파일을 브라우저에서 실행하고 Dashboard의 API Key 입력창에서 외부 데이터 연결을 완료합니다.",
        screenTitle: "HTML 실행과 외부 데이터 연결", caption: "브라우저에서 HTML을 열고, Dashboard의 입력창에 API Key를 입력합니다.",
        from: "HTML 파일 실행", to: "API Key 입력 · 연결"
      },
      {
        id: "step-live", label: "BMS + Market", shortLabel: "LIVE", actionLabel: "LIVE", source: "BMS + Market Context", stageKind: "live",
        title: "내부 데이터에, 시장의 맥락을 더하다.", headline: ["내부 데이터에,", "시장의 맥락을 더하다."],
        description: "BMS 내부 데이터와 USD/KRW, Copper, Aluminum, Brent 같은 외부 시장 데이터를 하나의 Dashboard에서 함께 확인합니다.",
        context: "외부 데이터는 시장환경을 이해하기 위한 context / reference data입니다. BMS 예산 증감의 직접 원인을 뜻하지 않습니다.",
        screenTitle: "내부 데이터와 시장 맥락을 한 화면에", caption: "외부 시장 데이터는 업무 판단을 돕는 참고자료입니다.",
        from: "BMS + 외부 시장 데이터", to: "LIVE Dashboard"
      }
    ],
    film: {
      id: "film-external", label: "DEMO FILM 02", source: "EXTERNAL DATA",
      title: "Copilot 제작부터 외부 데이터 연결까지",
      video: "assets/videos/02-external-data.mp4", available: false, captions: null, duration: null,
      caption: "자연어 지시 → 실행 가능한 HTML → 외부 데이터 연결.",
      placeholderDescription: "자연어로 만든 HTML이 업무 화면이 됩니다.",
      sequence: ["API Key 발급", "Copilot에 Dashboard 제작 지시", "HTML 생성", "HTML 실행", "API Key 입력", "외부 데이터 연결", "Dashboard 확인"],
      timeline: externalFilmTimeline,
      markers: []
    }
  }
];

function initializeEducation() {
  const walkthrough = document.querySelector("#walkthrough");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 900px)");
  const numberFormat = new Intl.NumberFormat("ko-KR");
  const mediaStates = new WeakMap();
  const filmNarratives = new WeakMap();
  const films = [...document.querySelectorAll("[data-chapter-film]")].map(section => ({ section, film: chapters.find(item => item.id === section.dataset.chapterFilm).film }));
  const availableVideos = new Set(films.filter(item => item.film.available).map(item => item.film.video));
  const mediaAnimations = new Set();
  const heroAnimations = [];
  let frame = 0;
  let keyboardInput = false;
  let enteringPage = true;

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const pad = value => String(value).padStart(2, "0");
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

  // Match both reading and keyboard order to the composition. Move only narrative;
  // the native video is never removed/reinserted at a breakpoint.
  const filmDesktop = matchMedia("(min-width: 1100px)");
  function arrangeFilms() {
    films.forEach(({section}) => {
      if (!section.classList.contains("chapter-film--reverse")) return;
      const layout = section.querySelector(".film-layout");
      const narrative = section.querySelector("[data-film-narrative]");
      const figure = section.querySelector(".film-figure");
      const focused = narrative.contains(document.activeElement) ? document.activeElement : null;
      if (filmDesktop.matches && layout.firstElementChild !== narrative) layout.insertBefore(narrative, figure);
      if (!filmDesktop.matches && layout.lastElementChild !== narrative) layout.append(narrative);
      if (focused && document.activeElement !== focused) focused.focus({ preventScroll: true });
    });
  }
  arrangeFilms();
  filmDesktop.addEventListener("change", arrangeFilms);

  function connectionPreview(step) {
    const columns = ["기준월", "사업부", "현장코드", "예산변경"];
    const fields = columns.map((name, i) => `<span data-field="${i}"><i>${pad(i + 1)}</i>${name}</span>`).join("");
    if (step.stageKind === "query") return `<div class="concept-query"><div class="concept-sources">${step.knowledge.map(source => `<span>${escapeHTML(source)}</span>`).join("")}</div><div class="concept-query-line"><span aria-hidden="true">↳</span><p>이 현장의 예산은<br>어떻게 바뀌었습니까?</p></div><p class="concept-result">조건을 지정한 조회와 설명</p></div>`;
    return `<div class="concept-data concept-${step.stageKind}"><div class="concept-fields">${fields}</div><div class="concept-destination"><span class="concept-arrow" aria-hidden="true">${arrow}</span><strong>${step.stageKind === "export" ? "EXCEL" : step.stageKind === "structure" ? "CSV" : "LIST"}</strong><span>${step.stageKind === "export" ? "업무 데이터의 첫 연결" : step.stageKind === "structure" ? "일관된 열과 값" : "함께 조회 · 필터 · 관리"}</span></div></div>`;
  }

  function externalConceptMarkup(step) {
    const symbols = ["USD/KRW", "COPPER", "ALUMINUM", "BRENT"];
    const markets = symbols.map((symbol, index) => `<span data-field="market-${index}">${symbol}</span>`).join("");
    const flow = `<span class="external-flow" data-reveal="line" aria-hidden="true">${arrow}</span>`;
    const file = `<span class="external-file" data-field="html"><b translate="no">HTML</b><span>BMS_예산변경_분석대시보드.html</span></span>`;
    let body;
    if (step.stageKind === "access") body = `
      <p class="placeholder-product" translate="no">ALPHA VANTAGE</p>
      <p class="placeholder-action">외부 시장 데이터에 접근하기</p>
      <div class="access-route"><div class="access-key"><span translate="no">API KEY</span><strong>연결의 시작</strong></div>${flow}<div class="market-symbols" data-reveal="object">${markets}</div></div>
      <p class="connection-state" data-reveal="status" translate="no">ACCESS READY</p>`;
    if (step.stageKind === "build") body = `
      <p class="placeholder-product" translate="no">COPILOT</p>
      <div class="build-route"><blockquote class="build-prompt" aria-label="Copilot에게 요청하는 예시">${step.instruction.map(line => `<p>${escapeHTML(line)}</p>`).join("")}</blockquote>
      <div class="build-output">${flow}<div data-reveal="object" data-field="html"><span class="generation-label" translate="no">GENERATING</span><strong translate="no">HTML<br>DASHBOARD</strong><div class="html-outline" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div>`;
    if (step.stageKind === "connect") body = `
      ${file}<div class="connect-route">${flow}<div class="concept-browser" data-reveal="object"><div class="browser-heading"><span translate="no">BMS DASHBOARD</span><span>브라우저에서 실행</span></div>
      <div class="api-connection"><span class="api-input" translate="no">API KEY</span><span class="api-connect" translate="no">CONNECT</span></div>
      <p class="connection-state" data-reveal="status" translate="no">CONNECTED</p></div></div>`;
    if (step.stageKind === "live") body = `
      <div class="live-heading"><p class="placeholder-product" translate="no">LIVE DASHBOARD</p><span class="live-indicator" aria-hidden="true"></span></div>
      <div class="live-dashboard" data-field="html"><div class="live-internal"><span class="dashboard-label" translate="no">INTERNAL DATA</span><strong translate="no">BMS</strong><p>예산변경 데이터</p><div class="bms-fields"><span>기준월</span><span>사업부</span><span>현장코드</span><span>예산변경</span></div></div>
      <span class="live-plus" aria-hidden="true">+</span><div class="live-market" data-reveal="object"><span class="dashboard-label" translate="no">MARKET CONTEXT</span><div class="market-symbols">${markets}</div><p translate="no">REFERENCE DATA</p></div></div>`;
    return `<div class="placeholder external-concept external-${step.stageKind}" data-concept="${step.stageKind}">${body}<div class="placeholder-footer"><span>연결 원리</span><span>설명용 화면 · 실제 데이터 아님</span></div></div>`;
  }

  function conceptMarkup(step) {
    if (["access", "build", "connect", "live"].includes(step.stageKind)) return externalConceptMarkup(step);
    return `<div class="placeholder" data-concept="${step.stageKind}">
      <div class="placeholder-center"><p class="placeholder-product" translate="no">${escapeHTML(step.source)}</p>
      <p class="placeholder-action">${escapeHTML(step.placeholderAction)}</p></div>
      ${connectionPreview(step)}
      <div class="placeholder-footer"><span>연결 원리</span><span>설명용 데이터 구조</span></div>
    </div>`;
  }

  function pauseAll(except = null) {
    document.querySelectorAll("video").forEach(video => { if (video !== except) video.pause(); });
  }

  function destroyMedia(stage) {
    const state = mediaStates.get(stage);
    if (state) state.destroyed = true;
    stage.querySelectorAll("video").forEach(video => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
    stage.replaceChildren();
  }

  function durationLabel(duration) {
    if (!Number.isFinite(duration) || duration <= 0) return "";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `영상 ${minutes ? numberFormat.format(minutes) + "분 " : ""}${numberFormat.format(seconds)}초`;
  }

  function renderConceptStage(stage, step) {
    stage.setAttribute("aria-label", `${step.screenTitle} 연결 구조`);
    stage.innerHTML = conceptMarkup(step);
  }

  function filmPlaceholder(film, state) {
    const loading = state === "loading";
    const error = state === "error";
    return `<div class="film-placeholder${error ? " film-error" : ""}">
      <span class="film-placeholder-label">${escapeHTML(film.label)} / 전체 시연</span>
      <div class="film-placeholder-copy"><p>${error ? "영상을 재생할 수 없습니다." : loading ? "전체 시연영상을 불러옵니다." : escapeHTML(film.source)}</p>
      <span>${error ? "파일의 형식과 재생 가능 여부를 확인해 주세요." : loading ? "잠시 기다려 주세요." : escapeHTML(film.placeholderDescription)}</span>
      ${error ? '<button class="retry-media" type="button">다시 불러오기</button>' : ""}</div>
      <div class="film-placeholder-bottom"><span>${error ? "영상 재생 오류" : loading ? "불러오는 중" : "전체 시연영상 준비 중"}</span><span>자동재생 없음</span></div>
    </div>`;
  }

  function renderFilmMarkers(section, film, video) {
    const navigation = section.querySelector("[data-film-markers]");
    const markers = film.markers.filter(marker => Number.isFinite(marker.seconds) && marker.seconds >= 0 && marker.seconds < video.duration && typeof marker.label === "string" && marker.label.trim()).sort((a, b) => a.seconds - b.seconds);
    navigation.hidden = markers.length === 0;
    navigation.replaceChildren();
    const buttons = markers.map(marker => {
      const button = document.createElement("button");
      button.type = "button";
      const minutes = Math.floor(marker.seconds / 60);
      const seconds = Math.floor(marker.seconds % 60);
      button.textContent = `${pad(minutes)}:${pad(seconds)} / ${marker.label}`;
      button.addEventListener("click", () => { video.currentTime = marker.seconds; updateMarkers(); });
      navigation.append(button);
      return button;
    });
    function updateMarkers() {
      let active = -1;
      markers.forEach((marker, index) => { if (marker.seconds <= video.currentTime) active = index; });
      buttons.forEach((button, index) => { if (index === active) button.setAttribute("aria-current", "true"); else button.removeAttribute("aria-current"); });
    }
    video.addEventListener("timeupdate", updateMarkers);
    updateMarkers();
  }

  function createFilmNarrative(section, film) {
    const timeline = film.timeline;
    const narrative = section.querySelector("[data-film-narrative]");
    const figure = section.querySelector(".film-figure");
    narrative.innerHTML = `<ol class="film-story" aria-label="${escapeHTML(film.label)} 전체 단계">${timeline.map((entry, index) => `<li class="film-story-step" data-film-story-step="${index}"><article aria-labelledby="${film.id}-step-${entry.step}">
      <p class="film-step-meta"><span><span class="sr-only">STEP </span>${escapeHTML(entry.step)}</span><b translate="no">${escapeHTML(entry.label)}</b><span class="film-step-total">/ ${pad(timeline.length)}</span></p>
      <h3 id="${film.id}-step-${entry.step}">${escapeHTML(entry.title)}</h3>
      <p class="film-step-description">${escapeHTML(entry.description)}</p>
      <button class="film-seek" type="button" data-film-seek="${index}" disabled>영상에서 이 단계 보기<span aria-hidden="true"> ↗</span></button>
    </article></li>`).join("")}</ol>`;
    figure.insertAdjacentHTML("beforeend", `<div class="film-playhead">
      <div class="film-playhead-meta"><p><span data-film-step-number></span><b data-film-step-label translate="no"></b><span class="film-playhead-total">/ ${pad(timeline.length)}</span></p><button type="button" class="film-sync" data-film-sync disabled>영상 단계 동기화</button></div>
      <div class="film-step-progress"><div class="film-progress-heading"><span data-film-sync-status></span><span data-film-step-percent></span></div><div class="film-progress-track" data-film-step-progress role="progressbar" aria-label="현재 스크롤 단계 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div></div>
      <p class="film-seek-note" data-film-seek-note></p>
      <p class="sr-only" data-film-announcement aria-live="polite" aria-atomic="true"></p>
    </div>`);

    const scenes = [...narrative.querySelectorAll("[data-film-story-step]")];
    const buttons = [...narrative.querySelectorAll("[data-film-seek]")];
    const number = figure.querySelector("[data-film-step-number]");
    const label = figure.querySelector("[data-film-step-label]");
    const status = figure.querySelector("[data-film-sync-status]");
    const progress = figure.querySelector("[data-film-step-progress]");
    const percent = figure.querySelector("[data-film-step-percent]");
    const note = figure.querySelector("[data-film-seek-note]");
    const sync = figure.querySelector("[data-film-sync]");
    const announcement = figure.querySelector("[data-film-announcement]");
    let video = null;
    let cues = [];
    let listeners = null;
    let mediaMode = "missing";
    let owner = "scroll";
    let scrollIndex = 0;
    let scrollProgress = 0;
    let visible = false;
    let lastState = "";

    function validCues() {
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return [];
      const configured = timeline.map((entry, index) => ({ entry, index, start: entry.start, end: entry.end }))
        .filter(cue => Number.isFinite(cue.start) && Number.isFinite(cue.end) && cue.start >= 0 && cue.end > cue.start);
      return configured.filter(cue => cue.end <= video.duration && !configured.some(other => other !== cue && cue.start < other.end && other.start < cue.end));
    }

    function synchronize() {
      const time = video?.currentTime ?? 0;
      const cue = cues.find(item => time >= item.start && (time < item.end || (video.ended && time === item.end && item.end === video.duration)));
      const index = owner === "video" ? cue?.index ?? -1 : scrollIndex;
      const entry = timeline[index];
      const stateKey = `${owner}:${index}:${mediaMode}`;
      section.dataset.filmStep = entry?.step ?? "";
      section.dataset.filmMode = owner;
      narrative.dataset.syncState = index < 0 ? "gap" : owner;
      number.textContent = entry?.step ?? "—";
      label.textContent = entry?.label ?? "DEMO FILM";
      status.textContent = owner === "video" ? cue ? "영상과 동기화" : "영상 단계 구간 밖" : "스크롤로 복습";
      scenes.forEach((scene, i) => {
        const active = index === i;
        scene.classList.toggle("is-active", active);
        scene.classList.toggle("is-complete", i < index);
        if (active) scene.setAttribute("aria-current", "step");
        else scene.removeAttribute("aria-current");
      });
      buttons.forEach((button, i) => {
        const seekCue = cues.find(item => item.index === i);
        button.disabled = !seekCue;
        button.setAttribute("aria-label", `STEP ${timeline[i].step} ${timeline[i].label}, ${timeline[i].title}${seekCue ? ", 영상 위치로 이동" : ", 영상 또는 타임코드 준비 중"}`);
      });
      sync.disabled = !cues.length;
      sync.textContent = owner === "video" ? "영상 동기화 중" : "영상 단계 동기화";
      note.textContent = mediaMode === "error" ? "영상을 재시도하거나 스크롤로 과정을 살펴보세요." : cues.length ? "단계 선택은 영상 위치만 이동합니다." : "영상 시간은 편집 후 연결됩니다. 스크롤로 먼저 살펴보세요.";
      const value = owner === "video" ? cue ? (time - cue.start) / (cue.end - cue.start) : null : scrollProgress;
      const percentage = value === null ? 0 : Math.round(Math.min(1, Math.max(0, value)) * 100);
      progress.firstElementChild.style.transform = `scaleX(${percentage / 100})`;
      percent.textContent = value === null ? "—" : `${percentage}%`;
      progress.setAttribute("aria-label", owner === "video" ? "현재 영상 단계 진행률" : "현재 스크롤 단계 진행률");
      progress.setAttribute("aria-valuenow", String(percentage));
      progress.setAttribute("aria-valuetext", entry ? `${status.textContent}, STEP ${entry.step} ${entry.label}, ${percentage}%` : status.textContent);
      // Announce step/mode changes only while this film is visible, never each percentage.
      if (stateKey !== lastState) {
        if (lastState && visible) announcement.textContent = entry ? `${status.textContent}. STEP ${entry.step}. ${entry.title}` : status.textContent;
        lastState = stateKey;
      }
    }

    function takeVideoControl() {
      if (cues.length) owner = "video";
      synchronize(); // Changes emphasis only; never scrolls, focuses or plays.
    }
    sync.addEventListener("click", takeVideoControl);
    buttons.forEach((button, index) => button.addEventListener("click", () => {
      const cue = cues.find(item => item.index === index);
      if (!video || video.readyState < 1 || !cue || button.disabled) return;
      owner = "video";
      video.currentTime = cue.start;
      synchronize();
    }));

    function setVideo(next, mode = "ready") {
      listeners?.abort();
      listeners = null;
      video = next;
      mediaMode = mode;
      cues = validCues();
      if (!video) owner = "scroll";
      if (video) {
        listeners = new AbortController();
        for (const event of ["play", "seeking"]) video.addEventListener(event, takeVideoControl, { signal: listeners.signal });
        for (const event of ["timeupdate", "seeked", "pause", "ended"]) video.addEventListener(event, synchronize, { signal: listeners.signal });
        video.addEventListener("durationchange", () => { cues = validCues(); synchronize(); }, { signal: listeners.signal });
      }
      synchronize();
    }

    // A single shared page-scroll zone, measured in the same way for both orientations.
    // All geometry is read before any controller writes classes/progress.
    function measureScroll() {
      const bounds = scenes.map(scene => scene.getBoundingClientRect());
      const figureTop = parseFloat(getComputedStyle(figure).top) || 0;
      const zone = Math.max(figureTop + 80, innerHeight * .46);
      const layout = section.querySelector(".film-layout").getBoundingClientRect();
      let index = 0;
      bounds.forEach((rect, i) => { if (rect.top <= zone) index = i; });
      return { index, progress: (zone - bounds[index].top) / Math.max(1, bounds[index].height), visible: layout.top < innerHeight && layout.bottom > 72 };
    }
    function applyScroll(measurement, claim) {
      scrollIndex = measurement.index;
      scrollProgress = measurement.progress;
      visible = measurement.visible;
      if (claim && visible) owner = "scroll";
      synchronize();
    }
    setVideo(null, "missing");
    return { setVideo, measureScroll, applyScroll };
  }

  films.forEach(({section, film}) => filmNarratives.set(section, createFilmNarrative(section, film)));
  let filmFrame = 0;
  let claimFilmScroll = false;
  function requestFilmStoryUpdate(claim = false) {
    claimFilmScroll ||= claim;
    if (filmFrame) return;
    filmFrame = requestAnimationFrame(() => {
      filmFrame = 0;
      const claim = claimFilmScroll;
      claimFilmScroll = false;
      const measurements = films.map(({section}) => filmNarratives.get(section).measureScroll());
      films.forEach(({section}, i) => filmNarratives.get(section).applyScroll(measurements[i], claim));
    });
  }
  addEventListener("scroll", () => requestFilmStoryUpdate(true), { passive: true });
  addEventListener("resize", () => requestFilmStoryUpdate(), { passive: true });
  filmDesktop.addEventListener("change", () => requestFilmStoryUpdate());
  document.fonts?.ready.then(() => requestFilmStoryUpdate());
  requestFilmStoryUpdate();

  function hydrateFilm(section, film, force = false) {
    const stage = section.querySelector("[data-film-stage]");
    const available = availableVideos.has(film.video);
    const previous = mediaStates.get(stage);
    if (!force && previous?.available === available) return;
    filmNarratives.get(section).setVideo(null, available ? "loading" : "missing");
    destroyMedia(stage);
    const state = { available, destroyed: false };
    mediaStates.set(stage, state);
    const durationNode = section.querySelector("[data-film-duration]");
    const markerNavigation = section.querySelector("[data-film-markers]");
    section.querySelector("[data-film-caption]").textContent = film.caption;
    markerNavigation.hidden = true;
    markerNavigation.replaceChildren();
    durationNode.textContent = "";
    stage.setAttribute("aria-label", `${film.title} ${available ? "시연영상" : "시연영상 대기 화면"}`);
    stage.dataset.mediaState = available ? "loading" : "missing";
    stage.innerHTML = filmPlaceholder(film, available ? "loading" : "missing");
    if (!available) return;

    // A video is only attached when its file is known to exist. Missing paths are never probed.
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.hidden = true;
    video.setAttribute("aria-label", `${film.title} 시연영상`);
    video.setAttribute("aria-describedby", `${film.id}-caption`);
    video.addEventListener("play", () => pauseAll(video));
    video.addEventListener("loadedmetadata", () => {
      if (state.destroyed) return;
      stage.querySelector(".film-placeholder")?.remove();
      video.hidden = false;
      stage.dataset.mediaState = "ready";
      durationNode.textContent = durationLabel(film.duration ?? video.duration);
      filmNarratives.get(section).setVideo(video);
      renderFilmMarkers(section, film, video);
    }, { once: true });
    video.addEventListener("error", () => {
      if (state.destroyed) return;
      video.remove();
      filmNarratives.get(section).setVideo(null, "error");
      stage.dataset.mediaState = "error";
      durationNode.textContent = "";
      markerNavigation.hidden = true;
      markerNavigation.replaceChildren();
      stage.innerHTML = filmPlaceholder(film, "error");
      stage.setAttribute("aria-label", `${film.title} 영상 재생 오류`);
      stage.querySelector(".retry-media").addEventListener("click", () => hydrateFilm(section, film, true));
    }, { once: true });
    if (film.captions) {
      const track = document.createElement("track");
      track.kind = "captions";
      track.src = film.captions;
      track.srclang = "ko";
      track.label = "한국어";
      track.default = true;
      video.append(track);
    }
    stage.append(video);
    // An explicit retry must fetch a replaced/corrected file, rather than reuse a failed cached response.
    const mediaURL = new URL(film.video, location.href);
    if (force && /^https?:$/.test(location.protocol)) mediaURL.searchParams.set("retry", String(Date.now()));
    video.src = mediaURL.href;
  }

  films.forEach(({section, film}) => hydrateFilm(section, film));

  // Both chapters share rendering, selection, progress, keyboard and breakpoint behavior.
  // Only their content and desktop grid direction differ.
  function createWalkthrough(root, chapter) {
    const steps = chapter.steps;
    const stepColumn = root.querySelector(".steps-column");
    const desktopMedia = root.querySelector("[data-desktop-concept]");
    const figure = root.querySelector(".demo-figure");
    const path = root.querySelector(".connection-path");
    let activeIndex = -1;
    let inView = false;

    function mobileFigure(step, index) {
      return `<figure class="mobile-demo" aria-label="${escapeHTML(step.screenTitle)} 연결 구조">
        <div class="stage-meta"><span translate="no">${escapeHTML(step.source)}</span><span>STEP ${pad(index + 1)} / ${pad(steps.length)}</span></div>
        <div class="media-stage" data-mobile-concept="${index}" aria-label="${escapeHTML(step.screenTitle)} 연결 구조">${conceptMarkup(step)}</div>
        <figcaption class="stage-caption"><p class="stage-title">${escapeHTML(step.screenTitle)}</p><p>${escapeHTML(step.caption)}</p></figcaption>
      </figure>`;
    }
    stepColumn.innerHTML = steps.map((step, index) => `<article class="step" id="${step.id}" data-step="${index}" aria-labelledby="${step.id}-title" tabindex="-1">
      ${mobileFigure(step, index)}
      <div class="step-explanation">
        <p class="step-count"><span class="step-number"><span class="sr-only">STEP </span>${pad(index + 1)}</span><span class="step-label"><b translate="no">${escapeHTML(step.actionLabel)}</b><span translate="no">${escapeHTML(step.label)}</span></span></p>
        <h3 id="${step.id}-title">${step.headline.map(line => `<span>${escapeHTML(line)}</span>`).join("")}</h3>
        <p class="step-description">${escapeHTML(step.description)}</p>
        <p class="step-transfer"><span translate="no">${escapeHTML(step.from)}</span>${arrow}<span>${escapeHTML(step.to)}</span></p>
        ${step.detailTitle ? `<div class="step-detail"><strong>${escapeHTML(step.detailTitle)}</strong>${step.knowledge ? `<ul class="knowledge-list">${step.knowledge.map(item => `<li translate="no">${escapeHTML(item)}</li>`).join("")}</ul>` : `<p>${escapeHTML(step.detail)}</p>`}</div>` : ""}
        ${step.context ? `<p class="step-detail">${escapeHTML(step.context)}</p>` : ""}
        ${step.limit ? `<p class="agent-limit"><strong>조회와 계산의 역할을 구분합니다</strong>${escapeHTML(step.limit)}</p>` : ""}
      </div>
    </article>`).join("");
    path.innerHTML = `<span class="path-track" aria-hidden="true"><span class="path-progress"></span></span>${steps.map((step, index) => `<a class="path-stop" data-path-step="${index}" href="#${step.id}" aria-label="${pad(index + 1)} 단계 ${escapeHTML(step.title)}"><span translate="no">${escapeHTML(step.shortLabel)}</span></a>`).join("")}`;
    const articles = [...stepColumn.querySelectorAll(".step")];
    const stops = [...path.querySelectorAll(".path-stop")];
    const progressLine = path.querySelector(".path-progress");

    function animateElement(element, keyframes, options) {
      const animation = element.animate(keyframes, { duration: 280, easing: "cubic-bezier(0.23,1,0.32,1)", ...options });
      mediaAnimations.add(animation);
      animation.finished.then(() => {
        mediaAnimations.delete(animation);
      }).catch(() => {});
    }
    function activate(index, animate = true) {
      if (index === activeIndex) return;
      const step = steps[index];
      activeIndex = index;
      root.querySelector("[data-stage-step]").textContent = `STEP ${pad(index + 1)} / ${pad(steps.length)}`;
      root.querySelector("[data-stage-source]").textContent = step.source;
      root.querySelector("[data-stage-title]").textContent = step.screenTitle;
      root.querySelector("[data-stage-caption]").textContent = step.caption;
      stops.forEach((stop, i) => {
        stop.classList.toggle("is-past", i < index);
        if (i === index) stop.setAttribute("aria-current", "step");
        else stop.removeAttribute("aria-current");
      });
      articles.forEach((article, i) => {
        article.classList.toggle("is-active", i === index);
        if (i === index) article.setAttribute("aria-current", "step");
        else article.removeAttribute("aria-current");
      });
      root.dataset.activeStep = String(index + 1);
      if (desktop.matches) {
        const previousFields = [...desktopMedia.querySelectorAll("[data-field]")].map(field => ({ key: field.dataset.field, rect: field.getBoundingClientRect() }));
        mediaAnimations.forEach(animation => {
          if (figure.contains(animation.effect.target)) { animation.cancel(); mediaAnimations.delete(animation); }
        });
        renderConceptStage(desktopMedia, step);
        if (animate && !enteringPage && !reducedMotion.matches && !keyboardInput && Element.prototype.animate) {
          // Shared fields retain spatial continuity; new objects reveal along the data flow.
          const transitions = [...desktopMedia.querySelectorAll("[data-field]")].map(field => ({ field, before: previousFields.find(item => item.key === field.dataset.field)?.rect, after: field.getBoundingClientRect() }));
          transitions.forEach(({field, before, after}) => {
            if (before) animateElement(field, [{ transform: `translate(${before.left - after.left}px,${before.top - after.top}px)` }, { transform: "translate(0,0)" }]);
          });
          if (chapter.id === "chapter01") animateElement(figure, [{ opacity: .65 }, { opacity: 1 }], { duration: 180 });
          else desktopMedia.querySelectorAll("[data-reveal]").forEach(element => {
            const kind = element.dataset.reveal;
            const keyframes = kind === "line" ? [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]
              : kind === "status" ? [{ opacity: 0 }, { opacity: 1 }]
              : [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }];
            animateElement(element, keyframes, { duration: kind === "status" ? 160 : 280, delay: kind === "line" ? 0 : kind === "status" ? 240 : 100, fill: "backwards" });
          });
        }
      }
      if (inView) root.querySelector("[data-step-announcement]").textContent = `STEP ${pad(index + 1)}. ${step.title}`;
    }
    activate(0, false);
    return {
      root,
      setInView(value) { inView = value; },
      measure() {
        if (!inView) return null;
        const tops = articles.map(article => article.getBoundingClientRect().top);
        const focusLine = innerHeight * .42;
        let index = 0;
        for (let i = 1; i < tops.length; i++) if (tops[i] <= focusLine) index = i;
        const span = tops[tops.length - 1] - tops[0];
        return { index, progress: Math.min(1, Math.max(0, (focusLine - tops[0]) / Math.max(1, span))) };
      },
      update(measurement) {
        if (!measurement) return;
        activate(measurement.index);
        progressLine.style.transform = `scaleX(${reducedMotion.matches ? measurement.index / (steps.length - 1) : measurement.progress})`;
      },
      refresh() { if (desktop.matches) renderConceptStage(desktopMedia, steps[Math.max(0, activeIndex)]); },
      selectLink(link, animate) {
        const index = steps.findIndex(step => `#${step.id}` === link.getAttribute("href"));
        if (index >= 0) activate(index, animate);
      },
      selectHash() {
        const index = steps.findIndex(step => `#${step.id}` === location.hash);
        if (index >= 0) requestAnimationFrame(() => { activate(index, false); articles[index].scrollIntoView(); });
      }
    };
  }

  const walkthroughs = [...document.querySelectorAll("[data-walkthrough]")].map(root => createWalkthrough(root, chapters.find(chapter => chapter.id === root.dataset.walkthrough)));
  // IO gates work. One rAF measures both chapters before applying selection/progress.
  function updateScroll() {
    frame = 0;
    const measurements = walkthroughs.map(controller => controller.measure());
    walkthroughs.forEach((controller, index) => controller.update(measurements[index]));
  }
  function requestUpdate() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  if ("IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => walkthroughs.find(controller => controller.root === entry.target).setInView(entry.isIntersecting));
      requestUpdate();
    });
    walkthroughs.forEach(controller => chapterObserver.observe(controller.root));
    const filmObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) entry.target.querySelector("video")?.pause(); });
    });
    films.forEach(({section}) => filmObserver.observe(section.querySelector("[data-film-stage]")));
  } else { walkthroughs.forEach(controller => controller.setInView(true)); requestUpdate(); }
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate, { passive: true });
  document.fonts?.ready.then(requestUpdate);
  document.addEventListener("keydown", () => { keyboardInput = true; });
  document.addEventListener("pointerdown", () => { keyboardInput = false; }, { passive: true });
  addEventListener("wheel", () => { keyboardInput = false; }, { passive: true });
  addEventListener("touchstart", () => { keyboardInput = false; }, { passive: true });
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href^='#step-']");
    if (link) walkthroughs.forEach(controller => controller.selectLink(link, event.detail !== 0));
  });
  desktop.addEventListener("change", () => { walkthroughs.forEach(controller => controller.refresh()); requestUpdate(); });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      heroAnimations.forEach(animation => animation.cancel());
      mediaAnimations.forEach(animation => animation.cancel());
      mediaAnimations.clear();
    }
    requestUpdate();
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) pauseAll(); });

  // One entrance: already-readable typography and data fragments settle onto their shared baseline.
  function heroEntrance() {
    if (reducedMotion.matches || !Element.prototype.animate || location.hash || scrollY > 40) return;
    document.querySelectorAll(".hero-type").forEach((line, index) => {
      heroAnimations.push(line.animate([{ transform: `translateX(${index ? 14 : -14}px)` }, { transform: "translateX(0)" }], { duration: 760, delay: index * 45, easing: "cubic-bezier(0.23,1,0.32,1)" }));
    });
    document.querySelectorAll(".data-fragment").forEach((fragment, index) => {
      heroAnimations.push(fragment.animate([{ transform: `translate(${[-18, 10, -8, 16][index]}px, ${[12, -10, 14, -12][index]}px)` }, { transform: "translate(0,0)" }], { duration: 720, delay: 80 + index * 45, easing: "cubic-bezier(0.23,1,0.32,1)" }));
    });
  }

  // Visual location feedback shares native scrolling; it never changes walkthrough selection.
  const scenes = [document.querySelector(".hero"), document.querySelector("#why"), document.querySelector("#chapter01"), walkthrough, document.querySelector("#takeaway"), document.querySelector("#film-internal"), document.querySelector("#chapter02"), document.querySelector("#chapter02-process"), document.querySelector("#film-external")];
  const sceneLinks = [...document.querySelectorAll(".scene-rail a")];
  const header = document.querySelector(".site-header");
  const heroLine = document.querySelector("#hero-line-progress");
  const pageLine = document.querySelector("#page-progress-fill");
  let visualFrame = 0;
  function updateVisualState() {
    visualFrame = 0;
    const bounds = scenes.map(scene => scene.getBoundingClientRect());
    const center = innerHeight * .5;
    let current = 0;
    bounds.forEach((rect, index) => { if (rect.top <= center) current = index; });
    sceneLinks.forEach((link, index) => { if (index === current) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); });
    const darkScenes = [2, 4, 5, 6, 8];
    const dark = darkScenes.includes(current);
    document.body.classList.toggle("on-dark-scene", dark);
    header.dataset.scene = String(current);
    header.classList.toggle("on-dark", bounds.some((rect, index) => darkScenes.includes(index) && rect.top <= 72 && rect.bottom > 72));
    const extent = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    pageLine.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / extent))})`;
    heroLine.style.transform = `scaleX(${reducedMotion.matches ? 1 : Math.min(1, .16 + scrollY / Math.max(1, innerHeight * .65))})`;
  }
  function requestVisualUpdate() { if (!visualFrame) visualFrame = requestAnimationFrame(updateVisualState); }
  addEventListener("scroll", requestVisualUpdate, { passive: true });
  addEventListener("resize", requestVisualUpdate, { passive: true });
  reducedMotion.addEventListener("change", requestVisualUpdate);
  document.fonts?.ready.then(requestVisualUpdate);
  updateVisualState();

  heroEntrance();
  enteringPage = false;
  walkthroughs.forEach(controller => controller.selectHash());

  // Python's local static server supplies a directory index. Read existing filenames, never HEAD-probe missing MP4s.
  // For file:// or servers without an index, set the matching chapter.film.available after adding its video.
  async function discoverVideos() {
    if (!/^https?:$/.test(location.protocol)) return;
    try {
      const directory = new URL("assets/videos/", location.href);
      const response = await fetch(directory, { cache: "no-store", credentials: "same-origin" });
      if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return;
      const listing = new DOMParser().parseFromString(await response.text(), "text/html");
      const urls = new Set([...listing.querySelectorAll("a[href]")].map(link => new URL(link.getAttribute("href"), directory).href));
      films.forEach(({section, film}) => {
        if (urls.has(new URL(film.video, location.href).href)) availableVideos.add(film.video);
        hydrateFilm(section, film);
      });
    } catch { /* Keep the known empty state when a directory index is unavailable. */ }
  }
  discoverVideos();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeEducation, { once: true });
else initializeEducation();
