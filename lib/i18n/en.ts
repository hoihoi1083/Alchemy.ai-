import type { TemplateId } from "@/lib/templates";

export const en = {
  meta: {
    title: "AI Marketing Studio",
    description: "Make social ads from your product photo — with BGM included",
  },
  lang: {
    en: "English",
    zh: "中文",
  },
  header: {
    badge: "Easy mode · IG / FB reels · BGM included",
    title: "AI Marketing Studio",
    subtitle: "Upload product · pick a style · get Reels",
    proLink: "Advanced tools",
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
      "paper-layout": {
        title: "Fixed paper layout (legacy)",
        description: "Exact text on template — not full AI scene generation",
      },
    },
    visualStyleHints: {
      product: "Clean commercial product photo — studio or bright lifestyle, any physical product",
      "dark-premium":
        "Dark luxury mood with gold highlights — not only crystals; jewelry, watches, skincare, gifts",
      "warm-shop": "Warm inviting shop mood; emphasize business name and offer",
      "info-poster": "",
      "brand-fit": "",
      "brand-campaign": "",
      "paper-layout": "",
    },
    brandCampaignIntro:
      "After brand analysis, DeepSeek plans 3 linked posts, then generates each — same brand DNA, different message per slide.",
    brandFitTitle: "Analyze brand style (do this first)",
    brandFitIntro:
      "Paste your site or IG @handle. AI reads content, extracts colors, tone, and layout — then fills fields and generates on-brand ads. You still upload a product photo.",
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
      "info-poster": "e.g. fresh skincare mood, natural food styling, minimal jewelry pedestal…",
      "brand-fit": "Filled after analysis; tweak product or scene if needed",
      "brand-campaign": "Optional campaign theme, e.g. spring launch — 3 posts on benefits",
      "paper-layout": "Paper template uses your exact text — usually leave this empty",
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
    },
    campaignPlanLabel: "Campaign outline",
    campaignGenerating: "Planning and generating campaign set… (~1–3 min)",
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
          "Reference sets scene/pose/composition; product photo supplies the real item — AI composes a new ad (not a copy)",
      },
    },
    imageRefConceptLabel: "Reference ad image (for concept)",
    imageRefConceptHint:
      "Upload a reference ad JPG/PNG — AI follows scene, pose, composition, and lighting only, swapping in your product. Fill headline/subline.",
    imageRefConceptActiveHint:
      "Uses the reference concept (e.g. hand holding bracelet, marble table, lifestyle mood) + your product photo + your headline/subline copy. Not a pixel copy of the reference.",
    imageRefAutoModeNote:
      "Reference ad detected — generating with “Inspired by reference” (not a plain product polish).",
    uploadPreviewLabel: "Your upload (not generated yet)",
    aiImageResultLabel: "AI generated result",
    originalImageLabel: "Using original photo (no AI)",
    videoCreativeLabel: "How should we create your video?",
    videoCreativeModes: {
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
    step3Title: "Step 3 — Video (AI motion)",
    step3Hint:
      "Seedance animates your image. Optional: upload a reference ad MP4 to copy its motion (@Image1 + @Video1).",
    step3Hints: {
      "video-only":
        "Upload your product still, then optional reference ad MP4. With MP4, AI uses your photo as @Image1 and matches @Video1 motion.",
      combined:
        "Your image from Step 2 is @Image1. Add a reference ad MP4 below to copy motion — same as before.",
    },
    generateVideoBtn: "Generate video",
    step4Title: "Step 4 — Your ad is ready",
    step4Hint: "Download MP4 (with BGM).",
    uploadLabel: "Product photo",
    uploadHint: "JPG, PNG or WEBP · clear photo of your product works best",
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
      "You uploaded a reference MP4 but this run used image-to-video — the clip was NOT sent. Switch to “Inspired by reference video”.",
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
    subtitles: "Add subtitles (advanced)",
    newProject: "Make another ad",
    back: "Back",
    advanced: "Advanced options",
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
    testimonial: {
      name: "Customer style",
      description: "Warm lifestyle look for reviews",
    },
    custom: {
      name: "Custom",
      description: "Pick your own components and prompts",
    },
  } satisfies Record<TemplateId, { name: string; description: string }>,
  errors: {
    polishFailed: "Could not enhance your photo. Try again or turn on fast mode.",
    videoFailed: "Video creation failed. Please try again.",
    network: "Network error. Check your internet and FAL_KEY in .env.local",
    needPhoto: "Please upload a product photo first.",
    needReferenceImage: "Please upload a reference image first.",
    needHeadline: "Please enter a headline for this template.",
    needKeyframe: "Generate an image or choose “use my upload as-is” before making video.",
    needStyleReference: "Upload a reference ad image for “inspired by reference” mode.",
    needReferenceVideo: "Upload a reference MP4 for “inspired by reference video” mode.",
    needGeneratedImage: "Generate your AI image in Step 2 first (image → video flow).",
    needPrompt: "Upload a photo, or describe what to create in advanced options.",
    imageGenNoUrl: "AI did not return an image URL — check the terminal or try again.",
    needAiImage: "Tap Generate image — do not continue with only your raw upload.",
    brandUrlRequired: "Enter a brand website or social handle.",
    brandAnalyzeFailed: "Brand analysis failed — check the URL or DEEPSEEK_API_KEY in .env.local.",
    campaignFailed: "Campaign generation failed — check DeepSeek balance and FAL_KEY.",
    brandAnalyzeRequired: "Tap Analyze brand first.",
  },
  pro: {
    back: "← Back",
    title: "Advanced tools",
    body: "Full controls (reference-to-video AI, cost presets, Cantonese subtitles) are still in your original app:",
    footnote: "These features will move here in a later update.",
  },
} as const;
