"use client";

import { useState } from "react";
import { useWizard } from "@/components/studio/WizardContext";
import { WorkflowModePicker } from "@/components/WorkflowModePicker";
import { VisualStylePicker } from "@/components/VisualStylePicker";
import { TemplateSlotChecklist } from "@/components/TemplateSlotChecklist";
import { AdvancedPromptPanel } from "@/components/AdvancedPromptPanel";
import { isSlotRequired, templateHasSlot } from "@/lib/template-slots";
import { VIDEO_DURATIONS, type VideoDuration } from "@/lib/video-settings";
import { isBrandVideoStyle, isCreativeVideoStyle, isBrandVisualStyle, isStoryboardVideoStyle, isAiPlannedVideoStyle, visualStylePromptHint } from "@/lib/visual-styles";
import { UploadZone } from "@/components/UploadZone";

export function SetupStep() {
  const { advancedSection, analyzeBrand, applyPrimaryPath, applyPrimaryPathConcept, applyPrimaryPathConceptVideo, applyPrimaryPathVideoOnly, applyPromptRebuild, brandAnalyzeBusy, brandAnalyzeNote, brandSocialHint, brandWebsiteUrl, business, conceptIdea, continueSetupLabel, creativeVideoBrief, goNextFromSetup, headline, imagePrompt, lockedCampaignMode, m, offer, onProductPhotoSelected, onWorkflowModeChange, planAiVideoPrompt, product, productPhoto, promotionMode, promptExtra, promptMarket, selectVisualStyle, setBrandSocialHint, setBrandWebsiteUrl, setBusiness, setConceptIdea, setConceptImageVisionNote, setCreativeVideoBrief, setError, setHeadline, setImagePrompt, setOffer, setProduct, setPromptExtra, setPromptMarket, setShowAdvancedSetup, setShowAdvancedSetupPrompts, setStoryboardBrief, setSubjectFraming, setSubline, setUseOriginalImage, setVideoPrompt, setVideoSettings, showAdvancedSetup, showAdvancedSetupPrompts, storyboardBrief, subjectFraming, subline, templateId, templateSlotStatus, uploadPreviewUrl, usesCompositor, usesReferenceConceptForImage, videoCreativeMode, videoPrompt, videoSettings, visualStyleId, workflowMode } = useWizard();
  const isConcept = promotionMode === "concept";
  const isConceptVideoOnly = isConcept && workflowMode === "video-only";
  const isVideoOnlyPhysical = !isConcept && workflowMode === "video-only";
  const pathsTitle = isConceptVideoOnly
    ? m.wizard.conceptVideoPathsTitle
    : isConcept
    ? m.wizard.conceptPathsTitle
    : isVideoOnlyPhysical
      ? m.wizard.videoPathsTitle
      : m.wizard.primaryPathsTitle;
  const pathsHint = isConceptVideoOnly
    ? m.wizard.conceptVideoPathsHint
    : isConcept
    ? m.wizard.conceptPathsHint
    : isVideoOnlyPhysical
      ? m.wizard.videoPathsHint
      : m.wizard.primaryPathsHint;
  const assistantMode = m.wizard.videoCreativeModes["product-assistant"];
  const [conceptAudience, setConceptAudience] = useState("");
  const [conceptPain, setConceptPain] = useState("");
  const [conceptPromise, setConceptPromise] = useState("");
  const [conceptProof, setConceptProof] = useState("");
  const [conceptCta, setConceptCta] = useState("");
  const [conceptVisualMetaphor, setConceptVisualMetaphor] = useState("");
  const [conceptPlanBusy, setConceptPlanBusy] = useState(false);
  const [conceptPlanNote, setConceptPlanNote] = useState<string | null>(null);
  function applyConceptWizard(
    draft?: {
      audience?: string;
      painPoint?: string;
      promise?: string;
      proof?: string;
      cta?: string;
      visualMetaphor?: string;
    },
    imageVisionNote?: string,
  ) {
    const audience = (draft?.audience ?? conceptAudience).trim();
    const pain = (draft?.painPoint ?? conceptPain).trim();
    const promise = (draft?.promise ?? conceptPromise).trim();
    const proof = (draft?.proof ?? conceptProof).trim();
    const cta = (draft?.cta ?? conceptCta).trim();
    const metaphor = (draft?.visualMetaphor ?? conceptVisualMetaphor).trim();
    const nextHeadline = promise;
    const nextSubline = [pain, proof].filter(Boolean).join(" | ");
    const nextOffer = cta;
    const conceptExtra = [
      audience ? `Target audience: ${audience}` : "",
      metaphor ? `Visual metaphor and scene direction: ${metaphor}` : "",
    ]
      .filter(Boolean)
      .join(". ");
    if (nextHeadline) setHeadline(nextHeadline);
    if (nextSubline) setSubline(nextSubline);
    if (nextOffer) setOffer(nextOffer);
    if (conceptExtra) {
      setPromptExtra((prev) => [prev.trim(), conceptExtra].filter(Boolean).join(" | "));
    }
    const conceptBrief = [
      conceptIdea.trim(),
      audience ? `Audience: ${audience}` : "",
      pain ? `Pain: ${pain}` : "",
      promise ? `Promise: ${promise}` : "",
      proof ? `Proof: ${proof}` : "",
      metaphor ? `Visual direction: ${metaphor}` : "",
      imageVisionNote?.trim() ? `Reference image: ${imageVisionNote.trim()}` : "",
    ]
      .filter(Boolean)
      .join(". ");
    if (conceptBrief && (workflowMode === "video-only" || workflowMode === "combined")) {
      setCreativeVideoBrief(conceptBrief);
    }
  }
  async function analyzeConceptWithAi() {
    setConceptPlanBusy(true);
    setConceptPlanNote(null);
    setError(null);
    try {
      let res: Response;
      if (productPhoto && (workflowMode === "video-only" || workflowMode === "combined")) {
        const fd = new FormData();
        fd.set("product", product.trim());
        fd.set("business", business.trim());
        fd.set("headline", headline.trim());
        fd.set("subline", subline.trim());
        fd.set("offer", offer.trim());
        fd.set("promptExtra", promptExtra.trim());
        fd.set("conceptIdea", conceptIdea.trim());
        fd.set("visualStyleId", visualStyleId);
        fd.set("workflowMode", workflowMode);
        fd.set("market", promptMarket);
        fd.set("reference_image", productPhoto);
        res = await fetch("/api/plan-concept", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/plan-concept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: product.trim(),
            business: business.trim(),
            headline: headline.trim(),
            subline: subline.trim(),
            offer: offer.trim(),
            promptExtra: promptExtra.trim(),
            conceptIdea: conceptIdea.trim(),
            visualStyleId,
            workflowMode,
            market: promptMarket,
          }),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? m.errors.planConceptFailed);
      const draft = data.draft as {
        audience?: string;
        painPoint?: string;
        promise?: string;
        proof?: string;
        cta?: string;
        visualMetaphor?: string;
      };
      setConceptAudience(String(draft.audience ?? "").trim());
      setConceptPain(String(draft.painPoint ?? "").trim());
      setConceptPromise(String(draft.promise ?? "").trim());
      setConceptProof(String(draft.proof ?? "").trim());
      setConceptCta(String(draft.cta ?? "").trim());
      setConceptVisualMetaphor(String(draft.visualMetaphor ?? "").trim());
      const imageVisionNote = String(data.imageVisionNote ?? "").trim();
      if (imageVisionNote) setConceptImageVisionNote(imageVisionNote);
      if (productPhoto && (workflowMode === "video-only" || workflowMode === "combined")) {
        setUseOriginalImage(true);
      }
      applyConceptWizard(
        {
          audience: draft.audience,
          painPoint: draft.painPoint,
          promise: draft.promise,
          proof: draft.proof,
          cta: draft.cta,
          visualMetaphor: draft.visualMetaphor,
        },
        imageVisionNote,
      );
      setConceptPlanNote(
        [data.sourceNote as string | undefined, m.wizard.conceptAnalyzeApplied]
          .filter(Boolean)
          .join(" — "),
      );
      if (workflowMode === "video-only") {
        await planAiVideoPrompt();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : m.errors.planConceptFailed);
    } finally {
      setConceptPlanBusy(false);
    }
  }
  return (
<section className="space-y-5 rounded-3xl border border-cyan-100/70 bg-white/90 p-5 shadow-sm backdrop-blur">
  <div className="h-1 w-full rounded-full bg-linear-to-r from-cyan-400 via-indigo-400 to-emerald-400 opacity-80" />
  <div>
    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
      {m.wizard.step1Title}
    </h2>
    <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{m.wizard.step1Hint}</p>
  </div>

  <WorkflowModePicker value={workflowMode} onChange={onWorkflowModeChange} />

  <div className="rounded-2xl border border-cyan-200 bg-linear-to-br from-cyan-50 via-white to-indigo-50 p-4">
    <p className="text-sm font-semibold text-slate-900">{pathsTitle}</p>
    <p className="mt-1 text-xs text-slate-600">{pathsHint}</p>
    {isConceptVideoOnly ? (
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => applyPrimaryPathConceptVideo("creative")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "creative-video"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">
            {m.wizard.visualStyles["creative-video"].title}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {m.wizard.visualStyles["creative-video"].description}
          </p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPathConceptVideo("brand")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "brand-video"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">
            {m.wizard.visualStyles["brand-video"].title}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {m.wizard.visualStyles["brand-video"].description}
          </p>
        </button>
      </div>
    ) : isConcept ? (
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => applyPrimaryPathConcept("info")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "info-poster"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">{m.wizard.pathInfoTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathInfoDesc}</p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPathConcept("brand")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "brand-fit"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">{m.wizard.pathBrandTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathBrandDesc}</p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPathConcept("pricing")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "pricing-offer"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">{m.wizard.pathPricingTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathPricingDesc}</p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPathConcept("website")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "website-launch"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">{m.wizard.pathWebsiteTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathWebsiteDesc}</p>
        </button>
      </div>
    ) : isVideoOnlyPhysical ? (
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => applyPrimaryPathVideoOnly("assistant")}
          className={`rounded-xl border px-3 py-3 text-left ${
            videoCreativeMode === "product-assistant"
              ? "border-cyan-400 bg-cyan-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">
            <span className="mr-1">🤖</span>
            {assistantMode.title}
          </p>
          <p className="mt-1 text-xs text-slate-600">{assistantMode.description}</p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPathVideoOnly("storyboard")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "storyboard-video"
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">
            {m.wizard.pathStoryboardTitle}
          </p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathStoryboardDesc}</p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPathVideoOnly("brand")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "brand-video"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">
            {m.wizard.visualStyles["brand-video"].title}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {m.wizard.visualStyles["brand-video"].description}
          </p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPathVideoOnly("creative")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "creative-video"
              ? "border-violet-400 bg-violet-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">
            {m.wizard.visualStyles["creative-video"].title}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {m.wizard.visualStyles["creative-video"].description}
          </p>
        </button>
      </div>
    ) : (
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => applyPrimaryPath("quick")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "product"
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">{m.wizard.pathQuickTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathQuickDesc}</p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPath("model")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "model-wear"
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">{m.wizard.pathModelTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathModelDesc}</p>
        </button>
        <button
          type="button"
          onClick={() => applyPrimaryPath("storyboard")}
          className={`rounded-xl border px-3 py-3 text-left ${
            visualStyleId === "storyboard-video"
              ? "border-emerald-400 bg-emerald-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-900">{m.wizard.pathStoryboardTitle}</p>
          <p className="mt-1 text-xs text-slate-600">{m.wizard.pathStoryboardDesc}</p>
        </button>
      </div>
    )}
    {!isConcept && (
      <p className="mt-2 text-[11px] text-slate-500">{m.wizard.primaryPathsShortcutNote}</p>
    )}
    {isVideoOnlyPhysical && videoCreativeMode === "product-assistant" && (
      <p className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50/80 px-3 py-2 text-xs text-cyan-950">
        {m.wizard.videoAssistantStepHint}
      </p>
    )}
  </div>

  {isConcept && (
    <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-3">
      <p className="text-sm font-semibold text-indigo-950">{m.wizard.conceptWizardTitle}</p>
      <p className="text-xs text-indigo-900/80">{m.wizard.conceptWizardHint}</p>
      {isConceptVideoOnly && (
        <p className="text-xs font-medium text-cyan-800">{m.wizard.conceptVideoSameBriefHint}</p>
      )}
      {(isConceptVideoOnly || (isConcept && workflowMode === "combined")) && (
        <div className="rounded-lg border border-indigo-200 bg-white/80 p-3">
          <UploadZone
            label={m.wizard.conceptVideoImageLabel}
            hint={m.wizard.conceptVideoImageHint}
            cta={m.wizard.uploadCta}
            changeLabel={m.wizard.uploadChange}
            previewUrl={uploadPreviewUrl}
            fileName={productPhoto?.name ?? null}
            onFile={onProductPhotoSelected}
          />
          <p className="mt-2 text-[11px] text-indigo-900/75">{m.wizard.conceptVideoImageOrderHint}</p>
        </div>
      )}
      <textarea
        value={conceptIdea}
        onChange={(e) => setConceptIdea(e.target.value)}
        placeholder={m.wizard.conceptIdeaPlaceholder}
        rows={3}
        className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <textarea
          value={conceptAudience}
          onChange={(e) => setConceptAudience(e.target.value)}
          placeholder={m.wizard.conceptAudiencePlaceholder}
          rows={2}
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <textarea
          value={conceptPain}
          onChange={(e) => setConceptPain(e.target.value)}
          placeholder={m.wizard.conceptPainPlaceholder}
          rows={2}
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <textarea
          value={conceptPromise}
          onChange={(e) => setConceptPromise(e.target.value)}
          placeholder={m.wizard.conceptPromisePlaceholder}
          rows={2}
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <textarea
          value={conceptProof}
          onChange={(e) => setConceptProof(e.target.value)}
          placeholder={m.wizard.conceptProofPlaceholder}
          rows={2}
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <textarea
          value={conceptCta}
          onChange={(e) => setConceptCta(e.target.value)}
          placeholder={m.wizard.conceptCtaPlaceholder}
          rows={2}
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <textarea
          value={conceptVisualMetaphor}
          onChange={(e) => setConceptVisualMetaphor(e.target.value)}
          placeholder={m.wizard.conceptVisualMetaphorPlaceholder}
          rows={2}
          className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
      </div>
      <button
        type="button"
        onClick={() => void analyzeConceptWithAi()}
        disabled={conceptPlanBusy}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {conceptPlanBusy ? m.wizard.conceptAnalyzeBusy : m.wizard.conceptAnalyzeBtn}
      </button>
      <button
        type="button"
        onClick={() => applyConceptWizard()}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        {m.wizard.conceptApplyBtn}
      </button>
      {conceptPlanNote && (
        <p className="text-xs text-indigo-900/90">{conceptPlanNote}</p>
      )}
      <p className="text-[11px] text-indigo-900/80">{m.wizard.conceptApplyHint}</p>
    </div>
  )}

  {!usesCompositor && (
    <div className="space-y-3 rounded-xl border border-violet-900/50 bg-violet-950/25 px-4 py-3">
      <p className="text-sm font-semibold text-violet-50">
        {isBrandVisualStyle(visualStyleId)
          ? m.wizard.brandFitTitleRequired
          : m.wizard.brandFitTitle}
      </p>
      <p className="text-xs text-violet-200/90">
        {isBrandVisualStyle(visualStyleId)
          ? lockedCampaignMode
            ? m.wizard.brandCampaignIntro
            : isBrandVideoStyle(visualStyleId)
              ? m.wizard.brandVideoIntro
              : m.wizard.brandFitIntro
          : m.wizard.brandAnalyzeOptionalIntro}
      </p>
      <label className="block text-xs font-medium text-violet-100">
        {m.wizard.brandWebsiteLabel}
      </label>
      <input
        value={brandWebsiteUrl}
        onChange={(e) => setBrandWebsiteUrl(e.target.value)}
        placeholder={m.wizard.brandWebsitePlaceholder}
        className="w-full rounded-lg border border-violet-800/60 bg-slate-950 px-3 py-2 text-sm text-white"
      />
      <label className="block text-xs font-medium text-violet-100">
        {m.wizard.brandSocialLabel}
      </label>
      <input
        value={brandSocialHint}
        onChange={(e) => setBrandSocialHint(e.target.value)}
        placeholder={m.wizard.brandSocialPlaceholder}
        className="w-full rounded-lg border border-violet-800/60 bg-slate-950 px-3 py-2 text-sm text-white"
      />
      <button
        type="button"
        onClick={analyzeBrand}
        disabled={brandAnalyzeBusy}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {brandAnalyzeBusy ? m.wizard.brandAnalyzeBusy : m.wizard.brandAnalyzeBtn}
      </button>
      {brandAnalyzeNote && (
        <p className="text-xs text-violet-100/90">{brandAnalyzeNote}</p>
      )}
    </div>
  )}

  <details
    className="rounded-xl border border-slate-200 bg-white p-3"
    open={showAdvancedSetup}
    onToggle={(e) => setShowAdvancedSetup((e.target as HTMLDetailsElement).open)}
  >
    <summary className="cursor-pointer text-sm font-medium text-slate-700">
      {m.wizard.advancedWorkflow}
    </summary>
    <div className="mt-3 space-y-4">
      <VisualStylePicker
        value={visualStyleId}
        onChange={selectVisualStyle}
        workflowMode={workflowMode}
        promotionMode={promotionMode}
      />
    </div>
  </details>

  {!usesCompositor && isStoryboardVideoStyle(visualStyleId) && (
    <div className="space-y-3 rounded-xl border border-teal-900/50 bg-teal-950/25 px-4 py-3">
      <p className="text-sm font-semibold text-teal-50">
        {m.wizard.visualStyles["storyboard-video"].title}
      </p>
      <p className="text-xs text-teal-100/90">{m.wizard.storyboardIntro}</p>
      <label className="block text-xs font-medium text-teal-100">
        {m.wizard.storyboardBriefLabel}
      </label>
      <textarea
        value={storyboardBrief}
        onChange={(e) => setStoryboardBrief(e.target.value)}
        placeholder={m.wizard.storyboardBriefPlaceholder}
        rows={3}
        className="w-full rounded-lg border border-teal-800/60 bg-slate-950 px-3 py-2 text-sm text-white"
      />
      <div>
        <p className="mb-2 text-xs font-medium text-teal-100">
          {m.wizard.storyboardDurationLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {VIDEO_DURATIONS.filter((d) => d !== "auto").map((d) => (
            <button
              key={d}
              type="button"
              onClick={() =>
                setVideoSettings((prev) => ({ ...prev, duration: d as VideoDuration }))
              }
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                videoSettings.duration === d
                  ? "bg-teal-600 text-white"
                  : "border border-teal-800/60 text-teal-200/80"
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-teal-200/70">
          {m.wizard.storyboardDurationHint}
        </p>
      </div>
    </div>
  )}

  {!usesCompositor && isCreativeVideoStyle(visualStyleId) && (
    <div className="space-y-3 rounded-xl border border-sky-900/50 bg-sky-950/30 px-4 py-3">
      <p className="text-sm font-semibold text-sky-50">{m.wizard.visualStyles["creative-video"].title}</p>
      <p className="text-xs text-sky-100/90">{m.wizard.creativeVideoIntro}</p>
      <label className="block text-xs font-medium text-sky-100">
        {m.wizard.creativeBriefLabel}
      </label>
      <textarea
        value={creativeVideoBrief}
        onChange={(e) => setCreativeVideoBrief(e.target.value)}
        placeholder={m.wizard.creativeBriefPlaceholder}
        rows={4}
        className="w-full rounded-lg border border-sky-800/60 bg-slate-950 px-3 py-2 text-sm text-white"
      />
    </div>
  )}

  {!usesCompositor && visualStyleId === "model-wear" && (
    <div className="rounded-xl border border-rose-900/50 bg-rose-950/25 px-4 py-3 text-sm text-rose-100">
      <p className="font-semibold text-rose-50">{m.wizard.visualStyles["model-wear"].title}</p>
      <p className="mt-1 text-xs text-rose-200/90">{m.wizard.modelWearIntro}</p>
    </div>
  )}

  {!usesCompositor && visualStyleId === "info-poster" && (
    <div className="rounded-xl border border-sky-900/50 bg-sky-950/30 px-4 py-3 text-sm text-sky-100">
      <p className="font-semibold text-sky-50">{m.wizard.infoPosterTechniqueTitle}</p>
      <p className="mt-1 text-xs text-sky-200/90">{m.wizard.infoPosterTechniqueIntro}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-sky-100/90">
        {m.wizard.infoPosterTechniqueSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  )}

  {!usesCompositor && usesReferenceConceptForImage && (
    <p className="rounded-lg border border-amber-900/50 bg-amber-950/25 px-3 py-2 text-xs text-amber-100/90">
      {m.wizard.referenceConceptOverridesStyle}
    </p>
  )}

  {!usesCompositor &&
    !usesReferenceConceptForImage &&
    visualStylePromptHint(visualStyleId) && (
    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
      <span className="font-medium text-slate-800">{m.wizard.styleAutoAppliedLabel}</span>{" "}
      {m.wizard.visualStyleHints[visualStyleId]}
    </p>
  )}

  <label className="block text-sm font-medium text-slate-700">
    {m.wizard.requirementsLabel}
  </label>
  <textarea
    value={promptExtra}
    onChange={(e) => setPromptExtra(e.target.value)}
    placeholder={
      m.wizard.requirementsPlaceholders[visualStyleId] ??
      m.wizard.requirementsPlaceholder
    }
    rows={2}
    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
  />

  {usesCompositor && (
    <p className="rounded-xl border border-sky-900/50 bg-sky-950/30 px-4 py-3 text-sm text-sky-100">
      {m.wizard.compositorCallout}
    </p>
  )}

  {templateHasSlot(templateId, "product") && (
    <>
      <label className="block text-sm font-medium text-slate-700">{m.wizard.productLabel}</label>
      <input
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder={m.wizard.productPlaceholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
      />
    </>
  )}

  {templateHasSlot(templateId, "headline") && (
    <>
      <label className="block text-sm font-medium text-slate-700">
        {m.wizard.headlineLabel}
        {isSlotRequired(templateId, "headline") && " *"}
      </label>
      <input
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        placeholder={m.wizard.headlinePlaceholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
      />
    </>
  )}

  {templateHasSlot(templateId, "subline") && (
    <>
      <label className="block text-sm font-medium text-slate-700">
        {usesCompositor || visualStyleId === "info-poster"
          ? m.wizard.sublineBulletsLabel
          : m.wizard.sublineLabel}
      </label>
      {usesCompositor || visualStyleId === "info-poster" ? (
        <textarea
          value={subline}
          onChange={(e) => setSubline(e.target.value)}
          placeholder={
            visualStyleId === "info-poster"
              ? m.wizard.infoPosterBulletsPlaceholder
              : m.wizard.sublineBulletsPlaceholder
          }
          rows={4}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
        />
      ) : (
        <input
          value={subline}
          onChange={(e) => setSubline(e.target.value)}
          placeholder={m.wizard.sublinePlaceholder}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
        />
      )}
    </>
  )}

  {templateHasSlot(templateId, "business") && (
    <>
      <label className="block text-sm font-medium text-slate-700">
        {usesCompositor ? m.wizard.brandLabel : m.wizard.businessLabel}
      </label>
      <input
        value={business}
        onChange={(e) => setBusiness(e.target.value)}
        placeholder={
          usesCompositor ? m.wizard.brandPlaceholder : m.wizard.businessPlaceholder
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
      />
    </>
  )}

  {templateHasSlot(templateId, "offer") && (
    <>
      <label className="block text-sm font-medium text-slate-700">
        {usesCompositor ? m.wizard.signoffLabel : m.wizard.offerLabel}
      </label>
      <input
        value={offer}
        onChange={(e) => setOffer(e.target.value)}
        placeholder={
          usesCompositor ? m.wizard.signoffPlaceholder : m.wizard.offerPlaceholder
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500"
      />
    </>
  )}

  <TemplateSlotChecklist templateId={templateId} filled={templateSlotStatus()} />

  {workflowMode !== "image-only" && !usesCompositor && (
    <details
      className="rounded-xl border border-slate-200 bg-white p-3"
      open={showAdvancedSetupPrompts}
      onToggle={(e) =>
        setShowAdvancedSetupPrompts((e.target as HTMLDetailsElement).open)
      }
    >
      <summary className="cursor-pointer text-sm font-medium text-slate-700">
        {m.wizard.advancedPrompts}
      </summary>
      <AdvancedPromptPanel
        section={advancedSection}
        market={promptMarket}
        framing={subjectFraming}
        extra={promptExtra}
        imagePrompt={imagePrompt}
        videoPrompt={videoPrompt}
        onMarketChange={setPromptMarket}
        onFramingChange={setSubjectFraming}
        onExtraChange={setPromptExtra}
        onImagePromptChange={setImagePrompt}
        onVideoPromptChange={setVideoPrompt}
        onResetFromOptions={() => applyPromptRebuild()}
      />
    </details>
  )}

  <button
    type="button"
    onClick={goNextFromSetup}
    className="hidden w-full rounded-2xl bg-linear-to-r from-cyan-500 via-emerald-500 to-teal-500 py-3.5 text-base font-semibold text-white shadow-[0_0_30px_rgba(16,185,129,0.35)] transition hover:scale-[1.01] md:block"
  >
    {continueSetupLabel}
  </button>
</section>
  );
}
