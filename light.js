window.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".grid-wrapper");
  const counterDisplay = document.getElementById("rowCount");
  const jumpInput = document.getElementById("globalJumpInput");
  const jumpBtn = document.getElementById("globalJumpBtn");

  let currentGlobalRow = 1;

  const rowPixelHeight = 40; // ← ここで調整

// div要素でもOK！
const saveBtn = document.getElementById("save");
const loadBtn = document.getElementById("load");

saveBtn.addEventListener("click", () => {
  const saveData = {};

  wrappers.forEach((wrapper) => {
    const id = wrapper.id || wrapper.dataset.id || wrapper.querySelector(".grid-image")?.src || "";
    const currentRow = parseInt(wrapper.dataset.currentRow || "1", 10);
    if (id) {
      saveData[id] = currentRow;
    }
  });

  localStorage.setItem("highlightSave", JSON.stringify(saveData));
  alert("保存しました！");
});

loadBtn.addEventListener("click", () => {
  const saved = localStorage.getItem("highlightSave");
  if (!saved) {
    alert("保存データがありません");
    return;
  }

  const saveData = JSON.parse(saved);
  wrappers.forEach((wrapper) => {
    const id = wrapper.id || wrapper.dataset.id || wrapper.querySelector(".grid-image")?.src || "";
    const totalRows = parseInt(wrapper.dataset.rows, 10);
    const img = wrapper.querySelector(".grid-image");
    const overlay = wrapper.querySelector(".highlight-overlay");

    if (id in saveData) {
      const row = saveData[id];
      wrapper.dataset.currentRow = row;

      const rowHeight = img.clientHeight / totalRows;
      overlay.style.height = `${rowHeight}px`;
      overlay.style.top = `${(totalRows - row) * rowHeight}px`;
    }
  });

  alert("読み込みました！");
});



wrappers.forEach((wrapper) => {
  const rows = parseInt(wrapper.dataset.rows, 10);
  const img = wrapper.querySelector(".grid-image");
  const overlay = wrapper.querySelector(".highlight-overlay");

  // 高さは rows × rowPixelHeight に揃える
  const targetHeight = rows * rowPixelHeight;
  img.style.height = `${targetHeight}px`;
  img.style.width = "auto"; // 縦横比を維持（オプション）

  // ハイライトが初期表示されるように
  const currentRow = parseInt(wrapper.dataset.currentRow || 1, 10);
  const rowHeight = rowPixelHeight;
  overlay.style.height = `${rowHeight}px`;
  overlay.style.top = `${(rows - currentRow) * rowHeight}px`;
});


  function updateAllRows(globalRow) {
    wrappers.forEach((wrapper) => {
      const totalRows = parseInt(wrapper.dataset.rows, 10);
      const img = wrapper.querySelector(".grid-image");
      const overlay = wrapper.querySelector(".highlight-overlay");

      const adjustedRow = ((globalRow - 1) % totalRows) + 1;
      wrapper.dataset.currentRow = adjustedRow;

      const rowHeight = img.clientHeight / totalRows;
      overlay.style.height = `${rowHeight}px`;
      overlay.style.top = `${(totalRows - adjustedRow) * rowHeight}px`;
    });

    currentGlobalRow = globalRow;
    counterDisplay.textContent = currentGlobalRow;
  }

  // 画像が読み込み済み or 読み込み時にハイライト初期化
  wrappers.forEach((wrapper) => {
    const img = wrapper.querySelector(".grid-image");
    img.addEventListener("load", () => {
      updateAllRows(currentGlobalRow);
    });
    if (img.complete) {
      img.dispatchEvent(new Event("load"));
    }
  });

  // グローバル前後移動
  document.getElementById("nextRow").addEventListener("click", () => {
    updateAllRows(currentGlobalRow + 1);
  });

  document.getElementById("prevRow").addEventListener("click", () => {
    updateAllRows(currentGlobalRow - 1);
  });

  // グローバルジャンプ
  jumpBtn.addEventListener("click", () => {
    const val = parseInt(jumpInput.value, 10);
    if (!isNaN(val) && val > 0) {
      updateAllRows(val);
    }
  });

  jumpInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      jumpBtn.click();
    }
  });

  // 個別ジャンプ
  wrappers.forEach((wrapper) => {
    const jumpBtn = wrapper.querySelector(".jump-btn");
    const input = wrapper.querySelector(".jump-input");
    const img = wrapper.querySelector(".grid-image");
    const overlay = wrapper.querySelector(".highlight-overlay");
    const totalRows = parseInt(wrapper.dataset.rows, 10);

    jumpBtn.addEventListener("click", () => {
      let targetRow = parseInt(input.value, 10);
      if (isNaN(targetRow) || targetRow < 1 || targetRow > totalRows) return;

      wrapper.dataset.currentRow = targetRow;
      const rowHeight = img.clientHeight / totalRows;
      overlay.style.height = `${rowHeight}px`;
      overlay.style.top = `${(totalRows - targetRow) * rowHeight}px`;
    });
  });

  // キラキラ演出
  document.querySelectorAll(".button-glow").forEach((button) => {
    const span = button.querySelector("span");

    button.addEventListener("click", () => {
      span.classList.add("glow");
      setTimeout(() => span.classList.remove("glow"), 400);

      const pastelColors = [
        "#ffbde3", "#a2ffed", "#fce38a",
        "#d3bfff", "#ffd3f8", "#bfffc9"
      ];
      const whites = ["#ffffff"];
      const allColors = pastelColors.concat(whites);

      const rect = span.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 + window.scrollX;
      const centerY = rect.top + rect.height / 2 + window.scrollY;

      for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";

        const offsetX = 10;
        const offsetY = 8;
        const x = offsetX + (Math.random() - 0.5) * 60;
        const y = offsetY + (Math.random() - 0.5) * 60;

        sparkle.style.setProperty("--x", `${x}px`);
        sparkle.style.setProperty("--y", `${y}px`);

        const color = allColors[Math.floor(Math.random() * allColors.length)];
        sparkle.style.setProperty("--sparkle-color", color);

        sparkle.style.width = color === "#ffffff" ? "10px" : "25px";
        sparkle.style.height = sparkle.style.width;

        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
      }
    });
  });
});
