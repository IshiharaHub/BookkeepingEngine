//　201書くわ

/**
 * 生産データの計を更新
 *
 * 生産データの 月初仕掛品、当月投入 の入力が更新される度に 計 を更新する
 * 「月初仕掛品 ＋ 当月投入 ＝ 計」 となる
 *
 * @returns {void}
 */
const refreshTotalDisplay = () => {
  const initialWorkInProgress = document.getElementById('initial-work-in-progress'); // 月初仕掛品
  const currentMonthInput = document.getElementById('current-month-input'); // 当月投入
  const totalProduction = document.getElementById('total-production');

  // いずれかの値が空の場合は 計 を空に更新する
  if (initialWorkInProgress.value === '' || currentMonthInput.value === '') {
    totalProduction.value = '';
    return;
  }

  // いずれかの値が数値型以外の場合は 計 をからに更新する
  if (isNaN(initialWorkInProgress.value) || isNaN(currentMonthInput.value)) {
    totalProduction.value = '';
    return;
  }

  // 月初仕掛品 + 当月投入 を 計 に設定する
  totalProduction.value = parseInt(initialWorkInProgress.value) + parseInt(currentMonthInput.value);
  return;
};

/**
 * イベント登録処理.
 * 月初仕掛品、当月投入のいずれかの値が更新された場合に自動的に計の値を更新する.
 */
const refreshableTotalInputs = document.querySelectorAll('.refreshable-total-input');
refreshableTotalInputs.forEach((input) => {
  input.addEventListener('blur', refreshTotalDisplay);
});

/**
 * 表計算
 *
 * 製造原価データの表をリアルタイムに更新するために使用する
 * 製造原価データの入力が更新される度に表内の対応する項目を入力データに更新する
 * また、その際は計の部分を再計算すること
 *
 * @returns {void}
 */
const refreshTableDisplay = () => {
  // いずれのか値が 空 または 数値以外の場合は表の項目をすべてリセットする
  if (hasEmptySeizouGenkaDataInput() || hasNonNumericDataInput()) {
    resetTableDisplay();
    return;
  }

  const initialCcostMaterials = document.getElementById('initial-cost-materials').value; // 月初仕掛品原価の直接材料費
  const initialCostProcessing = document.getElementById('initial-cost-processing').value; // 月初仕掛品原価の加工費
  const currentMonthManufacturingExpenseMaterials = document.getElementById('current-month-manufacturing-expense-materials').value; // 当月製造費用の直接材料費
  const currentMonthManufacturingExpenseProcessing = document.getElementById('current-month-manufacturing-expense-processing').value; // 当月製造費用の加工費

  // 表の月初仕掛品原価
  document.getElementById('tbl-initial-cost-materials').textContent = formatCurrency(initialCcostMaterials); // 直接材料費
  document.getElementById('tbl-initial-cost-processing').textContent = formatCurrency(initialCostProcessing); // 加工費
  document.getElementById('tbl-initial-cost-materials-total').textContent = formatCurrency(
    sumFromString(initialCcostMaterials, initialCostProcessing)
  ); // 計

  // 表の当月製造費用
  // 直接材料費
  document.getElementById('tbl-current-month-manufacturing-expense-materials').textContent = formatCurrency(
    currentMonthManufacturingExpenseMaterials
  );
  // 加工費
  document.getElementById('tbl-current-month-manufacturing-expense-processing').textContent = formatCurrency(
    currentMonthManufacturingExpenseProcessing
  );
  // 計
  document.getElementById('tbl-current-month-manufacturing-expense-materials-total').textContent = formatCurrency(
    sumFromString(currentMonthManufacturingExpenseMaterials, currentMonthManufacturingExpenseProcessing)
  );

  // 直接材料費の計
  document.getElementById('tbl-direct-material-costs-total').textContent = formatCurrency(
    sumFromString(initialCcostMaterials, currentMonthManufacturingExpenseMaterials)
  );

  // 加工費の計
  document.getElementById('processing-cost-total').textContent = formatCurrency(
    sumFromString(initialCostProcessing, currentMonthManufacturingExpenseProcessing)
  );

  // 総計
  document.getElementById('all-total').textContent = formatCurrency(
    sumFromString(initialCcostMaterials, initialCostProcessing, currentMonthManufacturingExpenseMaterials, currentMonthManufacturingExpenseProcessing)
  );
};

/**
 * 合算.
 * 引数で渡された項目をすべて足し算して返却する.
 *
 * @param {...string[]} values - 加算対象の値
 * @returns {number} 計算結果
 */
const sumFromString = (...values) => {
  let total = 0;
  for (const value of values) {
    total += parseInt(value);
  }
  return total;
};

/**
 * 数値を円マークとカンマ区切りのフォーマットに変換します。
 *
 * @param {string} number - フォーマット対象の数値
 * @returns {string} カンマ区切りと円マークを含む文字列 (例: ¥1,000)
 */
function formatCurrency(number) {
  const formattedNumber = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(number);
  return formattedNumber;
}

/**
 * 製造原価データのいずれかのうち一つでも空が存在するか判定.
 * 製造原価データに何も入力されていない項目があると正しく計算できなくなるためここで判定している.
 *
 * @returns {boolean} - true:空の項目が存在する ／ false:すべての項目が入力済みである
 */
const hasEmptySeizouGenkaDataInput = () => {
  const inputs = document.querySelectorAll('.refreshable-table-input');
  for (const input of inputs) {
    if (input.value.trim() === '') return true;
  }
  return false;
};

/**
 * 製造原価データのいずれかのうち一つでも数値以外が存在するか判定.
 * 製造原価データに数値型以外の入力があると正しく計算できなくなるためここで判定している。
 *
 * @returns {boolean} - true:数値型以外が存在する ／ false:すべての項目が数値型である
 */
const hasNonNumericDataInput = () => {
  const inputs = document.querySelectorAll('.refreshable-table-input');
  for (const input of inputs) {
    if (isNaN(input.value)) return true;
  }
  return false;
};

/**
 * テーブルのリセット.
 * 画面に表示しているテーブルの表示内容をリセットする。
 * 画面の入力値が変更された場合などに呼び出す.
 *
 * @returns {void}
 */
const resetTableDisplay = () => {
  const tableItems = document.querySelectorAll('.table-item');
  tableItems.forEach((item) => {
    item.textContent = '';
  });
};

/**
 * イベント登録処理.
 * 製造原価データのいずれかの値が更新された場合に自動的に計の値を更新する
 */
const refreshableTableInputs = document.querySelectorAll('.refreshable-table-input');
refreshableTableInputs.forEach((input) => {
  input.addEventListener('blur', refreshTableDisplay);
});

/**
 * 計算開始
 *
 * 計算開始ボタンが押下された際に 平均法 または 先入先出法 を使った計算処理を行う。
 * 完成品総合原価、月末仕掛品原価、完成品単位原価を求める
 * 計算結果を画面上に表示する
 *
 * @returns {void}
 */
const calc = () => {
  // 計算結果の表示エリア初期化
  initializeResultArea();

  // 入力チェック
  if (isCalcInputInvalid()) return;

  // 計算方法（ 平均法 or 先入先出法 ）
  const calcType = getCalcType();

  // 計算結果
  let result = {};
  if (calcType) {
    // 平均法の場合
    result = calcAvarage();
  } else {
    // 先入先出法の場合
    // TODO：ひょうがが実装する
  }

  // この書き方もできる( nishioka はこの書き方が好き)
  // 計算結果
  // const result = calcType ? calcAvarage() : calcFifo();

  // 計算結果を画面に描画
  setCalcResult(result);

  // 計算結果の表示エリアを表示
  displayResultArea();
};

/**
 * 計算結果の初期化.
 * 再計算などを行った場合、前回の計算結果が残ってしまうためこの処理を呼び出す.
 *
 * @returns {void}
 */
const initializeResultArea = () => {
  document.getElementById('cost-of-goods-sold').value = ''; // 完成品総合原価
  document.getElementById('ending-work-in-progress-inventory').value = ''; // 月末仕掛品原価
  document.getElementById('cost-per-finished-good').value = ''; // 完成品総合原価
  return;
};

/**
 * 計算種別取得。
 * 画面上のチェックボックスから計算方法を特定する.
 *
 * @returns {boolean} - true:平均法 ／ false:先入先出法
 */
const getCalcType = () => {
  return document.getElementById('average').checked;
};

/**
 * 計算前の入力チェック.
 * 計算を行うための値がすべて正しい形式で入力されているか判定する.
 * また、エラーがあった項目はエラーメッセージを出力する.
 *
 * 1. すべての項目が入力されているかチェック
 * 2. すべての項目が数値型であるかチェック
 *
 * @returns {boolean} - true:エラー有り ／ false:エラー無し
 *
 */
const isCalcInputInvalid = () => {
  let result = false;
  // 未入力チェック
  if (isInputEmpty()) {
    result = true;
  }

  // 数値型チェック
  if (isNotNumeric()) {
    result = true;
  }

  return result;
};

/**
 * 計算前の入力チェック（未入力チェック）.
 *
 * @returns {boolean} - true:エラー有り ／ false:エラー無し
 */
const isInputEmpty = () => {
  let result = false;
  const inputs = document.querySelectorAll('.input-validate');
  let firstErrorElement = null;

  for (const input of inputs) {
    // 未入力チェック
    if (!input.value.trim()) {
      result = true;

      // エラー位置にスクロールするための変数
      if (!firstErrorElement) firstErrorElement = input;

      // エラーメッセージを出力
      // 前回のエラーメッセージを削除
      const feedback = input.parentNode.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.remove();
      }
      input.classList.add('is-invalid');
      const feedbackDiv = document.createElement('div');
      feedbackDiv.classList.add('invalid-feedback');
      feedbackDiv.textContent = 'この項目は必須です。';
      // inputの直後にエラーメッセージを追加
      input.parentNode.insertBefore(feedbackDiv, input.nextSibling);
    } else {
      input.classList.remove('is-invalid');

      // 既存のエラーメッセージを削除するためのロジック（エラーが解消された場合）
      const feedback = input.parentNode.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.remove();
      }
    }
  }

  // 最初のエラー項目の位置にスクロール
  if (firstErrorElement) {
    firstErrorElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  return result;
};

/**
 * 計算前の入力チェック（数値型チェック）.
 *
 * @returns {boolean} - true:エラー有り ／ false:エラー無し
 */
const isNotNumeric = () => {
  let result = false;
  let firstErrorElement = null;
  let blankElement = null;

  const inputs = document.querySelectorAll('.input-validate');
  for (const input of inputs) {
    // 未入力の場合は前段でエラーとなっているためチェックしない
    if (input.value.trim() === '') {
      blankElement = input;
      continue;
    }

    // 数値型チェック
    if (isNaN(input.value)) {
      result = true;

      // エラー位置にスクロールするための変数
      if (!blankElement && !firstErrorElement) firstErrorElement = input;

      // エラーメッセージを出力
      // 前回のエラーメッセージを削除
      const feedback = input.parentNode.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.remove();
      }
      input.classList.add('is-invalid');
      const feedbackDiv = document.createElement('div');
      feedbackDiv.classList.add('invalid-feedback');
      feedbackDiv.textContent = '数値を入力してください。';
      // inputの直後にエラーメッセージを追加
      input.parentNode.insertBefore(feedbackDiv, input.nextSibling);
    } else {
      input.classList.remove('is-invalid');

      // 既存のエラーメッセージを削除するためのロジック（エラーが解消された場合）
      const feedback = input.parentNode.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.remove();
      }
    }
  }

  // 最初のエラー項目の位置にスクロール
  // ただし、未入力エラーが存在する場合はスクロールしない
  if (firstErrorElement) {
    firstErrorElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
  return result;
};

/**
 * 総合原価計算（平均法）.
 * 平均法で以下の項目を算出する.
 *
 * 1. 完成品総合原価.
 * 2. 月末仕掛品原価.
 * 3. 完成品単位原価.
 *
 * @returns {JSON} - 計算結果を格納したJSON
 */
const calcAvarage = () => {
  const result = {
    costOfGoodsSold: '',
    endingWorkInProgressInventory: '',
    costPerFinishedGood: '',
  };

  // 直接材料費の合計
  const totalCostMaterials = calcTotalCostMaterials();

  // 加工費の合計
  const totalTotalCostProcessing = calcTotalCostProcessing();

  // 直接材料費/個 の算出
  const materialCostPerUnit = calcMaterialCostPerUnit(totalCostMaterials);

  // 加工費/個 の算出
  const processingCostPerUnit = calcProcessingCostPerUnit(totalTotalCostProcessing);

  // 完成品総合原価の算出
  result.costOfGoodsSold = calcAvarageCostOfGoodsSold(materialCostPerUnit, processingCostPerUnit);

  // 月末仕掛品原価の算出
  result.endingWorkInProgressInventory = calcAvarageEndingWorkInProgressInventory(materialCostPerUnit, processingCostPerUnit);

  // 完成品単位原価の算出
  result.costPerFinishedGood = calcAvarageCostPerFinishedGood(result.costOfGoodsSold);

  return result;
};

/**
 * 仕掛品(総数) の算出.
 * 月初仕掛品 + 当月投入.
 *
 * @returns {number} - 仕掛品(総数)
 */
const calcTotalWorkInProgress = () => {
  const initialWorkInProgress = document.getElementById('initial-work-in-progress').value;
  const currentMonthInput = document.getElementById('current-month-input').value;
  return sumFromString(initialWorkInProgress, currentMonthInput);
};

/**
 * 直接材料費の合計.
 * 月初仕掛品原価の直接材料費 + 当月製造費用の直接材料費.
 *
 * @returns {number} - 直接材料費の合計
 */
const calcTotalCostMaterials = () => {
  const initialCostMaterials = document.getElementById('initial-cost-materials').value;
  const currentMonthManufacturingExpenseMaterials = document.getElementById('current-month-manufacturing-expense-materials').value;

  return sumFromString(initialCostMaterials, currentMonthManufacturingExpenseMaterials);
};

/**
 * 加工費の合計.
 * 月初仕掛品原価の加工費 + 当月製造費用の加工費.
 *
 * @returns {number} - 加工費の合計
 */
const calcTotalCostProcessing = () => {
  const initialCostProcessing = document.getElementById('initial-cost-processing').value;
  const currentMonthManufacturingExpenseMaterials = document.getElementById('current-month-manufacturing-expense-processing').value;

  return sumFromString(initialCostProcessing, currentMonthManufacturingExpenseMaterials);
};

/**
 * 直接材料費/個 の算出.
 * 直接材料費の合計 / 仕掛品(総数).
 *
 * @param {number} totalCostMaterials - 直接材料費の合計
 * @returns {number} - 直接材料費/個
 */
const calcMaterialCostPerUnit = (totalCostMaterials) => {
  const initialWorkInProgress = document.getElementById('initial-work-in-progress').value; // 月初仕掛品
  const currentMonthInput = document.getElementById('current-month-input').value; // 当月投入

  // 仕掛品(総数) = 月初仕掛品 + 当月投入
  const totalWorkInProgress = sumFromString(initialWorkInProgress, currentMonthInput);

  return totalCostMaterials / totalWorkInProgress;
};

/**
 * 加工費/個 の算出.
 * 加工費の合計 / 完成品(総数).
 *
 * @param {number} totalTotalCostProcessing - 加工費の合計
 * @returns {number} - 加工費/個
 */
const calcProcessingCostPerUnit = (totalTotalCostProcessing) => {
  const finishedGoods = parseInt(document.getElementById('finished-goods').value); // 完成品
  const endWorkInProgress = parseInt(document.getElementById('end-work-in-progress').value); // 月末仕掛品
  const endWorkInProgressPercent = parseFloat(document.getElementById('end-work-in-progress-percent').value) / 100; // 月末仕掛品の加工進捗度

  // 完成品(総数) = 完成品 + (月末仕掛品 * 月末仕掛品の加工進捗度)
  const totalEndFinishedGoods = endWorkInProgress * endWorkInProgressPercent;
  const totalFinishedGoods = finishedGoods + totalEndFinishedGoods;

  return totalTotalCostProcessing / totalFinishedGoods;
};

/**
 * 完成品総合原価の算出（平均法）.
 * (直接材料費/個 * 完成品) + (加工費/個 * 完成品).
 *
 * @param {number} materialCostPerUnit - 直接材料費/個
 * @param {number} processingCostPerUnit - 加工費/個
 * @returns {number} - 完成品総合原価.
 */
const calcAvarageCostOfGoodsSold = (materialCostPerUnit, processingCostPerUnit) => {
  const finishedGoods = parseInt(document.getElementById('finished-goods').value); // 完成品
  const materialCostPer = materialCostPerUnit * finishedGoods;
  const processingCostPer = processingCostPerUnit * finishedGoods;
  return materialCostPer + processingCostPer;
};

/**
 * 月末仕掛品原価の算出（平均法）.
 * （直接材料費/個 * 月末仕掛品） + （加工費/個 * (月末仕掛品 * 月末仕掛品の加工進捗度））.
 * @param {number} materialCostPerUnit - 直接材料費/個
 * @param {number} processingCostPerUnit - 加工費/個
 * @returns {number} - 月末仕掛品原価.
 */
const calcAvarageEndingWorkInProgressInventory = (materialCostPerUnit, processingCostPerUnit) => {
  const endWorkInProgress = parseInt(document.getElementById('end-work-in-progress').value); // 月末仕掛品
  const endWorkInProgressPercent = parseFloat(document.getElementById('end-work-in-progress-percent').value) / 100; // 月末仕掛品の加工進捗度
  const materialCostPer = materialCostPerUnit * endWorkInProgress;
  const processingCostPer = processingCostPerUnit * (endWorkInProgress * endWorkInProgressPercent);
  return materialCostPer + processingCostPer;
};

/**
 * 完成品単位原価の算出（平均法）
 * 完成品総合原価 / 完成品 = 完成品単位原価
 * @param {number} costOfGoodsSold - 完成品総合原価
 * @returns {number} - 完成品単位原価.
 */
const calcAvarageCostPerFinishedGood = (costOfGoodsSold) => {
  const finishedGoods = parseInt(document.getElementById('finished-goods').value); // 完成品
  return costOfGoodsSold / finishedGoods;
};

/**
 * 総合原価計算（先入先出法 FIFO）
 */
const calcFifo = () => {
  // TODO:未実装
  alert('未実装');
};

/**
 * 計算結果の設定.
 * @param {JSON} calcResult - 計算結果が格納されたJSON（平均法、先入先出法どちらからも呼び出される）
 * @returns {void}
 */
const setCalcResult = (calcResult) => {
  document.getElementById('cost-of-goods-sold').value = formatCurrency(calcResult.costOfGoodsSold); // 完成品総合原価
  document.getElementById('ending-work-in-progress-inventory').value = formatCurrency(calcResult.endingWorkInProgressInventory); // 月末仕掛品原価
  document.getElementById('cost-per-finished-good').value = formatCurrency(calcResult.costPerFinishedGood); // 完成品単位原価

  return;
};

/**
 * 計算結果の表示.
 * 計算結果はデフォルトで非表示となっているため、計算が終わったタイミングで表示する.
 *
 * @returns {void}
 */
const displayResultArea = () => {
  const resultArea = document.getElementById('result-area');

  // すでに表示済み（2回目以降の計算）の場合は何もしない
  if (resultArea.style.display === 'block') return;

  resultArea.style.display = 'block';

  // アニメーションを確実に実行するための小さな遅延を追加
  setTimeout(() => {
    resultArea.style.opacity = '1';
  }, 10);

  isClicked = true;

  // アニメーション終了後、ページの一番下にスクロール
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 500); // 0.5秒後（transitionの時間と同じ）
};
