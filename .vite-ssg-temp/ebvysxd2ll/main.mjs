import { d as useDynamicEffectsStore, f as useAudioStore, i as useArticlesStore, m as useNotificationStore, p as useMouseStore, r as useMusicStore, t as pinia, v as useThemeStore } from "./assets/stores-D5XJjRmy.js";
import { t as _plugin_vue_export_helper_default } from "./assets/_plugin-vue_export-helper-DMwexRDj.js";
import { computed, createApp as createApp$1, createBlock, createTextVNode, createVNode, defineComponent, mergeProps, nextTick, onMounted, onUnmounted, openBlock, ref, resolveComponent, unref, useSSRContext, watch, withCtx } from "vue";
import { createHead } from "@vueuse/head";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrRenderStyle, ssrRenderTeleport } from "vue/server-renderer";
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "logo-card" }, _attrs))} data-v-6064a02c>`);
			_push(ssrRenderComponent(_component_router_link, { to: "/" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<h1 data-v-6064a02c${_scopeId}>Cnkrru</h1>`);
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
var _sfc_setup$33 = Logo_vue_vue_type_script_setup_true_lang_default.setup;
Logo_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/Logo.vue");
	return _sfc_setup$33 ? _sfc_setup$33(props, ctx) : void 0;
};
var Logo_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Logo_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6064a02c"]]);
//#endregion
//#region src/assets/imgs/svg/theme-toggle.svg
var theme_toggle_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20class='icon%20icon-tabler%20icon-tabler-moon-sun'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20stroke-width='2'%20stroke='currentColor'%20fill='none'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpath%20stroke='none'%20d='M0%200h24v24H0z'%20fill='none'/%3e%3cpath%20d='M21%2012.79A9%209%200%201%201%2011.21%203%207%207%200%200%200%2021%2012.79z'/%3e%3cpath%20d='M12%209v4l3%203'/%3e%3c/svg%3e";
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
				"aria-label": isDarkTheme.value ? "切换到亮色主题" : "切换到暗色主题",
				role: "button",
				tabindex: "0"
			}, _attrs))} data-v-401da179><img${ssrRenderAttr("src", theme_toggle_default)} alt="" data-v-401da179>`);
			if (isAnimating.value) _push(`<span class="emoji-burst" data-v-401da179>✨</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/ThemeToggle.vue
var _sfc_setup$32 = ThemeToggle_vue_vue_type_script_setup_true_lang_default.setup;
ThemeToggle_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/ThemeToggle.vue");
	return _sfc_setup$32 ? _sfc_setup$32(props, ctx) : void 0;
};
var ThemeToggle_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ThemeToggle_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-401da179"]]);
//#endregion
//#region src/assets/imgs/svg/book.svg
var book_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpath%20d='M4%2019.5v-15A2.5%202.5%200%200%201%206.5%202H20v20H6.5a2.5%202.5%200%200%201%200-5H20'/%3e%3c/svg%3e";
//#endregion
//#region src/components/p-header/ImmersiveReading.vue?vue&type=script&setup=true&lang.ts
var ImmersiveReading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ImmersiveReading",
	__ssrInlineRender: true,
	setup(__props) {
		const isAnimating = ref(false);
		const router = useRouter();
		onMounted(() => {
			router.afterEach(() => {
				document.body.classList.remove("immersive-reading");
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["button-style immersive-btn", { animating: isAnimating.value }] }, _attrs))}><img${ssrRenderAttr("src", book_default)} alt="沉浸式阅读">`);
			if (isAnimating.value) _push(`<span class="emoji-burst">✨</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/ImmersiveReading.vue
var _sfc_setup$31 = ImmersiveReading_vue_vue_type_script_setup_true_lang_default.setup;
ImmersiveReading_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/ImmersiveReading.vue");
	return _sfc_setup$31 ? _sfc_setup$31(props, ctx) : void 0;
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
var _sfc_setup$30 = ReadingProgress_vue_vue_type_script_setup_true_lang_default.setup;
ReadingProgress_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/ReadingProgress.vue");
	return _sfc_setup$30 ? _sfc_setup$30(props, ctx) : void 0;
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
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "search-results" }, _attrs))} data-v-b90b3632>`);
				if (__props.results.length === 0) _push(`<div class="search-empty" data-v-b90b3632> 搜索: &quot;${ssrInterpolate(unref(escapeHtml)(__props.searchText))}&quot; - 未找到结果 </div>`);
				else {
					_push(`<!--[--><div class="search-counter" data-v-b90b3632>${ssrInterpolate(__props.results.length)} 个结果 </div><!--[-->`);
					ssrRenderList(__props.results, (item) => {
						_push(`<div class="search-result-item" data-v-b90b3632><div class="result-title" data-v-b90b3632>${unref(highlightMatch)(unref(escapeHtml)(item.title), __props.searchText) ?? ""}</div><div class="result-meta" data-v-b90b3632> 分类: <span data-v-b90b3632>${unref(highlightMatch)(unref(escapeHtml)(item.category || ""), __props.searchText) ?? ""}</span> | ID: <span data-v-b90b3632>${unref(highlightMatch)(unref(escapeHtml)(item.id), __props.searchText) ?? ""}</span></div>`);
						if (item.tags && item.tags.length > 0) {
							_push(`<div class="result-tags" data-v-b90b3632><!--[-->`);
							ssrRenderList(item.tags, (tag) => {
								_push(`<span class="tag" data-v-b90b3632>${ssrInterpolate(tag)}</span>`);
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
var _sfc_setup$29 = SearchResults_vue_vue_type_script_setup_true_lang_default.setup;
SearchResults_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/SearchResults.vue");
	return _sfc_setup$29 ? _sfc_setup$29(props, ctx) : void 0;
};
var SearchResults_default = /* @__PURE__ */ _plugin_vue_export_helper_default(SearchResults_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b90b3632"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "search-card search-container" }, _attrs))} data-v-a30f9ba7><input type="text" placeholder="搜索"${ssrRenderAttr("value", searchText.value)} data-v-a30f9ba7>`);
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
var _sfc_setup$28 = Search_vue_vue_type_script_setup_true_lang_default.setup;
Search_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/Search.vue");
	return _sfc_setup$28 ? _sfc_setup$28(props, ctx) : void 0;
};
var Search_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Search_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-a30f9ba7"]]);
//#endregion
//#region src/assets/imgs/svg/music-player.svg
var music_player_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20class='icon%20icon-tabler%20icon-tabler-music'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20stroke-width='2'%20stroke='currentColor'%20fill='none'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpath%20stroke='none'%20d='M0%200h24v24H0z'%20fill='none'/%3e%3cpath%20d='M9%2018V5l12%20-2v13'/%3e%3ccircle%20cx='6'%20cy='18'%20r='3'/%3e%3ccircle%20cx='18'%20cy='16'%20r='3'/%3e%3c/svg%3e";
//#endregion
//#region src/assets/imgs/svg/playlist.svg
var playlist_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpath%20d='M21%2015V6'%3e%3c/path%3e%3cpath%20d='M18.5%2018a2.5%202.5%200%201%200%200-5%202.5%202.5%200%200%200%200%205z'%3e%3c/path%3e%3cpath%20d='M12%2012H3'%3e%3c/path%3e%3cpath%20d='M16%206H3'%3e%3c/path%3e%3cpath%20d='M12%2018H3'%3e%3c/path%3e%3c/svg%3e";
//#endregion
//#region src/assets/imgs/svg/prev.svg
var prev_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpolygon%20points='19%2020%209%2012%2019%204%2019%2020'%3e%3c/polygon%3e%3c/svg%3e";
//#endregion
//#region src/assets/imgs/svg/play.svg
var play_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpolygon%20points='5%203%2019%2012%205%2021%205%203'%3e%3c/polygon%3e%3c/svg%3e";
//#endregion
//#region src/assets/imgs/svg/pause.svg
var pause_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3crect%20x='6'%20y='4'%20width='4'%20height='16'%3e%3c/rect%3e%3crect%20x='14'%20y='4'%20width='4'%20height='16'%3e%3c/rect%3e%3c/svg%3e";
//#endregion
//#region src/assets/imgs/svg/next.svg
var next_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpolygon%20points='5%204%2015%2012%205%2020%205%204'%3e%3c/polygon%3e%3c/svg%3e";
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "player-controls" }, _attrs))}><button type="button" class="control-btn" aria-label="上一首" title="上一首"><img${ssrRenderAttr("src", prev_default)} alt="上一首"></button><button type="button" class="${ssrRenderClass([{ playing: __props.isPlaying }, "control-btn play-btn"])}" aria-label="播放" title="播放/暂停"><img class="play-icon"${ssrRenderAttr("src", play_default)} alt="播放"><img class="pause-icon"${ssrRenderAttr("src", pause_default)} alt="暂停"></button><button type="button" class="control-btn" aria-label="下一首" title="下一首"><img${ssrRenderAttr("src", next_default)} alt="下一首"></button></div>`);
		};
	}
});
//#endregion
//#region src/components/media/PlayerControls.vue
var _sfc_setup$27 = PlayerControls_vue_vue_type_script_setup_true_lang_default.setup;
PlayerControls_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerControls.vue");
	return _sfc_setup$27 ? _sfc_setup$27(props, ctx) : void 0;
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
var _sfc_setup$26 = PlayerProgress_vue_vue_type_script_setup_true_lang_default.setup;
PlayerProgress_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerProgress.vue");
	return _sfc_setup$26 ? _sfc_setup$26(props, ctx) : void 0;
};
var PlayerProgress_default = PlayerProgress_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/assets/imgs/svg/volume.svg
var volume_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpolygon%20points='11%205%206%209%202%209%202%2015%206%2015%2011%2019%2011%205'%3e%3c/polygon%3e%3cpath%20d='M15.54%208.46a5%205%200%200%201%200%207.07'%3e%3c/path%3e%3cpath%20d='M19.07%204.93a10%2010%200%200%201%200%2014.14'%3e%3c/path%3e%3c/svg%3e";
//#endregion
//#region src/assets/imgs/svg/volume-low.svg
var volume_low_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpolygon%20points='11%205%206%209%202%209%202%2015%206%2015%2011%2019%2011%205'%3e%3c/polygon%3e%3cpath%20d='M15.54%208.46a5%205%200%200%201%200%207.07'%3e%3c/path%3e%3c/svg%3e";
//#endregion
//#region src/assets/imgs/svg/mute.svg
var mute_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cpolygon%20points='11%205%206%209%202%209%202%2015%206%2015%2011%2019%2011%205'%3e%3c/polygon%3e%3cline%20x1='23'%20y1='9'%20x2='17'%20y2='15'%3e%3c/line%3e%3cline%20x1='17'%20y1='9'%20x2='23'%20y2='15'%3e%3c/line%3e%3c/svg%3e";
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "player-volume" }, _attrs))}><button type="button" id="player-volume-btn" class="${ssrRenderClass([{ muted: __props.isMuted }, "control-btn"])}" aria-label="音量" title="音量控制"><img class="volume-icon"${ssrRenderAttr("src", volume_default)} alt="音量"><img class="volume-low-icon"${ssrRenderAttr("src", volume_low_default)} alt="低音量"><img class="mute-icon"${ssrRenderAttr("src", mute_default)} alt="静音"></button><div class="volume-bar"><div id="volume-fill" class="volume-fill" style="${ssrRenderStyle({ width: `${__props.isMuted ? 0 : __props.volume * 100}%` })}"></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/media/PlayerVolume.vue
var _sfc_setup$25 = PlayerVolume_vue_vue_type_script_setup_true_lang_default.setup;
PlayerVolume_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerVolume.vue");
	return _sfc_setup$25 ? _sfc_setup$25(props, ctx) : void 0;
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["player-playlist", { active: __props.isVisible }] }, _attrs))}><div class="playlist-container"><div class="playlist-header"><h3>音乐列表</h3><button type="button" class="close-btn" aria-label="关闭列表" title="关闭列表"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button></div><div class="playlist-content"><ul class="playlist-items"><!--[-->`);
			ssrRenderList(__props.playlist, (song, index) => {
				_push(`<li class="${ssrRenderClass({ active: index === __props.currentIndex })}"><img${ssrRenderAttr("src", song.cover)}${ssrRenderAttr("alt", song.title + " 封面")}><div class="playlist-item-info"><div class="playlist-item-title">${ssrInterpolate(song.title)}</div><div class="playlist-item-artist">${ssrInterpolate(song.artist)}</div></div><div class="playlist-item-status">${ssrInterpolate(index === __props.currentIndex ? "▶" : "")}</div></li>`);
			});
			_push(`<!--]--></ul></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/media/PlayerPlaylist.vue
var _sfc_setup$24 = PlayerPlaylist_vue_vue_type_script_setup_true_lang_default.setup;
PlayerPlaylist_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/PlayerPlaylist.vue");
	return _sfc_setup$24 ? _sfc_setup$24(props, ctx) : void 0;
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
		getAnalyser: {
			type: [Function, null],
			default: null
		}
	},
	setup(__props) {
		const props = __props;
		const audioStore = useAudioStore();
		const enabled = computed(() => audioStore.visualizerEnabled);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["audio-visualizer", { hidden: !enabled.value }] }, _attrs))} data-v-b786bcbb><canvas class="visualizer-canvas" data-v-b786bcbb></canvas></div>`);
		};
	}
});
//#endregion
//#region src/components/media/AudioVisualizer.vue
var _sfc_setup$23 = AudioVisualizer_vue_vue_type_script_setup_true_lang_default.setup;
AudioVisualizer_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/AudioVisualizer.vue");
	return _sfc_setup$23 ? _sfc_setup$23(props, ctx) : void 0;
};
var AudioVisualizer_default = /* @__PURE__ */ _plugin_vue_export_helper_default(AudioVisualizer_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b786bcbb"]]);
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
		}
	},
	emits: ["effect-change", "close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const audioStore = useAudioStore();
		const effectsEnabled = computed(() => audioStore.effectsEnabled);
		const visualizerEnabled = computed(() => audioStore.visualizerEnabled);
		const currentSurroundMode = computed(() => audioStore.currentSurroundMode);
		const currentEqPreset = computed(() => audioStore.currentEqPreset);
		const surroundModes = computed(() => audioStore.surroundModes);
		const eqPresets = computed(() => audioStore.eqPresets);
		const isExpanded = ref(false);
		watch(() => props.isPlaying, (playing) => {
			if (!playing) isExpanded.value = false;
		});
		watch(() => props.isVisible, (visible) => {
			isExpanded.value = visible;
		});
		onMounted(() => {
			audioStore.initAudio();
		});
		onUnmounted(() => {});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["audio-effects", {
				expanded: isExpanded.value,
				enabled: effectsEnabled.value
			}] }, _attrs))} data-v-6ee6148d><div class="effects-panel" style="${ssrRenderStyle(isExpanded.value ? null : { display: "none" })}" data-v-6ee6148d><div class="effects-header" data-v-6ee6148d><h4 data-v-6ee6148d>音效设置</h4><div class="header-actions" data-v-6ee6148d><button class="${ssrRenderClass([{ active: effectsEnabled.value }, "enable-btn"])}" data-v-6ee6148d>${ssrInterpolate(effectsEnabled.value ? "已启用" : "已关闭")}</button><button class="close-btn" title="关闭" data-v-6ee6148d><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" data-v-6ee6148d><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" data-v-6ee6148d></path></svg></button></div></div><div class="${ssrRenderClass([{ disabled: !effectsEnabled.value }, "effects-content"])}" data-v-6ee6148d><div class="effect-section" data-v-6ee6148d><div class="visualizer-toggle" data-v-6ee6148d><label class="effect-label" data-v-6ee6148d>音频可视化</label><button class="${ssrRenderClass([{ active: visualizerEnabled.value }, "visualizer-btn"])}" data-v-6ee6148d>${ssrInterpolate(visualizerEnabled.value ? "已开启" : "已关闭")}</button></div></div><div class="effect-section" data-v-6ee6148d><label class="effect-label" data-v-6ee6148d>环绕模式</label><div class="surround-modes" data-v-6ee6148d><!--[-->`);
			ssrRenderList(surroundModes.value, (mode) => {
				_push(`<button class="${ssrRenderClass([{ active: currentSurroundMode.value === mode.value }, "mode-btn"])}"${ssrIncludeBooleanAttr(!effectsEnabled.value) ? " disabled" : ""} data-v-6ee6148d>${ssrInterpolate(mode.label)}</button>`);
			});
			_push(`<!--]--></div></div><div class="effect-section" data-v-6ee6148d><label class="effect-label" data-v-6ee6148d>均衡器</label><div class="eq-presets" data-v-6ee6148d><!--[-->`);
			ssrRenderList(eqPresets.value, (preset) => {
				_push(`<button class="${ssrRenderClass([{ active: currentEqPreset.value === preset.value }, "preset-btn"])}"${ssrIncludeBooleanAttr(!effectsEnabled.value) ? " disabled" : ""} data-v-6ee6148d>${ssrInterpolate(preset.label)}</button>`);
			});
			_push(`<!--]--></div></div></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/media/AudioEffects.vue
var _sfc_setup$22 = AudioEffects_vue_vue_type_script_setup_true_lang_default.setup;
AudioEffects_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/AudioEffects.vue");
	return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
var AudioEffects_default = /* @__PURE__ */ _plugin_vue_export_helper_default(AudioEffects_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6ee6148d"]]);
//#endregion
//#region src/components/media/MusicPlayerStyles.vue
var _sfc_main$2 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {}
var _sfc_setup$21 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/MusicPlayerStyles.vue");
	return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
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
			if (!isEffectsVisible.value) {
				effectsEnabled.value = false;
				handleEffectsChange({
					enabled: false,
					surroundMode: "off",
					eqPreset: "flat",
					visualizerEnabled: visualizerEnabled.value
				});
			}
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
			_push(`<div data-v-877bdb16>`);
			_push(ssrRenderComponent(AudioVisualizer_default, {
				"is-playing": isPlaying.value,
				"get-analyser": getAnalyser,
				enabled: visualizerEnabled.value
			}, null, _parent));
			_push(`<div id="music-player-btn" class="${ssrRenderClass([{ animating: isBtnAnimating.value }, "button-style music-player-btn"])}" title="音乐播放" role="button" tabindex="0" aria-label="打开音乐播放器" data-v-877bdb16><img${ssrRenderAttr("src", music_player_default)} alt="音乐播放" data-v-877bdb16>`);
			if (isBtnAnimating.value) _push(`<span class="emoji-burst" data-v-877bdb16>✨</span>`);
			else _push(`<!---->`);
			_push(`</div><div id="global-music-player" class="global-music-player" data-v-877bdb16><div class="player-content" data-v-877bdb16><div class="player-cover" data-v-877bdb16><img id="player-cover"${ssrRenderAttr("src", "")} alt="封面" data-v-877bdb16></div><div class="player-meta" data-v-877bdb16><h4 id="player-title" data-v-877bdb16>未选择歌曲</h4><p id="player-artist" data-v-877bdb16>未知艺术家</p></div>`);
			_push(ssrRenderComponent(PlayerProgress_default, {
				"current-time": currentTime.value,
				duration: duration.value,
				"progress-percent": progressPercent.value,
				onSeek: handleSeek
			}, null, _parent));
			_push(ssrRenderComponent(PlayerControls_default, {
				"is-playing": isPlaying.value,
				"current-song": currentSong.value,
				onTogglePlay: togglePlay,
				onPrev: prevSong,
				onNext: nextSong
			}, null, _parent));
			_push(ssrRenderComponent(PlayerVolume_default, {
				volume: volume.value,
				"is-muted": isMuted.value,
				onAdjustVolume: handleVolumeChange,
				onToggleMute: toggleMute
			}, null, _parent));
			_push(`<div class="player-list" data-v-877bdb16><button type="button" class="control-btn list-btn" aria-label="音乐列表" title="音乐列表" data-v-877bdb16><img${ssrRenderAttr("src", playlist_default)} alt="音乐列表" data-v-877bdb16></button></div><div class="player-effects" data-v-877bdb16><button type="button" class="${ssrRenderClass([{ active: isEffectsVisible.value || effectsEnabled.value }, "control-btn effects-btn"])}" aria-label="音效" title="音效设置" data-v-877bdb16><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" data-v-877bdb16><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="currentColor" stroke-width="2" fill="none" data-v-877bdb16></path></svg></button></div></div></div>`);
			_push(ssrRenderComponent(AudioEffects_default, {
				"audio-context": getAudioContext(),
				"is-playing": isPlaying.value,
				"is-visible": isEffectsVisible.value,
				onEffectChange: handleEffectsChange,
				onClose: toggleEffects
			}, null, _parent));
			_push(ssrRenderComponent(PlayerPlaylist_default, {
				playlist: playlist.value,
				"current-index": currentIndex.value,
				"is-visible": isPlaylistVisible.value,
				onSelect: handleSelectSong,
				onClose: closePlaylist
			}, null, _parent));
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region src/components/media/MusicPlay.vue
var _sfc_setup$20 = MusicPlay_vue_vue_type_script_setup_true_lang_default.setup;
MusicPlay_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/MusicPlay.vue");
	return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
var MusicPlay_default = /* @__PURE__ */ _plugin_vue_export_helper_default(MusicPlay_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-877bdb16"]]);
//#endregion
//#region src/assets/imgs/svg/order.svg
var order_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cline%20x1='3'%20y1='6'%20x2='21'%20y2='6'%3e%3c/line%3e%3cline%20x1='3'%20y1='12'%20x2='21'%20y2='12'%3e%3c/line%3e%3cline%20x1='3'%20y1='18'%20x2='21'%20y2='18'%3e%3c/line%3e%3c/svg%3e";
//#endregion
//#region src/components/p-header/MobileMenu.vue?vue&type=script&setup=true&lang.ts
var MobileMenu_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MobileMenu",
	__ssrInlineRender: true,
	setup(__props) {
		const isMenuOpen = ref(false);
		const isAnimating = ref(false);
		const closeMobileMenu = () => {
			isMenuOpen.value = false;
			updateDOM();
		};
		const updateDOM = () => {
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
			if (event.key === "Escape" && isMenuOpen.value) closeMobileMenu();
		};
		onMounted(() => {
			if (typeof document !== "undefined") document.addEventListener("keydown", handleKeydown);
		});
		onUnmounted(() => {
			if (typeof document !== "undefined") document.removeEventListener("keydown", handleKeydown);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "mobile-menu-container" }, _attrs))} data-v-39e99709><div id="mobile-menu-toggle" class="${ssrRenderClass([{ animating: isAnimating.value }, "button-style mobile-menu-toggle"])}" data-v-39e99709><img${ssrRenderAttr("src", order_default)} alt="菜单" data-v-39e99709>`);
			if (isAnimating.value) _push(`<span class="emoji-burst" data-v-39e99709>✨</span>`);
			else _push(`<!---->`);
			_push(`</div><div class="mobile-menu-overlay" id="mobile-menu-overlay" data-v-39e99709></div></div>`);
		};
	}
});
//#endregion
//#region src/components/p-header/MobileMenu.vue
var _sfc_setup$19 = MobileMenu_vue_vue_type_script_setup_true_lang_default.setup;
MobileMenu_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/MobileMenu.vue");
	return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
var MobileMenu_default = /* @__PURE__ */ _plugin_vue_export_helper_default(MobileMenu_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-39e99709"]]);
//#endregion
//#region src/assets/imgs/svg/kaiguan.svg
var kaiguan_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20class='icon'%20width='200px'%20height='200.00px'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M652.899%20189.266c-16.036-7.058-34.761%200.22-41.82%2016.258-7.059%2016.038%200.221%2034.761%2016.258%2041.819%20104.649%2046.06%20172.27%20149.682%20172.27%20263.991%200%2077-29.986%20149.392-84.434%20203.839s-126.839%2084.434-203.839%2084.434-149.393-29.986-203.84-84.434c-54.448-54.447-84.433-126.839-84.433-203.839%200-114.963%2068.159-218.821%20173.642-264.591%2016.075-6.975%2023.451-25.659%2016.477-41.733-6.975-16.075-25.662-23.452-41.734-16.477-128.688%2055.837-211.839%20182.544-211.839%20322.8%200%2047.469%209.304%2093.535%2027.653%20136.917%2017.717%2041.887%2043.073%2079.499%2075.365%20111.791%2032.292%2032.291%2069.903%2057.647%20111.791%2075.364%2043.383%2018.35%2089.449%2027.653%20136.918%2027.653%2047.468%200%2093.535-9.304%20136.917-27.653%2041.888-17.717%2079.499-43.073%20111.791-75.364%2032.291-32.292%2057.647-69.904%2075.364-111.791%2018.35-43.383%2027.653-89.448%2027.653-136.917%200.001-139.458-82.493-265.877-210.16-322.067z'%20/%3e%3cpath%20d='M512%20479.517c17.522%200%2031.727-14.205%2031.727-31.727V128.228c0-17.522-14.204-31.727-31.727-31.727s-31.727%2014.205-31.727%2031.727V447.79c0%2017.522%2014.205%2031.727%2031.727%2031.727z'%20/%3e%3c/svg%3e";
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
		const getSnowflakeStyle = (index) => {
			return {
				left: `${Math.random() * 100}%`,
				animationDelay: `${Math.random() * 5}s`,
				animationDuration: `${5 + Math.random() * 10}s`,
				opacity: .5 + Math.random() * .5,
				transform: `scale(${.5 + Math.random() * 1})`
			};
		};
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
			_push(`<!--[--><div class="${ssrRenderClass([{ animating: isAnimating.value }, "button-style"])}"${ssrRenderAttr("title", isEffectEnabled.value ? "关闭动态效果" : "开启动态效果")} data-v-5a40dc13><img${ssrRenderAttr("src", kaiguan_default)} alt="切换动态效果" data-v-5a40dc13>`);
			if (isAnimating.value) _push(`<span class="emoji-burst" data-v-5a40dc13>✨</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (isEffectEnabled.value && !isDarkMode.value) _push(`<div class="sakura-container" data-v-5a40dc13></div>`);
			else _push(`<!---->`);
			if (isEffectEnabled.value && isDarkMode.value) {
				_push(`<div class="snow-container" data-v-5a40dc13><!--[-->`);
				ssrRenderList(30, (i) => {
					_push(`<div class="snowflake" style="${ssrRenderStyle(getSnowflakeStyle(i))}" data-v-5a40dc13></div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/components/p-header/DynamicEffectControl.vue
var _sfc_setup$18 = DynamicEffectControl_vue_vue_type_script_setup_true_lang_default.setup;
DynamicEffectControl_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-header/DynamicEffectControl.vue");
	return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
var DynamicEffectControl_default = /* @__PURE__ */ _plugin_vue_export_helper_default(DynamicEffectControl_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5a40dc13"]]);
//#endregion
//#region src/components/Header.vue?vue&type=script&setup=true&lang.ts
var Header_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Header",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		onMounted(() => {});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-833991dd>`);
			_push(ssrRenderComponent(ReadingProgress_default, null, null, _parent));
			_push(`<header class="header-flex" data-v-833991dd><div class="header-S" data-v-833991dd><nav class="header-container" data-v-833991dd><div class="header-card" data-v-833991dd>`);
			_push(ssrRenderComponent(Logo_default, null, null, _parent));
			_push(ssrRenderComponent(Search_default, null, null, _parent));
			_push(`<div class="button-class-card" data-v-833991dd>`);
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
var _sfc_setup$17 = Header_vue_vue_type_script_setup_true_lang_default.setup;
Header_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Header.vue");
	return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
var Header_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Header_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-833991dd"]]);
//#endregion
//#region src/assets/imgs/avator.jpg
var avator_default = "/assets/avator-oy7ngIvp.jpg";
//#endregion
//#region src/components/p-sidebar/Avatar.vue
var _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "avator-card" }, _attrs))} data-v-cfa9600b><img${ssrRenderAttr("src", avator_default)} alt="Cnkrru的头像" data-v-cfa9600b></div>`);
}
var _sfc_setup$16 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-sidebar/Avatar.vue");
	return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
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
var _sfc_setup$15 = WelcomeSaying_vue_vue_type_script_setup_true_lang_default.setup;
WelcomeSaying_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-sidebar/WelcomeSaying.vue");
	return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
var WelcomeSaying_default = /* @__PURE__ */ _plugin_vue_export_helper_default(WelcomeSaying_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-33a79c92"]]);
//#endregion
//#region src/components/p-sidebar/PageLinks.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_router_link = resolveComponent("router-link");
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "page-list-card" }, _attrs))} data-v-88f11e62><ul data-v-88f11e62><li data-v-88f11e62>`);
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
	_push(`</li><li data-v-88f11e62>`);
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
	_push(`</li><li data-v-88f11e62>`);
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
	_push(`</li><li data-v-88f11e62>`);
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
	_push(`</li><li data-v-88f11e62>`);
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
	_push(`</li><li data-v-88f11e62>`);
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
	_push(`</li><li data-v-88f11e62>`);
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
	_push(`</li><li data-v-88f11e62>`);
	_push(ssrRenderComponent(_component_router_link, {
		to: "/rss.xml",
		target: "_blank",
		rel: "noopener noreferrer",
		class: "page-card"
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` RSS `);
			else return [createTextVNode(" RSS ")];
		}),
		_: 1
	}, _parent));
	_push(`</li></ul></div>`);
}
var _sfc_setup$14 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-sidebar/PageLinks.vue");
	return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
var PageLinks_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-88f11e62"]]);
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
		const weatherIcons = {
			sunny: "☀️",
			partly_cloudy: "⛅",
			cloudy: "☁️",
			rainy: "️",
			snowy: "❄️",
			thunderstorm: "⛈️",
			foggy: "🌫️",
			unknown: "🌡️"
		};
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
		const getWeatherIcon = (code) => {
			if (code === 0) return weatherIcons.sunny;
			if (code <= 3) return weatherIcons.partly_cloudy;
			if (code <= 49) return weatherIcons.foggy;
			if (code <= 59) return weatherIcons.rainy;
			if (code <= 69) return weatherIcons.snowy;
			if (code <= 79) return weatherIcons.rainy;
			if (code <= 82) return weatherIcons.rainy;
			if (code <= 86) return weatherIcons.snowy;
			if (code <= 99) return weatherIcons.thunderstorm;
			return weatherIcons.unknown;
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
					weatherText: getWeatherText(weatherData.current.weather_code),
					weatherIcon: getWeatherIcon(weatherData.current.weather_code)
				};
			} catch (err) {
				error.value = "加载失败";
				console.warn("天气加载失败:", err);
				weather.value = {
					temperature: 20,
					weatherCode: 0,
					weatherText: "晴",
					weatherIcon: weatherIcons.sunny
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "weather-mini" }, _attrs))} data-v-7a04d0cc>`);
			if (loading.value || error.value) _push(`<div class="weather-loading" data-v-7a04d0cc><span data-v-7a04d0cc>天气之子失踪了……</span></div>`);
			else if (weather.value) _push(`<div class="weather-content" data-v-7a04d0cc><span class="weather-icon" data-v-7a04d0cc>${ssrInterpolate(weather.value.weatherIcon)}</span><span class="weather-temp" data-v-7a04d0cc>${ssrInterpolate(weather.value.temperature)}°</span><span class="weather-city" data-v-7a04d0cc>${ssrInterpolate(locationInfo.value.city)}</span></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/api/Weather.vue
var _sfc_setup$13 = Weather_vue_vue_type_script_setup_true_lang_default.setup;
Weather_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/Weather.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
var Weather_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Weather_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7a04d0cc"]]);
//#endregion
//#region src/components/Sidebar.vue?vue&type=script&setup=true&lang.ts
var Sidebar_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Sidebar",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "left-asider-S" }, _attrs))} data-v-aace61e9><div class="left-asider-container" data-v-aace61e9><div class="left-asider-card" data-v-aace61e9>`);
			_push(ssrRenderComponent(Avatar_default, null, null, _parent));
			_push(ssrRenderComponent(WelcomeSaying_default, null, null, _parent));
			_push(ssrRenderComponent(Weather_default, null, null, _parent));
			_push(ssrRenderComponent(PageLinks_default, null, null, _parent));
			_push(`</div></div></aside>`);
		};
	}
});
//#endregion
//#region src/components/Sidebar.vue
var _sfc_setup$12 = Sidebar_vue_vue_type_script_setup_true_lang_default.setup;
Sidebar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Sidebar.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
var Sidebar_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Sidebar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-aace61e9"]]);
//#endregion
//#region src/components/Center.vue?vue&type=script&setup=true&lang.ts
var Center_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Center",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "center-S" }, _attrs))} data-v-323b38ca><div class="center-container" data-v-323b38ca><div class="center-card" data-v-323b38ca><div class="center-header-area" data-v-323b38ca>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div></div></div></section>`);
		};
	}
});
//#endregion
//#region src/components/Center.vue
var _sfc_setup$11 = Center_vue_vue_type_script_setup_true_lang_default.setup;
Center_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Center.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var Center_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Center_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-323b38ca"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "footer-element-card website-age" }, _attrs))} data-v-4c43409d><span class="age-icon" data-v-4c43409d>⏱</span><span data-v-4c43409d>本站已运行</span><span class="age-num" data-v-4c43409d>${ssrInterpolate(ageText.value)}</span></div>`);
		};
	}
});
//#endregion
//#region src/components/p-footer/WebsiteAge.vue
var _sfc_setup$10 = WebsiteAge_vue_vue_type_script_setup_true_lang_default.setup;
WebsiteAge_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-footer/WebsiteAge.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var WebsiteAge_default = /* @__PURE__ */ _plugin_vue_export_helper_default(WebsiteAge_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4c43409d"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "footer-element-card copyright" }, _attrs))} data-v-10f6d4a6> © ${ssrInterpolate(copyrightYear.value)} Cnkrru · Powered by Vue </div>`);
		};
	}
});
//#endregion
//#region src/components/p-footer/CopyRight.vue
var _sfc_setup$9 = CopyRight_vue_vue_type_script_setup_true_lang_default.setup;
CopyRight_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-footer/CopyRight.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var CopyRight_default = /* @__PURE__ */ _plugin_vue_export_helper_default(CopyRight_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-10f6d4a6"]]);
//#endregion
//#region src/components/Footer.vue?vue&type=script&setup=true&lang.ts
var Footer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Footer",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer-flex" }, _attrs))} data-v-c68a8ced><div class="footer-S" data-v-c68a8ced><nav class="footer-container" data-v-c68a8ced><div class="footer-card" data-v-c68a8ced>`);
			_push(ssrRenderComponent(WebsiteAge_default, null, null, _parent));
			_push(ssrRenderComponent(CopyRight_default, null, null, _parent));
			_push(`</div></nav></div></footer>`);
		};
	}
});
//#endregion
//#region src/components/Footer.vue
var _sfc_setup$8 = Footer_vue_vue_type_script_setup_true_lang_default.setup;
Footer_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Footer.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var Footer_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Footer_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c68a8ced"]]);
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
var _sfc_setup$7 = WebAnalytics_vue_vue_type_script_setup_true_lang_default.setup;
WebAnalytics_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/WebAnalytics.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var WebAnalytics_default = WebAnalytics_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region src/components/media/Live2dWidget.vue?vue&type=script&setup=true&lang.ts
var Live2dWidget_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Live2dWidget",
	__ssrInlineRender: true,
	setup(__props) {
		let oml2dInstance = null;
		const initLive2d = () => {
			if (typeof window === "undefined") return;
			const script = document.createElement("script");
			script.src = "https://cdn.jsdelivr.net/npm/oh-my-live2d/dist/index.min.js";
			script.onload = () => {
				oml2dInstance = window.OML2D.loadOml2d({
					models: [{
						path: "https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B4%A9%E5%9D%8F%E5%AD%A6%E5%9B%AD2/yiselin/model.json",
						scale: .08,
						position: [0, 60]
					}],
					tips: {
						style: { offsetY: 40 },
						message: {
							default: [
								"欢迎来到我的博客",
								"今天也要加油哦~",
								"有什么我可以帮你的吗？"
							],
							home: ["这是首页，欢迎回家！", "随便逛逛吧~"],
							idle: [
								"好无聊啊...",
								"陪我说说话吧",
								"要不要换个模型看看？"
							]
						}
					},
					mobile: {
						show: true,
						scale: .6
					},
					sayHello: true,
					dock: { position: "right" }
				});
			};
			document.body.appendChild(script);
		};
		onMounted(() => {
			initLive2d();
		});
		onUnmounted(() => {
			if (oml2dInstance && oml2dInstance.destroy) oml2dInstance.destroy();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "live2d-container" }, _attrs))} data-v-d3a36409></div>`);
		};
	}
});
//#endregion
//#region src/components/media/Live2dWidget.vue
var _sfc_setup$6 = Live2dWidget_vue_vue_type_script_setup_true_lang_default.setup;
Live2dWidget_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/Live2dWidget.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var Live2dWidget_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Live2dWidget_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-d3a36409"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "notification-container" }, _attrs))} data-v-9bfe1eee><!--[-->`);
			ssrRenderList(notifications.value, (n, i) => {
				_push(`<div class="${ssrRenderClass([[n.type, { "notification-leaving": n.isLeaving }], "notification"])}" style="${ssrRenderStyle({
					"--offset": `${i * 60}px`,
					zIndex: notifications.value.length - i
				})}" data-v-9bfe1eee>`);
				if (n.duration > 0 && n.type !== "error") _push(`<div class="notif-progress" style="${ssrRenderStyle({
					animationDuration: n.duration + "ms",
					animationPlayState: n.paused ? "paused" : "running"
				})}" data-v-9bfe1eee></div>`);
				else _push(`<!---->`);
				_push(`<div class="notif-body" data-v-9bfe1eee><div class="notif-icon" data-v-9bfe1eee>`);
				if (n.type === "success") _push(`<span data-v-9bfe1eee>✓</span>`);
				else if (n.type === "error") _push(`<span data-v-9bfe1eee>✗</span>`);
				else if (n.type === "warning") _push(`<span data-v-9bfe1eee>!</span>`);
				else _push(`<span data-v-9bfe1eee>i</span>`);
				_push(`</div><div class="notif-message" data-v-9bfe1eee>${ssrInterpolate(n.message)}</div><button class="notif-close" data-v-9bfe1eee>×</button></div>`);
				if (n.buttons && n.buttons.length > 0) {
					_push(`<div class="notif-actions" data-v-9bfe1eee><!--[-->`);
					ssrRenderList(n.buttons, (b) => {
						_push(`<button class="notif-btn" data-v-9bfe1eee>${ssrInterpolate(b.text)}</button>`);
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
var _sfc_setup$5 = NotificationRender_vue_vue_type_script_setup_true_lang_default.setup;
NotificationRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/NotificationRender.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var NotificationRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(NotificationRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-9bfe1eee"]]);
//#endregion
//#region src/components/api/MouseTrail.vue?vue&type=script&setup=true&lang.ts
var MouseTrail_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MouseTrail",
	__ssrInlineRender: true,
	setup(__props) {
		const trail = ref([]);
		let mouseX = 0;
		let mouseY = 0;
		let animationId = null;
		let lastUpdate = 0;
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
			if (trail.value.length < trailLength.value) trail.value.push({
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
			mouseX = e.clientX;
			mouseY = e.clientY;
		};
		const handleMouseLeave = () => {
			if (!isBrowser.value || !isEnabled.value) return;
			trail.value = [];
		};
		mouseMoveHandler = throttle(handleMouseMove, 10);
		onMounted(() => {
			isBrowser.value = true;
			document.addEventListener("mousemove", mouseMoveHandler);
			document.addEventListener("mouseleave", handleMouseLeave);
			animationId = requestAnimationFrame(updateTrail);
			mouseStore.setDarkTheme(isDarkTheme.value);
		});
		onUnmounted(() => {
			document.removeEventListener("mousemove", mouseMoveHandler);
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
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "mouse-trail" }, _attrs))} data-v-bc29bf9a><!--[-->`);
				ssrRenderList(trail.value, (item) => {
					_push(`<span class="trail-char" style="${ssrRenderStyle({
						left: `${item.x}px`,
						top: `${item.y}px`,
						opacity: item.opacity,
						fontSize: `${item.size}px`,
						color: item.color,
						textShadow: `0 0 10px ${item.color}`,
						transition: "opacity 0.1s ease, transform 0.1s ease"
					})}" data-v-bc29bf9a>${ssrInterpolate(item.char)}</span>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region src/components/api/MouseTrail.vue
var _sfc_setup$4 = MouseTrail_vue_vue_type_script_setup_true_lang_default.setup;
MouseTrail_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/MouseTrail.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var MouseTrail_default = /* @__PURE__ */ _plugin_vue_export_helper_default(MouseTrail_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-bc29bf9a"]]);
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
var _sfc_setup$3 = ConsoleEasterEgg_vue_vue_type_script_setup_true_lang_default.setup;
ConsoleEasterEgg_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/ConsoleEasterEgg.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
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
				icon: "🏠",
				label: "回首页",
				action: () => router.push("/")
			},
			{
				icon: "🔄",
				label: "刷新页面",
				action: () => location.reload()
			},
			{
				icon: "⬆",
				label: "返回顶部",
				action: () => window.scrollTo({
					top: 0,
					behavior: "smooth"
				})
			},
			{
				icon: "📋",
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
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				if (x.value + rect.width > vw) x.value = vw - rect.width - 8;
				if (y.value + rect.height > vh) y.value = vh - rect.height - 8;
			});
		};
		const handleClick = () => {
			closeMenu();
		};
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
					})}" data-v-b17857a1><div class="menu-header" data-v-b17857a1><span class="menu-avatar" data-v-b17857a1>ฅ^•ﻌ•^ฅ</span><span class="menu-title" data-v-b17857a1>菜单</span></div><div class="menu-divider" data-v-b17857a1></div><!--[-->`);
					ssrRenderList(menuItems, (item, index) => {
						_push(`<div class="menu-item" data-v-b17857a1><span class="menu-icon" data-v-b17857a1>${ssrInterpolate(item.icon)}</span><span class="menu-label" data-v-b17857a1>${ssrInterpolate(item.label)}</span></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
		};
	}
});
//#endregion
//#region src/components/p-center/ContextMenu.vue
var _sfc_setup$2 = ContextMenu_vue_vue_type_script_setup_true_lang_default.setup;
ContextMenu_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ContextMenu.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ContextMenu_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ContextMenu_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b17857a1"]]);
//#endregion
//#region src/components/p-center/ScrollEasterEgg.vue?vue&type=script&setup=true&lang.ts
var ScrollEasterEgg_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ScrollEasterEgg",
	__ssrInlineRender: true,
	setup(__props) {
		const showEasterEgg = ref(false);
		const hearts = ref([]);
		const heartEmojis = [
			"❤️",
			"💖",
			"💕",
			"💗",
			"💓",
			"💘",
			"💝"
		];
		let heartId = 0;
		const checkScroll = () => {
			if (window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 50) triggerEasterEgg();
		};
		const triggerEasterEgg = () => {
			if (showEasterEgg.value) return;
			showEasterEgg.value = true;
			spawnHearts();
			setTimeout(() => {
				showEasterEgg.value = false;
				hearts.value = [];
			}, 2500);
		};
		const spawnHearts = () => {
			for (let i = 0; i < 8; i++) setTimeout(() => {
				const left = Math.random() * 80 + 10;
				const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
				hearts.value.push({
					id: heartId++,
					left,
					emoji
				});
			}, i * 200);
		};
		onMounted(() => {
			window.addEventListener("scroll", checkScroll);
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", checkScroll);
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (showEasterEgg.value) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "scroll-easter-egg" }, _attrs))} data-v-2e37d0a0><!--[-->`);
				ssrRenderList(hearts.value, (heart) => {
					_push(`<div class="floating-heart" style="${ssrRenderStyle({
						left: `${heart.left}%`,
						animationDelay: `${Math.random() * .3}s`
					})}" data-v-2e37d0a0>${ssrInterpolate(heart.emoji)}</div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region src/components/p-center/ScrollEasterEgg.vue
var _sfc_setup$1 = ScrollEasterEgg_vue_vue_type_script_setup_true_lang_default.setup;
ScrollEasterEgg_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ScrollEasterEgg.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ScrollEasterEgg_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ScrollEasterEgg_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2e37d0a0"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ id: "app" }, _attrs))} data-v-4d4bad2c>`);
			if (progressVisible.value) _push(`<div class="page-progress-bar" data-v-4d4bad2c><div class="page-progress-fill" style="${ssrRenderStyle({ width: progressWidth.value })}" data-v-4d4bad2c></div></div>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(WebAnalytics_default, null, null, _parent));
			_push(ssrRenderComponent(unref(SpeedInsights), null, null, _parent));
			_push(ssrRenderComponent(unref(Analytics), null, null, _parent));
			_push(ssrRenderComponent(NotificationRender_default, null, null, _parent));
			_push(ssrRenderComponent(ConsoleEasterEgg_default, null, null, _parent));
			_push(ssrRenderComponent(ContextMenu_default, null, null, _parent));
			_push(ssrRenderComponent(ScrollEasterEgg_default, null, null, _parent));
			_push(ssrRenderComponent(MouseTrail_default, null, null, _parent));
			if (!isIndexPage.value && !isTerminalPage.value) {
				_push(`<!--[-->`);
				_push(ssrRenderComponent(Live2dWidget_default, null, null, _parent));
				_push(ssrRenderComponent(Header_default, null, null, _parent));
				_push(`<main class="mid-flex" data-v-4d4bad2c>`);
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
var App_default = /* @__PURE__ */ _plugin_vue_export_helper_default(App_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4d4bad2c"]]);
//#endregion
//#region src/router/index.ts
var routes = [
	{
		path: "/",
		name: "Index",
		component: () => import("./assets/pages-2lm_2dsK.js")
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("./assets/Home-DHGDwv8f.js")
	},
	{
		path: "/about",
		name: "About",
		component: () => import("./assets/About-1mDZ6S__.js")
	},
	{
		path: "/archives",
		name: "Archives",
		component: () => import("./assets/Archives-DMGaLE2e.js")
	},
	{
		path: "/links",
		name: "Links",
		component: () => import("./assets/Links-u_po5nLO.js")
	},
	{
		path: "/projects",
		name: "Projects",
		component: () => import("./assets/Projects-DYvbQDDH.js")
	},
	{
		path: "/post/:id",
		name: "Post",
		component: () => import("./assets/Posts-D9tS0K8J.js")
	},
	{
		path: "/project/:id",
		name: "Project",
		component: () => import("./assets/Projects-BjRIBYpi.js")
	},
	{
		path: "/timeline",
		name: "Timeline",
		component: () => import("./assets/Timeline-D8O4VTpj.js")
	},
	{
		path: "/search",
		name: "Search",
		component: () => import("./assets/SearchPage-Ctst6wqc.js")
	},
	{
		path: "/links/apply",
		name: "LinkApply",
		component: () => import("./assets/LinkApply-Q5Ck-y7l.js")
	},
	{
		path: "/changelog",
		name: "Changelog",
		component: () => import("./assets/Changelog-DCKZzvTa.js")
	},
	{
		path: "/:pathMatch(.*)*",
		name: "NotFound",
		component: () => import("./assets/NotFound-DQ5iMF2O.js")
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
