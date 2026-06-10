"use client";

import { useCallback, useEffect, useState } from "react";
import { AdvancedPromptPanel } from "@/components/AdvancedPromptPanel";
import { ImageCreativeModePicker } from "@/components/ImageCreativeModePicker";
import { ReferenceClipPicker } from "@/components/ReferenceClipPicker";
import { TemplateSlotChecklist } from "@/components/TemplateSlotChecklist";
import { ImageInputModePicker } from "@/components/ImageInputModePicker";
import { ReferenceUploadZone } from "@/components/ReferenceUploadZone";
import { StepIndicator } from "@/components/StepIndicator";
import { UploadZone } from "@/components/UploadZone";
import { VideoCreativeModePicker } from "@/components/VideoCreativeModePicker";
import { VideoSettingsPanel } from "@/components/VideoSettingsPanel";
import { ImageOutputModePicker } from "@/components/ImageOutputModePicker";
import { VisualStylePicker } from "@/components/VisualStylePicker";
import { WorkflowModePicker } from "@/components/WorkflowModePicker";
import { useLocale } from "@/components/LocaleProvider";
import type { BgmTrackId } from "@/lib/bgm/tracks";
import {
  DEFAULT_IMAGE_INPUT_MODE,
  type ImageInputMode,
} from "@/lib/image-input-mode";
import {
  defaultImageModeForGoal,
  defaultVideoModeForGoal,
  type ImageCreativeMode,
  type VideoCreativeMode,
} from "@/lib/creative-workflow";
import {
  buildEndFrameImagePrompt,
  buildImageToVideoPrompt,
  buildMultiAngleVideoPrompt,
  buildNegativePrompt,
  buildProductPromoVideoPrompt,
  buildPromptVariables,
  buildWizardImagePrompt,
  resolveImagePromptMode,
  buildReferenceVideoPrompt,
  buildReferenceVideoNegative,
  type PromptMarket,
  type SubjectFraming,
  type VideoPromptOpts,
} from "@/lib/prompt-variables";
import {
  DEFAULT_VIDEO_SETTINGS,
  resolveVideoGenerationOpts,
  type VideoSettings,
} from "@/lib/video-settings";
import {
  DEFAULT_VISUAL_STYLE,
  getVisualStyle,
  isBrandVisualStyle,
  isCampaignVisualStyle,
  mergePromptExtra,
  visualStylePromptHint,
  type VisualStyleId,
} from "@/lib/visual-styles";
import {
  getTemplateConfig,
  isSlotRequired,
  templateHasSlot,
  type TemplateSlotId,
} from "@/lib/template-slots";
import { getTemplate, type TemplateId } from "@/lib/templates";
import { BANANA2_EDIT_ENDPOINT, BANANA2_TEXT_ENDPOINT } from "@/lib/image-endpoints";
import {
  analyzeProductImageFile,
  type ImageUploadWarning,
} from "@/lib/image-upload-quality";
import {
  fetchReferenceClipAsFile,
  type ReferenceClipId,
} from "@/lib/reference-clips";
import type { BrandProfile } from "@/lib/brand-profile";
import type { CampaignPlan } from "@/lib/campaign-types";
import {
  DEFAULT_IMAGE_OUTPUT_MODE,
  type ImageOutputMode,
} from "@/lib/image-output-mode";
import type { WorkflowMode, WorkflowStepKey } from "@/lib/workflow-mode";

const EDIT_ENDPOINT = BANANA2_EDIT_ENDPOINT;
const TEXT_ENDPOINT = BANANA2_TEXT_ENDPOINT;

export function StudioWizard() {
  const { m, locale } = useLocale();
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>("combined");
  const [stepKey, setStepKey] = useState<WorkflowStepKey>("setup");
  const [visualStyleId, setVisualStyleId] = useState<VisualStyleId>(DEFAULT_VISUAL_STYLE);
  const [imageCreativeMode, setImageCreativeMode] =
    useState<ImageCreativeMode>("promo-ai");
  const [videoCreativeMode, setVideoCreativeMode] =
    useState<VideoCreativeMode>("image-to-video");
  const [videoSettings, setVideoSettings] = useState<VideoSettings>(DEFAULT_VIDEO_SETTINGS);
  const [selectedReferenceClipId, setSelectedReferenceClipId] =
    useState<ReferenceClipId | null>(null);
  const [referenceClipLoading, setReferenceClipLoading] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateId>("product-reel");
  const [product, setProduct] = useState("");
  const [headline, setHeadline] = useState("");
  const [subline, setSubline] = useState("");
  const [business, setBusiness] = useState("");
  const [offer, setOffer] = useState("");
  const [showAdvancedSetup, setShowAdvancedSetup] = useState(false);
  const [showAdvancedImage, setShowAdvancedImage] = useState(false);
  const [showAdvancedVideo, setShowAdvancedVideo] = useState(false);
  const [bgmTrack, setBgmTrack] = useState<BgmTrackId>("calm");
  const [imageInputMode, setImageInputMode] = useState<ImageInputMode>(DEFAULT_IMAGE_INPUT_MODE);

  const [promptMarket, setPromptMarket] = useState<PromptMarket>(() =>
    locale === "zh" ? "hk" : "en",
  );
  const [subjectFraming, setSubjectFraming] = useState<SubjectFraming>("auto");
  const [promptExtra, setPromptExtra] = useState("");
  const [brandWebsiteUrl, setBrandWebsiteUrl] = useState("");
  const [brandSocialHint, setBrandSocialHint] = useState("");
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [brandAnalyzeBusy, setBrandAnalyzeBusy] = useState(false);
  const [brandAnalyzeNote, setBrandAnalyzeNote] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  const [productPhoto, setProductPhoto] = useState<File | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [imageRefPhoto, setImageRefPhoto] = useState<File | null>(null);
  const [imageRefPreviewUrl, setImageRefPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageGenKey, setImageGenKey] = useState(0);
  const [lastImageEndpoint, setLastImageEndpoint] = useState<string | null>(null);
  const [imageVariantUrls, setImageVariantUrls] = useState<string[]>([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imageOutputMode, setImageOutputMode] =
    useState<ImageOutputMode>(DEFAULT_IMAGE_OUTPUT_MODE);
  const [campaignTheme, setCampaignTheme] = useState("");
  const [campaignPlan, setCampaignPlan] = useState<CampaignPlan | null>(null);
  const [campaignSlides, setCampaignSlides] = useState<
    Array<{
      role: string;
      title: string;
      headline: string;
      subline: string;
      imageUrl: string;
    }>
  >([]);
  const [uploadQualityWarning, setUploadQualityWarning] = useState<ImageUploadWarning | null>(
    null,
  );
  const [useOriginalImage, setUseOriginalImage] = useState(false);

  const [referenceAd, setReferenceAd] = useState<File | null>(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string | null>(null);
  const [referenceIsVideo, setReferenceIsVideo] = useState(false);
  const [refVideoDurationSec, setRefVideoDurationSec] = useState<number | null>(null);

  const [imageBusy, setImageBusy] = useState(false);
  const [videoBusy, setVideoBusy] = useState(false);
  const [videoPhase, setVideoPhase] = useState<"video" | "second-frame" | "bgm">("video");
  const [endFrameUrl, setEndFrameUrl] = useState<string | null>(null);
  const [endFramePhoto, setEndFramePhoto] = useState<File | null>(null);
  const [endFramePreviewUrl, setEndFramePreviewUrl] = useState<string | null>(null);
  const [extraAnglePhotos, setExtraAnglePhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoNote, setVideoNote] = useState<string | undefined>();
  const [bgmNote, setBgmNote] = useState<string | undefined>();

  const tpl = getTemplate(templateId);
  const visualStyle = getVisualStyle(visualStyleId);
  const templateConfig = getTemplateConfig(templateId);
  const usesCompositor = visualStyle.usesCompositor;
  const lockedCampaignMode = isCampaignVisualStyle(visualStyleId);
  const effectiveImageOutputMode: ImageOutputMode = lockedCampaignMode
    ? "campaign"
    : imageOutputMode;
  const isCampaignOutput = effectiveImageOutputMode === "campaign";
  const showVideoReferenceSection = videoCreativeMode === "reference-concept";
  const effectiveImageMode: ImageInputMode =
    templateId === "custom" ? imageInputMode : templateConfig.defaultImageInputMode;
  const useReferenceVideo =
    videoCreativeMode === "reference-concept" &&
    Boolean(referenceAd && referenceIsVideo);
  const isVideoWorkflow = workflowMode === "video-only" || workflowMode === "combined";
  const isImageWorkflow = workflowMode === "image-only" || workflowMode === "combined";

  const effectivePromptExtra = useCallback(
    () => mergePromptExtra(visualStyleId, promptExtra),
    [visualStyleId, promptExtra],
  );

  const getPromptVars = useCallback(
    () =>
      buildPromptVariables({
        product,
        business,
        offer,
        headline,
        subline,
        market: promptMarket,
        framing: subjectFraming,
        extra: effectivePromptExtra(),
      }),
    [
      product,
      business,
      offer,
      headline,
      subline,
      promptMarket,
      subjectFraming,
      effectivePromptExtra,
    ],
  );

  const usesStyleReference =
    templateHasSlot(templateId, "styleRef") && Boolean(imageRefPhoto);
  const needsProductUpload =
    effectiveImageMode === "product-ad" || effectiveImageMode === "product-style";

  const videoPromptOpts = useCallback((): VideoPromptOpts => {
    const dual = Boolean(
      endFrameUrl ||
        endFramePhoto ||
        (videoSettings.autoSecondFrame && videoSettings.creativity !== "subtle"),
    );
    return {
      creativity: videoSettings.creativity,
      dualFrame: dual,
      multiAngle: extraAnglePhotos.length > 0,
    };
  }, [endFrameUrl, endFramePhoto, videoSettings, extraAnglePhotos.length]);

  const useMultiAngleVideo =
    extraAnglePhotos.length > 0 && Boolean(productPhoto || imageUrl);

  const applyPromptRebuild = useCallback(
    (id: TemplateId = templateId) => {
      const pv = getPromptVars();
      const template = getTemplate(id);
      const vOpts = videoPromptOpts();
      setImagePrompt(
        buildWizardImagePrompt(
          pv,
          resolveImagePromptMode(visualStyleId, imageCreativeMode),
          brandProfile,
        ),
      );
      setNegativePrompt(buildNegativePrompt(template, pv.framing));
      if (videoCreativeMode === "reference-concept") {
        setVideoPrompt(buildReferenceVideoPrompt(pv));
      } else if (useMultiAngleVideo) {
        setVideoPrompt(buildMultiAngleVideoPrompt(pv, vOpts));
      } else if (videoCreativeMode === "image-to-video") {
        setVideoPrompt(buildImageToVideoPrompt(pv, vOpts));
      } else {
        setVideoPrompt(buildProductPromoVideoPrompt(pv, vOpts));
      }
    },
    [
      templateId,
      visualStyleId,
      brandProfile,
      getPromptVars,
      imageCreativeMode,
      videoCreativeMode,
      videoPromptOpts,
      useMultiAngleVideo,
    ],
  );

  useEffect(() => {
    if (!productPhoto) {
      setUploadPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(productPhoto);
    setUploadPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [productPhoto]);

  useEffect(() => {
    if (!imageRefPhoto) {
      setImageRefPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageRefPhoto);
    setImageRefPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageRefPhoto]);

  useEffect(() => {
    if (!endFramePhoto) {
      setEndFramePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(endFramePhoto);
    setEndFramePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [endFramePhoto]);

  useEffect(() => {
    if (!referenceAd) {
      setReferencePreviewUrl(null);
      setReferenceIsVideo(false);
      setRefVideoDurationSec(null);
      return;
    }
    const url = URL.createObjectURL(referenceAd);
    setReferencePreviewUrl(url);
    setReferenceIsVideo(referenceAd.type.startsWith("video/"));
    return () => URL.revokeObjectURL(url);
  }, [referenceAd]);

  useEffect(() => {
    applyPromptRebuild();
  }, [
    templateId,
    promptMarket,
    subjectFraming,
    promptExtra,
    product,
    business,
    offer,
    headline,
    subline,
    applyPromptRebuild,
    imageCreativeMode,
    videoCreativeMode,
    videoSettings,
    extraAnglePhotos.length,
    endFrameUrl,
    endFramePhoto,
    brandProfile,
  ]);

  async function analyzeBrand() {
    if (!brandWebsiteUrl.trim() && !brandSocialHint.trim()) {
      setError(m.errors.brandUrlRequired);
      return;
    }
    setBrandAnalyzeBusy(true);
    setError(null);
    setBrandAnalyzeNote(null);
    try {
      const res = await fetch("/api/analyze-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: brandWebsiteUrl.trim() || undefined,
          socialHint: brandSocialHint.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? m.errors.brandAnalyzeFailed);
      const profile = data.profile as BrandProfile;
      setBrandProfile(profile);
      setBrandAnalyzeNote((data.sourceNote as string) + " — " + profile.summary);
      if (profile.businessName) setBusiness(profile.businessName);
      if (profile.suggestedHeadline && !headline.trim()) {
        setHeadline(profile.suggestedHeadline);
      }
      if (profile.suggestedBullets.length && !subline.trim()) {
        setSubline(profile.suggestedBullets.join("\n"));
      }
      if (profile.adPromptExtra && !promptExtra.trim()) {
        setPromptExtra(profile.adPromptExtra);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : m.errors.brandAnalyzeFailed);
    } finally {
      setBrandAnalyzeBusy(false);
    }
  }

  function selectVisualStyle(id: VisualStyleId) {
    const style = getVisualStyle(id);
    setVisualStyleId(id);
    setTemplateId(style.templateId);
    setImageInputMode(getTemplateConfig(style.templateId).defaultImageInputMode);
    if (!isBrandVisualStyle(id)) {
      setBrandProfile(null);
      setBrandAnalyzeNote(null);
    }
    if (isCampaignVisualStyle(id)) {
      setImageOutputMode("campaign");
    }
    setCampaignPlan(null);
    setCampaignSlides([]);
    applyPromptRebuild(style.templateId);
  }

  async function loadReferenceClip(clipId: ReferenceClipId) {
    setReferenceClipLoading(true);
    setError(null);
    try {
      const file = await fetchReferenceClipAsFile(clipId);
      setReferenceAd(file);
      setSelectedReferenceClipId(clipId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : m.errors.videoFailed);
    } finally {
      setReferenceClipLoading(false);
    }
  }

  function slotFilled(slot: TemplateSlotId): boolean {
    switch (slot) {
      case "product":
        return Boolean(product.trim());
      case "headline":
        return Boolean(headline.trim());
      case "subline":
        return Boolean(subline.trim());
      case "productPhoto":
        return Boolean(productPhoto);
      case "styleRef":
        return Boolean(imageRefPhoto);
      case "referenceVideo":
        return Boolean(referenceAd && referenceIsVideo);
      case "business":
        return Boolean(business.trim());
      case "offer":
        return Boolean(offer.trim());
      default:
        return false;
    }
  }

  function templateSlotStatus(): Partial<Record<TemplateSlotId, boolean>> {
    const out: Partial<Record<TemplateSlotId, boolean>> = {};
    for (const slot of templateConfig.slots) {
      out[slot.id] = slotFilled(slot.id);
    }
    return out;
  }

  function onWorkflowModeChange(mode: WorkflowMode) {
    setWorkflowMode(mode);
    setStepKey("setup");
    setError(null);
    setImageCreativeMode(defaultImageModeForGoal(mode));
    setVideoCreativeMode(defaultVideoModeForGoal(mode));
    setImageOutputMode(mode === "image-only" ? "ab" : DEFAULT_IMAGE_OUTPUT_MODE);
    if (mode === "image-only") setImageInputMode(DEFAULT_IMAGE_INPUT_MODE);
  }

  async function onProductPhotoSelected(file: File | null) {
    setProductPhoto(file);
    setImageUrl(null);
    setImageVariantUrls([]);
    setSelectedVariantIndex(0);
    setUseOriginalImage(false);
    setError(null);
    setUploadQualityWarning(null);
    if (!file) return;
    try {
      const quality = await analyzeProductImageFile(file);
      setUploadQualityWarning(quality.warnings[0] ?? null);
    } catch {
      setUploadQualityWarning(null);
    }
  }

  function uploadQualityMessage(warning: ImageUploadWarning): string {
    if (warning === "very-small") return m.wizard.uploadQualityVerySmall;
    return m.wizard.uploadQualityLowRes;
  }

  function applyGeneratedImages(urls: string[], endpoint?: string) {
    const list = urls.filter((u) => u.startsWith("http"));
    if (!list.length) return;
    setCampaignPlan(null);
    setCampaignSlides([]);
    setImageVariantUrls(list);
    setSelectedVariantIndex(0);
    setImageUrl(list[0]);
    setImageGenKey((k) => k + 1);
    setLastImageEndpoint(endpoint ?? null);
    setUseOriginalImage(false);
  }

  function applyGeneratedCampaign(
    slides: Array<{
      role: string;
      title: string;
      headline: string;
      subline: string;
      imageUrl: string;
    }>,
    plan: CampaignPlan,
    endpoint?: string,
  ) {
    const urls = slides.map((s) => s.imageUrl).filter((u) => u.startsWith("http"));
    if (!urls.length) return;
    setCampaignSlides(slides);
    setCampaignPlan(plan);
    setImageVariantUrls(urls);
    setSelectedVariantIndex(0);
    setImageUrl(urls[0]);
    setImageGenKey((k) => k + 1);
    setLastImageEndpoint(endpoint ?? null);
    setUseOriginalImage(false);
  }

  function campaignSlideLabel(role: string, title: string): string {
    const roleKey = role as keyof typeof m.wizard.campaignSlideRoles;
    const roleLabel = m.wizard.campaignSlideRoles[roleKey];
    return roleLabel ? `${roleLabel} · ${title}` : title;
  }

  function onImageCreativeModeChange(mode: ImageCreativeMode) {
    setImageCreativeMode(mode);
    setImageUrl(null);
    setImageVariantUrls([]);
    setSelectedVariantIndex(0);
    setError(null);
    applyPromptRebuild();
  }

  function onVideoCreativeModeChange(mode: VideoCreativeMode) {
    setVideoCreativeMode(mode);
    setError(null);
    if (mode === "reference-concept") {
      setVideoSettings((s) => ({
        ...s,
        resolution: "720p",
        duration: s.duration === "auto" || Number(s.duration) > 15 ? "12" : s.duration,
        fast: false,
        autoSecondFrame: false,
      }));
    }
    applyPromptRebuild();
  }

  function onImageInputModeChange(mode: ImageInputMode) {
    setImageInputMode(mode);
    setImageUrl(null);
    setUseOriginalImage(false);
    setError(null);
    if (mode === "describe") {
      setProductPhoto(null);
      setImageRefPhoto(null);
    } else if (mode === "reference") {
      setProductPhoto(null);
      setImageRefPhoto(null);
    } else if (mode === "product-ad") {
      setImageRefPhoto(null);
      applyPromptRebuild();
    }
  }

  const keyframePreview = useOriginalImage
    ? uploadPreviewUrl
    : imageUrl ?? uploadPreviewUrl;

  const hasFinalImage = usesCompositor
    ? Boolean((imageUrl || productPhoto) && headline.trim())
    : Boolean(imageUrl || useOriginalImage);

  const advancedSection =
    workflowMode === "image-only" ? "image" : workflowMode === "video-only" ? "video" : "all";

  const imageStepHint =
    workflowMode === "image-only" ? m.wizard.step2Hints["image-only"] : m.wizard.step2Hints.combined;

  const videoStepHint =
    workflowMode === "video-only"
      ? m.wizard.step3Hints["video-only"]
      : m.wizard.step3Hints.combined;

  function goNextFromSetup() {
    setError(null);
    if (isSlotRequired(templateId, "headline") && !headline.trim()) {
      setError(m.errors.needHeadline);
      return;
    }
    if (workflowMode === "video-only") setStepKey("video");
    else setStepKey("image");
  }

  function goBackFromImage() {
    setStepKey("setup");
  }

  function goBackFromVideo() {
    setStepKey(workflowMode === "combined" ? "image" : "setup");
  }

  function buildComposeFormData(mode: "image" | "video"): FormData {
    const fd = new FormData();
    fd.set("template_id", templateId);
    fd.set("mode", mode);
    fd.set("headline", headline.trim());
    fd.set("subline", subline.trim());
    fd.set("brand", business.trim());
    fd.set("signoff", offer.trim());
    if (productPhoto) fd.set("product_image", productPhoto);
    if (mode === "video") fd.set("bgm_track", bgmTrack);
    return fd;
  }

  function canGenerateImage(): boolean {
    if (usesCompositor) return Boolean(productPhoto && headline.trim());
    if (visualStyleId === "info-poster") {
      return Boolean(productPhoto && headline.trim());
    }
    if (isBrandVisualStyle(visualStyleId)) {
      return Boolean(productPhoto && headline.trim() && brandProfile?.businessName);
    }
    if (imageCreativeMode === "reference-concept") {
      return Boolean(productPhoto && imageRefPhoto);
    }
    if (effectiveImageMode === "describe") return imagePrompt.trim().length > 0;
    return Boolean(productPhoto);
  }

  async function composeImage(): Promise<string> {
    const res = await fetch("/api/compose", {
      method: "POST",
      body: buildComposeFormData("image"),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? m.errors.polishFailed);
    return data.imageUrl as string;
  }

  async function composeVideo(): Promise<string> {
    const res = await fetch("/api/compose", {
      method: "POST",
      body: buildComposeFormData("video"),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? m.errors.videoFailed);
    if (data.bgmAdded) setBgmNote(m.wizard.bgmNote);
    else if (!data.bgmAdded) setBgmNote(m.wizard.bgmFallbackNote);
    return data.videoUrl as string;
  }

  async function generateImage() {
    setError(null);
    setUseOriginalImage(false);

    if (usesCompositor) {
      if (!headline.trim()) {
        setError(m.errors.needHeadline);
        return;
      }
      if (!productPhoto) {
        setError(m.errors.needPhoto);
        return;
      }
      setImageBusy(true);
      try {
        setImageUrl(await composeImage());
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : m.errors.polishFailed);
      } finally {
        setImageBusy(false);
      }
      return;
    }

    if (visualStyleId === "info-poster" && !headline.trim()) {
      setError(m.errors.needHeadline);
      return;
    }
    if (isBrandVisualStyle(visualStyleId)) {
      if (!brandProfile?.businessName) {
        setError(m.errors.brandAnalyzeRequired);
        return;
      }
      if (!headline.trim()) {
        setError(m.errors.needHeadline);
        return;
      }
    }

    if (isCampaignOutput) {
      if (!productPhoto) {
        setError(m.errors.needPhoto);
        return;
      }
      setImageBusy(true);
      try {
        const fd = new FormData();
        fd.set("visual_style", visualStyleId);
        if (brandProfile) fd.set("brand_profile", JSON.stringify(brandProfile));
        fd.set("product_name", product.trim());
        fd.set("business", business.trim());
        fd.set("headline", headline.trim());
        fd.set("subline", subline.trim());
        fd.set("offer", offer.trim());
        fd.set("campaign_theme", campaignTheme.trim());
        fd.set("prompt_market", promptMarket);
        fd.set("subject_framing", subjectFraming);
        fd.set("prompt_extra", effectivePromptExtra());
        fd.set("aspect_ratio", tpl.aspectRatio);
        fd.set("endpoint", EDIT_ENDPOINT);
        fd.set("reference_image", productPhoto);
        const res = await fetch("/api/generate-campaign", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? m.errors.campaignFailed);
        applyGeneratedCampaign(
          data.slides as Array<{
            role: string;
            title: string;
            headline: string;
            subline: string;
            imageUrl: string;
          }>,
          data.plan as CampaignPlan,
          data.endpoint as string | undefined,
        );
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : m.errors.campaignFailed);
      } finally {
        setImageBusy(false);
      }
      return;
    }

    if (effectiveImageMode === "describe") {
      if (!imagePrompt.trim()) {
        setError(m.errors.needKeyframe);
        return;
      }
      setImageBusy(true);
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: imagePrompt.trim(),
            endpoint: TEXT_ENDPOINT,
            aspect_ratio: tpl.aspectRatio,
            num_images: effectiveImageOutputMode === "ab" ? 2 : 1,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? m.errors.polishFailed);
        const urls = (data.imageUrls as string[] | undefined) ?? [data.imageUrl as string];
        applyGeneratedImages(urls, data.endpoint as string | undefined);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : m.errors.polishFailed);
      } finally {
        setImageBusy(false);
      }
      return;
    }

    if (imageCreativeMode === "reference-concept") {
      if (!productPhoto) {
        setError(m.errors.needPhoto);
        return;
      }
      if (!imageRefPhoto) {
        setError(m.errors.needStyleReference);
        return;
      }
    } else if (effectiveImageMode === "reference") {
      if (!imageRefPhoto) {
        setError(m.errors.needReferenceImage);
        return;
      }
    } else if (needsProductUpload && !productPhoto) {
      setError(m.errors.needPhoto);
      return;
    }

    setImageBusy(true);
    try {
      const useConceptRef =
        imageCreativeMode === "reference-concept" ||
        Boolean(imageRefPhoto && productPhoto);
      if (imageRefPhoto && productPhoto && imageCreativeMode !== "reference-concept") {
        setVideoNote(m.wizard.imageRefAutoModeNote);
      }
      const fd = new FormData();
      fd.set("image_creative_mode", useConceptRef ? "reference-concept" : imageCreativeMode);
      fd.set("image_mode", useConceptRef ? "product-style" : "product-ad");
      fd.set("visual_style", visualStyleId);
      if (brandProfile) {
        fd.set("brand_profile", JSON.stringify(brandProfile));
      }
      fd.set("product_name", product.trim());
      fd.set("business", business.trim());
      fd.set("headline", headline.trim());
      fd.set("subline", subline.trim());
      fd.set("offer", offer.trim());
      fd.set("prompt_market", promptMarket);
      fd.set("subject_framing", subjectFraming);
      fd.set("prompt_extra", effectivePromptExtra());
      fd.set("aspect_ratio", tpl.aspectRatio);
      fd.set("endpoint", EDIT_ENDPOINT);
      fd.set("num_images", effectiveImageOutputMode === "ab" ? "2" : "1");

      if (productPhoto) fd.set("reference_image", productPhoto);
      if (useConceptRef && imageRefPhoto) {
        fd.set("style_reference_image", imageRefPhoto);
      }

      const res = await fetch("/api/generate-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? m.errors.polishFailed);
      const urls = (data.imageUrls as string[] | undefined) ?? [data.imageUrl as string];
      if (!urls.some((u) => u?.startsWith("http"))) {
        throw new Error(m.errors.imageGenNoUrl);
      }
      applyGeneratedImages(urls, data.endpoint as string | undefined);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : m.errors.polishFailed);
    } finally {
      setImageBusy(false);
    }
  }

  function useOriginalAsKeyframe() {
    if (!productPhoto) return;
    setUseOriginalImage(true);
    setImageUrl(null);
    setError(null);
  }

  function finishImageStep() {
    if (!hasFinalImage) {
      setError(
        !usesCompositor && productPhoto && !imageUrl && !useOriginalImage
          ? m.errors.needAiImage
          : workflowMode === "image-only" && effectiveImageMode === "describe"
            ? m.errors.needKeyframe
            : m.errors.needPhoto,
      );
      return;
    }
    setError(null);
    if (!usesCompositor && !imageUrl && productPhoto) {
      setUseOriginalImage(true);
    }
    if (workflowMode === "image-only") setStepKey("done");
    else setStepKey("video");
  }

  function onReferenceAdFile(file: File | null) {
    setReferenceAd(file);
    if (file) {
      setSelectedReferenceClipId(null);
      setError(null);
      if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file);
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          const dur = v.duration;
          if (Number.isFinite(dur)) {
            setRefVideoDurationSec(dur);
            if (dur > 15.5) {
              setVideoNote(
                m.wizard.referenceVideoTooLong.replace("{seconds}", String(Math.round(dur))),
              );
            }
          }
        };
        v.src = url;
      }
    }
  }

  async function makeReferenceVideo(refVideo: File): Promise<string> {
    const vOpts = resolveVideoGenerationOpts(templateId, videoSettings);
    const refSec = refVideoDurationSec;
    const refDuration =
      refSec && refSec >= 4 && refSec <= 15
        ? String(Math.round(refSec))
        : videoSettings.duration === "auto" || Number(videoSettings.duration) > 15
          ? "12"
          : videoSettings.duration;
    const fd = new FormData();
    fd.set("mode", "reference");
    fd.set(
      "prompt",
      videoPrompt.trim() ||
        buildReferenceVideoPrompt(getPromptVars()) +
          " Follow @Video1 shot structure and timing as closely as the model allows. Do not apply a generic slow push-in unless @Video1 uses it.",
    );
    fd.append("videos", refVideo);
    if (refSec && Number.isFinite(refSec)) {
      fd.set("ref_duration_sec", String(refSec));
    }
    // Raw product photo first — marketing stills as @Image1 block motion transfer from @Video1.
    if (productPhoto) fd.append("images", productPhoto);
    else if (imageUrl) fd.set("image_ref_url", imageUrl);
    fd.set("resolution", "720p");
    fd.set("duration", refDuration);
    fd.set("aspect_ratio", "auto");
    fd.set("generate_audio", "false");
    fd.set("reference_negative_prompt", buildReferenceVideoNegative(tpl));
    fd.set("avoid_on_screen_text", vOpts.avoidOnScreenText ? "true" : "false");
    fd.set("fast", "false");

    const res = await fetch("/api/generate", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? m.errors.videoFailed);
    const pathNote = data.generationMode
      ? `${m.wizard.videoGenPathLabel}: ${data.generationMode}${data.endpoint ? ` · ${data.endpoint}` : ""}${typeof data.referenceVideoCount === "number" ? ` · ${data.referenceVideoCount} ref video` : ""}`
      : "";
    const notes = [
      m.wizard.referenceModeNote,
      pathNote,
      !productPhoto && imageUrl ? m.wizard.videoRefUseProductPhoto : "",
      data.note as string | undefined,
    ].filter(Boolean);
    setVideoNote(notes.join(" · "));
    return data.videoUrl as string;
  }

  async function fileFromImageUrl(url: string): Promise<File | null> {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], "keyframe.png", { type: blob.type || "image/png" });
    } catch {
      return null;
    }
  }

  async function ensureEndFrameUrl(): Promise<string | null> {
    if (endFrameUrl) return endFrameUrl;
    if (endFramePhoto || !videoSettings.autoSecondFrame) return null;
    if (videoSettings.creativity === "subtle") return null;

    const ref =
      productPhoto ?? (imageUrl ? await fileFromImageUrl(imageUrl) : null);
    if (!ref) return null;

    setVideoPhase("second-frame");
    const pv = getPromptVars();
    const fd = new FormData();
    fd.set("image_creative_mode", "promo-ai");
    fd.set("reference_image", ref);
    fd.set("prompt", buildEndFrameImagePrompt(pv));
    fd.set("product_name", product.trim());
    fd.set("business", business.trim());
    fd.set("headline", headline.trim());
    fd.set("subline", subline.trim());
    fd.set("offer", offer.trim());
    fd.set("prompt_market", promptMarket);
    fd.set("subject_framing", subjectFraming);
    fd.set("prompt_extra", effectivePromptExtra());
    fd.set("aspect_ratio", tpl.aspectRatio);
    fd.set("endpoint", EDIT_ENDPOINT);
    fd.set("num_images", "1");

    const res = await fetch("/api/generate-image", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? m.errors.polishFailed);
    const url = data.imageUrl as string;
    setEndFrameUrl(url);
    return url;
  }

  async function makeMultiAngleVideo(): Promise<string> {
    const vOpts = resolveVideoGenerationOpts(templateId, videoSettings);
    const pv = getPromptVars();
    const fd = new FormData();
    fd.set("mode", "reference");
    fd.set("prompt", videoPrompt.trim() || buildMultiAngleVideoPrompt(pv, videoPromptOpts()));
    if (productPhoto) fd.append("images", productPhoto);
    for (const f of extraAnglePhotos) fd.append("images", f);
    if (imageUrl) fd.set("image_ref_url", imageUrl);
    fd.set("resolution", vOpts.resolution);
    fd.set("duration", vOpts.duration);
    fd.set("aspect_ratio", vOpts.aspectRatio);
    fd.set("generate_audio", "true");
    fd.set("motion_strength", String(vOpts.motionStrength));
    fd.set("camera", vOpts.camera);
    fd.set("negative_prompt", negativePrompt);
    fd.set("avoid_on_screen_text", vOpts.avoidOnScreenText ? "true" : "false");
    fd.set("fast", vOpts.fast ? "true" : "false");

    const res = await fetch("/api/generate", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? m.errors.videoFailed);
    const pathNote = data.generationMode
      ? `${m.wizard.videoGenPathLabel}: ${data.generationMode}`
      : "";
    setVideoNote(
      [pathNote, m.wizard.videoRichMotionNote, data.note as string | undefined]
        .filter(Boolean)
        .join(" · "),
    );
    return data.videoUrl as string;
  }

  async function makeImageToVideo(): Promise<string> {
    const vOpts = resolveVideoGenerationOpts(templateId, videoSettings);
    const pv = getPromptVars();
    const promptOpts = videoPromptOpts();
    let endUrl: string | null = endFrameUrl;
    if (!endUrl && !endFramePhoto && videoSettings.autoSecondFrame) {
      endUrl = await ensureEndFrameUrl();
    }
    const dualFrame = Boolean(endUrl || endFramePhoto);
    if (dualFrame) promptOpts.dualFrame = true;

    const defaultPrompt =
      videoCreativeMode === "image-to-video"
        ? buildImageToVideoPrompt(pv, promptOpts)
        : buildProductPromoVideoPrompt(pv, promptOpts);
    const fd = new FormData();
    fd.set("mode", "image");
    fd.set("prompt", videoPrompt.trim() || defaultPrompt);
    fd.set("resolution", vOpts.resolution);
    fd.set("duration", vOpts.duration);
    fd.set("aspect_ratio", vOpts.aspectRatio);
    fd.set("generate_audio", "true");
    fd.set("motion_strength", String(vOpts.motionStrength));
    fd.set("camera", vOpts.camera);
    fd.set("negative_prompt", negativePrompt);
    fd.set("avoid_on_screen_text", vOpts.avoidOnScreenText ? "true" : "false");
    fd.set("fast", vOpts.fast ? "true" : "false");

    if (imageUrl) fd.set("image_start_url", imageUrl);
    else if (productPhoto) fd.set("image_start", productPhoto);

    if (endFramePhoto) fd.set("image_end", endFramePhoto);
    else if (endUrl) fd.set("image_end_url", endUrl);

    const res = await fetch("/api/generate", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? m.errors.videoFailed);
    const pathNote = data.generationMode
      ? `${m.wizard.videoGenPathLabel}: ${data.generationMode}${data.endpoint ? ` · ${data.endpoint}` : ""}`
      : "";
    const notes = [
      pathNote,
      dualFrame ? m.wizard.videoRichMotionNote : undefined,
      data.note as string | undefined,
      referenceAd && referenceIsVideo ? m.wizard.videoRefIgnoredOnImageMode : "",
    ].filter(Boolean);
    if (notes.length) setVideoNote(notes.join(" · "));
    return data.videoUrl as string;
  }

  async function addBgm(videoUrlIn: string): Promise<string> {
    const res = await fetch("/api/add-bgm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_url: videoUrlIn, track: bgmTrack }),
    });
    const data = await res.json();
    if (res.ok) {
      setBgmNote(m.wizard.bgmNote);
      return data.videoUrl as string;
    }
    if (data.code === "BGM_FILES_MISSING") {
      setBgmNote(m.wizard.bgmFallbackNote);
      return videoUrlIn;
    }
    throw new Error(data.error ?? m.errors.videoFailed);
  }

  async function generateVideo() {
    if (
      workflowMode === "combined" &&
      videoCreativeMode === "image-to-video" &&
      !imageUrl &&
      !usesCompositor
    ) {
      setError(m.errors.needGeneratedImage);
      return;
    }
    if (videoCreativeMode === "reference-concept" && !useReferenceVideo) {
      setError(m.errors.needReferenceVideo);
      return;
    }
    if (!hasFinalImage) {
      setError(usesCompositor ? m.errors.needHeadline : m.errors.needKeyframe);
      return;
    }

    setError(null);
    setBgmNote(undefined);
    setVideoNote(undefined);
    setVideoBusy(true);
    setVideoPhase("video");

    try {
      let url: string;
      if (usesCompositor) {
        setVideoPhase("video");
        url = await composeVideo();
        setVideoNote(m.wizard.compositorVideoHint);
      } else if (referenceAd && referenceIsVideo) {
        if (videoCreativeMode !== "reference-concept") {
          setVideoNote(m.wizard.videoRefAutoModeNote);
        }
        url = await makeReferenceVideo(referenceAd);
      } else if (useMultiAngleVideo) {
        url = await makeMultiAngleVideo();
      } else {
        url = await makeImageToVideo();
      }
      if (!usesCompositor) {
        setVideoPhase("bgm");
        url = await addBgm(url);
      }
      setVideoUrl(url);
      setStepKey("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : m.errors.videoFailed);
    } finally {
      setVideoBusy(false);
    }
  }

  function resetProject() {
    setWorkflowMode("combined");
    setStepKey("setup");
    setTemplateId("product-reel");
    setVisualStyleId(DEFAULT_VISUAL_STYLE);
    setImageCreativeMode("promo-ai");
    setVideoCreativeMode("image-to-video");
    setVideoSettings(DEFAULT_VIDEO_SETTINGS);
    setEndFrameUrl(null);
    setEndFramePhoto(null);
    setExtraAnglePhotos([]);
    setSelectedReferenceClipId(null);
    setImageInputMode(getTemplateConfig("paper-sticker-reel").defaultImageInputMode);
    setProduct("");
    setHeadline("");
    setSubline("");
    setBusiness("");
    setOffer("");
    setImageUrl(null);
    setImageVariantUrls([]);
    setSelectedVariantIndex(0);
    setImageOutputMode(DEFAULT_IMAGE_OUTPUT_MODE);
    setCampaignTheme("");
    setCampaignPlan(null);
    setCampaignSlides([]);
    setBrandProfile(null);
    setBrandAnalyzeNote(null);
    setUploadQualityWarning(null);
    setUseOriginalImage(false);
    setVideoUrl(null);
    setVideoNote(undefined);
    setBgmNote(undefined);
    setProductPhoto(null);
    setImageRefPhoto(null);
    setReferenceAd(null);
    setError(null);
    setBgmTrack("calm");
    setPromptMarket(locale === "zh" ? "hk" : "en");
    setSubjectFraming("auto");
    setPromptExtra("");
  }

  const bgmOptions: { id: BgmTrackId; label: string }[] = [
    { id: "calm", label: m.wizard.bgmCalm },
    { id: "upbeat", label: m.wizard.bgmUpbeat },
    { id: "warm", label: m.wizard.bgmWarm },
  ];

  const continueSetupLabel =
    workflowMode === "video-only" ? m.wizard.continueToVideo : m.wizard.continueToImage;

  const imageFinishLabel =
    workflowMode === "image-only" ? m.wizard.finishImage : m.wizard.continueToVideo;

  const finalImageSrc = imageUrl ?? (useOriginalImage ? uploadPreviewUrl : null);

  return (
    <div>
      <StepIndicator mode={workflowMode} currentKey={stepKey} />

      {stepKey === "setup" && (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-white">{m.wizard.step1Title}</h2>
            <p className="mt-2 text-sm text-slate-400">{m.wizard.step1Hint}</p>
          </div>

          <WorkflowModePicker value={workflowMode} onChange={onWorkflowModeChange} />

          <VisualStylePicker value={visualStyleId} onChange={selectVisualStyle} />

          {!usesCompositor && isBrandVisualStyle(visualStyleId) && (
            <div className="space-y-3 rounded-xl border border-violet-900/50 bg-violet-950/25 px-4 py-3">
              <p className="text-sm font-semibold text-violet-50">{m.wizard.brandFitTitle}</p>
              <p className="text-xs text-violet-200/90">
                {lockedCampaignMode ? m.wizard.brandCampaignIntro : m.wizard.brandFitIntro}
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

          {!usesCompositor && visualStylePromptHint(visualStyleId) && (
            <p className="rounded-lg border border-slate-700/80 bg-slate-900/40 px-3 py-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">{m.wizard.styleAutoAppliedLabel}</span>{" "}
              {m.wizard.visualStyleHints[visualStyleId]}
            </p>
          )}

          <label className="block text-sm font-medium text-slate-300">
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
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
          />

          {usesCompositor && (
            <p className="rounded-xl border border-sky-900/50 bg-sky-950/30 px-4 py-3 text-sm text-sky-100">
              {m.wizard.compositorCallout}
            </p>
          )}

          {templateHasSlot(templateId, "product") && (
            <>
              <label className="block text-sm font-medium text-slate-300">{m.wizard.productLabel}</label>
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder={m.wizard.productPlaceholder}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
              />
            </>
          )}

          {templateHasSlot(templateId, "headline") && (
            <>
              <label className="block text-sm font-medium text-slate-300">
                {m.wizard.headlineLabel}
                {isSlotRequired(templateId, "headline") && " *"}
              </label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder={m.wizard.headlinePlaceholder}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
              />
            </>
          )}

          {templateHasSlot(templateId, "subline") && (
            <>
              <label className="block text-sm font-medium text-slate-300">
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
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                />
              ) : (
                <input
                  value={subline}
                  onChange={(e) => setSubline(e.target.value)}
                  placeholder={m.wizard.sublinePlaceholder}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
                />
              )}
            </>
          )}

          {templateHasSlot(templateId, "business") && (
            <>
              <label className="block text-sm font-medium text-slate-300">
                {usesCompositor ? m.wizard.brandLabel : m.wizard.businessLabel}
              </label>
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder={
                  usesCompositor ? m.wizard.brandPlaceholder : m.wizard.businessPlaceholder
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
              />
            </>
          )}

          {templateHasSlot(templateId, "offer") && (
            <>
              <label className="block text-sm font-medium text-slate-300">
                {usesCompositor ? m.wizard.signoffLabel : m.wizard.offerLabel}
              </label>
              <input
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder={
                  usesCompositor ? m.wizard.signoffPlaceholder : m.wizard.offerPlaceholder
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
              />
            </>
          )}

          <TemplateSlotChecklist templateId={templateId} filled={templateSlotStatus()} />

          {workflowMode !== "image-only" && !usesCompositor && (
            <details
              className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
              open={showAdvancedSetup}
              onToggle={(e) => setShowAdvancedSetup((e.target as HTMLDetailsElement).open)}
            >
              <summary className="cursor-pointer text-sm font-medium text-slate-300">
                {m.wizard.advanced}
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
            className="w-full rounded-2xl bg-emerald-600 py-3.5 text-base font-semibold text-white"
          >
            {continueSetupLabel}
          </button>
        </section>
      )}

      {stepKey === "image" && isImageWorkflow && (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-white">{m.wizard.step2Title}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {usesCompositor ? m.wizard.compositorImageHint : imageStepHint}
            </p>
          </div>

          <TemplateSlotChecklist templateId={templateId} filled={templateSlotStatus()} />

          {!usesCompositor ? (
            <ImageCreativeModePicker
              value={imageCreativeMode}
              onChange={onImageCreativeModeChange}
            />
          ) : null}

          {!usesCompositor && !visualStyle.usesCompositor && (
            <div className="rounded-xl border border-amber-900/45 bg-amber-950/25 px-4 py-3 text-sm text-amber-100">
              <p>{m.wizard.exactTextHint}</p>
              <button
                type="button"
                onClick={() => selectVisualStyle("paper-layout")}
                className="mt-2 text-xs font-semibold text-amber-300 underline hover:text-amber-200"
              >
                {m.wizard.exactTextCta}
              </button>
            </div>
          )}

          {!usesCompositor && templateId === "custom" ? (
            <ImageInputModePicker value={imageInputMode} onChange={onImageInputModeChange} />
          ) : null}

          {!usesCompositor && imageCreativeMode === "reference-concept" && (
            <UploadZone
              label={m.wizard.imageRefConceptLabel}
              hint={m.wizard.imageRefConceptHint}
              cta={m.wizard.imageRefCta}
              changeLabel={m.wizard.imageRefChange}
              previewUrl={imageRefPreviewUrl}
              fileName={imageRefPhoto?.name ?? null}
              onFile={setImageRefPhoto}
            />
          )}

          {!usesCompositor && effectiveImageMode === "describe" && (
            <details className="rounded-xl border border-slate-800 bg-slate-950/40 p-3" open>
              <summary className="cursor-pointer text-sm font-medium text-slate-300">
                {m.wizard.imagePromptLabel}
              </summary>
              <AdvancedPromptPanel
                section="image"
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

          {!usesCompositor && effectiveImageMode === "reference" && (
            <UploadZone
              label={m.wizard.imageRefLabel}
              hint={m.wizard.imageInputModes.reference.description}
              cta={m.wizard.imageRefCta}
              changeLabel={m.wizard.imageRefChange}
              previewUrl={imageRefPreviewUrl}
              fileName={imageRefPhoto?.name ?? null}
              onFile={setImageRefPhoto}
            />
          )}

          {(usesCompositor || needsProductUpload) && (
            <>
              <UploadZone
                label={m.wizard.uploadLabel}
                hint={m.wizard.uploadHint}
                cta={m.wizard.uploadCta}
                changeLabel={m.wizard.uploadChange}
                previewUrl={uploadPreviewUrl}
                fileName={productPhoto?.name ?? null}
                onFile={onProductPhotoSelected}
              />
              {!usesCompositor && imageCreativeMode === "reference-concept" && imageRefPhoto && (
                <p className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-100/90">
                  {m.wizard.imageRefConceptActiveHint}
                </p>
              )}
              {!usesCompositor &&
                effectiveImageMode === "product-ad" &&
                imageCreativeMode !== "reference-concept" && (
                  <p className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-xs text-slate-400">
                    {m.wizard.productAdHint}
                  </p>
                )}
              {uploadQualityWarning && (
                <p className="rounded-lg border border-amber-800/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
                  {uploadQualityMessage(uploadQualityWarning)}
                </p>
              )}
            </>
          )}


          {!usesCompositor && effectiveImageMode !== "describe" && (
            <details
              className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
              open={showAdvancedImage}
              onToggle={(e) => setShowAdvancedImage((e.target as HTMLDetailsElement).open)}
            >
              <summary className="cursor-pointer text-sm text-slate-400">{m.wizard.imagePromptLabel}</summary>
              <AdvancedPromptPanel
                section="image"
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

          {!usesCompositor && effectiveImageMode !== "describe" && (
            <ImageOutputModePicker
              value={effectiveImageOutputMode}
              onChange={(mode) => {
                setImageOutputMode(mode);
                setCampaignPlan(null);
                setCampaignSlides([]);
                setImageUrl(null);
                setImageVariantUrls([]);
              }}
              lockedCampaign={lockedCampaignMode}
            />
          )}

          {!usesCompositor && isCampaignOutput && (
            <>
              <label className="block text-sm font-medium text-slate-300">
                {m.wizard.campaignThemeLabel}
              </label>
              <input
                value={campaignTheme}
                onChange={(e) => setCampaignTheme(e.target.value)}
                placeholder={m.wizard.campaignThemePlaceholder}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white"
              />
            </>
          )}

          {error && (
            <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={imageBusy || !canGenerateImage()}
              onClick={generateImage}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {imageBusy
                ? isCampaignOutput
                  ? m.wizard.campaignGenerating
                  : m.wizard.imageGenerating
                : imageUrl
                  ? usesCompositor
                    ? m.wizard.compositorRegenerateImageBtn
                    : m.wizard.regenerateImageBtn
                  : usesCompositor
                    ? m.wizard.compositorImageBtn
                    : m.wizard.generateImageBtn}
            </button>
            {needsProductUpload && productPhoto && !usesCompositor && (
              <button
                type="button"
                onClick={useOriginalAsKeyframe}
                className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm text-slate-200"
              >
                {workflowMode === "image-only"
                  ? m.wizard.useOriginalImageOnlyBtn
                  : m.wizard.useOriginalBtn}
              </button>
            )}
          </div>

          {uploadPreviewUrl && !imageUrl && !useOriginalImage && (
            <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-4">
              <p className="mb-2 text-xs font-medium text-amber-200">{m.wizard.uploadPreviewLabel}</p>
              <img
                src={uploadPreviewUrl}
                alt=""
                className="mx-auto max-h-48 rounded-lg object-contain opacity-90"
              />
            </div>
          )}

          {imageUrl && !useOriginalImage && campaignSlides.length > 1 && (
            <div className="rounded-2xl border border-emerald-700/50 bg-emerald-950/25 p-4">
              {campaignPlan?.theme && (
                <p className="mb-2 text-xs text-emerald-100/80">
                  <span className="font-medium text-emerald-200">{m.wizard.campaignPlanLabel}:</span>{" "}
                  {campaignPlan.theme}
                </p>
              )}
              <p className="mb-3 text-xs font-medium text-emerald-200">
                {m.wizard.pickCampaignSlideLabel}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {campaignSlides.map((slide, i) => (
                  <button
                    key={`${slide.imageUrl}-${i}`}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIndex(i);
                      setImageUrl(slide.imageUrl);
                      setImageGenKey((k) => k + 1);
                    }}
                    className={`rounded-xl border p-2 text-left transition ${
                      selectedVariantIndex === i
                        ? "border-emerald-500 bg-emerald-950/50 ring-2 ring-emerald-500/60"
                        : "border-slate-700 bg-slate-900/40 hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={`${slide.imageUrl}${slide.imageUrl.includes("?") ? "&" : "?"}v=${imageGenKey}-${i}`}
                      alt=""
                      className="mx-auto max-h-52 w-full rounded-lg object-contain"
                    />
                    <span className="mt-2 block text-center text-xs font-medium text-slate-200">
                      {campaignSlideLabel(slide.role, slide.title)}
                    </span>
                    {slide.headline && (
                      <span className="mt-1 block text-center text-[10px] text-slate-400 line-clamp-2">
                        {slide.headline}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {lastImageEndpoint && (
                <p className="mt-2 text-[10px] text-slate-500">{lastImageEndpoint}</p>
              )}
            </div>
          )}

          {imageUrl &&
            !useOriginalImage &&
            campaignSlides.length <= 1 &&
            imageVariantUrls.length > 1 && (
            <div className="rounded-2xl border border-emerald-700/50 bg-emerald-950/25 p-4">
              <p className="mb-3 text-xs font-medium text-emerald-200">{m.wizard.pickVariantLabel}</p>
              <div className="grid grid-cols-2 gap-3">
                {imageVariantUrls.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() => {
                      setSelectedVariantIndex(i);
                      setImageUrl(url);
                      setImageGenKey((k) => k + 1);
                    }}
                    className={`rounded-xl border p-2 text-left transition ${
                      selectedVariantIndex === i
                        ? "border-emerald-500 bg-emerald-950/50 ring-2 ring-emerald-500/60"
                        : "border-slate-700 bg-slate-900/40 hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={`${url}${url.includes("?") ? "&" : "?"}v=${imageGenKey}-${i}`}
                      alt=""
                      className="mx-auto max-h-52 w-full rounded-lg object-contain"
                    />
                    <span className="mt-2 block text-center text-xs text-slate-300">
                      {i === 0 ? m.wizard.variantA : m.wizard.variantB}
                    </span>
                  </button>
                ))}
              </div>
              {lastImageEndpoint && (
                <p className="mt-2 text-[10px] text-slate-500">{lastImageEndpoint}</p>
              )}
            </div>
          )}

          {imageUrl && !useOriginalImage && imageVariantUrls.length <= 1 && (
            <div className="rounded-2xl border border-emerald-700/50 bg-emerald-950/25 p-4">
              <p className="mb-2 text-xs font-medium text-emerald-200">{m.wizard.aiImageResultLabel}</p>
              {lastImageEndpoint && (
                <p className="mb-2 text-[10px] text-slate-500">{lastImageEndpoint}</p>
              )}
              <img
                src={`${imageUrl}${imageUrl.includes("?") ? "&" : "?"}v=${imageGenKey}`}
                alt=""
                className="mx-auto max-h-72 rounded-lg object-contain"
              />
            </div>
          )}

          {useOriginalImage && uploadPreviewUrl && (
            <div className="rounded-2xl border border-slate-700 p-4">
              <p className="mb-2 text-xs text-slate-400">{m.wizard.originalImageLabel}</p>
              <img
                src={uploadPreviewUrl}
                alt=""
                className="mx-auto max-h-72 rounded-lg object-contain"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goBackFromImage}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300"
            >
              {m.wizard.back}
            </button>
            <button
              type="button"
              disabled={!hasFinalImage}
              onClick={finishImageStep}
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {imageFinishLabel}
            </button>
          </div>
        </section>
      )}

      {stepKey === "video" && isVideoWorkflow && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white">{m.wizard.step3Title}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {usesCompositor ? m.wizard.compositorVideoHint : videoStepHint}
            </p>
          </div>

          {/* Reference ad MP4 — only when template includes this slot */}
          {!usesCompositor && (
            <VideoCreativeModePicker
              goal={workflowMode}
              value={videoCreativeMode}
              onChange={onVideoCreativeModeChange}
            />
          )}

          {!usesCompositor && <VideoSettingsPanel value={videoSettings} onChange={setVideoSettings} />}

          {!usesCompositor && videoCreativeMode !== "reference-concept" && (
              <div className="space-y-3 rounded-2xl border border-violet-900/40 bg-violet-950/20 p-4">
                <p className="text-sm font-medium text-violet-100">{m.wizard.extraAnglesLabel}</p>
                <p className="text-xs text-violet-200/70">{m.wizard.extraAnglesHint}</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-800 file:px-3 file:py-2 file:text-sm file:text-white"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []).slice(0, 3);
                    setExtraAnglePhotos(files);
                    setError(null);
                  }}
                />
                {extraAnglePhotos.length > 0 && (
                  <p className="text-xs text-violet-200">
                    {extraAnglePhotos.length} {m.wizard.extraAnglesCta}
                  </p>
                )}
              </div>
            )}

          {!usesCompositor && videoCreativeMode !== "reference-concept" && (
            <UploadZone
              label={m.wizard.endFrameLabel}
              hint={m.wizard.endFrameHint}
              cta={m.wizard.uploadCta}
              changeLabel={m.wizard.uploadChange}
              previewUrl={endFramePreviewUrl ?? (endFrameUrl || null)}
              fileName={endFramePhoto?.name ?? (endFrameUrl ? "ai-second-frame.png" : null)}
              onFile={(f) => {
                setEndFramePhoto(f);
                setEndFrameUrl(null);
                setError(null);
              }}
            />
          )}

          {!usesCompositor && showVideoReferenceSection && (
          <div
            id="video-reference-upload"
            className="space-y-3 rounded-2xl border-2 border-emerald-600/50 bg-emerald-950/25 p-4 shadow-lg shadow-emerald-950/30"
          >
            <h3 className="text-base font-semibold text-emerald-100">{m.wizard.videoSectionReference}</h3>
            <p className="text-xs text-emerald-200/80">{m.wizard.referenceHint}</p>
            <p className="rounded-lg border border-amber-900/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100">
              {m.wizard.referenceVideoTips}
            </p>
            <ReferenceClipPicker
              selectedClipId={selectedReferenceClipId}
              onSelectClip={loadReferenceClip}
              loading={referenceClipLoading}
            />
            <ReferenceUploadZone
              label={m.wizard.referenceLabel}
              hint={m.wizard.referenceVideoOnlyHint}
              cta={m.wizard.referenceCta}
              changeLabel={m.wizard.referenceChange}
              previewUrl={referencePreviewUrl}
              isVideo={referenceIsVideo}
              fileName={referenceAd?.name ?? null}
              onFile={onReferenceAdFile}
            />
            {useReferenceVideo && (
              <>
                <p className="rounded-lg bg-emerald-900/40 px-3 py-2 text-xs text-emerald-200">
                  {m.wizard.referenceModeActive}
                </p>
                {(imageUrl || productPhoto) && (
                  <p className="rounded-lg border border-amber-900/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100">
                    {m.wizard.videoRefProductMismatch}
                  </p>
                )}
              </>
            )}
            {referenceAd && !referenceIsVideo && (
              <p className="rounded-lg bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
                {m.wizard.referenceImageOnlyHint}
              </p>
            )}
          </div>
          )}

          <TemplateSlotChecklist templateId={templateId} filled={templateSlotStatus()} />

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
            <h3 className="text-sm font-semibold text-white">{m.wizard.videoSectionKeyframe}</h3>

            {workflowMode === "video-only" ? (
              <UploadZone
                label={m.wizard.videoKeyframeProductLabel}
                hint={
                  usesCompositor ? m.wizard.compositorImageHint : m.wizard.videoKeyframeProductHint
                }
                cta={m.wizard.uploadCta}
                changeLabel={m.wizard.uploadChange}
                previewUrl={uploadPreviewUrl}
                fileName={productPhoto?.name ?? null}
                onFile={async (f) => {
                  setProductPhoto(f);
                  setImageUrl(null);
                  setUseOriginalImage(!usesCompositor);
                  setError(null);
                  setUploadQualityWarning(null);
                  if (!f) return;
                  try {
                    const quality = await analyzeProductImageFile(f);
                    setUploadQualityWarning(quality.warnings[0] ?? null);
                  } catch {
                    setUploadQualityWarning(null);
                  }
                }}
              />
            ) : keyframePreview ? (
              <div>
                <p className="mb-2 text-xs text-slate-500">{m.wizard.imageReadyHint}</p>
                <img
                  src={keyframePreview}
                  alt=""
                  className="mx-auto max-h-48 rounded-lg border border-slate-700 object-contain"
                />
              </div>
            ) : (
              <p className="rounded-lg bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
                {m.wizard.needKeyframeGoBack}
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
            <h3 className="text-sm font-semibold text-white">{m.wizard.videoSectionBgm}</h3>
            <div className="flex flex-wrap gap-2">
              {bgmOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBgmTrack(id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    bgmTrack === id
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-600 text-slate-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {!usesCompositor && (
          <details
            className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
            open={showAdvancedVideo}
            onToggle={(e) => setShowAdvancedVideo((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer text-sm text-slate-400">{m.wizard.videoPromptLabel}</summary>
            <AdvancedPromptPanel
              section="video"
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

          {error && (
            <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {videoBusy && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 py-8 text-center">
              <span className="inline-block size-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
              <p className="mt-3 text-sm text-emerald-300">
                {usesCompositor
                  ? m.wizard.compositorPhaseRender
                  : videoPhase === "second-frame"
                    ? m.wizard.phaseSecondFrame
                    : videoPhase === "bgm"
                      ? m.wizard.phaseBgm
                      : m.wizard.phaseVideo}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              disabled={videoBusy}
              onClick={goBackFromVideo}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 disabled:opacity-50"
            >
              {m.wizard.back}
            </button>
            <button
              type="button"
              disabled={!hasFinalImage || videoBusy}
              onClick={generateVideo}
              className="flex-1 rounded-2xl bg-emerald-600 py-3.5 text-base font-semibold text-white disabled:opacity-40"
            >
              {videoBusy
                ? usesCompositor
                  ? m.wizard.compositorPhaseRender
                  : m.wizard.phaseVideo
                : usesCompositor
                  ? m.wizard.compositorVideoBtn
                  : m.wizard.generateVideoBtn}
            </button>
          </div>
          {!hasFinalImage && !videoBusy && (
            <p className="text-center text-xs text-amber-200/90">{m.wizard.videoGenerateDisabledHint}</p>
          )}
        </section>
      )}

      {stepKey === "done" && workflowMode === "image-only" && finalImageSrc && (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-white">{m.wizard.imageDoneTitle}</h2>
            <p className="mt-2 text-sm text-slate-400">{m.wizard.imageDoneHint}</p>
          </div>
          <img
            src={finalImageSrc}
            alt=""
            className="w-full rounded-2xl border border-slate-800 object-contain"
          />
          <a
            href={finalImageSrc}
            download="marketing-image.png"
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white"
          >
            {m.wizard.downloadImage}
          </a>
          <button
            type="button"
            onClick={resetProject}
            className="w-full rounded-xl border border-slate-700 py-2.5 text-sm text-slate-400"
          >
            {m.wizard.newProject}
          </button>
        </section>
      )}

      {stepKey === "done" && workflowMode !== "image-only" && videoUrl && (
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-white">{m.wizard.step4Title}</h2>
            <p className="mt-2 text-sm text-slate-400">{m.wizard.step4Hint}</p>
          </div>
          {bgmNote && (
            <p className="rounded-lg bg-emerald-950/40 px-3 py-2 text-xs text-emerald-200">{bgmNote}</p>
          )}
          {videoNote && (
            <p className="rounded-lg bg-amber-950/40 px-3 py-2 text-xs text-amber-200">{videoNote}</p>
          )}
          <video
            src={videoUrl}
            controls
            playsInline
            className="w-full rounded-2xl border border-slate-800 bg-black"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={videoUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-emerald-600 py-3 text-center text-sm font-semibold text-white"
            >
              {m.wizard.download}
            </a>
            <a
              href="/pro"
              className="rounded-xl border border-slate-600 py-3 text-center text-sm font-medium text-slate-200"
            >
              {m.wizard.subtitles}
            </a>
          </div>
          <button
            type="button"
            onClick={resetProject}
            className="w-full rounded-xl border border-slate-700 py-2.5 text-sm text-slate-400"
          >
            {m.wizard.newProject}
          </button>
        </section>
      )}
    </div>
  );
}
