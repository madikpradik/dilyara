document.addEventListener("DOMContentLoaded", () => {
  const sidebar        = document.getElementById("sidebar");
  const menuToggle     = document.getElementById("menuToggle");
  const methodsToggle  = document.getElementById("methodsToggle");
  const methodsSubmenu = document.getElementById("methodsSubmenu");
  const breadcrumb     = document.getElementById("breadcrumb");
  const links          = document.querySelectorAll(".menu a, .submenu a");
  const sections       = document.querySelectorAll(".section");

  // --- Показ основной секции (Титулдық бет, Кіріспе, Теория, ...) ---
  function showSection(sectionId) {
    sections.forEach(sec => {
      sec.classList.toggle("visible", sec.id === sectionId);
    });
  }

  // --- Подсветка активного пункта меню ---
  function setActiveLink(link) {
    links.forEach(a => a.classList.remove("active"));
    if (link) link.classList.add("active");
  }

  // --- Клик по любому пункту меню слева ---
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.dataset.target;
      if (!targetId) return;

      showSection(targetId);
      setActiveLink(link);
      breadcrumb.textContent = link.textContent.trim();

      // всегда сворачиваем подменю "Әдістер"
      if (methodsSubmenu) methodsSubmenu.classList.remove("open");
      if (methodsToggle)  methodsToggle.classList.remove("open");

      // на мобильном – закрываем сайдбар
      if (window.innerWidth <= 992 && sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
    });
  });

  // --- Кнопка "Әдістер" (раскрыть/скрыть подменю) ---
  if (methodsToggle && methodsSubmenu) {
    methodsToggle.addEventListener("click", () => {
      methodsSubmenu.classList.toggle("open");
      methodsToggle.classList.toggle("open");
    });
  }

  // --- Бургер-меню на мобильном ---
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Старт: показываем Титулдық бет
  showSection("title");
  const firstLink = document.querySelector('.menu a[data-target="title"]');
  if (firstLink) firstLink.classList.add("active");

  initTheoryTabs();
  initTheoryTests();
  initPracticeTasks();
  initExamplesGames();
  initInteractive3DGame();
  initBirdGame();
  initMinecraftGame();
  initGeometryLab();
  initGlossary();
  initMathGame();
  initEmojiGame();      // ← НОВОЕ
  initQuickCalcGame();   // новая игра 3
  initTfGame();          // новая игра 4
  initCompareGame();     // новая игра 5
  initGamification();   // блок достижений
  initVideoPlaylist();   // ← ДОБАВИТЬ ЭТО
  initGeometryConstructor();   // ← вот эту строку добавить
});

/* === Вкладки внутри "Теория" === */
function initTheoryTabs() {
  const tabs   = document.querySelectorAll("#theory .theory-tab");
  const topics = document.querySelectorAll("#theory .theory-topic");
  if (!tabs.length || !topics.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const topic = tab.dataset.topic;
      const targetId = "theory-" + topic;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      topics.forEach(block => {
        block.classList.toggle("visible", block.id === targetId);
      });
    });
  });
}

/* === Тесты в "Теория", "Тест", "Үлгі есептер" === */
function initTheoryTests() {
  const testItems = document.querySelectorAll(
    "#theory .test-item, #test .test-item, #examples .test-item"
  );
  if (!testItems.length) return;

  testItems.forEach(item => {
    const options    = item.querySelectorAll(".option");
    const answerNode = item.querySelector(".answer-key");
    if (!answerNode || !options.length) return;

    const raw = (answerNode.textContent || "").trim();
    // "...Жауап: X" немесе "Дұрыс жауап: X"
    const match = raw.match(/[Жж]ауап\s*:\s*([A-Za-zА-Яа-я0-9ӘІҢҒҮҰҚӨҺ])/);
    if (!match) {
      answerNode.style.display = "none";
      return;
    }

    const key = match[1].toString().toUpperCase();
    let correctIndex = -1;

    // цифра → номер нұсқа
    if (/^[0-9]$/.test(key)) {
      const n = parseInt(key, 10);
      if (n >= 1 && n <= options.length) correctIndex = n - 1;
    } else {
      // әріп → A,B,C,D,E...
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZӘІҢҒҮҰҚӨҺ";
      correctIndex = letters.indexOf(key);
      if (correctIndex >= options.length) correctIndex = -1;
    }

    if (correctIndex < 0 || correctIndex >= options.length) {
      answerNode.style.display = "none";
      return;
    }

    const correctOption = options[correctIndex];
    correctOption.dataset.correct = "true";

    // "Дұрыс жауап: ..." жасырамыз
    answerNode.style.display = "none";

options.forEach(opt => {
  opt.addEventListener("click", () => {
    // очищаем прошлую подсветку
    options.forEach(o => o.classList.remove("correct", "incorrect", "chosen"));
    opt.classList.add("chosen");

    // если ученик выбрал правильный вариант — делаем его зелёным
    if (opt.dataset.correct === "true") {
      opt.classList.add("correct");
    } else {
      // если ошибся — подсвечиваем ТОЛЬКО его выбор красным
      // правильный вариант не показываем
      opt.classList.add("incorrect");
    }
  });
});

  });

  // "Жауаптарды тазалау" батырмалары
  const resetBtns = document.querySelectorAll(
    "#theory .test-reset-all, #test .test-reset-all, #examples .test-reset-all"
  );
  resetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const container =
        btn.closest(".theory-topic") ||
        btn.closest("#test") ||
        btn.closest("#examples") ||
        document;

      const allOptions = container.querySelectorAll(".option");
      allOptions.forEach(o => o.classList.remove("correct", "incorrect", "chosen"));
    });
  });
}

/* === Практикалық есептер (input + Тексеру) === */
function initPracticeTasks() {
  const tasks = document.querySelectorAll("#practice .practice-task");
  if (!tasks.length) return;

  tasks.forEach(task => {
    const input    = task.querySelector(".practice-input");
    const button   = task.querySelector(".practice-check");
    const feedback = task.querySelector(".practice-feedback");
    const answerEl = task.querySelector(".practice-answer-key");
    if (!input || !button || !feedback || !answerEl) return;

    const raw = (answerEl.textContent || "").trim();
    const match = raw.match(/[Жж]ауап\s*:\s*(.+)$/);
    const answerText = match ? match[1].trim() : "";
    const answerNorm = normalizeAnswer(answerText);

    answerEl.style.display = "none";

    button.addEventListener("click", () => {
      const user = input.value.trim();
      const userNorm = normalizeAnswer(user);

      feedback.classList.remove("ok", "err");

      if (!userNorm) {
        feedback.textContent = "Алдымен жауап енгізіңіз.";
        feedback.classList.add("err");
        return;
      }

      if (
        answerNorm &&
        (answerNorm === userNorm ||
         answerNorm.includes(userNorm) ||
         userNorm.includes(answerNorm))
      ) {
        feedback.textContent = "Дұрыс! 👍";
        feedback.classList.add("ok");
      } else {
        feedback.textContent = "Дұрыс емес.";
        feedback.classList.add("err");
      }
    });
  });

  const resetBlocks = document.querySelectorAll("#practice .practice-reset-block");
  resetBlocks.forEach(btn => {
    btn.addEventListener("click", () => {
      const block = btn.closest(".practice-block");
      if (!block) return;
      const inputs    = block.querySelectorAll(".practice-input");
      const feedbacks = block.querySelectorAll(".practice-feedback");

      inputs.forEach(i => (i.value = ""));
      feedbacks.forEach(f => {
        f.textContent = "";
        f.classList.remove("ok", "err");
      });
    });
  });
}

/* === ҮЛГІ ЕСЕПТЕР: ойындар === */
function initExamplesGames() {
  // --- 1) Салыстыру ойыны ---
  (function initCompareGame() {
    const rows = document.querySelectorAll("#examples .compare-row");
    if (!rows.length) return;

    rows.forEach(row => {
      const correct = (row.dataset.answer || "").trim();
      const buttons = row.querySelectorAll(".compare-btn");
      const feedback = row.querySelector(".compare-feedback");
      if (!buttons.length || !feedback || !correct) return;

      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          const choice = btn.dataset.choice;

          buttons.forEach(b =>
            b.classList.remove("selected", "correct-choice", "wrong-choice")
          );
          btn.classList.add("selected");
          feedback.classList.remove("ok", "err");

          if (choice === correct) {
            btn.classList.add("correct-choice");
            feedback.textContent = "Дұрыс! ✅";
            feedback.classList.add("ok");
          } else {
            btn.classList.add("wrong-choice");
            feedback.textContent = "Дұрыс емес. Қайта көріңіз.";
            feedback.classList.add("err");
          }
        });
      });
    });
  })();

  // --- 2) Жылдам есептеу ойыны ---
  (function initSpeedGame() {
    const qEl       = document.getElementById("speed-question");
    const aInput    = document.getElementById("speed-answer");
    const checkBtn  = document.getElementById("speed-check");
    const newBtn    = document.getElementById("speed-new");
    const fbEl      = document.getElementById("speed-feedback");
    const correctEl = document.getElementById("speed-correct");
    const totalEl   = document.getElementById("speed-total");

    if (!qEl || !aInput || !checkBtn || !newBtn || !fbEl || !correctEl || !totalEl) return;

    let currentAnswer = null;
    let correctCount = 0;
    let totalCount = 0;

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function newQuestion() {
      const type = randInt(1, 3); // 1:+, 2:-, 3:×
      let a, b, ans, text;

      if (type === 1) {
        a = randInt(10, 99);
        b = randInt(10, 99);
        ans = a + b;
        text = `${a} + ${b} = ?`;
      } else if (type === 2) {
        a = randInt(20, 99);
        b = randInt(1, a);
        ans = a - b;
        text = `${a} − ${b} = ?`;
      } else {
        a = randInt(2, 9);
        b = randInt(2, 9);
        ans = a * b;
        text = `${a} × ${b} = ?`;
      }

      currentAnswer = ans;
      qEl.textContent = text;
      aInput.value = "";
      fbEl.textContent = "";
      fbEl.classList.remove("ok", "err");
      aInput.focus();
    }

    function checkAnswer() {
      if (currentAnswer === null) {
        fbEl.textContent = "Алдымен «Жаңа есеп» батырмасын басыңыз.";
        fbEl.classList.remove("ok");
        fbEl.classList.add("err");
        return;
      }

      const value = aInput.value.trim();
      const num = Number(value);
      fbEl.classList.remove("ok", "err");

      if (!value || Number.isNaN(num)) {
        fbEl.textContent = "Сан енгізіңіз.";
        fbEl.classList.add("err");
        return;
      }

      totalCount += 1;
      if (num === currentAnswer) {
        correctCount += 1;
        fbEl.textContent = "Дұрыс! 👍";
        fbEl.classList.add("ok");
 } else {
  fbEl.textContent = "Дұрыс емес. Тағы бір рет ойлан! ❌";
  fbEl.classList.add("err");
}

      correctEl.textContent = String(correctCount);
      totalEl.textContent = String(totalCount);
    }

    newBtn.addEventListener("click", newQuestion);
    checkBtn.addEventListener("click", checkAnswer);

    aInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkAnswer();
    });
  })();
}

/* === 2D «Құстар мен қамал» ойыны (Angry Birds стилі) === */
/* === 2D «Құстар мен қамал» ойыны (Angry Birds стилі, улучшенная версия) === */
function initBirdGame() {
  const canvas = document.getElementById("bird-game-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("bird-score");

  // Внутренний логический размер (масштабируется CSS'ом)
  const WIDTH = 640;
  const HEIGHT = 360;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const G = 0.45;          // гравитация чуть сильнее
  const GROUND_H = 50;     // высота земли

  const BIRD_RADIUS = 16;
  const BIRD_START_X = 90;
  const BIRD_START_Y = HEIGHT - GROUND_H - 40;

  let bird = {
    x: BIRD_START_X,
    y: BIRD_START_Y,
    vx: 0,
    vy: 0,
    launched: false,
    dragging: false
  };

  let dragPos = { x: BIRD_START_X, y: BIRD_START_Y };
  let targets = [];
  let score = 0;
  let canShoot = true; // чтобы не стрелять, пока птичка ещё летит

  function updateScore() {
    if (scoreEl) scoreEl.textContent = String(score);
  }

  function resetBird() {
    bird.x = BIRD_START_X;
    bird.y = BIRD_START_Y;
    bird.vx = 0;
    bird.vy = 0;
    bird.launched = false;
    bird.dragging = false;
    dragPos.x = bird.x;
    dragPos.y = bird.y;
    canShoot = true;
  }

  function createTargets() {
    targets = [];
    const baseY = HEIGHT - GROUND_H;
    const w = 26;
    const h = 40;
    const x0 = 430;
    const gap = 32;

    for (let i = 0; i < 3; i++) {
      const x = x0 + i * gap;
      targets.push({ x, y: baseY - h, w, h, alive: true });
      targets.push({ x, y: baseY - 2 * h, w, h, alive: true });
    }

    targets.push({
      x: x0 + gap,
      y: baseY - 3 * h,
      w,
      h,
      alive: true
    });
  }

  createTargets();
  updateScore();
  resetBird();

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function circleRectCollide(cx, cy, r, rect) {
    const closestX = clamp(cx, rect.x, rect.x + rect.w);
    const closestY = clamp(cy, rect.y, rect.y + rect.h);
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= r * r;
  }

  // --- Мышь ---
  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / rect.width) * WIDTH,
      y: ((evt.clientY - rect.top) / rect.height) * HEIGHT
    };
  }

  canvas.addEventListener("mousedown", (e) => {
    if (!canShoot || bird.launched) return;

    const pos = getMousePos(e);
    const dx = pos.x - bird.x;
    const dy = pos.y - bird.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Начинаем тянуть только если кликнули по птице
    if (dist <= BIRD_RADIUS + 10) {
      bird.dragging = true;
      dragPos.x = pos.x;
      dragPos.y = pos.y;
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!bird.dragging) return;
    const pos = getMousePos(e);

    const maxPull = 110; // можно сильнее натягивать
    const dx = pos.x - BIRD_START_X;
    const dy = pos.y - BIRD_START_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxPull) {
      const k = maxPull / dist;
      dragPos.x = BIRD_START_X + dx * k;
      dragPos.y = BIRD_START_Y + dy * k;
    } else {
      dragPos.x = pos.x;
      dragPos.y = pos.y;
    }

    bird.x = dragPos.x;
    bird.y = dragPos.y;
  });

  window.addEventListener("mouseup", () => {
    if (!bird.dragging) return;

    // Насколько оттянули от стартовой точки
    const dx = bird.x - BIRD_START_X;
    const dy = bird.y - BIRD_START_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    bird.dragging = false;

    // Если оттянули слишком мало — считаем, что выстрела нет
    if (dist < 8) {
      resetBird();
      return;
    }

    // Чем сильнее натянул, тем быстрее полетит
    const power = 0.25; // увеличь до 0.3–0.35, если хочешь ещё мощнее
    bird.vx = -dx * power;
    bird.vy = -dy * power;
    bird.launched = true;
    canShoot = false;
  });

  // --- Обновление физики ---
  function update() {
    if (bird.launched) {
      bird.vy += G;
      bird.x += bird.vx;
      bird.y += bird.vy;

      const groundY = HEIGHT - GROUND_H - BIRD_RADIUS;

      // Столкновение с землёй
      if (bird.y > groundY) {
        bird.y = groundY;
        bird.vy *= -0.45;   // отскок
        bird.vx *= 0.82;

        // Если почти остановилась – даём секунду, потом ресет
        if (Math.abs(bird.vy) < 0.5 && Math.abs(bird.vx) < 0.5) {
          setTimeout(() => {
            if (bird.launched) resetBird();
          }, 600);
        }
      }

      // Вылет за экран
      if (bird.x > WIDTH + 120 || bird.x < -120 || bird.y < -120) {
        resetBird();
      }

      // Столкновения с блоками
      let anyAlive = false;
      targets.forEach((t) => {
        if (!t.alive) return;
        anyAlive = true;
        if (circleRectCollide(bird.x, bird.y, BIRD_RADIUS, t)) {
          t.alive = false;
          score += 1;
          updateScore();
          // Лёгкая потеря скорости при ударе
          bird.vx *= 0.7;
          bird.vy *= 0.7;
        }
      });

      // Если все блоки разрушены – новая башня
      if (!anyAlive) {
        createTargets();
        resetBird();
      }
    }
  }

  // --- Рисование ---
  function draw() {
    // фон
    const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grad.addColorStop(0, "#fee2e2");
    grad.addColorStop(1, "#fecaca");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // земля
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(0, HEIGHT - GROUND_H, WIDTH, GROUND_H);

    // праща
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(BIRD_START_X - 18, HEIGHT - GROUND_H);
    ctx.lineTo(BIRD_START_X - 4, BIRD_START_Y + 10);
    ctx.moveTo(BIRD_START_X + 18, HEIGHT - GROUND_H);
    ctx.lineTo(BIRD_START_X + 4, BIRD_START_Y + 10);
    ctx.stroke();

    // резинка
    if (bird.dragging || (!bird.launched && (bird.x !== BIRD_START_X || bird.y !== BIRD_START_Y))) {
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(BIRD_START_X - 4, BIRD_START_Y + 8);
      ctx.lineTo(bird.x, bird.y);
      ctx.moveTo(BIRD_START_X + 4, BIRD_START_Y + 8);
      ctx.lineTo(bird.x, bird.y);
      ctx.stroke();
    }

    // блоки
    targets.forEach((t) => {
      if (!t.alive) return;
      ctx.fillStyle = "#15803d";
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.strokeStyle = "#166534";
      ctx.lineWidth = 2;
      ctx.strokeRect(t.x, t.y, t.w, t.h);
    });

    // птица
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, BIRD_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#7f1d1d";
    ctx.stroke();

    // клюв
    ctx.beginPath();
    ctx.moveTo(bird.x + BIRD_RADIUS - 2, bird.y);
    ctx.lineTo(bird.x + BIRD_RADIUS + 8, bird.y - 4);
    ctx.lineTo(bird.x + BIRD_RADIUS + 8, bird.y + 4);
    ctx.closePath();
    ctx.fillStyle = "#f97316";
    ctx.fill();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
}

/* === 3D құрылыс ойыны (Minecraft стилі) === */
function initMinecraftGame() {
  const container = document.getElementById("mc-container");
  if (!container) return;
  if (typeof THREE === "undefined") return; // Three.js жүктелмесе – шығамыз

  const width  = container.clientWidth || 800;
  const height = container.clientHeight || 420;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0f2fe);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(10, 12, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Жарық
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(15, 25, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Жер
  const planeGeo = new THREE.PlaneGeometry(30, 30);
  const planeMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af });
  const ground = new THREE.Mesh(planeGeo, planeMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.userData.type = "ground";
  scene.add(ground);

  // Тор сызықтар
  const grid = new THREE.GridHelper(30, 30, 0x6b7280, 0xd1d5db);
  scene.add(grid);

  // Блок параметрлері
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const materials = {
    grass: new THREE.MeshStandardMaterial({ color: 0x22c55e }),
    stone: new THREE.MeshStandardMaterial({ color: 0x9ca3af }),
    water: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7
    })
  };

  const blocks = {}; // "x,y,z" → mesh

  function keyFromPos(x, y, z) {
    return `${x},${y},${z}`;
  }

  function addBlock(x, y, z, type) {
    const key = keyFromPos(x, y, z);
    if (blocks[key]) return; // уже есть

    const mat = materials[type] || materials.grass;
    const mesh = new THREE.Mesh(cubeGeo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = "block";
    scene.add(mesh);
    blocks[key] = mesh;
  }

  function removeBlock(x, y, z) {
    const key = keyFromPos(x, y, z);
    const mesh = blocks[key];
    if (!mesh) return;
    scene.remove(mesh);
    delete blocks[key];
  }

  // Немного стартовых блоков (төбешік)
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      addBlock(x, 0.5, z, "grass");
    }
  }

  // Выбор типа блока
  let currentType = "grass";
  const typeButtons = document.querySelectorAll(".mc-block-button");
  typeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      typeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentType = btn.dataset.type || "grass";
    });
  });

  // Raycaster для кликов
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function getIntersections(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const blockMeshes = Object.values(blocks);
    const objects = blockMeshes.concat([ground]);
    return raycaster.intersectObjects(objects, false);
  }

  // Кликом мыши добавляем/удаляем
  function onMouseDown(event) {
    event.preventDefault();
    const intersects = getIntersections(event);
    if (!intersects.length) return;

    const hit = intersects[0];

    // Оң жақ батырма немесе Ctrl+сол – блокты жою
    if (event.button === 2 || event.ctrlKey) {
      if (hit.object.userData.type === "block") {
        const pos = hit.object.position;
        removeBlock(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
      }
      return;
    }

    // Сол жақ – блок қою
    if (hit.object.userData.type === "block") {
      // блокқа тигенде – нормаль бағытында жаңа блок
      const normal = hit.face.normal.clone();
      const pos = hit.object.position.clone().add(normal);
      const x = Math.round(pos.x);
      const y = Math.round(pos.y);
      const z = Math.round(pos.z);
      addBlock(x, y, z, currentType);
    } else if (hit.object.userData.type === "ground") {
      // жерге тигенде – тор бойынша жуықтаймыз
      const p = hit.point;
      const x = Math.round(p.x);
      const z = Math.round(p.z);
      const y = 0.5;
      addBlock(x, y, z, currentType);
    }
  }

  renderer.domElement.addEventListener("mousedown", onMouseDown);
  renderer.domElement.addEventListener("contextmenu", e => e.preventDefault());

  // Масштабирование при изменении окна
  function onResize() {
    const w = container.clientWidth || width;
    const h = container.clientHeight || height;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  // Анимация (камера статичная, просто рендерим сцену)
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  onResize();
  animate();
}


/* === ИНТЕРАКТИВТІ ЖАТТЫҒУЛАР: 3D ОЙЫН (Three.js) === */
/* === ИНТЕРАКТИВТІ ЖАТТЫҒУЛАР: 3D ОЙЫН (Three.js) === */
function initInteractive3DGame() {
  const container = document.getElementById("game3d-container");
  if (!container) return;

  // Проверяем, загрузился ли Three.js
  if (typeof THREE === "undefined") {
    // Если нет – показываем сообщение, чтобы было понятно, в чём дело
    const msg = document.createElement("div");
    msg.className = "game3d-error";
    msg.textContent =
      "3D кітапхана (Three.js) жүктелмеді. Интернет қосулы ма, және three.min.js файлы дұрыс қосылды ма, тексеріңіз.";
    container.appendChild(msg);
    return;
  }

  const scoreEl = document.getElementById("game3d-score");

  const startWidth  = container.clientWidth || 800;
  const startHeight = container.clientHeight || 420;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3f4ff);

  const camera = new THREE.PerspectiveCamera(60, startWidth / startHeight, 0.1, 1000);
  camera.position.set(0, 12, 16);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(startWidth, startHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const planeGeo = new THREE.PlaneGeometry(30, 30);
  const planeMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb });
  const ground = new THREE.Mesh(planeGeo, planeMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const playerGeo = new THREE.BoxGeometry(1, 1, 1);
  const playerMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
  const player = new THREE.Mesh(playerGeo, playerMat);
  player.castShadow = true;
  player.position.set(0, 0.5, 0);
  scene.add(player);

  const coins = [];
  const coinGeo = new THREE.TorusGeometry(0.4, 0.15, 8, 16);
  const baseCoinMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.6,
  });

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnCoin(coin) {
    const range = 12;
    coin.position.x = randomInRange(-range, range);
    coin.position.z = randomInRange(-range, range);
    coin.position.y = 0.4;
  }

  const COIN_COUNT = 8;
  for (let i = 0; i < COIN_COUNT; i++) {
    const mat = baseCoinMat.clone();
    const coin = new THREE.Mesh(coinGeo, mat);
    coin.castShadow = true;
    spawnCoin(coin);
    scene.add(coin);
    coins.push(coin);
  }

  const keys = {};
  let score = 0;

  window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  function updatePlayer() {
    const speed = 0.12;
    let dx = 0;
    let dz = 0;

    if (keys["w"] || keys["arrowup"]) dz -= speed;
    if (keys["s"] || keys["arrowdown"]) dz += speed;
    if (keys["a"] || keys["arrowleft"]) dx -= speed;
    if (keys["d"] || keys["arrowright"]) dx += speed;

    player.position.x += dx;
    player.position.z += dz;

    const limit = 13;
    player.position.x = Math.max(-limit, Math.min(limit, player.position.x));
    player.position.z = Math.max(-limit, Math.min(limit, player.position.z));

    if (dx !== 0 || dz !== 0) {
      player.rotation.y = Math.atan2(dx, dz);
    }

    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 14;
    camera.lookAt(player.position.x, player.position.y, player.position.z);
  }

  function checkCollisions() {
    const collectDistance = 1.1;
    coins.forEach((coin) => {
      const dist = player.position.distanceTo(coin.position);
      if (dist < collectDistance) {
        score += 1;
        if (scoreEl) scoreEl.textContent = String(score);
        spawnCoin(coin);
      }
    });
  }

  function onResize() {
    const w = container.clientWidth || startWidth;
    const h = container.clientHeight || startHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  function animate() {
    requestAnimationFrame(animate);

    updatePlayer();
    checkCollisions();

    coins.forEach((coin) => {
      coin.rotation.y += 0.04;
    });

    renderer.render(scene, camera);
  }

  onResize();
  animate();
}

/* === Геометрия бөлімі: 10 3D фигура === */
function initGeometry3D() {
  const root = document.getElementById("geometry");
  if (!root) return;
  if (typeof THREE === "undefined") return;

  const canvases = root.querySelectorAll(".geo-canvas");
  if (!canvases.length) return;

  const scenes = [];

  canvases.forEach((canvas) => {
    const shape = canvas.dataset.shape || "cube";
    const width = canvas.clientWidth || 260;
    const height = canvas.clientHeight || 180;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(3, 4, 5);
    scene.add(dir);

    let mesh;

    const commonMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.3,
      metalness: 0.35
    });

    switch (shape) {
      case "triangle": {
        // үшбұрышқа ұқсас пирамида
        const geo = new THREE.ConeGeometry(1.1, 1.8, 3);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "cube": {
        const geo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "disk": {
        const geo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 48);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "box": {
        const geo = new THREE.BoxGeometry(2.4, 1.4, 1.2);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "prism": {
        const geo = new THREE.CylinderGeometry(1.2, 1.2, 2.0, 6);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "pyramid": {
        const geo = new THREE.ConeGeometry(1.4, 2.0, 4);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "sphere": {
        const geo = new THREE.SphereGeometry(1.3, 32, 32);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "cylinder": {
        const geo = new THREE.CylinderGeometry(1.0, 1.0, 2.0, 32);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "cone": {
        const geo = new THREE.ConeGeometry(1.1, 2.0, 32);
        mesh = new THREE.Mesh(geo, commonMat);
        break;
      }
      case "axes": {
        // координаталық осьтер
        const group = new THREE.Group();

        const makeAxis = (color, from, to) => {
          const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3().fromArray(from),
            new THREE.Vector3().fromArray(to)
          ]);
          const mat = new THREE.LineBasicMaterial({ color });
          const line = new THREE.Line(geo, mat);
          group.add(line);
        };

        makeAxis(0xef4444, [0, 0, 0], [2.2, 0, 0]); // Ox
        makeAxis(0x10b981, [0, 0, 0], [0, 2.2, 0]); // Oy
        makeAxis(0x3b82f6, [0, 0, 0], [0, 0, 2.2]); // Oz

        mesh = group;
        break;
      }
      default: {
        const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        mesh = new THREE.Mesh(geo, commonMat);
      }
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    scenes.push({ renderer, scene, camera, mesh, canvas });
  });

  // ресайз
  function handleResize() {
    scenes.forEach((obj) => {
      const { renderer, camera, canvas } = obj;
      const w = canvas.clientWidth || 260;
      const h = canvas.clientHeight || 180;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
  }
  window.addEventListener("resize", handleResize);

  // анимация
  function animate() {
    requestAnimationFrame(animate);
    scenes.forEach((obj, idx) => {
      if (obj.mesh) {
        const speed = 0.01 + idx * 0.0015;
        obj.mesh.rotation.y += speed;
        obj.mesh.rotation.x += speed * 0.4;
      }
      obj.renderer.render(obj.scene, obj.camera);
    });
  }

  handleResize();
  animate();
}

/* === Геометрия зертханасы: 3D + параметрлер + тест === */
function initGeometryLab() {
  const canvas = document.getElementById("geo-main-canvas");
  if (!canvas) return;
  if (typeof THREE === "undefined") return;

  const titleEl = document.getElementById("geo-shape-title");
  const descEl = document.getElementById("geo-shape-description");
  const formulaMainEl = document.getElementById("geo-formula-main");
  const formulaExtraEl = document.getElementById("geo-formula-extra");
  const paramList = document.getElementById("geo-param-list");
  const rotateCheckbox = document.getElementById("geo-toggle-rotate");
  const wireCheckbox = document.getElementById("geo-toggle-wire");

  const quizQEl = document.getElementById("geo-quiz-question");
  const quizAnsEl = document.getElementById("geo-quiz-answer");
  const quizBtn = document.getElementById("geo-quiz-check");
  const quizFbEl = document.getElementById("geo-quiz-feedback");

  const shapeButtons = document.querySelectorAll(".geo-shape-btn");

  const pi = 3.14;
  const sqrt3 = 1.73;

  // Настройки фигур
  const shapes = {
    triangle: {
      title: "Үшбұрыш",
      description:
        "Теңқабырғалы үшбұрыш: барлық қабырғалары тең. Бұл жерде бір ғана параметр – a.",
      params: [
        {
          key: "a",
          label: "a – қабырға ұзындығы (см)",
          min: 2,
          max: 10,
          step: 1,
          def: 4,
        },
      ],
      buildMesh(params) {
        const a = params.a || 4;
        const geo = new THREE.ConeGeometry(1.2, 1.8, 3);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          roughness: 0.3,
          metalness: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 0;
        const s = 0.2 + a * 0.08;
        mesh.scale.set(s, s, s);
        return mesh;
      },
      compute(params) {
        const a = params.a;
        const P = 3 * a;
        const S = (sqrt3 / 4) * a * a;
        return { a, P, S };
      },
      formulas(values) {
        const { a, P, S } = values;
        return {
          main: `Периметрі: <strong>P = 3a = 3 · ${a} = ${P.toFixed(0)} см</strong>`,
          extra: `Ауданы: <strong>S ≈ (√3 / 4) · a² ≈ ${S.toFixed(
            1
          )} см²</strong>`,
        };
      },
      quiz(values) {
        const Sround = Math.round(values.S);
        return {
          question: `a = ${values.a} см болғанда, үшбұрыштың ауданы шамамен неше см²? (бүтін санмен жаз)`,
          answer: Sround,
        };
      },
    },

    square: {
      title: "Квадрат",
      description:
        "Квадрат – барлық қабырғалары тең және бұрыштары 90° болатын төртбұрыш.",
      params: [
        {
          key: "a",
          label: "a – қабырға ұзындығы (см)",
          min: 2,
          max: 12,
          step: 1,
          def: 5,
        },
      ],
      buildMesh(params) {
        const a = params.a || 5;
        const geo = new THREE.BoxGeometry(1, 1, 0.2);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          roughness: 0.35,
          metalness: 0.25,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const s = 0.2 + a * 0.07;
        mesh.scale.set(s, s, s);
        return mesh;
      },
      compute(params) {
        const a = params.a;
        const P = 4 * a;
        const S = a * a;
        return { a, P, S };
      },
      formulas(values) {
        const { a, P, S } = values;
        return {
          main: `Периметрі: <strong>P = 4a = 4 · ${a} = ${P.toFixed(0)} см</strong>`,
          extra: `Ауданы: <strong>S = a² = ${a}² = ${S.toFixed(0)} см²</strong>`,
        };
      },
      quiz(values) {
        return {
          question: `Квадраттың қабырғасы a = ${values.a} см. Ауданы неше см²?`,
          answer: values.S,
        };
      },
    },

    circle: {
      title: "Дөңгелек",
      description:
        "Дөңгелек – шеңбермен шектелген жазық фигура. Параметрі – радиус r.",
      params: [
        {
          key: "r",
          label: "r – радиус (см)",
          min: 1,
          max: 8,
          step: 1,
          def: 3,
        },
      ],
      buildMesh(params) {
        const r = params.r || 3;
        const geo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 64);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x3b82f6,
          roughness: 0.35,
          metalness: 0.4,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const s = 0.3 + r * 0.06;
        mesh.scale.set(s, s, s);
        return mesh;
      },
      compute(params) {
        const r = params.r;
        const L = 2 * pi * r;
        const S = pi * r * r;
        return { r, L, S };
      },
      formulas(values) {
        const { r, L, S } = values;
        return {
          main: `Ұзындығы: <strong>L ≈ 2πr ≈ 2 · 3.14 · ${r} ≈ ${L.toFixed(
            1
          )} см</strong>`,
          extra: `Ауданы: <strong>S ≈ πr² ≈ 3.14 · ${r}² ≈ ${S.toFixed(
            1
          )} см²</strong>`,
        };
      },
      quiz(values) {
        const Sround = Math.round(values.S);
        return {
          question: `r = ${values.r} см болғанда, дөңгелектің ауданы шамамен нешеге тең? (бүтін сан)`,
          answer: Sround,
        };
      },
    },

    cube: {
      title: "Куб",
      description:
        "Куб – барлық қырлары тең және барлық қыры тікбұрышты болатын кеңістік денесі.",
      params: [
        {
          key: "a",
          label: "a – қыры (см)",
          min: 1,
          max: 8,
          step: 1,
          def: 3,
        },
      ],
      buildMesh(params) {
        const a = params.a || 3;
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          roughness: 0.3,
          metalness: 0.4,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const s = 0.3 + a * 0.1;
        mesh.scale.set(s, s, s);
        return mesh;
      },
      compute(params) {
        const a = params.a;
        const S = 6 * a * a;
        const V = a * a * a;
        return { a, S, V };
      },
      formulas(values) {
        return {
          main: `Ауданы: <strong>S = 6a² = 6 · ${values.a}² = ${values.S.toFixed(
            0
          )} см²</strong>`,
          extra: `Көлемі: <strong>V = a³ = ${values.a}³ = ${values.V.toFixed(
            0
          )} см³</strong>`,
        };
      },
      quiz(values) {
        return {
          question: `Куб қыры a = ${values.a} см. Көлемі неше см³?`,
          answer: values.V,
        };
      },
    },

    box: {
      title: "Тікбұрышты параллелепипед",
      description:
        "Үш өлшемі бар дене: ұзындығы, ені және биіктігі. Көлемі V = a · b · h.",
      params: [
        { key: "a", label: "a – ұзындығы (см)", min: 2, max: 10, step: 1, def: 5 },
        { key: "b", label: "b – ені (см)", min: 2, max: 10, step: 1, def: 4 },
        { key: "h", label: "h – биіктігі (см)", min: 2, max: 10, step: 1, def: 3 },
      ],
      buildMesh(params) {
        const { a, b, h } = params;
        const geo = new THREE.BoxGeometry(2, 1, 1);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          roughness: 0.35,
          metalness: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(0.12 * a, 0.12 * h, 0.12 * b);
        return mesh;
      },
      compute(params) {
        const { a, b, h } = params;
        const V = a * b * h;
        return { a, b, h, V };
      },
      formulas(values) {
        const { a, b, h, V } = values;
        return {
          main: `Көлемі: <strong>V = a · b · h = ${a} · ${b} · ${h} = ${V.toFixed(
            0
          )} см³</strong>`,
          extra: "",
        };
      },
      quiz(values) {
        return {
          question: `a = ${values.a} см, b = ${values.b} см, h = ${values.h} см. Параллелепипед көлемін тап (см³).`,
          answer: values.V,
        };
      },
    },

    prism: {
      title: "Призма",
      description:
        "Мұнда табаны – теңқабырғалы үшбұрыш, биіктігі – h. Көлемі V = Sтаб · h.",
      params: [
        { key: "a", label: "a – табан қабырғасы (см)", min: 2, max: 8, step: 1, def: 4 },
        { key: "h", label: "h – биіктігі (см)", min: 2, max: 10, step: 1, def: 5 },
      ],
      buildMesh(params) {
        const { a, h } = params;
        const geo = new THREE.CylinderGeometry(1, 1, 2, 3);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          roughness: 0.35,
          metalness: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(0.2 + a * 0.06, 0.15 * h, 0.2 + a * 0.06);
        return mesh;
      },
      compute(params) {
        const { a, h } = params;
        const Sbase = (sqrt3 / 4) * a * a;
        const V = Sbase * h;
        return { a, h, Sbase, V };
      },
      formulas(values) {
        return {
          main: `Көлемі: <strong>V ≈ Sтаб · h ≈ ${values.Sbase.toFixed(
            1
          )} · ${values.h} ≈ ${values.V.toFixed(1)} см³</strong>`,
          extra: "",
        };
      },
      quiz(values) {
        return {
          question: `a = ${values.a} см, h = ${values.h} см. Призманың көлемін жуықтап тап (см³, бүтін).`,
          answer: Math.round(values.V),
        };
      },
    },

    pyramid: {
      title: "Пирамида",
      description:
        "Мұнда табаны – квадрат, биіктігі – h. Көлемі V = (1/3) · a² · h.",
      params: [
        { key: "a", label: "a – табан қабырғасы (см)", min: 2, max: 10, step: 1, def: 5 },
        { key: "h", label: "h – биіктігі (см)", min: 2, max: 10, step: 1, def: 6 },
      ],
      buildMesh(params) {
        const { a, h } = params;
        const geo = new THREE.ConeGeometry(1.2, 2, 4);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          roughness: 0.35,
          metalness: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(0.18 + a * 0.05, 0.12 * h, 0.18 + a * 0.05);
        return mesh;
      },
      compute(params) {
        const { a, h } = params;
        const V = (1 / 3) * a * a * h;
        return { a, h, V };
      },
      formulas(values) {
        return {
          main: `Көлемі: <strong>V = (1/3) · a² · h = (1/3) · ${values.a}² · ${
            values.h
          } ≈ ${values.V.toFixed(1)} см³</strong>`,
          extra: "",
        };
      },
      quiz(values) {
        return {
          question: `a = ${values.a} см, h = ${values.h} см. Пирамиданың көлемін жуықта (см³, бүтін).`,
          answer: Math.round(values.V),
        };
      },
    },

    cylinder: {
      title: "Цилиндр",
      description:
        "Цилиндр – табандары шеңбер, биіктігі h болатын дене. Көлемі V = πr²h.",
      params: [
        { key: "r", label: "r – радиус (см)", min: 1, max: 6, step: 1, def: 3 },
        { key: "h", label: "h – биіктігі (см)", min: 2, max: 10, step: 1, def: 6 },
      ],
      buildMesh(params) {
        const { r, h } = params;
        const geo = new THREE.CylinderGeometry(1, 1, 2, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0ea5e9,
          roughness: 0.3,
          metalness: 0.4,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(0.18 + r * 0.06, 0.12 * h, 0.18 + r * 0.06);
        return mesh;
      },
      compute(params) {
        const { r, h } = params;
        const V = pi * r * r * h;
        return { r, h, V };
      },
      formulas(values) {
        const { r, h, V } = values;
        return {
          main: `Көлемі: <strong>V ≈ πr²h ≈ 3.14 · ${r}² · ${h} ≈ ${V.toFixed(
            1
          )} см³</strong>`,
          extra: "",
        };
      },
      quiz(values) {
        return {
          question: `r = ${values.r} см, h = ${values.h} см. Цилиндр көлемін жуықтап тап (см³, бүтін).`,
          answer: Math.round(values.V),
        };
      },
    },

    cone: {
      title: "Конус",
      description:
        "Конус – шеңбер тәрізді табаны және бір нүктеде түйісетін бүйір беті бар дене.",
      params: [
        { key: "r", label: "r – радиус (см)", min: 1, max: 6, step: 1, def: 3 },
        { key: "h", label: "h – биіктігі (см)", min: 2, max: 10, step: 1, def: 6 },
      ],
      buildMesh(params) {
        const { r, h } = params;
        const geo = new THREE.ConeGeometry(1, 2, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xec4899,
          roughness: 0.35,
          metalness: 0.35,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(0.18 + r * 0.06, 0.12 * h, 0.18 + r * 0.06);
        return mesh;
      },
      compute(params) {
        const { r, h } = params;
        const V = (1 / 3) * pi * r * r * h;
        return { r, h, V };
      },
      formulas(values) {
        const { r, h, V } = values;
        return {
          main: `Көлемі: <strong>V ≈ (1/3) · πr²h ≈ (1/3) · 3.14 · ${r}² · ${h} ≈ ${V.toFixed(
            1
          )} см³</strong>`,
          extra: "",
        };
      },
      quiz(values) {
        return {
          question: `r = ${values.r} см, h = ${values.h} см. Конус көлемін жуықтап тап (см³, бүтін).`,
          answer: Math.round(values.V),
        };
      },
    },

    sphere: {
      title: "Шар",
      description:
        "Шар – кеңістіктегі барлық нүктелері центрден бірдей қашықтықта орналасқан дене.",
      params: [
        { key: "r", label: "r – радиус (см)", min: 1, max: 6, step: 1, def: 3 },
      ],
      buildMesh(params) {
        const r = params.r || 3;
        const geo = new THREE.SphereGeometry(1, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          roughness: 0.25,
          metalness: 0.45,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(0.25 + r * 0.08, 0.25 + r * 0.08, 0.25 + r * 0.08);
        return mesh;
      },
      compute(params) {
        const r = params.r;
        const S = 4 * pi * r * r;
        const V = (4 / 3) * pi * r * r * r;
        return { r, S, V };
      },
      formulas(values) {
        const { r, S, V } = values;
        return {
          main: `Ауданы: <strong>S ≈ 4πr² ≈ 4 · 3.14 · ${r}² ≈ ${S.toFixed(
            1
          )} см²</strong>`,
          extra: `Көлемі: <strong>V ≈ (4/3) · πr³ ≈ ${V.toFixed(
            1
          )} см³</strong>`,
        };
      },
      quiz(values) {
        return {
          question: `r = ${values.r} см. Шардың көлемін жуықтап тап (см³, бүтін).`,
          answer: Math.round(values.V),
        };
      },
    },
  };

  // Three.js сцена
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(4, 3, 6);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 8, 6);
  dir.castShadow = true;
  scene.add(ambient);
  scene.add(dir);

  const groundGeo = new THREE.PlaneGeometry(12, 12);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.2;
  ground.receiveShadow = true;
  scene.add(ground);

  let currentShapeKey = "triangle";
  let currentParams = {};
  let currentMesh = null;
  let autoRotate = rotateCheckbox ? rotateCheckbox.checked : true;
  let wireframe = false;
  let quizAnswer = null;

  function applyWireframe() {
    if (!currentMesh) return;
    const setWire = (obj) => {
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => (m.wireframe = wireframe));
        } else {
          obj.material.wireframe = wireframe;
        }
      }
    };
    if (currentMesh.traverse) currentMesh.traverse(setWire);
    else setWire(currentMesh);
  }

  function rebuildMesh() {
    const config = shapes[currentShapeKey];
    if (!config) return;

    if (currentMesh) {
      scene.remove(currentMesh);
    }
    currentMesh = config.buildMesh(currentParams);
    currentMesh.castShadow = true;
    currentMesh.receiveShadow = true;
    scene.add(currentMesh);
    applyWireframe();
  }

  function buildParamControls() {
    const config = shapes[currentShapeKey];
    paramList.innerHTML = "";
    currentParams = {};

    config.params.forEach((p) => {
      const row = document.createElement("div");
      row.className = "geo-param-row";
      row.dataset.param = p.key;

      const label = document.createElement("label");
      label.textContent = p.label;

      const input = document.createElement("input");
      input.type = "range";
      input.min = p.min;
      input.max = p.max;
      input.step = p.step;
      input.value = p.def;

      const valueSpan = document.createElement("span");
      valueSpan.className = "geo-param-value";
      valueSpan.textContent = p.def;

      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(valueSpan);
      paramList.appendChild(row);

      currentParams[p.key] = Number(p.def);

      input.addEventListener("input", () => {
        currentParams[p.key] = Number(input.value);
        valueSpan.textContent = input.value;
        updateAll();
      });
    });
  }

  function updateInfoAndQuiz() {
    const config = shapes[currentShapeKey];
    if (!config) return;
    const values = config.compute(currentParams);

    if (titleEl) titleEl.textContent = config.title;
    if (descEl) descEl.textContent = config.description;

    const f = config.formulas(values);
    if (formulaMainEl) formulaMainEl.innerHTML = f.main || "";
    if (formulaExtraEl) formulaExtraEl.innerHTML = f.extra || "";

    if (config.quiz && quizQEl && quizFbEl && quizAnsEl) {
      const q = config.quiz(values);
      quizQEl.textContent = q.question;
      quizAnswer = q.answer;
      quizFbEl.textContent = "";
      quizFbEl.classList.remove("ok", "err");
      quizAnsEl.value = "";
    }
  }

  function updateAll() {
    rebuildMesh();
    updateInfoAndQuiz();
  }

  // Кнопки фигур
  shapeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const shape = btn.dataset.shape;
      if (!shape || !shapes[shape]) return;

      shapeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      currentShapeKey = shape;
      buildParamControls();
      updateAll();
    });
  });

  // Тогглы
  if (rotateCheckbox) {
    rotateCheckbox.addEventListener("change", () => {
      autoRotate = rotateCheckbox.checked;
    });
  }
  if (wireCheckbox) {
    wireCheckbox.addEventListener("change", () => {
      wireframe = wireCheckbox.checked;
      applyWireframe();
    });
  }

  // Тест
  if (quizBtn && quizAnsEl && quizFbEl) {
    quizBtn.addEventListener("click", () => {
      if (quizAnswer === null) return;
      const raw = quizAnsEl.value.trim().replace(",", ".");
      const num = Number(raw);
      quizFbEl.classList.remove("ok", "err");

      if (!raw || Number.isNaN(num)) {
        quizFbEl.textContent = "Алдымен сан енгізіңіз.";
        quizFbEl.classList.add("err");
        return;
      }

      const rounded = Math.round(num);
      const correct = Math.round(quizAnswer);

      if (rounded === correct) {
        quizFbEl.textContent = "Дұрыс! 👏";
        quizFbEl.classList.add("ok");
      } else {
        quizFbEl.textContent = `Дұрыс емес`;
        quizFbEl.classList.add("err");
      }
    });
  }

  // Ресайз
  function handleResize() {
    const w = canvas.clientWidth || 400;
    const h = canvas.clientHeight || 260;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", handleResize);

  // Анимация
  function animate() {
    requestAnimationFrame(animate);
    if (currentMesh && autoRotate) {
      currentMesh.rotation.y += 0.01;
      currentMesh.rotation.x += 0.004;
    }
    renderer.render(scene, camera);
  }

  // Старт
  buildParamControls();
  updateAll();
  handleResize();
  animate();
}

/* === ГЛОССАРИЙ: алфавит + флеш-карточки === */

const GLOSSARY_LETTERS = [
  "А","Ә","Б","В","Г","Ғ","Д","Е","Ё","Ж","З",
  "И","Й","К","Қ","Л","М","Н","Ң","О","Ө","П",
  "Р","С","Т","У","Ұ","Ү","Ф","Х","Һ","Ц","Ч",
  "Ш","Щ","Ы","І","Э","Ю","Я"
];

// Мында терминдерді кейін өзің көбірек қоса аласың:
const GLOSSARY_TERMS = [
  {
    term: "Аудан",
    definition: "Жазық фигураның қанша беткі бөлікті алып тұрғанын көрсететін сандық шама.",
    letter: "А"
  },
  {
    term: "Арифметикалық орта",
    definition: "Бірнеше санның қосындысын олардың санына бөліп алынған сан. Мысалы, (3 + 5 + 7) / 3.",
    letter: "А"
  },
  {
    term: "Әріптік өрнек",
    definition: "Сандар мен әріптерден және амал таңбаларынан құралған жазу: 3a + b, x − 5 сияқты.",
    letter: "Ә"
  },
  {
    term: "Әрекеттер тәртібі",
    definition: "Алдымен жақша, кейін көбейту/бөлу, соңында қосу/азайту орындалады.",
    letter: "Ә"
  },
  {
    term: "Бүтін сандар",
    definition: "... , -3, -2, -1, 0, 1, 2, 3, ... – теріс, нөл және оң натурал сандар жиыны.",
    letter: "Б"
  },
  {
    term: "Бөлшек",
    definition: "Бір нәрсенің бөлігін көрсететін сан: 1/2, 3/4, 5/10 сияқты.",
    letter: "Б"
  },
  {
    term: "Вертикаль бұрыштар",
    definition: "Қиылысқан екі түзу жасаған, бір-біріне қарсы орналасқан бұрыштар вертикаль бұрыштар деп аталады.",
    letter: "В"
  },
  {
    term: "График",
    definition: "Сандар арасындағы тәуелділікті координаталық жазықтықта нүктелер мен сызықтар арқылы көрсету.",
    letter: "Г"
  },
  {
    term: "Ғасыр",
    definition: "Уақыт өлшемі, 100 жылға тең. Мысалы, 2000–2099 жылдар – XXI ғасыр.",
    letter: "Ғ"
  },
  {
    term: "Диаметр",
    definition: "Шеңбер центрі арқылы өтетін және ұштары шеңберде жатқан кесінді. Диаметр 2 радиусқа тең.",
    letter: "Д"
  },
  {
    term: "Екі таңбалы сан",
    definition: "Ондық разрядта бір цифр, бірлікте бір цифр бар сан: 10–99 аралығындағы сандар.",
    letter: "Е"
  },
  {
    term: "Ёмкость (сыйымдылық)",
    definition: "Физикада және математикада ыдысқа немесе денеге қанша зат сыятынын сипаттайтын шама.",
    letter: "Ё"
  },
  {
    term: "Жай сан",
    definition: "1 мен өзінің өзінен басқа бөлгіші жоқ натурал сан. Мысалы, 2, 3, 5, 7, 11.",
    letter: "Ж"
  },
  {
    term: "Жұп сан",
    definition: "2-ге қалдықсыз бөлінетін бүтін сан: 0, 2, 4, 6, 8, ...",
    letter: "Ж"
  },
  {
    term: "Зона (аралық)",
    definition: "Сан осіндегі белгілі бір бөлік: мысалы, 0 мен 10 арасы, 5-тен үлкен сандар аралығы.",
    letter: "З"
  },
  {
    term: "Индекс",
    definition: "Көрсеткіш немесе реттік нөмір: a₁, a₂, a₃ жазуларындағы кіші сан индекс деп аталады.",
    letter: "И"
  },
  {
    term: "Й координатасы",
    definition: "Кейбір кестелерде немесе суреттерде екінші координатаны й әрпімен белгілеуге болады.",
    letter: "Й"
  },
  {
    term: "Координаталық түзу",
    definition: "Басы 0 нүктесінен басталып, бірлік кесіндісі таңдалған түзу. Онда сандар ретімен белгіленеді.",
    letter: "К"
  },
  {
    term: "Көпбұрыш",
    definition: "Жабық сынған сызықпен шектелген фигура. Үшбұрыш, төртбұрыш, бесбұрыш – көпбұрыш түрлері.",
    letter: "К"
  },
  {
    term: "Көлем",
    definition: "Кеңістік дененің қанша орынды алып тұрғанын сипаттайтын шама. Куб сантиметр, литр, т.б. өлшемдері бар.",
    letter: "К"
  },
  {
    term: "Қалдық",
    definition: "Бөлуді орындағанда бөлінгіш толық бөлінбесе, қалған сан қалдық деп аталады.",
    letter: "Қ"
  },
  {
    term: "Линия (сызық)",
    definition: "Нүктелердің тізбегінен тұратын фигура. Түзу сызық және қисық сызықтар болады.",
    letter: "Л"
  },
  {
    term: "Масштаб",
    definition: "Картада немесе сызбада шындықтағы өлшем мен суреттегі өлшемнің қатынасы. Мысалы, 1:1000.",
    letter: "М"
  },
  {
    term: "Математикалық модель",
    definition: "Нақты жағдайды сандар, өрнектер, кестелер немесе графиктер арқылы сипаттау.",
    letter: "М"
  },
  {
    term: "Натурал сандар",
    definition: "1, 2, 3, 4, ... сияқты санау үшін қолданылатын сандар.",
    letter: "Н"
  },
  {
    term: "Ң әрпі",
    definition: "Ң әрпі қазақ тілінің маңызды дыбысы. Математика терминдерінде сирек кездессе де, мысалдар мен мәтін есептерде жиі қолданылады.",
    letter: "Ң"
  },
  {
    term: "Ондық бөлшек",
    definition: "Бөлшек бөлігінде үтірден кейін цифрлар жазылатын сан: 0,5; 2,34; 10,07 сияқты.",
    letter: "О"
  },
  {
    term: "Өрнек",
    definition: "Сандар, әріптер және амал таңбаларынан құралған жазу: 5 + 3, 7 · a − 2 сияқты.",
    letter: "Ө"
  },
  {
    term: "Процент",
    definition: "Жүзден бір бөлік дегенді білдіреді. 25% = 25/100 = 0,25.",
    letter: "П"
  },
  {
    term: "Периметр",
    definition: "Жазық фигураның барлық қабырғаларының қосындысы. Мысалы, тіктөртбұрыштың периметрі 2(a + b).",
    letter: "П"
  },
  {
    term: "Радиус",
    definition: "Шеңбердің центрін шеңбер бойындағы кез келген нүктемен қосатын кесінді.",
    letter: "Р"
  },
  {
    term: "Сан осі",
    definition: "Сандарды ретімен орналастыру үшін қолданылатын түзу. Әр нүкте бір санға сәйкес келеді.",
    letter: "С"
  },
  {
    term: "Симметрия",
    definition: "Фигураның екі бөлігі бір-біріне беттесетіндей орналасуы. Айнадан қарағандай бірдей көрінеді.",
    letter: "С"
  },
  {
    term: "Түзу",
    definition: "Екі жаққа да шексіз созылатын сызық.",
    letter: "Т"
  },
  {
    term: "Уақыт",
    definition: "Секунд, минут, сағат, тәулік сияқты өлшемдері бар шама.",
    letter: "У"
  },
  {
    term: "Ұзындық",
    definition: "Заттың қаншалықты ұзын екенін көрсететін шама. Сантиметр, метр, километрмен өлшенеді.",
    letter: "Ұ"
  },
  {
    term: "Үлгі есеп",
    definition: "Басқа есептерді шығару үшін үлгі ретінде берілетін, толық шешімі көрсетілген есеп.",
    letter: "Ү"
  },
  {
    term: "Фигура",
    definition: "Кез келген геометриялық пішін: нүкте, кесінді, үшбұрыш, тіктөртбұрыш, шеңбер және т.б.",
    letter: "Ф"
  },
  {
    term: "Х координатасы",
    definition: "Координаталық жазықтықта нүктенің көлденең (горизонталь) координатасы.",
    letter: "Х"
  },
  {
    term: "Һ әрпі",
    definition: "Һ әрпі қазақ әліпбиінің дыбысы. Математика терминдерінде сирек қолданылады, көбіне басқа ғылым салаларында кездеседі.",
    letter: "Һ"
  },
  {
    term: "Центр",
    definition: "Шеңбердің немесе шардың барлық нүктелеріне бірдей қашықтықтағы нүкте.",
    letter: "Ц"
  },
  {
    term: "Четверть (төрттен бір)",
    definition: "Бүтіннің 1/4 бөлігі. Мысалы, торттың төрттен бір бөлігі – бір четверть.",
    letter: "Ч"
  },
  {
    term: "Шеңбер",
    definition: "Центрден бірдей қашықтықта орналасқан нүктелер жиыны.",
    letter: "Ш"
  },
  {
    term: "Щ әрпі",
    definition: "Щ әрпі қазақша математикалық терминдерде сирек кездеседі, көбінесе орыс тіліндегі сөздер арқылы ғана қолданылады.",
    letter: "Щ"
  },
  {
    term: "Ықтималдық",
    definition: "Оқиғаның болу не болмау мүмкіндігін сипаттайтын шама. 0 мен 1 арасындағы сан.",
    letter: "Ы"
  },
  {
    term: "Іріктеу",
    definition: "Белгілі бір жиыннан элементтерді таңдап алу. Мысалы, қапшықтан бірнеше шар алу.",
    letter: "І"
  },
  {
    term: "Эквивалентті өрнектер",
    definition: "Мәндері барлық жағдайда бірдей болатын өрнектер. Олар бір-бірін алмастыра алады.",
    letter: "Э"
  },
  {
    term: "Юнит (бірлік)",
    definition: "Ойындарда және кейбір модельдерде бір объектіні немесе бірлікті сипаттау үшін қолданылатын сөз.",
    letter: "Ю"
  },
  {
    term: "Ядро (кең мағынада)",
    definition: "Жиындар теориясы мен алгебрада қолданылатын ұғым; мектеп курсында сирек, бірақ жоғары деңгейде кездеседі.",
    letter: "Я"
  }
];

function initGlossary() {
  const root = document.getElementById("glossary");
  if (!root) return;

  const lettersWrap = document.getElementById("glossary-letters");
  const cardsWrap   = document.getElementById("glossary-cards");

  const flashCard   = document.getElementById("glossary-flashcard");
  const flashFront  = document.getElementById("flashcard-front");
  const flashBack   = document.getElementById("flashcard-back");
  const btnPrev     = document.getElementById("flash-prev");
  const btnNext     = document.getElementById("flash-next");
  const btnRandom   = document.getElementById("flash-random");

  if (!lettersWrap || !cardsWrap) return;

  let currentLetter = null;
  let flashPool = [...GLOSSARY_TERMS];
  let flashIndex = 0;

  // --- создаём кнопки для всех букв алфавита ---
  GLOSSARY_LETTERS.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.className = "glossary-letter-btn";
    btn.dataset.letter = letter;

    btn.addEventListener("click", () => {
      currentLetter = letter;

      // активное состояние
      lettersWrap
        .querySelectorAll(".glossary-letter-btn")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filtered = getFilteredTerms();
      renderCards(filtered);
      setFlashPool(filtered);
    });

    lettersWrap.appendChild(btn);
  });

  // по умолчанию выбираем первую букву алфавита (А)
  currentLetter = GLOSSARY_LETTERS[0];
  const firstBtn = lettersWrap.querySelector(
    `.glossary-letter-btn[data-letter="${currentLetter}"]`
  );
  if (firstBtn) firstBtn.classList.add("active");

  function getFilteredTerms() {
    if (!currentLetter) return [...GLOSSARY_TERMS];
    return GLOSSARY_TERMS.filter(t => t.letter === currentLetter);
  }

  function renderCards(list) {
    cardsWrap.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("div");
      empty.textContent = "Бұл әріпке сәйкес терминдер әзірге қосылмады.";
      empty.style.fontSize = "13px";
      empty.style.color = "#6b7280";
      cardsWrap.appendChild(empty);
      return;
    }

    list.forEach(item => {
      const card = document.createElement("div");
      card.className = "glossary-card";
      card.dataset.letter = item.letter;

      const title = document.createElement("div");
      title.className = "glossary-card-title";
      title.textContent = item.term;

      const text = document.createElement("div");
      text.className = "glossary-card-text";
      text.textContent = item.definition;

      card.appendChild(title);
      card.appendChild(text);
      cardsWrap.appendChild(card);
    });
  }

  function setFlashPool(list) {
    if (list && list.length) {
      flashPool = [...list];
    } else {
      // если у буквы нет терминов – берём весь глоссарий
      flashPool = [...GLOSSARY_TERMS];
    }
    flashIndex = 0;
    updateFlashcard();
  }

  function updateFlashcard() {
    if (!flashFront || !flashBack) return;

    if (!flashPool.length) {
      flashFront.textContent = "Терминдер әлі қосылған жоқ.";
      flashBack.textContent = "";
      if (flashCard) flashCard.classList.remove("flipped");
      return;
    }

    const item = flashPool[flashIndex];
    flashFront.textContent = item.term;
    flashBack.textContent = item.definition;
    if (flashCard) flashCard.classList.remove("flipped");
  }

  // стартовое состояние
  const startList = getFilteredTerms();
  renderCards(startList);
  setFlashPool(startList);

  // переворот карточки
  if (flashCard) {
    flashCard.addEventListener("click", () => {
      flashCard.classList.toggle("flipped");
    });
  }

  function goPrev() {
    if (!flashPool.length) return;
    flashIndex = (flashIndex - 1 + flashPool.length) % flashPool.length;
    updateFlashcard();
  }

  function goNext() {
    if (!flashPool.length) return;
    flashIndex = (flashIndex + 1) % flashPool.length;
    updateFlashcard();
  }

  function goRandom() {
    if (!flashPool.length) return;
    if (flashPool.length === 1) {
      updateFlashcard();
      return;
    }
    let idx;
    do {
      idx = Math.floor(Math.random() * flashPool.length);
    } while (idx === flashIndex);
    flashIndex = idx;
    updateFlashcard();
  }

  if (btnPrev)   btnPrev.addEventListener("click", goPrev);
  if (btnNext)   btnNext.addEventListener("click", goNext);
  if (btnRandom) btnRandom.addEventListener("click", goRandom);
}

/* === МАТЕМАТИКАЛЫҚ ОЙЫН: қысқы процент ойыны === */
function initMathGame() {
  const section = document.getElementById("math-game");
  if (!section) return;

  const priceBeforeEl = document.getElementById("winter-price-before");
  const percentEl     = document.getElementById("winter-percent");
  const diffEl        = document.getElementById("winter-diff");
  const answerInput   = document.getElementById("winter-answer");
  const feedbackEl    = document.getElementById("winter-feedback");
  const speechEl      = document.getElementById("winter-speech");

  const scoreEl       = document.getElementById("winter-score");
  const progressFill  = document.getElementById("winter-progress-fill");
  const keypad        = document.getElementById("winter-keypad");
  const btnSkip       = document.getElementById("winter-skip");
  const btnCheck      = document.getElementById("winter-check");
  const soundBtn      = document.getElementById("winter-sound-toggle");

  if (!priceBeforeEl || !percentEl || !diffEl || !answerInput ||
      !feedbackEl || !scoreEl || !progressFill || !keypad || !btnSkip || !btnCheck) {
    return;
  }

  let currentAnswer = null;
  let currentType = "up"; // up – қымбаттау, down – арзандау
  let score = 0;
  let total = 0;
  let soundOn = true;

  function formatMoney(n) {
    const s = Math.round(n).toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function updateProgress() {
    scoreEl.textContent = String(score);
    const maxTasks = Math.max(5, total || 0);
    const pct = maxTasks ? Math.min(100, (score / maxTasks) * 100) : 0;
    progressFill.style.width = pct + "%";
  }

  function setSpeech(text) {
    if (!speechEl) return;
    speechEl.textContent = text;
  }

  function newTask() {
    const baseOptions = [400, 600, 800, 1000, 1200, 1500, 1800, 2000];
    const pOptions    = [5, 10, 15, 20, 25, 30, 40, 50];

    const base = randomFrom(baseOptions);
    const p    = randomFrom(pOptions);
    currentType = Math.random() < 0.5 ? "up" : "down";

    const diff = Math.round((base * p) / 100);
    let newPrice;

    if (currentType === "up") {
      newPrice = base + diff;
      setSpeech("Баға қымбаттады!");
    } else {
      newPrice = base - diff;
      setSpeech("Баға арзандады!");
    }

    priceBeforeEl.textContent = formatMoney(base);
    percentEl.textContent     = String(p);
    diffEl.textContent        = formatMoney(diff);
    currentAnswer             = newPrice;

    answerInput.value = "";
    feedbackEl.textContent = "";
    feedbackEl.classList.remove("ok", "err");
    answerInput.focus();
  }

  function checkAnswer() {
    const raw = answerInput.value.trim().replace(/\s+/g, "");
    feedbackEl.classList.remove("ok", "err");

    if (!raw) {
      feedbackEl.textContent = "Алдымен жауап енгізіңіз.";
      feedbackEl.classList.add("err");
      return;
    }

    const num = Number(raw);
    if (Number.isNaN(num)) {
      feedbackEl.textContent = "Жауап сан болуы керек.";
      feedbackEl.classList.add("err");
      return;
    }

    total += 1;

    if (num === currentAnswer) {
      score += 1;
      feedbackEl.textContent = "Дұрыс! ✨";
      feedbackEl.classList.add("ok");
      progressFill.classList.add("pulse");
      setTimeout(() => progressFill.classList.remove("pulse"), 300);
      setTimeout(newTask, 800);
    } else {
      feedbackEl.textContent =
        "Дұрыс емес.";
      feedbackEl.classList.add("err");
    }

    updateProgress();
  }

  // обработка клавиатуры на экране
  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn || !btn.dataset.key) return;

    const k = btn.dataset.key;
    if (k === "back") {
      answerInput.value = answerInput.value.slice(0, -1);
    } else {
      answerInput.value += k;
    }
    answerInput.focus();
  });

  // клавиатура компьютера
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
      // запрещаем буквы
      if (e.key.length === 1) e.preventDefault();
    }
  });

  btnCheck.addEventListener("click", checkAnswer);

  btnSkip.addEventListener("click", () => {
    setSpeech("Жаңа тапсырма!");
    newTask();
  });

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundOn = !soundOn;
      soundBtn.textContent = soundOn ? "🔊" : "🔈";
    });
  }

  // старт
  updateProgress();
  newTask();
}

/* === Эмоциялы теңдеулер ойыны === */

const EMOJI_PUZZLES = [
  {
    text: "🍎 + 🍎 = 14<br>🔷 + 🔷 = 10<br>🍎 + 🔷 = ?",
    answer: 12
  },
  {
    text: "⭐ + ⭐ + ⭐ = 18<br>⭐ + 🌙 = 10<br>🌙 + 🌞 = 8<br>⭐ + 🌙 + 🌞 = ?",
    answer: 12
  },
  {
    text: "🐶 + 🐶 = 10<br>🐱 + 🐶 = 12<br>🐱 + 🐱 = ?",
    answer: 14
  },
  {
    text: "🍰 + 🍰 + 🍰 = 15<br>🍰 + 🍫 = 11<br>🍫 + 🍫 = ?",
    answer: 12
  },
  {
    text: "⚡ + ⚡ = 12<br>⚡ + 🌧 = 9<br>🌧 + 🌧 = ?",
    answer: 6
  },
  {
    text: "🍋 + 🍋 + 🍊 = 12<br>🍊 + 🍊 + 🍋 = 9<br>🍋 + 🍊 = ?",
    answer: 7
  },
  {
    text: "🟢 + 🟢 + 🟢 = 18<br>🟢 + 🔵 = 15<br>🔵 + 🔵 = ?",
    answer: 18
  },
  {
    text: "🌸 + 🌸 = 16<br>🌸 + 🍀 = 12<br>🍀 + 🍀 = ?",
    answer: 8
  },
  {
    text: "🚗 + 🚗 + 🚕 = 17<br>🚕 + 🚕 = 10<br>🚗 + 🚕 = ?",
    answer: 11
  },
  {
    text: "👑 + 👑 + 💎 = 20<br>💎 + 💎 = 12<br>👑 + 💎 = ?",
    answer: 13
  },
  {
    text: "🍓 + 🍓 = 14<br>🍓 + 🍒 = 11<br>🍒 + 🍒 = ?",
    answer: 8
  },
  {
    text: "📚 + 📚 + ✏ = 13<br>📚 + ✏ = 8<br>✏ + ✏ = ?",
    answer: 6
  }
];

function initEmojiGame() {
  const puzzleEl   = document.getElementById("emoji-puzzle-text");
  const answerEl   = document.getElementById("emoji-answer");
  const feedbackEl = document.getElementById("emoji-feedback");
  const btnCheck   = document.getElementById("emoji-check");
  const btnPrev    = document.getElementById("emoji-prev");
  const btnNext    = document.getElementById("emoji-next");
  const indexEl    = document.getElementById("emoji-index");
  const totalEl    = document.getElementById("emoji-total");

  if (
    !puzzleEl || !answerEl || !feedbackEl ||
    !btnCheck || !btnPrev || !btnNext || !indexEl || !totalEl
  ) {
    return;
  }

  const total = EMOJI_PUZZLES.length;
  totalEl.textContent = String(total);

  let currentIndex = 0;

  function renderPuzzle() {
    const p = EMOJI_PUZZLES[currentIndex];
    puzzleEl.innerHTML = p.text;
    indexEl.textContent = String(currentIndex + 1);
    answerEl.value = "";
    feedbackEl.textContent = "";
    feedbackEl.classList.remove("ok", "err");
    answerEl.focus();
  }

  function checkAnswer() {
    const raw = answerEl.value.trim();
    feedbackEl.classList.remove("ok", "err");

    if (!raw) {
      feedbackEl.textContent = "Алдымен жауап енгізіңіз.";
      feedbackEl.classList.add("err");
      return;
    }

    const num = Number(raw.replace(",", "."));
    if (Number.isNaN(num)) {
      feedbackEl.textContent = "Жауап сан болуы керек.";
      feedbackEl.classList.add("err");
      return;
    }

    const correct = EMOJI_PUZZLES[currentIndex].answer;
    if (Math.round(num) === Math.round(correct)) {
      feedbackEl.textContent = "Дұрыс! 🎉";
      feedbackEl.classList.add("ok");
      setTimeout(() => {
        if (currentIndex < total - 1) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        renderPuzzle();
      }, 800);
    } else {
      feedbackEl.textContent = "Дұрыс емес.";
      feedbackEl.classList.add("err");
    }
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + total) % total;
    renderPuzzle();
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % total;
    renderPuzzle();
  }

  btnCheck.addEventListener("click", checkAnswer);
  btnPrev.addEventListener("click", goPrev);
  btnNext.addEventListener("click", goNext);

  answerEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
      if (e.key.length === 1) e.preventDefault();
    }
  });

  renderPuzzle();
}

/* === Жылдам есеп ойыны === */
function initQuickCalcGame() {
  const exprEl = document.getElementById("quick-expression");
  const ansEl  = document.getElementById("quick-answer");
  const fbEl   = document.getElementById("quick-feedback");
  const btn    = document.getElementById("quick-check");
  const scoreEl= document.getElementById("quick-score");
  if (!exprEl || !ansEl || !fbEl || !btn || !scoreEl) return;

  let currentAnswer = null;
  let score = 0;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function newTask() {
    const opIndex = randInt(0, 2);
    let a, b, op, res;

    if (opIndex === 0) {          // қосу
      a = randInt(10, 99);
      b = randInt(1, 50);
      op = "+";
      res = a + b;
    } else if (opIndex === 1) {   // азайту
      a = randInt(20, 99);
      b = randInt(1, 19);
      if (b > a) [a, b] = [b, a];
      op = "−";
      res = a - b;
    } else {                      // көбейту
      a = randInt(2, 9);
      b = randInt(2, 9);
      op = "×";
      res = a * b;
    }

    exprEl.textContent = `${a} ${op} ${b} = ?`;
    currentAnswer = res;
    ansEl.value = "";
    fbEl.textContent = "";
    fbEl.classList.remove("ok", "err");
    ansEl.focus();
  }

  function check() {
    const raw = ansEl.value.trim();
    fbEl.classList.remove("ok", "err");

    if (!raw) {
      fbEl.textContent = "Алдымен жауап енгізіңіз.";
      fbEl.classList.add("err");
      return;
    }
    const num = Number(raw);
    if (Number.isNaN(num)) {
      fbEl.textContent = "Жауап сан болуы керек.";
      fbEl.classList.add("err");
      return;
    }

    if (num === currentAnswer) {
      score += 1;
      scoreEl.textContent = String(score);
      fbEl.textContent = "Жарайсың! Дұрыс жауап. ✅";
      fbEl.classList.add("ok");
      setTimeout(newTask, 800);
    } else {
      fbEl.textContent = "Қате.";
      fbEl.classList.add("err");
    }
  }

  btn.addEventListener("click", check);
  ansEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      check();
    }
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
      if (e.key.length === 1) e.preventDefault();
    }
  });

  newTask();
}

/* === Дұрыс па, бұрыс па? === */
function initTfGame() {
  const qEl      = document.getElementById("tf-question");
  const fbEl     = document.getElementById("tf-feedback");
  const btnTrue  = document.getElementById("tf-true");
  const btnFalse = document.getElementById("tf-false");
  const scoreEl  = document.getElementById("tf-score");
  if (!qEl || !fbEl || !btnTrue || !btnFalse || !scoreEl) return;

  const tasks = [
    { text: "5 + 7 = 12", correct: true },
    { text: "9 − 4 = 6", correct: false },
    { text: "6 × 3 = 18", correct: true },
    { text: "25% от 200 – это 40", correct: false },
    { text: "1/2 = 0,5", correct: true },
    { text: "3 · 4 = 10", correct: false },
    { text: "8 · 5 = 40", correct: true },
    { text: "100% + 50% = 120%", correct: false },
    { text: "9² = 81", correct: true },
    { text: "24 : 6 = 3", correct: false },
  ];

  let index = 0;
  let score = 0;

  function render() {
    const t = tasks[index];
    qEl.textContent = t.text;
    fbEl.textContent = "";
    fbEl.classList.remove("ok", "err");
  }

  function answer(userTrue) {
    const t = tasks[index];
    const isCorrect = (userTrue === t.correct);
    fbEl.classList.remove("ok", "err");
    if (isCorrect) {
      score += 1;
      scoreEl.textContent = String(score);
      fbEl.textContent = "Дұрыс! 🎉";
      fbEl.classList.add("ok");
    } else {
      fbEl.textContent = t.correct ? "Бұл теңдік дұрыс." : "Бұл теңдік дұрыс емес.";
      fbEl.classList.add("err");
    }
    index = (index + 1) % tasks.length;
    setTimeout(render, 900);
  }

  btnTrue.addEventListener("click", () => answer(true));
  btnFalse.addEventListener("click", () => answer(false));

  render();
}

/* === Сандарды салыстыр === */
function initCompareGame() {
  const leftEl  = document.getElementById("cmp-left");
  const rightEl = document.getElementById("cmp-right");
  const signEl  = document.getElementById("cmp-sign");
  const fbEl    = document.getElementById("cmp-feedback");
  const btnLess = document.getElementById("cmp-less");
  const btnEq   = document.getElementById("cmp-equal");
  const btnGt   = document.getElementById("cmp-greater");
  const scoreEl = document.getElementById("cmp-score");
  if (!leftEl || !rightEl || !signEl || !fbEl || !btnLess || !btnEq || !btnGt || !scoreEl) return;

  let left = 0;
  let right = 0;
  let score = 0;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function newTask() {
    const type = Math.random();

    if (type < 0.7) {
      // бүтін сандар
      left = randInt(1, 999);
      right = randInt(1, 999);
    } else {
      // ондық бөлшектер
      left = Math.round((Math.random() * 100) * 10) / 10;
      right = Math.round((Math.random() * 100) * 10) / 10;
    }

    leftEl.textContent  = left.toString().replace(".", ",");
    rightEl.textContent = right.toString().replace(".", ",");
    signEl.textContent  = "?";
    fbEl.textContent = "";
    fbEl.classList.remove("ok", "err");
  }

  function check(userSign) {
    let real;
    if (left < right) real = "<";
    else if (left > right) real = ">";
    else real = "=";

    signEl.textContent = userSign;

    if (userSign === real) {
      score += 1;
      scoreEl.textContent = String(score);
      fbEl.textContent = "Дұрыс салыстырдың! ✅";
      fbEl.classList.add("ok");
} else {
  fbEl.textContent = "Қате. Тағы да байқап көр! ❌";
  fbEl.classList.add("err");
}


    setTimeout(newTask, 900);
  }

  btnLess.addEventListener("click", () => check("<"));
  btnEq.addEventListener("click", () => check("="));
  btnGt.addEventListener("click", () => check(">"));

  newTask();
}

/* === Ойындар және геймификация: уровень + жетістіктер === */
function initGamification() {
  const root = document.getElementById("games");
  if (!root) return;

  // маленький помощник: берём число из элемента
  function getScore(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const raw = el.textContent.replace(/[^\d\-]/g, "").trim();
    const n = parseInt(raw || "0", 10);
    return Number.isNaN(n) ? 0 : n;
  }

  // собираем очки из игр
  const winterScore = getScore("winter-score"); // қысқы ойын
  const quickScore  = getScore("quick-score");  // жылдам есеп
  const tfScore     = getScore("tf-score");     // дұрыс/бұрыс
  const cmpScore    = getScore("cmp-score");    // салыстыру

  const correctTotal = winterScore + quickScore + tfScore + cmpScore;
  const gamesPlayed  = 4; // төрт түрлі ойын бар

  // XP и уровень (простая система)
  const xpPerAnswer = 10;
  const totalXP = correctTotal * xpPerAnswer;

  let level = Math.floor(totalXP / 100) + 1;
  if (level > 10) level = 10;
  const xpInLevel = totalXP % 100;
  const xpMax = 100;

  // заполняем блок уровня
  const levelEl = document.getElementById("gf-level");
  const xpEl    = document.getElementById("gf-xp");
  const xpMaxEl = document.getElementById("gf-xp-max");
  const barEl   = document.getElementById("gf-level-bar-fill");

  const gamesEl   = document.getElementById("gf-games-played");
  const totalEl   = document.getElementById("gf-correct-total");
  const streakEl  = document.getElementById("gf-best-streak");

  if (levelEl) levelEl.textContent = String(level);
  if (xpEl) xpEl.textContent = String(Math.min(xpInLevel, xpMax));
  if (xpMaxEl) xpMaxEl.textContent = String(xpMax);

  if (barEl) {
    const pct = xpMax ? Math.min(100, (xpInLevel / xpMax) * 100) : 0;
    barEl.style.width = pct + "%";
  }

  if (gamesEl) gamesEl.textContent = String(gamesPlayed);
  if (totalEl) totalEl.textContent = String(correctTotal);
  if (streakEl) streakEl.textContent = "x" + (correctTotal > 0 ? Math.min(5, 1 + Math.floor(correctTotal / 20)) : 1);

  // статистика-карточки
  const statWinter = document.getElementById("gf-stat-winter");
  const statQuick  = document.getElementById("gf-stat-quick");
  const statTf     = document.getElementById("gf-stat-tf");
  const statCmp    = document.getElementById("gf-stat-cmp");

  if (statWinter) statWinter.textContent = String(winterScore);
  if (statQuick)  statQuick.textContent  = String(quickScore);
  if (statTf)     statTf.textContent     = String(tfScore);
  if (statCmp)    statCmp.textContent    = String(cmpScore);

  // Достижения
  const cards = root.querySelectorAll(".ach-card");
  cards.forEach(card => {
    const target = card.dataset.target;
    const goal = parseInt(card.dataset.goal || "10", 10) || 10;

    let value = 0;
    if (target === "winter") value = winterScore;
    else if (target === "quick") value = quickScore;
    else if (target === "tf") value = tfScore;
    else if (target === "cmp") value = cmpScore;
    else if (target === "combo") value = correctTotal;
    else if (target === "marathon") value = correctTotal;

    const pct = Math.max(0, Math.min(1, value / goal));

    const fill = card.querySelector(".ach-progress-fill");
    const label = card.querySelector(".ach-progress-value");

    if (fill) fill.style.width = (pct * 100) + "%";
    if (label) label.textContent = String(Math.min(value, goal));

    if (pct >= 1) {
      card.classList.add("ach-complete");
    }
  });
}

/* === Видеосабақтар және QR-плейлист: орбита видеолар === */
function initVideoPlaylist() {
  const section = document.getElementById("videos");
  if (!section) return;

  const iframe = document.getElementById("main-video-iframe");
  const titleEl = document.getElementById("main-video-title");
  const orbitButtons = section.querySelectorAll(".orbit-video");

  if (!iframe || !titleEl || !orbitButtons.length) return;

  function setThumb(btn, videoId) {
    // Если ты оставил VIDEO_ID_... как заглушку — картинку не ставим.
    if (!videoId || videoId.startsWith("VIDEO_ID_")) return;
    btn.style.backgroundImage =
      "url('https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg')";
  }

  function activateButton(btn) {
    const id = btn.dataset.videoId || "";
    const title = btn.dataset.title || "Видеосабақ";

    if (!id || id.startsWith("VIDEO_ID_")) {
      // пока не указали настоящий ID – ничего не делаем
      return;
    }

    orbitButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    iframe.src = "https://www.youtube.com/embed/" + id + "?rel=0";
    titleEl.textContent = title;
  }

  orbitButtons.forEach(btn => {
    const id = btn.dataset.videoId || "";
    setThumb(btn, id);

    btn.addEventListener("click", () => {
      activateButton(btn);
    });
  });

  // Можно автоматически активировать первую кнопку, если там уже реальный ID
  const first = orbitButtons[0];
  if (first && first.dataset.videoId && !first.dataset.videoId.startsWith("VIDEO_ID_")) {
    activateButton(first);
  }
}

/* =============================
   ПРАКТИКАЛЫҚ ЕСЕПТЕР — ТЕСТ ФОРМА
============================= */

const practiceData = [
  {
    topic: "1. Дүкендегі тауар",
    tasks: [
      { q: "Дүкенге 350 кг қант әкелінді. 125 кг сатылды. Қанша қалды?", a: "225" },
      { q: "600 сүт пакеті болды. 345 пакеті сатылды. Қанша қалды?", a: "255" },
      { q: "Базарда 480 кг картоп болды. 275 кг сатылды, кейін 50 кг қосылды. Қанша қалды?", a: "255" },
      { q: "120 кг қант сатылды. Дүкенде 200 кг қалды. Бастапқыда қанша қант болды?", a: "320" },
      { q: "Дүкенде 600 сүт пакеті болды. 345 сатылды, кейін 120 пакет жеткізілді. Қанша қалды?", a: "375" },
      { q: "Бір тауардың бағасы 350 теңге. 4 дана сатып алынды. Барлығы қанша теңге тұрады?", a: "1400" },
    ],
  },
  {
    topic: "2. Алаңды аралау / жүру",
    tasks: [
      { q: "Айдос сағат сайын 3 км жүгірді. Ол 4 сағат жаттықты. Қанша км жүрді?", a: "12" },
      { q: "Кәмел 2 км-ден 5 рет жүгірді. Қанша км жүрді?", a: "10" },
      { q: "Машина 60 км/сағ жылдамдықпен 3 сағат жүрді. Қанша км жүрді?", a: "180" },
      { q: "Кәмел 2 км-ден 5 рет жүгірді, кейін тағы 3 км жүрді. Барлығы қанша км?", a: "13" },
      { q: "Машина 80 км/сағ жылдамдықпен 2 сағат жүрді, кейін 50 км баяу жүрді. Барлығы қанша км?", a: "210" },
      { q: "Бала 15 минутта 900 м жүрді. 1 сағатта қанша метр жүре алады?", a: "3600" },
    ],
  },
  {
    topic: "3. Кітап оқу / дәптерлер",
    tasks: [
      { q: "Әлияның 120 бет кітабы бар. Ол күніне 25 беттен оқиды. Неше күнде бітеді?", a: "5" },
      { q: "Сыныпқа 480 дәптер әкелінді. 315 дәптер таратылды. Қанша қалды?", a: "165" },
      { q: "Кітапханада 9500 кітап бар. 2650 кітап қоймаға апарылды. Қанша қалды?", a: "6850" },
      { q: "Бір оқушы күніне 12 бет оқиды. 3 күнде қанша бет оқиды?", a: "36" },
      { q: "Мектепке 480 дәптер әкелінді. 315 таратылды, 120 жеткізілді. Қанша қалды?", a: "285" },
      { q: "Кітап 150 беттен тұрады. Әлия күніне 20 бет оқиды. 3 күнде қанша бет оқиды?", a: "60" },
    ],
  },
  {
    topic: "4. Мал / жеміс / қораптар",
    tasks: [
      { q: "Фермада 245 қой және 168 ешкі бар. Барлығы қанша мал бар?", a: "413" },
      { q: "Бір қорапта 18 алма бар. 25 қорап сатып алынды. Барлығы неше алма болды?", a: "450" },
      { q: "Бақта әр қатарға 12 гүл отырғызылды. 7 қатар бар. Барлығы қанша гүл?", a: "84" },
      { q: "Сыныпта 30 бала бар. Әр балаға 3 алма берілсе, неше алма керек?", a: "90" },
      { q: "Бақта әр қатарға 12 гүл отырғызылды. 7 қатар, кейін тағы 3 қатар қосылды. Барлығы?", a: "120" },
      { q: "450 алма сатып алынды. 25% сатылды. Қанша алма қалды?", a: "338" },
    ],
  },
  {
    topic: "5. Уақыт / жол",
    tasks: [
      { q: "Бір күні 24 сағат. 3 күнде неше сағат?", a: "72" },
      { q: "Бала 15 минутта 900 м жүрді. 1 сағатта қанша м?", a: "3600" },
      { q: "Екі ауылдың арасы 128 км. Бірі 85 км жүрді. Қанша қалды?", a: "43" },
      { q: "Бала 20 км жүрді, кейін 15 км жүгірді. Барлығы қанша км?", a: "35" },
      { q: "Машина 80 км/сағ жылдамдықпен 2 сағат жүрді, кейін 50 км баяу жүрді. Барлығы?", a: "210" },
      { q: "37 оқушы және 3 мұғалім бар. Автобус 40 адам сыйдырады. Тағы 5 оқушы қосылса, қанша автобус керек?", a: "2" },
    ],
  },
];

function renderPractice() {
  const container = document.getElementById("practice-container");
  container.innerHTML = "";

  practiceData.forEach((block) => {
    const section = document.createElement("div");
    section.className = "practice-topic";

    const h3 = document.createElement("h3");
    h3.textContent = block.topic;
    section.appendChild(h3);

    block.tasks.forEach((t, i) => {
      const card = document.createElement("div");
      card.className = "practice-task";

      const label = document.createElement("p");
      label.textContent = `${i + 1}. ${t.q}`;
      card.appendChild(label);

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Жауабыңды жаз...";
      card.appendChild(input);

      const btn = document.createElement("button");
      btn.textContent = "Тексеру";
      btn.onclick = () => {
        const val = input.value.trim();
        if (val === "") return alert("Алдымен жауапты енгіз!");
        if (val === t.a) {
          card.classList.add("correct");
          btn.textContent = "✅ Дұрыс!";
        } else {
          card.classList.add("wrong");
          btn.textContent = "❌ Қате";
        }
      };
      card.appendChild(btn);

      section.appendChild(card);
    });

    container.appendChild(section);
  });
}

/* === Геометрия бөлімі: 3D конструктор құрама дене === */
function initGeometryConstructor() {
  const root = document.getElementById("geo-builder");
  const canvas = document.getElementById("geo-builder-canvas");
  if (!root || !canvas) return;
  if (typeof THREE === "undefined") return;

  const sliderX = document.getElementById("gb-x");
  const sliderY = document.getElementById("gb-y");
  const sliderZ = document.getElementById("gb-z");

  const valX = document.getElementById("gb-x-val");
  const valY = document.getElementById("gb-y-val");
  const valZ = document.getElementById("gb-z-val");

  const sizeLabel = document.getElementById("gb-size-label");
  const countEl = document.getElementById("gb-count");

  // Three.js базовая сцена
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(6, 5, 7);
  camera.lookAt(0, 0, 0);

  // свет
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(6, 8, 5);
  scene.add(ambient);
  scene.add(dir);

  // подложка-плоскость
  const groundGeo = new THREE.PlaneGeometry(20, 20);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.25 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.2;
  ground.receiveShadow = true;
  scene.add(ground);

  renderer.shadowMap.enabled = true;
  dir.castShadow = true;

  let group = new THREE.Group();
  scene.add(group);

  function buildFigure() {
    const x = Number(sliderX.value);
    const y = Number(sliderY.value);
    const z = Number(sliderZ.value);

    // подписи возле слайдеров
    valX.textContent = x;
    valY.textContent = y;
    valZ.textContent = z;

    sizeLabel.textContent = `${x} × ${y} × ${z}`;
    countEl.textContent = x * y * z;

    // удалить старые кубики
    scene.remove(group);
    group.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
      }
    });
    group = new THREE.Group();

    const spacing = 1.1;
    const offsetX = -((x - 1) * spacing) / 2;
    const offsetY = -0.4;
    const offsetZ = -((z - 1) * spacing) / 2;

    for (let ix = 0; ix < x; ix++) {
      for (let iy = 0; iy < y; iy++) {
        for (let iz = 0; iz < z; iz++) {
          const geo = new THREE.BoxGeometry(1, 1, 1);
          const colorHue = 200 + ix * 12 + iy * 8 + iz * 6;
          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(`hsl(${colorHue}, 80%, 65%)`),
            roughness: 0.3,
            metalness: 0.25
          });
          const cube = new THREE.Mesh(geo, mat);
          cube.castShadow = true;
          cube.receiveShadow = true;
          cube.position.set(
            offsetX + ix * spacing,
            offsetY + iy * spacing,
            offsetZ + iz * spacing
          );
          group.add(cube);
        }
      }
    }

    scene.add(group);
  }

  function handleResize() {
    const w = canvas.clientWidth || 360;
    const h = canvas.clientHeight || 260;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", handleResize);

  function animate() {
    requestAnimationFrame(animate);
    if (group) {
      group.rotation.y += 0.01;
      group.rotation.x = 0.25 * Math.sin(Date.now() * 0.0003);
    }
    renderer.render(scene, camera);
  }

  // события слайдеров
  [sliderX, sliderY, sliderZ].forEach((s) =>
    s.addEventListener("input", buildFigure)
  );

  handleResize();
  buildFigure();
  animate();
}


document.addEventListener("DOMContentLoaded", renderPractice);


/* --- Вспомогательная функция для строковых ответов --- */
function normalizeAnswer(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "");
}
