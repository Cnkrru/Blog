import { computed, ref } from "vue";
import { createPinia, defineStore } from "pinia";
//#region src/stores/theme.ts
var useThemeStore = defineStore("theme", () => {
	const currentTheme = ref("dark");
	const currentStyle = ref("ink");
	const currentLayout = ref("card");
	const glassAlpha = ref(.78);
	const isAutoSwitch = ref(false);
	const hasUserPreference = ref(false);
	const isDark = computed(() => currentTheme.value === "dark");
	const isLight = computed(() => currentTheme.value === "light");
	const applyThemeDom = () => {
		if (currentTheme.value === "dark") document.body.classList.add("dark-theme");
		else document.body.classList.remove("dark-theme");
		document.documentElement.setAttribute("data-theme", currentTheme.value);
	};
	const applyStyleDom = () => {
		document.documentElement.setAttribute("data-style", currentStyle.value);
	};
	const applyLayoutDom = () => {
		document.documentElement.setAttribute("data-layout", currentLayout.value);
	};
	const applyGlassDom = () => {
		document.documentElement.style.setProperty("--glass-alpha", String(glassAlpha.value));
	};
	const setTheme = (theme) => {
		currentTheme.value = theme;
		hasUserPreference.value = true;
		applyThemeDom();
		savePreference();
	};
	const toggleTheme = () => {
		currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
		hasUserPreference.value = true;
		applyThemeDom();
		savePreference();
	};
	const setStyle = (style) => {
		currentStyle.value = style;
		applyStyleDom();
		savePreference();
	};
	const setLayout = (layout) => {
		currentLayout.value = layout;
		applyLayoutDom();
		savePreference();
	};
	const setGlassAlpha = (alpha) => {
		glassAlpha.value = alpha;
		applyGlassDom();
		savePreference();
	};
	const setGlassAlphaLive = (alpha) => {
		glassAlpha.value = alpha;
		applyGlassDom();
	};
	const setAutoSwitch = (enabled) => {
		isAutoSwitch.value = enabled;
		savePreference();
	};
	const initTheme = () => {
		if (typeof window === "undefined") return;
		const saved = localStorage.getItem("theme-preference");
		if (saved) {
			const { theme, style, layout, glass, auto } = JSON.parse(saved);
			currentTheme.value = theme ?? "dark";
			currentStyle.value = style ?? "ink";
			currentLayout.value = layout ?? "card";
			glassAlpha.value = typeof glass === "number" ? glass : currentStyle.value === "sakura" ? .55 : .78;
			isAutoSwitch.value = auto !== false;
			hasUserPreference.value = true;
		} else {
			currentTheme.value = "dark";
			currentStyle.value = "ink";
			currentLayout.value = "card";
			glassAlpha.value = .78;
		}
		applyThemeDom();
		applyStyleDom();
		applyLayoutDom();
		applyGlassDom();
	};
	const savePreference = () => {
		if (typeof localStorage === "undefined") return;
		try {
			localStorage.setItem("theme-preference", JSON.stringify({
				theme: currentTheme.value,
				style: currentStyle.value,
				layout: currentLayout.value,
				glass: glassAlpha.value,
				auto: isAutoSwitch.value
			}));
		} catch (e) {
			console.warn("[themeStore] 保存主题偏好失败:", e);
		}
	};
	const resetToDefault = () => {
		currentTheme.value = "dark";
		currentStyle.value = "ink";
		currentLayout.value = "card";
		glassAlpha.value = .78;
		isAutoSwitch.value = false;
		hasUserPreference.value = false;
		if (typeof localStorage !== "undefined") localStorage.removeItem("theme-preference");
		document.documentElement.setAttribute("data-theme", "light");
		document.documentElement.setAttribute("data-style", "ink");
		document.documentElement.setAttribute("data-layout", "card");
		document.documentElement.style.setProperty("--glass-alpha", "0.78");
	};
	return {
		currentTheme,
		currentStyle,
		currentLayout,
		glassAlpha,
		isAutoSwitch,
		hasUserPreference,
		isDark,
		isLight,
		setTheme,
		toggleTheme,
		setStyle,
		setLayout,
		setGlassAlpha,
		setGlassAlphaLive,
		setAutoSwitch,
		initTheme,
		savePreference,
		resetToDefault
	};
});
//#endregion
//#region src/stores/scroll.ts
var useScrollStore = defineStore("scroll", () => {
	const scrollPosition = ref(0);
	const backToTopVisible = ref(false);
	const showThreshold = ref(300);
	const isVisible = computed(() => backToTopVisible.value);
	const threshold = computed(() => showThreshold.value);
	const updateScrollPosition = (position) => {
		scrollPosition.value = position;
		updateBackToTopVisibility();
	};
	const updateBackToTopVisibility = () => {
		backToTopVisible.value = scrollPosition.value > showThreshold.value;
	};
	const setShowThreshold = (newThreshold) => {
		showThreshold.value = newThreshold;
		updateBackToTopVisibility();
	};
	const scrollToTop = () => {
		if (document.body.classList.contains("immersive-reading")) window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
		else {
			const centerCardContent = document.querySelector(".center-card-content");
			if (centerCardContent) centerCardContent.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			else window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}
	};
	const initScrollListener = () => {
		if (typeof window !== "undefined") {
			const handleScroll = () => {
				if (document.body.classList.contains("immersive-reading")) updateScrollPosition(window.scrollY);
				else {
					const centerCardContent = document.querySelector(".center-card-content");
					if (centerCardContent) updateScrollPosition(centerCardContent.scrollTop);
					else updateScrollPosition(window.scrollY);
				}
			};
			window.addEventListener("scroll", handleScroll, { passive: true });
			handleScroll();
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}
	};
	return {
		scrollPosition,
		backToTopVisible,
		showThreshold,
		isVisible,
		threshold,
		updateScrollPosition,
		updateBackToTopVisibility,
		setShowThreshold,
		scrollToTop,
		initScrollListener
	};
});
//#endregion
//#region src/stores/tag.ts
var useTagStore = defineStore("tag", () => {
	const tags = ref([]);
	const tagStats = ref([]);
	const sortBy = ref("frequency");
	const loading = ref(false);
	const error = ref(null);
	const lastLoaded = ref(null);
	const tagCache = ref(/* @__PURE__ */ new Map());
	const hasTags = computed(() => tags.value.length > 0);
	const getTagCount = computed(() => tags.value.length);
	const getPopularTags = computed(() => tagStats.value.slice(0, 10));
	const loadTags = async (articles) => {
		loading.value = true;
		error.value = null;
		try {
			const tagCounts = /* @__PURE__ */ new Map();
			const tagLastUsed = /* @__PURE__ */ new Map();
			articles.forEach((article) => {
				if (article.tags && Array.isArray(article.tags)) article.tags.forEach((tag) => {
					tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
					const currentDate = new Date(article.date).getTime();
					if (currentDate > (tagLastUsed.get(tag) || 0)) tagLastUsed.set(tag, currentDate);
				});
			});
			const stats = [];
			tagCounts.forEach((count, tag) => {
				stats.push({
					tag,
					count,
					frequency: count / articles.length,
					lastUsed: tagLastUsed.get(tag) || Date.now()
				});
			});
			stats.sort((a, b) => {
				switch (sortBy.value) {
					case "frequency": return b.frequency - a.frequency;
					case "count": return b.count - a.count;
					case "recent": return b.lastUsed - a.lastUsed;
					case "trending": {
						const aTrend = a.count * (Date.now() - a.lastUsed) / 1e6;
						return b.count * (Date.now() - b.lastUsed) / 1e6 - aTrend;
					}
					default: return b.count - a.count;
				}
			});
			tagStats.value = stats.slice(0, 50);
			tags.value = tagStats.value.map((item) => item.tag);
			lastLoaded.value = /* @__PURE__ */ new Date();
		} catch (err) {
			console.error("[tagStore] 加载标签失败:", err);
			error.value = "加载标签失败";
		} finally {
			loading.value = false;
		}
	};
	const getTagArticles = async (tag, articles) => {
		const cacheKey = `tag_articles_${tag}`;
		const cachedArticles = tagCache.value.get(cacheKey);
		if (cachedArticles) return cachedArticles;
		const filteredArticles = articles.filter((article) => article.tags && article.tags.includes(tag));
		if (filteredArticles.length > 0) tagCache.value.set(cacheKey, filteredArticles);
		return filteredArticles;
	};
	const getRelatedTags = (_tag, _limit = 5) => {
		return [];
	};
	const setSortBy = (newSortBy) => {
		sortBy.value = newSortBy;
		try {
			localStorage.setItem("tag_sort_preference", newSortBy);
		} catch (e) {
			console.warn("[tagStore] 无法保存标签排序偏好:", e);
		}
	};
	const resetError = () => {
		error.value = null;
	};
	const clearCache = () => {
		tagCache.value.clear();
		try {
			localStorage.removeItem("tag_sort_preference");
		} catch (e) {
			console.warn("[tagStore] 无法清除标签缓存:", e);
		}
	};
	return {
		tags,
		tagStats,
		sortBy,
		loading,
		error,
		lastLoaded,
		tagCache,
		hasTags,
		getTagCount,
		getPopularTags,
		loadTags,
		getTagArticles,
		getRelatedTags,
		setSortBy,
		resetError,
		clearCache
	};
});
//#endregion
//#region src/stores/toc.ts
var useTocStore = defineStore("toc", () => {
	const show = ref(false);
	const activeId = ref("");
	const toc = ref([]);
	const lastScrollTime = ref(0);
	const scrollThrottleDelay = ref(100);
	const hasToc = computed(() => toc.value.length > 0);
	const activeItem = computed(() => {
		if (!activeId.value) return null;
		return toc.value.find((item) => item.id === activeId.value) || null;
	});
	const tocDepth = computed(() => {
		if (toc.value.length === 0) return 0;
		return Math.max(...toc.value.map((item) => item.level));
	});
	const toggleToc = () => {
		show.value = !show.value;
		try {
			localStorage.setItem("toc_show_preference", show.value.toString());
		} catch (e) {
			console.warn("[tocStore] 无法保存目录显示偏好:", e);
		}
	};
	const setShow = (newShow) => {
		show.value = newShow;
		try {
			localStorage.setItem("toc_show_preference", newShow.toString());
		} catch (e) {
			console.warn("[tocStore] 无法保存目录显示偏好:", e);
		}
	};
	const setToc = (newToc) => {
		toc.value = newToc;
	};
	const setActiveId = (id) => {
		if (id !== activeId.value) activeId.value = id;
	};
	const scrollToHeading = (id) => {
		const element = document.getElementById(id);
		if (!element) return;
		const scrollContainers = [
			document.querySelector(".center-card-content"),
			document.querySelector(".post-content"),
			document.querySelector(".markdown-content")
		];
		let container = null;
		for (const potentialContainer of scrollContainers) if (potentialContainer && potentialContainer.contains(element)) {
			container = potentialContainer;
			break;
		}
		if (container) {
			const rect = element.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const relativeTop = rect.top - containerRect.top;
			container.scrollTo({
				top: container.scrollTop + relativeTop - 20,
				behavior: "smooth"
			});
		} else element.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const loadUserPreference = () => {
		try {
			const savedPreference = localStorage.getItem("toc_show_preference");
			if (savedPreference !== null) show.value = savedPreference === "true";
		} catch (e) {
			console.warn("[tocStore] 无法加载目录显示偏好:", e);
		}
	};
	const reset = () => {
		show.value = false;
		activeId.value = "";
		toc.value = [];
	};
	return {
		show,
		activeId,
		toc,
		lastScrollTime,
		scrollThrottleDelay,
		hasToc,
		activeItem,
		tocDepth,
		toggleToc,
		setShow,
		setToc,
		setActiveId,
		scrollToHeading,
		loadUserPreference,
		reset
	};
});
//#endregion
//#region src/stores/notification.ts
var useNotificationStore = defineStore("notification", () => {
	const notifications = ref([]);
	const hasNotifications = computed(() => notifications.value.length > 0);
	const addNotification = (message, options = {}) => {
		const notification = {
			id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
			message,
			type: options.type || "info",
			duration: options.duration || 8e3,
			buttons: options.buttons || []
		};
		notifications.value.push(notification);
	};
	const removeNotification = (id) => {
		notifications.value = notifications.value.filter((n) => n.id !== id);
	};
	const clearNotifications = () => {
		notifications.value = [];
	};
	return {
		notifications,
		hasNotifications,
		addNotification,
		removeNotification,
		clearNotifications
	};
});
//#endregion
//#region src/stores/mouse.ts
var useMouseStore = defineStore("mouse", () => {
	const enabled = ref(true);
	const trailLength = ref(20);
	const trailSpeed = ref(40);
	const trailSize = ref(18);
	const trailOpacity = ref(1);
	const trailMode = ref("random");
	const trailColor = ref("#3498db");
	const trailChars = ref("!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
	const isDarkTheme = ref(false);
	const setEnabled = (val) => {
		enabled.value = val;
	};
	const setTrailLength = (length) => {
		trailLength.value = Math.max(5, Math.min(50, length));
	};
	const setTrailSpeed = (speed) => {
		trailSpeed.value = Math.max(10, Math.min(100, speed));
	};
	const setTrailSize = (size) => {
		trailSize.value = Math.max(8, Math.min(32, size));
	};
	const setTrailMode = (mode) => {
		trailMode.value = mode;
	};
	const setTrailColor = (color) => {
		trailColor.value = color;
	};
	const setDarkTheme = (isDark) => {
		isDarkTheme.value = isDark;
	};
	const resetConfig = () => {
		trailLength.value = 20;
		trailSpeed.value = 40;
		trailSize.value = 18;
		trailOpacity.value = 1;
		trailMode.value = "random";
		trailColor.value = "#3498db";
	};
	return {
		enabled,
		trailLength,
		trailSpeed,
		trailSize,
		trailOpacity,
		trailMode,
		trailColor,
		trailChars,
		isDarkTheme,
		setEnabled,
		setTrailLength,
		setTrailSpeed,
		setTrailSize,
		setTrailMode,
		setTrailColor,
		setDarkTheme,
		resetConfig
	};
});
defineStore("audio", () => {
	const audioContext = ref(null);
	const isAudioInitialized = ref(false);
	const audioEnabled = ref(true);
	const volume = ref(.7);
	const analyserNode = ref(null);
	const isReady = computed(() => isAudioInitialized.value && audioEnabled.value);
	const initAudio = () => {
		if (audioContext.value) return audioContext.value;
		try {
			audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
			analyserNode.value = audioContext.value.createAnalyser();
			analyserNode.value.fftSize = 256;
			analyserNode.value.smoothingTimeConstant = .8;
			isAudioInitialized.value = true;
			return audioContext.value;
		} catch (e) {
			console.warn("[audioStore] Web Audio API 不可用:", e);
			return null;
		}
	};
	const setVolume = (vol) => {
		volume.value = Math.max(0, Math.min(1, vol));
	};
	const toggleAudio = () => {
		audioEnabled.value = !audioEnabled.value;
		if (audioEnabled.value && !audioContext.value) initAudio();
	};
	const cleanup = () => {
		if (audioContext.value) {
			audioContext.value.close();
			audioContext.value = null;
			analyserNode.value = null;
			isAudioInitialized.value = false;
		}
	};
	return {
		audioContext,
		isAudioInitialized,
		audioEnabled,
		volume,
		analyserNode,
		isReady,
		initAudio,
		setVolume,
		toggleAudio,
		cleanup
	};
});
//#endregion
//#region src/stores/dynamicEffects.ts
var useDynamicEffectsStore = defineStore("dynamicEffects", () => {
	const sakuraEnabled = ref(false);
	const snowflakeEnabled = ref(false);
	const isMounted = ref(false);
	const currentEffect = ref("none");
	const isEnabled = computed(() => sakuraEnabled.value || snowflakeEnabled.value);
	const toggleEffect = (effect) => {
		if (effect === "sakura") sakuraEnabled.value = !sakuraEnabled.value;
		else if (effect === "snowflake") snowflakeEnabled.value = !snowflakeEnabled.value;
		updateCurrentEffect();
	};
	const setEffect = (effect, enabled) => {
		if (effect === "sakura") sakuraEnabled.value = enabled;
		else if (effect === "snowflake") snowflakeEnabled.value = enabled;
		updateCurrentEffect();
	};
	const setAllEffects = (enabled) => {
		sakuraEnabled.value = enabled;
		snowflakeEnabled.value = enabled;
		updateCurrentEffect();
	};
	const updateCurrentEffect = () => {
		if (snowflakeEnabled.value) currentEffect.value = "snowflake";
		else if (sakuraEnabled.value) currentEffect.value = "sakura";
		else currentEffect.value = "none";
	};
	const setMounted = (mounted) => {
		isMounted.value = mounted;
	};
	return {
		sakuraEnabled,
		snowflakeEnabled,
		isMounted,
		currentEffect,
		isEnabled,
		toggleEffect,
		setEffect,
		setAllEffects,
		updateCurrentEffect,
		setMounted
	};
});
//#endregion
//#region src/stores/math.ts
var useMathStore = defineStore("math", () => {
	const katexLoaded = ref(false);
	const loading = ref(false);
	const error = ref(null);
	const renderedCount = ref(0);
	const autoRender = ref(true);
	const setKaTeXLoaded = (loaded) => {
		katexLoaded.value = loaded;
	};
	const setLoading = (isLoading) => {
		loading.value = isLoading;
	};
	const setError = (err) => {
		error.value = err;
	};
	const incrementRenderedCount = (count = 1) => {
		renderedCount.value += count;
	};
	const setAutoRender = (enabled) => {
		autoRender.value = enabled;
	};
	const resetError = () => {
		error.value = null;
	};
	const reset = () => {
		katexLoaded.value = false;
		loading.value = false;
		error.value = null;
		renderedCount.value = 0;
		autoRender.value = true;
	};
	return {
		katexLoaded,
		loading,
		error,
		renderedCount,
		autoRender,
		setKaTeXLoaded,
		setLoading,
		setError,
		incrementRenderedCount,
		setAutoRender,
		resetError,
		reset
	};
});
//#endregion
//#region src/stores/mermaid.ts
var useMermaidStore = defineStore("mermaid", () => {
	const mermaidLoaded = ref(false);
	const loading = ref(false);
	const error = ref(null);
	const renderedCount = ref(0);
	const theme = ref("default");
	const setMermaidLoaded = (loaded) => {
		mermaidLoaded.value = loaded;
	};
	const setLoading = (isLoading) => {
		loading.value = isLoading;
	};
	const setError = (err) => {
		error.value = err;
	};
	const incrementRenderedCount = (count = 1) => {
		renderedCount.value += count;
	};
	const setTheme = (themeName) => {
		theme.value = themeName;
	};
	const resetError = () => {
		error.value = null;
	};
	const reset = () => {
		mermaidLoaded.value = false;
		loading.value = false;
		error.value = null;
		renderedCount.value = 0;
		theme.value = "default";
	};
	return {
		mermaidLoaded,
		loading,
		error,
		renderedCount,
		theme,
		setMermaidLoaded,
		setLoading,
		setError,
		incrementRenderedCount,
		setTheme,
		resetError,
		reset
	};
});
//#endregion
//#region src/stores/code.ts
var useCodeStore = defineStore("code", () => {
	const prismLoaded = ref(false);
	const loadedLanguages = ref([]);
	const codeStats = ref({
		totalLines: 0,
		totalChars: 0,
		highlightCount: 0
	});
	const theme = ref("default");
	const lineNumbersEnabled = ref(true);
	const showLanguageBadge = ref(true);
	const copyEnabled = ref(true);
	const copyHistory = ref([]);
	const lastCopiedCode = ref("");
	const lastCopiedTime = ref(null);
	const copyCount = ref(0);
	const isCopying = ref(false);
	const copyError = ref(null);
	const isPrismLoaded = computed(() => prismLoaded.value);
	const hasLoadedLanguages = computed(() => loadedLanguages.value.length > 0);
	const totalHighlightCount = computed(() => codeStats.value.highlightCount);
	const hasCopyHistory = computed(() => copyHistory.value.length > 0);
	const recentCopies = computed(() => copyHistory.value.slice(0, 10));
	const totalCopyCount = computed(() => copyCount.value);
	const setPrismLoaded = (loaded) => {
		prismLoaded.value = loaded;
	};
	const addLoadedLanguage = (language) => {
		if (!loadedLanguages.value.includes(language)) loadedLanguages.value.push(language);
	};
	const incrementHighlightCount = () => {
		codeStats.value.highlightCount++;
	};
	const updateCodeStats = (lines, chars) => {
		codeStats.value.totalLines += lines;
		codeStats.value.totalChars += chars;
	};
	const setTheme = (newTheme) => {
		theme.value = newTheme;
	};
	const toggleLineNumbers = () => {
		lineNumbersEnabled.value = !lineNumbersEnabled.value;
	};
	const toggleLanguageBadge = () => {
		showLanguageBadge.value = !showLanguageBadge.value;
	};
	const toggleCopy = () => {
		copyEnabled.value = !copyEnabled.value;
	};
	const addToHistory = (code, success = true) => {
		const timestamp = (/* @__PURE__ */ new Date()).toISOString();
		if (success) {
			copyHistory.value.unshift({
				code: code.substring(0, 100),
				timestamp,
				success: true
			});
			if (copyHistory.value.length > 50) copyHistory.value.pop();
			lastCopiedCode.value = code;
			lastCopiedTime.value = timestamp;
			copyCount.value++;
		} else copyError.value = "复制失败";
	};
	const clearCopyHistory = () => {
		copyHistory.value = [];
		lastCopiedCode.value = "";
		lastCopiedTime.value = null;
	};
	const setCopying = (copying) => {
		isCopying.value = copying;
	};
	const setCopyError = (error) => {
		copyError.value = error;
	};
	const clearCopyError = () => {
		copyError.value = null;
	};
	const saveSettings = () => {
		if (typeof localStorage !== "undefined") try {
			localStorage.setItem("codeSettings", JSON.stringify({
				theme: theme.value,
				lineNumbersEnabled: lineNumbersEnabled.value,
				showLanguageBadge: showLanguageBadge.value,
				copyEnabled: copyEnabled.value
			}));
			localStorage.setItem("clipboardHistory", JSON.stringify({
				copyHistory: copyHistory.value,
				copyCount: copyCount.value
			}));
		} catch (error) {
			console.error("[codeStore] 保存设置失败:", error);
		}
	};
	const loadSettings = () => {
		if (typeof localStorage !== "undefined") try {
			const saved = localStorage.getItem("codeSettings");
			if (saved) {
				const data = JSON.parse(saved);
				theme.value = data.theme || "default";
				lineNumbersEnabled.value = data.lineNumbersEnabled !== false;
				showLanguageBadge.value = data.showLanguageBadge !== false;
				copyEnabled.value = data.copyEnabled !== false;
			}
			const savedClipboard = localStorage.getItem("clipboardHistory");
			if (savedClipboard) {
				const data = JSON.parse(savedClipboard);
				copyHistory.value = data.copyHistory || [];
				copyCount.value = data.copyCount || 0;
			}
		} catch (error) {
			console.error("[codeStore] 加载设置失败:", error);
		}
	};
	const init = () => {
		loadSettings();
	};
	return {
		prismLoaded,
		loadedLanguages,
		codeStats,
		theme,
		lineNumbersEnabled,
		showLanguageBadge,
		copyEnabled,
		copyHistory,
		lastCopiedCode,
		lastCopiedTime,
		copyCount,
		isCopying,
		copyError,
		isPrismLoaded,
		hasLoadedLanguages,
		totalHighlightCount,
		hasCopyHistory,
		recentCopies,
		totalCopyCount,
		setPrismLoaded,
		addLoadedLanguage,
		incrementHighlightCount,
		updateCodeStats,
		setTheme,
		toggleLineNumbers,
		toggleLanguageBadge,
		toggleCopy,
		addToHistory,
		clearCopyHistory,
		setCopying,
		setCopyError,
		clearCopyError,
		saveSettings,
		loadSettings,
		init
	};
});
defineStore("user", () => {
	const visitorCount = ref(0);
	const visitorCities = ref([]);
	const currentLocation = ref(null);
	const isLoadingLocation = ref(false);
	const incrementVisitorCount = () => {
		visitorCount.value++;
	};
	const addVisitorCity = (city, lat, lon) => {
		visitorCities.value.push({
			name: city,
			value: [lon, lat]
		});
	};
	const setCurrentLocation = (location) => {
		currentLocation.value = location;
	};
	const fetchUserLocation = async () => {
		if (isLoadingLocation.value) return null;
		isLoadingLocation.value = true;
		const apis = [{
			name: "ip-api.com",
			url: "https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon",
			parser: (data) => data.status === "success" ? {
				city: data.city,
				lat: data.lat,
				lon: data.lon
			} : null
		}, {
			name: "ipwho.is",
			url: "https://ipwho.is/",
			parser: (data) => data.ip ? {
				city: data.city,
				lat: data.latitude,
				lon: data.longitude
			} : null
		}];
		let locationData = null;
		for (const api of apis) {
			if (locationData) break;
			try {
				const response = await fetch(api.url);
				if (response.ok) {
					const data = await response.json();
					locationData = api.parser(data);
				}
			} catch (error) {
				console.warn(`[userStore] ${api.name} API 调用失败:`, error);
			}
		}
		if (locationData?.city) {
			incrementVisitorCount();
			addVisitorCity(locationData.city, locationData.lat, locationData.lon);
			setCurrentLocation(locationData);
		}
		isLoadingLocation.value = false;
		return locationData;
	};
	return {
		visitorCount,
		visitorCities,
		currentLocation,
		isLoadingLocation,
		incrementVisitorCount,
		addVisitorCity,
		setCurrentLocation,
		fetchUserLocation
	};
});
//#endregion
//#region src/stores/comment.ts
var GISCUS_CSS_BASE = "https://cnkrru.github.io/static";
function getGiscusThemeUrl() {
	const themeStore = useThemeStore();
	const isDark = themeStore.isDark;
	if (themeStore.currentStyle === "ink") return isDark ? `${GISCUS_CSS_BASE}/giscus-ink-dark.css` : `${GISCUS_CSS_BASE}/giscus-ink-light.css`;
	return isDark ? `${GISCUS_CSS_BASE}/giscus-sakura-dark.css` : `${GISCUS_CSS_BASE}/giscus-sakura-light.css`;
}
var useCommentStore = defineStore("comment", () => {
	const commentLoaded = ref(false);
	const commentEnabled = ref(true);
	const commentPlatform = ref("giscus");
	const commentCount = ref(0);
	const isExpanded = ref(false);
	const setCommentLoaded = (loaded) => {
		commentLoaded.value = loaded;
	};
	const toggleComments = () => {
		commentEnabled.value = !commentEnabled.value;
		savePreference();
	};
	const setCommentCount = (count) => {
		commentCount.value = count;
	};
	const incrementCommentCount = () => {
		commentCount.value++;
	};
	const toggleExpanded = () => {
		isExpanded.value = !isExpanded.value;
	};
	const updateGiscusTheme = (_theme) => {
		const themeUrl = getGiscusThemeUrl();
		const giscusFrame = document.querySelector("iframe.giscus-frame");
		if (giscusFrame?.contentWindow) giscusFrame.contentWindow.postMessage({ giscus: { setConfig: { theme: themeUrl } } }, "https://giscus.app");
	};
	const initCommentSystem = () => {
		if (typeof window === "undefined" || typeof document === "undefined") return;
		if (document.querySelector(".giscus, script[src*=\"giscus\"]")) return;
		const script = document.createElement("script");
		script.src = "https://giscus.app/client.js";
		script.setAttribute("data-repo", "Cnkrru/Blog");
		script.setAttribute("data-repo-id", "");
		script.setAttribute("data-category", "General");
		script.setAttribute("data-category-id", "");
		script.setAttribute("data-mapping", "pathname");
		script.setAttribute("data-strict", "0");
		script.setAttribute("data-reactions-enabled", "1");
		script.setAttribute("data-emit-metadata", "0");
		script.setAttribute("data-input-position", "bottom");
		script.setAttribute("data-theme", getGiscusThemeUrl());
		script.setAttribute("data-lang", "zh-CN");
		script.setAttribute("crossorigin", "anonymous");
		script.async = true;
		const container = document.querySelector(".comment-container");
		if (container) container.appendChild(script);
	};
	const savePreference = () => {
		if (typeof localStorage === "undefined") return;
		try {
			localStorage.setItem("comment_enabled", commentEnabled.value.toString());
		} catch (e) {
			console.warn("[commentStore] 保存评论偏好失败:", e);
		}
	};
	const loadPreference = () => {
		if (typeof localStorage === "undefined") return;
		try {
			const saved = localStorage.getItem("comment_enabled");
			if (saved !== null) commentEnabled.value = saved === "true";
		} catch (e) {
			console.warn("[commentStore] 加载评论偏好失败:", e);
		}
	};
	return {
		commentLoaded,
		commentEnabled,
		commentPlatform,
		commentCount,
		isExpanded,
		setCommentLoaded,
		toggleComments,
		setCommentCount,
		incrementCommentCount,
		toggleExpanded,
		initCommentSystem,
		updateGiscusTheme,
		savePreference,
		loadPreference
	};
});
//#endregion
//#region src/stores/global.ts
var useGlobalStore = defineStore("global", () => {
	const siteTitle = ref("Cnkrru's Blog");
	const siteDescription = ref("一个技术博客，记录学习与成长");
	const siteUrl = ref("https://www.moyublog.com");
	const siteKeywords = ref("");
	const socialLinks = ref([{
		name: "GitHub",
		url: "https://github.com/cnkrru",
		icon: "fa-brands fa-github"
	}, {
		name: "Mail",
		url: "mailto:admin@moyublog.com",
		icon: "fa-solid fa-envelope"
	}]);
	const notifications = ref([]);
	const fullTitle = computed(() => siteTitle.value);
	const siteInfo = computed(() => ({
		title: siteTitle.value,
		description: siteDescription.value,
		url: siteUrl.value
	}));
	const setSiteTitle = (title) => {
		siteTitle.value = title;
	};
	const setSiteDescription = (description) => {
		siteDescription.value = description;
	};
	const setSiteUrl = (url) => {
		siteUrl.value = url;
	};
	const setKeywords = (keywords) => {
		siteKeywords.value = keywords;
	};
	const addSocialLink = (link) => {
		socialLinks.value.push(link);
	};
	const removeSocialLink = (index) => {
		socialLinks.value.splice(index, 1);
	};
	const addNotification = (notification) => {
		notifications.value.push(notification);
		setTimeout(() => {
			removeNotification(notification.id);
		}, notification.duration || 5e3);
	};
	const removeNotification = (id) => {
		notifications.value = notifications.value.filter((n) => n.id !== id);
	};
	return {
		siteTitle,
		siteDescription,
		siteUrl,
		siteKeywords,
		socialLinks,
		notifications,
		fullTitle,
		siteInfo,
		setSiteTitle,
		setSiteDescription,
		setSiteUrl,
		setKeywords,
		addSocialLink,
		removeSocialLink,
		addNotification,
		removeNotification
	};
});
//#endregion
//#region src/stores/content.ts
var useContentStore = defineStore("content", () => {
	const contentCache = ref({
		post: {},
		project: {}
	});
	const loadingState = ref({});
	const errorState = ref({});
	const hasContent = computed(() => (type, id) => {
		return !!contentCache.value[type]?.[id];
	});
	const getContent = (type, id) => {
		return contentCache.value[type]?.[id] || null;
	};
	const setContent = (type, id, data) => {
		if (!contentCache.value[type]) contentCache.value[type] = {};
		contentCache.value[type][id] = data;
	};
	const setLoading = (type, id, value) => {
		if (!loadingState.value[type]) loadingState.value[type] = {};
		loadingState.value[type][id] = value;
	};
	const isLoading = (type, id) => {
		return loadingState.value[type]?.[id] || false;
	};
	const setError = (type, id, error) => {
		if (!errorState.value[type]) errorState.value[type] = {};
		errorState.value[type][id] = error;
	};
	const getError = (type, id) => {
		return errorState.value[type]?.[id] || null;
	};
	const clearCache = (type, id) => {
		if (type && id) {
			if (contentCache.value[type]) delete contentCache.value[type][id];
			if (loadingState.value[type]) delete loadingState.value[type][id];
			if (errorState.value[type]) delete errorState.value[type][id];
		} else if (type) {
			contentCache.value[type] = {};
			loadingState.value[type] = {};
			errorState.value[type] = {};
		} else {
			contentCache.value = {
				post: {},
				project: {}
			};
			loadingState.value = {};
			errorState.value = {};
		}
	};
	return {
		contentCache,
		loadingState,
		errorState,
		hasContent,
		getContent,
		setContent,
		setLoading,
		isLoading,
		setError,
		getError,
		clearCache
	};
});
//#endregion
//#region src/stores/articles.ts
/**
* 数据源 Store — 加载文章列表、获取 Markdown 文件、按标签/分类筛选
*/
var useArticlesStore = defineStore("articles", () => {
	const articles = ref([]);
	const isLoading = ref(false);
	const error = ref(null);
	const lastFetchTime = ref(0);
	const cacheDuration = 300 * 1e3;
	const mdModules = {
		.../* @__PURE__ */ Object.assign({
			"../../content/posts/post-0.md": () => import("./post-0-DxEDVYdP.js").then((m) => m["default"]),
			"../../content/posts/post-1.md": () => import("./post-1-OjB4dsdJ.js").then((m) => m["default"]),
			"../../content/posts/post-10.md": () => import("./post-10-DKPePuds.js").then((m) => m["default"]),
			"../../content/posts/post-11.md": () => import("./post-11-CTUfMFDF.js").then((m) => m["default"]),
			"../../content/posts/post-12.md": () => import("./post-12-CHw391-Y.js").then((m) => m["default"]),
			"../../content/posts/post-13.md": () => import("./post-13-DXiz3_Yx.js").then((m) => m["default"]),
			"../../content/posts/post-2.md": () => import("./post-2-B2IBZ1p8.js").then((m) => m["default"]),
			"../../content/posts/post-3.md": () => import("./post-3-DkAhA7xH.js").then((m) => m["default"]),
			"../../content/posts/post-4.md": () => import("./post-4-C4yTF8kZ.js").then((m) => m["default"]),
			"../../content/posts/post-5.md": () => import("./post-5-DoTblwXY.js").then((m) => m["default"]),
			"../../content/posts/post-6.md": () => import("./post-6-BLHJg0Kr.js").then((m) => m["default"]),
			"../../content/posts/post-7.md": () => import("./post-7-CuHOIJWd.js").then((m) => m["default"]),
			"../../content/posts/post-8.md": () => import("./post-8-B1xrz70w.js").then((m) => m["default"]),
			"../../content/posts/post-9.md": () => import("./post-9-C5e3BCCr.js").then((m) => m["default"])
		}),
		.../* @__PURE__ */ Object.assign({ "../../content/logs/changelog.md": () => import("./changelog-CEcyNo6W.js").then((m) => m["default"]) }),
		.../* @__PURE__ */ Object.assign({ "../../content/projects/project-0.md": () => import("./project-0-3IVklWZm.js").then((m) => m["default"]) })
	};
	const totalArticles = computed(() => articles.value.length);
	const latestArticles = computed(() => articles.value.slice(0, 5));
	const hasArticles = computed(() => articles.value.length > 0);
	const fetchArticles = async (force = false) => {
		const now = Date.now();
		if (!force && articles.value.length > 0 && now - lastFetchTime.value < cacheDuration) return articles.value;
		isLoading.value = true;
		error.value = null;
		try {
			const response = await fetch("/config/search.json");
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			articles.value = await response.json();
			lastFetchTime.value = now;
			return articles.value;
		} catch (err) {
			error.value = err.message || "Failed to load articles";
			return [];
		} finally {
			isLoading.value = false;
		}
	};
	const getArticleById = async (id) => {
		return (await fetchArticles()).find((article) => article.id === id) || null;
	};
	const getArticlesByTag = async (tag) => {
		return (await fetchArticles()).filter((article) => article.tags?.includes(tag));
	};
	const getArticlesByCategory = async (category) => {
		return (await fetchArticles()).filter((article) => article.category === category);
	};
	/**
	* 根据 id 加载对应 md 文件的原始内容
	* 文件命名规则：
	*   数字 id (0,1,2...)  -> content/posts/post-{id}.md
	*   字符串 id           -> content/posts/{id}.md
	*   changelog           -> content/logs/changelog.md
	*   project-N           -> content/projects/project-{N}.md
	*/
	const loadMarkdown = async (id) => {
		const candidates = [
			`../../content/posts/post-${id}.md`,
			`../../content/posts/${id}.md`,
			`../../content/projects/${id}.md`,
			`../../content/logs/${id}.md`
		];
		for (const path of candidates) if (mdModules[path]) try {
			return await mdModules[path]();
		} catch (err) {
			console.error(`[articlesStore] 加载文件失败 ${path}:`, err);
		}
		return null;
	};
	const clearArticles = () => {
		articles.value = [];
		lastFetchTime.value = 0;
	};
	return {
		articles,
		isLoading,
		error,
		lastFetchTime,
		cacheDuration,
		totalArticles,
		latestArticles,
		hasArticles,
		fetchArticles,
		getArticleById,
		getArticlesByTag,
		getArticlesByCategory,
		loadMarkdown,
		clearArticles
	};
});
//#endregion
//#region src/stores/music.ts
var SpatialAudioProcessor = class {
	audioContext;
	stereoPanner;
	gainNode;
	analyser;
	filters;
	bands;
	isSurroundEnabled;
	surroundSpeed;
	surroundPhase;
	animationId;
	constructor(audioContext) {
		this.audioContext = audioContext;
		this.stereoPanner = audioContext.createStereoPanner();
		this.gainNode = audioContext.createGain();
		this.analyser = audioContext.createAnalyser();
		this.filters = [];
		this.bands = 10;
		this.createFilters();
		for (let i = 0; i < this.bands; i++) if (i === 0) this.filters[i].connect(this.analyser);
		else this.filters[i].connect(this.filters[i - 1]);
		this.analyser.connect(this.stereoPanner);
		this.stereoPanner.connect(this.gainNode);
		this.gainNode.connect(audioContext.destination);
		this.isSurroundEnabled = false;
		this.surroundSpeed = .5;
		this.surroundPhase = 0;
		this.animationId = null;
	}
	createFilters() {
		for (let i = 0; i < this.bands; i++) {
			const filter = this.audioContext.createBiquadFilter();
			if (i === 0) filter.type = "lowshelf";
			else if (i === this.bands - 1) filter.type = "highshelf";
			else filter.type = "peaking";
			filter.frequency.value = 20 * Math.pow(2, i * .5);
			filter.Q.value = 1;
			filter.gain.value = 0;
			this.filters.push(filter);
		}
		this.analyser.fftSize = 256;
		this.analyser.smoothingTimeConstant = .8;
	}
	startSurroundAnimation() {
		if (this.animationId) return;
		const animate = () => {
			if (!this.isSurroundEnabled) return;
			const pan = Math.sin(this.surroundPhase);
			this.stereoPanner.pan.value = pan;
			this.surroundPhase += .05 * this.surroundSpeed;
			if (this.surroundPhase >= Math.PI * 2) this.surroundPhase = 0;
			this.animationId = requestAnimationFrame(animate);
		};
		animate();
	}
	stopSurroundAnimation() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		this.stereoPanner.pan.value = 0;
	}
	setSurroundMode(mode) {
		if (mode === "off") {
			this.isSurroundEnabled = false;
			this.stopSurroundAnimation();
		} else {
			this.isSurroundEnabled = true;
			switch (mode) {
				case "stereo":
					this.surroundSpeed = .3;
					break;
				case "3d":
					this.surroundSpeed = .5;
					break;
				case "concert":
					this.surroundSpeed = .8;
					break;
				case "church":
					this.surroundSpeed = .2;
					break;
				default: this.surroundSpeed = .5;
			}
			this.startSurroundAnimation();
		}
	}
	setEqPreset(preset) {
		const eqPresets = {
			flat: [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			bass: [
				6,
				5,
				4,
				2,
				0,
				0,
				0,
				0,
				0,
				0
			],
			treble: [
				0,
				0,
				0,
				0,
				0,
				2,
				4,
				5,
				6,
				6
			],
			pop: [
				-2,
				0,
				2,
				4,
				5,
				4,
				2,
				0,
				-2,
				-4
			],
			rock: [
				5,
				4,
				2,
				0,
				-2,
				-2,
				0,
				2,
				4,
				5
			],
			jazz: [
				4,
				3,
				1,
				2,
				-2,
				-2,
				0,
				1,
				3,
				4
			],
			classical: [
				5,
				4,
				3,
				2,
				0,
				0,
				0,
				2,
				3,
				5
			]
		};
		(eqPresets[preset] || eqPresets.flat).forEach((gain, i) => {
			if (this.filters[i]) this.filters[i].gain.value = gain;
		});
	}
	connect(source) {
		source.connect(this.filters[0]);
	}
	setVolume(volume) {
		this.gainNode.gain.value = volume;
	}
};
var isBrowser = typeof window !== "undefined";
var useMusicStore = defineStore("music", () => {
	const playlist = ref([]);
	const currentIndex = ref(0);
	const isPlaying = ref(false);
	const isPlayerVisible = ref(false);
	const isPlaylistVisible = ref(false);
	const volume = ref(.7);
	const isMuted = ref(false);
	const currentTime = ref(0);
	const duration = ref(0);
	const isLoading = ref(false);
	const effectsEnabled = ref(false);
	const surroundMode = ref("off");
	const eqPreset = ref("flat");
	let audio = null;
	let audioContext = null;
	let spatialProcessor = null;
	let saveStateInterval = null;
	const currentSong = computed(() => playlist.value[currentIndex.value] || null);
	const progressPercent = computed(() => {
		if (duration.value <= 0) return 0;
		return currentTime.value / duration.value * 100;
	});
	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};
	const savePlayerState = () => {
		if (!isBrowser || !audio) return;
		const state = {
			currentIndex: currentIndex.value,
			currentTime: audio.currentTime || 0,
			isPlaying: !audio.paused,
			volume: audio.volume,
			isMuted: audio.muted
		};
		try {
			localStorage.setItem("musicPlayerState", JSON.stringify(state));
		} catch (error) {}
	};
	const loadPlayerState = () => {
		if (!isBrowser) return {
			currentTime: 0,
			isPlaying: false
		};
		try {
			const savedState = localStorage.getItem("musicPlayerState");
			if (savedState) {
				const state = JSON.parse(savedState);
				currentIndex.value = state.currentIndex ?? 0;
				volume.value = state.volume ?? .7;
				isMuted.value = state.isMuted ?? false;
				return {
					currentTime: state.currentTime ?? 0,
					isPlaying: state.isPlaying ?? false
				};
			}
		} catch (error) {}
		return {
			currentTime: 0,
			isPlaying: false
		};
	};
	const loadSong = (index) => {
		const song = playlist.value[index];
		if (!song || !audio) return;
		isLoading.value = true;
		audio.crossOrigin = "anonymous";
		loadAudioWithFallback(song);
	};
	const applyEffects = ({ enabled, surroundMode: mode, eqPreset: preset }) => {
		effectsEnabled.value = enabled;
		surroundMode.value = mode;
		eqPreset.value = preset;
		if (!spatialProcessor) return;
		spatialProcessor.setEqPreset(preset);
		spatialProcessor.setSurroundMode(enabled ? mode : "off");
	};
	const initSpatialAudio = () => {
		if (!isBrowser) return;
		if (!audioContext && audio) {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			spatialProcessor = new SpatialAudioProcessor(audioContext);
			const source = audioContext.createMediaElementSource(audio);
			spatialProcessor.connect(source);
			spatialProcessor.setVolume(volume.value);
		}
	};
	const loadAudioWithFallback = (song) => {
		if (!audio) return;
		const audioPath = song.audio;
		const backupUrls = song.backupAudio || [];
		let currentBackupIndex = 0;
		const tryLoadUrl = (url) => {
			audio.src = url;
		};
		const handleError = () => {
			if (currentBackupIndex < backupUrls.length) {
				currentBackupIndex++;
				tryLoadUrl(backupUrls[currentBackupIndex - 1]);
			} else setTimeout(() => nextSong(), 1e3);
		};
		audio.onerror = handleError;
		tryLoadUrl(audioPath);
	};
	const togglePlay = () => {
		if (!audio) return;
		if (!spatialProcessor) initSpatialAudio();
		if (audioContext && audioContext.state === "suspended") audioContext.resume();
		if (audio.paused) audio.play().catch(() => {});
		else audio.pause();
		savePlayerState();
	};
	const prevSong = () => {
		if (playlist.value.length === 0) return;
		const wasPlaying = isPlaying.value;
		currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length;
		loadSong(currentIndex.value);
		if (wasPlaying && audio) audio.addEventListener("canplay", () => {
			audio?.play().catch(() => {});
		}, { once: true });
		savePlayerState();
	};
	const nextSong = () => {
		if (playlist.value.length === 0) return;
		const wasPlaying = isPlaying.value;
		currentIndex.value = (currentIndex.value + 1) % playlist.value.length;
		loadSong(currentIndex.value);
		if (wasPlaying && audio) audio.addEventListener("canplay", () => {
			audio?.play().catch(() => {});
		}, { once: true });
		savePlayerState();
	};
	const togglePlaylist = () => {
		isPlaylistVisible.value = !isPlaylistVisible.value;
	};
	const closePlaylist = () => {
		isPlaylistVisible.value = false;
	};
	const selectSong = (index) => {
		if (!audio) initializePlayer();
		if (index !== currentIndex.value) {
			const wasPlaying = isPlaying.value;
			currentIndex.value = index;
			loadSong(currentIndex.value);
			if (wasPlaying && audio) audio.addEventListener("canplay", () => {
				audio?.play().catch(() => {});
			}, { once: true });
			savePlayerState();
		} else if (audio?.paused) audio.play().catch(() => {});
		else if (audio) audio.pause();
	};
	const seek = (percent) => {
		if (!audio) return;
		audio.currentTime = percent * duration.value;
	};
	const setVolume = (percent) => {
		if (!audio) return;
		audio.volume = percent;
		volume.value = percent;
		if (percent === 0) {
			audio.muted = true;
			isMuted.value = true;
		} else {
			audio.muted = false;
			isMuted.value = false;
		}
		savePlayerState();
	};
	const toggleMute = () => {
		if (!audio) return;
		audio.muted = !audio.muted;
		isMuted.value = audio.muted;
		savePlayerState();
	};
	const initializePlayer = () => {
		if (!isBrowser || audio) return;
		audio = new Audio();
		audio.addEventListener("timeupdate", () => {
			if (audio) {
				currentTime.value = audio.currentTime || 0;
				duration.value = audio.duration || 0;
			}
		});
		audio.addEventListener("ended", () => nextSong());
		audio.addEventListener("loadedmetadata", () => {
			if (audio) duration.value = audio.duration || 0;
		});
		audio.addEventListener("play", () => {
			isPlaying.value = true;
		});
		audio.addEventListener("pause", () => {
			isPlaying.value = false;
		});
		audio.addEventListener("canplay", () => {
			isLoading.value = false;
		});
		const savedState = loadPlayerState();
		audio.volume = volume.value;
		audio.muted = isMuted.value;
		loadSong(currentIndex.value);
		if (savedState.currentTime > 0) audio.addEventListener("loadedmetadata", () => {
			if (audio) audio.currentTime = savedState.currentTime;
		}, { once: true });
		initSpatialAudio();
		saveStateInterval = setInterval(savePlayerState, 500);
	};
	const loadMusicConfig = async () => {
		try {
			const response = await fetch("/config/music.json");
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			playlist.value = (await response.json()).songs;
			initializePlayer();
		} catch (error) {
			console.error("[musicStore] 加载音乐配置失败:", error);
		}
	};
	const cleanup = () => {
		if (saveStateInterval) clearInterval(saveStateInterval);
		audio?.pause();
	};
	const getAudio = () => audio;
	const getAudioContext = () => audioContext;
	const getAnalyser = () => spatialProcessor?.analyser || null;
	const setPlayerVisible = (visible) => {
		isPlayerVisible.value = visible;
	};
	return {
		playlist,
		currentIndex,
		isPlaying,
		isPlayerVisible,
		isPlaylistVisible,
		volume,
		isMuted,
		currentTime,
		duration,
		isLoading,
		currentSong,
		progressPercent,
		effectsEnabled,
		surroundMode,
		eqPreset,
		formatTime,
		loadSong,
		togglePlay,
		prevSong,
		nextSong,
		togglePlaylist,
		closePlaylist,
		selectSong,
		seek,
		setVolume,
		toggleMute,
		loadMusicConfig,
		savePlayerState,
		cleanup,
		getAudio,
		getAudioContext,
		getAnalyser,
		applyEffects,
		setPlayerVisible
	};
});
//#endregion
//#region src/stores/announcement.ts
var useAnnouncementStore = defineStore("announcement", () => {
	const announcementContent = ref("");
	const loading = ref(true);
	const showModal = ref(false);
	const lastUpdated = ref(null);
	const controlAnnouncement = () => {
		showModal.value = !loading.value && !!announcementContent.value;
	};
	const openAnnouncement = () => {
		showModal.value = true;
	};
	const closeAnnouncement = () => {
		showModal.value = false;
	};
	const loadAnnouncement = async () => {
		try {
			announcementContent.value = (await import("./announcement-LdrPjciG.js")).default;
			lastUpdated.value = /* @__PURE__ */ new Date();
			loading.value = true;
		} catch (error) {
			console.error("[announcementStore] 加载公告失败:", error);
			announcementContent.value = "## 网站公告\n\n公告加载失败，请稍后再试。";
		} finally {
			loading.value = false;
		}
	};
	const checkForUpdates = async () => {
		if (lastUpdated.value) {
			const oneWeekAgo = /* @__PURE__ */ new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			if (lastUpdated.value < oneWeekAgo) {
				await loadAnnouncement();
				return true;
			}
		}
		return false;
	};
	return {
		showModal,
		announcementContent,
		loading,
		lastUpdated,
		controlAnnouncement,
		openAnnouncement,
		closeAnnouncement,
		loadAnnouncement,
		checkForUpdates
	};
});
//#endregion
//#region src/stores/index.ts
var pinia = createPinia();
//#endregion
export { useThemeStore as _, useContentStore as a, useCodeStore as c, useDynamicEffectsStore as d, useMouseStore as f, useScrollStore as g, useTagStore as h, useArticlesStore as i, useMermaidStore as l, useTocStore as m, useAnnouncementStore as n, useGlobalStore as o, useNotificationStore as p, useMusicStore as r, useCommentStore as s, pinia as t, useMathStore as u };
