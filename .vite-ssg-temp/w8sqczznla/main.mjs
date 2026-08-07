import { _ as useThemeStore, d as useDynamicEffectsStore, f as useMouseStore, i as useArticlesStore, o as useGlobalStore, p as useNotificationStore, r as useMusicStore, t as pinia } from "./assets/stores-CSCNxxdH.js";
import { t as _plugin_vue_export_helper_default } from "./assets/_plugin-vue_export-helper-DMwexRDj.js";
import { computed, createApp as createApp$1, createBlock, createTextVNode, createVNode, defineComponent, mergeProps, nextTick, onMounted, onUnmounted, openBlock, ref, resolveComponent, unref, useSSRContext, watch, withCtx } from "vue";
import { createHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrRenderStyle, ssrRenderTeleport } from "vue/server-renderer";
import { createMemoryHistory, createRouter, useRoute, useRouter } from "vue-router";
import { Analytics } from "@vercel/analytics/vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
//#region src/components/p-header/Logo.vue?vue&type=script&setup=true&lang.ts
var Logo_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Logo",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_router_link = resolveComponent("router-link");
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "logo-card" }, _attrs))} data-v-20c0a55e>`);
			_push(ssrRenderComponent(_component_router_link, { to: "/" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h1 data-v-20c0a55e${_scopeId}>Cnkrru</h1>`);
					else return [createVNode("h1", null, "Cnkrru")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/Logo.vue
var _sfc_setup$32 = Logo_vue_vue_type_script_setup_true_lang_default.setup;
Logo_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/Logo.vue");
	return _sfc_setup$32 ? _sfc_setup$32(props, ctx) : void 0;
};
var Logo_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Logo_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-20c0a55e"]]);
//#endregion
//#region src/components/p-header/ThemeToggle.vue?vue&type=script&setup=true&lang.ts
var ThemeToggle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ThemeToggle",
	__ssrInlineRender: true,
	setup(__props) {
		const themeStore = useThemeStore();
		const isDarkTheme = computed(() => themeStore.isDark);
		const isAnimating = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: ["button-style theme-toggle-btn", { animating: isAnimating.value }],
				title: "切换主题",
				"aria-label": isDarkTheme.value ? "切换到亮色主题" : "切换到暗色主题",
				role: "button",
				tabindex: "0"
			}, _attrs))} data-v-89717897><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moon-sun" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-89717897><path stroke="none" d="M0 0h24v24H0z" fill="none" data-v-89717897></path><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-v-89717897></path><path d="M12 9v4l3 3" data-v-89717897></path></svg>`);
			if (isAnimating.value) _push(`<span class="emoji-burst" data-v-89717897>✨</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/ThemeToggle.vue
var _sfc_setup$31 = ThemeToggle_vue_vue_type_script_setup_true_lang_default.setup;
ThemeToggle_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/ThemeToggle.vue");
	return _sfc_setup$31 ? _sfc_setup$31(props, ctx) : void 0;
};
var ThemeToggle_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ThemeToggle_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-89717897"]]);
//#endregion
//#region src/components/p-header/ImmersiveReading.vue?vue&type=script&setup=true&lang.ts
var ImmersiveReading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ImmersiveReading",
	__ssrInlineRender: true,
	setup(__props) {
		ref(false);
		const router = useRouter();
		onMounted(() => {
			router.afterEach(() => {
				document.body.classList.remove("immersive-reading");
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "button-style immersive-btn",
				title: "沉浸式阅读"
			}, _attrs))}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>`);
			if (_ctx.isAnimating) _push(`<span class="emoji-burst">✨</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/ImmersiveReading.vue
var _sfc_setup$30 = ImmersiveReading_vue_vue_type_script_setup_true_lang_default.setup;
ImmersiveReading_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/ImmersiveReading.vue");
	return _sfc_setup$30 ? _sfc_setup$30(props, ctx) : void 0;
};
var ImmersiveReading_default = ImmersiveReading_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/p-header/ReadingProgress.vue?vue&type=script&setup=true&lang.ts
var ReadingProgress_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ReadingProgress",
	__ssrInlineRender: true,
	setup(__props) {
		const router = useRouter();
		const progress = ref(0);
		let targetElement = null;
		let observer = null;
		let cachedContentCard = null;
		const findContentCard = () => {
			if (cachedContentCard?.isConnected) return cachedContentCard;
			cachedContentCard = document.querySelector(".center-card-content");
			return cachedContentCard;
		};
		const handleScroll = () => {
			if (targetElement) {
				const scrollTop = targetElement.scrollTop;
				const maxScroll = targetElement.scrollHeight - targetElement.clientHeight;
				progress.value = maxScroll > 0 ? Math.min(scrollTop / maxScroll * 100, 100) : 0;
			} else {
				const scrollTop = window.scrollY;
				const docHeight = document.documentElement.scrollHeight - window.innerHeight;
				progress.value = docHeight > 0 ? Math.min(scrollTop / docHeight * 100, 100) : 0;
			}
		};
		const bindScroll = (el) => {
			if (targetElement) targetElement.removeEventListener("scroll", handleScroll);
			if (observer) {
				observer.disconnect();
				observer = null;
			}
			targetElement = el;
			if (targetElement) {
				targetElement.addEventListener("scroll", handleScroll, { passive: true });
				observer = new ResizeObserver(() => handleScroll());
				observer.observe(targetElement);
			}
			handleScroll();
		};
		const refreshTarget = () => {
			cachedContentCard = null;
			bindScroll(findContentCard());
		};
		const handleRouteChange = () => {
			setTimeout(refreshTarget, 100);
		};
		let removeRouteGuard = null;
		onMounted(() => {
			refreshTarget();
			window.addEventListener("resize", handleScroll);
			removeRouteGuard = router.afterEach(handleRouteChange);
		});
		onUnmounted(() => {
			if (targetElement) targetElement.removeEventListener("scroll", handleScroll);
			if (observer) observer.disconnect();
			window.removeEventListener("resize", handleScroll);
			if (removeRouteGuard) removeRouteGuard();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "reading-progress-container" }, _attrs))} data-v-aff5ec03><div class="reading-progress-bar" style="${ssrRenderStyle({ width: `${progress.value}%` })}" data-v-aff5ec03></div></div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/ReadingProgress.vue
var _sfc_setup$29 = ReadingProgress_vue_vue_type_script_setup_true_lang_default.setup;
ReadingProgress_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/ReadingProgress.vue");
	return _sfc_setup$29 ? _sfc_setup$29(props, ctx) : void 0;
};
var ReadingProgress_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ReadingProgress_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-aff5ec03"]]);
//#endregion
//#region src/utils/algorithms.ts
/**
* Elasticsearch-like 搜索评分器
* 将Elasticsearch的搜索算法思想应用到前端
*/
var ElasticsearchLikeScorer = class {
	constructor() {
		this.fieldWeights = {
			title: 3,
			tags: 2,
			category: 1.5,
			description: 1
		};
		this.bm25Params = {
			k1: 1.2,
			b: .75,
			avgFieldLengths: /* @__PURE__ */ new Map()
		};
		this.invertedIndex = /* @__PURE__ */ new Map();
		this.fieldLengths = /* @__PURE__ */ new Map();
		this.totalDocs = 0;
		this.fieldDocFreq = /* @__PURE__ */ new Map();
	}
	buildInvertedIndex(documents) {
		this.totalDocs = documents.length;
		documents.forEach((doc) => {
			const docId = doc.id;
			this.fieldLengths.set(docId, {});
			Object.keys(this.fieldWeights).forEach((field) => {
				if (doc[field]) {
					const terms = this.tokenizeField(doc[field], field);
					const fieldLength = terms.length;
					this.fieldLengths.get(docId)[field] = fieldLength;
					this.updateAvgFieldLength(field, fieldLength);
					terms.forEach((term) => {
						if (!this.invertedIndex.has(term)) this.invertedIndex.set(term, /* @__PURE__ */ new Map());
						const termDocs = this.invertedIndex.get(term);
						if (!termDocs.has(docId)) termDocs.set(docId, {});
						if (!termDocs.get(docId)[field]) termDocs.get(docId)[field] = 0;
						termDocs.get(docId)[field]++;
						this.updateDocumentFrequency(term, field, docId);
					});
				}
			});
		});
		console.log(`倒排索引构建完成，文档数: ${this.totalDocs}，术语数: ${this.invertedIndex.size}`);
	}
	tokenizeField(text, field) {
		if (field === "tags" && Array.isArray(text)) return text.map((tag) => tag.toLowerCase());
		const textStr = text.toString().toLowerCase();
		if (/[\u4e00-\u9fa5]/.test(textStr)) {
			const chars = textStr.split("").filter((char) => /[\u4e00-\u9fa5]/.test(char));
			const words = [];
			chars.forEach((char) => {
				if (char.length > 0) words.push(char);
			});
			let currentPhrase = "";
			for (let i = 0; i < textStr.length; i++) {
				const char = textStr[i];
				if (/[\u4e00-\u9fa5]/.test(char)) currentPhrase += char;
				else {
					if (currentPhrase.length > 1) words.push(currentPhrase);
					currentPhrase = "";
				}
			}
			if (currentPhrase.length > 1) words.push(currentPhrase);
			return words;
		} else return textStr.split(/[\s\-\_]+/).filter((word) => word.length > 1);
	}
	updateAvgFieldLength(field, length) {
		if (!this.bm25Params.avgFieldLengths.has(field)) this.bm25Params.avgFieldLengths.set(field, {
			sum: 0,
			count: 0
		});
		const stats = this.bm25Params.avgFieldLengths.get(field);
		stats.sum += length;
		stats.count++;
	}
	updateDocumentFrequency(term, field, docId) {
		`${field}${term}`;
		if (!this.fieldDocFreq.has(field)) this.fieldDocFreq.set(field, /* @__PURE__ */ new Map());
		const termMap = this.fieldDocFreq.get(field);
		if (!termMap.has(term)) termMap.set(term, /* @__PURE__ */ new Set());
		termMap.get(term).add(docId);
	}
	calculateDocumentFrequency(term, field) {
		const termMap = this.fieldDocFreq.get(field);
		if (!termMap || !termMap.has(term)) return 0;
		return termMap.get(term).size;
	}
	score(docId, queryTerms) {
		let totalScore = 0;
		queryTerms.forEach(({ term, weight }) => {
			const termDocs = this.invertedIndex.get(term);
			if (!termDocs || !termDocs.has(docId)) return;
			const docStats = termDocs.get(docId);
			const docLengths = this.fieldLengths.get(docId);
			Object.keys(docStats).forEach((field) => {
				const tf = docStats[field];
				const fieldLength = docLengths[field] || 1;
				const avgStats = this.bm25Params.avgFieldLengths.get(field);
				const avgFieldLength = avgStats ? avgStats.sum / avgStats.count : 1;
				const fieldWeight = this.fieldWeights[field] || 1;
				const df = this.calculateDocumentFrequency(term, field);
				const idf = Math.log((this.totalDocs - df + .5) / (df + .5) + 1);
				const numerator = tf * (this.bm25Params.k1 + 1);
				const denominator = tf + this.bm25Params.k1 * (1 - this.bm25Params.b + this.bm25Params.b * (fieldLength / avgFieldLength));
				totalScore += fieldWeight * weight * idf * (numerator / denominator);
			});
		});
		return totalScore;
	}
	search(query, documents, limit = 20) {
		const queryTerms = this.tokenizeField(query, "query").map((term) => ({
			term,
			weight: 1
		}));
		return documents.map((doc) => {
			return {
				doc,
				score: this.score(doc.id, queryTerms)
			};
		}).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((item) => item.doc);
	}
	getIndexStats() {
		let totalTerms = 0;
		this.invertedIndex.forEach((docs) => {
			totalTerms += docs.size;
		});
		return {
			totalDocs: this.totalDocs,
			totalTerms: this.invertedIndex.size,
			avgTermsPerDoc: totalTerms / this.totalDocs,
			fieldWeights: this.fieldWeights,
			avgFieldLengths: Object.fromEntries(this.bm25Params.avgFieldLengths)
		};
	}
};
//#endregion
//#region src/utils/cache.ts
/**
* Redis-like 智能缓存类
* 应用后端Redis缓存思想的前端实现
*/
var RedisLikeCache = class {
	constructor(options = {}) {
		this.memoryCache = /* @__PURE__ */ new Map();
		this.localStorageCache = {
			get: (key) => {
				try {
					const item = localStorage.getItem(`cache_${key}`);
					if (item) {
						const { value, expiry } = JSON.parse(item);
						if (expiry && Date.now() > expiry) {
							localStorage.removeItem(`cache_${key}`);
							return null;
						}
						return value;
					}
				} catch (e) {}
				return null;
			},
			set: (key, value, ttl) => {
				try {
					const item = {
						value,
						expiry: ttl ? Date.now() + ttl * 1e3 : null
					};
					localStorage.setItem(`cache_${key}`, JSON.stringify(item));
				} catch (e) {}
			}
		};
		this.stats = {
			hits: {
				memory: 0,
				storage: 0
			},
			misses: 0,
			evictions: 0,
			size: {
				memory: 0,
				storage: 0
			}
		};
		this.warmupQueue = /* @__PURE__ */ new Set();
		this.options = {
			memoryCapacity: options.memoryCapacity || 100,
			storageCapacity: options.storageCapacity || 500,
			defaultTTL: options.defaultTTL || 300,
			...options
		};
	}
	/**
	* 智能获取（先内存，后localStorage）
	* @param {string} key - 缓存键
	* @returns {any|null} 缓存值或null
	*/
	get(key) {
		if (this.memoryCache.has(key)) {
			this.stats.hits.memory++;
			return this.memoryCache.get(key);
		}
		const storageValue = this.localStorageCache.get(key);
		if (storageValue !== null) {
			this.stats.hits.storage++;
			this.memoryCache.set(key, storageValue);
			return storageValue;
		}
		this.stats.misses++;
		return null;
	}
	/**
	* 智能设置（设置到两级缓存）
	* @param {string} key - 缓存键
	* @param {any} value - 缓存值
	* @param {object} options - 配置选项
	*/
	set(key, value, options = {}) {
		const { ttl = this.options.defaultTTL, priority = "normal", persist = priority === "high" || priority === "critical" } = options;
		this.memoryCache.set(key, value);
		this.stats.size.memory = this.memoryCache.size;
		if (persist) {
			this.localStorageCache.set(key, value, ttl);
			this.updateStorageSize();
		}
		if (this.memoryCache.size > this.options.memoryCapacity) this.evictByPriority();
		return true;
	}
	/**
	* 智能淘汰策略（类似Redis淘汰策略）
	*/
	evictByPriority() {
		const keyScores = /* @__PURE__ */ new Map();
		const now = Date.now();
		this.memoryCache.forEach((value, key) => {
			const accessHistory = this.getAccessHistory(key) || [];
			const lastAccess = accessHistory[accessHistory.length - 1] || now;
			const freqScore = Math.min(accessHistory.length / 10, 1) * .6;
			const freshnessScore = Math.max(0, 1 - (now - lastAccess) / (1440 * 60 * 1e3)) * .4;
			keyScores.set(key, freqScore + freshnessScore);
		});
		const sortedKeys = Array.from(keyScores.entries()).sort((a, b) => a[1] - b[1]);
		const evictCount = Math.ceil(this.memoryCache.size * .1);
		for (let i = 0; i < evictCount; i++) {
			const [key] = sortedKeys[i];
			this.memoryCache.delete(key);
			this.stats.evictions++;
		}
		this.stats.size.memory = this.memoryCache.size;
	}
	/**
	* 获取访问历史（模拟）
	*/
	getAccessHistory(key) {
		try {
			const history = localStorage.getItem(`cache_history_${key}`);
			return history ? JSON.parse(history) : [];
		} catch (e) {
			return [];
		}
	}
	/**
	* 记录访问历史
	*/
	recordAccess(key) {
		try {
			const history = this.getAccessHistory(key);
			history.push(Date.now());
			if (history.length > 100) history.shift();
			localStorage.setItem(`cache_history_${key}`, JSON.stringify(history));
		} catch (e) {}
	}
	/**
	* 更新存储大小统计
	*/
	updateStorageSize() {
		try {
			let count = 0;
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith("cache_")) count++;
			}
			this.stats.size.storage = count;
		} catch (e) {
			this.stats.size.storage = 0;
		}
	}
	/**
	* 缓存预热（应用启动时预加载）
	* @param {Array} preloadData - 预加载数据 [{key, value, options}]
	* @returns {Promise} 预热完成Promise
	*/
	async warmup(preloadData) {
		console.log("开始缓存预热...");
		const batchSize = 10;
		const promises = [];
		for (let i = 0; i < preloadData.length; i += batchSize) {
			const batch = preloadData.slice(i, i + batchSize);
			const promise = new Promise((resolve) => {
				if ("requestIdleCallback" in window) requestIdleCallback(() => {
					batch.forEach(({ key, value, options = {} }) => {
						this.set(key, value, {
							priority: "high",
							ttl: 3600,
							...options
						});
					});
					resolve();
				});
				else setTimeout(() => {
					batch.forEach(({ key, value, options = {} }) => {
						this.set(key, value, {
							priority: "high",
							ttl: 3600,
							...options
						});
					});
					resolve();
				}, 0);
			});
			promises.push(promise);
		}
		await Promise.all(promises);
		console.log("缓存预热完成，预热了", preloadData.length, "个项目");
		return this.getStats();
	}
	/**
	* 清除所有缓存
	*/
	clear() {
		this.memoryCache.clear();
		try {
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && (key.startsWith("cache_") || key.startsWith("cache_history_"))) keysToRemove.push(key);
			}
			keysToRemove.forEach((key) => localStorage.removeItem(key));
		} catch (e) {}
		this.stats = {
			hits: {
				memory: 0,
				storage: 0
			},
			misses: 0,
			evictions: 0,
			size: {
				memory: 0,
				storage: 0
			}
		};
		return true;
	}
	/**
	* 获取缓存统计信息（类似Redis INFO）
	* @returns {object} 统计信息
	*/
	getStats() {
		const totalHits = this.stats.hits.memory + this.stats.hits.storage;
		const totalAccesses = totalHits + this.stats.misses;
		const hitRate = totalAccesses > 0 ? (totalHits / totalAccesses * 100).toFixed(2) : 0;
		return {
			memory: {
				size: this.stats.size.memory,
				capacity: this.options.memoryCapacity,
				hits: this.stats.hits.memory
			},
			storage: {
				size: this.stats.size.storage,
				capacity: this.options.storageCapacity,
				hits: this.stats.hits.storage
			},
			overall: {
				hits: totalHits,
				misses: this.stats.misses,
				evictions: this.stats.evictions,
				hitRate: `${hitRate}%`,
				totalAccesses
			}
		};
	}
	/**
	* 获取缓存键列表（类似Redis KEYS）
	* @param {string} pattern - 匹配模式
	* @returns {Array} 匹配的键列表
	*/
	keys(pattern = "*") {
		const keys = [];
		this.memoryCache.forEach((value, key) => {
			if (this.matchPattern(key, pattern)) keys.push(key);
		});
		try {
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith("cache_")) {
					const cacheKey = key.replace("cache_", "");
					if (this.matchPattern(cacheKey, pattern)) keys.push(cacheKey);
				}
			}
		} catch (e) {}
		return [...new Set(keys)];
	}
	/**
	* 模式匹配
	*/
	matchPattern(key, pattern) {
		if (pattern === "*") return true;
		const regexPattern = pattern.replace(/\*/g, ".*").replace(/\?/g, ".");
		try {
			return new RegExp(`^${regexPattern}$`).test(key);
		} catch (e) {
			return key.includes(pattern);
		}
	}
};
//#endregion
//#region src/utils/helpers.ts
var escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|\[\]\\]/g, "\\$&");
};
var escapeHtml = (text) => {
	if (!text) return "";
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#039;"
	};
	return text.replace(/[&<>'"]/g, (m) => map[m]);
};
var highlightMatch = (text, query) => {
	if (!text || !query) return escapeHtml(text);
	const escapedQuery = escapeRegex(query);
	const regex = new RegExp(`(${escapedQuery})`, "gi");
	return escapeHtml(text).replace(regex, "<mark style=\"background-color: rgba(255, 192, 203, 0.3); color: var(--common-color-1); padding: 0 2px; border-radius: 2px;\">$1</mark>");
};
//#endregion
//#region src/components/p-header/SearchResults.vue?vue&type=script&setup=true&lang.ts
var SearchResults_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SearchResults",
	__ssrInlineRender: true,
	props: {
		searchText: {},
		results: {},
		show: { type: Boolean }
	},
	emits: ["result-click"],
	setup(__props, { emit: __emit }) {
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.show) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "search-results" }, _attrs))} data-v-252289d5>`);
				if (__props.results.length === 0) _push(`<div class="search-empty" data-v-252289d5> 搜索: &quot;${ssrInterpolate(unref(escapeHtml)(__props.searchText))}&quot; - 未找到结果 </div>`);
				else {
					_push(`<!--[--><div class="search-counter" data-v-252289d5>${ssrInterpolate(__props.results.length)} 个结果 </div><!--[-->`);
					ssrRenderList(__props.results, (item) => {
						_push(`<div class="search-result-item" data-v-252289d5><div class="result-title" data-v-252289d5>${unref(highlightMatch)(unref(escapeHtml)(item.title), __props.searchText) ?? ""}</div><div class="result-meta" data-v-252289d5> 分类: <span data-v-252289d5>${unref(highlightMatch)(unref(escapeHtml)(item.category || ""), __props.searchText) ?? ""}</span> | ID: <span data-v-252289d5>${unref(highlightMatch)(unref(escapeHtml)(item.id), __props.searchText) ?? ""}</span></div>`);
						if (item.tags && item.tags.length > 0) {
							_push(`<div class="result-tags" data-v-252289d5><!--[-->`);
							ssrRenderList(item.tags, (tag) => {
								_push(`<span class="tag" data-v-252289d5>${ssrInterpolate(tag)}</span>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					});
					_push(`<!--]--><!--]-->`);
				}
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region src/components/p-header/SearchResults.vue
var _sfc_setup$28 = SearchResults_vue_vue_type_script_setup_true_lang_default.setup;
SearchResults_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/SearchResults.vue");
	return _sfc_setup$28 ? _sfc_setup$28(props, ctx) : void 0;
};
var SearchResults_default = /* @__PURE__ */ _plugin_vue_export_helper_default(SearchResults_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-252289d5"]]);
//#endregion
//#region src/components/p-header/Search.vue?vue&type=script&setup=true&lang.ts
var Search_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Search",
	__ssrInlineRender: true,
	setup(__props) {
		const searchText = ref("");
		const searchResults = ref([]);
		const showResults = ref(false);
		const router = useRouter();
		const store = useArticlesStore();
		const searchData = ref([]);
		let searchIndex = null;
		const searchCache = new RedisLikeCache({
			memoryCapacity: 50,
			storageCapacity: 200,
			defaultTTL: 600
		});
		onMounted(async () => {
			console.log("开始加载搜索数据");
			try {
				searchData.value = (await store.fetchArticles()).filter((item) => item.id !== "terminal" && item.id !== "changelog");
				searchIndex = new ElasticsearchLikeScorer();
				searchIndex.buildInvertedIndex(searchData.value);
				const cacheWarmupData = searchData.value.map((doc) => ({
					key: `article_${doc.id}`,
					value: doc,
					options: {
						priority: "high",
						ttl: 3600
					}
				}));
				await searchCache.warmup(cacheWarmupData);
			} catch (error) {
				console.error("加载搜索数据失败:", error);
				searchData.value = [];
			}
		});
		watch(searchText, (newValue) => {
			const query = newValue.trim();
			if (query.length === 0) {
				searchResults.value = [];
				showResults.value = false;
				return;
			}
			performSearch(query);
		});
		const performSearch = (query) => {
			if (!searchIndex || searchData.value.length === 0) {
				console.warn("搜索索引未初始化");
				return;
			}
			const startTime = performance.now();
			const cacheKey = `search_${query}`;
			const cachedResults = searchCache.get(cacheKey);
			if (cachedResults) {
				searchResults.value = cachedResults;
				showResults.value = cachedResults.length > 0;
				searchCache.recordAccess(cacheKey);
			} else {
				const results = searchIndex.search(query, searchData.value, 20);
				searchResults.value = results;
				showResults.value = results.length > 0;
				if (results.length > 0) searchCache.set(cacheKey, results, {
					ttl: 300,
					priority: "normal"
				});
			}
			const duration = performance.now() - startTime;
			if (typeof window !== "undefined" && window.globalMonitor && typeof window.globalMonitor.recordMetric === "function") try {
				window.globalMonitor.recordMetric("search", duration, {
					timestamp: Date.now(),
					cacheHit: cachedResults ? 1 : 0,
					resultCount: searchResults.value.length,
					query
				});
			} catch (e) {}
			console.log(`搜索完成: "${query}" - 结果: ${searchResults.value.length} - 耗时: ${duration.toFixed(2)}ms`);
		};
		const handleResultClick = (item) => {
			router.push(`/post/${item.id}`);
			searchText.value = "";
			showResults.value = false;
		};
		const handleClickOutside = (e) => {
			if (!e.target.closest(".search-container")) showResults.value = false;
		};
		onMounted(() => {
			if (typeof document !== "undefined") document.addEventListener("click", handleClickOutside);
		});
		onUnmounted(() => {
			if (typeof document !== "undefined") document.removeEventListener("click", handleClickOutside);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "search-card search-container" }, _attrs))} data-v-7cfee9d8><span class="search-icon" data-v-7cfee9d8><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-7cfee9d8><circle cx="11" cy="11" r="8" data-v-7cfee9d8></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-7cfee9d8></line></svg></span><input type="text" placeholder="搜索"${ssrRenderAttr("value", searchText.value)} data-v-7cfee9d8>`);
			_push(ssrRenderComponent(SearchResults_default, {
				"search-text": searchText.value,
				results: searchResults.value,
				show: showResults.value,
				onResultClick: handleResultClick
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/Search.vue
var _sfc_setup$27 = Search_vue_vue_type_script_setup_true_lang_default.setup;
Search_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/Search.vue");
	return _sfc_setup$27 ? _sfc_setup$27(props, ctx) : void 0;
};
var Search_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Search_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7cfee9d8"]]);
//#endregion
//#region src/components/media/PlayerControls.vue?vue&type=script&setup=true&lang.ts
var PlayerControls_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PlayerControls",
	__ssrInlineRender: true,
	props: {
		isPlaying: {
			type: Boolean,
			default: false
		},
		currentSong: { default: null }
	},
	emits: [
		"toggle-play",
		"prev",
		"next"
	],
	setup(__props, { emit: __emit }) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "player-controls" }, _attrs))}><button type="button" class="control-btn" aria-label="上一首" title="上一首"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon></svg></button><button type="button" class="${ssrRenderClass([{ playing: __props.isPlaying }, "control-btn play-btn"])}" aria-label="播放" title="播放/暂停"><svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg></button><button type="button" class="control-btn" aria-label="下一首" title="下一首"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon></svg></button></div>`);
		};
	}
});
//#endregion
//#region src/components/media/PlayerControls.vue
var _sfc_setup$26 = PlayerControls_vue_vue_type_script_setup_true_lang_default.setup;
PlayerControls_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerControls.vue");
	return _sfc_setup$26 ? _sfc_setup$26(props, ctx) : void 0;
};
var PlayerControls_default = PlayerControls_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/media/PlayerProgress.vue?vue&type=script&setup=true&lang.ts
var PlayerProgress_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PlayerProgress",
	__ssrInlineRender: true,
	props: {
		currentTime: { default: 0 },
		duration: { default: 0 },
		progressPercent: { default: 0 }
	},
	emits: ["seek"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const progressBarRef = ref(null);
		let isDragging = false;
		const onMouseMove = (e) => {
			if (!isDragging || !progressBarRef.value) return;
			const rect = progressBarRef.value.getBoundingClientRect();
			emit("seek", Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
		};
		const onMouseUp = () => {
			isDragging = false;
		};
		watch(() => props.progressPercent, (val) => {
			const fill = document.getElementById("progress-fill");
			if (fill) fill.style.width = `${val}%`;
		});
		watch(() => props.currentTime, (val) => {
			const el = document.getElementById("current-time");
			if (el) {
				const minutes = Math.floor(val / 60);
				const seconds = Math.floor(val % 60);
				el.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
			}
		});
		watch(() => props.duration, (val) => {
			const el = document.getElementById("total-time");
			if (el) {
				const minutes = Math.floor(val / 60);
				const seconds = Math.floor(val % 60);
				el.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
			}
		});
		onMounted(() => {
			if (typeof document !== "undefined") {
				document.addEventListener("mousemove", onMouseMove);
				document.addEventListener("mouseup", onMouseUp);
			}
		});
		onUnmounted(() => {
			if (typeof document !== "undefined") {
				document.removeEventListener("mousemove", onMouseMove);
				document.removeEventListener("mouseup", onMouseUp);
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "player-progress" }, _attrs))}><div class="progress-bar"><div id="progress-fill" class="progress-fill" style="${ssrRenderStyle({ width: `${__props.progressPercent}%` })}"></div></div><div class="time-display"><span id="current-time">${ssrInterpolate(Math.floor(__props.currentTime / 60))}:${ssrInterpolate(String(Math.floor(__props.currentTime % 60)).padStart(2, "0"))}</span><span id="total-time">${ssrInterpolate(Math.floor(__props.duration / 60))}:${ssrInterpolate(String(Math.floor(__props.duration % 60)).padStart(2, "0"))}</span></div></div>`);
		};
	}
});
//#endregion
//#region src/components/media/PlayerProgress.vue
var _sfc_setup$25 = PlayerProgress_vue_vue_type_script_setup_true_lang_default.setup;
PlayerProgress_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerProgress.vue");
	return _sfc_setup$25 ? _sfc_setup$25(props, ctx) : void 0;
};
var PlayerProgress_default = PlayerProgress_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/media/PlayerVolume.vue?vue&type=script&setup=true&lang.ts
var PlayerVolume_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PlayerVolume",
	__ssrInlineRender: true,
	props: {
		volume: { default: .7 },
		isMuted: {
			type: Boolean,
			default: false
		}
	},
	emits: ["adjust-volume", "toggle-mute"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const volumeBarRef = ref(null);
		let isDraggingVolume = false;
		const onMouseMoveVolume = (e) => {
			if (!isDraggingVolume || !volumeBarRef.value) return;
			const rect = volumeBarRef.value.getBoundingClientRect();
			emit("adjust-volume", Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
		};
		const onMouseUpVolume = () => {
			isDraggingVolume = false;
		};
		watch(() => props.volume, (val) => {
			const fill = document.getElementById("volume-fill");
			if (fill) fill.style.width = `${val * 100}%`;
		});
		watch(() => props.isMuted, (muted) => {
			const btn = document.getElementById("player-volume-btn");
			if (btn) btn.classList.toggle("muted", muted);
		});
		onMounted(() => {
			if (typeof document !== "undefined") {
				document.addEventListener("mousemove", onMouseMoveVolume);
				document.addEventListener("mouseup", onMouseUpVolume);
			}
		});
		onUnmounted(() => {
			if (typeof document !== "undefined") {
				document.removeEventListener("mousemove", onMouseMoveVolume);
				document.removeEventListener("mouseup", onMouseUpVolume);
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "player-volume" }, _attrs))}><button type="button" id="player-volume-btn" class="${ssrRenderClass([{ muted: __props.isMuted }, "control-btn"])}" aria-label="音量" title="音量控制"><svg class="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg><svg class="volume-low-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg><svg class="mute-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg></button><div class="volume-bar"><div id="volume-fill" class="volume-fill" style="${ssrRenderStyle({ width: `${__props.isMuted ? 0 : __props.volume * 100}%` })}"></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/media/PlayerVolume.vue
var _sfc_setup$24 = PlayerVolume_vue_vue_type_script_setup_true_lang_default.setup;
PlayerVolume_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerVolume.vue");
	return _sfc_setup$24 ? _sfc_setup$24(props, ctx) : void 0;
};
var PlayerVolume_default = PlayerVolume_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/media/PlayerPlaylist.vue?vue&type=script&setup=true&lang.ts
var PlayerPlaylist_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PlayerPlaylist",
	__ssrInlineRender: true,
	props: {
		playlist: { default: () => [] },
		currentIndex: { default: 0 },
		isVisible: {
			type: Boolean,
			default: false
		}
	},
	emits: ["select", "close"],
	setup(__props, { emit: __emit }) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["player-playlist", { active: __props.isVisible }] }, _attrs))}><div class="playlist-container"><div class="playlist-header"><h3>音乐列表</h3><button type="button" class="close-btn" aria-label="关闭列表" title="关闭列表"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button></div><div class="playlist-content"><ul class="playlist-items"><!--[-->`);
			ssrRenderList(__props.playlist, (song, index) => {
				_push(`<li class="${ssrRenderClass({ active: index === __props.currentIndex })}"><img${ssrRenderAttr("src", song.cover)}${ssrRenderAttr("alt", song.title + " 封面")}><div class="playlist-item-info"><div class="playlist-item-title">${ssrInterpolate(song.title)}</div><div class="playlist-item-artist">${ssrInterpolate(song.artist)}</div></div><div class="playlist-item-status">${ssrInterpolate(index === __props.currentIndex ? "▶" : "")}</div></li>`);
			});
			_push(`<!--]--></ul></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/media/PlayerPlaylist.vue
var _sfc_setup$23 = PlayerPlaylist_vue_vue_type_script_setup_true_lang_default.setup;
PlayerPlaylist_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerPlaylist.vue");
	return _sfc_setup$23 ? _sfc_setup$23(props, ctx) : void 0;
};
var PlayerPlaylist_default = PlayerPlaylist_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/media/AudioVisualizer.vue?vue&type=script&setup=true&lang.ts
var AudioVisualizer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "AudioVisualizer",
	__ssrInlineRender: true,
	props: {
		isPlaying: {
			type: Boolean,
			default: false
		},
		enabled: {
			type: Boolean,
			default: false
		},
		getAnalyser: {
			type: [Function, null],
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const enabled = computed(() => props.enabled);
		const canvasRef = ref(null);
		const isInitialized = ref(false);
		let analyser = null;
		let animationId = null;
		const isBrowser = typeof window !== "undefined";
		const initVisualization = () => {
			if (!isBrowser) return;
			if (isInitialized.value) return;
			if (props.getAnalyser) analyser = props.getAnalyser();
			if (analyser) isInitialized.value = true;
		};
		const drawWaveform = () => {
			if (!isBrowser) return;
			if (!canvasRef.value) return;
			const canvas = canvasRef.value;
			const ctx = canvas.getContext("2d");
			const width = canvas.width;
			const height = canvas.height;
			window.devicePixelRatio;
			let phase = 0;
			const draw = () => {
				if (!canvasRef.value || !enabled.value) {
					animationId = null;
					return;
				}
				animationId = requestAnimationFrame(draw);
				ctx.clearRect(0, 0, width, height);
				const barCount = 64;
				const barWidth = width / barCount * 2.5;
				let x = 0;
				phase += .1;
				for (let i = 0; i < barCount; i++) {
					const t = i / barCount * Math.PI * 2;
					let barHeight = Math.abs(Math.sin(t + phase)) * height * .4;
					if (analyser && props.isPlaying) {
						const bufferLength = analyser.frequencyBinCount;
						const dataArray = new Uint8Array(bufferLength);
						analyser.getByteFrequencyData(dataArray);
						barHeight = dataArray[Math.floor(i / barCount * bufferLength)] / 255 * height * .8;
					}
					const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
					gradient.addColorStop(0, "rgba(100, 200, 255, 0.8)");
					gradient.addColorStop(.5, "rgba(150, 100, 255, 0.6)");
					gradient.addColorStop(1, "rgba(255, 100, 150, 0.4)");
					ctx.fillStyle = gradient;
					ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
					x += barWidth + 1;
				}
				ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(0, height / 2);
				ctx.lineTo(width, height / 2);
				ctx.stroke();
			};
			draw();
		};
		const startVisualization = () => {
			if (!isBrowser) return;
			if (!enabled.value) return;
			if (!analyser && props.getAnalyser) analyser = props.getAnalyser();
			if (!animationId) drawWaveform();
		};
		const stopVisualization = () => {
			if (!isBrowser) return;
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
		};
		const resizeCanvas = () => {
			if (!isBrowser) return;
			if (!canvasRef.value) return;
			const canvas = canvasRef.value;
			const dpr = window.devicePixelRatio || 1;
			const width = window.innerWidth;
			const height = 120;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			canvas.getContext("2d").scale(dpr, dpr);
		};
		watch(enabled, (enabled) => {
			if (enabled) startVisualization();
			else stopVisualization();
		});
		watch(() => props.isPlaying, (playing) => {
			if (playing && enabled.value) {
				if (!isInitialized.value) initVisualization();
				if (!analyser && props.getAnalyser) analyser = props.getAnalyser();
				startVisualization();
			}
		});
		onMounted(() => {
			if (isBrowser) {
				resizeCanvas();
				window.addEventListener("resize", resizeCanvas);
				if (enabled.value) setTimeout(() => {
					startVisualization();
				}, 100);
			}
		});
		onUnmounted(() => {
			stopVisualization();
			if (isBrowser) window.removeEventListener("resize", resizeCanvas);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["audio-visualizer", { hidden: !enabled.value }] }, _attrs))} data-v-1d55109c><canvas class="visualizer-canvas" data-v-1d55109c></canvas></div>`);
		};
	}
});
//#endregion
//#region src/components/media/AudioVisualizer.vue
var _sfc_setup$22 = AudioVisualizer_vue_vue_type_script_setup_true_lang_default.setup;
AudioVisualizer_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/AudioVisualizer.vue");
	return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
var AudioVisualizer_default = /* @__PURE__ */ _plugin_vue_export_helper_default(AudioVisualizer_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1d55109c"]]);
//#endregion
//#region src/components/media/AudioEffects.vue?vue&type=script&setup=true&lang.ts
var AudioEffects_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "AudioEffects",
	__ssrInlineRender: true,
	props: {
		audioContext: { default: null },
		isPlaying: {
			type: Boolean,
			default: false
		},
		isVisible: {
			type: Boolean,
			default: false
		},
		visualizerEnabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ["effect-change", "close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const musicStore = useMusicStore();
		const effectsEnabled = computed(() => {
			console.log("[AudioEffects] effectsEnabled changed:", musicStore.effectsEnabled);
			return musicStore.effectsEnabled;
		});
		const currentSurroundMode = computed(() => {
			console.log("[AudioEffects] surroundMode changed:", musicStore.surroundMode);
			return musicStore.surroundMode;
		});
		const currentEqPreset = computed(() => {
			console.log("[AudioEffects] eqPreset changed:", musicStore.eqPreset);
			return musicStore.eqPreset;
		});
		const isExpanded = ref(false);
		const surroundModes = [
			{
				value: "off",
				label: "关闭"
			},
			{
				value: "hall",
				label: "大厅"
			},
			{
				value: "room",
				label: "房间"
			},
			{
				value: "stadium",
				label: "体育场"
			}
		];
		const eqPresets = [
			{
				value: "flat",
				label: "标准"
			},
			{
				value: "pop",
				label: "流行"
			},
			{
				value: "rock",
				label: "摇滚"
			},
			{
				value: "classical",
				label: "古典"
			},
			{
				value: "jazz",
				label: "爵士"
			},
			{
				value: "bass",
				label: "低音增强"
			}
		];
		const isVizEnabled = computed(() => props.visualizerEnabled);
		watch(() => props.isPlaying, (playing) => {
			if (!playing) isExpanded.value = false;
		});
		watch(() => props.isVisible, (visible) => {
			isExpanded.value = visible;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["audio-effects", {
				expanded: isExpanded.value,
				enabled: effectsEnabled.value
			}] }, _attrs))} data-v-c69c8abc><div class="effects-panel" style="${ssrRenderStyle(isExpanded.value ? null : { display: "none" })}" data-v-c69c8abc><div class="effects-header" data-v-c69c8abc><h4 data-v-c69c8abc>音效设置</h4><div class="header-actions" data-v-c69c8abc><button class="enable-btn" style="${ssrRenderStyle(effectsEnabled.value ? {
				background: "var(--common-color-1)",
				color: "var(--common-content)",
				borderColor: "var(--common-color-1)"
			} : {})}" data-v-c69c8abc>${ssrInterpolate(effectsEnabled.value ? "已启用" : "已关闭")}</button><button class="close-btn" data-v-c69c8abc><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-v-c69c8abc><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" data-v-c69c8abc></path></svg></button></div></div><div class="effects-body" data-v-c69c8abc><div class="effect-section" data-v-c69c8abc><div class="visualizer-toggle" data-v-c69c8abc><span class="effect-label" data-v-c69c8abc>音频可视化</span><button class="toggle-btn" style="${ssrRenderStyle(isVizEnabled.value ? {
				background: "var(--common-color-1)",
				color: "var(--common-content)",
				borderColor: "var(--common-color-1)"
			} : {})}" data-v-c69c8abc>${ssrInterpolate(isVizEnabled.value ? "已开启" : "已关闭")}</button></div></div><div class="effect-section" data-v-c69c8abc><span class="effect-label" data-v-c69c8abc>环绕模式</span><div class="btn-group" data-v-c69c8abc><!--[-->`);
			ssrRenderList(surroundModes, (mode) => {
				_push(`<button class="chip-btn" style="${ssrRenderStyle(currentSurroundMode.value === mode.value ? {
					background: "var(--common-color-1)",
					color: "var(--common-content)",
					borderColor: "var(--common-color-1)"
				} : {})}" data-v-c69c8abc>${ssrInterpolate(mode.label)}</button>`);
			});
			_push(`<!--]--></div></div><div class="effect-section" data-v-c69c8abc><span class="effect-label" data-v-c69c8abc>均衡器</span><div class="btn-group" data-v-c69c8abc><!--[-->`);
			ssrRenderList(eqPresets, (preset) => {
				_push(`<button class="chip-btn" style="${ssrRenderStyle(currentEqPreset.value === preset.value ? {
					background: "var(--common-color-1)",
					color: "var(--common-content)",
					borderColor: "var(--common-color-1)"
				} : {})}" data-v-c69c8abc>${ssrInterpolate(preset.label)}</button>`);
			});
			_push(`<!--]--></div></div></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/media/AudioEffects.vue
var _sfc_setup$21 = AudioEffects_vue_vue_type_script_setup_true_lang_default.setup;
AudioEffects_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/AudioEffects.vue");
	return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
};
var AudioEffects_default = /* @__PURE__ */ _plugin_vue_export_helper_default(AudioEffects_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c69c8abc"]]);
//#endregion
//#region src/components/media/MusicPlayerStyles.vue
var _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {}
var _sfc_setup$20 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/MusicPlayerStyles.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
var MusicPlayerStyles_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
//#endregion
//#region src/components/media/MusicPlay.vue?vue&type=script&setup=true&lang.ts
var MusicPlay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MusicPlay",
	__ssrInlineRender: true,
	setup(__props) {
		const playerRef = ref(null);
		const toggleBtnRef = ref(null);
		const playerCoverRef = ref(null);
		const isEffectsVisible = ref(false);
		const visualizerEnabled = ref(false);
		const isBtnAnimating = ref(false);
		const musicStore = useMusicStore();
		const playlist = computed(() => musicStore.playlist);
		const currentIndex = computed(() => musicStore.currentIndex);
		const isPlaying = computed(() => musicStore.isPlaying);
		computed(() => musicStore.isPlayerVisible);
		const isPlaylistVisible = computed(() => musicStore.isPlaylistVisible);
		const volume = computed(() => musicStore.volume);
		const isMuted = computed(() => musicStore.isMuted);
		const currentTime = computed(() => musicStore.currentTime);
		const duration = computed(() => musicStore.duration);
		computed(() => musicStore.isLoading);
		const currentSong = computed(() => musicStore.currentSong);
		const progressPercent = computed(() => musicStore.progressPercent);
		const effectsEnabled = computed(() => musicStore.effectsEnabled);
		computed(() => musicStore.surroundMode);
		computed(() => musicStore.eqPreset);
		const togglePlay = () => musicStore.togglePlay();
		const prevSong = () => musicStore.prevSong();
		const nextSong = () => musicStore.nextSong();
		const closePlaylist = () => musicStore.closePlaylist();
		const selectSong = (index) => musicStore.selectSong(index);
		const seek = (percent) => musicStore.seek(percent);
		const setVolume = (percent) => musicStore.setVolume(percent);
		const toggleMute = () => musicStore.toggleMute();
		const loadMusicConfig = () => musicStore.loadMusicConfig();
		const getAudioContext = () => musicStore.getAudioContext();
		const getAnalyser = () => musicStore.getAnalyser();
		const applyEffects = (effects) => musicStore.applyEffects(effects);
		const cleanup = () => musicStore.cleanup();
		const handleSeek = (percent) => {
			seek(percent);
		};
		const handleVolumeChange = (percent) => {
			setVolume(percent);
		};
		const handleSelectSong = (index) => {
			selectSong(index);
		};
		const handleEffectsChange = (effects) => {
			if (effects.visualizerEnabled !== void 0) visualizerEnabled.value = effects.visualizerEnabled;
			applyEffects(effects);
		};
		const toggleEffects = () => {
			isEffectsVisible.value = !isEffectsVisible.value;
		};
		const onClickOutside = (e) => {
			if (isPlaylistVisible.value && playerRef.value && !playerRef.value.contains(e.target) && toggleBtnRef.value && !toggleBtnRef.value.contains(e.target)) closePlaylist();
		};
		onMounted(() => {
			nextTick(() => {
				playerRef.value = document.getElementById("global-music-player");
				toggleBtnRef.value = document.getElementById("music-player-btn");
				playerCoverRef.value = document.getElementById("player-cover");
				if (typeof document !== "undefined") document.addEventListener("click", onClickOutside);
				loadMusicConfig();
			});
		});
		watch(currentSong, (song) => {
			if (song && playerCoverRef.value) {
				const img = new window.Image();
				img.crossOrigin = "anonymous";
				img.onload = () => {
					if (playerCoverRef.value) playerCoverRef.value.src = song.cover;
				};
				img.src = song.cover;
			}
			if (song) {
				const titleEl = document.getElementById("player-title");
				const artistEl = document.getElementById("player-artist");
				const coverEl = document.getElementById("player-cover");
				if (titleEl) titleEl.textContent = song.title;
				if (artistEl) artistEl.textContent = song.artist;
				if (coverEl) coverEl.src = song.cover;
			}
		}, { immediate: true });
		watch(isPlaying, (playing) => {
			if (playerRef.value) playerRef.value.classList.toggle("playing", playing);
			if (playerCoverRef.value && playerCoverRef.value.parentElement) playerCoverRef.value.parentElement.classList.toggle("playing", playing);
		});
		onUnmounted(() => {
			cleanup();
			if (typeof document !== "undefined") document.removeEventListener("click", onClickOutside);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push(ssrRenderComponent(MusicPlayerStyles_default, null, null, _parent));
			_push(`<div data-v-f42baa72><div id="music-player-btn" class="${ssrRenderClass([{ animating: isBtnAnimating.value }, "button-style music-player-btn"])}" title="音乐播放" role="button" tabindex="0" aria-label="打开音乐播放器" data-v-f42baa72><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-music" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-f42baa72><path stroke="none" d="M0 0h24v24H0z" fill="none" data-v-f42baa72></path><path d="M9 18V5l12 -2v13" data-v-f42baa72></path><circle cx="6" cy="18" r="3" data-v-f42baa72></circle><circle cx="18" cy="16" r="3" data-v-f42baa72></circle></svg>`);
			if (isBtnAnimating.value) _push(`<span class="emoji-burst" data-v-f42baa72>✨</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				_push(ssrRenderComponent(AudioVisualizer_default, {
					"is-playing": isPlaying.value,
					"get-analyser": getAnalyser,
					enabled: visualizerEnabled.value
				}, null, _parent));
				_push(`<div id="global-music-player" class="global-music-player" data-v-f42baa72><div class="player-content" data-v-f42baa72><div class="player-top-row" data-v-f42baa72><div class="player-cover" data-v-f42baa72><img id="player-cover"${ssrRenderAttr("src", "")} alt="封面" data-v-f42baa72></div><div class="player-meta" data-v-f42baa72><h4 id="player-title" data-v-f42baa72>未选择歌曲</h4><p id="player-artist" data-v-f42baa72>未知艺术家</p></div>`);
				_push(ssrRenderComponent(PlayerControls_default, {
					"is-playing": isPlaying.value,
					"current-song": currentSong.value,
					onTogglePlay: togglePlay,
					onPrev: prevSong,
					onNext: nextSong
				}, null, _parent));
				_push(`<div class="player-extra" data-v-f42baa72>`);
				_push(ssrRenderComponent(PlayerVolume_default, {
					volume: volume.value,
					"is-muted": isMuted.value,
					onAdjustVolume: handleVolumeChange,
					onToggleMute: toggleMute
				}, null, _parent));
				_push(`<div class="player-list" data-v-f42baa72><button type="button" class="control-btn list-btn" aria-label="音乐列表" title="音乐列表" data-v-f42baa72><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-f42baa72><path d="M21 15V6" data-v-f42baa72></path><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" data-v-f42baa72></path><path d="M12 12H3" data-v-f42baa72></path><path d="M16 6H3" data-v-f42baa72></path><path d="M12 18H3" data-v-f42baa72></path></svg></button></div><div class="player-effects" data-v-f42baa72><button type="button" class="${ssrRenderClass([{ active: isEffectsVisible.value || effectsEnabled.value }, "control-btn effects-btn"])}" aria-label="音效" title="音效设置" data-v-f42baa72><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" data-v-f42baa72><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="currentColor" stroke-width="2" fill="none" data-v-f42baa72></path></svg></button></div></div></div>`);
				_push(ssrRenderComponent(PlayerProgress_default, {
					"current-time": currentTime.value,
					duration: duration.value,
					"progress-percent": progressPercent.value,
					onSeek: handleSeek
				}, null, _parent));
				_push(`</div></div>`);
				_push(ssrRenderComponent(PlayerPlaylist_default, {
					playlist: playlist.value,
					"current-index": currentIndex.value,
					"is-visible": isPlaylistVisible.value,
					onSelect: handleSelectSong,
					onClose: closePlaylist
				}, null, _parent));
				_push(ssrRenderComponent(AudioEffects_default, {
					"audio-context": getAudioContext(),
					"is-playing": isPlaying.value,
					"is-visible": isEffectsVisible.value,
					"visualizer-enabled": visualizerEnabled.value,
					onEffectChange: handleEffectsChange,
					onClose: toggleEffects
				}, null, _parent));
			}, "body", false, _parent);
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region src/components/media/MusicPlay.vue
var _sfc_setup$19 = MusicPlay_vue_vue_type_script_setup_true_lang_default.setup;
MusicPlay_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/MusicPlay.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
var MusicPlay_default = /* @__PURE__ */ _plugin_vue_export_helper_default(MusicPlay_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f42baa72"]]);
//#endregion
//#region src/components/p-header/MobileMenu.vue?vue&type=script&setup=true&lang.ts
var MobileMenu_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MobileMenu",
	__ssrInlineRender: true,
	setup(__props) {
		const isMenuOpen = ref(false);
		const toggleMobileMenu = () => {
			isMenuOpen.value = !isMenuOpen.value;
			const leftAsider = document.querySelector(".left-asider-S");
			const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
			if (leftAsider && mobileMenuOverlay) if (isMenuOpen.value) {
				leftAsider.classList.add("active");
				mobileMenuOverlay.classList.add("active");
			} else {
				leftAsider.classList.remove("active");
				mobileMenuOverlay.classList.remove("active");
			}
		};
		const handleKeydown = (event) => {
			if (event.key === "Escape" && isMenuOpen.value) toggleMobileMenu();
		};
		onMounted(() => {
			if (typeof document !== "undefined") document.addEventListener("keydown", handleKeydown);
		});
		onUnmounted(() => {
			if (typeof document !== "undefined") document.removeEventListener("keydown", handleKeydown);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mobile-menu-container" }, _attrs))} data-v-5e644abc><div id="mobile-menu-toggle" title="菜单" class="${ssrRenderClass([{ animating: _ctx.isAnimating }, "button-style mobile-menu-toggle"])}" data-v-5e644abc><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-5e644abc><line x1="3" y1="6" x2="21" y2="6" data-v-5e644abc></line><line x1="3" y1="12" x2="21" y2="12" data-v-5e644abc></line><line x1="3" y1="18" x2="21" y2="18" data-v-5e644abc></line></svg></div>`);
			ssrRenderTeleport(_push, (_push) => {
				_push(`<div class="mobile-menu-overlay" id="mobile-menu-overlay" data-v-5e644abc></div>`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/MobileMenu.vue
var _sfc_setup$18 = MobileMenu_vue_vue_type_script_setup_true_lang_default.setup;
MobileMenu_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/MobileMenu.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
var MobileMenu_default = /* @__PURE__ */ _plugin_vue_export_helper_default(MobileMenu_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5e644abc"]]);
//#endregion
//#region src/components/p-header/DynamicEffectControl.vue?vue&type=script&setup=true&lang.ts
var DynamicEffectControl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "DynamicEffectControl",
	__ssrInlineRender: true,
	setup(__props) {
		useDynamicEffectsStore();
		const isEffectEnabled = ref(true);
		const isDarkMode = ref(false);
		const isAnimating = ref(false);
		let scriptLoaded = false;
		let observer = null;
		const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
		const checkTheme = () => {
			if (isBrowser) isDarkMode.value = document.body.classList.contains("dark-theme");
		};
		const initEffects = () => {
			if (!isBrowser) return;
			if (!isDarkMode.value) initSakura();
		};
		const destroyEffects = () => {
			if (!isBrowser) return;
			destroySakura();
		};
		const initSakura = () => {
			if (!isBrowser) return;
			if (!scriptLoaded) {
				const script = document.createElement("script");
				script.src = "/js/sakuraPlus.js";
				script.onload = () => {
					scriptLoaded = true;
					setTimeout(() => {
						if (typeof startSakura !== "undefined") startSakura();
					}, 100);
				};
				document.head.appendChild(script);
			} else {
				if (typeof staticx !== "undefined") staticx = false;
				if (typeof startSakura !== "undefined") startSakura();
			}
		};
		const destroySakura = () => {
			if (!isBrowser) return;
			if (typeof stopp !== "undefined") try {
				stopp();
			} catch (e) {}
			const canvas = document.getElementById("canvas_sakura");
			if (canvas && canvas.parentNode) try {
				canvas.parentNode.removeChild(canvas);
			} catch (e) {}
		};
		function seededRandom(seed) {
			const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
			return x - Math.floor(x);
		}
		const snowflakeStyles = Array.from({ length: 30 }, (_, i) => {
			const r1 = seededRandom(i * 7 + 1);
			const r2 = seededRandom(i * 7 + 2);
			const r3 = seededRandom(i * 7 + 3);
			const r4 = seededRandom(i * 7 + 4);
			const size = 5 + seededRandom(i * 7 + 5) * 12;
			return {
				left: `${r1 * 100}%`,
				animationDelay: `${r2 * 5}s`,
				animationDuration: `${5 + r3 * 10}s`,
				opacity: .5 + r4 * .5,
				width: `${size}px`,
				height: `${size}px`
			};
		});
		onMounted(() => {
			if (!isBrowser) return;
			const savedSetting = localStorage.getItem("dynamicEffectEnabled");
			if (savedSetting !== null) isEffectEnabled.value = savedSetting === "true";
			checkTheme();
			if (isEffectEnabled.value) initEffects();
			if (typeof MutationObserver !== "undefined") {
				observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						if (mutation.attributeName === "class") {
							checkTheme();
							if (isEffectEnabled.value) {
								destroyEffects();
								initEffects();
							}
						}
					});
				});
				observer.observe(document.body, { attributes: true });
			}
		});
		onUnmounted(() => {
			if (!isBrowser) return;
			if (observer) observer.disconnect();
			destroyEffects();
		});
		watch(isEffectEnabled, (newValue) => {
			if (newValue) initEffects();
			else destroyEffects();
		});
		watch(isDarkMode, () => {
			if (isEffectEnabled.value) {
				destroyEffects();
				initEffects();
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="${ssrRenderClass([{ animating: isAnimating.value }, "button-style"])}"${ssrRenderAttr("title", isEffectEnabled.value ? "关闭动态效果" : "开启动态效果")} data-v-fed3b5a4><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024" fill="currentColor" data-v-fed3b5a4><path d="M652.899 189.266c-16.036-7.058-34.761 0.22-41.82 16.258-7.059 16.038 0.221 34.761 16.258 41.819 104.649 46.06 172.27 149.682 172.27 263.991 0 77-29.986 149.392-84.434 203.839s-126.839 84.434-203.839 84.434-149.393-29.986-203.84-84.434c-54.448-54.447-84.433-126.839-84.433-203.839 0-114.963 68.159-218.821 173.642-264.591 16.075-6.975 23.451-25.659 16.477-41.733-6.975-16.075-25.662-23.452-41.734-16.477-128.688 55.837-211.839 182.544-211.839 322.8 0 47.469 9.304 93.535 27.653 136.917 17.717 41.887 43.073 79.499 75.365 111.791 32.292 32.291 69.903 57.647 111.791 75.364 43.383 18.35 89.449 27.653 136.918 27.653 47.468 0 93.535-9.304 136.917-27.653 41.888-17.717 79.499-43.073 111.791-75.364 32.291-32.292 57.647-69.904 75.364-111.791 18.35-43.383 27.653-89.448 27.653-136.917 0.001-139.458-82.493-265.877-210.16-322.067z" data-v-fed3b5a4></path><path d="M512 479.517c17.522 0 31.727-14.205 31.727-31.727V128.228c0-17.522-14.204-31.727-31.727-31.727s-31.727 14.205-31.727 31.727V447.79c0 17.522 14.205 31.727 31.727 31.727z" data-v-fed3b5a4></path></svg>`);
			if (isAnimating.value) _push(`<span class="emoji-burst" data-v-fed3b5a4>✨</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (isEffectEnabled.value && !isDarkMode.value) _push(`<div class="sakura-container" data-v-fed3b5a4></div>`);
				else _push(`<!---->`);
				if (isEffectEnabled.value && isDarkMode.value) {
					_push(`<div class="snow-container" data-v-fed3b5a4><!--[-->`);
					ssrRenderList(30, (i) => {
						_push(`<div class="snowflake" style="${ssrRenderStyle(unref(snowflakeStyles)[i - 1])}" data-v-fed3b5a4></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/components/p-header/DynamicEffectControl.vue
var _sfc_setup$17 = DynamicEffectControl_vue_vue_type_script_setup_true_lang_default.setup;
DynamicEffectControl_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/DynamicEffectControl.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
var DynamicEffectControl_default = /* @__PURE__ */ _plugin_vue_export_helper_default(DynamicEffectControl_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-fed3b5a4"]]);
//#endregion
//#region src/components/Header.vue?vue&type=script&setup=true&lang.ts
var Header_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Header",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		onMounted(() => {});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-606dd01b>`);
			_push(ssrRenderComponent(ReadingProgress_default, null, null, _parent));
			_push(`<header class="header-flex" data-v-606dd01b><div class="header-S" data-v-606dd01b><nav class="header-container" data-v-606dd01b><div class="header-card" data-v-606dd01b>`);
			_push(ssrRenderComponent(Logo_default, null, null, _parent));
			_push(ssrRenderComponent(Search_default, null, null, _parent));
			_push(`<div class="button-class-card" data-v-606dd01b>`);
			_push(ssrRenderComponent(MobileMenu_default, null, null, _parent));
			_push(ssrRenderComponent(DynamicEffectControl_default, null, null, _parent));
			_push(ssrRenderComponent(ThemeToggle_default, null, null, _parent));
			_push(ssrRenderComponent(ImmersiveReading_default, null, null, _parent));
			_push(ssrRenderComponent(MusicPlay_default, null, null, _parent));
			_push(`</div></div></nav></div></header></div>`);
		};
	}
});
//#endregion
//#region src/components/Header.vue
var _sfc_setup$16 = Header_vue_vue_type_script_setup_true_lang_default.setup;
Header_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Header.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
var Header_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Header_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-606dd01b"]]);
//#endregion
//#region src/assets/imgs/avator.jpg
var avator_default = "/assets/avator-oy7ngIvp.jpg";
//#endregion
//#region src/components/p-sidebar/Avatar.vue
var _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "avator-card" }, _attrs))} data-v-cfa9600b><img${ssrRenderAttr("src", avator_default)} alt="Cnkrru的头像" data-v-cfa9600b></div>`);
}
var _sfc_setup$15 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-sidebar/Avatar.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
var Avatar_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-cfa9600b"]]);
//#endregion
//#region src/components/p-sidebar/WelcomeSaying.vue?vue&type=script&setup=true&lang.ts
var WelcomeSaying_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "WelcomeSaying",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "welcome-saying-card" }, _attrs))} data-v-33a79c92><p class="welcome-link" data-v-33a79c92>欢迎来到我的博客</p></div>`);
		};
	}
});
//#endregion
//#region src/components/p-sidebar/WelcomeSaying.vue
var _sfc_setup$14 = WelcomeSaying_vue_vue_type_script_setup_true_lang_default.setup;
WelcomeSaying_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-sidebar/WelcomeSaying.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
var WelcomeSaying_default = /* @__PURE__ */ _plugin_vue_export_helper_default(WelcomeSaying_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-33a79c92"]]);
//#endregion
//#region src/components/p-sidebar/PageLinks.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_router_link = resolveComponent("router-link");
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "page-list-card" }, _attrs))} data-v-f2e9a61b><ul data-v-f2e9a61b><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/home",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 首页 `);
			else return [createTextVNode(" 首页 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/about",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 关于 `);
			else return [createTextVNode(" 关于 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/archives",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 归档 `);
			else return [createTextVNode(" 归档 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/timeline",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 标签 `);
			else return [createTextVNode(" 标签 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/links",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 友链 `);
			else return [createTextVNode(" 友链 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/search",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 搜索 `);
			else return [createTextVNode(" 搜索 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/projects",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 项目 `);
			else return [createTextVNode(" 项目 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li data-v-f2e9a61b>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/settings",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` 设置 `);
			else return [createTextVNode(" 设置 ")];
		}),
		_: 1
	}, _parent));
	_push(`</li></ul></div>`);
}
var _sfc_setup$13 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-sidebar/PageLinks.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var PageLinks_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-f2e9a61b"]]);
//#endregion
//#region src/components/p-sidebar/BusuanziStats.vue?vue&type=script&setup=true&lang.ts
var BusuanziStats_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "BusuanziStats",
	__ssrInlineRender: true,
	setup(__props) {
		const showPopup = ref(false);
		const loading = ref(true);
		const closePopup = (e) => {
			const target = e.target;
			if (!target.closest(".busuanzi-popup") && !target.closest(".busuanzi-btn")) showPopup.value = false;
		};
		const loadBusuanzi = () => {
			if (typeof window === "undefined") return;
			if (document.querySelector("script[src*=\"busuanzi\"]")) {
				loading.value = false;
				return;
			}
			const script = document.createElement("script");
			script.src = "//cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js";
			script.defer = true;
			script.onload = () => {
				loading.value = false;
			};
			script.onerror = () => {
				loading.value = false;
			};
			document.head.appendChild(script);
		};
		onMounted(() => {
			loadBusuanzi();
			document.addEventListener("click", closePopup);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "busuanzi-wrapper" }, _attrs))} data-v-58cb8923><button class="busuanzi-btn" title="站点统计" data-v-58cb8923> 统计 </button>`);
			ssrRenderTeleport(_push, (_push) => {
				if (showPopup.value) {
					_push(`<div class="busuanzi-overlay" data-v-58cb8923><div class="busuanzi-popup" data-v-58cb8923><div class="popup-header" data-v-58cb8923><h3 data-v-58cb8923>站点统计</h3><button class="popup-close" data-v-58cb8923>×</button></div>`);
					if (loading.value) _push(`<div class="popup-loading" data-v-58cb8923>加载中...</div>`);
					else _push(`<div class="stats-grid" data-v-58cb8923><div class="stats-item" data-v-58cb8923><span class="stats-label" data-v-58cb8923>今日PV</span><span id="busuanzi_today_pv" class="stats-value" data-v-58cb8923>-</span></div><div class="stats-item" data-v-58cb8923><span class="stats-label" data-v-58cb8923>今日UV</span><span id="busuanzi_today_uv" class="stats-value" data-v-58cb8923>-</span></div><div class="stats-item" data-v-58cb8923><span class="stats-label" data-v-58cb8923>总访问量</span><span id="busuanzi_site_pv" class="stats-value" data-v-58cb8923>-</span></div><div class="stats-item" data-v-58cb8923><span class="stats-label" data-v-58cb8923>总访客数</span><span id="busuanzi_site_uv" class="stats-value" data-v-58cb8923>-</span></div><div class="stats-item" data-v-58cb8923><span class="stats-label" data-v-58cb8923>本页阅读</span><span id="busuanzi_page_pv" class="stats-value" data-v-58cb8923>-</span></div><div class="stats-item" data-v-58cb8923><span class="stats-label" data-v-58cb8923>本页访客</span><span id="busuanzi_page_uv" class="stats-value" data-v-58cb8923>-</span></div></div>`);
					_push(`</div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-sidebar/BusuanziStats.vue
var _sfc_setup$12 = BusuanziStats_vue_vue_type_script_setup_true_lang_default.setup;
BusuanziStats_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-sidebar/BusuanziStats.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
var BusuanziStats_default = /* @__PURE__ */ _plugin_vue_export_helper_default(BusuanziStats_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-58cb8923"]]);
//#endregion
//#region src/components/api/Weather.vue?vue&type=script&setup=true&lang.ts
var Weather_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Weather",
	__ssrInlineRender: true,
	setup(__props) {
		const weather = ref(null);
		const loading = ref(true);
		const error = ref("");
		const locationInfo = ref({
			city: "加载中..",
			country: ""
		});
		const cityNames = {
			"Beijing": "北京",
			"Shanghai": "上海",
			"Guangzhou": "广州",
			"Shenzhen": "深圳",
			"Hangzhou": "杭州",
			"Nanjing": "南京",
			"Wuhan": "武汉",
			"Chengdu": "成都",
			"Xian": "西安",
			"Chongqing": "重庆",
			"Suzhou": "苏州",
			"Dalian": "大连",
			"Qingdao": "青岛",
			"Tianjin": "天津",
			"Changsha": "长沙",
			"Zhengzhou": "郑州",
			"Harbin": "哈尔滨",
			"Shenyang": "沈阳",
			"Changchun": "长春",
			"Fuzhou": "福州",
			"Nanchang": "南昌",
			"Hefei": "合肥",
			"Taiyuan": "太原",
			"Lanzhou": "兰州",
			"Urumqi": "乌鲁木齐",
			"Kunming": "昆明",
			"Shijiazhuang": "石家庄",
			"Jinan": "济南",
			"Nanning": "南宁",
			"Guiyang": "贵阳",
			"Haikou": "海口",
			"Hong Kong": "香港",
			"Macau": "澳门",
			"Taipei": "台北",
			"Tokyo": "东京",
			"Seoul": "首尔",
			"Singapore": "新加坡",
			"Bangkok": "曼谷"
		};
		const getCityName = (city) => {
			if (!city) return "未知";
			return cityNames[city] || city;
		};
		const getWeatherText = (code) => {
			if (code === 0) return "晴";
			if (code <= 3) return "多云";
			if (code <= 49) return "雾";
			if (code <= 59) return "毛毛雨";
			if (code <= 69) return "小雪";
			if (code <= 79) return "中雪";
			if (code <= 82) return "大雨";
			if (code <= 86) return "暴雪";
			if (code <= 99) return "雷暴";
			return "未知";
		};
		const fetchLocationAndWeather = async () => {
			loading.value = true;
			error.value = "";
			try {
				const fetchWithTimeout = (url, options = {}, timeout = 1e4) => {
					return new Promise((resolve, reject) => {
						const timer = setTimeout(() => {
							reject(/* @__PURE__ */ new Error("请求超时"));
						}, timeout);
						fetch(url, options).then((response) => {
							clearTimeout(timer);
							resolve(response);
						}).catch((err) => {
							clearTimeout(timer);
							reject(err);
						});
					});
				};
				let ipData = null;
				try {
					console.log("尝试使用 ip-api 获取位置...");
					try {
						const ipResponse = await fetchWithTimeout("https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon");
						if (ipResponse.ok) {
							ipData = await ipResponse.json();
							if (ipData.status !== "fail") console.log("ip-api 获取成功:", ipData.city);
							else throw new Error("ip-api 返回失败状态");
						} else throw new Error("ip-api 请求失败");
					} catch (e) {
						console.log("ip-api 失败，尝试方案2: ipinfo.io...");
						try {
							const ipinfoResponse = await fetchWithTimeout("https://ipinfo.io/json");
							if (ipinfoResponse.ok) {
								const ipinfoData = await ipinfoResponse.json();
								if (ipinfoData.city) {
									ipData = {
										city: ipinfoData.city,
										countryCode: ipinfoData.country,
										lat: parseFloat(ipinfoData.loc.split(",")[0]),
										lon: parseFloat(ipinfoData.loc.split(",")[1])
									};
									console.log("ipinfo.io 获取成功:", ipData.city);
								} else throw new Error("ipinfo.io 无城市数据");
							} else throw new Error("ipinfo.io 请求失败");
						} catch (e) {
							console.log("ipinfo.io 失败，尝试方案3: ipify + 默认位置...");
							try {
								const ipifyResponse = await fetchWithTimeout("https://api.ipify.org?format=json");
								if (ipifyResponse.ok) {
									const ipifyData = await ipifyResponse.json();
									console.log("获取到IP:", ipifyData.ip);
									ipData = {
										city: "Changchun",
										countryCode: "CN",
										lat: 43.8168,
										lon: 125.324
									};
									console.log("使用默认位置: 长春");
								} else throw new Error("ipify 请求失败");
							} catch (e) {
								throw new Error("所有IP定位方案均失败");
							}
						}
					}
				} catch (locationError) {
					console.warn("位置获取失败，使用默认位置:", locationError);
					ipData = {
						city: "Changchun",
						countryCode: "CN",
						lat: 43.8168,
						lon: 125.324
					};
				}
				locationInfo.value = {
					city: getCityName(ipData.city),
					country: ipData.countryCode || ""
				};
				const weatherResponse = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current=temperature_2m,weather_code&timezone=auto`);
				if (!weatherResponse.ok) throw new Error("获取天气失败");
				const weatherData = await weatherResponse.json();
				if (weatherData.current) weather.value = {
					temperature: Math.round(weatherData.current.temperature_2m),
					weatherCode: weatherData.current.weather_code,
					weatherText: getWeatherText(weatherData.current.weather_code)
				};
			} catch (err) {
				error.value = "加载失败";
				console.warn("天气加载失败:", err);
				weather.value = {
					temperature: 20,
					weatherCode: 0,
					weatherText: "晴"
				};
				locationInfo.value = {
					city: "北京",
					country: "CN"
				};
			} finally {
				loading.value = false;
			}
		};
		onMounted(() => {
			fetchLocationAndWeather();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "weather-mini" }, _attrs))} data-v-6456adba>`);
			if (loading.value || error.value) _push(`<div class="weather-loading" data-v-6456adba><span data-v-6456adba>天气之子失踪了……</span></div>`);
			else if (weather.value) {
				_push(`<div class="weather-content" data-v-6456adba><svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-6456adba>`);
				if (weather.value.weatherCode === 0) _push(`<!--[--><circle cx="12" cy="12" r="5" data-v-6456adba></circle><line x1="12" y1="1" x2="12" y2="3" data-v-6456adba></line><line x1="12" y1="21" x2="12" y2="23" data-v-6456adba></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" data-v-6456adba></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" data-v-6456adba></line><line x1="1" y1="12" x2="3" y2="12" data-v-6456adba></line><line x1="21" y1="12" x2="23" y2="12" data-v-6456adba></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" data-v-6456adba></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" data-v-6456adba></line><!--]-->`);
				else if (weather.value.weatherCode <= 3) _push(`<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" data-v-6456adba></path>`);
				else if (weather.value.weatherCode <= 49) _push(`<!--[--><line x1="3" y1="6" x2="21" y2="6" data-v-6456adba></line><line x1="3" y1="10" x2="21" y2="10" data-v-6456adba></line><line x1="3" y1="14" x2="21" y2="14" data-v-6456adba></line><line x1="13" y1="18" x2="21" y2="18" data-v-6456adba></line><!--]-->`);
				else if (weather.value.weatherCode <= 59) _push(`<!--[--><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" data-v-6456adba></path><line x1="8" y1="18" x2="8.01" y2="18" data-v-6456adba></line><line x1="12" y1="18" x2="12.01" y2="18" data-v-6456adba></line><line x1="16" y1="18" x2="16.01" y2="18" data-v-6456adba></line><!--]-->`);
				else if (weather.value.weatherCode <= 69) _push(`<!--[--><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" data-v-6456adba></path><circle cx="8" cy="19" r="1" fill="currentColor" stroke="none" data-v-6456adba></circle><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" data-v-6456adba></circle><circle cx="16" cy="19" r="1" fill="currentColor" stroke="none" data-v-6456adba></circle><!--]-->`);
				else if (weather.value.weatherCode <= 82) _push(`<!--[--><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" data-v-6456adba></path><line x1="8" y1="18" x2="8.01" y2="18" data-v-6456adba></line><line x1="12" y1="18" x2="12.01" y2="18" data-v-6456adba></line><line x1="16" y1="18" x2="16.01" y2="18" data-v-6456adba></line><line x1="8" y1="22" x2="8.01" y2="22" data-v-6456adba></line><line x1="12" y1="22" x2="12.01" y2="22" data-v-6456adba></line><line x1="16" y1="22" x2="16.01" y2="22" data-v-6456adba></line><!--]-->`);
				else if (weather.value.weatherCode <= 86) _push(`<!--[--><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" data-v-6456adba></path><circle cx="8" cy="18" r="1.5" fill="currentColor" stroke="none" data-v-6456adba></circle><circle cx="14" cy="18" r="1.5" fill="currentColor" stroke="none" data-v-6456adba></circle><circle cx="11" cy="22" r="1.5" fill="currentColor" stroke="none" data-v-6456adba></circle><!--]-->`);
				else if (weather.value.weatherCode <= 99) _push(`<!--[--><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" data-v-6456adba></path><polygon points="13 12 10 16 13 16 12 20 16 14 13 14 14 12" fill="currentColor" stroke="none" data-v-6456adba></polygon><!--]-->`);
				else _push(`<!--[--><circle cx="12" cy="12" r="5" data-v-6456adba></circle><line x1="12" y1="1" x2="12" y2="3" data-v-6456adba></line><!--]-->`);
				_push(`</svg><span class="weather-temp" data-v-6456adba>${ssrInterpolate(weather.value.temperature)}°</span><span class="weather-city" data-v-6456adba>${ssrInterpolate(locationInfo.value.city)}</span></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/api/Weather.vue
var _sfc_setup$11 = Weather_vue_vue_type_script_setup_true_lang_default.setup;
Weather_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/Weather.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var Weather_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Weather_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6456adba"]]);
//#endregion
//#region src/components/Sidebar.vue?vue&type=script&setup=true&lang.ts
var Sidebar_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Sidebar",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "left-asider-S" }, _attrs))} data-v-88dc6a56><div class="left-asider-container" data-v-88dc6a56><div class="left-asider-card" data-v-88dc6a56>`);
			_push(ssrRenderComponent(Avatar_default, null, null, _parent));
			_push(ssrRenderComponent(WelcomeSaying_default, null, null, _parent));
			_push(ssrRenderComponent(Weather_default, null, null, _parent));
			_push(ssrRenderComponent(PageLinks_default, null, null, _parent));
			_push(ssrRenderComponent(BusuanziStats_default, null, null, _parent));
			_push(`</div></div></aside>`);
		};
	}
});
//#endregion
//#region src/components/Sidebar.vue
var _sfc_setup$10 = Sidebar_vue_vue_type_script_setup_true_lang_default.setup;
Sidebar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Sidebar.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var Sidebar_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Sidebar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-88dc6a56"]]);
//#endregion
//#region src/components/Center.vue?vue&type=script&setup=true&lang.ts
var Center_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Center",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "center-S" }, _attrs))} data-v-a8451c5d><div class="center-container" data-v-a8451c5d><div class="center-card" data-v-a8451c5d><div class="center-header-area" data-v-a8451c5d>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/Center.vue
var _sfc_setup$9 = Center_vue_vue_type_script_setup_true_lang_default.setup;
Center_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Center.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var Center_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Center_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a8451c5d"]]);
//#endregion
//#region src/components/p-footer/WebsiteAge.vue?vue&type=script&setup=true&lang.ts
var WebsiteAge_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "WebsiteAge",
	__ssrInlineRender: true,
	setup(__props) {
		const ageText = ref("");
		let timer = null;
		function update() {
			const start = (/* @__PURE__ */ new Date("2026-03-28T12:00:00")).getTime();
			const diff = Date.now() - start;
			const days = Math.floor(diff / 864e5);
			const years = Math.floor(days / 365);
			const remainDays = days % 365;
			ageText.value = `${years} 年 ${Math.floor(remainDays / 30)} 月 ${remainDays % 30} 天 ${Math.floor(diff % 864e5 / 36e5)} 时 ${Math.floor(diff % 36e5 / 6e4)} 分`;
		}
		onMounted(() => {
			update();
			timer = setInterval(update, 6e4);
		});
		onUnmounted(() => {
			if (timer) clearInterval(timer);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "footer-element-card website-age" }, _attrs))} data-v-7e364a45><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="age-icon" data-v-7e364a45><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" data-v-7e364a45></path><path d="M3 3v5h5" data-v-7e364a45></path><path d="M12 7v5l4 2" data-v-7e364a45></path></svg><span data-v-7e364a45>本站已运行</span><span class="age-num" data-v-7e364a45>${ssrInterpolate(ageText.value)}</span></div>`);
		};
	}
});
//#endregion
//#region src/components/p-footer/WebsiteAge.vue
var _sfc_setup$8 = WebsiteAge_vue_vue_type_script_setup_true_lang_default.setup;
WebsiteAge_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-footer/WebsiteAge.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var WebsiteAge_default = /* @__PURE__ */ _plugin_vue_export_helper_default(WebsiteAge_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7e364a45"]]);
//#endregion
//#region src/components/p-footer/CopyRight.vue?vue&type=script&setup=true&lang.ts
var CopyRight_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "CopyRight",
	__ssrInlineRender: true,
	setup(__props) {
		const copyrightYear = ref((/* @__PURE__ */ new Date()).getFullYear());
		onMounted(() => {
			copyrightYear.value = (/* @__PURE__ */ new Date()).getFullYear();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "footer-element-card copyright" }, _attrs))} data-v-21805549> © ${ssrInterpolate(copyrightYear.value)} Cnkrru · Powered by Vue </div>`);
		};
	}
});
//#endregion
//#region src/components/p-footer/CopyRight.vue
var _sfc_setup$7 = CopyRight_vue_vue_type_script_setup_true_lang_default.setup;
CopyRight_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-footer/CopyRight.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var CopyRight_default = /* @__PURE__ */ _plugin_vue_export_helper_default(CopyRight_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-21805549"]]);
//#endregion
//#region src/components/Footer.vue?vue&type=script&setup=true&lang.ts
var Footer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Footer",
	__ssrInlineRender: true,
	setup(__props) {
		const socialLinks = useGlobalStore().socialLinks;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer-flex" }, _attrs))} data-v-ea91e1dc><div class="footer-S" data-v-ea91e1dc><nav class="footer-container" data-v-ea91e1dc><div class="footer-card" data-v-ea91e1dc><div class="footer-social" data-v-ea91e1dc><!--[-->`);
			ssrRenderList(unref(socialLinks), (link) => {
				_push(`<a${ssrRenderAttr("href", link.url)}${ssrRenderAttr("title", link.name)} target="_blank" rel="noopener noreferrer" class="footer-social-link" data-v-ea91e1dc>`);
				if (link.name === "GitHub") _push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" data-v-ea91e1dc><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" data-v-ea91e1dc></path></svg>`);
				else if (link.name === "Mail") _push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-ea91e1dc><rect x="2" y="4" width="20" height="16" rx="2" data-v-ea91e1dc></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" data-v-ea91e1dc></path></svg>`);
				else _push(`<!---->`);
				_push(`<span class="social-label" data-v-ea91e1dc>${ssrInterpolate(link.name)}</span></a>`);
			});
			_push(`<!--]--><a href="/rss.xml" title="RSS" target="_blank" class="footer-social-link" data-v-ea91e1dc><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" data-v-ea91e1dc><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" data-v-ea91e1dc></path></svg><span class="social-label" data-v-ea91e1dc>RSS</span></a></div><div class="footer-info" data-v-ea91e1dc>`);
			_push(ssrRenderComponent(WebsiteAge_default, null, null, _parent));
			_push(ssrRenderComponent(CopyRight_default, null, null, _parent));
			_push(`</div></div></nav></div></footer>`);
		};
	}
});
//#endregion
//#region src/components/Footer.vue
var _sfc_setup$6 = Footer_vue_vue_type_script_setup_true_lang_default.setup;
Footer_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Footer.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var Footer_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Footer_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ea91e1dc"]]);
//#endregion
//#region src/components/api/WebAnalytics.vue?vue&type=script&setup=true&lang.ts
var WebAnalytics_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "WebAnalytics",
	__ssrInlineRender: true,
	setup(__props) {
		if (typeof window !== "undefined") {
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				window.dataLayer.push(arguments);
			}
			gtag("js", /* @__PURE__ */ new Date());
			gtag("config", "G-081MCRMZPS");
			(function() {
				var script = document.createElement("script");
				script.async = true;
				script.src = "https://www.googletagmanager.com/gtag/js?id=G-081MCRMZPS";
				var s = document.getElementsByTagName("script")[0];
				if (s) s.parentNode.insertBefore(script, s);
				else document.head.appendChild(script);
			})();
			var _hmt = _hmt || [];
			(function() {
				var hm = document.createElement("script");
				hm.src = "https://hm.baidu.com/hm.js?6a9c58ae2a568e9aadebe953a9a4092f";
				var s = document.getElementsByTagName("script")[0];
				if (s) s.parentNode.insertBefore(hm, s);
				else document.head.appendChild(hm);
			})();
		}
		return (_ctx, _push, _parent, _attrs) => {};
	}
});
//#endregion
//#region src/components/api/WebAnalytics.vue
var _sfc_setup$5 = WebAnalytics_vue_vue_type_script_setup_true_lang_default.setup;
WebAnalytics_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/WebAnalytics.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var WebAnalytics_default = WebAnalytics_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/content/NotificationRender.vue?vue&type=script&setup=true&lang.ts
var NotificationRender_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "NotificationRender",
	__ssrInlineRender: true,
	setup(__props, { expose: __expose }) {
		const notificationStore = useNotificationStore();
		useThemeStore();
		const pausedIds = ref(/* @__PURE__ */ new Set());
		const timers = /* @__PURE__ */ new Map();
		const notifications = computed(() => {
			return notificationStore.notifications.map((n, i) => ({
				...n,
				index: i,
				paused: pausedIds.value.has(n.id),
				offset: i * 60
			}));
		});
		function scheduleDismiss(id, duration) {
			if (timers.has(id)) clearTimeout(timers.get(id));
			if (duration <= 0) return;
			timers.set(id, setTimeout(() => {
				removeNotification(id);
				timers.delete(id);
			}, duration));
		}
		function removeNotification(id) {
			pausedIds.value = new Set([...pausedIds.value].filter((i) => i !== id));
			if (timers.has(id)) {
				clearTimeout(timers.get(id));
				timers.delete(id);
			}
			notificationStore.removeNotification(id);
		}
		watch(() => notificationStore.notifications, (newList, oldList) => {
			for (const n of newList) if (!oldList?.find((o) => o.id === n.id) && n.duration > 0) scheduleDismiss(n.id, n.duration);
		}, {
			immediate: true,
			deep: true
		});
		__expose({
			remove: removeNotification,
			clear: notificationStore.clearNotifications
		});
		if (typeof window !== "undefined") window.toast = {
			success: (msg, dur) => notificationStore.addNotification(msg, {
				type: "success",
				duration: dur || 3e3
			}),
			error: (msg, dur) => notificationStore.addNotification(msg, {
				type: "error",
				duration: dur || 5e3
			}),
			warning: (msg, dur) => notificationStore.addNotification(msg, {
				type: "warning",
				duration: dur || 4e3
			}),
			info: (msg, dur) => notificationStore.addNotification(msg, {
				type: "info",
				duration: dur || 3e3
			}),
			add: (msg, opts) => notificationStore.addNotification(msg, opts || {}),
			clear: () => notificationStore.clearNotifications()
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "notification-container" }, _attrs))} data-v-ab5fc905><!--[-->`);
			ssrRenderList(notifications.value, (n, i) => {
				_push(`<div class="${ssrRenderClass([[n.type, { "notification-leaving": n.isLeaving }], "notification"])}" style="${ssrRenderStyle({
					"--offset": `${i * 60}px`,
					zIndex: notifications.value.length - i
				})}" data-v-ab5fc905>`);
				if (n.duration > 0 && n.type !== "error") _push(`<div class="notif-progress" style="${ssrRenderStyle({
					animationDuration: n.duration + "ms",
					animationPlayState: n.paused ? "paused" : "running"
				})}" data-v-ab5fc905></div>`);
				else _push(`<!---->`);
				_push(`<div class="notif-body" data-v-ab5fc905><div class="notif-icon" data-v-ab5fc905>`);
				if (n.type === "success") _push(`<span data-v-ab5fc905>✓</span>`);
				else if (n.type === "error") _push(`<span data-v-ab5fc905>✗</span>`);
				else if (n.type === "warning") _push(`<span data-v-ab5fc905>!</span>`);
				else _push(`<span data-v-ab5fc905>i</span>`);
				_push(`</div><div class="notif-message" data-v-ab5fc905>${ssrInterpolate(n.message)}</div><button class="notif-close" data-v-ab5fc905>×</button></div>`);
				if (n.buttons && n.buttons.length > 0) {
					_push(`<div class="notif-actions" data-v-ab5fc905><!--[-->`);
					ssrRenderList(n.buttons, (b) => {
						_push(`<button class="notif-btn" data-v-ab5fc905>${ssrInterpolate(b.text)}</button>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--></div>`);
		};
	}
});
//#endregion
//#region src/components/content/NotificationRender.vue
var _sfc_setup$4 = NotificationRender_vue_vue_type_script_setup_true_lang_default.setup;
NotificationRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/NotificationRender.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var NotificationRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(NotificationRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-ab5fc905"]]);
//#endregion
//#region src/components/api/MouseTrail.vue?vue&type=script&setup=true&lang.ts
var IDLE_TIMEOUT = 300;
var MouseTrail_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MouseTrail",
	__ssrInlineRender: true,
	setup(__props) {
		const trail = ref([]);
		let mouseX = 0;
		let mouseY = 0;
		let animationId = null;
		let lastUpdate = 0;
		let lastMoveTime = 0;
		const isBrowser = ref(false);
		let charIdCounter = 0;
		let mouseMoveHandler = null;
		const mouseStore = useMouseStore();
		const themeStore = useThemeStore();
		const isDarkTheme = computed(() => themeStore.isDarkTheme);
		const isEnabled = computed(() => mouseStore.enabled);
		const trailLength = computed(() => mouseStore.trailLength);
		const trailSpeed = computed(() => mouseStore.trailSpeed);
		const trailSize = computed(() => mouseStore.trailSize);
		const trailMode = computed(() => mouseStore.trailMode);
		const trailColor = computed(() => mouseStore.trailColor);
		const trailChars = computed(() => mouseStore.trailChars);
		const throttle = (func, limit) => {
			let inThrottle;
			return function() {
				const args = arguments;
				const context = this;
				if (!inThrottle) {
					func.apply(context, args);
					inThrottle = true;
					setTimeout(() => inThrottle = false, limit);
				}
			};
		};
		const getColor = (index, total) => {
			if (trailMode.value === "fixed") return trailColor.value;
			else if (trailMode.value === "gradient") {
				const colors = isDarkTheme.value ? [
					"#ff6b6b",
					"#4ecdc4",
					"#45b7d1",
					"#96ceb4",
					"#ffeaa7"
				] : [
					"#e74c3c",
					"#3498db",
					"#2ecc71",
					"#f39c12",
					"#9b59b6"
				];
				const ratio = index / total;
				const colorIndex = Math.floor(ratio * colors.length);
				return colors[Math.min(colorIndex, colors.length - 1)];
			} else {
				const colors = isDarkTheme.value ? [
					"#ff6b6b",
					"#4ecdc4",
					"#45b7d1",
					"#96ceb4",
					"#ffeaa7"
				] : [
					"#e74c3c",
					"#3498db",
					"#2ecc71",
					"#f39c12",
					"#9b59b6"
				];
				return colors[Math.floor(Math.random() * colors.length)];
			}
		};
		const getRandomChar = () => {
			return trailChars.value.charAt(Math.floor(Math.random() * trailChars.value.length));
		};
		const updateTrail = (timestamp) => {
			if (!isBrowser.value || !isEnabled.value) return;
			if (timestamp - lastUpdate < trailSpeed.value) {
				animationId = requestAnimationFrame(updateTrail);
				return;
			}
			lastUpdate = timestamp;
			trail.value = trail.value.map((char) => {
				char.opacity -= .1;
				char.size -= .5;
				char.y -= 1;
				if (char.opacity <= 0 || char.size <= 0) return null;
				return char;
			}).filter(Boolean);
			if (!(timestamp - lastMoveTime > IDLE_TIMEOUT) && trail.value.length < trailLength.value) trail.value.push({
				id: charIdCounter++,
				char: getRandomChar(),
				x: mouseX,
				y: mouseY,
				opacity: 1,
				size: trailSize.value,
				color: getColor(trail.value.length, trailLength.value)
			});
			animationId = requestAnimationFrame(updateTrail);
		};
		const handleMouseMove = (e) => {
			if (!isBrowser.value || !isEnabled.value) return;
			const clientX = e.touches ? e.touches[0].clientX : e.clientX;
			const clientY = e.touches ? e.touches[0].clientY : e.clientY;
			mouseX = clientX;
			mouseY = clientY;
			lastMoveTime = performance.now();
		};
		const handleMouseLeave = () => {
			if (!isBrowser.value || !isEnabled.value) return;
			trail.value = [];
		};
		mouseMoveHandler = throttle(handleMouseMove, 10);
		onMounted(() => {
			isBrowser.value = true;
			document.addEventListener("mousemove", mouseMoveHandler);
			document.addEventListener("touchmove", mouseMoveHandler);
			document.addEventListener("mouseleave", handleMouseLeave);
			animationId = requestAnimationFrame(updateTrail);
			mouseStore.setDarkTheme(isDarkTheme.value);
		});
		onUnmounted(() => {
			document.removeEventListener("mousemove", mouseMoveHandler);
			document.removeEventListener("touchmove", mouseMoveHandler);
			document.removeEventListener("mouseleave", handleMouseLeave);
			if (animationId) cancelAnimationFrame(animationId);
		});
		watch(() => isDarkTheme.value, (newValue) => {
			mouseStore.setDarkTheme(newValue);
			trail.value = [];
		});
		watch(() => isEnabled.value, (newValue) => {
			if (!newValue) trail.value = [];
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (isBrowser.value && isEnabled.value) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "mouse-trail" }, _attrs))} data-v-e33cf883><!--[-->`);
				ssrRenderList(trail.value, (item) => {
					_push(`<span class="trail-char" style="${ssrRenderStyle({
						left: `${item.x}px`,
						top: `${item.y}px`,
						opacity: item.opacity,
						fontSize: `${item.size}px`,
						color: item.color,
						textShadow: `0 0 10px ${item.color}`,
						transition: "opacity 0.1s ease, transform 0.1s ease"
					})}" data-v-e33cf883>${ssrInterpolate(item.char)}</span>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region src/components/api/MouseTrail.vue
var _sfc_setup$3 = MouseTrail_vue_vue_type_script_setup_true_lang_default.setup;
MouseTrail_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/MouseTrail.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var MouseTrail_default = /* @__PURE__ */ _plugin_vue_export_helper_default(MouseTrail_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e33cf883"]]);
//#endregion
//#region src/components/media/ConsoleEasterEgg.vue?vue&type=script&setup=true&lang.ts
var asciiArt = `
  =======    ====   ====    ==== ====    ==========      ==========      ====  ====
 //           ||\\\\   ||      ||  //      ||       ||     ||       ||      ||    ||
//            || \\\\  ||      || //       ||=========     ||=========      ||    ||
\\\\            ||  \\\\ ||      || \\\\       ||   \\\\         ||   \\\\          ||    ||
 \\\\           ||   \\\\||      ||  \\\\      ||    \\\\        ||    \\\\         \\\\    //
  =======    ====   ====    ==== ====   ====   ====     ====    ====      ======
`;
var ConsoleEasterEgg_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ConsoleEasterEgg",
	__ssrInlineRender: true,
	setup(__props) {
		onMounted(() => {
			console.log("%c" + asciiArt, "color: #ff6b6b; font-weight: bold; font-size: 12px; line-height: 1.4;");
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "console-easter-egg" }, _attrs))} data-v-7230efb6></div>`);
		};
	}
});
//#endregion
//#region src/components/media/ConsoleEasterEgg.vue
var _sfc_setup$2 = ConsoleEasterEgg_vue_vue_type_script_setup_true_lang_default.setup;
ConsoleEasterEgg_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/ConsoleEasterEgg.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ConsoleEasterEgg_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ConsoleEasterEgg_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7230efb6"]]);
//#endregion
//#region src/components/p-center/ContextMenu.vue?vue&type=script&setup=true&lang.ts
var ContextMenu_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ContextMenu",
	__ssrInlineRender: true,
	setup(__props) {
		const router = useRouter();
		const visible = ref(false);
		const x = ref(0);
		const y = ref(0);
		const menuItems = [
			{
				icon: "home",
				label: "回首页",
				action: () => router.push("/")
			},
			{
				icon: "refresh",
				label: "刷新页面",
				action: () => location.reload()
			},
			{
				icon: "up",
				label: "返回顶部",
				action: () => window.scrollTo({
					top: 0,
					behavior: "smooth"
				})
			},
			{
				icon: "copy",
				label: "复制当前链接",
				action: () => navigator.clipboard.writeText(location.href)
			}
		];
		const closeMenu = () => {
			visible.value = false;
		};
		const handleContextMenu = (e) => {
			e.preventDefault();
			x.value = e.clientX;
			y.value = e.clientY;
			visible.value = true;
			adjustPosition();
		};
		const adjustPosition = () => {
			if (!visible.value) return;
			nextTick(() => {
				const menu = document.querySelector(".anime-context-menu");
				if (!menu) return;
				const rect = menu.getBoundingClientRect();
				if (x.value + rect.width > window.innerWidth) x.value -= rect.width;
				if (y.value + rect.height > window.innerHeight) y.value -= rect.height;
			});
		};
		const handleClick = () => closeMenu();
		const handleKeydown = (e) => {
			if (e.key === "Escape") closeMenu();
		};
		onMounted(() => {
			document.addEventListener("contextmenu", handleContextMenu);
			document.addEventListener("click", handleClick);
			document.addEventListener("keydown", handleKeydown);
		});
		onUnmounted(() => {
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKeydown);
		});
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderTeleport(_push, (_push) => {
				if (visible.value) {
					_push(`<div class="anime-context-menu" style="${ssrRenderStyle({
						left: `${x.value}px`,
						top: `${y.value}px`
					})}" data-v-e7281af3><div class="menu-header" data-v-e7281af3><span class="menu-title" data-v-e7281af3>菜单</span></div><div class="menu-divider" data-v-e7281af3></div><!--[-->`);
					ssrRenderList(menuItems, (item, index) => {
						_push(`<div class="menu-item" data-v-e7281af3>`);
						if (item.icon === "home") _push(`<svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-e7281af3><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" data-v-e7281af3></path><polyline points="9 22 9 12 15 12 15 22" data-v-e7281af3></polyline></svg>`);
						else if (item.icon === "refresh") _push(`<svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-e7281af3><polyline points="23 4 23 10 17 10" data-v-e7281af3></polyline><polyline points="1 20 1 14 7 14" data-v-e7281af3></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" data-v-e7281af3></path></svg>`);
						else if (item.icon === "up") _push(`<svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-e7281af3><polyline points="18 15 12 9 6 15" data-v-e7281af3></polyline></svg>`);
						else if (item.icon === "copy") _push(`<svg class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-e7281af3><rect x="9" y="9" width="13" height="13" rx="2" ry="2" data-v-e7281af3></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" data-v-e7281af3></path></svg>`);
						else _push(`<!---->`);
						_push(`<span class="menu-label" data-v-e7281af3>${ssrInterpolate(item.label)}</span></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
		};
	}
});
//#endregion
//#region src/components/p-center/ContextMenu.vue
var _sfc_setup$1 = ContextMenu_vue_vue_type_script_setup_true_lang_default.setup;
ContextMenu_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ContextMenu.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ContextMenu_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ContextMenu_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e7281af3"]]);
//#endregion
//#region src/App.vue?vue&type=script&setup=true&lang.ts
var App_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "App",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const isIndexPage = computed(() => route.path === "/");
		const isTerminalPage = computed(() => route.path === "/terminal");
		const themeStore = useThemeStore();
		computed(() => themeStore.isDark);
		const progressWidth = ref("0%");
		const progressVisible = ref(false);
		let progressTimer = null;
		router.beforeEach((_to, _from, next) => {
			progressVisible.value = true;
			progressWidth.value = "5%";
			next();
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					progressWidth.value = "70%";
				});
			});
		});
		router.afterEach(() => {
			progressWidth.value = "100%";
			if (progressTimer) clearTimeout(progressTimer);
			progressTimer = setTimeout(() => {
				progressVisible.value = false;
				progressWidth.value = "0%";
			}, 400);
		});
		router.onError(() => {
			progressVisible.value = false;
		});
		onMounted(() => {
			themeStore.initTheme();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_router_view = resolveComponent("router-view");
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "app" }, _attrs))} data-v-4567c91a>`);
			if (progressVisible.value) _push(`<div class="page-progress-bar" data-v-4567c91a><div class="page-progress-fill" style="${ssrRenderStyle({ width: progressWidth.value })}" data-v-4567c91a></div></div>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(WebAnalytics_default, null, null, _parent));
			_push(ssrRenderComponent(unref(SpeedInsights), null, null, _parent));
			_push(ssrRenderComponent(unref(Analytics), null, null, _parent));
			_push(ssrRenderComponent(NotificationRender_default, null, null, _parent));
			_push(ssrRenderComponent(ConsoleEasterEgg_default, null, null, _parent));
			_push(ssrRenderComponent(ContextMenu_default, null, null, _parent));
			_push(ssrRenderComponent(MouseTrail_default, null, null, _parent));
			if (!isIndexPage.value && !isTerminalPage.value) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(Header_default, null, null, _parent));
				_push(`<main class="mid-flex" data-v-4567c91a>`);
				_push(ssrRenderComponent(Sidebar_default, null, null, _parent));
				_push(ssrRenderComponent(Center_default, null, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(ssrRenderComponent(_component_router_view, { key: unref(route).fullPath }, null, _parent, _scopeId));
						else return [(openBlock(), createBlock(_component_router_view, { key: unref(route).fullPath }))];
					}),
					_: 1
				}, _parent));
				_push(`</main>`);
				_push(ssrRenderComponent(Footer_default, null, null, _parent));
				_push(`<!--]-->`);
			} else _push(ssrRenderComponent(_component_router_view, { key: unref(route).fullPath }, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/App.vue
var _sfc_setup = App_vue_vue_type_script_setup_true_lang_default.setup;
App_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var App_default = /* @__PURE__ */ _plugin_vue_export_helper_default(App_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4567c91a"]]);
//#endregion
//#region src/router/index.ts
var routes = [
	{
		path: "/",
		name: "Index",
		component: () => import("./assets/pages-D_BMOYd3.js")
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("./assets/Home-DhhYwW28.js")
	},
	{
		path: "/about",
		name: "About",
		component: () => import("./assets/About-m8v9xHtP.js")
	},
	{
		path: "/archives",
		name: "Archives",
		component: () => import("./assets/Archives-D40QfkOV.js")
	},
	{
		path: "/links",
		name: "Links",
		component: () => import("./assets/Links-DI6c779n.js")
	},
	{
		path: "/projects",
		name: "Projects",
		component: () => import("./assets/Projects-C-ZV_ovG.js")
	},
	{
		path: "/post/:id",
		name: "Post",
		component: () => import("./assets/Post-eAfDUjmG.js")
	},
	{
		path: "/project/:id",
		name: "Project",
		component: () => import("./assets/ProjectDetail-CytDXrTk.js")
	},
	{
		path: "/timeline",
		name: "Timeline",
		component: () => import("./assets/Timeline-Dh95aBcs.js")
	},
	{
		path: "/search",
		name: "Search",
		component: () => import("./assets/SearchPage-CyJieUzT.js")
	},
	{
		path: "/links/apply",
		name: "LinkApply",
		component: () => import("./assets/LinkApply-DoKLDt3J.js")
	},
	{
		path: "/settings",
		name: "Settings",
		component: () => import("./assets/Settings-DBKR2T25.js")
	},
	{
		path: "/changelog",
		name: "Changelog",
		component: () => import("./assets/Changelog-CcOhezLF.js")
	},
	{
		path: "/:pathMatch(.*)*",
		name: "NotFound",
		component: () => import("./assets/NotFound-CnixRg4d.js")
	}
];
var createAppHistory = () => {
	return createMemoryHistory();
};
var scrollToTop = () => {
	if (typeof document !== "undefined") {
		const el = document.querySelector(".center-card-content");
		if (el) el.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
};
function createAppRouter() {
	return createRouter({
		history: createAppHistory(),
		routes,
		scrollBehavior() {
			scrollToTop();
		}
	});
}
//#endregion
//#region src/main.ts
function createApp() {
	const vueApp = createApp$1(App_default);
	const head = createHead();
	const router = createAppRouter();
	vueApp.use(head);
	vueApp.use(router);
	vueApp.use(pinia);
	return {
		app: vueApp,
		router,
		head
	};
}
//#endregion
export { createApp };
