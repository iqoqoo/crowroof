window.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".grid-wrapper");
  const counterDisplay = document.getElementById("rowCount");

  const jumpInput = document.getElementById("globalJumpInput");
  const jumpBtn = document.getElementById("globalJumpBtn");

  let currentGlobalRow = 1;

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

  wrappers.forEach((wrapper) => {
    const img = wrapper.querySelector(".grid-image");

    img.addEventListener("load", () => {
      updateAllRows(currentGlobalRow);
    });

    if (img.complete) {
      img.dispatchEvent(new Event("load"));
    }
  });

  document.getElementById("nextRow").addEventListener("click", () => {
    updateAllRows(currentGlobalRow + 1);
  });

  document.getElementById("prevRow").addEventListener("click", () => {
    updateAllRows(currentGlobalRow - 1);
  });

  // 🔹 グローバル段数ジャンプボタン処理を追加
  jumpBtn.addEventListener("click", () => {
    const val = parseInt(jumpInput.value, 10);
    if (!isNaN(val) && val > 0) {
      updateAllRows(val);
    }
  });

  // 🔹 Enterキーでもジャンプできるように
  jumpInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      jumpBtn.click();
    }
  });

  // 🔸 個別のジャンプ処理（各グリッドごと）
  document.querySelectorAll(".grid-wrapper").forEach((wrapper) => {
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
});

document.querySelectorAll(".button-glow").forEach((button) => {
  const span = button.querySelector("span");

  button.addEventListener("click", () => {
    // 文字を光らせる
    span.classList.add("glow");
    setTimeout(() => span.classList.remove("glow"), 400);

    // 粒子の色バリエーション（夢かわカラー）
    const pastelColors = [
      "#ffbde3", // ピンク
      "#a2ffed", // ミント
      "#fce38a", // レモン
      "#d3bfff", // ラベンダー
      "#ffd3f8", // さくら
      "#bfffc9", // メロンソーダ
    ];
    // 粒子の色バリエーション（ホワイト）
    const whites = ["#ffffff"];
    const allColors = pastelColors.concat(whites);

    // spanの中心位置を基準にキラキラ生成
    const rect = span.getBoundingClientRect();
    const centerX = rect.left + rect.width / 1 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      const offsetX = 10; // 右に寄せる量
      const offsetY = 8; // 下に寄せる量
      const x = offsetX + (Math.random() - 0.5) * 60;
      const y = offsetY + (Math.random() - 0.5) * 60;

      sparkle.style.setProperty("--x", `${x}px`);
      sparkle.style.setProperty("--y", `${y}px`);

      sparkle.style.setProperty("--x", `${x}px`);
      sparkle.style.setProperty("--y", `${y}px`);
      const color = allColors[Math.floor(Math.random() * allColors.length)];
      sparkle.style.setProperty("--sparkle-color", color);

      // 🌟 色に応じてサイズを変える
      if (color === "#ffffff") {
        sparkle.style.width = "10px";
        sparkle.style.height = "10px";
      } else {
        sparkle.style.width = "20px";
        sparkle.style.height = "20px";
      }

      sparkle.style.left = `${centerX}px`;
      sparkle.style.top = `${centerY}px`;

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  });
});
