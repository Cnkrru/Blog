import { b as useArticlesStore, d as useCommentStore, i as usePostsStore, m as useScrollStore, n as useTocStore, u as useContentStore, y as useThemeStore } from "./stores-CqGIWUfC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as _sfc_main$6 } from "./MarkdownRender-BiaaSOGw.js";
import { computed, defineComponent, mergeProps, nextTick, onMounted, onUnmounted, ref, unref, useSSRContext, watch } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { useRouter } from "vue-router";
//#region src/assets/imgs/svg/arrow-up.svg
var arrow_up_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3e%3cline%20x1='12'%20y1='19'%20x2='12'%20y2='5'%3e%3c/line%3e%3cpolyline%20points='5%2012%2012%205%2019%2012'%3e%3c/polyline%3e%3c/svg%3e";
//#endregion
//#region src/components/p-center/BackToTop.vue?vue&type=script&setup=true&lang.ts
var BackToTop_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "BackToTop",
	__ssrInlineRender: true,
	setup(__props) {
		const scrollStore = useScrollStore();
		const isVisible = computed(() => scrollStore.isVisible);
		const isImmersiveReading = ref(false);
		const checkImmersiveMode = () => {
			isImmersiveReading.value = document.body.classList.contains("immersive-reading");
		};
		let cleanupScrollListener;
		onMounted(() => {
			checkImmersiveMode();
			new MutationObserver(() => {
				checkImmersiveMode();
			}).observe(document.body, {
				attributes: true,
				attributeFilter: ["class"]
			});
			if (isImmersiveReading.value) cleanupScrollListener = scrollStore.initScrollListener();
		});
		onUnmounted(() => {
			if (cleanupScrollListener) cleanupScrollListener();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({ class: ["back-to-top-btn", {
				"visible": !isImmersiveReading.value || isVisible.value,
				"immersive": isImmersiveReading.value
			}] }, _attrs))} data-v-e700cff7><img${ssrRenderAttr("src", arrow_up_default)} alt="返回顶部" data-v-e700cff7></button>`);
		};
	}
});
//#endregion
//#region src/components/p-center/BackToTop.vue
var _sfc_setup$6 = BackToTop_vue_vue_type_script_setup_true_lang_default.setup;
BackToTop_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/BackToTop.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var BackToTop_default = /* @__PURE__ */ _plugin_vue_export_helper_default(BackToTop_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e700cff7"]]);
//#endregion
//#region src/utils/markdown.js
/**
* Markdown 解析工具
* 用于解析 Markdown 文件中的 Frontmatter 元数据
*/
/**
* 解析 YAML 格式的值
* @param {string} value - 原始值字符串
* @returns {any} 解析后的值
*/
function parseYamlValue(value) {
	const trimmed = value.trim();
	if (trimmed === "") return "";
	if (trimmed === "true") return true;
	if (trimmed === "false") return false;
	if (trimmed === "null" || trimmed === "~") return null;
	if (trimmed.match(/^-?\d+(\.\d+)?$/)) return parseFloat(trimmed);
	if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
		const content = trimmed.slice(1, -1);
		if (!content.trim()) return [];
		return content.split(",").map((item) => parseYamlValue(item.trim().replace(/["']/g, ""))).filter((item) => item !== "");
	}
	const quoteMatch = trimmed.match(/^(["'])((?:\\.|[^\\])*)\1$/);
	if (quoteMatch) return quoteMatch[2].replace(/\\(["'])/g, "$1");
	return trimmed;
}
/**
* 解析 Markdown 内容中的 Frontmatter 元数据
* @param {string} content - Markdown 内容
* @returns {object} { frontmatter, content }
*/
var parseFrontmatter = (content) => {
	if (!content || typeof content !== "string") return {
		frontmatter: {},
		content: ""
	};
	const frontmatter = {};
	let markdown = content.trim();
	const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\s*/);
	if (frontmatterMatch) {
		const frontmatterText = frontmatterMatch[1];
		markdown = markdown.slice(frontmatterMatch[0].length);
		const lines = frontmatterText.split("\n");
		for (const line of lines) {
			if (!line.trim() || line.trim().startsWith("#")) continue;
			const match = line.match(/^\s*([^:]+):\s*(.+)$/);
			if (match) {
				const key = match[1].trim();
				const value = match[2];
				try {
					frontmatter[key] = parseYamlValue(value);
				} catch (error) {
					console.warn(`Frontmatter 解析错误 [${key}]:`, error);
					frontmatter[key] = value.trim();
				}
			}
		}
	}
	return {
		frontmatter,
		content: markdown
	};
};
//#endregion
//#region src/utils/useContentLoader.js
function useContentLoader(type, id) {
	const contentStore = useContentStore();
	const articlesStore = useArticlesStore();
	const content = ref(null);
	const markdownContent = ref("");
	const loading = ref(true);
	const error = ref(null);
	const retryCount = ref(0);
	const isLoading = computed(() => loading.value);
	const hasError = computed(() => error.value !== null);
	const isLoaded = computed(() => content.value !== null && !loading.value && !error.value);
	const loadContent = async () => {
		loading.value = true;
		error.value = null;
		retryCount.value = 0;
		try {
			const cachedContent = contentStore.getContent(type, id);
			if (cachedContent) {
				content.value = cachedContent;
				markdownContent.value = cachedContent.markdownContent || "";
				loading.value = false;
				return;
			}
			let itemData = null;
			switch (type) {
				case "post":
					itemData = (await articlesStore.fetchArticles()).find((item) => item.id === id);
					const mdText = await articlesStore.loadMarkdown(id);
					if (mdText) {
						const { frontmatter, content: mdContent } = parseFrontmatter(mdText);
						content.value = {
							...itemData || {},
							...frontmatter,
							id,
							tags: frontmatter.tags || (itemData ? itemData.tags : [])
						};
						markdownContent.value = mdContent;
						contentStore.setContent(type, id, {
							...content.value,
							markdownContent: mdContent
						});
					} else throw new Error("Failed to load markdown content");
					break;
				case "project":
					const projectRes = await fetch("/config/projects.json");
					if (!projectRes.ok) throw new Error(`HTTP ${projectRes.status}`);
					itemData = (await projectRes.json()).find((item) => item.id === id);
					if (itemData) {
						try {
							const mdText = await articlesStore.loadMarkdown(`project-${id}`);
							if (mdText) {
								const { frontmatter, content: mdContent } = parseFrontmatter(mdText);
								content.value = {
									...itemData,
									...frontmatter
								};
								markdownContent.value = mdContent;
							} else content.value = itemData;
						} catch (mdError) {
							content.value = itemData;
						}
						contentStore.setContent(type, id, {
							...content.value,
							markdownContent: markdownContent.value
						});
					} else throw new Error("Project not found");
					break;
				default: throw new Error("Invalid content type");
			}
		} catch (err) {
			error.value = err.message;
			contentStore.setError(type, id, err.message);
		} finally {
			loading.value = false;
			contentStore.setLoading(type, id, false);
		}
	};
	const retry = () => {
		if (retryCount.value < 3) {
			retryCount.value++;
			loadContent();
		}
	};
	const clearCache = () => {
		contentStore.clearCache(type, id);
	};
	return {
		content,
		markdownContent,
		loading: isLoading,
		error: hasError,
		isLoaded,
		loadContent,
		retry,
		clearCache
	};
}
//#endregion
//#region src/components/content/ContentRender.vue
var _sfc_main$5 = {
	__name: "ContentRender",
	__ssrInlineRender: true,
	props: {
		id: {
			type: String,
			required: true
		},
		type: {
			type: String,
			required: true,
			validator: (value) => ["post", "project"].includes(value)
		}
	},
	emits: [
		"content-loaded",
		"loading",
		"error",
		"prev-next-posts",
		"update:toc"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const { content, markdownContent, loading, error: hasError, isLoaded, loadContent, retry } = useContentLoader(props.type, props.id);
		const articlesStore = useArticlesStore();
		const loadedContent = computed(() => content.value);
		const error = computed(() => hasError.value ? hasError.value : null);
		const loadPrevNextPosts = async () => {
			if (props.type === "post") try {
				const searchData = await articlesStore.fetchArticles();
				const postIndex = searchData.findIndex((item) => item.id === props.id);
				emit("prev-next-posts", {
					prevPost: postIndex > 0 ? searchData[postIndex - 1] : null,
					nextPost: postIndex < searchData.length - 1 ? searchData[postIndex + 1] : null
				});
			} catch (err) {
				console.error("Failed to load prev/next posts:", err);
			}
		};
		const loadContentData = async () => {
			emit("loading", true);
			await loadContent();
			if (isLoaded.value) {
				emit("content-loaded", loadedContent.value);
				if (props.type === "post") await loadPrevNextPosts();
			} else if (error.value) emit("error", error.value);
			emit("loading", false);
		};
		onMounted(() => loadContentData());
		watch(() => props.id, () => loadContentData());
		watch(() => props.type, () => loadContentData());
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "content-loader" }, _attrs))} data-v-a4916c63>`);
			if (unref(loading)) _push(`<div class="loading-message" data-v-a4916c63><div class="loading-spinner" data-v-a4916c63></div><p data-v-a4916c63>加载中...</p></div>`);
			else if (error.value) _push(`<div class="error-message" data-v-a4916c63><div class="error-icon" data-v-a4916c63>⚠️</div><p data-v-a4916c63>${ssrInterpolate(error.value)}</p><button class="retry-button" data-v-a4916c63>重试</button></div>`);
			else if (loadedContent.value) {
				_push(`<div class="content-container" data-v-a4916c63><div class="text-style" data-v-a4916c63>`);
				if (__props.type === "project") _push(`<!--[--><p data-v-a4916c63>项目名称：${ssrInterpolate(loadedContent.value.name)}</p><p data-v-a4916c63>分类：${ssrInterpolate(loadedContent.value.category)}</p><p data-v-a4916c63>编号：${ssrInterpolate(loadedContent.value.id)}</p><hr data-v-a4916c63><p data-v-a4916c63>项目描述：${ssrInterpolate(loadedContent.value.description)}</p><hr data-v-a4916c63><!--]-->`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(_sfc_main$6, {
					content: unref(markdownContent),
					"onUpdate:toc": (toc) => emit("update:toc", toc)
				}, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/ContentRender.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var ContentRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-a4916c63"]]);
//#endregion
//#region src/components/p-center/ReadingTime.vue
var _sfc_main$4 = {
	__name: "ReadingTime",
	__ssrInlineRender: true,
	props: {
		contentSelector: {
			type: String,
			default: ".text-style, .center-card-content, article"
		},
		wordsPerMinute: {
			type: Number,
			default: 300
		},
		codeWordsPerMinute: {
			type: Number,
			default: 100
		},
		minTime: {
			type: Number,
			default: 1
		}
	},
	setup(__props) {
		const props = __props;
		const themeStore = useThemeStore();
		const readingTime = ref(null);
		const isDarkTheme = computed(() => themeStore.isDark);
		const calculateReadingTime = () => {
			const selectors = props.contentSelector.split(", ");
			let articleContent = null;
			for (const selector of selectors) {
				articleContent = document.querySelector(selector);
				if (articleContent) break;
			}
			if (!articleContent) return null;
			const clone = articleContent.cloneNode(true);
			const codeBlocks = clone.querySelectorAll("pre, code");
			let codeText = "";
			codeBlocks.forEach((block) => {
				codeText += block.textContent + " ";
				block.remove();
			});
			const text = clone.textContent || clone.innerText || "";
			const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
			const englishCount = (text.match(/[a-zA-Z]+/g) || []).length;
			const codeCount = codeText.length;
			const totalTime = (chineseCount + englishCount) / props.wordsPerMinute + codeCount / props.codeWordsPerMinute;
			return {
				minutes: Math.max(props.minTime, Math.ceil(totalTime)),
				chineseCount,
				englishCount,
				codeCount,
				totalWords: chineseCount + englishCount + codeCount
			};
		};
		const formatTime = (timeData) => {
			if (!timeData) return "";
			const minutes = timeData.minutes;
			if (minutes < 1) return "小于 1 分钟";
			else if (minutes === 1) return "1 分钟";
			else if (minutes < 60) return minutes + " 分钟";
			else {
				const hours = Math.floor(minutes / 60);
				const remainingMinutes = minutes % 60;
				if (remainingMinutes === 0) return hours + " 小时";
				else return hours + " 小时 " + remainingMinutes + " 分钟";
			}
		};
		let debounceTimer = null;
		const initReadingTime = () => {
			setTimeout(() => {
				if (debounceTimer) clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => {
					readingTime.value = calculateReadingTime();
				}, 200);
			}, 100);
		};
		onMounted(() => {
			initReadingTime();
		});
		onUnmounted(() => {
			if (debounceTimer) clearTimeout(debounceTimer);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "reading-time-wrapper" }, _attrs))} data-v-8db85cd9>`);
			if (readingTime.value) _push(`<div class="${ssrRenderClass([{ "dark-theme": isDarkTheme.value }, "reading-time-container"])}" data-v-8db85cd9><div class="word-count-section" data-v-8db85cd9><span class="word-count-icon" data-v-8db85cd9><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-8db85cd9><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-8db85cd9></path><polyline points="14 2 14 8 20 8" data-v-8db85cd9></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-8db85cd9></line><line x1="16" y1="17" x2="8" y2="17" data-v-8db85cd9></line><polyline points="10 9 9 9 8 9" data-v-8db85cd9></polyline></svg></span><span class="word-count-text" data-v-8db85cd9> 字数统计: ${ssrInterpolate(readingTime.value.totalWords)} 字 </span><span class="word-count-detail" data-v-8db85cd9> (${ssrInterpolate(readingTime.value.chineseCount)}中文 / ${ssrInterpolate(readingTime.value.englishCount)}英文 / ${ssrInterpolate(readingTime.value.codeCount)}代码) </span></div><div class="reading-time-section" data-v-8db85cd9><span class="reading-time-icon" data-v-8db85cd9><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-8db85cd9><circle cx="12" cy="12" r="10" data-v-8db85cd9></circle><polyline points="12 6 12 12 16 14" data-v-8db85cd9></polyline></svg></span><span class="reading-time-text" data-v-8db85cd9> 预计阅读时间: ${ssrInterpolate(formatTime(readingTime.value))}</span></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ReadingTime.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var ReadingTime_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-8db85cd9"]]);
//#endregion
//#region src/components/p-center/Toc.vue
var _sfc_main$3 = {
	__name: "Toc",
	__ssrInlineRender: true,
	props: { show: {
		type: Boolean,
		default: false
	} },
	emits: ["update:show"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const tocStore = useTocStore();
		const themeStore = useThemeStore();
		const tocContentRef = ref(null);
		const toc = ref([]);
		const activeId = ref("");
		const isDarkTheme = computed(() => themeStore.isDark);
		const generateHeadingNumber = (index, level, counters) => {
			counters[level] = (counters[level] || 0) + 1;
			for (let i = level + 1; i <= 6; i++) counters[i] = 0;
			let number = "";
			for (let i = 1; i <= level; i++) if (counters[i]) number += counters[i] + ".";
			return number.slice(0, -1);
		};
		const scanAndProcessHeadings = () => {
			const containers = [
				document.querySelector(".center-card-content"),
				document.querySelector(".post-content"),
				document.querySelector(".markdown-content")
			];
			let contentContainer = null;
			for (const container of containers) if (container) {
				contentContainer = container;
				break;
			}
			if (!contentContainer) return;
			const headings = contentContainer.querySelectorAll("h1, h2, h3, h4, h5, h6");
			const newToc = [];
			const counters = {};
			headings.forEach((heading, index) => {
				const level = parseInt(heading.tagName.substring(1));
				const text = heading.textContent.trim();
				const id = `toc-heading-${index}`;
				heading.id = id;
				const numbering = generateHeadingNumber(index, level, counters);
				newToc.push({
					id,
					level,
					text,
					numbering
				});
			});
			toc.value = newToc;
			tocStore.setToc(newToc);
		};
		const detectCurrentPosition = () => {
			if (toc.value.length === 0) return;
			const containers = [
				document.querySelector(".center-card-content"),
				document.querySelector(".post-content"),
				document.querySelector(".markdown-content")
			];
			let contentContainer = null;
			for (const container of containers) if (container) {
				contentContainer = container;
				break;
			}
			if (!contentContainer) return;
			let currentId = "";
			let closestDistance = Infinity;
			for (const item of toc.value) {
				const element = document.getElementById(item.id);
				if (element) {
					const rect = element.getBoundingClientRect();
					const distance = Math.abs(rect.top - window.innerHeight * .3);
					if (distance < closestDistance) {
						closestDistance = distance;
						currentId = item.id;
					}
				}
			}
			if (currentId && currentId !== activeId.value) {
				activeId.value = currentId;
				tocStore.setActiveId(currentId);
				scrollTocToActiveItem();
			}
		};
		const scrollTocToActiveItem = () => {
			if (!tocContentRef.value) return;
			const activeElement = tocContentRef.value.querySelector(".toc-item.active");
			if (activeElement) {
				const tocRect = tocContentRef.value.getBoundingClientRect();
				const relativeTop = activeElement.getBoundingClientRect().top - tocRect.top;
				tocContentRef.value.scrollTop = tocContentRef.value.scrollTop + relativeTop - tocRect.height / 2;
			}
		};
		let scrollListener = null;
		let resizeListener = null;
		watch(() => props.show, (newShow) => {
			if (newShow) nextTick(() => {
				scanAndProcessHeadings();
				setTimeout(detectCurrentPosition, 100);
			});
		});
		onMounted(() => {
			tocStore.loadUserPreference();
			setTimeout(() => {
				scanAndProcessHeadings();
			}, 300);
			scrollListener = () => {
				requestAnimationFrame(detectCurrentPosition);
			};
			resizeListener = detectCurrentPosition;
			window.addEventListener("scroll", scrollListener, { passive: true });
			window.addEventListener("resize", resizeListener, { passive: true });
			const containers = [
				document.querySelector(".center-card-content"),
				document.querySelector(".post-content"),
				document.querySelector(".markdown-content")
			];
			for (const container of containers) if (container) {
				container.addEventListener("scroll", scrollListener, { passive: true });
				break;
			}
		});
		onUnmounted(() => {
			if (scrollListener) {
				window.removeEventListener("scroll", scrollListener);
				const containers = [
					document.querySelector(".center-card-content"),
					document.querySelector(".post-content"),
					document.querySelector(".markdown-content")
				];
				for (const container of containers) if (container) {
					container.removeEventListener("scroll", scrollListener);
					break;
				}
			}
			if (resizeListener) window.removeEventListener("resize", resizeListener);
			tocStore.reset();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["toc-card", {
				active: __props.show,
				"dark-theme": isDarkTheme.value
			}] }, _attrs))} data-v-ea68afae><div class="toc-card-header" data-v-ea68afae><h3 data-v-ea68afae>文章目录</h3><div class="header-actions" data-v-ea68afae>`);
			if (toc.value.length > 0) _push(`<span class="toc-item-count" data-v-ea68afae>${ssrInterpolate(toc.value.length)} 项</span>`);
			else _push(`<!---->`);
			_push(`<button class="toc-close-btn" data-v-ea68afae><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" data-v-ea68afae><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" data-v-ea68afae></path></svg></button></div></div><div class="toc-card-content" data-v-ea68afae><ul class="toc-list" data-v-ea68afae><!--[-->`);
			ssrRenderList(toc.value, (item) => {
				_push(`<li class="${ssrRenderClass([[`level-${item.level}`, { active: activeId.value === item.id }], "toc-item"])}" data-v-ea68afae><a href="#"${ssrRenderAttr("title", `跳转到: ${item.text}`)} data-v-ea68afae><span class="toc-item-number" data-v-ea68afae>${ssrInterpolate(item.numbering)}</span><span class="toc-item-text" data-v-ea68afae>${ssrInterpolate(item.text)}</span></a></li>`);
			});
			_push(`<!--]--></ul></div></div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/Toc.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var Toc_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$3, [["__scopeId", "data-v-ea68afae"]]);
//#endregion
//#region src/components/p-center/TocButton.vue
var _sfc_main$2 = {
	__name: "TocButton",
	__ssrInlineRender: true,
	props: { show: {
		type: Boolean,
		default: false
	} },
	emits: ["update:show"],
	setup(__props, { emit: __emit }) {
		const tocStore = useTocStore();
		const themeStore = useThemeStore();
		const isDarkTheme = computed(() => themeStore.isDark);
		const hasToc = computed(() => tocStore.toc.length > 0);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["toc-btn-container", { "dark-theme": isDarkTheme.value }] }, _attrs))} data-v-85c804fd><button class="${ssrRenderClass([{ active: unref(tocStore).show }, "toc-btn"])}"${ssrRenderAttr("title", unref(tocStore).show ? "关闭目录" : "打开目录")} data-v-85c804fd><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="${ssrRenderClass({ active: unref(tocStore).show })}" data-v-85c804fd><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" data-v-85c804fd></path></svg><span class="btn-text" data-v-85c804fd>目录</span>`);
			if (hasToc.value) _push(`<span class="toc-count" data-v-85c804fd>${ssrInterpolate(unref(tocStore).toc.length)}</span>`);
			else _push(`<!---->`);
			_push(`</button></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/TocButton.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var TocButton_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-85c804fd"]]);
//#endregion
//#region src/components/p-center/PostMenu.vue
var _sfc_main$1 = {
	__name: "PostMenu",
	__ssrInlineRender: true,
	props: { show: {
		type: Boolean,
		default: false
	} },
	emits: ["update:show"],
	setup(__props, { emit: __emit }) {
		useRouter();
		const postsStore = usePostsStore();
		const searchKeyword = ref("");
		const sortBy = ref("date");
		const posts = computed(() => postsStore.filteredPosts);
		const loadPosts = async () => {
			await postsStore.fetchPosts();
		};
		const getSortIcon = (sortType) => {
			if (sortBy.value !== sortType) return "";
			return postsStore.sortOrder === "desc" ? "↓" : "↑";
		};
		onMounted(() => {
			loadPosts();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "post-menu-container" }, _attrs))} data-v-6b167087><div class="post-menu-btn-container" data-v-6b167087><button class="post-menu-btn" data-v-6b167087><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" data-v-6b167087><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" data-v-6b167087></path></svg> 文章菜单 </button></div><div class="${ssrRenderClass([{ active: __props.show }, "post-menu-card"])}" data-v-6b167087><div class="post-menu-card-header" data-v-6b167087><h3 data-v-6b167087>文章菜单</h3><button class="post-menu-close-btn" data-v-6b167087><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" data-v-6b167087><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" data-v-6b167087></path></svg></button></div><div class="post-menu-card-content" data-v-6b167087><div class="post-menu-controls" data-v-6b167087><div class="search-box" data-v-6b167087><input type="text"${ssrRenderAttr("value", searchKeyword.value)} placeholder="搜索文章..." class="menu-search-input" data-v-6b167087>`);
			if (searchKeyword.value) _push(`<button class="clear-search-btn" data-v-6b167087> × </button>`);
			else _push(`<!---->`);
			_push(`</div><div class="sort-controls" data-v-6b167087><button class="${ssrRenderClass([{ active: sortBy.value === "date" }, "sort-btn"])}" data-v-6b167087> 日期 ${ssrInterpolate(getSortIcon("date"))}</button><button class="${ssrRenderClass([{ active: sortBy.value === "title" }, "sort-btn"])}" data-v-6b167087> 标题 ${ssrInterpolate(getSortIcon("title"))}</button></div></div><ul class="post-list" data-v-6b167087><!--[-->`);
			ssrRenderList(posts.value, (post, index) => {
				_push(`<li class="post-list-item" data-v-6b167087><span class="post-id" data-v-6b167087>#${ssrInterpolate(index + 1)}</span><span class="post-title" data-v-6b167087>${ssrInterpolate(post.title)}</span><span class="post-date" data-v-6b167087>${ssrInterpolate(post.date)}</span></li>`);
			});
			_push(`<!--]--></ul></div></div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/PostMenu.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var PostMenu_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-6b167087"]]);
//#endregion
//#region src/components/api/Comment.vue
var _sfc_main = {
	__name: "Comment",
	__ssrInlineRender: true,
	setup(__props) {
		const commentStore = useCommentStore();
		const themeStore = useThemeStore();
		const isLoading = computed(() => commentStore.isLoading);
		computed(() => commentStore.isLoaded);
		const error = computed(() => commentStore.error);
		const commentCount = computed(() => commentStore.commentCount);
		let cleanupObserver = null;
		watch(() => themeStore.isDark, (isDark) => {
			commentStore.setTheme(isDark);
		});
		onMounted(() => {
			commentStore.initCommentSystem();
			cleanupObserver = commentStore.init();
			if (typeof window !== "undefined") {
				window.updateGiscusTheme = commentStore.updateGiscusTheme;
				window.refreshComments = commentStore.refreshComments;
			}
			const isDark = themeStore.isDark;
			commentStore.setTheme(isDark);
		});
		onUnmounted(() => {
			if (typeof window !== "undefined") {
				delete window.updateGiscusTheme;
				delete window.refreshComments;
			}
			if (cleanupObserver) cleanupObserver();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "comment-section" }, _attrs))} data-v-fa2b5869><div class="comment-header" data-v-fa2b5869><h3 data-v-fa2b5869>评论</h3>`);
			if (commentCount.value > 0) _push(`<span class="comment-count" data-v-fa2b5869>${ssrInterpolate(commentCount.value)} 条评论</span>`);
			else _push(`<!---->`);
			_push(`</div><div class="comment-content" data-v-fa2b5869>`);
			if (isLoading.value) _push(`<div class="loading-state" data-v-fa2b5869><div class="loading-spinner" data-v-fa2b5869></div><span class="loading-text" data-v-fa2b5869>加载评论中...</span></div>`);
			else if (error.value) _push(`<div class="error-state" data-v-fa2b5869><div class="error-icon" data-v-fa2b5869>⚠️</div><span class="error-text" data-v-fa2b5869>${ssrInterpolate(error.value)}</span><button class="retry-button" data-v-fa2b5869>重试</button></div>`);
			else _push(`<div class="comment-container" data-v-fa2b5869></div>`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/Comment.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Comment_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-fa2b5869"]]);
//#endregion
export { ReadingTime_default as a, Toc_default as i, PostMenu_default as n, ContentRender_default as o, TocButton_default as r, BackToTop_default as s, Comment_default as t };
