// Karigar public website — reference data and sample records.
// Every maker here is a composite persona drawn from the toolkit's sample records, not a real individual.
window.KARIGAR_SITE = (function () {
  var RINGS = {
    craft: { label: 'My Craft', color: '#B98BE0', ink: '#4A2A6B', soft: '#F3ECFA' },
    place: { label: 'Place', color: '#6FC9B8', ink: '#1F5F54', soft: '#E6F6F2' },
    lineage: { label: 'Lineage', color: '#A81C24', ink: '#7A1319', soft: '#FBEAE8' },
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
      { id: 'm-rehmat', name: 'Rehmatbai Khatri', local: 'રહેમતબાઈ ખત્રી', craft: 'Bandhani', craftLocal: 'બાંધણી', cat: 'Textile', ring: 'place', lang: 'gu',
        loc: { village: 'Bhuj taluka', district: 'Kutch district', state: 'Gujarat', region: 'Western India' }, gran: 'district',
        langs: ['Gujarati', 'Kutchi'], practice: 'Tying since she was nine', credit: 'Rehmatbai Khatri, bandhani maker, Kutch',
        about: 'I tie bandhani with the women of my lane. The dots are small and the work is long. I would rather you hear it from me.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-sukhram', name: 'Sukhram Vishwakarma', local: 'सुखराम विश्वकर्मा', craft: 'Dhokra casting', craftLocal: 'ढोकरा ढलाई', cat: 'Metal', ring: 'material', lang: 'hi',
        loc: { village: 'Kondagaon', district: 'Kondagaon district', state: 'Chhattisgarh', region: 'Central India' }, gran: 'state',
        langs: ['Hindi', 'Halbi'], practice: 'Twenty-two years at the furnace', credit: 'Sukhram Vishwakarma, dhokra caster, Bastar',
        about: 'My father cast lamps for the village. I cast what people ask for now, but I still begin every piece the way he did, with wax.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-sunanda', name: 'Sunanda Bhalerao', local: 'सुनंदा भालेराव', craft: 'Paithani weaving', craftLocal: 'पैठणी विणकाम', cat: 'Textile', ring: 'culture', lang: 'mr',
        loc: { village: 'Yeola', district: 'Nashik district', state: 'Maharashtra', region: 'Western India' }, gran: 'district',
        langs: ['Marathi'], practice: 'At the loom since sixteen', credit: 'Sunanda Bhalerao, paithani weaver, Yeola',
        about: 'In Yeola there is a loom in every lane. I weave borders, mostly peacocks, and lately I teach my daughter-in-law.',
        contact: { open: false, until: '1 December 2026' }, collective: 'm-yeola' },
      { id: 'm-ngaleng', name: 'Ngalengnam Shaiza', local: 'Ngalengnam Shaiza', craft: 'Longpi pottery', craftLocal: 'Longpi ham', cat: 'Clay', ring: 'place', lang: 'en',
        loc: { village: 'Longpi Kajui', district: 'Ukhrul district', state: 'Manipur', region: 'Northeast India' }, gran: 'district',
        langs: ['Tangkhul', 'English'], practice: 'Fourteen years of hand-building', credit: 'Ngalengnam Shaiza, Longpi potter, Ukhrul',
        about: 'We do not use a wheel. Everything is shaped by hand on a flat stone, the way my aunt showed me.',
        contact: { open: true, until: '' }, collective: null },
      { id: 'm-yeola', name: 'Yeola Handloom Sisters', local: 'येवला हातमाग भगिनी', craft: 'Paithani weaving', craftLocal: 'पैठणी', cat: 'Textile', ring: 'culture', lang: 'mr', isCollective: true,
        loc: { village: 'Yeola', district: 'Nashik district', state: 'Maharashtra', region: 'Western India' }, gran: 'district',
        langs: ['Marathi'], practice: 'Eleven weavers, three looms', credit: 'Yeola Handloom Sisters (collective), Nashik',
        about: 'Eleven of us share three looms and one dye room. We are credited as a group because the sari is made by a group.',
        members: ['Sunanda Bhalerao', 'and ten weavers who keep their names private'], contact: { open: true, until: '' }, collective: null }
    ];
    function c(lang, by, purposes, rights) { return { purposes: purposes, duration: 'open', until: '', rights: rights, grantedAt: '12 Oct 2026', lang: lang, by: by, assisted: true }; }
    var stories = [
      { id: 's-water', maker: 'm-rehmat', ring: 'place', card: 'Place ring · card 2', date: '12 Oct 2026', tier: 'public', rights: 'KR-2', orig: 'gu', media: true, mediaAlt: 'Tied cloth drying after the red dye bath', depicts: 'Process',
        consent: c('Gujarati', 'Rehmatbai Khatri', ['page', 'press'], 'KR-2'),
        corrections: [{ date: '18 Oct 2026', note: 'An earlier version said the dye bath is boiled for an hour. Rehmatbai corrected this: it is kept warm, never boiled.' }],
        versions: {
          en: { title: 'Kutch had the water for it', body: ['People ask why bandhani is here and not somewhere else. I tell them: we did not bring it. Kutch had the water for it, so it stayed.', 'The red comes out differently from each well. My mother knew which well gave the deepest colour before the monsoon and which one after. We keep the dye bath warm, never boiling, or the knots loosen. Now the water has gone down, we buy it from tankers, and the red is never quite the same twice.', 'I don’t call it heritage. It is our work. It belongs to this place the way the salt does.'] },
          gu: { title: 'કચ્છમાં એનું પાણી હતું', body: ['લોકો પૂછે છે કે બાંધણી અહીં જ કેમ છે. હું કહું છું: અમે એને અહીં લાવ્યા નથી. કચ્છમાં એનું પાણી હતું, એટલે એ અહીં રહી ગઈ.', 'દરેક કૂવાનું પાણી લાલ રંગ જુદો કાઢે છે. મારી મા જાણતી કે ચોમાસા પહેલાં કયો કૂવો ઘેરો રંગ આપે. રંગનું પાણી ગરમ રાખીએ, ઉકાળીએ નહીં, નહીં તો ગાંઠ ઢીલી થાય.', 'હું એને વારસો નથી કહેતી. એ અમારું કામ છે. મીઠાની જેમ એ આ જગ્યાનું છે.'] }
        } },
      { id: 's-thumb', maker: 'm-rehmat', ring: 'lineage', card: 'Lineage ring · card 1', date: '12 Oct 2026', tier: 'link', rights: 'KR-1', orig: 'gu', media: false, consent: c('Gujarati', 'Rehmatbai Khatri', ['page'], 'KR-1'), corrections: [],
        versions: {
          en: { title: 'My mother’s thumbnail', body: ['My mother kept the nail of her left thumb long. That was her tool — she lifted the cloth over it to make each dot. I was nine when she put the cloth in my hand.', 'She did not explain. She tied, I watched, and when my dot was too big she untied it without a word. That silence taught me more than any instruction.'] },
          gu: { title: 'મારી માનો અંગૂઠો', body: ['મારી મા ડાબા અંગૂઠાનો નખ લાંબો રાખતી. એ જ એનું ઓજાર હતું. હું નવ વર્ષની હતી ત્યારે એણે કાપડ મારા હાથમાં મૂક્યું.', 'એ સમજાવતી નહીં. એ બાંધતી, હું જોતી. એ ચુપકીએ મને ઘણું શીખવ્યું.'] }
        } },
      { id: 's-wedding', maker: 'm-rehmat', ring: 'pride', card: 'Pride ring · card 3', date: '12 Oct 2026', tier: 'private', rights: 'KR-0', orig: 'en', media: false, consent: null, corrections: [],
        boundary: { what: 'the wedding odhani pattern', scope: 'Do not publish', collective: true },
        versions: { en: { title: 'What we tie only for our daughters', body: ['There is one pattern we tie only for our own daughters’ weddings. A shop asked me for it last year. I said no.', 'Some things are not for sale, and not for showing either.'] } } },
      { id: 's-wax', maker: 'm-sukhram', ring: 'material', card: 'Material ring · card 2', date: '30 Sep 2026', tier: 'public', rights: 'KR-1', orig: 'hi', media: true, mediaAlt: 'Wax threads wound around a clay core', depicts: 'Process', consent: c('Hindi', 'Sukhram Vishwakarma', ['page', 'teach'], 'KR-1'), corrections: [],
        versions: {
          en: { title: 'Wax is my pencil', body: ['Before the metal, there is wax. I draw with it — thin threads of beeswax and resin, wound around the clay core while it is still soft in my hands.', 'In winter the wax goes stiff and I keep it by the fire. In May it melts if I look at it. Every figure you see began as a thread I pulled with my thumb.', 'When the metal is poured, the wax is gone. Nothing of my drawing remains except its shape in brass.'] },
          hi: { title: 'मोम मेरी पेंसिल है', body: ['धातु से पहले मोम होता है। मैं उसी से चित्र बनाता हूँ — मधुमक्खी के मोम और राल के पतले धागे, जिन्हें मिट्टी के साँचे पर लपेटता हूँ जब वह अभी नरम होता है।', 'सर्दी में मोम सख़्त हो जाता है, तो उसे आग के पास रखता हूँ। मई में तो देखने भर से पिघल जाता है।', 'जब धातु डाली जाती है, मोम चला जाता है। मेरे चित्र में से कुछ नहीं बचता, बस पीतल में उसका आकार।'] }
        } },
      { id: 's-pond', maker: 'm-sukhram', ring: 'place', card: 'Place ring · card 3', date: '30 Sep 2026', tier: 'public', rights: 'KR-2', orig: 'hi', media: false, consent: c('Hindi', 'Sukhram Vishwakarma', ['page', 'press'], 'KR-2'), corrections: [],
        versions: {
          en: { title: 'The clay by the school pond', body: ['The core needs clay that holds. Ours comes from the edge of the pond behind the old school. Clay from other places cracks on the mould.', 'Last year they started building there. I went every evening for a month to fill sacks before it was gone.'] },
          hi: { title: 'स्कूल के तालाब वाली मिट्टी', body: ['भीतर के साँचे के लिए ऐसी मिट्टी चाहिए जो टिके। हमारी मिट्टी पुराने स्कूल के पीछे वाले तालाब के किनारे से आती है।', 'पिछले साल वहाँ निर्माण शुरू हुआ। मैं महीने भर हर शाम बोरियाँ भरने जाता रहा।'] }
        } },
      { id: 's-peacock', maker: 'm-sunanda', ring: 'culture', card: 'Culture ring · card 1', date: '22 Sep 2026', tier: 'public', rights: 'KR-0', orig: 'mr', media: true, mediaAlt: 'Peacock border on the loom, half woven', depicts: 'Object', consent: c('Marathi', 'Sunanda Bhalerao', ['page'], 'KR-0'), corrections: [],
        versions: {
          en: { title: 'The peacock border takes a week', body: ['A paithani border is woven with the hand, not the shuttle. Every colour in the peacock is a separate little bobbin that I pass through and turn back.', 'One border takes me a week if no one is ill and the power stays on. My daughter-in-law sits at the other side of the loom now. She is faster than I was at her age.'] },
          mr: { title: 'मोराचा काठ आठवडा घेतो', body: ['पैठणीचा काठ धोट्याने नाही, हाताने विणला जातो. मोरातला प्रत्येक रंग वेगळ्या छोट्या कांडीचा असतो.', 'घरात कोणी आजारी नसेल आणि वीज टिकली तर एक काठ आठवड्यात होतो. आता माझी सून मागाच्या दुसऱ्या बाजूला बसते.'] }
        } },
      { id: 's-hillsides', maker: 'm-ngaleng', ring: 'place', card: 'Place ring · card 1', date: '16 Sep 2026', tier: 'public', rights: 'KR-3', orig: 'en', media: true, mediaAlt: 'Black stone and weathered rock, ground for clay', depicts: 'Material', consent: c('English', 'Ngalengnam Shaiza', ['page', 'teach'], 'KR-3'), corrections: [],
        versions: { en: { title: 'Only two hillsides', body: ['Longpi ham needs a black serpentine stone mixed with weathered rock. It comes from two hillsides near the village. Without that rock there is no Longpi, anywhere.', 'We don’t use a wheel. I shape every pot by hand on a flat stone, then fire it and rub it with leaves while it is hot. That is where the black shine comes from.'] } } },
      { id: 's-together', maker: 'm-yeola', ring: 'pride', card: 'Reflection · Sharing', date: '08 Sep 2026', tier: 'public', rights: 'KR-2', orig: 'mr', media: false, consent: c('Marathi', 'Yeola Handloom Sisters', ['page', 'press'], 'KR-2'), corrections: [],
        versions: {
          en: { title: 'Why we weave together', body: ['Eleven of us share three looms and one dye room. When an order comes, we decide together who weaves which part.', 'We are credited as a group because the sari is made by a group. If you write about it, please name the collective, not one of us.'] },
          mr: { title: 'आम्ही एकत्र का विणतो', body: ['आम्ही अकरा जणी तीन माग आणि एक रंगखोली वाटून घेतो. ऑर्डर आली की कोण कोणता भाग विणणार हे आम्ही मिळून ठरवतो.', 'साडी गट बनवतो, म्हणून श्रेय गटाला. याबद्दल लिहिलं तर गटाचं नाव द्या.'] }
        } }
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
    var log = [{ at: '12 Oct 2026', text: 'Facilitator-assisted: Meera (Kutch field team) helped publish “Kutch had the water for it” with Rehmatbai present.' }];
    return { v: 1, makers: makers, stories: stories, requests: requests, partners: partners, log: log, blocked: [], deleted: false };
  }

  // Stand-in photographs (Unsplash licence) until each maker supplies their own, with consent.
  function U(id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 900) + '&q=70'; }
  var PHOTOS = {
    makers: {
      'm-rehmat': { src: U('1558703374-f9a51255e1cc'), alt: 'Dyed cloth drying on a line in the sun' },
      'm-sukhram': null,
      'm-sunanda': { src: U('1540292370723-60cf448886c3'), alt: 'Handwoven silk in pink, green and blue' },
      'm-ngaleng': { src: U('1524497440-4da55062cb4a'), alt: 'A potter’s clay-covered hands shaping a pot' },
      'm-yeola': { src: U('1626889268968-2280ec97c38b'), alt: 'Rolls of dyed yarn ready for the loom' }
    },
    stories: {
      's-water': U('1705248383815-c6bc07898592'),
      's-peacock': U('1585751092218-cea84c1ecf01'),
      's-hillsides': U('1613833684971-9411a2b00970')
    }
  };

  // A photo essay told in the maker's own words, one frame per step.
  var ESSAY = { maker: 'm-rehmat', title: 'One odhani, eleven days', sub: 'Rehmatbai recorded these lines on her phone while she worked. The photos are stand-ins until she chooses her own.',
    frames: [
      { src: U('1705250466297-90035b3a2b26', 700), day: 'Day 1', line: 'The cloth comes washed and folded in four. I mark the dots with geru and a wooden block.' },
      { src: U('1465199549974-7d82de6e2830', 700), day: 'Days 2–7', line: 'Then we tie. Four of us on the floor, the radio on. About three thousand knots.' },
      { src: U('1705248383815-c6bc07898592', 700), day: 'Day 8', line: 'Yellow first. Then we tie again over the yellow, and it goes into the red.' },
      { src: U('1558703374-f9a51255e1cc', 700), day: 'Days 9–11', line: 'It dries in the yard. You only see the pattern when you pull the knots open.' }
    ] };

  // Rehmatbai's mandala board, as recorded in her first session. Outer ring first.
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
      text: 'We asked for one line for a panel on water and dye. Rehmatbai sent it back with a correction to our caption — we had written “boiled”. She was right. The panel is better for it.' },
    { maker: 'm-sukhram', who: 'Tomás Ibarra', role: 'Lighting studio, Lisbon', date: 'Aug 2026', what: 'Commission · 12 lamps',
      text: 'The lamps arrived three weeks after the date we agreed — the monsoon held up the firing, and he told us so early. Every one is slightly different, which is what we wanted. We’ve ordered again.' },
    { maker: 'm-ngaleng', who: 'Priya Menon', role: 'Teacher, design school, Bengaluru', date: 'Sep 2026', what: 'Teaching use',
      text: 'My second-years used “Only two hillsides” in a materials module. Two students wrote to Ngalengnam with questions and she answered both, in a voice note, in English. It was the best session of the term.' },
    { maker: 'm-yeola', who: 'Hemant Kulkarni', role: 'Journalist, Pune', date: 'Jul 2026', what: 'Press',
      text: 'They asked me to credit the collective, not one weaver. I had to rewrite my lede. Fair enough — the sari really is made by eleven people.' }
  ];

  return { RINGS: RINGS, RIGHTS: RIGHTS, TIERS: TIERS, PURPOSES: PURPOSES, CATS: CATS, L: L, PRINCIPLES: PRINCIPLES, DECISIONS: DECISIONS, PHOTOS: PHOTOS, ESSAY: ESSAY, BOARD: BOARD, VOICES: VOICES, seed: seed };
})();
