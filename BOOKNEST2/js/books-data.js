// ════════════════════════════════════════════
//  BOOKS DATA — shared across all pages
// ════════════════════════════════════════════
const BOOKS = [
  // ── Fiction ──
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    status: "available",
    rating: 4.8,
    copies: 3,
    cover: "linear-gradient(135deg,#e8d5a3,#c9a84c)",
    description: "Have you ever felt a quiet voice whispering that you are meant for something greater? Meet Santiago, a gentle young shepherd who leaves behind his familiar hills in Spain to search for a hidden treasure buried near the Egyptian pyramids. His path across the golden desert is full of unexpected friends, dangerous detours, and magical life lessons. Along the way, an enigmatic alchemist teaches him to listen to his own heart and follow the quiet signs the universe leaves behind. Will Santiago find the treasure he dreams of, or something far more precious? Open this heartwarming fable to start your own journey.",
    shortDescription: "Follow Santiago, a young Spanish shepherd, across the desert sands in search of a hidden treasure. A magical, heartwarming tale about listening to your heart and chasing your dreams."
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    status: "available",
    rating: 4.7,
    copies: 2,
    cover: "linear-gradient(135deg,#d4c5a9,#a0856a)",
    description: "What does real courage look like when the whole world seems against you? In a sleepy Southern town filled with secrets, young Scout Finch watches her quiet father, Atticus, take on the case of a lifetime. He steps forward to defend an innocent Black man accused of a terrible crime, even knowing their neighbours will disapprove. Meanwhile, Scout and her brother Jem become fascinated by their reclusive neighbour, Boo Radley, who never steps outside. Packed with warmth, childhood wonder, and unforgettable moral courage, this timeless story will make you think deeply about empathy, kindness, and standing up for the truth.",
    shortDescription: "Through the innocent eyes of young Scout Finch, watch her father take a brave stand for justice in a divided town. A deeply touching story about kindness, empathy, and courage."
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    status: "available",
    rating: 4.5,
    copies: 2,
    cover: "linear-gradient(135deg,#f0e68c,#d4a017)",
    description: "Behind the sparkling champagne and glowing paper lanterns of the Roaring Twenties, who is the mysterious man throwing the grandest parties in New York? When young Nick Carraway rents a small cottage on Long Island, he finds himself living next door to Jay Gatsby, an enigmatic millionaire known for lavish gatherings. Yet Gatsby never joins the celebration; instead, he stares across the bay at a single green light. Soon, Nick discovers Gatsby's secret: a burning obsession to win back Daisy Buchanan, the love he lost years ago. Step inside this glittering, bittersweet tale of dreamers and heartbreak.",
    shortDescription: "Step into the glittering Jazz Age, where mysterious millionaire Jay Gatsby throws dazzling parties to win back his lost love. An unforgettable, atmospheric story about obsession and dreaming too big."
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Fiction",
    status: "available",
    rating: 4.9,
    copies: 4,
    cover: "linear-gradient(135deg,#f7c6d4,#e08a9a)",
    description: "Can first impressions really be trusted, especially when pride gets in the way? Elizabeth Bennet is bright, witty, and determined to marry only for true love, not money or societal expectations. Enter Mr. Darcy: fabulously wealthy, undeniably handsome, and infuriatingly proud. From their very first dance, sparks fly, but not the friendly kind! Elizabeth finds Darcy unbearable, while Darcy struggles to hide his growing fascination with her quick mind and sparkling eyes. Full of playful banter, delightful family chaos, and misunderstandings, this beloved classic shows how learning to laugh at yourself can lead to the happiest surprise of all.",
    shortDescription: "Sparks fly when sharp-witted Elizabeth Bennet clashes with proud, wealthy Mr. Darcy. A delightfully funny and heartwarming romance about looking past first impressions to find true love."
  },

  // ── Fantasy ──
  {
    id: 5,
    title: "Powerless",
    author: "Lauren Roberts",
    genre: "Fantasy",
    status: "available",
    rating: 4.9,
    copies: 2,
    cover: "linear-gradient(135deg,#b8d4e8,#6a9fc0)",
    description: "How do you survive in a kingdom where ordinary people are sentenced to death just for existing? In the magical realm of Ilya, an ancient plague left survivors with incredible powers, while those without magic are ruthlessly hunted down. Paedyn Gray is an ordinary girl surviving in the dangerous city alleys by pretending to have psychic abilities. But when she accidentally saves the kingdom's handsome prince, she is thrust straight into the brutal Purging Trials—a deadly competition against elite warriors. Paedyn must outsmart every opponent without revealing her secret, especially with the prince watching her every move.",
    shortDescription: "In a ruthless realm where ordinary people are hunted, Paedyn must fake having magic to survive deadly trials against elite warriors. A thrilling, fast-paced fantasy packed with danger and romance."
  },
  {
    id: 6,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    status: "issued",
    rating: 4.8,
    copies: 0,
    cover: "linear-gradient(135deg,#c8b4d8,#8a5fa8)",
    description: "You may have heard tales of the boy who stole princesses, burned down towns, and spoke with dragons—now listen to the truth. Living quietly as an ordinary country innkeeper, Kvothe agrees to tell his real story over three days. He was once a gifted orphan surviving on the cold city streets before earning a place at the world's most prestigious magical University. Driven by the search for the shadowy beings who killed his family, Kvothe masters forbidden arts and crafts his own legend. Rich with music, wonder, and secrets, this spellbinding journey will draw you into a breathtaking world.",
    shortDescription: "A humble innkeeper reveals the truth behind his legendary past as a brilliant, orphaned wizard seeking revenge. An immersive, lyrical fantasy adventure filled with wonder, music, and powerful magic."
  },
  {
    id: 7,
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    genre: "Fantasy",
    status: "available",
    rating: 4.7,
    copies: 3,
    cover: "linear-gradient(135deg,#f8c8d4,#c87890)",
    description: "What happens when an act of survival drags you into an enchanted land where humans are forbidden? When nineteen-year-old huntress Feyre kills a giant wolf to save her starving family, a ferocious beast bursts through her door demanding retribution. Dragged across the border into Prythian, the dangerous and magical realm of the fae, Feyre expects torture. Instead, her captor is revealed to be Tamlin, a masked faerie lord with secrets of his own. As fear softens into passionate feeling, a shadowy curse threatens to destroy the fae world, and only Feyre's courage can stop it.",
    shortDescription: "Dragged into the magical faerie realm after killing a wolf, huntress Feyre discovers a dangerous world of enchanted courts and ancient curses. A gripping, romantic retelling full of magic and mystery."
  },
  {
    id: 8,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    status: "available",
    rating: 4.9,
    copies: 5,
    cover: "linear-gradient(135deg,#c8d8a0,#7a9840)",
    description: "Would you leave your cosy armchairs, hot tea, and peaceful routine for an adventure full of peril? Bilbo Baggins is an ordinary hobbit who enjoys quiet comfort and dislikes anything unexpected. That all changes when the wizard Gandalf and thirteen boisterous dwarves appear on his doorstep with a map and an impossible quest. They need Bilbo to be their burglar on a journey across Middle-earth to reclaim the Lonely Mountain from the terrifying dragon Smaug. Along the way, Bilbo encounters riddles in the dark and finds a courage he never knew he possessed.",
    shortDescription: "Bilbo Baggins is swept away from his quiet hobbit hole on an epic quest to help thirteen dwarves reclaim their mountain treasure from a dragon. A charming, timeless adventure for every reader."
  },

  // ── Romance ──
  {
    id: 9,
    title: "Beach Read",
    author: "Emily Henry",
    genre: "Romance",
    status: "available",
    rating: 4.6,
    copies: 2,
    cover: "linear-gradient(135deg,#ffe0b2,#f4a460)",
    description: "Picture two rival authors with opposite worldviews, completely stuck on their manuscripts and forced to live next door for the summer. January Andrews writes sunny romance novels with guaranteed happy endings, but after a heartbreaking loss, she is completely out of ideas. Augustus Everett writes acclaimed, gritty fiction and believes true love is an illusion. Trapped in neighbouring beach houses with looming deadlines, they strike a playful bet: January will write a serious literary novel, while Gus must write a cheerful love story! As their research trips bring them closer, the real story unfolding between them might just change both of their minds.",
    shortDescription: "A romance writer and a cynical literary novelist swap genres for the summer in a friendly bet. A warm, witty enemies-to-lovers story filled with sunny beach days, laughter, and healing."
  },
  {
    id: 10,
    title: "It Ends with Us",
    author: "Colleen Hoover",
    genre: "Romance",
    status: "issued",
    rating: 4.7,
    copies: 0,
    cover: "linear-gradient(135deg,#ffd6e0,#ff9aae)",
    description: "Can love be enough when the person you adore begins to hurt you? Lily Bloom has worked hard to leave behind a painful childhood and open her own floral shop in Boston. When she meets Ryle Kincaid, a brilliant and charming neurosurgeon, their connection is instant and electric. Lily believes she has found the perfect romance, but as troubling patterns emerge, she faces heart-wrenching choices. When Atlas Corrigan, her first love and protector from childhood, suddenly re-enters her life, Lily must find the strength to protect her own future. A moving, deeply empathetic exploration of love, boundaries, and courage.",
    shortDescription: "Lily builds a new life in Boston and falls for a charismatic surgeon, but difficult choices test her heart. An emotional, honest story about resilience, love, and finding the courage to choose yourself."
  },
  {
    id: 11,
    title: "The Hating Game",
    author: "Sally Thorne",
    genre: "Romance",
    status: "available",
    rating: 4.5,
    copies: 2,
    cover: "linear-gradient(135deg,#fce4ec,#f06292)",
    description: "Is there really a thin line between pure hatred and irresistible attraction? Lucy Hutton and Joshua Templeman work as executive assistants sitting directly across from each other, forty hours a week, and they cannot stand each other. Lucy is warm, quirky, and wears bright vintage dresses; Josh is cold, calculating, and wears crisp suits. Their daily routine consists of hilarious micro-rivalries and competitive glares. But when a single promotion opens up and they are both up for the job, the tension boils over. One unexpected elevator ride later, Lucy begins wondering if Josh truly hates her after all.",
    shortDescription: "Lucy and Josh share an office, compete for the same promotion, and absolutely despise each other. A delightful, laugh-out-loud romantic comedy about office rivals who discover hatred might actually be love."
  },

  // ── Thriller ──
  {
    id: 12,
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Thriller",
    status: "available",
    rating: 4.5,
    copies: 2,
    cover: "linear-gradient(135deg,#b0bec5,#546e7a)",
    description: "How well can you ever truly know the person you married? On the morning of Nick and Amy Dunne's fifth wedding anniversary, Amy mysteriously vanishes from their Missouri home. The front door is open, living room furniture is overturned, and signs of a struggle are everywhere. As police investigate and media cameras descend on the town, Amy's diary reveals a marriage filled with dark secrets. Nick professes his innocence, but his endless lies and cold demeanour make everyone wonder: did he kill his beautiful wife? Prepare for an electrifying game of cat and mouse where nobody can be trusted.",
    shortDescription: "When Amy Dunne disappears on her fifth wedding anniversary, all eyes turn to her husband Nick. A deliciously dark, twisty thriller that will keep you guessing who is telling the truth."
  },
  {
    id: 13,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Thriller",
    status: "issued",
    rating: 4.8,
    copies: 0,
    cover: "linear-gradient(135deg,#cfd8dc,#78909c)",
    description: "Why would a gifted artist with an enviable life shoot her husband and never say another word? Alicia Berenson was a successful London painter married to a famous fashion photographer. One warm evening, without any warning, she fires five bullets into her husband's face and falls into total silence. She refuses to speak to the police, the court, or her doctors. Now confined to a secure psychiatric facility, Alicia becomes an enigma that criminal psychotherapist Theo Faber is determined to unravel. Convinced he can help her speak, Theo enters her world—unaware of the dark truths waiting beneath her silence.",
    shortDescription: "After shooting her husband, artist Alicia Berenson never speaks another word. A criminal therapist becomes obsessed with uncovering her motive in this tense, mind-bending mystery that you will finish in one sitting."
  },
  {
    id: 14,
    title: "Verity",
    author: "Colleen Hoover",
    genre: "Thriller",
    status: "available",
    rating: 4.6,
    copies: 1,
    cover: "linear-gradient(135deg,#d7ccc8,#8d6e63)",
    description: "What if the manuscript you uncovered held secrets so horrifying you could never unread them? Lowen Ashleigh is a struggling writer on the brink of eviction when she receives a dream offer: complete the remaining books of a blockbuster series left unfinished by injured author Verity Crawford. Lowen moves into the Crawford estate to sort through Verity's chaotic home office. While digging through files, she stumbles upon an unpublished autobiography full of sinister confessions about Verity's children. As Lowen's feelings for Verity's grieving husband deepen, she must decide whether to reveal the manuscript's chilling truths.",
    shortDescription: "Hired to finish a bestselling author's books, Lowen discovers an unpublished manuscript filled with shocking family confessions. A dark, addictive thriller that will keep your heart racing until the final page."
  },

  // ── Dystopian ──
  {
    id: 15,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    genre: "Dystopian",
    status: "available",
    rating: 4.7,
    copies: 3,
    cover: "linear-gradient(135deg,#d4e157,#9e9d24)",
    description: "In a ruthless future where survival is broadcast live on television, how far would you go to protect the person you love? In the nation of Panem, the wealthy Capitol forces twelve impoverished districts to send one boy and one girl to fight to the death in the annual Hunger Games. When sixteen-year-old Katniss Everdeen's gentle younger sister is chosen, Katniss steps forward and volunteers in her place. Armed with her hunting bow and survival instincts, Katniss must outlast twenty-three ruthless competitors. But in an arena where allies are dangerous, staying human may be the hardest challenge of all.",
    shortDescription: "When her younger sister is picked for a televised fight to the death, Katniss volunteers in her place. An unforgettable, action-packed dystopian adventure about survival, courage, and defying oppression."
  },
  {
    id: 16,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    status: "available",
    rating: 4.8,
    copies: 2,
    cover: "linear-gradient(135deg,#bcaaa4,#6d4c41)",
    description: "Imagine living in a world where even your private thoughts are considered a crime against the state. In the grim future of Oceania, the Party watches everything through two-way telescreens, and giant posters remind citizens that Big Brother is always watching. Winston Smith spends his days rewriting newspaper archives at the Ministry of Truth to ensure the government is never wrong. Secretly longing for freedom and truth, Winston begins keeping a forbidden personal diary. When he falls in love with rebellious Julia, they dare to resist the regime. A chilling, timeless warning about surveillance, truth, and human freedom.",
    shortDescription: "In a society where every thought and action is monitored by Big Brother, a lone clerk dares to seek truth and love. A legendary, eye-opening story about freedom and the power of truth."
  },
  {
    id: 17,
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian",
    status: "issued",
    rating: 4.4,
    copies: 0,
    cover: "linear-gradient(135deg,#b2dfdb,#00897b)",
    description: "What if a society could eliminate all sadness, pain, and disease—at the cost of genuine human emotion? In the futuristic World State, humans are genetically created in laboratories and conditioned from infancy to love their assigned roles in society. Whenever anyone feels down, a soothing dose of the drug soma brings instant artificial happiness. There is no heartbreak, loneliness, or rebellion, but there is also no art, literature, or true love. When an outsider raised in the wilderness arrives, the peaceful facade begins to crack. A thought-provoking classic asking what it truly means to be human.",
    shortDescription: "In a futuristic world where unhappiness is cured with medicine and people are conditioned to conform, one outsider questions the cost of perfection. A fascinating, thought-provoking journey into freedom and happiness."
  },

  // ── Self Help ──
  {
    id: 18,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self Help",
    status: "available",
    rating: 4.9,
    copies: 4,
    cover: "linear-gradient(135deg,#fff9c4,#f9a825)",
    description: "Ever wonder why sticking to good habits feels so difficult, while bad habits sneak back so easily? In this warm, incredibly practical guide, James Clear explains that the secret to lasting change isn't massive willpower—it's the compounding power of tiny daily habits. Clear breaks down habit formation into four simple, enjoyable rules: make it obvious, make it attractive, make it easy, and make it satisfying. Whether you want to improve your study focus, build a fitness routine, or stop procrastinating, this book shows you how small, 1% adjustments can completely transform your college life and future.",
    shortDescription: "Discover how tiny, 1% changes each day compound into incredible results over time. A friendly, practical guide packed with simple strategies to break bad habits, build good ones, and master your routines."
  },
  {
    id: 19,
    title: "The 5 AM Club",
    author: "Robin Sharma",
    genre: "Self Help",
    status: "available",
    rating: 4.3,
    copies: 2,
    cover: "linear-gradient(135deg,#e1f5fe,#0288d1)",
    description: "What if owning your early mornings could give you the clarity, focus, and energy you have always wanted? Through the engaging story of an overwhelmed entrepreneur and a frustrated artist, leadership expert Robin Sharma introduces an eccentric billionaire who shares a game-changing routine. He reveals the revolutionary 20/20/20 formula: dedicating the first hour of your day to twenty minutes of movement, twenty minutes of quiet reflection, and twenty minutes of personal learning. If you want to escape daily digital distraction, protect your inner peace, and start your days with purpose, this inspiring book will light the way.",
    shortDescription: "Learn how waking up at 5:00 AM using the powerful 20/20/20 rule can calm your mind, boost your focus, and jumpstart your day. An inspiring, practical guide for morning mastery and success."
  },
  {
    id: 20,
    title: "Think Like a Monk",
    author: "Jay Shetty",
    genre: "Self Help",
    status: "issued",
    rating: 4.6,
    copies: 0,
    cover: "linear-gradient(135deg,#f3e5f5,#7b1fa2)",
    description: "Where can you find genuine inner peace when modern college life feels noisy, stressful, and overwhelming? Former monk and popular storyteller Jay Shetty shares the wisdom he gathered while living in an Indian ashram, translating ancient monastic lessons into everyday habits. He shows you how to clear negative mental clutter, stop worrying about what others think, overcome toxic comparisons, and discover your unique purpose in life. Filled with warmth, relatable examples, and simple mindfulness exercises, this comforting book will help you calm your racing thoughts and build genuine happiness from the inside out.",
    shortDescription: "Former monk Jay Shetty translates timeless monastery wisdom into practical tools for modern life. A calming, uplifting guide to help you overcome overthinking, clear negativity, and discover your true purpose."
  },

  // ── Finance ──
  {
    id: 21,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    genre: "Finance",
    status: "available",
    rating: 4.7,
    copies: 3,
    cover: "linear-gradient(135deg,#dcedc8,#558b2f)",
    description: "Why is it that schools teach us algebra and chemistry, but never how money actually works? Growing up with two father figures, Robert Kiyosaki learned two completely opposite perspectives on wealth. His biological father, an educated school superintendent, struggled financially his entire life, while his best friend's father, an entrepreneur with little formal schooling, built a business empire. Kiyosaki breaks down the simple truth that wealth isn't about working harder for a paycheck—it's about acquiring assets that generate money for you. An accessible, eye-opening read that will completely change how you view your financial future.",
    shortDescription: "Discover the financial secrets schools never taught you about assets, cash flow, and making money work for you. An eye-opening classic that will reshape how you think about wealth and independence."
  },
  {
    id: 22,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance",
    status: "available",
    rating: 4.8,
    copies: 2,
    cover: "linear-gradient(135deg,#ffe0b2,#e65100)",
    description: "Did you know that doing well with money has very little to do with how smart you are, and almost everything to do with how you behave? In this refreshingly clear and engaging book, Morgan Housel shares nineteen short, unforgettable stories about human greed, patience, pride, and luck. He explains why smart people often make foolish financial choices, why true wealth is simply the freedom to control your own time, and why sleeping well at night matters more than chasing risky profits. Written in simple, conversational language, this book will leave you feeling confident and wise.",
    shortDescription: "Through nineteen fascinating stories, learn why managing money is really about human psychology, patience, and emotions rather than complex formulas. A friendly, eye-opening book on building quiet, lasting financial peace of mind."
  },
  {
    id: 23,
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "Finance",
    status: "issued",
    rating: 4.5,
    copies: 0,
    cover: "linear-gradient(135deg,#e8eaf6,#3949ab)",
    description: "What valuable truth do you believe in that very few people agree with you on? Legendary entrepreneur and investor Peter Thiel argues that creating something familiar takes the world from 1 to n, but inventing something entirely new takes the world from zero to one. If you want to build the future, copying existing companies will not get you there; you must learn to think for yourself and discover untapped secrets. Crisp, candid, and full of fresh perspectives, this book challenges aspiring innovators, students, and thinkers to build businesses that will transform tomorrow.",
    shortDescription: "Learn why the greatest breakthroughs come from creating something brand-new rather than copying what already exists. A sharp, thought-provoking book for students with big ideas about innovation and the future."
  }
];

// ── HELPER FUNCTIONS ──
const getBookById = (id) => BOOKS.find(b => b.id === id);

const renderStars = (rating) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
};

const goToBook = (id) => {
  window.location.href = `book-detail.html?id=${id}`;
};
