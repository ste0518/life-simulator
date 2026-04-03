(function () {
  "use strict";

  /**
   * 商店与送礼扩展数据（手动改这里即可）
   * - LIFE_SHOP_CONFIG：全局年龄、分类排序、阶段年龄对照（仅说明用）
   * - LIFE_SHOP_ITEMS_CATALOG：全部可购商品（shopMinAge / shopMaxAge 控制可见池）
   * - LIFE_GIFT_EFFECTS_CATALOG：礼物 id → 送礼规则（键名须与 grantInventory.itemId 一致）
   *
   * 可选门槛（写在单个商品上）：
   * - shopRequiresMinChildCount：子女数量 ≥
   * - shopRequiresFlags：须同时具备这些 flags
   * - shopRequiresAnyFlags：具备其中任意一个 flag
   */

  window.LIFE_SHOP_CONFIG = {
    minAge: 7,
    maxAge: 55,
    categoryOrder: ["学习", "娱乐", "服饰", "健康", "礼物", "家庭", "日常"],
    /** 仅作文档：改商品时请对照 */
    stageAgeGuide: {
      elementary: [7, 11],
      middle_school: [12, 15],
      high_school: [16, 18],
      college: [18, 24],
      career: [25, 55],
      family_parenting_note: "育儿向商品另加 shopRequiresMinChildCount: 1"
    }
  };

  window.LIFE_SHOP_ITEMS_CATALOG = [
    /* ========== 小学 7–11 ========== */
    {
      id: "kid_snack_corner",
      name: "校门口小零食一包",
      category: "娱乐",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 2,
      summary: "零钱能换来的即时快乐，别指望家长表扬。",
      effects: { stats: { happiness: 2, health: -1, discipline: -1 } },
      log: "辣味和甜味在舌尖炸开，你觉得自己短暂地富有一下。"
    },
    {
      id: "kid_pencil_case_cartoon",
      name: "卡通文具盒",
      category: "学习",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 4,
      summary: "把铅笔橡皮收整齐，心里也少一点丢三落四。",
      effects: { stats: { discipline: 2, intelligence: 1, happiness: 1 } },
      log: "你打开盒盖又合上，像给新学期按了一个小小的启动键。"
    },
    {
      id: "kid_notebook_pretty",
      name: "带闪粉的漂亮笔记本",
      category: "学习",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 3,
      summary: "字未必更好看，但至少愿意多写两行。",
      effects: { stats: { discipline: 1, happiness: 2, intelligence: 1 } },
      log: "你在封面摸了又摸，决定先把第一页留给自己最喜欢的科目。"
    },
    {
      id: "kid_comic_weekly",
      name: "连载漫画一本",
      category: "娱乐",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 5,
      summary: "躲在被窝里看完的那种。",
      effects: { stats: { happiness: 3, intelligence: -1, discipline: -1 } },
      log: "剧情把你拽走一小会儿，作业还在桌上等你，这是甜蜜的欠债。"
    },
    {
      id: "kid_blind_box_mini",
      name: "小盲盒扭蛋",
      category: "娱乐",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 4,
      summary: "拆开前的心跳比里面的小塑料值钱。",
      effects: { stats: { happiness: 2, stress: -1, money: -1 } },
      log: "你盯着隐藏款示意图看了很久，最后接受了自己抽到的那只。"
    },
    {
      id: "kid_hair_clip_set",
      name: "彩色发卡与小皮筋",
      category: "服饰",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 3,
      summary: "扎头发那天，照镜子会多停两秒。",
      effects: { stats: { happiness: 2, social: 1 } },
      log: "你把颜色配来配去，像在给自己挑一件看不见的外套。"
    },
    {
      id: "kid_trading_cards_pack",
      name: "一包闪卡 / 收藏卡",
      category: "娱乐",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 3,
      summary: "课间硬通货，输赢都很认真。",
      effects: { stats: { social: 2, happiness: 2, stress: -1 } },
      log: "你和同学围成一圈，空气里全是交换条件的窃窃私语。"
    },
    {
      id: "kid_jump_rope",
      name: "塑料跳绳",
      category: "健康",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 2,
      summary: "体育课和楼下空地都能用。",
      effects: { stats: { health: 2, discipline: 1, happiness: 1 } },
      log: "绳子甩起来有风声，你数着断点，也数着自己还能跳几下。"
    },
    {
      id: "gift_kid_snack_share",
      name: "独立包装小零食（可送人）",
      category: "礼物",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 2,
      summary: "分给同桌也不心疼的那种。",
      grantInventory: { itemId: "gift_kid_snack_share", count: 1 },
      effects: { stats: { happiness: 1, social: 1 } },
      log: "你把零食塞进书包侧袋，像藏了一小把能打开友谊的钥匙。"
    },
    {
      id: "gift_kid_mini_card",
      name: "手绘祝福小卡片（可送人）",
      category: "礼物",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 2,
      summary: "字丑也没关系，心意很具体。",
      grantInventory: { itemId: "gift_kid_mini_card", count: 1 },
      effects: { stats: { happiness: 1, mental: 1 } },
      log: "你在卡片角落画了一只歪歪扭扭的星星，觉得它比买来的烫金更真。"
    },
    {
      id: "gift_kid_sticker_sheet",
      name: "贴纸套装（可送人）",
      category: "礼物",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 3,
      summary: "对方课本文具盒立刻变吵。",
      grantInventory: { itemId: "gift_kid_sticker_sheet", count: 1 },
      effects: { stats: { happiness: 1 } },
      log: "贴纸在光下反光，你突然有点舍不得，但还是想送出去。"
    },
    {
      id: "gift_kid_plush_mini",
      name: "巴掌大的软绒玩偶（可送人）",
      category: "礼物",
      shopMinAge: 7,
      shopMaxAge: 11,
      price: 5,
      summary: "适合生日或「谢谢你借我橡皮」。",
      grantInventory: { itemId: "gift_kid_plush_mini", count: 1 },
      effects: { stats: { happiness: 1, stress: 1 } },
      log: "小玩偶软得没有脾气，你捏了捏它的耳朵，像在给勇气打气。"
    },

    /* ========== 初中 12–15 ========== */
    {
      id: "ms_stationery_fancy",
      name: "一整套「看起来很会学」的文具",
      category: "学习",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 6,
      summary: "笔迹未必变细，但桌面先像样了。",
      effects: { stats: { discipline: 2, intelligence: 2, happiness: 1 } },
      log: "你把笔按颜色排好，假装自己从此不再拖延。"
    },
    {
      id: "ms_drill_book_set",
      name: "习题册 + 解析小册",
      category: "学习",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 7,
      summary: "写不完会焦虑，写完会踏实一点。",
      effects: { stats: { intelligence: 3, stress: 2, discipline: 1 } },
      log: "你把书脊折出第一道痕，像给自己签了一份不太情愿的合同。"
    },
    {
      id: "ms_hand_cream_tube",
      name: "便利店护手霜",
      category: "健康",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 4,
      summary: "冬天裂口与抄写本一样烦人。",
      effects: { stats: { health: 1, happiness: 1, stress: -1 } },
      log: "香味很淡，你涂在指关节上，觉得自己也被照顾了一下。"
    },
    {
      id: "ms_earbuds_cheap",
      name: "路边店入耳式耳机",
      category: "娱乐",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 8,
      summary: "放学路上把自己关进一首歌里。",
      effects: { stats: { happiness: 2, mental: 2, discipline: -1 } },
      log: "线缠在书包带子上，你解了三分钟，仍然觉得值得。"
    },
    {
      id: "ms_desk_figure",
      name: "书桌小摆件",
      category: "娱乐",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 5,
      summary: "写作业抬头能看见的一点偏心。",
      effects: { stats: { happiness: 2, stress: -1 } },
      log: "它站得笔直，你却在旁边趴着刷题，形成一种温柔的讽刺。"
    },
    {
      id: "ms_milk_tea_cup",
      name: "校门口奶茶一杯",
      category: "娱乐",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 4,
      summary: "甜一点，好像卷子就没那么苦。",
      effects: { stats: { happiness: 2, social: 1, stress: -1, health: -1 } },
      log: "吸管戳下去那一下，你听见自己奖励自己的声音。"
    },
    {
      id: "ms_friendship_bracelet",
      name: "编织友谊手绳",
      category: "服饰",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 3,
      summary: "同款不同色，秘密协议。",
      effects: { stats: { social: 2, happiness: 2 } },
      log: "你把手绳系得很紧，怕它松，也怕关系松。"
    },
    {
      id: "gift_ms_keychain_pair",
      name: "成对钥匙扣（可送人）",
      category: "礼物",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 5,
      summary: "「你一个我一个」的朴素仪式。",
      grantInventory: { itemId: "gift_ms_keychain_pair", count: 1 },
      effects: { stats: { happiness: 1, social: 1 } },
      log: "金属扣碰撞的声音很轻，你却听得很重。"
    },
    {
      id: "gift_ms_stationery_giftbox",
      name: "文具礼盒（可送人）",
      category: "礼物",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 8,
      summary: "生日或考试前打气都合适。",
      grantInventory: { itemId: "gift_ms_stationery_giftbox", count: 1 },
      effects: { stats: { intelligence: 1, happiness: 1 } },
      log: "你把礼盒纸抚平，像把一句说不出口的「我在意你」折好。"
    },
    {
      id: "gift_ms_snack_bag_classmate",
      name: "一袋分享装零食（可送人）",
      category: "礼物",
      shopMinAge: 12,
      shopMaxAge: 15,
      price: 4,
      summary: "分给前后桌，气氛立刻软下来。",
      grantInventory: { itemId: "gift_ms_snack_bag_classmate", count: 1 },
      effects: { stats: { social: 1, happiness: 1 } },
      log: "塑料袋沙沙响，你突然觉得自己人缘也许没那么差。"
    },

    /* ========== 高中 16–18 ========== */
    {
      id: "hs_gaokao_review_pack",
      name: "厚得像砖的复习资料",
      category: "学习",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 9,
      summary: "翻完会累，不翻更慌。",
      effects: { stats: { intelligence: 4, stress: 3, discipline: 2 } },
      log: "你把目录折角，像在地图上给自己钉了一堆必须抵达的城。"
    },
    {
      id: "hs_energy_drink_pack",
      name: "提神饮料一组",
      category: "健康",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 4,
      summary: "熬夜的权宜之计，别当长期饭票。",
      effects: { stats: { intelligence: 1, stress: -2, health: -1, mental: -1 } },
      log: "气泡在喉咙里跳，你告诉自己今晚还能再撑一章。"
    },
    {
      id: "hs_thermal_mug_plain",
      name: "磨砂保温杯",
      category: "日常",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 7,
      summary: "自习室里的老伙计。",
      effects: { stats: { discipline: 2, health: 1, happiness: 1 } },
      log: "热水雾气糊了一下眼镜，你忽然觉得日子也没那么硬。"
    },
    {
      id: "hs_backpack_practical",
      name: "更耐造的大容量书包",
      category: "服饰",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 12,
      summary: "书多的时候，肩膀会感谢你。",
      effects: { stats: { discipline: 1, health: 1, stress: -1, money: -1 } },
      log: "拉链顺滑的那一刻，你对未来荒谬地多了一点信心。"
    },
    {
      id: "hs_skincare_basic",
      name: "基础洁面 + 保湿小样套装",
      category: "健康",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 8,
      summary: "镜子里的脸也会影响到心情。",
      effects: { stats: { happiness: 2, mental: 2, social: 1, money: -1 } },
      log: "你把步骤写在便签上贴在镜边，像在给自己立温柔规矩。"
    },
    {
      id: "hs_hoodie_clean",
      name: "干净利落的连帽卫衣",
      category: "服饰",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 14,
      summary: "走廊里擦肩而过时少一点自卑。",
      effects: { stats: { happiness: 2, social: 2, money: -1 } },
      log: "你把帽子戴上又摘下，最后决定让脸露出来。"
    },
    {
      id: "gift_hs_couple_keycaps",
      name: "成对手机挂饰（可送人）",
      category: "礼物",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 6,
      summary: "不说破也像在说「我们一对」。",
      grantInventory: { itemId: "gift_hs_couple_keycaps", count: 1 },
      effects: { stats: { happiness: 2, stress: 1 } },
      log: "你把两个小挂件并排放进口袋，心跳比它们更响。"
    },
    {
      id: "gift_hs_scarf_soft",
      name: "柔软围巾（可送人）",
      category: "礼物",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 11,
      summary: "冬天节日或生日都很稳。",
      grantInventory: { itemId: "gift_hs_scarf_soft", count: 1 },
      effects: { stats: { happiness: 1 } },
      log: "毛线蹭过下巴的触感让你想起某种可以依靠的距离。"
    },
    {
      id: "gift_hs_bestseller_book",
      name: "畅销小说 / 文集（可送人）",
      category: "礼物",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 10,
      summary: "对方爱看书时，比情话好接。",
      grantInventory: { itemId: "gift_hs_bestseller_book", count: 1 },
      effects: { stats: { intelligence: 1, happiness: 1 } },
      log: "你在扉页犹豫要不要写名字，最后只画了一个很小的记号。"
    },
    {
      id: "gift_hs_thermal_mug_pair",
      name: "成对简约保温杯（可送人）",
      category: "礼物",
      shopMinAge: 16,
      shopMaxAge: 18,
      price: 13,
      summary: "实用又不至于太沉重。",
      grantInventory: { itemId: "gift_hs_thermal_mug_pair", count: 1 },
      effects: { stats: { happiness: 1, stress: 1 } },
      log: "两只杯子在袋子里轻轻碰了一下，像提前练习并肩。"
    },

    /* ========== 大学 18–24（与高中末重叠一年，商品更偏生活与形象） ========== */
    {
      id: "uni_fast_fashion_outfit",
      name: "快时尚店换季打折装",
      category: "服饰",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 15,
      summary: "社团、面试、约会都能混一混。",
      effects: { stats: { social: 3, happiness: 2, money: -2 } },
      log: "吊牌剪掉的那一刻，你觉得自己暂时配得上更好的镜子。"
    },
    {
      id: "uni_perfume_travel",
      name: "小支装香水",
      category: "服饰",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 12,
      summary: "留香不长，但出门前的仪式感很足。",
      effects: { stats: { happiness: 2, social: 2, stress: -1, money: -1 } },
      log: "你在手腕点了一下，像给自己盖章：今天可以像样一点。"
    },
    {
      id: "uni_makeup_starter",
      name: "开架彩妆组合",
      category: "服饰",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 14,
      summary: "拍照、答辩、见重要的人。",
      effects: { stats: { social: 2, happiness: 2, career: 1, money: -1 } },
      log: "粉扑沾上脸的那一刻，你在练习一种对世界的礼貌。"
    },
    {
      id: "uni_tablet_keyboard",
      name: "平板键盘保护套",
      category: "学习",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 18,
      summary: "图书馆赶论文时像多了半台电脑。",
      effects: { stats: { intelligence: 2, discipline: 2, career: 1, money: -2 } },
      log: "敲击声在安静区显得放肆，你放慢速度，却停不下来。"
    },
    {
      id: "uni_dorm_organizer",
      name: "宿舍收纳箱 + 床头挂袋",
      category: "日常",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 10,
      summary: "六人间里抢回一点秩序。",
      effects: { stats: { discipline: 2, happiness: 2, stress: -2 } },
      log: "你把杂物塞进去，像把焦虑也暂时归档。"
    },
    {
      id: "uni_travel_neckpillow",
      name: "旅行颈枕 + 眼罩",
      category: "日常",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 8,
      summary: "硬座过夜时的救命稻草。",
      effects: { stats: { health: 2, stress: -2, happiness: 1 } },
      log: "你在颠簸里睡着，梦见自己准时到站。"
    },
    {
      id: "uni_date_movie_tickets",
      name: "两张电影票 + 爆米花套餐",
      category: "娱乐",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 11,
      summary: "黑暗里并肩坐，话少也不尴尬。",
      effects: { stats: { happiness: 3, social: 2, stress: -2, money: -1 } },
      log: "你把吸管递过去，碰了一下对方的，像碰了一下未来。"
    },
    {
      id: "gift_uni_flower_bouquet_small",
      name: "一小束鲜花（可送人）",
      category: "礼物",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 10,
      summary: "纪念日、道歉、或单纯的「想见你」。",
      grantInventory: { itemId: "gift_uni_flower_bouquet_small", count: 1 },
      effects: { stats: { happiness: 1, stress: 1 } },
      log: "花瓣边有点蔫，你反而觉得更真实。"
    },
    {
      id: "gift_uni_holiday_giftbox",
      name: "节日礼盒（巧克力 + 小酒）（可送人）",
      category: "礼物",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 16,
      summary: "比随口一句节日快乐更有重量。",
      grantInventory: { itemId: "gift_uni_holiday_giftbox", count: 1 },
      effects: { stats: { happiness: 1, stress: 1 } },
      log: "丝带打结时你手指发紧，怕太隆重，也怕太随便。"
    },
    {
      id: "gift_uni_perfume_mini",
      name: "品牌香水小样礼盒（可送人）",
      category: "礼物",
      shopMinAge: 18,
      shopMaxAge: 24,
      price: 14,
      summary: "气味比尺寸更会说话。",
      grantInventory: { itemId: "gift_uni_perfume_mini", count: 1 },
      effects: { stats: { happiness: 1 } },
      log: "你把盒子推过去，像推过去一段更成熟的自己。"
    },

    /* ========== 工作后 25–55 ========== */
    {
      id: "work_shirt_slacks_set",
      name: "通勤衬衫 + 西裤",
      category: "服饰",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 18,
      summary: "周一例会至少看起来可靠。",
      effects: { stats: { career: 3, social: 2, happiness: 1, money: -2 } },
      log: "你系好袖扣，像系住一层薄薄的盔甲。"
    },
    {
      id: "work_leather_shoes",
      name: "一双耐走的皮鞋",
      category: "服饰",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 22,
      summary: "地铁换乘时脚会知道值不值。",
      effects: { stats: { career: 2, health: -1, happiness: 1, money: -2 } },
      log: "鞋跟敲地的节奏，慢慢变成你生活的节拍器。"
    },
    {
      id: "work_tote_bag_leather",
      name: "能装电脑的托特包",
      category: "服饰",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 20,
      summary: "文件、伞、充电器，一起扛。",
      effects: { stats: { career: 2, discipline: 1, stress: -1, money: -2 } },
      log: "肩带压出一道浅痕，你把它当成成年人小小的勋章。"
    },
    {
      id: "work_watch_entry",
      name: "入门款腕表",
      category: "服饰",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 28,
      summary: "开会时抬腕看时间，比掏手机体面。",
      effects: { stats: { career: 3, social: 2, happiness: 2, stress: 1, money: -3 } },
      log: "指针走动很轻，你却听见责任变重的声音。"
    },
    {
      id: "work_skincare_serum_set",
      name: "专柜级护肤精华套装",
      category: "健康",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 24,
      summary: "熬夜脸也需要被认真对待。",
      effects: { stats: { health: 3, happiness: 2, mental: 2, money: -3 } },
      log: "你把步骤拍进皮肤，也像拍给自己一点耐心。"
    },
    {
      id: "work_gym_year",
      name: "健身房年卡",
      category: "健康",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 26,
      summary: "贵，但比体检红灯便宜。",
      effects: { stats: { health: 5, stress: -3, happiness: 2, money: -4 } },
      log: "合同签字时你苦笑：原来自律也能分期付款。"
    },
    {
      id: "work_treat_dinner_table",
      name: "请客吃饭（像样的一桌）",
      category: "娱乐",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 20,
      summary: "人情、感谢、或把话说开。",
      effects: { stats: { social: 4, career: 2, happiness: 2, stress: -2, money: -5 } },
      log: "转盘转了三圈，话题终于从客气滑到真诚。"
    },
    {
      id: "work_bedding_set",
      name: "四季被套 + 枕头升级",
      category: "家庭",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 17,
      summary: "睡得好，脾气会软一点。",
      effects: { stats: { health: 2, happiness: 3, stress: -3, familySupport: 1, money: -2 } },
      log: "你钻进被窝那一下，觉得世界终于肯对你轻一点。"
    },
    {
      id: "gift_work_tea_hamper",
      name: "茶叶礼盒（可送人）",
      category: "礼物",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 18,
      summary: "长辈、客户、领导都好递。",
      grantInventory: { itemId: "gift_work_tea_hamper", count: 1 },
      effects: { stats: { career: 1, stress: 1 } },
      log: "纸袋很挺，你提着它，像提着一句体面的问候。"
    },
    {
      id: "gift_work_brand_scarf",
      name: "品牌丝巾 / 羊绒围巾（可送人）",
      category: "礼物",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 26,
      summary: "正式场合拿得出手。",
      grantInventory: { itemId: "gift_work_brand_scarf", count: 1 },
      effects: { stats: { happiness: 1, stress: 2 } },
      log: "触手很软，你突然理解什么叫「礼物的分量」。"
    },
    {
      id: "gift_work_wine_box",
      name: "红酒礼盒（可送人）",
      category: "礼物",
      shopMinAge: 25,
      shopMaxAge: 55,
      price: 22,
      summary: "饭局前后都能当借口与台阶。",
      grantInventory: { itemId: "gift_work_wine_box", count: 1 },
      effects: { stats: { social: 1, stress: 1 } },
      log: "木盒扣上的声音很沉，像把关系也轻轻扣紧。"
    },

    /* ========== 育儿 / 家庭向（需已有子女） ========== */
    {
      id: "fam_diaper_bulk",
      name: "纸尿裤整箱补货",
      category: "家庭",
      shopMinAge: 24,
      shopMaxAge: 55,
      shopRequiresMinChildCount: 1,
      price: 14,
      summary: "半夜少跑一次便利店。",
      effects: { stats: { stress: -2, familySupport: 2, money: -2, happiness: 1 } },
      log: "你把箱子推进储藏间，像推进一段睡眠不足但踏实的岁月。"
    },
    {
      id: "fam_educational_blocks",
      name: "益智积木与安全涂料画具",
      category: "家庭",
      shopMinAge: 24,
      shopMaxAge: 55,
      shopRequiresMinChildCount: 1,
      price: 11,
      summary: "陪孩子蹲在地上，时间会变慢。",
      effects: { stats: { happiness: 3, familySupport: 3, stress: -1, discipline: -1, money: -1 } },
      log: "你们搭到一半塌了，笑声比成品更完整。"
    },
    {
      id: "fam_baby_food_maker",
      name: "辅食料理棒 + 分装盒",
      category: "家庭",
      shopMinAge: 24,
      shopMaxAge: 55,
      shopRequiresMinChildCount: 1,
      price: 13,
      summary: "厨房多一件，焦虑少一点。",
      effects: { stats: { health: 2, familySupport: 2, stress: -2, money: -2 } },
      log: "机器转起来像小型风暴，你却在风暴里找到秩序。"
    },
    {
      id: "fam_home_projector",
      name: "家用投影仪",
      category: "家庭",
      shopMinAge: 26,
      shopMaxAge: 55,
      shopRequiresMinChildCount: 1,
      price: 30,
      summary: "周五晚上把客厅变成电影院。",
      effects: { stats: { happiness: 4, familySupport: 3, stress: -3, money: -4 } },
      log: "幕布亮起时，你看见三个人的脸都被光照得很轻。"
    },
    {
      id: "gift_fam_partner_anniversary",
      name: "定制相册 + 手写扉页（可送人）",
      category: "礼物",
      shopMinAge: 24,
      shopMaxAge: 55,
      shopRequiresAnyFlags: ["milestone_confirmed_relationship", "relationship_confirmed"],
      price: 15,
      summary: "给伴侣的纪念日，比红包更像话。",
      grantInventory: { itemId: "gift_fam_partner_anniversary", count: 1 },
      effects: { stats: { happiness: 2, mental: 1, stress: 1 } },
      log: "你把照片按时间排好，像在排一条还能继续走下去的路。"
    },
    {
      id: "gift_fam_holiday_family",
      name: "家庭节日礼盒（可送人）",
      category: "礼物",
      shopMinAge: 24,
      shopMaxAge: 55,
      shopRequiresMinChildCount: 1,
      price: 16,
      summary: "给对方也给孩子，一点仪式感。",
      grantInventory: { itemId: "gift_fam_holiday_family", count: 1 },
      effects: { stats: { happiness: 2, familySupport: 1 } },
      log: "礼盒太大，你拆的时候像拆一整年的辛苦与值得。"
    },

    /* ========== 全阶段经典常驻（按年龄再切） ========== */
    {
      id: "daily_bento_upgrade",
      name: "好好吃一顿热便当",
      category: "日常",
      shopMinAge: 12,
      shopMaxAge: 55,
      price: 5,
      summary: "把自己从凑合里捞回来一小会儿。",
      effects: { stats: { happiness: 2, health: 1, stress: -1 } },
      log: "你用一顿像样一点的饭，把自己从凑合里捞回来一小会儿。"
    },
    {
      id: "study_desk_lamp",
      name: "护眼台灯",
      category: "学习",
      shopMinAge: 12,
      shopMaxAge: 55,
      price: 11,
      summary: "熬夜时眼睛和心情都少受一点罪。",
      effects: { stats: { discipline: 2, intelligence: 1, money: -1 } },
      log: "你把学习环境收拾得更像样，熬夜时眼睛和心情都少受一点罪。"
    },
    {
      id: "hoodie_basic",
      name: "基础款外套",
      category: "服饰",
      shopMinAge: 14,
      shopMaxAge: 55,
      price: 16,
      summary: "出门见人时少一分心虚。",
      effects: { stats: { happiness: 2, social: 1, money: -2 } },
      log: "新衣服不解决所有问题，但至少让你在出门见人时少一分心虚。"
    },
    {
      id: "gift_snack_hamper",
      name: "零食礼盒（可送人）",
      category: "礼物",
      shopMinAge: 14,
      shopMaxAge: 55,
      price: 9,
      summary: "甜咸都有，递给谁都不太突兀。",
      grantInventory: { itemId: "gift_snack_hamper", count: 1 },
      effects: { stats: { happiness: 1 } },
      log: "你买下一份可以递到别人手里的甜。"
    },
    {
      id: "gift_book_literature",
      name: "精装文集（可送人）",
      category: "礼物",
      shopMinAge: 15,
      shopMaxAge: 55,
      price: 15,
      summary: "对方爱字句时，像递出一小块灵魂。",
      grantInventory: { itemId: "gift_book_literature", count: 1 },
      effects: { stats: { intelligence: 1, happiness: 1 } },
      log: "你挑了一本像话的书，准备在某个时刻送出去。"
    },
    {
      id: "gift_necklace_modest",
      name: "小项链（可送人）",
      category: "礼物",
      shopMinAge: 17,
      shopMaxAge: 55,
      price: 22,
      summary: "分量不轻，关系太浅会烫手。",
      grantInventory: { itemId: "gift_necklace_modest", count: 1 },
      effects: { stats: { happiness: 1, stress: 1 } },
      log: "这件礼物不便宜，你清楚它自带分量。"
    },
    {
      id: "gym_month",
      name: "健身月卡",
      category: "健康",
      shopMinAge: 16,
      shopMaxAge: 55,
      price: 14,
      summary: "短期把身体重新登记进日程。",
      effects: { stats: { health: 4, stress: -2, money: -1 } },
      log: "你把身体重新登记进日程里，哪怕只是短期。"
    },
    {
      id: "game_night_ticket",
      name: "演出 / 游戏之夜门票",
      category: "娱乐",
      shopMinAge: 14,
      shopMaxAge: 55,
      price: 9,
      summary: "允许自己在热闹里浪费一晚。",
      effects: { stats: { happiness: 3, social: 2, stress: -1, money: -1 } },
      log: "你允许自己浪费一晚在热闹里，给情绪找个出口。"
    }
  ];

  window.LIFE_GIFT_EFFECTS_CATALOG = {
    gift_kid_snack_share: {
      label: "独立包装小零食",
      expensiveThreshold: 4,
      fitTraitTags: [],
      mismatchPenalty: { affection: 0, tension: 2 },
      goodBonus: { affection: 4, familiarity: 4, theirInterest: 2 },
      neutralBonus: { affection: 2, familiarity: 3 },
      expensiveEarlyPenalty: { affection: 1, tension: 5, trust: -1 }
    },
    gift_kid_mini_card: {
      label: "手绘祝福小卡片",
      expensiveThreshold: 3,
      fitTraitTags: ["细腻", "安静"],
      mismatchPenalty: { affection: 1, tension: 1 },
      goodBonus: { affection: 5, trust: 3, familiarity: 5 },
      neutralBonus: { affection: 3, familiarity: 4 },
      expensiveEarlyPenalty: { affection: 0, tension: 4 }
    },
    gift_kid_sticker_sheet: {
      label: "贴纸套装",
      expensiveThreshold: 4,
      fitTraitTags: [],
      mismatchPenalty: { affection: -1, tension: 2 },
      goodBonus: { affection: 3, familiarity: 5, theirInterest: 2 },
      neutralBonus: { affection: 2, familiarity: 3 },
      expensiveEarlyPenalty: { affection: 0, tension: 5 }
    },
    gift_kid_plush_mini: {
      label: "小绒玩偶",
      expensiveThreshold: 6,
      fitTraitTags: ["细腻", "安静"],
      mismatchPenalty: { affection: 0, tension: 3 },
      goodBonus: { affection: 5, trust: 2, familiarity: 4 },
      neutralBonus: { affection: 3, familiarity: 3 },
      expensiveEarlyPenalty: { affection: -1, tension: 7, trust: -2 }
    },
    gift_ms_keychain_pair: {
      label: "成对钥匙扣",
      expensiveThreshold: 7,
      fitTraitTags: [],
      mismatchPenalty: { affection: -2, tension: 6 },
      goodBonus: { affection: 5, familiarity: 5, theirInterest: 3 },
      neutralBonus: { affection: 3, familiarity: 4 },
      expensiveEarlyPenalty: { affection: -1, tension: 8 }
    },
    gift_ms_stationery_giftbox: {
      label: "文具礼盒",
      expensiveThreshold: 9,
      fitTraitTags: ["细腻", "安静", "阅读"],
      mismatchPenalty: { affection: 0, tension: 2 },
      goodBonus: { affection: 6, trust: 3, familiarity: 4 },
      neutralBonus: { affection: 3, familiarity: 4 },
      expensiveEarlyPenalty: { affection: 1, tension: 6 }
    },
    gift_ms_snack_bag_classmate: {
      label: "分享装零食",
      expensiveThreshold: 6,
      fitTraitTags: [],
      mismatchPenalty: { affection: 0, tension: 2 },
      goodBonus: { affection: 4, familiarity: 5, theirInterest: 2 },
      neutralBonus: { affection: 2, familiarity: 4 },
      expensiveEarlyPenalty: { affection: 1, tension: 5 }
    },
    gift_hs_couple_keycaps: {
      label: "成对手机挂饰",
      expensiveThreshold: 8,
      fitTraitTags: [],
      mismatchPenalty: { affection: -3, tension: 8 },
      goodBonus: { affection: 6, theirInterest: 5, ambiguity: 4 },
      neutralBonus: { affection: 3, familiarity: 3, tension: 2 },
      expensiveEarlyPenalty: { affection: -2, tension: 10 }
    },
    gift_hs_scarf_soft: {
      label: "柔软围巾",
      expensiveThreshold: 12,
      fitTraitTags: ["细腻", "安静"],
      mismatchPenalty: { affection: 0, tension: 3 },
      goodBonus: { affection: 7, trust: 4, commitment: 3 },
      neutralBonus: { affection: 4, familiarity: 4 },
      expensiveEarlyPenalty: { affection: 0, tension: 7, trust: -1 }
    },
    gift_hs_bestseller_book: {
      label: "畅销小说 / 文集",
      expensiveThreshold: 11,
      fitTraitTags: ["阅读", "安静", "细腻"],
      mismatchPenalty: { affection: 1, tension: 2 },
      goodBonus: { affection: 7, trust: 4, theirInterest: 4 },
      neutralBonus: { affection: 3, familiarity: 4 },
      expensiveEarlyPenalty: { affection: 2, tension: 5 }
    },
    gift_hs_thermal_mug_pair: {
      label: "成对保温杯",
      expensiveThreshold: 14,
      fitTraitTags: [],
      mismatchPenalty: { affection: -2, tension: 7 },
      goodBonus: { affection: 6, trust: 4, commitment: 4 },
      neutralBonus: { affection: 3, familiarity: 3 },
      expensiveEarlyPenalty: { affection: -1, tension: 9, trust: -2 }
    },
    gift_uni_flower_bouquet_small: {
      label: "一小束鲜花",
      expensiveThreshold: 12,
      fitTraitTags: ["浪漫", "外向"],
      mismatchPenalty: { affection: 0, tension: 3 },
      goodBonus: { affection: 8, theirInterest: 6, ambiguity: 3 },
      neutralBonus: { affection: 4, familiarity: 3 },
      expensiveEarlyPenalty: { affection: 1, tension: 6 }
    },
    gift_uni_holiday_giftbox: {
      label: "节日礼盒",
      expensiveThreshold: 16,
      fitTraitTags: [],
      mismatchPenalty: { affection: -1, tension: 4 },
      goodBonus: { affection: 7, trust: 5, commitment: 5 },
      neutralBonus: { affection: 4, familiarity: 4 },
      expensiveEarlyPenalty: { affection: -1, tension: 9, trust: -2 }
    },
    gift_uni_perfume_mini: {
      label: "香水小样礼盒",
      expensiveThreshold: 15,
      fitTraitTags: ["浪漫", "细腻"],
      mismatchPenalty: { affection: -2, tension: 6 },
      goodBonus: { affection: 8, theirInterest: 6, commitment: 3 },
      neutralBonus: { affection: 3, familiarity: 3 },
      expensiveEarlyPenalty: { affection: -2, tension: 10, trust: -3 }
    },
    gift_work_tea_hamper: {
      label: "茶叶礼盒",
      expensiveThreshold: 18,
      fitTraitTags: [],
      mismatchPenalty: { affection: 0, tension: 3 },
      goodBonus: { affection: 5, trust: 6, familiarity: 3 },
      neutralBonus: { affection: 3, familiarity: 3 },
      expensiveEarlyPenalty: { affection: 2, tension: 5 }
    },
    gift_work_brand_scarf: {
      label: "品牌丝巾 / 围巾",
      expensiveThreshold: 24,
      fitTraitTags: [],
      mismatchPenalty: { affection: -3, tension: 8 },
      goodBonus: { affection: 8, trust: 5, commitment: 5 },
      neutralBonus: { affection: 4, tension: 2 },
      expensiveEarlyPenalty: { affection: -2, tension: 11, trust: -3 }
    },
    gift_work_wine_box: {
      label: "红酒礼盒",
      expensiveThreshold: 22,
      fitTraitTags: [],
      mismatchPenalty: { affection: -2, tension: 7 },
      goodBonus: { affection: 6, trust: 5, familiarity: 2 },
      neutralBonus: { affection: 3, familiarity: 2 },
      expensiveEarlyPenalty: { affection: -2, tension: 10, trust: -2 }
    },
    gift_fam_partner_anniversary: {
      label: "定制纪念相册",
      expensiveThreshold: 16,
      fitTraitTags: ["细腻", "安静"],
      mismatchPenalty: { affection: 1, tension: 3 },
      goodBonus: { affection: 9, trust: 6, commitment: 8, familiarity: 4 },
      neutralBonus: { affection: 5, trust: 4, familiarity: 3 },
      expensiveEarlyPenalty: { affection: 0, tension: 6 }
    },
    gift_fam_holiday_family: {
      label: "家庭节日礼盒",
      expensiveThreshold: 16,
      fitTraitTags: [],
      mismatchPenalty: { affection: 0, tension: 2 },
      goodBonus: { affection: 6, trust: 5, commitment: 5, familiarity: 4 },
      neutralBonus: { affection: 4, familiarity: 3 },
      expensiveEarlyPenalty: { affection: 1, tension: 5 }
    }
  };
})();
