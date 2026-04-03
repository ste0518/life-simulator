/**
 * 财富不足自动记入负债、收入优先抵债 —— 全局开关与文案。
 * 引擎在 adjustStat("money", …) 时读取；改数值/开关只动本文件即可。
 */
(function () {
  "use strict";

  window.LIFE_DEBT_FINANCE_CONFIG = {
    /** 总开关；为 false 时恢复「仅改财富、不自动拆借」的旧行为 */
    enabled: true,
    /** 支出超过手头现金时，差额记入负债 */
    autoBorrowOnShortfall: true,
    /** 正财富增加时先减少负债，剩余再进财富 */
    incomePaysDebtFirst: true,
    /** 商店与事件内 shop_purchase：现金不够也允许买，差额进负债 */
    allowShopPurchaseWhenBroke: true,
    /** 产生记账型负债时是否写一条历程（建议 true） */
    logOnShortfallBorrow: true,
    /** 收入用于还债时是否写历程 */
    logOnIncomeDebtPaydown: true,
    /** 随机选一条；{amount} 替换为数字 */
    shortfallBorrowMessages: [
      "手头的钱已经不够付清这笔开销，差额约 {amount} 只能先记在负债上，像一张迟早要面对的欠条。",
      "这次花费没能完全用现金顶住，有约 {amount} 变成了新的欠账，心里多了一根会提醒你的弦。",
      "钱包见底时，现实会替你记账：大约 {amount} 的开支滑进了负债栏。"
    ],
    incomeDebtPayMessages: [
      "这笔进账先拿去填了旧债，还完之前很难真正在存款里留下来。",
      "钱一到手就被负债吸走一截——旧账不还清，新的积蓄很难站稳。",
      "收入先进了还债的漏斗，能留在手里的只剩结清后的那一部分。"
    ],
    incomeSplitMessages: [
      "其中一部分拿去抵债，剩下的才终于算进自己的积蓄。",
      "你先还掉一部分欠款，余下的才落进财富余额。"
    ]
  };
})();
