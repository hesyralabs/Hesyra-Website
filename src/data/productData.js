export const productData = [
    {
        id: 'PRD_01',
        slug: 'crowns-bridges',
        category: 'RESTORATIONS',
        title: '3D Printed Crowns & Bridges',
        shortDescription: 'High-fidelity restorations printed with ceramic-hybrid resin. Exceptional marginal fit and natural translucency.',
        fullDescription: 'Our ceramic-hybrid resin crowns and bridges combine the aesthetics of all-ceramic restorations with the toughness needed for posterior function. Printed at 62µm XY resolution, every margin, contact point, and occlusal anatomy is reproduced from your digital scan with zero human error.',
        images: ['/1.webp', '/2.webp'],
        specs: [
            { label: 'Material Core', val: 'Ceramic-Hybrid Resin' },
            { label: 'Turnaround', val: '48 Hours' },
            { label: 'Indication', val: 'Single Crown, Inlay, Onlay, 3-Unit Bridge' },
        ],
        advantages: [
            'Zero metal — no grey gingival line ever',
            '62µm pixel accuracy — sub-clinical marginal gap',
            'Digital record stored permanently — free remake scans',
            'Shade-matched to Vita guide before dispatch',
        ],
        comparisons: [
            {
                conventional: 'Metal Crown (PFM)',
                conventionalProblems: [
                    'Grey metal margin appears at gumline within 2–3 years as gingiva recedes',
                    'Porcelain facing chips — especially on lower molars under heavy occlusion',
                    'Dark, opaque appearance under light; never looks truly natural',
                    'Corrosion byproducts cause tissue irritation and black gingival staining',
                ],
                hesyraAdvantages: [
                    'Full-ceramic appearance — no metal substructure, no shadow',
                    'Monolithic ceramic-hybrid construction — no facing to chip',
                    'Natural translucency that interacts with light like real enamel',
                    'Biocompatible resin — zero metallic ions released into tissue',
                ],
            },
            {
                conventional: 'E.max (Pressed Ceramic)',
                conventionalProblems: [
                    'Fractures under heavy bruxism — catastrophic failure in posterior cases',
                    'Long lead times — 7 to 10 days from impression to delivery',
                    'High lab cost passed on to patient, reducing case acceptance',
                    'Any chairside adjustment destroys the glaze layer permanently',
                ],
                hesyraAdvantages: [
                    'Ceramic-hybrid resin withstands 150–200 MPa flexural strength',
                    '48-hour guaranteed turnaround — patient returns in 2 appointments',
                    'Significantly lower lab fee — 40–60% cost reduction for the practice',
                    'Polishable chairside — any minor occlusal adjustment remains aesthetic',
                ],
            },
            {
                conventional: 'Zirconia (Milled)',
                conventionalProblems: [
                    'Opaque, chalky appearance in anterior cases — fails smile aesthetics',
                    'Extremely hard — accelerates wear on opposing natural dentition',
                    'Cannot be easily adjusted chairside — diamond burs required',
                    'Requires sintering time — adds 24–48 hrs to an already slow workflow',
                ],
                hesyraAdvantages: [
                    'Natural translucency — indistinguishable from natural teeth in anteriors',
                    'Hardness calibrated to enamel — no opposing tooth wear',
                    'Easy to polish and adjust with standard burs',
                    'No sintering required — straight from our printer to your patient',
                ],
            },
        ],
        painPoints: [
            {
                icon: '😤',
                scenario: 'The 6-Month Corrosion Return',
                quote: 'Patient comes back with inflamed gingiva and a black ring around the metal crown margin. You re-prep, re-impress, and wait another week. The patient questions your materials.',
            },
            {
                icon: '💔',
                scenario: 'The E.max Fracture',
                quote: 'A posterior E.max fractures 8 months after cementation. Patient is angry. You absorb the remake cost. Your lab takes 2 weeks. Another temporary. Another appointment.',
            },
            {
                icon: '🔍',
                scenario: 'The Shade Mismatch Disaster',
                quote: "Crown returns from the lab looking B1, but the patient clearly has A2 teeth. You send it back. 10 more days. Patient cancels the next appointment. Practice loses the case revenue.",
            },
            {
                icon: '⏱️',
                scenario: 'The Never-Ending Temporisation',
                quote: 'Patient on long-term antibiotics keeps delaying follow-ups. Your temporary crown is still in after 5 months. You re-cement it twice. The margin has started leaking.',
            },
        ],
    },
    {
        id: 'PRD_02',
        slug: 'dentures',
        category: 'RESTORATIONS',
        title: 'Digital Denture Systems',
        shortDescription: 'Monolithic or two-piece printed dentures. Significantly fewer appointments compared to conventional workflows.',
        fullDescription: 'Our digital denture workflow eliminates the most painful parts of conventional denture fabrication. No physical impressions, no try-ins that fail, no remakes after a month. We fabricate from your digital scans, store the record permanently, and deliver a perfectly fitted denture in 72 hours.',
        images: ['/3.webp', '/4.webp'],
        specs: [
            { label: 'Base Material', val: 'Biocompatible Pink Resin' },
            { label: 'Turnaround', val: '72 Hours (Full Denture)' },
            { label: 'Advantage', val: 'Digital record stored — free relines/remakes from scan' },
        ],
        advantages: [
            'Permanent digital scan stored — free future relines',
            'Biocompatible base resin — no tissue irritation',
            'Better fit from first delivery — fewer adjustments',
            'Significantly fewer clinical appointments required',
        ],
        comparisons: [
            {
                conventional: 'Conventional Acrylic Denture',
                conventionalProblems: [
                    '5–7 clinical appointments minimum — impression, bite, try-in, delivery, adjustments',
                    'Acrylic base frequently needs relines within 1–2 years as ridge resorbs',
                    'Physical impression boxes, alginate, plaster models — messy and error-prone',
                    'No record kept — patient must restart entire process if denture is lost or broken',
                ],
                hesyraAdvantages: [
                    '2 appointments — scan and delivery. Done.',
                    'Digital scan stored permanently — relines milled from existing data, free of charge',
                    'Intraoral scan or impression scan — clean, accurate, no gagging patient',
                    'Lost or broken? We reprint from the stored file. No re-scanning needed.',
                ],
            },
            {
                conventional: 'Cast Metal Framework Denture',
                conventionalProblems: [
                    'Weeks of lab time — metalwork casting has long lead cycles',
                    'Heavy, uncomfortable — patients often report fatigue with all-metal frameworks',
                    'Metal clasps visible when patient smiles — aesthetically unacceptable',
                    'Extremely difficult to reline or modify — any change requires full remake',
                ],
                hesyraAdvantages: [
                    '72-hour delivery — precision-printed pink base, no casting required',
                    'Lightweight printed base — patient comfort from day one',
                    'Full aesthetic resin — no visible metal clasps on anterior teeth',
                    'Modular design — base and teeth can be individually updated without full remake',
                ],
            },
        ],
        painPoints: [
            {
                icon: '😩',
                scenario: '5 Appointments for One Denture',
                quote: 'Primary impression, secondary impression, bite registration, tooth try-in, delivery — and then 3 adjustment appointments. The patient stops answering calls on appointment 4.',
            },
            {
                icon: '🤢',
                scenario: 'The Difficult Gagger',
                quote: 'Elderly patient with a hyperactive gag reflex. Every impression attempt fails. They vomit. You try again. After 4 failed attempts you tell them to reschedule. They never come back.',
            },
            {
                icon: '💸',
                scenario: 'Lost Denture = Full Restart',
                quote: 'Patient soaks their denture in a glass and accidentally throws it away during a hospital stay. No record kept means you start over from scratch. Full fee negotiation. Frustrated patient.',
            },
        ],
    },
    {
        id: 'PRD_06',
        slug: 'veneers',
        category: 'RESTORATIONS',
        title: 'Ceramic Veneers',
        shortDescription: 'Ultra-thin, highly aesthetic printed veneers with exceptional translucency matching natural dentition.',
        fullDescription: 'Our ceramic-filled resin veneers are fabricated at a minimum of 0.3mm — thinner than conventional porcelain veneers — with a Vita shade guide match verified visually before dispatch. The result is a restoration that adapts to your preparation and holds its colour long-term.',
        images: ['/5.webp', '/5.webp'],
        specs: [
            { label: 'Aesthetics', val: 'Vita Shade Guide Matched' },
            { label: 'Thickness', val: '0.3mm Minimum' },
            { label: 'Material', val: 'Ceramic-filled Resin' },
        ],
        advantages: [
            'Ultra-thin at 0.3mm — minimal or no-prep preparation',
            'Vita shade matched before dispatch — no shade surprises',
            'Ceramic-filled resin — natural translucency, long-term colour stability',
            'Chairside polishable — easy micro-adjustments at delivery',
        ],
        comparisons: [
            {
                conventional: 'Feldspathic / Pressable Porcelain Veneers',
                conventionalProblems: [
                    'Catastrophic fracture risk — especially in patients with edge-to-edge bite or parafunctions',
                    'Irreversible prep required — significant enamel removal even for thin variants',
                    'Clinic wait time: 10–14 days for lab fabrication, patient wears temporaries',
                    'Chairside adjustment impossible — grinding destroys polished ceramic surface',
                ],
                hesyraAdvantages: [
                    'Ceramic-hybrid flexibility — resists cracking, less brittle than pressed ceramics',
                    'No-prep or minimal-prep — 0.3mm thickness means enamel preserved',
                    '48-hour turnaround — no long temporary veneer period',
                    'Chairside polishable — adjust occlusion and margins without sensitivity',
                ],
            },
            {
                conventional: 'Composite Veneers (Chairside)',
                conventionalProblems: [
                    'Discolours significantly within 1–2 years of placement — patient dissatisfied',
                    'Surface degrades — composite becomes rough, traps stain and plaque',
                    'Highly technique-sensitive — shade layering is difficult to reproduce',
                    'Fracture edges stain immediately — visible repair lines within months',
                ],
                hesyraAdvantages: [
                    'Ceramic-filled resin does not discolour — colour-stable for years',
                    'Smooth, polished surface maintained long-term — easy patient hygiene',
                    'Fabricated under controlled lab conditions — consistent shade every time',
                    'No exposed composite fracture surfaces — monolithic construction',
                ],
            },
        ],
        painPoints: [
            {
                icon: '🎨',
                scenario: 'The Shade Nightmare',
                quote: '10 upper veneers placed. Patient looks in mirror and one veneer on the right lateral looks noticeably different. Lab error. All 10 go back. Patient cancels their review appointment.',
            },
            {
                icon: '🧱',
                scenario: 'Composite Stains in 8 Months',
                quote: 'You placed a composite veneer case 8 months ago. Patient is a coffee drinker. They come back and the veneer edges are orange. They want a refund. You redo 4 veneers at your cost.',
            },
            {
                icon: '💀',
                scenario: 'Porcelain Veneer Fracture on Wedding Day',
                quote: "Lateral incisor veneer fractures the morning of a patient's wedding. She calls in a panic. You have no spare. There is nothing you can do until Monday.",
            },
        ],
    },
    {
        id: 'PRD_03',
        slug: 'surgical-guides',
        category: 'SURGICAL',
        title: 'Surgical Guides',
        shortDescription: 'Autoclavable, biocompatible resin guides engineered for precise implant placement with minimal deviation.',
        fullDescription: 'Our surgical guides are designed from your CBCT and intraoral scan data, printed in clear autoclavable SG resin, and dispatched in 24 hours. Every sleeve position is planned digitally for your chosen implant system. The result is a guide that removes variability and makes you a more consistent implant surgeon.',
        images: ['/7.webp', '/7.webp'],
        specs: [
            { label: 'Material Core', val: 'Clear Autoclavable SG Resin' },
            { label: 'Turnaround', val: '24 Hours' },
            { label: 'Indication', val: 'Single Implant, Multiple Implant Surgery' },
        ],
        advantages: [
            'CBCT + scan co-registered — guide matches the patient exactly',
            'Autoclavable SG resin — full sterilisation, no compromise',
            'System-specific metal sleeves — compatible with your drills',
            'Bone, tissue, and anchor-pin variants available',
        ],
        comparisons: [
            {
                conventional: 'Freehand Implant Placement',
                conventionalProblems: [
                    'Implant deviation up to 7mm apically — documented in peer-reviewed literature',
                    'Nerve damage risk in posterior mandible — costly legal and clinical consequences',
                    'Requires highly experienced surgeon — not consistent across cases',
                    'Poor angulation affects restoration design — prosthetics are compromised',
                ],
                hesyraAdvantages: [
                    'Mean deviation under 1mm — guided precision every single case',
                    'Nerve canal mapped digitally — guide keeps you in the safe zone',
                    'Any dentist with implant training can work predictably with the guide',
                    'Angulation planned by prosthodontist data — restoration-driven placement',
                ],
            },
            {
                conventional: 'Lab-Made Conventional Guides',
                conventionalProblems: [
                    '7–14 day lab turnaround — delays surgery scheduling significantly',
                    'Based on physical study models — requires accurate impression, risk of errors',
                    'No sleeves or poorly fitted sleeves — wobble during drilling',
                    'No digital back-up — lost guide means restarting the entire process',
                ],
                hesyraAdvantages: [
                    '24-hour dispatch — plan today, operate tomorrow',
                    'CBCT co-registered to scan — micrometric accuracy, no model errors',
                    'Precision-fitted metal drill sleeves for your specific implant system',
                    'Guide is digitally archived — reprinting takes hours, not days',
                ],
            },
        ],
        painPoints: [
            {
                icon: '😰',
                scenario: 'The Nerve Near-Miss',
                quote: 'Freehand placement in the posterior mandible. You think the apex is 2mm from the canal. It is 0.5mm. Patient reports numbness in the lip for 6 weeks. Your hands shake every case after that.',
            },
            {
                icon: '🔩',
                scenario: 'Bad Angulation = Restoration Nightmare',
                quote: 'Implant placed without the guide. Angulation is 15 degrees off from the prosthetic plan. The lab cannot make a standard crown. You need a custom angled abutment at Rs. 18,000. Patient is angry.',
            },
            {
                icon: '📅',
                scenario: 'Guide Arrives 2 Weeks Late',
                quote: "Surgery day. Guide from the conventional lab is delayed. Patient took a week off work. You have to reschedule. They don't rebook. You lose the case entirely.",
            },
        ],
    },
    {
        id: 'PRD_04',
        slug: 'aligners',
        category: 'ORTHODONTICS',
        title: 'Retainers & Clear Aligners',
        shortDescription: 'Durable clear retainers and predictive sequential aligner models printed with high-clarity polyurethane resin.',
        fullDescription: 'We fabricate clear retainers and aligner model sets from your digital scans, printed in high-clarity polyurethane resin with 8-layer vacuum-formed aligner sheets. Each set is checked for thickness uniformity and attachment precision before dispatch. The result is a custom aligner system at a fraction of the cost of branded alternatives.',
        images: ['/6.webp', '/6.webp'],
        specs: [
            { label: 'Material', val: 'Polyurethane-Based Clear Resin + Aligner Sheet' },
            { label: 'Turnaround', val: '48–72 Hours per Set' },
            { label: 'Fit', val: 'Custom 3D Fit from Digital Scan' },
        ],
        advantages: [
            'Custom digital fit — not off-the-shelf sizing',
            'Uniform 0.75mm aligner thickness — consistent force per step',
            'Freedom to prescribe your own stages — you control the treatment',
            'Cost: a fraction of branded clear aligner subscriptions',
        ],
        comparisons: [
            {
                conventional: 'Traditional Metal Braces',
                conventionalProblems: [
                    'Patient compliance suffers — visible metal causes social embarrassment',
                    'Oral hygiene nearly impossible — food traps, prolonged decay risk',
                    'Emergency appointments for broken brackets disrupt scheduling',
                    'Long treatment duration — average 18–24 months with frequent chair time',
                ],
                hesyraAdvantages: [
                    'Nearly invisible — patient compliance is dramatically higher',
                    'Removable — patient brushes and flosses normally, decay risk eliminated',
                    'No brackets — zero emergency broken-bracket appointments',
                    'Designed stage-by-stage — efficient, controlled tooth movement',
                ],
            },
            {
                conventional: 'Branded Clear Aligners (International)',
                conventionalProblems: [
                    'Expensive subscription model — patient cost Rs 1–3 Lakh makes cases hard to close',
                    'Clinician has minimal control over staging and force prescription',
                    'Long order-to-delivery cycles — 3–4 weeks for first set',
                    'Refinements are costly and time-consuming — each refinement is a new order',
                ],
                hesyraAdvantages: [
                    'You set the price — lab cost is a fraction, practice margin is yours',
                    'You prescribe the stages — full clinical control over your case',
                    '48-72 hour turnaround per set — start treatment at the next appointment',
                    'Refinements are fast local reprints — not a new international order',
                ],
            },
        ],
        painPoints: [
            {
                icon: '💰',
                scenario: "Patient Can't Afford Branded Aligners",
                quote: "Patient needs alignment. Branded aligner quote is Rs 1.2 Lakh. They say they'll think about it. They don't come back. You lose the case entirely.",
            },
            {
                icon: '🙈',
                scenario: 'Teenager Refuses Metal Braces',
                quote: 'Teen patient refuses fixed braces due to social anxiety in school. Parent insists on braces. Patient removes them constantly. Treatment fails. Relationship with the practice damaged.',
            },
            {
                icon: '⏳',
                scenario: 'Waiting 4 Weeks for First Aligner Set',
                quote: 'Scan taken. Order placed with international company. 4 weeks later, first set arrives. By then, patient has changed their mind and cancelled the treatment plan.',
            },
        ],
    },
]

export const getProductBySlug = (slug) => productData.find(p => p.slug === slug)
export const getAdjacentProducts = (slug) => {
    const index = productData.findIndex(p => p.slug === slug)
    return {
        prev: index > 0 ? productData[index - 1] : null,
        next: index < productData.length - 1 ? productData[index + 1] : null,
    }
}
