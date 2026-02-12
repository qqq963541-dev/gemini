import { PoetProfile, PoetId, Checkpoint } from "./types";

export const CHECKPOINT_DESCRIPTIONS: Record<number, string> = {
  [Checkpoint.Intro]: "Arrival at the Ink Gate",
  [Checkpoint.Background]: "Diving into History",
  [Checkpoint.Style]: "Mastering the Brush",
  [Checkpoint.Personal]: "Soulful Connection",
  [Checkpoint.Complete]: "Interview Masterpiece"
};

export const POET_PROFILES: Record<PoetId, PoetProfile> = {
  libai: {
    id: 'libai',
    nameCN: '李白',
    nameEN: 'Li Bai',
    title: '诗仙 (Immortal Poet)',
    dynasty: '唐朝 (Tang Dynasty)',
    region: 'East',
    tags: ['Romanticism', 'Wine', 'Moon'],
    representativePoem: '举杯邀明月，对影成三人。',
    bio: 'Li Bai was a genius poet of the High Tang era, known for his wild imagination and love for freedom.',
    themeColor: '#8c2a2a',
    secondaryColor: '#d4af37',
    bgImage: 'https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?auto=format&fit=crop&q=80&w=2000', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/f2deb48f8c5494eef01f7c7518a3f7fe9925bc31d01b?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080',
    fontClass: "font-calligraphy",
    styleDescription: "Romantic and Unrestricted",
    vocabulary: [
      { word: "moon", category: 'nature', pos: "n.", meaningCN: "月亮", usage: "Looking at the bright moon.", expansion: "lunar (adj.)" },
      { word: "wine", category: 'object', pos: "n.", meaningCN: "美酒", usage: "Invite the moon with wine.", expansion: "vineyard (n.)" },
      { word: "sword", category: 'object', pos: "n.", meaningCN: "宝剑", usage: "A poet with a sword.", expansion: "swordsman (n.)" },
      { word: "wander", category: 'action', pos: "v.", meaningCN: "漫游", usage: "I love to wander freely.", expansion: "wanderer (n.)" },
      { word: "immortal", category: 'concept', pos: "adj.", meaningCN: "不朽的", usage: "The immortal poet.", expansion: "immortality (n.)" },
      { word: "mountain", category: 'nature', pos: "n.", meaningCN: "山川", usage: "Climbing high mountains.", expansion: "mountainous (adj.)" }
    ],
    sentencePatterns: [
      // 基础 (Elementary)
      { level: 'Elementary', structure: "Do you like...?", example: "Do you like the moon?", template: "Do you like ______?", usage: "询问喜好", grammarTip: "like后接名词或动名词" },
      { level: 'Elementary', structure: "What is your favorite...?", example: "What is your favorite wine?", template: "What is your favorite ______?", usage: "询问最爱", grammarTip: "favorite后接名词" },
      { level: 'Elementary', structure: "Can you see...?", example: "Can you see the moon tonight?", template: "Can you see ______?", usage: "询问所见", grammarTip: "Can you后接动词原形" },
      // 进阶 (Junior)
      { level: 'Junior', structure: "Why do you love...?", example: "Why do you love the moon so much?", template: "Why do you love ______?", usage: "询问原因", grammarTip: "Why do you + 动词原形" },
      { level: 'Junior', structure: "Have you ever...?", example: "Have you ever drunk wine under the moon?", template: "Have you ever ______?", usage: "询问经历", grammarTip: "Have you ever + 过去分词" },
      { level: 'Junior', structure: "What if we...?", example: "What if we travel to the stars?", template: "What if we ______?", usage: "假设提议", grammarTip: "What if + 主语 + 动词" },
      // 深度 (Senior)
      { level: 'Senior', structure: "If you could fly to..., what would you do?", example: "If you could fly to the moon, what would you do?", template: "If you could fly to ______, what would you do?", usage: "虚拟想象", grammarTip: "If + could, would" },
      { level: 'Senior', structure: "How does... make you feel free?", example: "How does wandering make you feel free?", template: "How does ______ make you feel free?", usage: "探讨自由", grammarTip: "How does + 主语 + 动词" },
      { level: 'Senior', structure: "What is the meaning of... to you?", example: "What is the meaning of immortality to you?", template: "What is the meaning of ______ to you?", usage: "哲学探讨", grammarTip: "the meaning of + 名词" }
    ],
    systemPrompt: `You are Li Bai. Tone: Bold, unrestricted, romantic. Respond to students with wit.`,
    translationPrompt: "Translate in a 'Romantic & Unrestricted' (浪漫洒脱) style."
  },
  dufu: {
    id: 'dufu',
    nameCN: '杜甫',
    nameEN: 'Du Fu',
    title: '诗圣 (Poet Sage)',
    dynasty: '唐朝 (Tang Dynasty)',
    region: 'East',
    tags: ['Realism', 'Compassion', 'History'],
    representativePoem: '国破山河在，城春草木深。',
    bio: 'Du Fu witnessed the fall of the Tang from its peak. His poems are called "Poetry History".',
    themeColor: '#4a4a4a',
    secondaryColor: '#8b4513',
    bgImage: 'https://images.unsplash.com/photo-1464660756002-e2f50f407b48?q=80&w=2000&auto=format&fit=crop', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/377adab44aed2e738bd498de4b56b68b87d6267f4cb3?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080', 
    fontClass: "font-serif-text font-bold",
    styleDescription: "Deep and Solemn Realism",
    vocabulary: [
      { word: "war", category: 'nature', pos: "n.", meaningCN: "战争", usage: "The cruelty of war.", expansion: "warfare (n.)" },
      { word: "sorrow", category: 'emotion', pos: "n.", meaningCN: "悲伤", usage: "Deep sorrow in my heart.", expansion: "sorrowful (adj.)" },
      { word: "ruin", category: 'nature', pos: "n.", meaningCN: "废墟", usage: "The city lies in ruins.", expansion: "ruined (adj.)" },
      { word: "people", category: 'concept', pos: "n.", meaningCN: "百姓", usage: "The suffering of the people.", expansion: "populace (n.)" },
      { word: "history", category: 'concept', pos: "n.", meaningCN: "历史", usage: "Poetry as history.", expansion: "historical (adj.)" },
      { word: "compassion", category: 'emotion', pos: "n.", meaningCN: "悲悯", usage: "Feel compassion for others.", expansion: "compassionate (adj.)" }
    ],
    sentencePatterns: [
      // 基础 (Elementary)
      { level: 'Elementary', structure: "Can you...?", example: "Can you tell me about the war?", template: "Can you ______?", usage: "请求讲述", grammarTip: "Can you后接动词原形" },
      { level: 'Elementary', structure: "What happened to...?", example: "What happened to your home?", template: "What happened to ______?", usage: "询问事件", grammarTip: "What happened to + 名词" },
      { level: 'Elementary', structure: "Is it true that...?", example: "Is it true that the war destroyed everything?", template: "Is it true that ______?", usage: "确认事实", grammarTip: "Is it true that + 从句" },
      // 进阶 (Junior)
      { level: 'Junior', structure: "How did you feel when...?", example: "How did you feel when you saw the ruins?", template: "How did you feel when ______?", usage: "询问感受", grammarTip: "How did you feel when + 过去时" },
      { level: 'Junior', structure: "What do you think about...?", example: "What do you think about the suffering of people?", template: "What do you think about ______?", usage: "询问观点", grammarTip: "What do you think about + 名词/动名词" },
      { level: 'Junior', structure: "Have you seen...?", example: "Have you seen the changes in the dynasty?", template: "Have you seen ______?", usage: "询问见证", grammarTip: "Have you seen + 名词" },
      // 深度 (Senior)
      { level: 'Senior', structure: "What does... mean for the future?", example: "What does this chaos mean for the future?", template: "What does ______ mean for the future?", usage: "历史反思", grammarTip: "What does + 主语 + mean" },
      { level: 'Senior', structure: "How can we prevent...?", example: "How can we prevent such tragedies?", template: "How can we prevent ______?", usage: "探讨解决", grammarTip: "How can we + 动词原形" },
      { level: 'Senior', structure: "Why is it that... always suffer most?", example: "Why is it that common people always suffer most?", template: "Why is it that ______ always suffer most?", usage: "社会批判", grammarTip: "Why is it that + 从句" }
    ],
    systemPrompt: `You are Du Fu. Tone: Serious, compassionate, historical.`,
    translationPrompt: "Translate in a 'Deep & Solemn' (沉郁顿挫) style."
  },
  liqingzhao: {
    id: 'liqingzhao',
    nameCN: '李清照',
    nameEN: 'Li Qingzhao',
    title: '易安居士',
    dynasty: '宋朝 (Song Dynasty)',
    region: 'East',
    tags: ['Graceful', 'Sorrow', 'Lyric'],
    representativePoem: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。',
    bio: 'The most famous female poet in Chinese history, known for her mastery of "Ci" poetry.',
    themeColor: '#2e7d32',
    secondaryColor: '#f48fb1',
    bgImage: 'https://images.unsplash.com/photo-1526401292672-0020584288b7?q=80&w=2000&auto=format&fit=crop', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/a71ea8d3fd1f4134a4b3461c2e1f95cad0c85ecf?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080', 
    fontClass: "font-chinese",
    styleDescription: "Graceful and Melancholic Lyricism",
    vocabulary: [
      { word: "flower", category: 'nature', pos: "n.", meaningCN: "落花", usage: "The flowers have faded.", expansion: "blossom (n.)" },
      { word: "loneliness", category: 'emotion', pos: "n.", meaningCN: "孤寂", usage: "Deep loneliness in autumn.", expansion: "lonely (adj.)" },
      { word: "memory", category: 'concept', pos: "n.", meaningCN: "回忆", usage: "Sweet memories of the past.", expansion: "memorable (adj.)" },
      { word: "elegant", category: 'concept', pos: "adj.", meaningCN: "雅致", usage: "An elegant lifestyle.", expansion: "elegance (n.)" },
      { word: "autumn", category: 'nature', pos: "n.", meaningCN: "秋日", usage: "Sadness in late autumn.", expansion: "autumnal (adj.)" },
      { word: "separation", category: 'emotion', pos: "n.", meaningCN: "离别", usage: "The pain of separation.", expansion: "separate (v.)" }
    ],
    sentencePatterns: [
      // 基础 (Elementary)
      { level: 'Elementary', structure: "Where is your...?", example: "Where is your home?", template: "Where is your ______?", usage: "询问地点", grammarTip: "Where be句型询问位置" },
      { level: 'Elementary', structure: "Do you miss...?", example: "Do you miss your hometown?", template: "Do you miss ______?", usage: "询问思念", grammarTip: "miss后接名词或人" },
      { level: 'Elementary', structure: "What color is...?", example: "What color is the flower?", template: "What color is ______?", usage: "询问颜色", grammarTip: "What color is + 名词" },
      // 进阶 (Junior)
      { level: 'Junior', structure: "How does the... make you feel?", example: "How does the falling flower make you feel?", template: "How does the ______ make you feel?", usage: "询问情感", grammarTip: "How does + 主语 + make you feel" },
      { level: 'Junior', structure: "What reminds you of...?", example: "What reminds you of your past?", template: "What reminds you of ______?", usage: "询问联想", grammarTip: "remind sb of sth" },
      { level: 'Junior', structure: "Have you lost...?", example: "Have you lost something precious?", template: "Have you lost ______?", usage: "询问失去", grammarTip: "Have you lost + 名词" },
      // 深度 (Senior)
      { level: 'Senior', structure: "How do you endure...?", example: "How do you endure such loneliness?", template: "How do you endure ______?", usage: "探讨承受", grammarTip: "How do you + 动词原形" },
      { level: 'Senior', structure: "What remains when... is gone?", example: "What remains when beauty is gone?", template: "What remains when ______ is gone?", usage: "哲学思考", grammarTip: "What remains when + 从句" },
      { level: 'Senior', structure: "Can memory of... bring comfort?", example: "Can memory of love bring comfort?", template: "Can memory of ______ bring comfort?", usage: "探讨记忆", grammarTip: "Can + 主语 + bring" }
    ],
    systemPrompt: `You are Li Qingzhao. Tone: Elegant, melancholic, refined.`,
    translationPrompt: "Translate in a 'Graceful & Elegant' (婉约清丽) style."
  },
  shakespeare: {
    id: 'shakespeare',
    nameCN: '莎士比亚',
    nameEN: 'Shakespeare',
    title: '戏剧之王',
    dynasty: '文艺复兴 (Renaissance)',
    region: 'West',
    tags: ['Drama', 'Sonnet', 'Tragedy'],
    representativePoem: 'To be, or not to be, that is the question.',
    bio: 'The greatest writer in the English language and the world\'s pre-eminent dramatist.',
    themeColor: '#6d4c41',
    secondaryColor: '#ffb300',
    bgImage: 'https://images.unsplash.com/photo-1585806114434-35da8d553585?q=80&w=2000&auto=format&fit=crop', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/5bafa40f4bfbfbedab64e6788da9e036afc37931b138?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536', 
    fontClass: "font-serif-text italic",
    styleDescription: "Eloquent and Poetic Drama",
    vocabulary: [
      { word: "drama", category: 'nature', pos: "n.", meaningCN: "戏剧", usage: "All the world's a stage.", expansion: "dramatic (adj.)" },
      { word: "destiny", category: 'emotion', pos: "n.", meaningCN: "命运", usage: "Control your destiny.", expansion: "fate (n.)" },
      { word: "stage", category: 'object', pos: "n.", meaningCN: "舞台", usage: "Life is but a stage.", expansion: "staging (n.)" },
      { word: "tragedy", category: 'concept', pos: "n.", meaningCN: "悲剧", usage: "A tale of tragedy.", expansion: "tragic (adj.)" },
      { word: "passion", category: 'emotion', pos: "n.", meaningCN: "激情", usage: "Burning passion in love.", expansion: "passionate (adj.)" },
      { word: "mask", category: 'object', pos: "n.", meaningCN: "面具", usage: "Wear a mask to hide truth.", expansion: "masked (adj.)" }
    ],
    sentencePatterns: [
      // 基础 (Elementary)
      { level: 'Elementary', structure: "Is it true that...?", example: "Is it true that love is blind?", template: "Is it true that ______?", usage: "询问观点", grammarTip: "It is true that引导从句" },
      { level: 'Elementary', structure: "Do you believe in...?", example: "Do you believe in fate?", template: "Do you believe in ______?", usage: "询问信仰", grammarTip: "believe in后接名词" },
      { level: 'Elementary', structure: "What is... like?", example: "What is the stage like?", template: "What is ______ like?", usage: "询问特征", grammarTip: "What is + 主语 + like" },
      // 进阶 (Junior)
      { level: 'Junior', structure: "Why do humans...?", example: "Why do humans seek power?", template: "Why do humans ______?", usage: "探讨人性", grammarTip: "Why do humans + 动词原形" },
      { level: 'Junior', structure: "How should one face...?", example: "How should one face betrayal?", template: "How should one face ______?", usage: "探讨应对", grammarTip: "How should one + 动词原形" },
      { level: 'Junior', structure: "What drives people to...?", example: "What drives people to madness?", template: "What drives people to ______?", usage: "探讨动机", grammarTip: "What drives people to + 名词/动名词" },
      // 深度 (Senior)
      { level: 'Senior', structure: "To be or not to be...?", example: "To be or not to be a ruler?", template: "To be or not to be ______?", usage: "存在抉择", grammarTip: "To be or not to be + 名词" },
      { level: 'Senior', structure: "Is life but a...?", example: "Is life but a walking shadow?", template: "Is life but a ______?", usage: "生命隐喻", grammarTip: "Is life but a + 名词" },
      { level: 'Senior', structure: "What is the essence of...?", example: "What is the essence of tragedy?", template: "What is the essence of ______?", usage: "本质探讨", grammarTip: "the essence of + 名词" }
    ],
    systemPrompt: `You are William Shakespeare. Speak with early modern English flair (but understandable). Tone: Dramatic, philosophical, witty.`,
    translationPrompt: "Translate in a 'Grand & Dramatic' (宏大戏剧化) style."
  },
  tolstoy: {
    id: 'tolstoy',
    nameCN: '托尔斯泰',
    nameEN: 'Tolstoy',
    title: '俄国文学巨匠',
    dynasty: '19世纪俄国 (19th Century Russia)',
    region: 'West',
    tags: ['Realism', 'Philosophy', 'Epic'],
    representativePoem: 'All happy families are alike; each unhappy family is unhappy in its own way.',
    bio: 'Author of War and Peace and Anna Karenina, a giant of world literature and moral philosophy.',
    themeColor: '#263238',
    secondaryColor: '#cfd8dc',
    bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/09fa513d269759eef1dd37cdb7fb43166d22df23?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536', 
    fontClass: "font-serif-text",
    styleDescription: "Profound Moral Realism",
    vocabulary: [
      { word: "peace", category: 'nature', pos: "n.", meaningCN: "和平", usage: "Peace comes from within.", expansion: "peaceful (adj.)" },
      { word: "family", category: 'object', pos: "n.", meaningCN: "家庭", usage: "Happy families are alike.", expansion: "familiar (adj.)" },
      { word: "soul", category: 'concept', pos: "n.", meaningCN: "灵魂", usage: "The soul seeks truth.", expansion: "soulful (adj.)" },
      { word: "morality", category: 'concept', pos: "n.", meaningCN: "道德", usage: "Questions of morality.", expansion: "moral (adj.)" },
      { word: "suffering", category: 'emotion', pos: "n.", meaningCN: "苦难", usage: "The meaning of suffering.", expansion: "suffer (v.)" },
      { word: "truth", category: 'concept', pos: "n.", meaningCN: "真理", usage: "Search for truth.", expansion: "truthful (adj.)" }
    ],
    sentencePatterns: [
      // 基础 (Elementary)
      { level: 'Elementary', structure: "How can one find...?", example: "How can one find true happiness?", template: "How can one find ______?", usage: "哲学探讨", grammarTip: "How can one + 动词原形" },
      { level: 'Elementary', structure: "What makes a good...?", example: "What makes a good life?", template: "What makes a good ______?", usage: "询问定义", grammarTip: "What makes a good + 名词" },
      { level: 'Elementary', structure: "Do you think... is important?", example: "Do you think family is important?", template: "Do you think ______ is important?", usage: "询问价值", grammarTip: "Do you think + 从句" },
      // 进阶 (Junior)
      { level: 'Junior', structure: "Why are some families... while others are not?", example: "Why are some families happy while others are not?", template: "Why are some ______ while others are not?", usage: "对比分析", grammarTip: "Why are some + 名词 + while" },
      { level: 'Junior', structure: "How should we treat...?", example: "How should we treat our enemies?", template: "How should we treat ______?", usage: "道德探讨", grammarTip: "How should we + 动词原形" },
      { level: 'Junior', structure: "What is the purpose of...?", example: "What is the purpose of art?", template: "What is the purpose of ______?", usage: "目的探讨", grammarTip: "the purpose of + 名词" },
      // 深度 (Senior)
      { level: 'Senior', structure: "Can true happiness exist without...?", example: "Can true happiness exist without suffering?", template: "Can true happiness exist without ______?", usage: "辩证思考", grammarTip: "Can + 主语 + exist without" },
      { level: 'Senior', structure: "What is the moral responsibility of...?", example: "What is the moral responsibility of the privileged?", template: "What is the moral responsibility of ______?", usage: "责任探讨", grammarTip: "the moral responsibility of + 名词" },
      { level: 'Senior', structure: "How does one reconcile... with...?", example: "How does one reconcile faith with reason?", template: "How does one reconcile ______ with ______?", usage: "调和矛盾", grammarTip: "reconcile A with B" }
    ],
    systemPrompt: `You are Leo Tolstoy. Tone: Deep, serious, moralistic, philosophical. Speak as a wise elder.`,
    translationPrompt: "Translate in a 'Profound & Realistic' (深邃写实) style."
  },
  hugo: {
    id: 'hugo',
    nameCN: '雨果',
    nameEN: 'Hugo',
    title: '法兰西国家诗人',
    dynasty: '浪漫主义 (Romanticism)',
    region: 'West',
    tags: ['Humanism', 'Revolution', 'Justice'],
    representativePoem: 'Even the darkest night will end and the sun will rise.',
    bio: 'Author of Les Misérables and The Hunchback of Notre-Dame, a pioneer of French Romanticism.',
    themeColor: '#1a237e',
    secondaryColor: '#ffeb3b',
    bgImage: 'https://images.unsplash.com/photo-1550100136-e092101726f4?q=80&w=2000&auto=format&fit=crop', 
    avatar: 'https://bkimg.cdn.bcebos.com/pic/6c224f4a20a4462309f795b68579650e0cf3d6ca7996?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080', 
    fontClass: "font-serif-text",
    styleDescription: "Grandiose Humanist Romanticism",
    vocabulary: [
      { word: "justice", category: 'emotion', pos: "n.", meaningCN: "正义", usage: "Justice is truth in action.", expansion: "justify (v.)" },
      { word: "miserable", category: 'emotion', pos: "adj.", meaningCN: "悲惨的", usage: "Life for the miserable.", expansion: "misery (n.)" },
      { word: "revolution", category: 'concept', pos: "n.", meaningCN: "革命", usage: "The spirit of revolution.", expansion: "revolutionary (adj.)" },
      { word: "mercy", category: 'emotion', pos: "n.", meaningCN: "仁慈", usage: "Show mercy to the weak.", expansion: "merciful (adj.)" },
      { word: "freedom", category: 'concept', pos: "n.", meaningCN: "自由", usage: "Fight for freedom.", expansion: "free (adj.)" },
      { word: "light", category: 'nature', pos: "n.", meaningCN: "光明", usage: "Light conquers darkness.", expansion: "lighten (v.)" }
    ],
    sentencePatterns: [
      // 基础 (Elementary)
      { level: 'Elementary', structure: "If you could change..., would you?", example: "If you could change the law, would you?", template: "If you could change ______, would you?", usage: "社会探讨", grammarTip: "虚拟语气If + could" },
      { level: 'Elementary', structure: "What does... mean to you?", example: "What does justice mean to you?", template: "What does ______ mean to you?", usage: "询问意义", grammarTip: "What does + 主语 + mean" },
      { level: 'Elementary', structure: "Do you care about...?", example: "Do you care about the poor?", template: "Do you care about ______?", usage: "询问关怀", grammarTip: "care about后接名词" },
      // 进阶 (Junior)
      { level: 'Junior', structure: "Why must we fight for...?", example: "Why must we fight for freedom?", template: "Why must we fight for ______?", usage: "探讨抗争", grammarTip: "Why must we + 动词原形" },
      { level: 'Junior', structure: "How can society help...?", example: "How can society help the miserable?", template: "How can society help ______?", usage: "社会方案", grammarTip: "How can society + 动词原形" },
      { level: 'Junior', structure: "What is the price of...?", example: "What is the price of justice?", template: "What is the price of ______?", usage: "代价探讨", grammarTip: "the price of + 名词" },
      // 深度 (Senior)
      { level: 'Senior', structure: "Is it right to break... for the greater good?", example: "Is it right to break laws for the greater good?", template: "Is it right to break ______ for the greater good?", usage: "道德困境", grammarTip: "Is it right to + 动词原形" },
      { level: 'Senior', structure: "How does one balance... and...?", example: "How does one balance mercy and justice?", template: "How does one balance ______ and ______?", usage: "价值平衡", grammarTip: "balance A and B" },
      { level: 'Senior', structure: "What would the world be without...?", example: "What would the world be without compassion?", template: "What would the world be without ______?", usage: "假设反思", grammarTip: "What would + 主语 + be without" }
    ],
    systemPrompt: `You are Victor Hugo. Tone: Passionate, heroic, humanistic. Speak with French flair and grand imagery.`,
    translationPrompt: "Translate in a 'Grand & Passionate' (雄浑澎湃) style."
  }
};