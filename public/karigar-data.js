// Mandala card system — deck definitions, field schema, and one composite sample record.
// Extracted from the toolkit report. The sample artisan is a composite persona, not a real individual.

export const DECKS = [
  { id: 'theme', label: 'Theme cards', note: 'Six domains that build the primary identity map of the craft. Facilitator follow-ups belong in the same box as the answer — the agent reads them as one voice.' },
  { id: 'reflection', label: 'Reflection cards', note: 'What the artisan decided matters after sharing. These four answers govern the generation: they set the positive anchor, the risk tag, the sharing rules and the direction of any future-facing language.' },
  { id: 'story', label: 'Small Story Modules', note: 'Scene-level evidence. One concrete incident beats any amount of description — the agent is instructed to reach for these before it reaches for adjectives.' }
];

export const SCHEMA = [
  { deck: 'theme', code: 'Identity', layer: 'Identity', title: 'Who and what', ask: 'Session header. Names, craft term, how long in practice.', fields: [
    { key: 'artisan_name', label: 'Name (as they want it used)', rows: 1, hint: 'or "anonymous, 40s, Bhuj"' },
    { key: 'craft_name_local', label: 'What they call the craft', rows: 1, hint: 'the local word, not the market word' },
    { key: 'craft_region', label: 'Region', rows: 1, hint: '' },
    { key: 'practice_span', label: 'Years in practice', rows: 1, hint: '' }
  ]},
  { deck: 'theme', code: 'Place 1–3', layer: 'Place', title: 'Place', ask: 'Where the craft belongs, what the land and water give it, and how the place has changed.', fields: [
    { key: 'local_belonging_phrase', label: 'Local belonging phrase', rows: 2, hint: 'how they say the craft belongs here' },
    { key: 'ecological_input', label: 'What land / water give', rows: 3, hint: 'water quality, plants, soil, seasons' },
    { key: 'place_change', label: 'How the place has changed', rows: 3, hint: 'roads, weather, access, water table' },
    { key: 'emotion_about_place_change', label: 'Their reaction to that change', rows: 2, hint: 'in their words' }
  ]},
  { deck: 'theme', code: 'Lineage 1–3', layer: 'Transmission', title: 'Legacy', ask: 'Who taught them, how the craft moves between generations, and where transmission holds or breaks.', fields: [
    { key: 'teacher_name_relation', label: 'Who first taught them', rows: 1, hint: 'name and relation' },
    { key: 'teaching_memory', label: 'One teaching memory', rows: 3, hint: 'a scene, not a summary' },
    { key: 'remembered_phrase_gesture', label: 'Phrase or gesture passed down', rows: 2, hint: '' },
    { key: 'family_generations', label: 'Family chain', rows: 2, hint: 'who before, who after' },
    { key: 'transmission_strength', label: 'Where transmission feels strong', rows: 2, hint: '' },
    { key: 'transmission_weakness', label: 'Where it feels weak', rows: 2, hint: '' },
    { key: 'teaching_difficulty', label: 'What makes teaching hard', rows: 2, hint: 'time, money, competing work, interest' }
  ]},
  { deck: 'theme', code: 'Material 1–3', layer: 'Material intelligence', title: 'Material', ask: 'What they work with, how it behaves in the hands, and how it has changed.', fields: [
    { key: 'primary_material', label: 'Main materials', rows: 2, hint: '' },
    { key: 'material_origin', label: 'Where they come from', rows: 2, hint: '' },
    { key: 'first_contact', label: 'First contact with the material', rows: 2, hint: '' },
    { key: 'material_special', label: 'What makes it special', rows: 2, hint: 'their judgment, not a spec sheet' },
    { key: 'material_in_hands', label: 'How it behaves in the hands', rows: 3, hint: 'tactile signals' },
    { key: 'material_feels_wrong', label: 'When it "feels wrong"', rows: 2, hint: '' },
    { key: 'correction_action', label: 'What they do next', rows: 2, hint: 'the correction' },
    { key: 'material_change_gain', label: 'Change: what was gained', rows: 2, hint: '' },
    { key: 'material_change_loss', label: 'Change: what was lost', rows: 2, hint: '' }
  ]},
  { deck: 'theme', code: 'Culture 1–3', layer: 'Community + boundary', title: 'Cultural meaning', ask: 'When the craft appears in life, what is special versus everyday, and what is not for sale.', fields: [
    { key: 'occasion_of_use', label: 'When it appears in life', rows: 2, hint: '' },
    { key: 'sensory_scene', label: 'Sensory detail of that occasion', rows: 3, hint: 'sound, smell, light, crowd' },
    { key: 'remembered_community_phrase', label: 'What people said about it', rows: 2, hint: 'a remembered line' },
    { key: 'special_vs_everyday', label: 'Special versus everyday use', rows: 2, hint: '' },
    { key: 'special_object_rule', label: 'Rules around special objects', rows: 2, hint: '' },
    { key: 'not_for_sale_example', label: 'What is not for sale', rows: 2, hint: '' },
    { key: 'why_protected', label: 'Why it stays protected', rows: 2, hint: '' },
    { key: 'safer_alternative', label: 'What can be shared instead', rows: 2, hint: 'the artisan-approved substitute' }
  ]},
  { deck: 'theme', code: 'Pride 1–3', layer: 'Pride, loss, change', title: 'Pride & stakes', ask: 'What they are proud of, what would be lost, and how the craft has changed in their lifetime.', fields: [
    { key: 'pride_moment', label: 'A moment of pride', rows: 3, hint: '' },
    { key: 'recognition_by_others', label: 'Who recognised it', rows: 2, hint: '' },
    { key: 'loss_if_stopped', label: 'What would be lost if it stopped', rows: 2, hint: '' },
    { key: 'key_stakeholder_of_loss', label: 'Who would feel that loss most', rows: 2, hint: '' },
    { key: 'change_in_lifetime', label: 'Change in their lifetime', rows: 3, hint: '' },
    { key: 'artisan_initiated_change', label: 'Change they started themselves', rows: 2, hint: 'their own agency' },
    { key: 'desired_keep', label: 'What should be kept', rows: 2, hint: '' },
    { key: 'desired_let_go', label: 'What can be let go', rows: 2, hint: '' }
  ]},
  { deck: 'reflection', code: 'R1', layer: 'Positive anchor', title: 'Strength', ask: 'What feels strongest in the craft right now.', fields: [
    { key: 'strength_anchor', label: 'Strength', rows: 4, hint: '' }
  ]},
  { deck: 'reflection', code: 'R2', layer: 'Risk tag', title: 'Concern', ask: 'What worries them most. Reported, not dramatised.', fields: [
    { key: 'concern_anchor', label: 'Concern', rows: 4, hint: '' }
  ]},
  { deck: 'reflection', code: 'R3', layer: 'Boundary', title: 'Sharing & boundaries', ask: 'What can be shared, and what should stay inside the family or community.', fields: [
    { key: 'shareable_content', label: 'Explicitly shareable', rows: 3, hint: '' },
    { key: 'private_content', label: 'Keep private or abstract', rows: 3, hint: 'the agent honours this per the posture setting' }
  ]},
  { deck: 'reflection', code: 'R4', layer: 'Future', title: 'Future', ask: 'One desired change and one non-negotiable continuity.', fields: [
    { key: 'desired_change', label: 'Desired change', rows: 3, hint: '' },
    { key: 'desired_continuity', label: 'Non-negotiable continuity', rows: 3, hint: '' }
  ]},
  { deck: 'story', code: 'SS1', layer: 'Story', title: 'A moment that taught you something', ask: 'Learning through a real incident rather than abstraction.', fields: [
    { key: 'learning_story', label: 'The moment', rows: 7, hint: 'keep it as told' }
  ]},
  { deck: 'story', code: 'SS2', layer: 'Story', title: 'A moment that stayed with you', ask: 'A meaningful emotional memory.', fields: [
    { key: 'emotional_story', label: 'The moment', rows: 7, hint: '' }
  ]},
  { deck: 'story', code: 'SS3', layer: 'Story', title: 'A moment you want others to understand', ask: 'A clarifying story that answers how outsiders get it wrong.', fields: [
    { key: 'clarification_story', label: 'The moment', rows: 6, hint: '' },
    { key: 'outsider_misunderstanding', label: 'What outsiders get wrong', rows: 3, hint: '' }
  ]}
];

export const SAMPLE = {
  artisan_name: 'Meena Khatri (composite record — not a real individual)',
  craft_name_local: 'bandhej',
  craft_region: 'Bhuj taluka, Kutch, Gujarat',
  practice_span: 'tying since about the age of nine; thirty-eight years now',
  local_belonging_phrase: '"Bandhej is not something we brought here. Kutch had the water for it, so it stayed." She resists the word heritage — she calls it "our work".',
  ecological_input: 'Hard well water that she says takes the red differently from municipal water. Long dry heat for setting colour on the terrace. Harda (myrobalan) and pomegranate rind bought in Bhuj market; indigo and alizarin from traders. Cotton mulmul and gaji silk come in from outside — the region gives the water and the drying weather, not the cloth.',
  place_change: 'Piped water arrived and the old dyeing wells are mostly closed or brackish. After the 2001 earthquake the family workshop was rebuilt in concrete, which holds heat differently. Bhuj has grown out to the edge of the yard, so terrace drying now competes with dust from the road.',
  emotion_about_place_change: '"I am not sad about the pipe. I am tired of explaining to buyers why the same red is not the same red."',
  teacher_name_relation: 'Her mother Jenab, and an aunt by marriage who tied faster than anyone she has seen since.',
  teaching_memory: 'She was given a corner of a cotton odhani and told to fill it while the women worked the middle. Her mother did not correct the pattern — she pressed Meena\'s thumbnail down harder onto the cloth and moved on. "The nail does the work, not the thread." She undid her own first row twice before anyone noticed.',
  remembered_phrase_gesture: '"Naakhun thi" — with the nail. Said as a correction, always with a tap on the back of the hand rather than an explanation.',
  family_generations: 'Four generations she can name. Her mother and grandmother tied; her father and brothers dyed. Of her three children, one daughter ties competently and does not want to do it for money; her son manages orders and photography and does not tie.',
  transmission_strength: 'Tying itself. Any girl in the lane can pick up basic bheendi in a season, and the fine work still passes hand to hand at the same speed it always did.',
  transmission_weakness: 'The dye side. Judging when a bath is ready was her father\'s knowledge and nobody in the household reads a bath the way he did; they now measure and time it instead.',
  teaching_difficulty: 'Wages. A girl can earn more, faster, in a garment unit or a shop in Bhuj, and tying pays by the knot. She is clear that this is an economics problem, not a problem of respect: "They like the work. They cannot live on it."',
  primary_material: 'Cotton mulmul, gaji silk, some viscose georgette for lower-priced orders. Cotton thread for tying. Natural dyes for one line of work, chemical for the rest.',
  material_origin: 'Cloth from traders in Bhuj and Jamnagar; dye stuffs from the market; thread from a shop she has used for twenty years because the ply is consistent.',
  first_contact: 'Mulmul, at nine. She remembers it as "too soft to hold" — the cloth kept sliding out from under her nail before she learned to bunch it.',
  material_special: 'Mulmul takes a small knot cleanly; the dot stays round after washing. Georgette gives a dot that goes slightly oval, which she says buyers do not notice and she does.',
  material_in_hands: 'She reads readiness by drag. Correctly damp cloth pulls against the nail with a slight resistance and holds the pinch when released. Too dry and it springs back and the knot sits loose; too wet and the thread cuts in and leaves a mark she can see after dyeing.',
  material_feels_wrong: 'Cloth that has been over-bleached feels papery and squeaks faintly against the nail. Silk that has sat too long in the shop goes stiff at the fold.',
  correction_action: 'She damps a papery cloth down and leaves it wrapped overnight rather than working it dry; for stiff silk she works the fold between her palms first. If neither settles it, she moves that piece to a wider pattern where a loose knot will not show.',
  material_change_gain: 'Chemical dyes gave repeatability and let her quote a colour to a buyer months ahead. Synthetic grounds made cheaper stock possible, which kept the household working through slow years.',
  material_change_loss: 'The natural reds had a depth she cannot match and she says so plainly. Also lost: the old habit of dyeing to whatever the water gave that week.',
  occasion_of_use: 'Weddings mainly — the chandrokhani odhani for the bride, gharchola for other women in the party. Also childbirth and first-outing cloths within the family.',
  sensory_scene: 'The odhani is opened out in a crowded room before it is worn and the ties are pulled — the cloth makes a dry crackle as the knots release and the pattern appears at once. She says the room always goes quiet for that second and then everyone talks over each other.',
  remembered_community_phrase: 'An older woman at a wedding: "This one is tied by hand, look at the back." She had turned the cloth over to check the knots before praising it.',
  special_vs_everyday: 'Wedding pieces are tied finer and never rushed; market stock is tied by whoever is free, in patterns that forgive a loose knot.',
  special_object_rule: 'A bridal chandrokhani is not photographed for stock and is not shown to another buyer before the family has received it.',
  not_for_sale_example: 'Her mother\'s own odhani, kept in the house. Also a set of specific pattern arrangements used only for family weddings.',
  why_protected: '"That cloth already belongs to someone." The rule is about a piece being promised, not about secrecy.',
  safer_alternative: 'She is happy for the family patterns to be described in general terms and for photographs of commissioned work to be shared once delivered. She suggests photographing the tied, undyed bundle instead — "that shows the work better anyway."',
  pride_moment: 'A buyer returned a batch as defective because the dots were not identical. She took it to the shop, turned one piece over and showed the tie marks, and the order was accepted at a higher price than first agreed.',
  recognition_by_others: 'The buyer, and afterwards her son, who started photographing the reverse of every piece for the shop listing.',
  loss_if_stopped: 'The fine tying would go within a generation — the coarse work would survive as print. She is specific: printing already imitates the look, so what would be lost is the hand, not the image.',
  key_stakeholder_of_loss: 'The eleven women in the lane who tie for her and are paid by the piece, and who have no other work within walking distance.',
  change_in_lifetime: 'Orders moved from local weddings to shops, then to online sellers. Turnaround times shortened. Chemical dyeing became standard and natural dyeing became a premium line. Her own household went from dyeing its own cloth to sending most of it out.',
  artisan_initiated_change: 'She reorganised the lane\'s work so tying is paid per pattern band instead of per knot, which she says made the fine work worth doing again. She also started the undyed-bundle photographs.',
  desired_keep: 'Tying by nail, and the wedding pieces staying outside the stock system.',
  desired_let_go: 'The idea that everything must be natural-dyed to count. And hand-washing every piece herself.',
  strength_anchor: 'The lane. Eleven women who can tie to her standard and turn an order around without her checking every band. She names this before she names any skill of her own.',
  concern_anchor: 'Printed imitation sold as bandhani at a third of the price, and buyers who cannot tell the difference and do not want to be taught. Second: the dye knowledge thinning out.',
  shareable_content: 'Everything about tying, the nail method, the drag test, the lane\'s pay arrangement, the returned-batch story, her views on natural versus chemical dye, and photographs of tied bundles and delivered work.',
  private_content: 'The family wedding pattern arrangements (describe generally, do not reproduce). Her mother\'s odhani. Any figure for what individual women in the lane are paid.',
  desired_change: 'Buyers who can read the back of the cloth — she would rather be paid for the tie than for a story about tradition.',
  desired_continuity: 'The nail. "If it is not tied by nail it is something else, and it can have another name."',
  learning_story: 'Early on she tied a whole cotton piece while it was too dry because she wanted to finish before dark. The knots looked right. After dyeing, every dot had a pale halo where the thread had not held. Her father looked at it once and put it in the seconds pile without saying anything. She says she learned the drag test that evening, from the ruined cloth rather than from anyone telling her.',
  emotional_story: 'The morning after her mother died, the women in the lane came and sat in the yard and tied. Nobody had ordered anything. They opened an old cotton piece that had been half-tied for months and finished it. She still has it, undyed.',
  clarification_story: 'A design student asked her how long a piece takes and she said eleven days. The student wrote down eleven days as a selling point. Meena says the number is meaningless on its own — eleven days is four women, a specific pattern band, one drying window, and a decision not to rush a wedding piece. "If you only write the days, you make it sound like we are slow."',
  outsider_misunderstanding: 'That slowness is the value. And that natural dye equals authentic — she uses both and considers the tying to be the craft.'
};


// Four composite artisan records, one per working language. None is a real individual;
// crafts, regions and material practice are drawn from documented cluster work.
export const SAMPLES = [
  {
    id: 'p-bandhani', lang: 'gu', cluster: 'Bandhani · Bhuj, Kutch',
    approved: true, openedDaysAgo: 2, rooms: { brand: 6, genz: 4, social: 3, exhibition: 1 },
    record: {
      artisan_name: 'મીના ખત્રી',
      craft_name_local: 'બાંધણી',
      craft_region: 'ભુજ તાલુકો, કચ્છ',
      practice_span: 'નવ વર્ષની ઉંમરથી બાંધું છું — આડત્રીસ વર્ષ થયાં',
      local_belonging_phrase: '"બાંધણી અમે અહીં લાવ્યા નથી. કચ્છમાં પાણી હતું, એટલે એ અહીં રહી ગઈ." એ "વારસો" શબ્દ વાપરતાં નથી — એ કહે છે "અમારું કામ".',
      ecological_input: 'કૂવાનું ખારું પાણી — એ કહે છે કે નળના પાણી કરતાં લાલ રંગ જુદી રીતે પકડે છે. અગાશી પર સૂકવવા માટે લાંબી સૂકી ગરમી. હરડે અને દાડમની છાલ ભુજના બજારમાંથી.',
      place_change: 'નળનું પાણી આવ્યું અને રંગવાના જૂના કૂવા બંધ થઈ ગયા. ધરતીકંપ પછી ઘર સિમેન્ટનું બન્યું, એની ગરમી જુદી છે. ભુજ વધીને આંગણા સુધી આવી ગયું, હવે અગાશી પર રસ્તાની ધૂળ ઊડે છે.',
      emotional_status: '',
      emotion_about_place_change: '"નળનું દુઃખ નથી. થાક એ વાતનો છે કે દરેક ગ્રાહકને સમજાવવું પડે કે એ જ લાલ કેમ એ જ લાલ નથી."',
      teacher_name_relation: 'મા જેનબ, અને એક કાકી — એમના જેવું ઝડપી બાંધનાર પછી કોઈ જોયું નથી.',
      teaching_memory: 'સુતરાઉ ઓઢણીનો એક ખૂણો આપીને કહ્યું, ભરી નાખ. માએ ભાત સુધારી નહીં — એણે મારો અંગૂઠાનો નખ કપડા પર જોરથી દબાવ્યો અને આગળ ચાલી ગઈ. "કામ નખ કરે છે, દોરો નહીં."',
      remembered_phrase_gesture: '"નખ થી." સુધારતી વખતે જ કહેવાય, અને હંમેશાં હાથ પર ટપલી મારીને — સમજાવીને નહીં.',
      family_generations: 'ચાર પેઢી નામ લઈ શકું. મા અને દાદી બાંધતાં, બાપા અને ભાઈઓ રંગતા. ત્રણ સંતાનોમાં એક દીકરી સરસ બાંધે છે પણ પૈસા માટે કરવા માગતી નથી; દીકરો ઓર્ડર અને ફોટા સંભાળે છે, બાંધતો નથી.',
      transmission_weakness: 'રંગવાનું. ક્યારે કુંડું તૈયાર છે એ બાપા જોઈને કહેતા. હવે ઘરમાં કોઈ એમ વાંચી શકતું નથી — હવે માપીએ છીએ અને ઘડિયાળ જોઈએ છીએ.',
      teaching_difficulty: 'મજૂરી. છોકરી ભુજની દુકાનમાં કે ગારમેન્ટમાં વધારે અને જલદી કમાય. અહીં ગાંઠ પ્રમાણે પૈસા મળે. "કામ એમને ગમે છે. એના પર જીવાતું નથી."',
      primary_material: 'સુતરાઉ મલમલ, ગાજી સિલ્ક, સસ્તા ઓર્ડર માટે વિસ્કોસ જ્યોર્જેટ. બાંધવા માટે સુતરાઉ દોરો.',
      material_in_hands: 'તૈયારી હું ખેંચાણથી ઓળખું. બરાબર ભીનું કપડું નખ સામે થોડું ખેંચાય અને છોડ્યા પછી પકડ જાળવી રાખે. બહુ સૂકું હોય તો પાછું ઊછળે અને ગાંઠ ઢીલી બેસે; બહુ ભીનું હોય તો દોરો કાપી જાય અને રંગ્યા પછી નિશાન દેખાય.',
      material_feels_wrong: 'વધારે બ્લીચ થયેલું કપડું કાગળ જેવું લાગે અને નખ સામે હળવું ચૂં કરે. દુકાનમાં લાંબું પડી રહેલું સિલ્ક વળાંક પર કડક થઈ જાય.',
      correction_action: 'કાગળ જેવા કપડાને ભીનું કરીને આખી રાત વીંટાળી રાખું. કડક સિલ્કને હથેળી વચ્ચે ઘસી નરમ કરું. ન માને તો એ કાપડને પહોળી ભાતમાં મૂકી દઉં, જ્યાં ઢીલી ગાંઠ દેખાય નહીં.',
      material_change_loss: 'કુદરતી લાલમાં જે ઊંડાણ હતું એ હવે નથી આવતું — એ સીધું કહે છે.',
      occasion_of_use: 'મુખ્યત્વે લગ્ન — કન્યા માટે ચંદ્રોખાણી ઓઢણી, બીજી સ્ત્રીઓ માટે ઘરચોળું. ઘરમાં જન્મ અને પહેલી બહાર જવાની વિધિ માટે પણ.',
      sensory_scene: 'પહેરતાં પહેલાં ભરેલા ઓરડામાં ઓઢણી ખોલીને ગાંઠ ખેંચાય છે — સૂકો કડકડ અવાજ થાય અને ભાત એકસાથે ખૂલી જાય. એ ક્ષણે ઓરડો શાંત થઈ જાય, પછી બધાં એકસાથે બોલવા લાગે.',
      remembered_community_phrase: 'એક વડીલ સ્ત્રીએ લગ્નમાં કહ્યું: "આ હાથની બાંધેલી છે, પાછળ જુઓ." વખાણ પહેલાં એણે કપડું ઊંધું કરીને ગાંઠ તપાસી હતી.',
      not_for_sale_example: 'માની પોતાની ઓઢણી, ઘરમાં જ રહે છે. અને ઘરના લગ્નમાં જ વપરાતી અમુક ભાતની ગોઠવણી.',
      why_protected: '"એ કપડું કોઈનું થઈ ચૂક્યું છે." વાત ગુપ્તતાની નથી, વચનની છે.',
      safer_alternative: 'ભાત વિશે સામાન્ય રીતે વાત કરવામાં વાંધો નથી, અને ડિલિવરી પછી ફોટા વહેંચવામાં પણ. એ સૂચવે છે કે બાંધેલા, રંગ્યા વગરના બંડલનો ફોટો પાડો — "કામ એમાં વધારે દેખાય છે."',
      pride_moment: 'એક ખરીદનારે આખો જથ્થો ખામીવાળો કહીને પાછો મોકલ્યો, કારણ કે ટપકાં સરખાં ન હતાં. હું દુકાને ગઈ, એક કપડું ઊંધું કરીને ગાંઠના નિશાન બતાવ્યાં. ઓર્ડર પહેલાં નક્કી થયેલા ભાવ કરતાં વધારે ભાવે સ્વીકારાયો.',
      loss_if_stopped: 'ઝીણું બાંધવાનું એક પેઢીમાં જતું રહેશે. છાપકામ દેખાવની નકલ કરી જ લે છે — એટલે જે જશે એ હાથ છે, ચિત્ર નહીં.',
      key_stakeholder_of_loss: 'શેરીની અગિયાર સ્ત્રીઓ, જે નંગ પ્રમાણે પૈસા લે છે અને જેમને ચાલીને જવાય એટલા અંતરમાં બીજું કામ નથી.',
      artisan_initiated_change: 'મેં શેરીનું કામ ગોઠવ્યું — હવે ગાંઠ પ્રમાણે નહીં, ભાતના પટ્ટા પ્રમાણે પૈસા મળે છે. એનાથી ઝીણું કામ કરવા જેવું થયું. રંગ્યા વગરના બંડલના ફોટા પણ મેં શરૂ કરાવ્યા.',
      desired_keep: 'નખથી બાંધવાનું, અને લગ્નનાં કપડાં સ્ટોકની બહાર રહે એ.',
      desired_let_go: 'એ માન્યતા કે બધું કુદરતી રંગનું જ હોય તો જ ગણાય. અને દરેક કપડું જાતે ધોવાનું.',
      strength_anchor: 'શેરી. અગિયાર સ્ત્રીઓ મારા ધોરણે બાંધી શકે છે અને હું દરેક પટ્ટો તપાસું નહીં તોય ઓર્ડર પૂરો થાય. પોતાની આવડત પહેલાં એ આ નામ લે છે.',
      concern_anchor: 'છાપેલી નકલ ત્રીજા ભાગના ભાવે બાંધણી તરીકે વેચાય છે, અને ગ્રાહકને ફરક ખબર નથી અને શીખવું પણ નથી. બીજું, રંગનું જ્ઞાન પાતળું પડતું જાય છે.',
      shareable_content: 'બાંધવા વિશે બધું, નખની રીત, ખેંચાણની કસોટી, શેરીની પગાર વ્યવસ્થા, પાછા આવેલા જથ્થાની વાત, અને બાંધેલા બંડલના ફોટા.',
      private_content: 'ઘરના લગ્નની ભાતની ગોઠવણી (સામાન્ય રીતે વર્ણવો, નકલ ન કરો). માની ઓઢણી. શેરીની કોઈ સ્ત્રીને કેટલા પૈસા મળે છે એ આંકડો.',
      desired_change: 'એવા ખરીદનાર જે કપડાની પાછળ વાંચી શકે. પરંપરાની વાર્તાના નહીં, ગાંઠના પૈસા મળે એ મને વધારે ગમે.',
      desired_continuity: 'નખ. "નખથી ન બંધાયું હોય તો એ બીજું કંઈક છે, એનું નામ પણ બીજું રાખો."',
      learning_story: 'શરૂઆતમાં અંધારું થાય એ પહેલાં પૂરું કરવાની લાયમાં આખું સુતરાઉ કપડું બહુ સૂકું હતું ત્યારે બાંધી નાખ્યું. ગાંઠ સાચી દેખાતી હતી. રંગ્યા પછી દરેક ટપકાની ફરતે ફિક્કું કૂંડાળું — દોરો પકડ્યો જ ન હતો. બાપાએ એક વાર જોયું અને કશું બોલ્યા વગર એને બીજા ઢગલામાં મૂકી દીધું. ખેંચાણની કસોટી હું એ સાંજે શીખી, બગડેલા કપડા પાસેથી.',
      emotional_story: 'મા ગુજરી ગયાં એની બીજી સવારે શેરીની સ્ત્રીઓ આવીને આંગણામાં બેસી ગઈ અને બાંધવા લાગી. કોઈએ ઓર્ડર આપ્યો ન હતો. મહિનાઓથી અધૂરું પડેલું જૂનું સુતરાઉ કપડું કાઢીને પૂરું કર્યું. એ હજી મારી પાસે છે, રંગ્યા વગરનું.',
      clarification_story: 'એક ડિઝાઇન ભણતી છોકરીએ પૂછ્યું કે એક કપડામાં કેટલો સમય જાય. મેં કહ્યું અગિયાર દિવસ. એણે "અગિયાર દિવસ" વેચાણની વાત તરીકે લખી લીધું. એકલો આંકડો કશું કહેતો નથી — અગિયાર દિવસ એટલે ચાર સ્ત્રીઓ, એક ચોક્કસ ભાતનો પટ્ટો, સૂકવવાની એક તક, અને લગ્નનું કપડું ઉતાવળે ન કરવાનો નિર્ણય. "ખાલી દિવસો લખો તો એવું લાગે કે અમે ધીમા છીએ."',
      outsider_misunderstanding: 'કે ધીમાપણું જ કિંમત છે. અને કે કુદરતી રંગ એટલે જ અસલી — હું બંને વાપરું છું, અને મારે મન કારીગરી બાંધવામાં છે.'
    }
  },
  {
    id: 'p-dhokra', lang: 'hi', cluster: 'Dhokra casting · Bastar, Chhattisgarh',
    approved: false, openedDaysAgo: 11, rooms: { brand: 2, ngo: 1 },
    record: {
      artisan_name: 'राजू राम',
      craft_name_local: 'ढोकरा ढलाई',
      craft_region: 'कोंडागांव, बस्तर, छत्तीसगढ़',
      practice_span: 'बाईस साल',
      local_belonging_phrase: '"यहाँ की मिट्टी चिकनी है। दूसरी जगह की मिट्टी साँचे पर टिकती नहीं।"',
      ecological_input: 'नदी किनारे की चिकनी मिट्टी, धान की भूसी और गोबर साँचे के लिए। मोम पहले जंगल से आता था, अब बाज़ार से खरीदते हैं। बरसात में ढलाई बंद रहती है।',
      place_change: 'जंगल से मोम और लकड़ी मिलना कम हो गया। भट्ठी के लिए लकड़ी अब खरीदनी पड़ती है, जो पहले मुफ़्त थी। सड़क बन गई तो व्यापारी सीधे गाँव तक आने लगे।',
      teacher_name_relation: 'पिता जी, और गाँव के बुज़ुर्ग कारीगर जिन्हें सब गुरुजी कहते थे।',
      teaching_memory: 'पहले छह महीने मुझे सिर्फ़ मिट्टी गूँथने दी गई। मैंने पूछा कब मोम छूने मिलेगा, तो पिता जी ने कहा — "मिट्टी ठीक नहीं होगी तो मोम का काम बेकार जाएगा।" तब समझ नहीं आया, अब आता है।',
      remembered_phrase_gesture: '"मिट्टी पहले, मोम बाद में।"',
      material_in_hands: 'मोम की तार कितनी गरम है यह उँगली से पता चलता है। सही गरम हो तो तार खिंचती है और टूटती नहीं, और लपेटने पर अपनी जगह बैठ जाती है। ठंडी हो तो चटक जाती है, ज़्यादा गरम हो तो चिपक कर मोटी हो जाती है।',
      material_feels_wrong: 'बाज़ार का मिलावटी मोम हाथ में चिकना लगता है और ठंडा होते ही भुरभुरा हो जाता है।',
      correction_action: 'ऐसे मोम में थोड़ा शुद्ध मोम मिलाकर दोबारा गरम करता हूँ। फिर भी न बने तो उस दिन मोटी तार वाला काम कर लेता हूँ।',
      occasion_of_use: 'देवी-देवता की मूर्तियाँ, घर के लिए दीपदान, और अब ज़्यादातर शहर के लोगों के लिए सजावट का सामान।',
      special_vs_everyday: 'देव मूर्ति में नाप और विधि तय है, उसमें मनमानी नहीं चलती। सजावट के सामान में हम नया बना सकते हैं।',
      pride_moment: 'दिल्ली के एक मेले में एक खरीदार ने कहा कि मशीन से बनी लगती है, इतनी बराबर है। मैंने कहा मशीन से बनती तो दोनों एक जैसी होतीं — ये दोनों अलग हैं, देख लीजिए।',
      loss_if_stopped: 'साँचा बनाने की समझ चली जाएगी। ढलाई तो कोई भी सीख लेगा, पर मिट्टी की परत कितनी मोटी रखनी है यह किताब में नहीं है।',
      change_in_lifetime: 'पहले गाँव के लिए बनाते थे, अब मेले और ऑनलाइन के लिए। दाम बेहतर हुए हैं पर बिचौलिया ज़्यादा कमाता है।',
      strength_anchor: 'साँचा। मेरे साँचे में धातु पूरी भरती है, कहीं खाली नहीं रहता। गाँव में लोग अपने साँचे मुझसे जँचवाते हैं।',
      concern_anchor: 'लकड़ी और मोम का खर्च हर साल बढ़ रहा है पर दाम वही हैं। बेटा पढ़ रहा है, वह यह काम नहीं करेगा — यह मुझे ठीक भी लगता है और खलता भी है।',
      shareable_content: 'बनाने की पूरी विधि, भट्ठी, साँचा, सब दिखा सकते हैं। मेले की बात भी।',
      private_content: 'देव मूर्ति के नाप और मंत्र — वह गाँव के बाहर नहीं जाते।',
      learning_story: 'एक बार जल्दी में साँचा पूरा सूखने से पहले भट्ठी में डाल दिया। भट्ठी में ही फट गया, धातु बह गई, पूरे दिन का काम गया। अब मैं साँचे पर उँगली रखकर ठंडक देखता हूँ — गीला हो तो हल्की ठंडक लगती है।'
    }
  },
  {
    id: 'p-paithani', lang: 'mr', cluster: 'Paithani weaving · Yeola, Nashik',
    approved: true, openedDaysAgo: 5, rooms: { genz: 5, social: 4, brand: 2 },
    record: {
      artisan_name: 'आशा मोरे',
      craft_name_local: 'पैठणी विणकाम',
      craft_region: 'येवला, नाशिक',
      practice_span: 'सोळाव्या वर्षापासून — एकोणतीस वर्षं',
      local_belonging_phrase: '"येवल्यात प्रत्येक गल्लीत माग आहे. इथे हे काम शिकायला कुठे जावं लागत नाही, ते घरातच असतं."',
      teacher_name_relation: 'सासूबाई. माहेरी विणकाम नव्हतं.',
      teaching_memory: 'पहिल्या दिवशी त्यांनी मला मागावर बसू दिलं नाही. रेशमाचे गुंते सोडवायला दिले. आठवडाभर तेच. मग म्हणाल्या — "आता धागा तुला ओळखतो."',
      remembered_phrase_gesture: '"धागा ओढायचा नाही, त्याला येऊ द्यायचं."',
      family_generations: 'सासूबाई, त्यांचे सासरे, आणि आता मी. मुलगी शिकते आहे, तिला हे काम येतं पण ती नोकरी करणार.',
      transmission_weakness: 'पदराचं काम. मोर आणि कमळ नीट यायला वर्षं लागतात, आणि तेवढा वेळ द्यायला आता कोणी तयार नाही.',
      teaching_difficulty: 'एक पैठणी तीन महिने घेते. शिकणाऱ्याला तीन महिने पगार कोण देणार?',
      primary_material: 'शुद्ध रेशीम आणि खरी जर. कधी कधी स्वस्त ऑर्डरसाठी सेमी-पैठणीचं रेशीम.',
      material_in_hands: 'जर बोटात घेतली की कळतं. खरी जर थोडी जड लागते आणि वळवली तर तशीच राहते. बनावट जर हलकी असते आणि सोडली की उलगडते.',
      material_feels_wrong: 'रेशीम कोरडं पडलं की मागावर कुरकुरतं आणि तुटायला लागतं.',
      correction_action: 'अशा वेळी खोलीत पाणी शिंपडते किंवा पहाटे काम करते, तेव्हा हवेत ओलावा असतो.',
      occasion_of_use: 'लग्न, आणि घरातल्या मोठ्या समारंभात. पैठणी आईकडून मुलीकडे जाते, विकत घेतली तरी ती पुढे दिली जाते.',
      sensory_scene: 'माग चालू असताना दोन आवाज असतात — धोटा जाण्याचा आणि फणी बसण्याचा. घरातल्या माणसांना तो आवाज इतका सवयीचा की तो थांबला की कोणीतरी विचारतं, काय झालं.',
      pride_moment: 'एका ग्राहकाने तिच्या आजीची साठ वर्षांची पैठणी दुरुस्त करायला आणली. पदर मी नव्याने विणून जोडला. तिला जोड कुठे आहे ते सापडलं नाही.',
      loss_if_stopped: 'हातमागाची पैठणी संपेल आणि छापील पैठणी तिच्या नावाने विकली जाईल. आताच तसं होतंय.',
      artisan_initiated_change: 'मी दुपट्टे आणि लहान तुकडे करायला सुरुवात केली, कारण पूर्ण साडी परवडणारे ग्राहक कमी झाले. सासूबाईंना ते आवडलं नव्हतं.',
      strength_anchor: 'पदर. माझा मोर लोक ओळखतात — शेपटीतले रंग मी वेगळे लावते.',
      concern_anchor: 'छापील साड्या पैठणी म्हणून विकल्या जातात आणि ग्राहकाला फरक कळत नाही. आणि जरीचे भाव दरवर्षी वाढतात.',
      shareable_content: 'विणकामाची पद्धत, मागाचे फोटो, मोराचं काम, दुरुस्तीची गोष्ट — सगळं सांगायला हरकत नाही.',
      private_content: 'ग्राहकांची नावं आणि कोणती साडी कोणासाठी केली, ते नाही.',
      desired_change: 'ग्राहकाने हातमाग आणि छापील यातला फरक स्वतः ओळखावा. मला प्रत्येक वेळी सिद्ध करत बसावं लागू नये.',
      desired_continuity: 'पदर हाताने. बाकी काही बदललं तरी चालेल.',
      emotional_story: 'सासूबाई गेल्यानंतर त्यांचा माग तीन महिने तसाच होता, अर्धी साडी लावलेली. मी ती पूर्ण केली आणि घरातच ठेवली. ती विकली नाही.'
    }
  },
  {
    id: 'p-longpi', lang: 'en', cluster: 'Longpi pottery · Ukhrul, Manipur',
    approved: false, openedDaysAgo: null, rooms: {},
    record: {
      artisan_name: 'Lily Shaiza (composite record)',
      craft_name_local: 'Longpi ham (black stone pottery)',
      craft_region: 'Longpi Kajui, Ukhrul, Manipur',
      practice_span: 'fourteen years',
      local_belonging_phrase: 'The stone only comes from two hillsides here. She is matter-of-fact about it: without that rock there is no Longpi, anywhere.',
      ecological_input: 'Weathered serpentinite rock and brown clay, both quarried locally, ground and mixed at roughly five to three. No wheel is used — everything is hand-built and beaten with a wooden paddle.',
      teacher_name_relation: 'Her mother-in-law, and the women\'s group in the village who work together on large orders.',
      material_in_hands: 'The mix is ready when a rolled coil bends without cracking at the outside edge. Too much stone and it crumbles; too much clay and the pot slumps while it is still being beaten.',
      occasion_of_use: 'Cooking pots and serving ware for Tangkhul households — rice pots, kettles. The tourist trade wants tableware, which is newer.',
      pride_moment: 'A chef in Imphal cooked in her pot for a year and sent her a photograph of it, unbroken and blackened. She keeps the photograph.',
      strength_anchor: 'The stone-to-clay judgment, which she does by feel, and the finishing — her pots come out of the fire with an even surface that does not need much rubbing.',
      concern_anchor: 'Quarrying is getting harder and the young people who help carry the rock are leaving for Imphal and further. Also: moulded lookalikes sold as Longpi.'
    }
  }
];


// Complete every sample so each card on the board carries an answer.
const FILL = {
  "p-bandhani": {
    "transmission_strength": "બાંધવાનું પોતે. ગલીની કોઈ પણ છોકરી એક સીઝનમાં સાદી ભીંડી શીખી જાય, અને ઝીણું કામ હજી હાથોહાથ એ જ ઝડપે આગળ જાય છે જેમ પહેલાં જતું.",
    "material_origin": "કાપડ ભુજ અને જામનગરના વેપારીઓ પાસેથી; રંગનો સામાન બજારમાંથી; દોરો વીસ વર્ષથી એક જ દુકાનેથી, કારણ કે એનો વળ એકસરખો રહે છે.",
    "first_contact": "મલમલ, નવ વર્ષે. \"પકડાય નહીં એટલું નરમ\" — ગૂંછળું વાળતાં શીખી ત્યાં સુધી કપડું નખ નીચેથી સરકી જતું.",
    "material_special": "મલમલ નાની ગાંઠ ચોખ્ખી પકડે; ધોયા પછી પણ ટપકું ગોળ રહે. જ્યોર્જેટમાં ટપકું થોડું લંબગોળ થાય — ખરીદનારને ખબર ન પડે, મને પડે.",
    "material_change_gain": "કેમિકલ રંગથી એકસરખાપણું આવ્યું — મહિનાઓ પહેલાં ગ્રાહકને રંગ કહી શકાય. સસ્તા કાપડથી મંદીનાં વર્ષોમાં પણ ઘરમાં કામ ચાલુ રહ્યું.",
    "special_vs_everyday": "લગ્નનાં કપડાં વધુ ઝીણાં બંધાય અને ક્યારેય ઉતાવળ નહીં. બજારનો માલ જે નવરું હોય એ બાંધે, એવી ભાતમાં જ્યાં ઢીલી ગાંઠ ચાલી જાય.",
    "special_object_rule": "કન્યાની ચંદ્રોખાણીનો સ્ટોક માટે ફોટો ન પડે, અને ઘરને મળે એ પહેલાં બીજા ખરીદનારને ન બતાવાય.",
    "recognition_by_others": "એ ખરીદનાર, અને પછી મારો દીકરો — એણે ત્યારથી દુકાનના લિસ્ટિંગ માટે દરેક કપડાની પાછળની બાજુનો ફોટો પાડવાનું શરૂ કર્યું.",
    "change_in_lifetime": "ઓર્ડર ગામનાં લગ્નમાંથી દુકાનો તરફ, પછી ઓનલાઇન વેચનારા તરફ ગયા. સમય ટૂંકો થયો. કેમિકલ રંગ સામાન્ય થયા અને કુદરતી રંગ મોંઘી લાઇન બની. ઘરે રંગવાને બદલે હવે મોટા ભાગનું બહાર મોકલીએ છીએ."
  },
  "p-dhokra": {
    "emotion_about_place_change": "\"जंगल दूर हुआ तो मोम महँगा हुआ। गुस्सा नहीं है, बस अब हर चीज़ ख़रीदनी पड़ती है जो पहले जंगल देता था।\"",
    "family_generations": "चार पीढ़ी तक नाम ले सकते हैं। दादा और पिता ढालते थे, माँ और चाची मोम के धागे बनाती थीं। बेटा ढलाई में हाथ बँटाता है पर रायपुर में नौकरी ढूँढ रहा है; बेटी मोम का काम बहुत बारीक करती है।",
    "transmission_strength": "मोम का काम। घर के बच्चे खेल-खेल में मोम के धागे लपेटना सीख जाते हैं — हाथ अपने आप सीखता है।",
    "transmission_weakness": "भट्ठी पढ़ना। धातु कब तैयार है, यह पिता आग के रंग से बताते थे। यह आँख अब घर में सिर्फ़ उनके पास है।",
    "teaching_difficulty": "कोयला, पीतल और मोम सब महँगे हैं; एक ग़लत ढलाई में हफ़्ते की कमाई जाती है। नया सीखने वाला ग़लती करे, इसकी गुंजाइश घर नहीं उठा सकता।",
    "primary_material": "पुराना पीतल और काँसा, मधुमक्खी का मोम, साल की राल, नदी की काली मिट्टी, धान की भूसी और गोबर।",
    "material_origin": "पीतल कबाड़ी से — पुराने बर्तन; मोम और राल हाट से, जंगल से लाने वालों से; मिट्टी गाँव की नदी के किनारे से।",
    "first_contact": "मोम, सात-आठ साल की उम्र में। गर्म मोम उँगलियों में चिपकता था; पहले धागे टूट-टूट जाते थे।",
    "material_special": "साल की राल मिला मोम ठंडा होकर भी थोड़ा लचीला रहता है — बारीक जाली बन पाती है, टूटती नहीं।",
    "material_change_gain": "बिजली का पंखा भट्ठी को एक-सी हवा देता है; अब ढलाई कम बिगड़ती है।",
    "material_change_loss": "असली मधुमक्खी का मोम कम मिलता है; पैराफ़िन मिलाना पड़ता है और उसमें धागा उतना महीन नहीं खिंचता।",
    "sensory_scene": "मड़ई के मेले में देवी के आगे नया घोड़ा रखा जाता है। ढोल बजते हैं, धूप में पीतल चमकता है, और गाँव के बुज़ुर्ग पहले हाथ लगाकर देखते हैं।",
    "remembered_community_phrase": "एक बुज़ुर्ग ने कहा था: \"इसमें जान है, देखो आँख कैसे देख रही है।\"",
    "special_object_rule": "देवी के लिए बनी मूर्ति की तस्वीर बेचने के लिए नहीं खींचते, और चढ़ाने से पहले उसे बाज़ार नहीं ले जाते।",
    "not_for_sale_example": "घर के देवस्थान की पुरानी मूर्तियाँ, और पूजा के लिए बने दीये।",
    "why_protected": "\"वो देवी के हैं, हमारे नहीं।\" बेचने से रिश्ता टूटता है।",
    "safer_alternative": "मोम का ढाँचा और ढलाई की प्रक्रिया दिखाने में कोई हर्ज नहीं। बाज़ार के लिए बने घोड़े-हाथी की तस्वीरें खुलकर दिखा सकते हैं।",
    "recognition_by_others": "दिल्ली के एक मेले में एक डिज़ाइनर ने पूछा कि जाली हाथ से कैसे बनती है — फिर पूरा दिन बैठकर देखती रहीं।",
    "key_stakeholder_of_loss": "गाँव के वो परिवार जो ढलाई से ही घर चलाते हैं, और देवगुड़ी के मेले — जिनमें हमारी मूर्तियाँ चढ़ती हैं।",
    "artisan_initiated_change": "हमने चार परिवार मिलकर एक साझा भट्ठी बनाई, ताकि कोयले का ख़र्च बँट जाए।",
    "desired_keep": "मोम के धागे से बनाना, और देवी के काम को बाज़ार से अलग रखना।",
    "desired_let_go": "यह ज़िद कि हर चीज़ पुराने आकार में ही बने। नए आकार चलेंगे अगर बनाने का तरीका वही रहे।",
    "desired_change": "ख़रीदार जानें कि हर मूर्ति एक ही बार बनती है — साँचा टूटता है, दूसरी हूबहू नहीं बनती।",
    "desired_continuity": "हर मूर्ति के लिए नया मोम का ढाँचा। \"साँचे से ढली चीज़ ढोकरा नहीं है।\"",
    "emotional_story": "पिता की आँखें कमज़ोर हुईं तो पहली बार भट्ठी मेरे हवाले की। धातु डालते वक़्त वो पीछे खड़े रहे और कुछ नहीं बोले। ढलाई ठीक निकली तो बस इतना कहा, \"आग ने तुझे पहचान लिया।\"",
    "clarification_story": "एक ख़रीदार ने पूछा कि दस एक जैसे हाथी मिलेंगे क्या। मैंने समझाया कि हर हाथी का मोम अलग बनता है और ढलाई में टूटता है। उन्होंने कहा तो फिर ये \"डिफ़ेक्ट\" है। मैंने कहा, नहीं — यही इसका सबूत है कि हाथ से बना है।",
    "outsider_misunderstanding": "कि ढोकरा \"आदिवासी पुराना काम\" है जो बदलता नहीं। हम हर साल नए आकार बनाते हैं — बदलाव भी हमारा ही है।"
  },
  "p-paithani": {
    "ecological_input": "पाणी आणि हवा — रेशीम ओलसर हवेत जास्त चांगलं विणलं जातं, म्हणून पावसाळ्यानंतरचे महिने आमचे सर्वात चांगले. रेशीम मात्र बंगळुरूहून येतं.",
    "place_change": "येवल्यात आता पॉवरलूम खूप आले. रस्त्यावर त्यांचा आवाज सतत असतो. पूर्वी गल्लीत फक्त हातमागाचा ठेका ऐकू यायचा.",
    "emotion_about_place_change": "\"पॉवरलूमचा राग नाही. पण त्यांची साडी \"पैठणी\" म्हणून विकली जाते, त्याचं वाईट वाटतं.\"",
    "transmission_strength": "विणकाम घरात रोज चालतं, म्हणून मुलं पाहूनच शिकतात. कोणाला शिकवायला बसावं लागत नाही.",
    "material_origin": "रेशीम बंगळुरूहून व्यापाऱ्यांमार्फत; जर सुरतहून; रंग आम्ही येवल्यातच करतो.",
    "first_contact": "दहाव्या वर्षी पहिल्यांदा रेशीम धागा जोडला. इतका बारीक की तुटला तरी दिसायचा नाही.",
    "material_special": "खरी जर उन्हात सोन्यासारखी उबदार चमकते, टेस्टेड जर पांढरी चमकते. हातात घेतली की वजनावरून कळतं.",
    "material_change_gain": "टेस्टेड जरीमुळे पैठणी कमी किमतीत विकता येते; जास्त घरांना काम मिळतं.",
    "material_change_loss": "खऱ्या सोन्याच्या जरीची पैठणी आता फक्त ऑर्डरवर बनते. ती चमक नवीन पिढीने पाहिलीच नाही.",
    "remembered_community_phrase": "लग्नात एक आजी म्हणाल्या: \"हिचा पदर उलटा करून बघ, मागेही तसाच दिसतो — हीच खरी पैठणी.\"",
    "special_vs_everyday": "लग्नाची पैठणी महिनोन्महिने विणतो, खास नक्षीसह. रोजच्या विक्रीसाठी साधा पदर आणि कमी काठ.",
    "special_object_rule": "घरच्या मुलीच्या लग्नाची पैठणी आधी विकायला दाखवत नाही, आणि तिचा नक्षीचा नमुना दुसऱ्यासाठी पुन्हा विणत नाही.",
    "not_for_sale_example": "आईची लग्नाची पैठणी, आणि घराण्याचा एक खास मोराचा नमुना.",
    "why_protected": "\"तो नमुना आमच्या घराची ओळख आहे.\" तो विकला तर ओळख विकली.",
    "safer_alternative": "विणकामाची पद्धत, हातमागाचे फोटो, आणि बाजारासाठीचे नमुने खुशाल दाखवा. घराण्याचा नमुना फक्त वर्णनात.",
    "recognition_by_others": "मुंबईच्या एका प्रदर्शनात एका संग्राहकाने पदराची उलटी बाजू पाहून लगेच ऑर्डर दिली.",
    "key_stakeholder_of_loss": "गल्लीतले हातमाग विणकर आणि रंगारी — त्यांच्यासाठी दुसरं काम जवळ नाही.",
    "change_in_lifetime": "खऱ्या जरीकडून टेस्टेड जरीकडे, लग्नाच्या ऑर्डरकडून दुकानांकडे, आणि आता इन्स्टाग्रामवरून थेट ग्राहक. पॉवरलूमची स्पर्धा सर्वात मोठा बदल.",
    "desired_keep": "हातमाग, आणि पदराची दोन्ही बाजू सारखी दिसणारी विणकाम पद्धत.",
    "desired_let_go": "फक्त लग्नासाठीच पैठणी हा विचार. दुपट्टे, स्टोल चालतील, विणकाम तेच असेल तर.",
    "learning_story": "एकदा घाईत ताणा सैल ठेवला. पदर विणून झाल्यावर नक्षी एका बाजूला ओढलेली दिसली. वडिलांनी काहीच न बोलता तो उसवायला सांगितला — तीन आठवड्यांचं काम. त्या दिवसापासून ताणा आधी तपासते.",
    "clarification_story": "एका ग्राहकाने विचारलं, ही पैठणी इतकी महाग का, ऑनलाइन तीन हजारात मिळते. मी त्यांना पदर उलटा करून दाखवला — हातमागावर मागची बाजूही समोरच्यासारखी असते. पॉवरलूमवर मागे धागे लोंबतात. त्या शांत झाल्या आणि मग पदराला हात लावून बघत राहिल्या.",
    "outsider_misunderstanding": "की पैठणी म्हणजे फक्त डिझाइन. खरं तर ओळख विणण्याच्या पद्धतीत आहे — नक्षी कोणीही छापू शकतो."
  },
  "p-longpi": {
    "place_change": "The road reached the village and with it more visitors, but the serpentine stone now has to be dug from further up the hill.",
    "emotion_about_place_change": "\"I am glad for the road. I worry that the hill will not give stone forever.\"",
    "teaching_memory": "My grandfather let me grind the stone for a whole season before I was allowed to shape anything. When I complained, he put my hand on the paste and asked if it was smooth yet. It never was, by his standard.",
    "remembered_phrase_gesture": "\"Let the stone tell you.\" Said while pressing the paste between two fingers to test it.",
    "family_generations": "Three generations I can name. My grandfather and father made pots; my mother polished them. My younger brother left for Imphal; my nephew helps with firing on holidays.",
    "transmission_strength": "The shaping. Anyone in the family can roll a coil and build a pot by hand — no wheel, so the hands learn directly.",
    "transmission_weakness": "The firing. Knowing when to pull the pot out and rub it with leaves is a judgment only my father makes without thinking.",
    "teaching_difficulty": "It is slow, and young people want quicker money. The grinding alone takes days and pays nothing on its own.",
    "primary_material": "Black serpentine rock and weathered brown clay, ground and mixed into a paste. Machrei leaves for polishing after firing.",
    "material_origin": "Stone from the hillside above the village, clay from a nearby bank, leaves from the forest edge.",
    "first_contact": "Grinding stone as a boy. My palms blistered before they hardened.",
    "material_special": "There is no wheel and no glaze. The stone and clay alone give the black — it stays black because of the material, not paint.",
    "material_feels_wrong": "If the paste is too wet it slumps and cracks while drying; too dry and it crumbles at the rim.",
    "correction_action": "Wet paste I leave under cloth overnight; dry paste I knead with a little water until it holds a pinched edge.",
    "material_change_gain": "Electric grinders save days of work, and we can take larger orders.",
    "material_change_loss": "Machine-ground paste is finer but less forgiving; the old hand-ground paste had a grit that held shape.",
    "sensory_scene": "At a feast the cooking pot sits on the fire for hours. The smell of the food mixing with the smoke on the black surface is what people remember.",
    "remembered_community_phrase": "An elder once said: \"Food tastes like home only from this pot.\"",
    "special_vs_everyday": "Cooking pots for the household are thick and plain; pieces for visitors and shops are thinner and polished harder.",
    "special_object_rule": "Pots made for a family feast are not sold afterwards, even if a visitor asks.",
    "not_for_sale_example": "My grandfather's cooking pot, still used at the new year.",
    "why_protected": "\"That pot has fed us.\" It belongs to the family's table.",
    "safer_alternative": "Show the process, the grinding and the firing, freely. Photograph shop pieces, not the family pots.",
    "recognition_by_others": "A chef in Bengaluru ordered a set after tasting food cooked in one, and wrote to say the pots changed her menu.",
    "loss_if_stopped": "The knowledge of reading stone and fire would go with my father's generation. Copies in other clay would look right and cook wrong.",
    "key_stakeholder_of_loss": "The families in the village who make pots, and the people who still cook in them.",
    "change_in_lifetime": "From making only for the village to selling to tourists and city shops. Kettles and serving dishes appeared because buyers asked for them.",
    "artisan_initiated_change": "I started making kettles with cane handles after a visitor said she could not use a pot on a modern stove.",
    "desired_keep": "Hand-building without a wheel, and the leaf polish after firing.",
    "desired_let_go": "Making only traditional shapes. New shapes are fine if the stone and fire stay the same.",
    "shareable_content": "The whole process, my views on machine grinding, the chef story, and photographs of shop pieces.",
    "private_content": "The family pots, and where exactly the best stone is dug.",
    "desired_change": "Buyers who understand why a pot takes weeks and why the price reflects the hill, not just my time.",
    "desired_continuity": "Stone from our hill. \"If it is not this stone, it is not Longpi.\"",
    "learning_story": "I once pulled a pot from the fire too early because visitors were waiting. It looked fine. A week later it cracked on the stove. I learned that the fire decides when, not the customer.",
    "emotional_story": "The first pot I sold with my own name on the tag went to a woman from Delhi. She sent a photo of her daughter eating from it. I kept that photo on my phone for two years.",
    "clarification_story": "A visitor asked if the black was painted on. I scraped the base of a broken piece to show the black runs all the way through. She laughed and bought two.",
    "outsider_misunderstanding": "That the pots are decorative. They are for cooking — that is their purpose and the reason they are made this way."
  }
};
SAMPLES.forEach(s => {
  const add = FILL[s.id] || {};
  Object.keys(add).forEach(k => { if (!(s.record[k] || '').trim()) s.record[k] = add[k]; });
});

export const FIELD_INDEX = (() => {
  const m = {};
  SCHEMA.forEach(g => g.fields.forEach(f => { m[f.key] = { code: g.code, label: f.label, layer: g.layer, deck: g.deck }; }));
  return m;
})();

export const ALL_KEYS = Object.keys(FIELD_INDEX);

// Ring geometry and palette for the mandala board, read off the physical Ludo Mandala.
// Order is centre → outward, exactly as the board is printed.
export const RINGS = [
  { id: 'craft',    code: 'Identity',      label: 'My Craft',         color: '#B98BE0', ink: '#4A2A6B', r: 21.0, purpose: 'How artisans name their own craft, its strengths and their wish for the future.' },
  { id: 'place',    code: 'Place 1–3',     label: 'Place',            color: '#6FC9B8', ink: '#1F5F54', r: 27.6, purpose: 'Where the craft belongs, and how the place, land and water shape the work.' },
  { id: 'lineage',  code: 'Lineage 1–3',   label: 'Legacy',           color: '#A81C24', ink: '#7A1319', r: 34.2, purpose: 'Who taught the craft, the generational chain, and where teaching holds or breaks.' },
  { id: 'material', code: 'Material 1–3',  label: 'Material & Tools', color: '#C06A5F', ink: '#7C3A32', r: 40.8, purpose: 'What materials and tools are used, how they behave in the hands, how they changed.' },
  { id: 'culture',  code: 'Culture 1–3',   label: 'Cultural Meaning', color: '#6D9DC5', ink: '#2C5476', r: 47.4, purpose: 'How the craft appears in everyday and special life, and what stays within the community.' },
  { id: 'pride',    code: 'Pride 1–3',     label: 'Pride & Stake',    color: '#F0B23C', ink: '#8A5D05', r: 54.0, purpose: 'What makes artisans proud, what would be lost if the craft stops, and what they accept or refuse.' }
];

export const HUB = [
  { code: 'R1',  token: 'R1', label: 'Strength',  color: '#6B3FA0' },
  { code: 'R2',  token: 'R2', label: 'Concern',   color: '#6B3FA0' },
  { code: 'R3',  token: 'R3', label: 'Sharing',   color: '#6B3FA0' },
  { code: 'R4',  token: 'R4', label: 'Future',    color: '#6B3FA0' },
  { code: 'SS1', token: 'S1', label: 'Taught me', color: '#C06A5F' },
  { code: 'SS2', token: 'S2', label: 'Stayed',    color: '#C06A5F' },
  { code: 'SS3', token: 'S3', label: 'Understand', color: '#C06A5F' }
];

// Name, craft and place for each sample in every UI language — names transliterated, never translated.
export const SAMPLE_NAMES = {
  "p-bandhani": {
    "en": {
      "name": "Meena Khatri",
      "craft": "Bandhani",
      "region": "Bhuj taluka, Kutch"
    },
    "hi": {
      "name": "रहमतबाई खत्री",
      "craft": "बांधणी",
      "region": "भुज तालुका, कच्छ"
    },
    "gu": {
      "name": "મીના ખત્રી",
      "craft": "બાંધણી",
      "region": "ભુજ તાલુકો, કચ્છ"
    },
    "mr": {
      "name": "रहमतबाई खत्री",
      "craft": "बांधणी",
      "region": "भुज तालुका, कच्छ"
    }
  },
  "p-dhokra": {
    "en": {
      "name": "Raju Ram",
      "craft": "Dhokra casting",
      "region": "Kondagaon, Bastar, Chhattisgarh"
    },
    "hi": {
      "name": "राजू राम",
      "craft": "ढोकरा ढलाई",
      "region": "कोंडागांव, बस्तर, छत्तीसगढ़"
    },
    "gu": {
      "name": "સુખરામ વિશ્વકર્મા",
      "craft": "ઢોકરા ઢાળકામ",
      "region": "કોંડાગાંવ, બસ્તર, છત્તીસગઢ"
    },
    "mr": {
      "name": "राजू राम",
      "craft": "ढोकरा ओतकाम",
      "region": "कोंडागाव, बस्तर, छत्तीसगड"
    }
  },
  "p-paithani": {
    "en": {
      "name": "Asha More",
      "craft": "Paithani weaving",
      "region": "Yeola, Nashik"
    },
    "hi": {
      "name": "आशा मोरे",
      "craft": "पैठणी बुनाई",
      "region": "येवला, नासिक"
    },
    "gu": {
      "name": "સુનંદા ભાલેરાવ",
      "craft": "પૈઠણી વણાટ",
      "region": "યેવલા, નાશિક"
    },
    "mr": {
      "name": "आशा मोरे",
      "craft": "पैठणी विणकाम",
      "region": "येवला, नाशिक"
    }
  },
  "p-longpi": {
    "en": {
      "name": "Lily Shaiza",
      "craft": "Longpi ham (black stone pottery)",
      "region": "Longpi Kajui, Ukhrul, Manipur"
    },
    "hi": {
      "name": "न्गालेंगनाम शाइज़ा",
      "craft": "लोंगपी हाम (काले पत्थर के बर्तन)",
      "region": "लोंगपी काजुई, उखरुल, मणिपुर"
    },
    "gu": {
      "name": "ન્ગાલેંગનામ શાઇઝા",
      "craft": "લોંગપી હામ (કાળા પથ્થરનાં વાસણ)",
      "region": "લોંગપી કાજુઈ, ઉખરુલ, મણિપુર"
    },
    "mr": {
      "name": "न्गालेंगनाम शाइझा",
      "craft": "लोंगपी हाम (काळ्या दगडाची भांडी)",
      "region": "लोंगपी काजुई, उखरुल, मणिपूर"
    }
  }
};
