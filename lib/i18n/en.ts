import type { TemplateId } from "@/lib/templates";

export const en = {
  meta: {
    title: "alchemy.ai",
    description: "Make social ads from your product photo — with BGM included",
  },
  lang: {
    en: "English",
    zh: "繁體",
    "zh-cn": "简体",
  },
  start: {
    title: "What are you promoting?",
    subtitle: "Pick one path — we’ll tailor the studio, styles, and required fields.",
    physicalTitle: "Physical product",
    physicalDesc: "You have a real product to photograph — jewelry, food, skincare, gadgets, etc.",
    physicalExamples: "e.g. bracelet, nasal washer, crystal, packaged goods",
    conceptTitle: "Service / website / concept",
    conceptDesc: "No physical SKU — promote a brand, site, course, membership, or pricing plan.",
    conceptExamples: "e.g. career report site, yoga studio, SaaS trial, 3-tier plan",
    continueLabel: "Continue to studio",
    switchLaterHint: "You can switch mode anytime from the studio header.",
  },
  header: {
    badge: "Easy mode · IG / FB reels · BGM included",
    title: "alchemy.ai studio",
    subtitle: "Upload product · pick a style · get Reels",
    subtitleConcept: "Brand copy · pick a style · get feed posts & reels",
    promotionPhysical: "Physical product",
    promotionConcept: "Service / concept",
    switchPromotion: "Switch type",
    homeLink: "Back to landing",
    themeToggleLight: "Light",
    themeToggleDark: "Dark",
    proLink: "Advanced tools",
  },
  landing: {
    badge: "AI marketing creative workflow",
    title: "Create product ads and reels in minutes.",
    subtitle:
      "Alchemy turns a product photo into images, storyboards, and videos with guided AI. Built for fast iteration and better output quality.",
    openStudio: "Open Studio",
    startCreating: "Start Creating",
    howItWorks: "How It Works",
    demoItems: [
      "Product photo input",
      "Style + prompt guidance",
      "Storyboard scenes",
      "Seedance video output",
    ],
    steps: [
      {
        no: "01",
        title: "Analyze product",
        body: "Use product details and optional brand context.",
      },
      {
        no: "02",
        title: "Generate creatives",
        body: "Create lifestyle images or storyboard scenes.",
      },
      {
        no: "03",
        title: "Refine to final video",
        body: "Use guided prompt + Seedance for final reel.",
      },
    ],
    quickStart: {
      quickAd: "Start Quick Ad",
      storyboard: "Start Storyboard Reel",
    },
    highlightsTitle: "Why this workflow works",
    highlights: [
      {
        title: "Beginner-safe defaults",
        body: "The wizard keeps settings simple by default and avoids common quality mistakes.",
      },
      {
        title: "Fast draft to final flow",
        body: "Generate still first, then animate to video — easier to iterate and control quality.",
      },
      {
        title: "Built for small business ads",
        body: "Templates and prompts are tuned for IG/FB reels and practical promotion use-cases.",
      },
    ],
    sampleTitle: "Typical output path",
    sampleTimeline: [
      "Upload product photo + fill headline",
      "Generate image or storyboard scene pack",
      "Review prompt and click generate video",
      "Download clean MP4 for CapCut/Premiere",
    ],
    faqTitle: "FAQ",
    faq: [
      {
        q: "How long does one run take?",
        a: "Quick image: ~10-30s. Storyboard image pack: ~2-5 min. Video: usually ~1-3 min depending on queue and duration.",
      },
      {
        q: "Will regenerating cost extra?",
        a: "Yes. Every AI regenerate call (image, scene, or video) is a new model run and is charged again.",
      },
      {
        q: "Do I need to upload reference videos?",
        a: "No. Reference MP4 is optional. Use it only when you want to mimic motion/style from an existing ad.",
      },
    ],
  },
  steps: {
    setup: "Setup",
    image: "Image",
    video: "Video",
    done: "Done",
  },
  wizard: {
    workflowLabel: "What do you want to output?",
    workflowModes: {
      "image-only": {
        title: "Images only",
        description: "AI promotional still — download PNG",
      },
      "video-only": {
        title: "Video only",
        description: "Product photo → Seedance reel (optional reference)",
      },
      combined: {
        title: "Image then video",
        description: "Nano Banana ad image → Seedance animation — get both",
      },
    },
    visualStyleLabel: "Visual style",
    visualStyleHint: "Style auto-applies lighting and mood — works for any product category",
    visualStyleHintVideoOnly:
      "Video-only: hides info poster, brand image, and campaign styles (for when you already have a still).",
    visualStyleHintCombined:
      "Image + video: still then motion. “Storyboard reel” = DeepSeek plans scenes → multiple images → one Seedance clip.",
    styleModeLabel: "Style set",
    styleModeSimple: "Show fewer (recommended)",
    styleModeAll: "Show all styles",
    styleAutoAppliedLabel: "Auto-applied style:",
    visualStyles: {
      product: {
        title: "Clean product",
        description: "Studio / lifestyle product shot — any SKU (default)",
      },
      "dark-premium": {
        title: "Dark premium",
        description: "Dark mood, gold accents — jewelry, watches, skincare, gifts",
      },
      "warm-shop": {
        title: "Warm shop promo",
        description: "Friendly local business / offer vibe",
      },
      "model-wear": {
        title: "Model wearing / using",
        description: "Product photo → photorealistic lifestyle model ad (on wrist, demo use, etc.)",
      },
      "info-poster": {
        title: "Premium info poster",
        description: "White-bg single-theme selling points — anti-generic-AI layout (IG technique)",
      },
      "brand-fit": {
        title: "Brand style analysis",
        description: "Paste website / IG → AI analyzes brand, then matching ads",
      },
      "brand-campaign": {
        title: "Brand analysis + campaign set",
        description: "Analyze brand → 3 linked posts (hero / selling points / offer)",
      },
      "brand-video": {
        title: "Brand video analysis",
        description: "Analyze site / social → DeepSeek writes Seedance video prompt",
      },
      "creative-video": {
        title: "Creative video prompt",
        description: "Describe your Reel idea → AI writes Seedance motion prompt",
      },
      "storyboard-video": {
        title: "Storyboard reel",
        description:
          "DeepSeek story per product → Nano Banana scene stills → one Seedance @Image video",
      },
      "paper-layout": {
        title: "Fixed paper layout (legacy)",
        description: "Exact text on template — not full AI scene generation",
      },
      "service-promo": {
        title: "Professional service",
        description: "Consulting, courses, memberships — trust-led, no product packshot",
      },
      "pricing-offer": {
        title: "Pricing & offer",
        description: "Plans, packages, promos — CTA + benefit bullets",
      },
      "website-launch": {
        title: "Website / app launch",
        description: "URL or app promo — device/browser mockup mood",
      },
    },
    visualStyleHints: {
      product: "Clean commercial product photo — studio or bright lifestyle, any physical product",
      "dark-premium":
        "Dark luxury mood with gold highlights — not only crystals; jewelry, watches, skincare, gifts",
      "warm-shop": "Warm inviting shop mood; emphasize business name and offer",
      "model-wear":
        "Upload product photo → AI generates a model wearing/using it — adapts to product type, not a fixed template",
      "info-poster": "",
      "brand-fit": "",
      "brand-campaign": "",
      "brand-video": "",
      "creative-video": "",
      "storyboard-video":
        "Photorealistic multi-scene reel — DeepSeek adapts scenes to your product category, not a fixed template",
      "paper-layout": "",
      "service-promo":
        "Service marketing — typography-led trust design, not a product hero shot",
      "pricing-offer": "Pricing / offer card — clear CTA; only use prices from your offer field",
      "website-launch": "Launch promo — app or website mockup mood; logo/screenshot optional",
    },
    brandVideoIntro:
      "Paste your site or IG @handle. DeepSeek analyzes the brand, then writes a Seedance video prompt (motion + mood). Upload a product photo to generate the Reel.",
    modelWearIntro:
      "Upload a product photo — AI generates a photorealistic 9:16 lifestyle ad with a model wearing or using the product. Bracelets go on wrist; devices show real use. Use Advanced framing to control face vs hands-only.",
    creativeVideoIntro:
      "Describe your short video in plain language (e.g. kung fu fight then drink the product). DeepSeek writes the Seedance prompt and notes how to use reference MP4 or dual frames for a full story. Video step only — upload a product photo or keyframe.",
    creativeBriefLabel: "Creative video brief (required)",
    creativeBriefPlaceholder:
      "e.g. Hero faces five opponents in kung fu, wins, then drinks the energy drink — cinematic, fast pace",
    brandCampaignIntro:
      "After brand analysis, DeepSeek plans 3 linked posts, then generates each — same brand DNA, different message per slide.",
    brandFitTitle: "Brand style analysis (optional)",
    brandFitTitleRequired: "Brand style analysis (required for this style)",
    brandFitIntro:
      "Paste your site or IG @handle. AI reads content, extracts colors, tone, and layout — then fills fields and generates on-brand ads. You still upload a product photo.",
    brandAnalyzeOptionalIntro:
      "Recommended: analyze your website or social profile so image and video prompts stay on-brand. Works with any style — you can skip and continue.",
    brandWebsiteLabel: "Brand website (recommended)",
    brandWebsitePlaceholder: "https://yourshop.com",
    brandSocialLabel: "Social profile (optional)",
    brandSocialPlaceholder: "@yourbrand or IG profile URL",
    brandAnalyzeBtn: "Analyze brand",
    brandAnalyzeBusy: "Analyzing…",
    infoPosterTechniqueTitle: "IG info-poster technique (built in)",
    infoPosterTechniqueIntro:
      "Do not cram all copy on one image. This workflow builds a premium white-background info graphic:",
    infoPosterTechniqueSteps: [
      "Product category — infer from name and photo (beauty, jewelry, food…)",
      "Selling points — one bullet per line in subline, max 3–4",
      "Simplified copy — headline covers ONE theme only",
      "Single topic per image — one message per still",
      "Category visuals — subtle props/colors for the category",
      "Premium white style — bright white, airy layout, not dark AI look",
      "Quality check — avoid overcrowded text and generic template frames",
    ],
    infoPosterBulletsPlaceholder:
      "One selling point per line, e.g.:\nBoost daily energy\nEasy to wear\nSubtle premium look",
    requirementsLabel: "Extra requirements (optional)",
    requirementsPlaceholder: "e.g. soft daylight, no hands, streetwear vibe…",
    requirementsPlaceholders: {
      product: "e.g. food photography, white backdrop, fresh skincare look, streetwear…",
      "dark-premium": "e.g. luxury watch mood, perfume dark tones, tea set gold highlights…",
      "warm-shop": "e.g. grand opening, wooden counter, neighborhood shop feel…",
      "model-wear": "e.g. masculine calm mood, window natural light, no price text…",
      "info-poster": "e.g. fresh skincare mood, natural food styling, minimal jewelry pedestal…",
      "brand-fit": "Filled after analysis; tweak product or scene if needed",
      "brand-campaign": "Optional campaign theme, e.g. spring launch — 3 posts on benefits",
      "brand-video": "Optional extra motion/mood notes — main prompt comes from brand analysis",
      "creative-video": "Creative brief is above; add extra motion/mood notes here if needed",
      "storyboard-video": "e.g. photorealistic, soft light, show product in use, no prices…",
      "paper-layout": "Paper template uses your exact text — usually leave this empty",
      "service-promo": "e.g. calm trust colors, testimonial vibe, class schedule feel…",
      "pricing-offer": "e.g. highlight middle tier, soft gradient, no invented prices…",
      "website-launch": "e.g. app mockup on phone, clean SaaS UI, launch countdown mood…",
    },
    campaignThemeLabel: "Campaign theme (optional)",
    campaignThemePlaceholder: "e.g. grand opening 3-post series, new product benefits…",
    imageOutputModeLabel: "How many images?",
    imageOutputModeHint: "Campaign generates 3 linked posts (~3× image API cost + DeepSeek planning)",
    imageOutputModes: {
      single: {
        title: "Single image",
        description: "One promo still (default)",
      },
      ab: {
        title: "A / B versions",
        description: "Two variations — pick your favorite",
      },
      campaign: {
        title: "Campaign set",
        description: "3 linked posts — hero, selling points, offer",
      },
      "teaching-carousel": {
        title: "Teaching carousel",
        description: "4 educational slides — cover, points, recap",
      },
    },
    imageAspectRatioLabel: "Post size (aspect ratio)",
    imageAspectRatioHint: "1K output. Pick 4:5 for IG/FB feed; 9:16 for Reels/Stories; 1:1 for square posts.",
    imageAspectRatios: {
      "9:16": {
        title: "9:16 Reels / Stories",
        description: "Vertical video frame · ~768×1365 px @ 1K",
      },
      "4:5": {
        title: "4:5 Feed portrait",
        description: "IG/FB feed default · ~928×1152 px @ 1K",
      },
      "1:1": {
        title: "1:1 Square",
        description: "Square feed / carousel · ~1024×1024 px @ 1K",
      },
    },
    imagePreflightAspect: "Size: {ratio} @ 1K",
    campaignPlanLabel: "Campaign outline",
    campaignGenerating: "Planning and generating campaign set… (~1–3 min)",
    storyboardBriefLabel: "Story / style notes (optional)",
    storyboardBriefPlaceholder:
      "e.g. photorealistic, soft light; show nasal washer in use; no prices; hands OK, no face…",
    storyboardIntro:
      "DeepSeek plans scenes for your product category (jewelry, devices, skincare, etc.) and writes a Seedance @Image storyboard prompt — not a fixed bracelet template.",
    storyboardGenerating: "Planning storyboard and generating scene images… (~2–5 min)",
    storyboardProgressPlanning: "Planning storyboard with DeepSeek…",
    storyboardProgressRendering: "Generating scene images {current}/{total}…",
    progressEta: "ETA ~{seconds}s",
    storyboardPlanLabel: "Storyboard plan",
    storyboardSceneLabel: "Scene",
    storyboardVideoIntro:
      "Storyboard and scene images are ready. Video uses reference-to-video with all scenes in one clip.",
    storyboardVideoPreflight: "Mode: multi-image reference-to-video (@Image1…@ImageN)",
    storyboardDurationLabel: "Target duration",
    storyboardDurationHint: "Affects how many scenes are planned. Regenerate scene images if you change this.",
    storyboardAllScenesHint: "All scene images below are sent to Seedance together — no A/B pick needed.",
    storyboardAllScenesImageHint: "Every scene is used in the video — do not pick a “version” below.",
    storyboardTrimDurationLabel: "Trim duration preset",
    storyboardEditorHint: "Mini editor: reorder scenes, replace one image, then regenerate video in-app.",
    storyboardMoveUpBtn: "Move up",
    storyboardMoveDownBtn: "Move down",
    storyboardReplaceImageBtn: "Replace image",
    storyboardRegenerateAiBtn: "Regenerate with AI",
    storyboardRegenerateAiCostHint: "Uses 1 extra image run (charged).",
    storyboardReplacingImage: "Replacing…",
    storyboardRegeneratingImage: "Regenerating…",
    storyboardRegenerateConfirm:
      "Regenerate Scene {scene} with AI now? This makes a new model call and charges again.",
    storyboardKeyframeSectionTitle: "Storyboard refs (@Image1…@ImageN)",
    storyboardPromptLabel: "Seedance storyboard prompt",
    storyboardPromptHint: "DeepSeek tagged each scene as @Image1, @Image2… Review before generating video.",
    storyboardPromptEditLabel: "Edit storyboard prompt (advanced)",
    primaryPathsTitle: "Primary creation paths",
    primaryPathsHint: "Start with one of these 3 paths. More styles are under Advanced.",
    videoPathsTitle: "Video creation paths",
    videoPathsHint: "Pick how to make your Reel — AI Video Assistant is recommended (upload a product photo kit).",
    videoAssistantStepHint:
      "AI Video Assistant selected — continue to Step 3 to upload product, packaging, and angle photos; AI will analyze and write the Seedance prompt.",
    primaryPathsShortcutNote:
      "These are quick shortcuts. In Advanced you can still pick the same style with more options.",
    pathQuickTitle: "Quick Ad",
    pathQuickDesc: "Fast image/video ad for most products.",
    pathModelTitle: "Model Wear/Use",
    pathModelDesc: "Shortcut to model-wear style (also available in Advanced).",
    pathStoryboardTitle: "Storyboard Reel",
    pathStoryboardDesc: "DeepSeek plans multi-scene story and video.",
    conceptPathsTitle: "Main concept paths",
    conceptPathsHint: "For services, websites, and offers — not product packshots.",
    conceptVideoPathsTitle: "Concept video paths",
    conceptVideoPathsHint:
      "Same concept brief powers the video — no product photo required. Pick a style, apply fields, then continue to video.",
    conceptVideoSameBriefHint:
      "Video mode uses the same concept fields. Upload a reference image first (optional), then AI analyze — then continue to video.",
    conceptVideoImageLabel: "Reference image for video (optional)",
    conceptVideoImageHint:
      "Your poster, illustration, or photo — AI will read it and plan how to animate it.",
    conceptVideoImageOrderHint:
      "If you have your own image: upload here first, then run AI concept analysis so DeepSeek knows what is in the frame.",
    conceptWizardTitle: "Concept Wizard (for non-physical offers)",
    conceptWizardHint:
      "Fill these 6 blocks, then auto-apply to headline/subline/offer and prompt direction.",
    conceptIdeaPlaceholder:
      "Your concept in one short paragraph (e.g. World Cup watch-party booking campaign for HK football fans).",
    conceptAudiencePlaceholder: "Audience: who should this ad speak to?",
    conceptPainPlaceholder: "Pain point: what problem do they feel now?",
    conceptPromisePlaceholder: "Promise: what outcome can they get?",
    conceptProofPlaceholder: "Proof/mechanism: why should they trust this?",
    conceptCtaPlaceholder: "Offer + CTA: what should they do now?",
    conceptVisualMetaphorPlaceholder:
      "Visual metaphor: what scene or symbolic visual should appear?",
    conceptAnalyzeBtn: "AI analyze concept",
    conceptAnalyzeBusy: "DeepSeek analyzing concept…",
    conceptAnalyzeReady: "Concept draft filled. Review and apply to fields.",
    conceptApplyBtn: "Apply concept to fields",
    conceptApplyHint:
      "Applies promise to headline, pain+proof to subline, CTA to offer, and audience/metaphor to extra requirements.",
    pathInfoTitle: "Info / education",
    pathInfoDesc: "Bullet benefits, how-it-works — IG feed friendly.",
    pathBrandTitle: "Brand / website",
    pathBrandDesc: "Analyze site or social → on-brand prompts.",
    pathPricingTitle: "Pricing / offer",
    pathPricingDesc: "Plans, packages, limited promos + CTA.",
    pathWebsiteTitle: "Website / app",
    pathWebsiteDesc: "Launch promo — logo or screenshot optional.",
    imagePreflightTitle: "Before generating image",
    imagePreflightSingle: "Single image generation call.",
    imagePreflightAB: "A/B mode: 2 image generations (about 2x cost).",
    imagePreflightCampaign: "Campaign set: 3 linked images + planning call.",
    imagePreflightTeachingCarousel: "Teaching carousel: 4 educational slides + planning call.",
    imagePreflightStoryboard: "Storyboard mode: multiple scene images + DeepSeek planning.",
    quickFixTitle: "Quick fix (minor issues)",
    quickFixImageHint:
      "Describe what to fix — we edit the image you see above and keep everything else the same.",
    quickFixVideoHint: "Apply one fix note and regenerate video from the same setup.",
    quickFixRealism: "Improve realism",
    quickFixText: "Remove text/logo",
    quickFixLighting: "Adjust lighting",
    quickFixCustomLabel: "Or describe the problem",
    quickFixCustomPlaceholder: "e.g. Remove the logo in the top-right corner",
    quickFixApplyBtn: "Apply fix",
    quickFixRefining: "Applying fix…",
    quickFixLessMotion: "Less motion",
    quickFixNoFace: "No face",
    quickFixMinor: "Fix minor artifacts",
    quickFixCreditReady: "{count} quick-fix credit available for this job.",
    quickFixCreditUsed: "Quick-fix credit used. Further retries use normal generation cost.",
    pickCampaignSlideLabel: "Pick one to continue (or download all)",
    campaignSlideRoles: {
      hero: "Hero",
      "selling-points": "Selling points",
      offer: "Offer",
    },
    imageCreativeLabel: "How should we create your image?",
    imageCreativeModes: {
      "promo-ai": {
        title: "AI promo image",
        description:
          "Product photo + your brief → style inferred from product and copy (not a fixed template)",
      },
      "reference-concept": {
        title: "Inspired by reference",
        description:
          "Keep reference layout and design elements; venue and lighting fit your product/shop; your headline copy",
      },
    },
    imageRefConceptLabel: "Reference ad (design guide)",
    imageRefConceptHint:
      "Upload an ad design you like — AI keeps layout, decorative elements, and product pose; venue and lighting adapt to your product/shop; use your own headline/subline.",
    imageRefConceptActiveHint:
      "Keeps reference design language (layout, components, in-hand/flat-lay pose) + your product photo + your copy. Venue, background, and lighting adjust for your product and shop — reference wording is not copied.",
    referenceConceptOverridesStyle:
      "Reference mode: design follows the reference ad; venue, lighting, and background fit your product and visual style (e.g. dark premium affects mood only). Pick “hands only” if the reference shows hands.",
    imageRefAutoModeNote:
      "Reference ad detected — generating with “Inspired by reference” (not a plain product polish).",
    uploadPreviewLabel: "Your upload (not generated yet)",
    aiImageResultLabel: "AI generated result",
    originalImageLabel: "Using original photo (no AI)",
    videoCreativeLabel: "How should we create your video?",
    conceptVideoCreativeLabel: "How should we create your concept video?",
    conceptVideoCreativeMode: {
      title: "Concept video (from brief)",
      description:
        "Uses your Concept Wizard copy — no product photo. Plan the AI video prompt first, then generate.",
    },
    conceptVideoStepIntro:
      "Concept mode: your anti-fight / PSA / service message becomes the video brief. Use “Concept video”, run AI prompt planning, then generate — skip product uploads.",
    conceptVideoPromptSectionTitle: "AI video prompt (from your concept)",
    conceptVideoPromptSectionHint:
      "No keyframe needed — Seedance generates from text. Run “Plan AI video prompt” above first.",
    conceptVideoPromptPending:
      "Run “Plan AI video prompt” above — your Concept Wizard copy will become the motion brief.",
    conceptVideoReferenceModeTitle: "Reference clip mode",
    conceptVideoReferenceModeHint:
      "Optional: upload a reference MP4 to match pacing. Concept copy still guides the message.",
    conceptVideoUseReferenceInstead: "Use a reference clip instead",
    conceptVideoBackToBrief: "Back to concept video (from brief)",
    conceptVideoKeyframeFromSetup:
      "Using your Step 1 reference image as @Image1 — AI will animate this still while keeping your concept message.",
    conceptAnalyzeApplied: "Fields applied — continue to video when ready.",
    videoCreativeModes: {
      "product-assistant": {
        title: "AI video assistant",
        description: "Upload product + packaging + angles → AI analyzes photos → situational Seedance reel",
      },
      "product-promo": {
        title: "Product promo video",
        description: "Animate your product / keyframe — smooth commercial motion",
      },
      "reference-concept": {
        title: "Inspired by reference video",
        description: "Your product + reference MP4 → motion & edit concept (not a clone)",
      },
      "image-to-video": {
        title: "Image → video",
        description: "Use the AI image from Step 2 — best for full image-then-video flow",
      },
    },
    videoSettingsTitle: "Video settings",
    videoSettingsResolution: "Resolution",
    videoSettingsDuration: "Duration",
    videoSettingsMotion: "Camera / motion",
    videoSettingsCreativity: "Motion energy",
    videoCreativityLevels: {
      subtle: "Soft — gentle zoom",
      lively: "Lively — varied motion (recommended)",
      cinematic: "Cinematic — multi-beat TVC feel",
    },
    videoAutoSecondFrame: "Auto-create a second scene (one upload → richer video)",
    videoAutoSecondFrameHint:
      "AI makes an alternate angle (e.g. on wrist) as the end frame so Seedance can move between two looks — not just zoom.",
    extraAnglesLabel: "Extra product angles (optional)",
    extraAnglesHint: "2–3 photos of the same item — more dynamic motion via multi-angle mode",
    extraAnglesCta: "Add angle photos",
    endFrameLabel: "Closing frame (optional)",
    endFrameHint: "Override auto — upload your own second shot",
    videoRichMotionNote:
      "Using lively motion + second frame for a more interesting clip than zoom-only.",
    videoWearVarietyTitle: "Want more variety or on-body wearing?",
    videoWearVarietyTips: [
      "Reference-video mode: motion follows @Video1 — if the clip has no hands, the output usually won’t add them.",
      "For on-wrist / in-hand: pick a reference MP4 with hands; use raw product photo as @Image1 (static ad keyframes are harder); set advanced framing to hands only.",
      "For more variety: use Lively or Cinematic creativity; or switch to Product promo + enable auto second frame (still life → on wrist).",
      "You can also generate an on-wrist still as the end frame, or add to the video prompt: gentle hand lifts bracelet onto wrist, face never shown.",
      "Full-face models are not supported — hands, feet, or torso only (no identifiable face).",
    ],
    videoSettingsFast: "Fast mode (lower cost, draft quality)",
    videoDurationAuto: "Auto",
    videoMotionStyles: {
      "slow-push": "Slow push-in",
      "gentle-orbit": "Gentle orbit",
      "static-glow": "Subtle shimmer (locked)",
      "pull-out": "Slow pull-out",
    },
    step1Title: "Step 1 — Output & product info",
    step1Hint: "Choose image, video, or both. Fill product details — AI builds from your inputs.",
    setupHints: {
      "image-only":
        "Next: create an image by describing it, from one reference photo, or from your product + a style reference.",
      "video-only":
        "Next: upload your product still (for @Image1), then optionally a reference ad MP4 to copy motion (@Video1).",
      combined:
        "Next: AI image from your product, then Seedance video — reference ad MP4 optional on the video step.",
    },
    setupCallouts: {
      "image-only": "Image workflow — no video step. Choose how to create the photo on the next screen.",
      "video-only": "Video workflow — Seedance + BGM. Upload product photo + reference ad MP4 on the next screen.",
      combined: "Full ad — generate/polish image first, then animate it. Reference MP4 copies motion like before.",
    },
    imageInputLabel: "How do you want to create the image?",
    imageInputModes: {
      "product-ad": {
        title: "Product → ad (recommended)",
        description:
          "Upload your product photo only — AI keeps your item and makes a clean, premium ad image (no style reference)",
      },
      "product-style": {
        title: "Product + style reference",
        description:
          "Upload product + a second reference image to copy that ad’s layout, lighting, and mood",
      },
      describe: {
        title: "Describe only",
        description: "No upload — write what you want in the prompt (use product name from Step 1)",
      },
      reference: {
        title: "Reference image only",
        description: "Upload one ad/photo — AI matches its look for your product description",
      },
    },
    videoSectionKeyframe: "1. Keyframe (@Image1)",
    videoSectionReference: "2. Reference ad — copy motion (@Video1)",
    videoSectionBgm: "3. Background music",
    continueNext: "Continue",
    continueToImage: "Continue → Image",
    continueToVideo: "Continue → Video step",
    finishImage: "Finish → Download",
    step2Title: "Step 2 — Promotional image (Nano Banana 2)",
    step2Hint:
      "Upload your product photo. AI generates a new ad image — or applies a reference concept if you chose that mode.",
    step2Hints: {
      "image-only": "Pick one of three ways below, then generate. Download when done — no video.",
      combined:
        "Default: upload product only for a clean ad image. Use “Product + style reference” only if you want to copy another ad’s look.",
    },
    imageModelLabel: "Image AI model",
    imageModels: {
      "nano-banana-2-edit": {
        label: "Nano Banana 2 Edit (default)",
        hint: "Upload product photo → AI designs a new ad, keeps your item",
      },
      "nano-banana-edit": {
        label: "Nano Banana Edit (legacy)",
        hint: "Upload product photo → AI polishes it, keeps your item",
      },
      "nano-banana": {
        label: "Nano Banana — text only",
        hint: "No upload needed — describe product in Step 1 name + prompt",
      },
      "nano-banana-pro-edit": {
        label: "Nano Banana Pro Edit (advanced)",
        hint: "Higher quality edit — needs product photo upload",
      },
    },
    twoVariantsLabel: "Generate 2 versions at once",
    twoVariantsHint: "Two images from the same settings — pick your favorite (~2× API cost)",
    pickVariantLabel: "Pick a version to continue",
    variantA: "Version A",
    variantB: "Version B",
    exactTextHint: "Need exact on-image Chinese text? AI images often misspell words.",
    exactTextCta: "Use paper + sticker template → exact headline on layout",
    uploadQualityLowRes:
      "Photo resolution is a bit low (800×800+ recommended) — you can still generate, but fine product detail may be soft.",
    uploadQualityVerySmall:
      "Photo is very small (under 512px) — please upload a clearer product shot.",
    imageRefLabel: "Style reference image (photo, optional)",
    imageRefHint:
      "For image AI only — layout/lighting/mood. Not the video MP4 reference (that is on the Video step).",
    styleRefPromptActive:
      "Style reference detected — prompt switched to match your reference image (composition, lighting, overlays). Regenerate to apply.",
    productAdHint:
      "AI designs a promo still from your headline/subline/offer — same product, plus ad copy and a polished background. No reference image needed.",
    imageRefCta: "Choose reference image",
    imageRefChange: "Change reference",
    videoKeyframeLabel: "Keyframe image",
    videoKeyframeHint: "The still image Seedance will animate (your photo or a generated image)",
    downloadImage: "Download image",
    imageDoneTitle: "Your image is ready",
    imageDoneHint: "Download the PNG. You can start a video workflow separately if needed.",
    generateImageBtn: "Generate image",
    regenerateImageBtn: "Regenerate image",
    useOriginalBtn: "Use my upload as-is (skip to video)",
    useOriginalImageOnlyBtn: "Use my upload as-is (no AI)",
    imageReadyHint: "Happy with this image? Continue to make the video.",
    imageReadyHintCombined: "This image becomes @Image1 for video — continue when you’re happy.",
    combinedVideoKeyframeCallout:
      "Your Step 2 promo still is Seedance @Image1 (image-to-video). To copy reference motion, switch to “Inspired by reference video”.",
    combinedCreativeImageHint:
      "Generate a promo still here that matches your creative brief — the video step animates this image.",
    combinedRefKeyframeNote:
      "Reference mode: use your raw product photo as @Image1 (not the ad still) so Seedance can match @Video1 motion.",
    step3Title: "Step 3 — Video (AI motion)",
    step3Hint:
      "Seedance animates your image. Optional: upload a reference ad MP4 to copy its motion (@Image1 + @Video1).",
    step3Hints: {
      "video-only":
        "Default: AI video assistant — upload product (+ packaging / angles), analyze, then generate. Or switch to product promo / reference MP4.",
      combined:
        "Your image from Step 2 is @Image1. Add a reference ad MP4 below to copy motion — same as before.",
    },
    generateVideoBtn: "Generate video",
    step4Title: "Step 4 — Your ad is ready",
    step4Hint: "Download MP4 (with BGM).",
    uploadLabel: "Product photo",
    uploadLabelConcept: "Hero image (optional)",
    uploadHint: "JPG, PNG or WEBP · clear photo of your product works best",
    uploadHintConcept: "Logo, app screenshot, or brand graphic — optional; copy-only also works",
    uploadCta: "Tap to choose photo",
    uploadChange: "Change photo",
    referenceLabel: "Reference ad video (MP4)",
    referenceHint:
      "Upload a short MP4 ad you want to copy. AI will put your product (@Image1) into similar motion/style as @Video1.",
    referenceVideoOnlyHint: "MP4 or MOV · optional but recommended to copy motion from a real ad",
    needKeyframeGoBack:
      "No keyframe yet — go Back, generate an image (or use your upload), then return here.",
    referenceImageOnlyHint:
      "You uploaded an image — for AI motion matching, upload a video reference (MP4).",
    referenceModeNote: "Used reference-to-video: your product photo + reference ad.",
    referenceModeActive:
      "Reference video detected — AI uses your keyframe as @Image1 and matches @Video1 motion.",
    referenceVideoTooLong:
      "Reference is ~{seconds}s — Seedance only uses the first 2–15s. Trim an 8–12s highlight in CapCut before upload for a closer match.",
    referenceVideoTips:
      "Reference tips: ① Trim to 8–12s (not a full 30s reel) ② Product photo must match the item in the ad ③ Avoid screen recordings (IG buttons) ④ Use “Inspired by reference video” + 720p.",
    videoRefAutoModeNote:
      "Reference MP4 detected — using “Inspired by reference video” (not image-to-video, which ignores your clip).",
    videoRefProductMismatch:
      "Reference shows hands/stringing — use your raw product photo as @Image1 (not the generated ad still) so Seedance can match motion.",
    videoRefUseProductPhoto:
      "Tip: using the AI ad still as @Image1 — upload the raw product photo instead for better motion match.",
    videoGenPathLabel: "Seedance path",
    videoRefIgnoredOnImageMode:
      "Reference MP4 uploaded but mode is “Product motion” — it will be ignored. Switch to “Inspired by reference video” to match the clip.",
    videoPreflightTitle: "Pre-flight check",
    videoPreflightModeProduct: "Mode: product image → video (image-to-video)",
    videoPreflightModeRef: "Mode: product image + reference MP4 (reference-to-video)",
    videoPreflightSettings: "Quality {resolution} · duration {duration} · {tier}",
    videoPreflightTierFast: "Fast draft (cheaper)",
    videoPreflightTierQuality: "Standard quality",
    videoPreflightStyle: "Visual style: {style}",
    videoPreflightSecondFrame:
      "Will call image API once for an auto second frame (~extra image cost) — turn off “Auto-create a second scene” to save",
    videoPreflightSingleCall: "Expected: 1× Seedance + local BGM (no extra image)",
    videoPreflightDoubleCall: "Expected: 1× image + 1× Seedance + BGM",
    videoPreflightDeepSeek: "+1× DeepSeek video prompt (brand video analysis)",
    planVideoPromptBtn: "AI write video prompt",
    planVideoPromptBusy: "DeepSeek writing video prompt…",
    planVideoPromptReady: "Video prompt filled below — review before generating",
    productVideoKitTitle: "Product photo kit",
    productVideoKitHint:
      "Upload hero product (required), packaging, or extra angles — AI vision reads all photos, then DeepSeek writes a situational Seedance prompt.",
    productVideoHeroLabel: "Hero product (@Image1)",
    productVideoHeroHint: "Main product shot — required",
    productVideoPackagingLabel: "Packaging / box (optional)",
    productVideoPackagingHint: "Retail box or package — @Image2 if uploaded",
    productVideoExtraLabel: "Extra angles (optional)",
    productVideoExtraHint: "Up to 2 more photos — detail, back, in-use context",
    planProductVideoBtn: "Analyze photos & plan video",
    planProductVideoBusy: "AI analyzing photos & writing Seedance prompt…",
    planProductVideoReady: "Video plan ready — review prompt below, then generate",
    productVideoSituationLabel: "Suggested setting",
    productVideoPlanLabel: "Seedance prompt (from AI assistant)",
    productVideoPlanHint: "Vision analyzed your uploads; DeepSeek wrote motion + scene plan. Edit in advanced if needed.",
    productVideoAssistantPreflight: "Mode: AI video assistant — multi-image reference-to-video",
    productVideoAnalyzeFirstHint: "Upload hero product, tap Analyze photos & plan video, then generate.",
    videoKeyframeProductLabel: "Product / keyframe photo (@Image1)",
    videoKeyframeProductHint:
      "Required. Your product or still — used as @Image1. With a reference MP4, AI matches @Video1 motion.",
    referenceCta: "Tap to choose reference ad",
    referenceChange: "Change reference",
    productLabel: "Product name (optional)",
    productPlaceholder: "e.g. goldstone bracelet",
    businessLabel: "Shop name",
    businessPlaceholder: "e.g. Lucky Crystal HK",
    offerLabel: "Offer (optional)",
    offerPlaceholder: "e.g. 20% off this week",
    bgmLabel: "Background music",
    bgmCalm: "Calm",
    bgmUpbeat: "Upbeat",
    bgmWarm: "Warm",
    phaseSecondFrame: "Creating a second scene for richer motion…",
    phaseVideo: "Making your video…",
    phaseBgm: "Adding background music…",
    imageGenerating: "Generating image…",
    download: "Download video (with BGM)",
    downloadEditPack: "Download CapCut edit pack (JSON)",
    subtitles: "Add subtitles (advanced)",
    newProject: "Make another ad",
    back: "Back",
    advanced: "Advanced options",
    advancedWorkflow: "Advanced: output type & visual style",
    advancedPrompts: "Advanced: AI prompt text",
    advancedHint: "Pick variables below — prompts update automatically. You can still edit the text.",
    marketLabel: "Look & market style",
    framingLabel: "People / body in shot",
    extraLabel: "Extra instructions (optional)",
    extraPlaceholder: "e.g. gold bangle on wrist, outdoor daylight",
    promptPreview: "AI prompts (editable)",
    resetPrompts: "Reset from options",
    imagePromptLabel: "Image polish prompt",
    videoPromptLabel: "Video motion prompt",
    promptMarkets: {
      hk: { label: "Hong Kong / Cantonese market", hint: "HK boutique, urban, premium SMB ads" },
      tw: { label: "Taiwan market", hint: "Soft lifestyle, local brand feel" },
      cn: { label: "Mainland China market", hint: "Bright e-commerce / short-video style" },
      en: { label: "English / international", hint: "Clean western retail look" },
    },
    promptFramings: {
      auto: { label: "Auto (template default)", hint: "Uses the style you picked above" },
      "product-only": { label: "Product only — no people", hint: "Hero product shot, nobody in frame" },
      "hands-only": {
        label: "Hands only — no face",
        hint: "Hands holding or wearing product; face never shown",
      },
      "legs-feet": {
        label: "Legs & feet only",
        hint: "For shoes, socks, leggings — cropped above knee, no face",
      },
      "torso-no-face": {
        label: "Body / torso — no face",
        hint: "Arms or torso OK; face must be out of frame",
      },
      "no-people": { label: "Strict — no people at all", hint: "Product and background only" },
    },
    retry: "Try again",
    bgmNote: "BGM added from your music library.",
    bgmFallbackNote: "Library BGM not found — used soft AI music instead. Run: npm run setup:bgm",
    adStyleLabel: "What kind of ad?",
    adStyleHint: "Pick the closest match — ~80–90% on first try when you use the suggested path.",
    moreOptionsLabel: "More options (output type)",
    adStyles: {
      "paper-sticker": {
        title: "Paper note + sticker Reels",
        description: "Fixed IG layout — your exact headline & bullets. Best text accuracy.",
      },
      "product-showcase": {
        title: "Product showcase Reels",
        description: "Clean AI product shot + gentle motion. Works for any product.",
      },
      "copy-reference-ad": {
        title: "Copy a reference ad",
        description: "Pick a sample motion clip + your product photo. Closest to real ads.",
      },
      "shop-promo": {
        title: "Shop / offer promo",
        description: "Store, service or limited-time offer — warm promo vibe.",
      },
    },
    referenceClipLibraryLabel: "Sample motion clips (built-in)",
    referenceClipLibraryHint: "Tap one to use as @Video1 — or upload your own MP4 below.",
    referenceClipsMissing:
      "Built-in motion samples are not installed (public/references/*.mp4). Upload your own reference MP4 below.",
    videoGenerateDisabledHint:
      "Upload a product photo in the keyframe section, or go back to Step 2 to generate or confirm your image.",
    referenceClips: {
      "product-push-in": "Slow push-in",
      "gentle-orbit": "Gentle orbit",
      "cozy-lifestyle": "Cozy lifestyle",
    },
    adTemplateLabel: "Choose ad template",
    templateChecklistLabel: "Template components",
    templateSlotRequired: "required",
    templateImageModeLocked: "Image mode is fixed for this template.",
    headlineLabel: "Headline (main hook)",
    headlinePlaceholder: "e.g. How I prep a month of content in 2 hours",
    sublineLabel: "Subline (optional)",
    sublinePlaceholder: "e.g. The secret to 10× efficiency",
    sublineBulletsLabel: "Bullet points (one per line)",
    sublineBulletsPlaceholder: "Energy frequency\nPersonal connection\nTell real from fake",
    brandLabel: "Brand / handle",
    brandPlaceholder: "crystal hk",
    signoffLabel: "Sign-off (optional)",
    signoffPlaceholder: "從略",
    compositorCallout:
      "This template uses a fixed IG layout — your headline, bullets, and brand are placed exactly. AI is not used for the layout.",
    compositorImageHint:
      "Upload your product photo. We cut it into a circular sticker and compose the paper note with your text.",
    compositorImageBtn: "Build ad image",
    compositorRegenerateImageBtn: "Rebuild image",
    compositorVideoHint:
      "Builds a 6-second reel: slow zoom, paper float, sparkle twinkle, plus BGM. No Seedance AI video.",
    compositorVideoBtn: "Build reel video",
    compositorPhaseRender: "Rendering frames…",
    templateSlots: {
      product: "Product name",
      headline: "Headline",
      subline: "Subline",
      productPhoto: "Product photo",
      styleRef: "Style reference image",
      referenceVideo: "Reference ad MP4",
      business: "Shop name",
      offer: "Offer",
    },
  },
  templates: {
    "paper-sticker-reel": {
      name: "Paper + sticker reel",
      description: "Fixed IG paper layout — your text + product sticker, image & animated reel",
    },
    "product-reel": {
      name: "Product showcase",
      description: "Clean hero product shot with gentle motion",
    },
    "crystal-promo": {
      name: "Dark premium",
      description: "Dark luxury look with gold accents — not only crystals",
    },
    "shop-promo": {
      name: "Shop promo",
      description: "Storefront, service or limited-time offer",
    },
    "info-poster": {
      name: "Premium info poster",
      description: "White IG info graphic — single theme, tight copy, category visuals",
    },
    "brand-fit": {
      name: "Brand style analysis",
      description: "Ads matched to website/social brand DNA",
    },
    "brand-campaign": {
      name: "Brand campaign set",
      description: "Analyze brand → 3 linked posts",
    },
    "brand-video": {
      name: "Brand video analysis",
      description: "DeepSeek writes Seedance video prompt",
    },
    "creative-video": {
      name: "Creative video prompt",
      description: "Describe idea → DeepSeek writes Seedance prompt",
    },
    "storyboard-video": {
      name: "Storyboard reel",
      description: "DeepSeek storyboard → scene images → one Seedance clip",
    },
    "model-wear-reel": {
      name: "Model lifestyle wear",
      description: "Product photo → photorealistic model lifestyle ad",
    },
    testimonial: {
      name: "Customer style",
      description: "Warm lifestyle look for reviews",
    },
    "service-promo": {
      name: "Service promo",
      description: "Trust-led layout for classes, consulting, or memberships",
    },
    "pricing-offer": {
      name: "Pricing / offer",
      description: "Plans, packages, or limited promos with clear CTA",
    },
    "website-launch": {
      name: "Website / app launch",
      description: "Launch graphic — logo or screenshot optional",
    },
    custom: {
      name: "Custom",
      description: "Pick your own components and prompts",
    },
  } satisfies Record<TemplateId, { name: string; description: string }>,
  errors: {
    polishFailed: "Could not enhance your photo. Try again or turn on fast mode.",
    videoFailed: "Video creation failed. Please try again.",
    network: "Network error. Check your internet connection and try again.",
    serviceUnavailable:
      "Image and video generation is temporarily unavailable. Please try again later.",
    planningUnavailable: "AI planning is temporarily unavailable. Please try again later.",
    deepSeekBalanceEmpty:
      "DeepSeek account balance is empty. Top up at platform.deepseek.com, then try again.",
    timeout: "The request took too long. Please try again.",
    seedanceSensitive:
      "Seedance blocked this clip (violence/combat filter). Use calmer wording: no weapons, opponents, or standoffs — figures at rest, peaceful pause. A combat-looking reference image can also trigger this.",
    needPhoto: "Please upload a product photo first.",
    needReferenceImage: "Please upload a reference image first.",
    needHeadline: "Please enter a headline for this template.",
    needKeyframe: "Generate an image or choose “use my upload as-is” before making video.",
    needStyleReference: "Upload a reference ad image for “inspired by reference” mode.",
    needReferenceVideo: "Upload a reference MP4 for “inspired by reference video” mode.",
    needGeneratedImage: "Generate your AI image in Step 2 first (image → video flow).",
    needPrompt: "Upload a photo, or describe what to create in advanced options.",
    imageGenNoUrl: "AI did not return an image URL — check the terminal or try again.",
    needRefineImage: "Generate an AI image first, then you can apply a targeted fix.",
    needAiImage: "Tap Generate image — do not continue with only your raw upload.",
    brandUrlRequired: "Enter a brand website or social handle.",
    brandAnalyzeFailed: "Brand analysis failed — check the URL and try again.",
    campaignFailed: "Campaign generation failed. Please try again.",
    storyboardFailed: "Storyboard generation failed. Please try again.",
    storyboardVideoPromptRequired: "Generate storyboard scene images in Step 2 first.",
    needProductName: "Product name is required for storyboard planning.",
    extraAnglesNeedRefVideo:
      "Multi-angle mode needs a reference MP4 too (use “Inspired by reference video”).",
    brandVideoPromptRequired: "Analyze brand first, then click “AI write video prompt”.",
    creativeBriefRequired: "Fill in the creative video brief first.",
    creativeVideoPromptRequired: "Click “AI write video prompt” and review the prompt below.",
    planVideoPromptFailed: "Video prompt planning failed. Please try again.",
    planProductVideoFailed: "Product video planning failed. Check photos and try again.",
    planConceptFailed: "Concept analysis failed. Please try again.",
    conceptVideoAssistantBlocked:
      "AI Video Assistant is for physical products only. Concept mode uses Concept video from your brief.",
    conceptVideoPlanRequired:
      "AI is planning the video prompt — wait a few seconds, or tap “AI write video prompt”.",
    needProductVideoPlan: "Tap Analyze photos & plan video first.",
    brandAnalyzeRequired: "Tap Analyze brand first.",
  },
  pro: {
    back: "← Back",
    title: "Advanced tools",
    body: "Full controls (reference-to-video AI, cost presets, Cantonese subtitles) are still in your original app:",
    footnote: "These features will move here in a later update.",
  },
} as const;
