// Karigar public website — reference data and sample records.
// Every maker here is a composite persona drawn from the toolkit's sample records, not a real individual.
window.KARIGAR_SITE = (function () {
  var RINGS = {
    craft: { label: 'My Craft', color: '#B98BE0', ink: '#4A2A6B', soft: '#F3ECFA' },
    place: { label: 'Place', color: '#6FC9B8', ink: '#1F5F54', soft: '#E6F6F2' },
    lineage: { label: 'Legacy', color: '#A81C24', ink: '#7A1319', soft: '#FBEAE8' },
    material: { label: 'Material & Tools', color: '#C06A5F', ink: '#7C3A32', soft: '#F8ECEA' },
    culture: { label: 'Cultural Meaning', color: '#6D9DC5', ink: '#2C5476', soft: '#EAF1F8' },
    pride: { label: 'Pride & Stake', color: '#F0B23C', ink: '#8A5D05', soft: '#FFF6E3' }
  };

  // Controlled rights vocabulary — maintained by the council, not free text.
  var RIGHTS = [
    { code: 'KR-0', label: 'View only', desc: 'Read it here. Please do not copy, quote at length or republish.' },
    { code: 'KR-1', label: 'Share with credit', desc: 'Link to it or share it whole, with the maker’s credit. No edits, no commercial use.' },
    { code: 'KR-2', label: 'Quote with credit', desc: 'Short quotes for press, writing and research, credited. Images may not be reused.' },
    { code: 'KR-3', label: 'Teaching with credit', desc: 'Classrooms and non-commercial research, credited.' },
    { code: 'KR-C', label: 'Commercial use by agreement', desc: 'Any commercial use needs a separate agreement with the maker that names the terms.' }
  ];

  var TIERS = [
    { id: 'private', en: 'Only me', gu: 'ફક્ત હું', name: 'Private archive', color: '#4A4356', bg: '#F2EDE4',
      who: { en: 'Only you. It stays in your own record and is never published.', gu: 'ફક્ત તમે. આ તમારા પોતાના રેકોર્ડમાં રહે છે, ક્યારેય પ્રકાશિત થતું નથી.' } },
    { id: 'partners', en: 'People I approve', gu: 'હું મંજૂર કરું તે લોકો', name: 'Approved partners', color: '#2C5476', bg: '#EAF1F8',
      who: { en: 'Only the people you have approved. Nobody else, and search engines cannot see it.', gu: 'ફક્ત તમે મંજૂર કરેલા લોકો. બીજું કોઈ નહીં.' } },
    { id: 'link', en: 'Anyone with the link', gu: 'લિંક ધરાવનાર કોઈપણ', name: 'Discoverable, not indexed', color: '#8A5D05', bg: '#FFF6E3',
      who: { en: 'Anyone you send the link to. It will not appear on your page, and search engines like Google will not list it.', gu: 'તમે જેને લિંક મોકલો તે કોઈપણ. તમારા પાના પર કે Google માં દેખાશે નહીં.' } },
    { id: 'public', en: 'Everyone', gu: 'બધા', name: 'Public', color: '#1F5F54', bg: '#E6F6F2',
      who: { en: 'Anyone on the internet. It appears on your Karigar page and search engines like Google can find it.', gu: 'ઇન્ટરનેટ પર કોઈપણ. તમારા Karigar પાના પર દેખાશે અને Google શોધી શકશે.' } }
  ];

  var PURPOSES = [
    { id: 'page', label: 'Show on Karigar', note: 'Your page and story links' },
    { id: 'press', label: 'Press & writing', note: 'Journalists and writers may quote it' },
    { id: 'teach', label: 'Teaching & research', note: 'Classrooms, students, researchers' },
    { id: 'exhibit', label: 'Exhibitions', note: 'Museum panels and displays' },
    { id: 'ai', label: 'AI training', note: 'Off unless you turn it on. Never assumed.' }
  ];

  var CATS = ['Purchase', 'Commission', 'Collaboration', 'Press', 'Research', 'Institutional', 'Other'];

  var L = {
    en: { stories: 'My stories', requests: 'Requests', partners: 'People I approve', profile: 'My page', data: 'My data',
      who: 'Who can see this', private: 'Make private now', correct: 'Correct', accept: 'Accept', decline: 'Decline', block: 'Block sender',
      hear: 'Hear this', save: 'Save', cancel: 'Cancel', view: 'View',
      storiesSub: 'Everything starts private. You choose, story by story, who sees what.',
      reqSub: 'People who want to reach you. Accept, decline, or simply leave a request — it closes by itself.',
      partSub: 'People you have let see stories marked “People I approve”. Access ends on the date you set.',
      profSub: 'How your name, place and credit appear to visitors.',
      dataSub: 'Your record is yours. Take it with you, hide it, or delete it.' },
    gu: { stories: 'મારી વાર્તાઓ', requests: 'વિનંતીઓ', partners: 'મંજૂર લોકો', profile: 'મારું પાનું', data: 'મારો ડેટા',
      who: 'કોણ જોઈ શકે', private: 'હમણાં ખાનગી કરો', correct: 'સુધારો', accept: 'સ્વીકારો', decline: 'ના પાડો', block: 'બ્લોક કરો',
      hear: 'સાંભળો', save: 'સાચવો', cancel: 'રદ કરો', view: 'જુઓ',
      storiesSub: 'બધું ખાનગીથી શરૂ થાય છે. કોણ શું જુએ તે તમે નક્કી કરો.',
      reqSub: 'તમને મળવા માગતા લોકો. સ્વીકારો, ના પાડો, કે જવા દો — તે પોતે બંધ થઈ જશે.',
      partSub: 'જેમને તમે વાર્તાઓ જોવા દીધી છે. તમે નક્કી કરેલી તારીખે બંધ થાય છે.',
      profSub: 'મુલાકાતીઓને તમારું નામ, જગ્યા અને શ્રેય કેવી રીતે દેખાય છે.',
      dataSub: 'તમારો રેકોર્ડ તમારો છે. સાથે લઈ જાઓ, છુપાવો, કે ડિલીટ કરો.' }
  };

  var PRINCIPLES = [
    ['Artisan authorship', 'Every published item shows the maker’s name as they chose it. Nothing publishes without an author.'],
    ['Informed, ongoing consent', 'Every item carries a consent record for a specific purpose. Withdrawing takes one action.'],
    ['Context and dignity', 'Story templates never ask for hardship. No field asks about income or need.'],
    ['Fair value and benefit', 'Commercial reuse needs its own consent step, with the terms named.'],
    ['Protection and choice', 'A private archive is a complete way to use Karigar. Boundaries are enforced when publishing, not suggested.'],
    ['Accuracy and correction', 'Makers correct any of their own content, any time, without asking anyone.'],
    ['Accessible participation', 'Every core task works without English, on a low-cost phone, with audio.'],
    ['Collective accountability', 'Karigar reports on credit, contact, correction and benefit — never reach.'],
    ['No automatic extraction', 'Nothing defaults to training, licensing or marketing use.'],
    ['Collaboration as meeting of expertise', 'Partner access is granted by the maker, time-bound and revocable.'],
    ['Governance', 'Council decisions are recorded in public and change how the platform actually behaves.']
  ];

  var DECISIONS = [
    { id: 'D-07', date: '14 Sep 2026', text: 'New stories show location at district level or broader by default. Exact location is never taken from photo data.', config: 'location.default = district · exif.strip = true' },
    { id: 'D-06', date: '14 Sep 2026', text: 'Rights vocabulary v1 adopted (KR-0 to KR-C), authoritative in English, Hindi, Gujarati and Marathi.', config: 'rights.vocabulary = v1' },
    { id: 'D-05', date: '02 Aug 2026', text: 'Contact requests close after 30 days without a reply. No reminders are sent to the maker.', config: 'contact.expiry_days = 30 · contact.reminders = off' },
    { id: 'D-04', date: '02 Aug 2026', text: 'No public counts of views, likes or followers anywhere on Karigar.', config: 'metrics.public = off' },
    { id: 'D-03', date: '11 Jul 2026', text: 'Approved-partner access lasts at most 12 months and can only be renewed by the maker.', config: 'partners.max_months = 12' }
  ];

  function seed() {
    var makers = [
      { id: 'm-rehmat', name: 'Meena Khatri', local: 'મીના ખત્રી', craft: 'Bandhani', craftLocal: 'બાંધણી', cat: 'Textile', ring: 'place', lang: 'gu',
        loc: { village: 'Bhuj taluka', district: 'Kutch district', state: 'Gujarat', region: 'Western India' }, gran: 'district',
        langs: ['Gujarati', 'Kutchi'], practice: 'Tying since she was nine', credit: 'Meena Khatri, bandhani maker, Kutch',
        about: 'I tie bandhani with the women of my lane. The dots are small and the work is long. I would rather you hear it from me.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-sukhram', name: 'Raju Ram', local: 'राजू राम', craft: 'Dhokra casting', craftLocal: 'ढोकरा ढलाई', cat: 'Metal', ring: 'material', lang: 'hi',
        loc: { village: 'Kondagaon', district: 'Kondagaon district', state: 'Chhattisgarh', region: 'Central India' }, gran: 'state',
        langs: ['Hindi', 'Halbi'], practice: 'Twenty-two years at the furnace', credit: 'Raju Ram, dhokra caster, Bastar',
        about: 'My father cast lamps for the village. I cast what people ask for now, but I still begin every piece the way he did, with wax.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-sunanda', name: 'Asha More', local: 'आशा मोरे', craft: 'Paithani weaving', craftLocal: 'पैठणी विणकाम', cat: 'Textile', ring: 'culture', lang: 'mr',
        loc: { village: 'Yeola', district: 'Nashik district', state: 'Maharashtra', region: 'Western India' }, gran: 'district',
        langs: ['Marathi'], practice: 'At the loom since sixteen', credit: 'Asha More, paithani weaver, Yeola',
        about: 'In Yeola there is a loom in every lane. I weave borders, mostly peacocks, and lately I teach my daughter-in-law.',
        contact: { open: false, until: '1 December 2026' }, collective: 'm-yeola' },
      { id: 'm-ngaleng', name: 'Lily Shaiza', local: 'Lily Shaiza', craft: 'Longpi pottery', craftLocal: 'Longpi ham', cat: 'Clay', ring: 'place', lang: 'en',
        loc: { village: 'Longpi Kajui', district: 'Ukhrul district', state: 'Manipur', region: 'Northeast India' }, gran: 'district',
        langs: ['Tangkhul', 'English'], practice: 'Fourteen years of hand-building', credit: 'Lily Shaiza, Longpi potter, Ukhrul',
        about: 'We do not use a wheel. Everything is shaped by hand on a flat stone, the way my aunt showed me.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-yeola', name: 'Yeola Weavers', local: 'येवला विणकर गट', craft: 'Paithani weaving', craftLocal: 'पैठणी', cat: 'Textile', ring: 'culture', lang: 'mr', isCollective: true,
        loc: { village: 'Yeola', district: 'Nashik district', state: 'Maharashtra', region: 'Western India' }, gran: 'district',
        langs: ['Marathi'], practice: 'Eleven weavers, three looms', credit: 'Yeola Weavers (collective), Nashik',
        about: 'Eleven of us share three looms and one dye room. We are credited as a group because the sari is made by a group.',
        members: ['Asha More', 'and ten weavers who keep their names private'], contact: { open: true, until: '' }, collective: null },
      { id: 'm-ravi', name: 'Ravi Kumar', local: 'ರವಿ ಕುಮಾರ್', craft: 'Channapatna toys', craftLocal: 'ಚನ್ನಪಟ್ಟಣ ಗೊಂಬೆ', cat: 'Wood', ring: 'material', lang: 'en',
        loc: { village: 'Channapatna', district: 'Ramanagara district', state: 'Karnataka', region: 'South India' }, gran: 'district',
        langs: ['Kannada'], practice: 'At the lathe for nineteen years', credit: 'Ravi Kumar, lacquerware turner, Channapatna',
        about: 'I turn ivory-wood on a lathe and colour it with lacquer sticks. Most of my toys are for children who will chew them, so the colours are vegetable.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-gopal', name: 'Gopal Prajapati', local: 'गोपाल प्रजापति', craft: 'Molela terracotta', craftLocal: 'मोलेला माटी', cat: 'Clay', ring: 'culture', lang: 'hi',
        loc: { village: 'Molela', district: 'Rajsamand district', state: 'Rajasthan', region: 'Western India' }, gran: 'district',
        langs: ['Hindi', 'Mewari'], practice: 'Third generation in the family workshop', credit: 'Gopal Prajapati, terracotta maker, Molela',
        about: 'Villages come to Molela to buy their gods. I make the plaques the way my grandfather did, from river clay and donkey dung, fired in the open.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-salma', name: 'Salma Bano', local: 'सलमा बानो', craft: 'Dhurrie weaving', craftLocal: 'दरी बुनाई', cat: 'Textile', ring: 'lineage', lang: 'hi',
        loc: { village: 'Salawas', district: 'Jodhpur district', state: 'Rajasthan', region: 'Western India' }, gran: 'state',
        langs: ['Hindi', 'Marwari'], practice: 'Weaving since she was twelve', credit: 'Salma Bano, dhurrie weaver, Rajasthan',
        about: 'I weave flat rugs on a pit loom in our courtyard. My hands do the counting now; my head is free to listen to the radio.',
        contact: { open: false, until: '15 January 2027' }, collective: null },
      { id: 'm-sita', name: 'Sita Devi', local: 'सीता देवी', craft: 'Madhubani painting', craftLocal: 'मधुबनी चित्र', cat: 'Painting', ring: 'place', lang: 'hi',
        loc: { village: 'Jitwarpur', district: 'Madhubani district', state: 'Bihar', region: 'East India' }, gran: 'district',
        langs: ['Maithili', 'Hindi'], practice: 'Painting since her own wedding', credit: 'Sita Devi, Madhubani painter, Bihar',
        about: 'We painted walls before we painted paper. I still grind my black from soot and my yellow from turmeric when I can.',
        contact: { open: true, until: '' }, collective: null }
    ];
    function c(lang, by, purposes, rights) { return { purposes: purposes, duration: 'open', until: '', rights: rights, grantedAt: '12 Oct 2026', lang: lang, by: by, assisted: true }; }
    var stories = [
      { id: 's-water', maker: 'm-rehmat', ring: 'place', card: 'Place ring · card 2', date: '12 Oct 2026', tier: 'public', rights: 'KR-2', orig: 'gu', media: true, mediaAlt: 'Tied cloth drying after the red dye bath', depicts: 'Process',
        consent: c('Gujarati', 'Meena Khatri', ['page', 'press'], 'KR-2'),
        corrections: [{ date: '18 Oct 2026', note: 'An earlier version said the dye bath is boiled for an hour. Meena corrected this: it is kept warm, never boiled.' }],
        versions: {
          en: { title: 'Kutch had the water for it', body: ['People ask why bandhani is here and not somewhere else. I tell them: we did not bring it. Kutch had the water for it, so it stayed.', 'The red comes out differently from each well. My mother knew which well gave the deepest colour before the monsoon and which one after. We keep the dye bath warm, never boiling, or the knots loosen. Now the water has gone down, we buy it from tankers, and the red is never quite the same twice.', 'I don’t call it heritage. It is our work. It belongs to this place the way the salt does.'] },
          gu: { title: 'કચ્છમાં એનું પાણી હતું', body: ['લોકો પૂછે છે કે બાંધણી અહીં જ કેમ છે. હું કહું છું: અમે એને અહીં લાવ્યા નથી. કચ્છમાં એનું પાણી હતું, એટલે એ અહીં રહી ગઈ.', 'દરેક કૂવાનું પાણી લાલ રંગ જુદો કાઢે છે. મારી મા જાણતી કે ચોમાસા પહેલાં કયો કૂવો ઘેરો રંગ આપે. રંગનું પાણી ગરમ રાખીએ, ઉકાળીએ નહીં, નહીં તો ગાંઠ ઢીલી થાય.', 'હું એને વારસો નથી કહેતી. એ અમારું કામ છે. મીઠાની જેમ એ આ જગ્યાનું છે.'] }
        } },
      { id: 's-thumb', maker: 'm-rehmat', ring: 'lineage', card: 'Lineage ring · card 1', date: '12 Oct 2026', tier: 'link', rights: 'KR-1', orig: 'gu', media: false, consent: c('Gujarati', 'Meena Khatri', ['page'], 'KR-1'), corrections: [],
        versions: {
          en: { title: 'My mother’s thumbnail', body: ['My mother kept the nail of her left thumb long. That was her tool — she lifted the cloth over it to make each dot. I was nine when she put the cloth in my hand.', 'She did not explain. She tied, I watched, and when my dot was too big she untied it without a word. That silence taught me more than any instruction.'] },
          gu: { title: 'મારી માનો અંગૂઠો', body: ['મારી મા ડાબા અંગૂઠાનો નખ લાંબો રાખતી. એ જ એનું ઓજાર હતું. હું નવ વર્ષની હતી ત્યારે એણે કાપડ મારા હાથમાં મૂક્યું.', 'એ સમજાવતી નહીં. એ બાંધતી, હું જોતી. એ ચુપકીએ મને ઘણું શીખવ્યું.'] }
        } },
      { id: 's-wedding', maker: 'm-rehmat', ring: 'pride', card: 'Pride ring · card 3', date: '12 Oct 2026', tier: 'private', rights: 'KR-0', orig: 'en', media: false, consent: null, corrections: [],
        boundary: { what: 'the wedding odhani pattern', scope: 'Do not publish', collective: true },
        versions: { en: { title: 'What we tie only for our daughters', body: ['There is one pattern we tie only for our own daughters’ weddings. A shop asked me for it last year. I said no.', 'Some things are not for sale, and not for showing either.'] } } },
      { id: 's-wax', maker: 'm-sukhram', ring: 'material', card: 'Material ring · card 2', date: '30 Sep 2026', tier: 'public', rights: 'KR-1', orig: 'hi', media: true, mediaAlt: 'Wax threads wound around a clay core', depicts: 'Process', consent: c('Hindi', 'Raju Ram', ['page', 'teach'], 'KR-1'), corrections: [],
        versions: {
          en: { title: 'Wax is my pencil', body: ['Before the metal, there is wax. I draw with it — thin threads of beeswax and resin, wound around the clay core while it is still soft in my hands.', 'In winter the wax goes stiff and I keep it by the fire. In May it melts if I look at it. Every figure you see began as a thread I pulled with my thumb.', 'When the metal is poured, the wax is gone. Nothing of my drawing remains except its shape in brass.'] },
          hi: { title: 'मोम मेरी पेंसिल है', body: ['धातु से पहले मोम होता है। मैं उसी से चित्र बनाता हूँ — मधुमक्खी के मोम और राल के पतले धागे, जिन्हें मिट्टी के साँचे पर लपेटता हूँ जब वह अभी नरम होता है।', 'सर्दी में मोम सख़्त हो जाता है, तो उसे आग के पास रखता हूँ। मई में तो देखने भर से पिघल जाता है।', 'जब धातु डाली जाती है, मोम चला जाता है। मेरे चित्र में से कुछ नहीं बचता, बस पीतल में उसका आकार।'] }
        } },
      { id: 's-pond', maker: 'm-sukhram', ring: 'place', card: 'Place ring · card 3', date: '30 Sep 2026', tier: 'public', rights: 'KR-2', orig: 'hi', media: false, consent: c('Hindi', 'Raju Ram', ['page', 'press'], 'KR-2'), corrections: [],
        versions: {
          en: { title: 'The clay by the school pond', body: ['The core needs clay that holds. Ours comes from the edge of the pond behind the old school. Clay from other places cracks on the mould.', 'Last year they started building there. I went every evening for a month to fill sacks before it was gone.'] },
          hi: { title: 'स्कूल के तालाब वाली मिट्टी', body: ['भीतर के साँचे के लिए ऐसी मिट्टी चाहिए जो टिके। हमारी मिट्टी पुराने स्कूल के पीछे वाले तालाब के किनारे से आती है।', 'पिछले साल वहाँ निर्माण शुरू हुआ। मैं महीने भर हर शाम बोरियाँ भरने जाता रहा।'] }
        } },
      { id: 's-peacock', maker: 'm-sunanda', ring: 'culture', card: 'Culture ring · card 1', date: '22 Sep 2026', tier: 'public', rights: 'KR-0', orig: 'mr', media: true, mediaAlt: 'Peacock border on the loom, half woven', depicts: 'Object', consent: c('Marathi', 'Asha More', ['page'], 'KR-0'), corrections: [],
        versions: {
          en: { title: 'The peacock border takes a week', body: ['A paithani border is woven with the hand, not the shuttle. Every colour in the peacock is a separate little bobbin that I pass through and turn back.', 'One border takes me a week if no one is ill and the power stays on. My daughter-in-law sits at the other side of the loom now. She is faster than I was at her age.'] },
          mr: { title: 'मोराचा काठ आठवडा घेतो', body: ['पैठणीचा काठ धोट्याने नाही, हाताने विणला जातो. मोरातला प्रत्येक रंग वेगळ्या छोट्या कांडीचा असतो.', 'घरात कोणी आजारी नसेल आणि वीज टिकली तर एक काठ आठवड्यात होतो. आता माझी सून मागाच्या दुसऱ्या बाजूला बसते.'] }
        } },
      { id: 's-hillsides', maker: 'm-ngaleng', ring: 'place', card: 'Place ring · card 1', date: '16 Sep 2026', tier: 'public', rights: 'KR-3', orig: 'en', media: true, mediaAlt: 'Black stone and weathered rock, ground for clay', depicts: 'Material', consent: c('English', 'Lily Shaiza', ['page', 'teach'], 'KR-3'), corrections: [],
        versions: { en: { title: 'Only two hillsides', body: ['Longpi ham needs a black serpentine stone mixed with weathered rock. It comes from two hillsides near the village. Without that rock there is no Longpi, anywhere.', 'We don’t use a wheel. I shape every pot by hand on a flat stone, then fire it and rub it with leaves while it is hot. That is where the black shine comes from.'] } } },
      { id: 's-together', maker: 'm-yeola', ring: 'pride', card: 'Reflection · Sharing', date: '08 Sep 2026', tier: 'public', rights: 'KR-2', orig: 'mr', media: false, consent: c('Marathi', 'Yeola Weavers', ['page', 'press'], 'KR-2'), corrections: [],
        versions: {
          en: { title: 'Why we weave together', body: ['Eleven of us share three looms and one dye room. When an order comes, we decide together who weaves which part.', 'We are credited as a group because the sari is made by a group. If you write about it, please name the collective, not one of us.'] },
          mr: { title: 'आम्ही एकत्र का विणतो', body: ['आम्ही अकरा जणी तीन माग आणि एक रंगखोली वाटून घेतो. ऑर्डर आली की कोण कोणता भाग विणणार हे आम्ही मिळून ठरवतो.', 'साडी गट बनवतो, म्हणून श्रेय गटाला. याबद्दल लिहिलं तर गटाचं नाव द्या.'] }
        } },
      { id: 's-lacquer', maker: 'm-ravi', ring: 'material', card: 'Material ring · card 1', date: '06 Oct 2026', tier: 'public', rights: 'KR-1', orig: 'en', media: false, consent: c('Kannada', 'Ravi Kumar', ['page', 'teach'], 'KR-1'), corrections: [],
        versions: { en: { title: 'The colour comes from the heat of my hand', body: ['I press a stick of lacquer against the wood while it spins. The friction melts it. Too hard and it smears; too soft and nothing sticks.', 'When the power goes, the lathe stops, and so do I. People think toys are quick. A good top takes me most of a morning.'] } } },
      { id: 's-gods', maker: 'm-gopal', ring: 'culture', card: 'Culture ring · card 1', date: '02 Oct 2026', tier: 'public', rights: 'KR-2', orig: 'hi', media: true, mediaAlt: 'Carved and painted figures of deities', depicts: 'Object', consent: c('Hindi', 'Gopal Prajapati', ['page', 'press'], 'KR-2'), corrections: [],
        versions: { en: { title: 'Villages come here to buy their gods', body: ['Before a festival, priests walk from villages two days away to collect plaques of Dharmraj and Nagdev. They pay what they can, and we do not argue.', 'Tourists buy the same plaques to hang in their living rooms. I am glad they buy. I only ask that they know what it is.'] } } },
      { id: 's-count', maker: 'm-salma', ring: 'lineage', card: 'Lineage ring · card 1', date: '28 Sep 2026', tier: 'public', rights: 'KR-1', orig: 'hi', media: true, mediaAlt: 'Colourful handwoven textiles on a stone wall', depicts: 'Object', consent: c('Hindi', 'Salma Bano', ['page'], 'KR-1'), corrections: [],
        versions: { en: { title: 'My grandmother’s count', body: ['Every dhurrie starts with a count my grandmother used — so many threads of red, then a gap, then the border. She never wrote it down. Nor have I.', 'My daughter wants to study. Good. I have recorded the count on Karigar, private, so it is somewhere if she ever wants it.'] } } },
      { id: 's-walls', maker: 'm-sita', ring: 'place', card: 'Place ring · card 1', date: '20 Sep 2026', tier: 'public', rights: 'KR-3', orig: 'hi', media: false, consent: c('Maithili', 'Sita Devi', ['page', 'teach'], 'KR-3'), corrections: [],
        versions: { en: { title: 'We painted walls first', body: ['In Mithila the women painted the walls of the marriage room — the kohbar — for the bride and groom. Paper came later, when people from outside wanted to take it home.', 'When I paint on paper I still start in the same corner I would start a wall: top left, with the sun.'] } } }
    ];
    var requests = [
      { id: 'r1', maker: 'm-rehmat', name: 'Anika Rao', org: 'Textile museum, Ahmedabad', email: 'anika@example.org', cat: 'Institutional', daysLeft: 22, status: 'pending',
        purpose: 'I would like to put a line from “Kutch had the water for it” on an exhibition panel about water and dye, credited to you.',
        purposeGu: 'પાણી અને રંગ વિશેના પ્રદર્શનમાં તમારી વાર્તાની એક લીટી, તમારા નામ સાથે, મૂકવા માંગુ છું.' },
      { id: 'r2', maker: 'm-rehmat', name: 'Lena Hoffmann', org: 'Design studio, Berlin', email: 'lena@example.com', cat: 'Commission', daysLeft: 9, status: 'pending',
        purpose: 'Do you take commissions? We are looking for twenty scarves in your own colours for a small shop.',
        purposeGu: 'શું તમે ઓર્ડર લો છો? નાની દુકાન માટે તમારા રંગોમાં વીસ સ્કાર્ફ જોઈએ છે.' }
    ];
    var partners = [{ id: 'pt1', maker: 'm-rehmat', name: 'Craft school, Bhuj — teaching team', until: '31 Mar 2027' }];
    var log = [{ at: '12 Oct 2026', text: 'Facilitator-assisted: Meera (Kutch field team) helped publish “Kutch had the water for it” with Meena present.' }];
    return { v: 2, makers: makers, stories: stories, requests: requests, partners: partners, log: log, blocked: [], deleted: false };
  }

  // Stand-in photographs (Unsplash licence) until each maker supplies their own, with consent.
  function U(id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 900) + '&q=70'; }
  var PHOTOS = {
    makers: {
      'm-rehmat': { src: U('1614025000673-edf238aaf5d4', 700), alt: 'Meena, wearing her silver bangles' },
      'm-sukhram': { src: U('1640239259272-6f26a9affb98', 700), alt: 'Raju sitting on the floor of his workshop' },
      'm-sunanda': { src: U('1632649027900-389e810204e6', 700), alt: 'Asha working thread by hand' },
      'm-ngaleng': { src: U('1524497440-4da55062cb4a', 700), alt: 'Lily’s clay-covered hands shaping a pot' },
      'm-yeola': { src: U('1640292343595-889db1c8262e', 700), alt: 'A weaver of the collective at the loom' },
      'm-ravi': { src: U('1721508490084-1b1de5b230d4', 700), alt: 'Ravi working a piece of wood' },
      'm-gopal': { src: U('1726931535215-e4c6e05a2cff', 700), alt: 'Gopal sitting among his finished figures' },
      'm-salma': { src: U('1773847099204-238d283b2845', 700), alt: 'Salma’s hands tying the fringe of a rug' },
      'm-sita': { src: U('1738322212738-40d684b36beb', 700), alt: 'Sita on the floor beside her water bowl and brushes' }
    },
    stories: {
      's-water': U('1705248383815-c6bc07898592'),
      's-peacock': U('1585751092218-cea84c1ecf01'),
      's-hillsides': U('1613833684971-9411a2b00970'),
      's-wax': U('1763475945282-a5e1a1e189df'),
      's-gods': U('1765441863467-12214bb5d729'),
      's-count': U('1766585749270-441fb7a3a11f')
    }
  };

  // Generic Ludo Mandala — the same questions every artisan sees. Inner ring first.
  var GBOARD = {
    why: {
      craft: 'The centre of the board: what the craft is called at home, what it does well, what its maker hopes for it.',
      place: 'Craft belongs somewhere. This ring records where — at whatever level of detail the maker is comfortable sharing.',
      lineage: 'Who passed it on, and who it is being passed to. Teachers are named and credited, if the maker wants.',
      material: 'Tools, materials, and what is getting harder to find. Often the ring buyers and researchers find most useful.',
      culture: 'When the work is used, worn or gifted — and what outsiders should not copy.',
      pride: 'The outer ring: what the maker wants credit for, what they would never sell, what they want remembered.'
    },
    cards: [
      ['craft', 'What do you call your craft at home?'], ['craft', 'What is your craft best at?'], ['craft', 'What do you wish for it?'],
      ['place', 'Why is this craft made here?'], ['place', 'Where do you sit to work?'], ['place', 'What would you show a visitor first?'],
      ['lineage', 'Who taught you?'], ['lineage', 'How old were you when you started?'], ['lineage', 'Who are you teaching?'],
      ['material', 'What is your most important tool?'], ['material', 'Where do your materials come from?'], ['material', 'What is getting harder to find?'], ['material', 'What do you do with the leftovers?'],
      ['culture', 'When is your work used or worn?'], ['culture', 'Is there a song or saying that goes with it?'], ['culture', 'What should outsiders not copy?'], ['culture', 'Which festival keeps you busiest?'], ['culture', 'What has changed in what people ask for?'],
      ['pride', 'What would you never sell?'], ['pride', 'Who should get credit?'], ['pride', 'What do you want the next generation to know?'], ['pride', 'What makes your work yours?'], ['pride', 'What would you change about how buyers treat you?']
    ]
  };


  // The Craft Voice Kit — six theme decks, one per ring. Wording follows the printed cards.
  var THEMES = [
    { ring: 'craft', name: 'My Craft', cover: '/cards/craft.png', bg: '#F5E4F6', ink: '#5B2A6B', intro: 'These prompts help you talk about what your craft is in your own words: what it is called, what makes it different, the motifs and colours you use, and the part of the work you are most specialised in.',
      groups: [
        { name: 'How you describe your craft', cards: [['What do you call this craft in your own language?', 'How would you explain it to someone who has never seen it?'], ['How do you usually describe your craft?', 'What do you say about it to people around you, like buyers or children?'], ['What makes this craft different?', 'What is one thing that sets it apart from other work around you?']] },
        { name: 'Motifs and colours', cards: [['Name a motif you often make. What does it mean to you?', 'Which colours feel most true to this craft, and why?'], ['The story of one motif', 'Think of one real piece with this motif. What did people say or feel about it?'], ['Have the colours changed over time?', 'If yes, what changed, and what has stayed the same?']] },
        { name: 'Specialisation and living practice', cards: [['Which part of this craft are you best at?', 'What have you or your group added, changed or invented in it?'], ['What do people come to you for?', 'What do they ask you to do because you do it best?'], ['What would you keep, and what would you change?', 'From the changes you have seen, name one of each.']] } ] },
    { ring: 'place', name: 'Place', cover: '/cards/place.png', bg: '#E2F2EF', ink: '#1D5B54', intro: 'These prompts help you talk about how your craft is tied to your home: where people say it belongs, what the land and water give your work, and how changes in the place have affected your craft and feelings.',
      groups: [
        { name: 'Where the craft belongs', cards: [['Where does this craft come from?', 'Which place or region do people connect with this craft?'], ['How is it said in your local language?', 'When people say where this craft is from, what words do they use?'], ['Feeling of belonging to this place', 'When you say it belongs here, what about this place makes you proud?']] },
        { name: 'What the place gives', cards: [['What does this place give to the craft?', 'What from its soil, water or plants do you use? Give one example.'], ['One moment of using it', 'Tell us about a day you used this thing from the place in your work.'], ['What changes if it is missing?', 'If it is not available, what do you have to do differently?']] },
        { name: 'How the place has changed', cards: [['How has this place changed?', 'Since you began this craft, has the water, land, weather or roads changed? Name one change that affected your work.'], ['Before and after', 'How was your work before this change, and how is it now?'], ['Your first feeling about the change', 'What do you feel first: worry, relief, anger, joy or something else? Why?']] } ] },
    { ring: 'lineage', name: 'Legacy', cover: '/cards/lineage.png', bg: '#FBE8E8', ink: '#7E1418', intro: 'These prompts help you talk about the people and generations behind your craft: who taught you, how the work has travelled through your family, and how teaching happens today, including where it feels strong and where it is becoming difficult.',
      groups: [
        { name: 'Who taught you', cards: [['Who first taught you this craft?', 'Who are they, and how are they related to you?'], ['One teaching memory', 'Tell us about one day they were teaching you that you still remember clearly.'], ['What they said or did that stayed with you', 'Is there one thing they said or did that you still remember when you work today?']] },
        { name: 'The chain across generations', cards: [['How many generations in your family have done this work, including you?', 'Who did it before you, and who is doing it after you?'], ['How would you draw your craft family as a line?', 'For example: grandfather \u2192 father \u2192 me \u2192 my daughter.'], ['Where does the chain feel strong or weak?', 'Who holds the craft strongly now, and where is it becoming weak?']] },
        { name: 'How teaching happens', cards: [['How do you usually teach this craft?', 'Describe one real moment when you were teaching, or trying to teach, this work.'], ['Picture that moment', 'Where were you sitting or standing, and what were your hands doing?'], ['One difficulty in teaching', 'What made it hard to teach: time, money, other work, or their interest?']] } ] },
    { ring: 'material', name: 'Material & Tools', cover: '/cards/material.png', bg: '#F9E8E4', ink: '#8A3A32', intro: 'These prompts help you talk about what your hands work with every day: which materials and tools you use, how they behave in your hands, and how changes in materials have made some things easier and some things harder.',
      groups: [
        { name: 'What you work with', cards: [['Which materials do you use most?', 'Where does each one come from: a market, a forest, a river or a house?'], ['Your first time with this material', 'Do you remember when you first worked with it? Tell us a little about that time.'], ['What makes this material different?', 'Compared to others you have used, what is special about this one?']] },
        { name: 'Material behaviour', cards: [['A moment the material \u2018spoke\u2019 to you', 'When did your hands tell you \u2018this is right\u2019 or \u2018this is wrong\u2019?'], ['What do you do when it feels wrong?', 'When it does not feel right in your hands, what is your next step?'], ['How long does one piece take to finish?', 'Is there a part you should never rush? What changes when you must work faster?']] },
        { name: 'When the material changed', cards: [['Have the materials changed since your elders\u2019 time?', 'Name one change in material that affected your work.'], ['Why did this change happen?', 'In your view, what was the reason?'], ['What was gained, and what was lost?', 'Because of this change, what became easier and what became harder?']] } ] },
    { ring: 'culture', name: 'Cultural Meaning', cover: '/cards/culture.png', bg: '#E6EEF8', ink: '#1E4A7C', intro: 'These prompts help you talk about what your craft means in your community: when it appears in everyday and special life, what rules people follow around it, and which designs or uses should not be sold or shown outside.',
      groups: [
        { name: 'When your craft appears in life', cards: [['How do your family or community use things made with this craft?', 'Name one everyday use and one special use.'], ['Why are these things important to use?', 'Are there cultural or social reasons? Why do they matter to you, your home or your community?'], ['Your feelings about these things', 'Pride, attachment, devotion, fulfilment or something else?']] },
        { name: 'Special and everyday', cards: [['Is anything from this craft kept only for special days?', 'If yes, tell us about one such thing.'], ['Are there rules around using it?', 'Who can touch it, when does it come out, and where is it kept?'], ['How would it feel if it were missing?', 'If it was not there on that special day, what would change for people?']] },
        { name: 'What is not for sale', cards: [['Is there a design, motif or use that should not be sold or shown to outsiders?', 'Share one example and why you feel that way.'], ['Why is this boundary important?', 'Why should it stay within the family or community?'], ['What could you share with outsiders instead?', 'What kind of design or story are you comfortable sharing?']] } ] },
    { ring: 'pride', name: 'Pride & Stake', cover: '/cards/pride.png', bg: '#FCEFD2', ink: '#3D2B0E', intro: 'These prompts help you talk about what is at stake in this craft: what makes you feel proud, what would be lost if the work stopped, and which changes you want to keep, let go, or resist in the future.',
      groups: [
        { name: 'What makes you proud', cards: [['What makes you proud of this craft, or your work in it?', 'Think of one piece, one skill or one moment.'], ['A moment when that pride was visible', 'Tell us about one moment when you felt this pride very strongly.'], ['Who shared that pride with you?', 'Did anyone notice or say something that you still remember?']] },
        { name: 'What would be lost', cards: [['If you had to stop this craft, what would be lost for you, your family or community?', 'Imagine one day without this craft. What would be different?'], ['Who would feel that loss most?', 'You, someone in your family, or the whole community?'], ['On a normal day, how many hours go into this craft, including small tasks?', 'When time is tight, like before a delivery or festival, what changes, and what do you feel you lose?']] },
        { name: 'How your craft has changed', cards: [['How has this craft changed in your lifetime?', 'Tell us about one change you have seen.'], ['A change you or other artisans started', 'Did you or artisans around you decide to make a change yourselves? Tell us about it.'], ['What would you keep, and what would you let go?', 'From all the changes you have seen, name one of each.']] } ] }
  ];
  GBOARD.cards = []; GBOARD.why = {};
  THEMES.forEach(function (t) { GBOARD.why[t.ring] = t.intro; t.groups.forEach(function (g, gi) { g.cards.forEach(function (c) { GBOARD.cards.push([t.ring, c[0], c[1], g.name, gi + 1]); }); }); });

  var REFLECT = { bg: '#D6EBD9', ink: '#3B5A24', cards: [
    { name: 'Strength', cover: '/cards/r-strength.png', q: 'From everything you shared today, what feels strongest in your craft right now?', hint: 'Tell us one thing that is going well.', does: 'Names one real strength, so the conversation is not only about loss or risk.' },
    { name: 'Concern', cover: '/cards/r-concern.png', q: 'From everything you have shared, what worries you most about this craft?', hint: 'Tell us one concern that feels important.', does: 'Names one worry about the craft\u2019s future, and treats it with honesty and care.' },
    { name: 'Sharing & Boundary', cover: '/cards/r-sharing.png', q: 'What are you happy to share with outsiders, and what would you keep within your family or community?', hint: 'Name one thing to share and one thing to keep private.', does: 'Decides which parts of the story may travel. The maker\u2019s boundaries come first.' },
    { name: 'Future', cover: '/cards/r-future.png', q: 'What is one change you would like to see in this craft, and one thing you want to keep as it is?', hint: 'Name one change and one thing to keep.', does: 'Names one change wanted, and one thing that must stay the same.' } ] };

  var STORYCARDS = { bg: '#FBF1E1', ink: '#262C5E', cards: [
    { code: 'SS1', q: 'Tell us about one moment in this craft that taught you something important.', hint: 'What happened in that moment? What did you learn from it?' },
    { code: 'SS2', q: 'Tell us about one moment in this craft that has stayed with you.', hint: 'Why has it stayed with you? How do you feel when you remember it now?' },
    { code: 'SS3', q: 'Tell us about one moment from this craft that you wish others understood better.', hint: 'Who do you wish understood it better? What do people usually miss in such moments?' } ] };

  var PRINT = [
    { name: 'My Craft', id: 'craft', note: 'A3 portrait \u00b7 duplex, flip on long edge' },
    { name: 'Place', id: 'place', note: 'A3 portrait \u00b7 duplex, flip on long edge' },
    { name: 'Legacy', id: 'lineage', note: 'A3 portrait \u00b7 duplex, flip on long edge' },
    { name: 'Material & Tools', id: 'material', note: 'A3 landscape \u00b7 duplex, flip on short edge' },
    { name: 'Cultural Meaning', id: 'culture', note: 'A3 portrait \u00b7 duplex, flip on long edge' },
    { name: 'Pride & Stake', id: 'pride', note: 'A3 landscape \u00b7 duplex' },
    { name: 'Reflection cards', id: 'reflection', note: 'A3 portrait \u00b7 duplex' }
  ].map(function (p) { var f = '/kit/print/' + p.id; return { name: p.name, note: p.note, enFront: f + '-en-front.svg', enBack: f + '-en-back.svg', hiFront: f + '-hi-front.svg', hiBack: f + '-hi-back.svg' }; });

  var TESTI = {
    org: [
      { who: 'Meera Joshi', role: 'Field coordinator', org: 'Kutch Mahila Craft Sangathan', ring: 'place', text: 'We used to write the artisan bios ourselves, and we got them wrong. Now a session takes an afternoon, and the women correct the drafts before anything goes out — sometimes twice.' },
      { who: 'Anil Netam', role: 'Programme lead', org: 'Bastar Metal Craft Cooperative', ring: 'material', text: 'The consent screens took our members longer than we expected. That is the point. Two of them chose to keep everything private, and the app treats that as a complete answer.' },
      { who: 'Kavya Rao', role: 'Curator', org: 'Textile museum, Ahmedabad', ring: 'culture', text: 'We needed one quote for a panel. The request went through Karigar, Meena replied within a week and corrected our caption. No other sourcing process has given us that.' }
    ],
    art: [
      { maker: 'm-rehmat', lang: 'Said in Gujarati', text: 'I speak, it writes. When it writes wrong, I fix it. My daughter used to do this for me — now I do it myself.' },
      { maker: 'm-sukhram', lang: 'Said in Hindi', text: 'A shop in Delhi wanted my photos for their website. Karigar asked me first. Before, nobody asked.' },
      { maker: 'm-ngaleng', lang: 'Said in English', text: 'Two stories I kept only for my family. The rest everyone can see. Good that it is my choice, not theirs.' }
    ]
  };

  // Makers who use Karigar privately. Shown only as a craft and region, never a name.
  var PRIVATE = [
    { craft: 'Kantha embroidery', region: 'West Bengal', note: 'Keeps every story in her private archive.' },
    { craft: 'Bidri metalwork', region: 'Karnataka', note: 'Shares only with partners he approves.' },
    { craft: 'Bandhani', region: 'Gujarat', note: 'Recording for her grandchildren, not for the public.' }
  ];

  var PCHECK = [
    'Open any story: the maker’s chosen name is on it, and on every image.',
    'Every story says what it may be used for. When a maker withdraws it, it is gone from this site within minutes.',
    'Read the question cards on the board — none asks about money, hardship or need.',
    'Try to reuse a story commercially: Karigar asks for a separate agreement with the maker first.',
    'Most makers never publish anything. The private tiles on the makers page are real accounts.',
    'Each story lists its corrections, dated, in public.',
    'Every core task works by voice, in the maker’s language, on a low-cost phone.',
    'Our reports count credit, contact and correction. You will not find a view count anywhere.',
    'AI training is off on every story unless the maker turns it on.',
    'Partner access always shows an end date, and never renews by itself.',
    'Council decisions are public, dated, and each maps to a setting you can read.'
  ];

  // A photo essay told in the maker's own words, one frame per step.
  var ESSAY = { maker: 'm-rehmat', title: 'One odhani, eleven days', sub: 'Meena recorded these lines on her phone while she worked. The photos are stand-ins until she chooses her own.',
    frames: [
      { src: U('1705250466297-90035b3a2b26', 700), day: 'Day 1', line: 'The cloth comes washed and folded in four. I mark the dots with geru and a wooden block.' },
      { src: U('1465199549974-7d82de6e2830', 700), day: 'Days 2–7', line: 'Then we tie. Four of us on the floor, the radio on. About three thousand knots.' },
      { src: U('1705248383815-c6bc07898592', 700), day: 'Day 8', line: 'Yellow first. Then we tie again over the yellow, and it goes into the red.' },
      { src: U('1558703374-f9a51255e1cc', 700), day: 'Days 9–11', line: 'It dries in the yard. You only see the pattern when you pull the knots open.' }
    ] };

  // Meena's mandala board, as recorded in her first session. Outer ring first.
  var BOARD = [
    { ring: 'craft', q: 'What do you call your craft?', a: 'Bandhani. At home we just say bandhej, the tying.' },
    { ring: 'craft', q: 'What is it best at?', a: 'Colour that stays bright for thirty years.' },
    { ring: 'craft', q: 'What do you wish for it?', a: 'That a girl in Bhuj chooses it, not falls into it.' },
    { ring: 'pride', q: 'What would you never sell?', a: 'One pattern we tie only for our own daughters’ weddings.' },
    { ring: 'pride', q: 'What makes your work yours?', a: 'You can tell my red from across the lane. People do.' },
    { ring: 'pride', q: 'Who should get credit?', a: 'The four women who tie with me. Write their names too.' },
    { ring: 'pride', q: 'What would you change about how buyers treat you?' },
    { ring: 'pride', q: 'What do you want your granddaughter to know?' },
    { ring: 'culture', q: 'When is bandhani worn?', a: 'Red for the bride. Yellow when a baby comes.' },
    { ring: 'culture', q: 'Is there a song or saying that goes with it?', a: 'My mother hummed while tying. I don’t know the words any more.' },
    { ring: 'culture', q: 'What should outsiders not copy?' },
    { ring: 'culture', q: 'Which festival keeps you busiest?', a: 'Before Navratri we don’t sleep properly for a month.' },
    { ring: 'culture', q: 'What has changed in what people ask for?' },
    { ring: 'material', q: 'What is your most important tool?', a: 'My thumbnail. And a good needle, the old kind.' },
    { ring: 'material', q: 'Where does your cloth come from?', a: 'Mill cotton from Ahmedabad. Silk only when someone pays first.' },
    { ring: 'material', q: 'What is hardest to get now?', a: 'Sweet water. We buy it from tankers.' },
    { ring: 'material', q: 'What do you do with the leftovers?' },
    { ring: 'lineage', q: 'Who taught you?', a: 'My mother. She did not explain. I watched.' },
    { ring: 'lineage', q: 'How old were you when you started?', a: 'Nine. My first dots were too big.' },
    { ring: 'lineage', q: 'Who are you teaching?' },
    { ring: 'place', q: 'Why is this craft here?', a: 'Kutch had the water for it, so it stayed.' },
    { ring: 'place', q: 'Where do you work?', a: 'On the floor of my front room, near the door for light.' },
    { ring: 'place', q: 'What would you show a visitor first?' }
  ];

  // Notes left by people who worked with a maker through Karigar. The maker approves each one before it shows.
  var VOICES = [
    { maker: 'm-rehmat', who: 'Anika Rao', role: 'Curator, textile museum, Ahmedabad', date: 'Oct 2026', what: 'Exhibition panel',
      text: 'We asked for one line for a panel on water and dye. Meena sent it back with a correction to our caption — we had written “boiled”. She was right. The panel is better for it.' },
    { maker: 'm-sukhram', who: 'Tomás Ibarra', role: 'Lighting studio, Lisbon', date: 'Aug 2026', what: 'Commission · 12 lamps',
      text: 'The lamps arrived three weeks after the date we agreed — the monsoon held up the firing, and he told us so early. Every one is slightly different, which is what we wanted. We’ve ordered again.' },
    { maker: 'm-ngaleng', who: 'Priya Menon', role: 'Teacher, design school, Bengaluru', date: 'Sep 2026', what: 'Teaching use',
      text: 'My second-years used “Only two hillsides” in a materials module. Two students wrote to Lily with questions and she answered both, in a voice note, in English. It was the best session of the term.' },
    { maker: 'm-yeola', who: 'Hemant Kulkarni', role: 'Journalist, Pune', date: 'Jul 2026', what: 'Press',
      text: 'They asked me to credit the collective, not one weaver. I had to rewrite my lede. Fair enough — the sari really is made by eleven people.' }
  ];

  return { RINGS: RINGS, RIGHTS: RIGHTS, TIERS: TIERS, PURPOSES: PURPOSES, CATS: CATS, L: L, PRINCIPLES: PRINCIPLES, DECISIONS: DECISIONS, PHOTOS: PHOTOS, ESSAY: ESSAY, BOARD: BOARD, VOICES: VOICES, GBOARD: GBOARD, THEMES: THEMES, REFLECT: REFLECT, STORYCARDS: STORYCARDS, PRINT: PRINT, TESTI: TESTI, PRIVATE: PRIVATE, PCHECK: PCHECK, seed: seed };
})();
