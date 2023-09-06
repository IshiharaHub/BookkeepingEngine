/**
 * 共通処理をページ読み込み時に呼び出す
 * 先頭に追加していくので要素の頭にしたいものは後から呼び出す.
 */
window.onload = () => {
  createSidebar();
  createSideVarPageList();
  createNavbar();
  createFooter();
  createFooterPageList();
};

/**
 * 共通処理：ヘッダーを動的に生成する。
 */
const createNavbar = () => {
  // ヘッダーHTML
  const navbarHTML = `
        <!-- 画面上部のヘッダー -->
        <nav class="navbar fixed-top navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="BookkeepingEngine/src/">BookkeepingEngine</a>
            <!-- Toggler (ハンバーガーメニュー) -->
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#side-bar" aria-controls="#side-bar">
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>
    `;

  // bodyの先頭に挿入
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
};

/**
 * 共通処理：サイドバーを動的に生成する.
 */
const createSidebar = () => {
  // ヘッダーHTML
  const sideVerHTML = `
  <!-- サイドバー -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="side-bar" aria-labelledby="side-bar-label">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="side-bar-label">BookkeepingEngine</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div>
        <h5>ページ一覧</h5>
        <ul class="list-group list-group-flush" id="side-bar-page-list"></ul>
      </div>
      <!-- セパレーターを追加 -->
      <hr class="my-4" />
      <!-- フッターと同じ文言 -->
      <p class="text-muted">© 2023 Ishihara Hub. 「BookkeepingEngine」 - 簿記の計算を自動化する。</p>
    </div>
  </div>
`;

  // bodyの先頭に挿入
  document.body.insertAdjacentHTML('afterbegin', sideVerHTML);
};

/**
 * 共通処理：サイドバーのページ一覧を動的に生成する.
 */
const createSideVarPageList = () => {
  // ページ一覧の要素を取得
  const pageList = document.getElementById('side-bar-page-list');

  // ページのデータを元にリンクを生成し、フッターに追加
  pages.forEach((page) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    const icon = document.createElement('i');

    icon.classList.add('bi');
    icon.classList.add(page.icon);
    link.classList.add('side-bar-page-list-link');
    link.appendChild(icon);
    link.href = page.path;
    link.innerHTML += page.title;
    link.classList.add('text-body');
    listItem.classList.add('list-group-item');
    listItem.appendChild(link);
    pageList.appendChild(listItem);
  });
};

/**
 * 共通処理：フッターを動的に生成する.
 */
const createFooter = () => {
  // ヘッダーHTML
  const footerHTML = `
  <!-- フッター -->
  <footer class="bg-light mt-auto py-3 border-top">
    <div class="container">
      <div class="row">
        <!-- ページ一覧の部分 -->
        <div class="col-md-8">
          ページ一覧
          <ul class="list-unstyled p-1" id="footer-page-list"></ul>
        </div>

        <!-- コピーライトの部分 -->
        <div class="col-md-4 text-end">
          <p class="mb-0 text-muted">© 2023 Ishihara Hub. 「BookkeepingEngine」 - 簿記の計算を自動化する。</p>
        </div>
      </div>
    </div>
  </footer>
`;

  // bodyの末尾に挿入
  document.body.insertAdjacentHTML('beforeend', footerHTML);
};

/**
 * 共通処理：フッターのページ一覧を動的に生成する.
 */
const createFooterPageList = () => {
  // ページ一覧の要素を取得
  const pageList = document.getElementById('footer-page-list');

  // ページのデータを元にリンクを生成し、フッターに追加
  pages.forEach((page) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    link.href = page.path;
    link.innerText = page.title;
    link.classList.add('text-secondary');
    listItem.appendChild(link);
    listItem.classList.add('mb-1');
    pageList.appendChild(listItem);
  });
};

/**
 * ページ一覧の定数.
 * ページ一覧を表示する際はこ.htmlONから動的に組み立てる.
 *
 */
const pages = [
  {
    title: '総合原価計算',
    path: '/src/calculations/total-cost-calc.html',
    icon: 'bi-calculator',
  },
  {
    title: '減価償却計算',
    path: '/src/calculations/depreciation-calc.html',
    icon: 'bi-graph-down',
  },
  {
    title: '繰延税金計算',
    path: '/src/calculations/deferred-tax-calc.html',
    icon: 'bi-cash-coin',
  },
  {
    title: '利益分析（ブレークイーブン点計算）',
    path: '/src/calculations/break-even-calc.html',
    icon: 'bi-bar-chart',
  },
  {
    title: 'キャッシュフロー予測',
    path: '/src/calculations/cashflow-forecast.html',
    icon: 'bi-cash-stack',
  },
  {
    title: '在庫評価',
    path: '/src/calculations/inventory-valuation.html',
    icon: 'bi-box',
  },
];
