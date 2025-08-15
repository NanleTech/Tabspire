export interface FallbackVerse {
  text: string;
  reference: string;
}

export const FALLBACK_VERSES: FallbackVerse[] = [
  {
    text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    reference: 'John 3:16'
  },
  {
    text: 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
    reference: 'Psalm 23:1-3'
  },
  {
    text: 'I can do all things through Christ who strengthens me.',
    reference: 'Philippians 4:13'
  },
  {
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    reference: 'Jeremiah 29:11'
  },
  {
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    reference: 'Romans 8:28'
  },
  {
    text: 'God is our refuge and strength, an ever-present help in trouble.',
    reference: 'Psalm 46:1'
  },
  {
    text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    reference: 'Isaiah 41:10'
  },
  {
    text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    reference: 'Matthew 6:33'
  },
  {
    text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    reference: 'Hebrews 11:1'
  },
  {
    text: 'For we live by faith, not by sight.',
    reference: '2 Corinthians 5:7'
  },
  {
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    reference: 'Proverbs 3:5-6'
  },
  {
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    reference: 'Joshua 1:9'
  },
  {
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    reference: 'Isaiah 40:31'
  },
  {
    text: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?',
    reference: 'Psalm 27:1'
  },
  {
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    reference: 'Matthew 11:28'
  },
  {
    text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    reference: 'Romans 15:13'
  },
  {
    text: 'Be on your guard; stand firm in the faith; be courageous; be strong.',
    reference: '1 Corinthians 16:13'
  },
  {
    text: 'Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life that the Lord has promised to those who love him.',
    reference: 'James 1:12'
  },
  {
    text: 'Cast all your anxiety on him because he cares for you.',
    reference: '1 Peter 5:7'
  },
  {
    text: 'Taste and see that the Lord is good; blessed is the one who takes refuge in him.',
    reference: 'Psalm 34:8'
  },
  {
    text: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.',
    reference: 'Ephesians 2:8'
  },
  {
    text: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
    reference: 'Isaiah 53:5'
  },
  {
    text: 'If you declare with your mouth, "Jesus is Lord," and believe in your heart that God raised him from the dead, you will be saved.',
    reference: 'Romans 10:9'
  },
  {
    text: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
    reference: '2 Timothy 1:7'
  },
  {
    text: 'I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.',
    reference: 'Galatians 2:20'
  },
  {
    text: 'Blessed are the peacemakers, for they will be called children of God.',
    reference: 'Matthew 5:9'
  },
  {
    text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God\'s will is—his good, pleasing and perfect will.',
    reference: 'Romans 12:2'
  },
  {
    text: 'Let the peace of Christ rule in your hearts, since as members of one body you were called to peace. And be thankful.',
    reference: 'Colossians 3:15'
  },
  {
    text: 'For nothing is impossible with God.',
    reference: 'Luke 1:37'
  },
  {
    text: 'There is no fear in love. But perfect love drives out fear, because fear has to do with punishment. The one who fears is not made perfect in love.',
    reference: '1 John 4:18'
  },
  {
    text: 'Rejoice always, pray continually, give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.',
    reference: '1 Thessalonians 5:16-18'
  },
  {
    text: 'The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.',
    reference: 'Zephaniah 3:17'
  },
  {
    text: 'For his anger lasts only a moment, but his favor lasts a lifetime; weeping may stay for the night, but rejoicing comes in the morning.',
    reference: 'Psalm 30:5'
  },
  {
    text: 'Though the mountains be shaken and the hills be removed, yet my unfailing love for you will not be shaken nor my covenant of peace be removed, says the Lord, who has compassion on you.',
    reference: 'Isaiah 54:10'
  },
  {
    text: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."',
    reference: 'Psalm 91:1-2'
  }
];

export const getRandomFallbackVerse = (): FallbackVerse => {
  return FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
};
