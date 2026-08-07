import { _ as useThemeStore, a as useContentStore, g as useScrollStore, i as useArticlesStore, m as useTocStore, s as useCommentStore } from "./stores-CSCNxxdH.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as MarkdownRender_default } from "./MarkdownRender-DnS7M_TS.js";
import { computed, defineComponent, mergeProps, nextTick, onMounted, onUnmounted, ref, resolveComponent, unref, useSSRContext, watch } from "vue";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderTeleport } from "vue/server-renderer";
import { useRouter } from "vue-router";
//#region src/components/p-center/BackToTop.vue?vue&type=script&setup=true&lang.ts
var BackToTop_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "BackToTop",
	__ssrInlineRender: true,
	setup(__props) {
		const scrollStore = useScrollStore();
		computed(() => scrollStore.isVisible);
		const isImmersiveReading = ref(false);
		const checkImmersiveMode = () => {
			const was = isImmersiveReading.value;
			isImmersiveReading.value = document.body.classList.contains("immersive-reading");
			if (!was && isImmersiveReading.value) cleanupScrollListener = scrollStore.initScrollListener();
			else if (was && !isImmersiveReading.value) {
				if (cleanupScrollListener) {
					cleanupScrollListener();
					cleanupScrollListener = void 0;
				}
			}
		};
		let cleanupScrollListener;
		let observer = null;
		onMounted(() => {
			checkImmersiveMode();
			observer = new MutationObserver(() => {
				checkImmersiveMode();
			});
			observer.observe(document.body, {
				attributes: true,
				attributeFilter: ["class"]
			});
			if (isImmersiveReading.value) cleanupScrollListener = scrollStore.initScrollListener();
		});
		onUnmounted(() => {
			if (cleanupScrollListener) cleanupScrollListener();
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			if (!isImmersiveReading.value) _push(`<button class="back-to-top-btn" title="返回顶部" data-v-abb9b85a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-abb9b85a><line x1="12" y1="19" x2="12" y2="5" data-v-abb9b85a></line><polyline points="5 12 12 5 19 12" data-v-abb9b85a></polyline></svg></button>`);
			else _push(`<!---->`);
			ssrRenderTeleport(_push, (_push) => {
				if (isImmersiveReading.value) _push(`<button class="back-to-top-btn immersive visible" title="返回顶部" data-v-abb9b85a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-abb9b85a><line x1="12" y1="19" x2="12" y2="5" data-v-abb9b85a></line><polyline points="5 12 12 5 19 12" data-v-abb9b85a></polyline></svg></button>`);
				else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/components/p-center/BackToTop.vue
var _sfc_setup$7 = BackToTop_vue_vue_type_script_setup_true_lang_default.setup;
BackToTop_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/BackToTop.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var BackToTop_default = /* @__PURE__ */ _plugin_vue_export_helper_default(BackToTop_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-abb9b85a"]]);
//#endregion
//#region src/utils/markdown.ts
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
//#region src/utils/useContentLoader.ts
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
//#region src/components/content/ContentRender.vue?vue&type=script&setup=true&lang.ts
var ContentRender_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ContentRender",
	__ssrInlineRender: true,
	props: {
		id: {},
		type: {}
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
				const sortedPosts = (await articlesStore.fetchArticles()).filter((item) => item.id !== "changelog").sort((a, b) => {
					const idA = isNaN(parseInt(a.id)) ? a.id : parseInt(a.id);
					const idB = isNaN(parseInt(b.id)) ? b.id : parseInt(b.id);
					if (typeof idA === "number" && typeof idB === "number") return idA - idB;
					else return String(a.id).localeCompare(String(b.id));
				});
				const postIndex = sortedPosts.findIndex((item) => item.id === props.id);
				emit("prev-next-posts", {
					prevPost: postIndex > 0 ? sortedPosts[postIndex - 1] : null,
					nextPost: postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : null
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "content-loader" }, _attrs))} data-v-0f7e198a>`);
			if (unref(loading)) _push(`<div class="loading-message" data-v-0f7e198a><div class="loading-spinner" data-v-0f7e198a></div><p data-v-0f7e198a>加载中...</p></div>`);
			else if (error.value) _push(`<div class="error-message" data-v-0f7e198a><div class="error-icon" data-v-0f7e198a><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-0f7e198a><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" data-v-0f7e198a></path><line x1="12" y1="9" x2="12" y2="13" data-v-0f7e198a></line><line x1="12" y1="17" x2="12.01" y2="17" data-v-0f7e198a></line></svg></div><p data-v-0f7e198a>${ssrInterpolate(error.value)}</p><button class="retry-button" data-v-0f7e198a>重试</button></div>`);
			else if (loadedContent.value) {
				_push(`<div class="content-container" data-v-0f7e198a><div class="text-style" data-v-0f7e198a>`);
				if (__props.type === "project") _push(`<!--[--><p data-v-0f7e198a>项目名称：${ssrInterpolate(loadedContent.value.name)}</p><p data-v-0f7e198a>分类：${ssrInterpolate(loadedContent.value.category)}</p><p data-v-0f7e198a>编号：${ssrInterpolate(loadedContent.value.id)}</p><hr data-v-0f7e198a><p data-v-0f7e198a>项目描述：${ssrInterpolate(loadedContent.value.description)}</p><hr data-v-0f7e198a><!--]-->`);
				else _push(`<!---->`);
				_push(ssrRenderComponent(MarkdownRender_default, {
					content: unref(markdownContent),
					"onUpdate:toc": (toc) => emit("update:toc", toc)
				}, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/content/ContentRender.vue
var _sfc_setup$6 = ContentRender_vue_vue_type_script_setup_true_lang_default.setup;
ContentRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/ContentRender.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var ContentRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ContentRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0f7e198a"]]);
//#endregion
//#region src/components/p-center/ReadingTime.vue?vue&type=script&setup=true&lang.ts
var ReadingTime_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ReadingTime",
	__ssrInlineRender: true,
	props: {
		contentSelector: { default: ".text-style, .center-card-content, article" },
		wordsPerMinute: { default: 300 },
		codeWordsPerMinute: { default: 100 },
		minTime: { default: 1 }
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "reading-time-wrapper" }, _attrs))} data-v-15bb9a33>`);
			if (readingTime.value) _push(`<div class="${ssrRenderClass([{ "dark-theme": isDarkTheme.value }, "reading-time-container"])}" data-v-15bb9a33><div class="word-count-section" data-v-15bb9a33><span class="word-count-icon" data-v-15bb9a33><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-15bb9a33><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-15bb9a33></path><polyline points="14 2 14 8 20 8" data-v-15bb9a33></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-15bb9a33></line><line x1="16" y1="17" x2="8" y2="17" data-v-15bb9a33></line><polyline points="10 9 9 9 8 9" data-v-15bb9a33></polyline></svg></span><span class="word-count-text" data-v-15bb9a33> 字数统计: ${ssrInterpolate(readingTime.value.totalWords)} 字 </span><span class="word-count-detail" data-v-15bb9a33> (${ssrInterpolate(readingTime.value.chineseCount)}中文 / ${ssrInterpolate(readingTime.value.englishCount)}英文 / ${ssrInterpolate(readingTime.value.codeCount)}代码) </span></div><div class="reading-time-section" data-v-15bb9a33><span class="reading-time-icon" data-v-15bb9a33><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-15bb9a33><circle cx="12" cy="12" r="10" data-v-15bb9a33></circle><polyline points="12 6 12 12 16 14" data-v-15bb9a33></polyline></svg></span><span class="reading-time-text" data-v-15bb9a33> 预计阅读时间: ${ssrInterpolate(formatTime(readingTime.value))}</span></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/ReadingTime.vue
var _sfc_setup$5 = ReadingTime_vue_vue_type_script_setup_true_lang_default.setup;
ReadingTime_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ReadingTime.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var ReadingTime_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ReadingTime_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-15bb9a33"]]);
//#endregion
//#region src/components/p-center/TocTreeItem.vue?vue&type=script&setup=true&lang.ts
var TocTreeItem_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	name: "TocTreeItem",
	__name: "TocTreeItem",
	__ssrInlineRender: true,
	props: {
		node: {},
		activeId: {},
		collapsedSet: {},
		depth: {}
	},
	emits: ["click", "toggle"],
	setup(__props, { emit: __emit }) {
		/**
		* TocTreeItem - 递归TOC树节点组件
		* 用于渲染无限层级的文章目录树
		*/
		const props = __props;
		const emit = __emit;
		const isActive = () => props.node.id === props.activeId;
		const isCollapsed = () => props.collapsedSet.has(props.node.id);
		const hasChildren = () => !!(props.node.children && props.node.children.length > 0);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_TocTreeItem = resolveComponent("TocTreeItem", true);
			_push(`<li${ssrRenderAttrs(mergeProps({ class: ["toc-item", [`lv-${__props.node.level}`, {
				active: isActive(),
				collapsed: isCollapsed(),
				"has-children": hasChildren()
			}]] }, _attrs))} data-v-9f119ec0><a class="toc-link" href="#" data-v-9f119ec0>`);
			if (hasChildren()) _push(`<span class="toc-arrow" data-v-9f119ec0><svg class="${ssrRenderClass([{ rot: !isCollapsed() }, "toc-arrow-icon"])}" width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-9f119ec0><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-9f119ec0></path></svg></span>`);
			else _push(`<span class="toc-arrow-placeholder" data-v-9f119ec0></span>`);
			if (__props.node.numbering) _push(`<span class="toc-num" data-v-9f119ec0>${ssrInterpolate(__props.node.numbering)}</span>`);
			else _push(`<!---->`);
			_push(`<span class="toc-text" data-v-9f119ec0>${ssrInterpolate(__props.node.text)}</span></a>`);
			if (hasChildren()) {
				_push(`<div class="${ssrRenderClass([{ collapsed: isCollapsed() }, "toc-children-wrapper"])}" data-v-9f119ec0>`);
				if (!isCollapsed()) {
					_push(`<ul class="toc-children" data-v-9f119ec0><!--[-->`);
					ssrRenderList(__props.node.children, (child) => {
						_push(ssrRenderComponent(_component_TocTreeItem, {
							key: child.id,
							node: child,
							"active-id": __props.activeId,
							"collapsed-set": __props.collapsedSet,
							depth: __props.depth + 1,
							onClick: ($event) => emit("click", $event),
							onToggle: ($event) => emit("toggle", $event)
						}, null, _parent));
					});
					_push(`<!--]--></ul>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</li>`);
		};
	}
});
//#endregion
//#region src/components/p-center/TocTreeItem.vue
var _sfc_setup$4 = TocTreeItem_vue_vue_type_script_setup_true_lang_default.setup;
TocTreeItem_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/TocTreeItem.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var TocTreeItem_default = /* @__PURE__ */ _plugin_vue_export_helper_default(TocTreeItem_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-9f119ec0"]]);
//#endregion
//#region src/components/p-center/Toc.vue?vue&type=script&setup=true&lang.ts
var Toc_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Toc",
	__ssrInlineRender: true,
	props: { show: { type: Boolean } },
	emits: ["update:show"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const tocStore = useTocStore();
		useThemeStore();
		const tocContentRef = ref(null);
		const toc = ref([]);
		const collapsedSet = ref(/* @__PURE__ */ new Set());
		const expandedAll = ref(true);
		const activeId = ref("");
		function genNum(_index, level, counters) {
			counters[level] = (counters[level] || 0) + 1;
			for (let i = level + 1; i <= 6; i++) counters[i] = 0;
			let n = "";
			for (let i = 1; i <= level; i++) if (counters[i]) n += counters[i] + ".";
			return n.slice(0, -1);
		}
		function buildTree(flat) {
			const root = [];
			const stack = [{
				level: 0,
				children: root
			}];
			for (const item of flat) {
				const node = {
					...item,
					children: []
				};
				while (stack.length > 0 && stack[stack.length - 1].level >= item.level) stack.pop();
				stack[stack.length - 1].children.push(node);
				stack.push(node);
			}
			return root;
		}
		const treeToc = computed(() => buildTree(toc.value));
		function toggleCollapse(id) {
			const s = new Set(collapsedSet.value);
			s.has(id) ? s.delete(id) : s.add(id);
			collapsedSet.value = s;
		}
		function onTreeClick(id) {
			const el = document.getElementById(id);
			if (!el) return;
			const container = document.querySelector(".center-card-content");
			if (container && container.contains(el)) {
				const rect = el.getBoundingClientRect();
				const cr = container.getBoundingClientRect();
				container.scrollTo({
					top: container.scrollTop + rect.top - cr.top - 20,
					behavior: "smooth"
				});
			} else el.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function scanHeadings() {
			const ct = document.querySelector(".center-card-content") || document.querySelector(".post-content") || document.querySelector(".markdown-content");
			if (!ct) return;
			const hds = ct.querySelectorAll("h1, h2, h3, h4, h5, h6");
			const nv = [];
			const cnt = {};
			hds.forEach((h, i) => {
				const lv = parseInt(h.tagName.substring(1));
				const tx = h.textContent?.trim() || "";
				const id = `th-${i}`;
				h.id = id;
				nv.push({
					id,
					level: lv,
					text: tx,
					numbering: genNum(i, lv, cnt)
				});
			});
			toc.value = nv;
			tocStore.setToc(nv);
		}
		let obs = null;
		function setupObs() {
			if (obs) obs.disconnect();
			const ct = document.querySelector(".center-card-content");
			if (!ct) return;
			obs = new IntersectionObserver((es) => {
				const vs = es.filter((e) => e.isIntersecting).map((e) => e.target.id).filter(Boolean);
				if (!vs.length) return;
				for (const item of toc.value) if (vs.includes(item.id)) {
					if (item.id !== activeId.value) {
						activeId.value = item.id;
						tocStore.setActiveId(item.id);
						unCollapseParents(item.id);
					}
					return;
				}
			}, {
				root: ct,
				rootMargin: "-10% 0px -70% 0px",
				threshold: 0
			});
			toc.value.forEach((item) => {
				const el = document.getElementById(item.id);
				if (el) obs.observe(el);
			});
		}
		function unCollapseParents(id) {
			const idx = toc.value.findIndex((i) => i.id === id);
			if (idx <= 0) return;
			const item = toc.value[idx];
			const s = new Set(collapsedSet.value);
			let changed = false;
			for (let i = idx - 1; i >= 0; i--) if (toc.value[i].level < item.level) {
				if (s.has(toc.value[i].id)) {
					s.delete(toc.value[i].id);
					changed = true;
				}
				break;
			}
			if (changed) collapsedSet.value = s;
		}
		function scrollActiveIntoView() {
			if (!tocContentRef.value) return;
			const ae = tocContentRef.value.querySelector(".toc-item.active");
			if (ae) {
				const tr = tocContentRef.value.getBoundingClientRect();
				const ar = ae.getBoundingClientRect();
				tocContentRef.value.scrollTop += ar.top - tr.top - tr.height / 2;
			}
		}
		watch(() => props.show, (v) => {
			if (v) nextTick(() => {
				scanHeadings();
				setTimeout(() => {
					setupObs();
				}, 100);
			});
		});
		onMounted(() => {
			tocStore.loadUserPreference();
			setTimeout(() => {
				scanHeadings();
				setupObs();
			}, 300);
			window.addEventListener("resize", () => {
				scanHeadings();
				setupObs();
			}, { passive: true });
			const ct = document.querySelector(".center-card-content");
			if (ct) ct.addEventListener("scroll", () => requestAnimationFrame(scrollActiveIntoView), { passive: true });
		});
		onUnmounted(() => {
			if (obs) obs.disconnect();
			tocStore.reset();
		});
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderTeleport(_push, (_push) => {
				_push(`<div class="${ssrRenderClass([{ active: __props.show }, "toc-card"])}" data-v-4bf29612><div class="toc-header" data-v-4bf29612><div class="toc-header-left" data-v-4bf29612><svg class="toc-header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4bf29612><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-4bf29612></path></svg><h3 class="toc-title" data-v-4bf29612>目录</h3>`);
				if (toc.value.length) _push(`<span class="toc-count" data-v-4bf29612>${ssrInterpolate(toc.value.length)}</span>`);
				else _push(`<!---->`);
				_push(`</div><div class="toc-header-actions" data-v-4bf29612><button class="toc-tb-btn"${ssrRenderAttr("title", expandedAll.value ? "折叠全部" : "展开全部")} data-v-4bf29612>`);
				if (expandedAll.value) _push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4bf29612><path d="M8 12H16M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-4bf29612></path></svg>`);
				else _push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4bf29612><path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-4bf29612></path></svg>`);
				_push(`</button><button class="toc-close-btn" title="关闭" data-v-4bf29612><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4bf29612><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-4bf29612></path></svg></button></div></div><div class="toc-divider" data-v-4bf29612></div><div class="toc-content" data-v-4bf29612><ul class="toc-list" data-v-4bf29612><!--[-->`);
				ssrRenderList(treeToc.value, (node) => {
					_push(ssrRenderComponent(TocTreeItem_default, {
						key: node.id,
						node,
						"active-id": activeId.value,
						"collapsed-set": collapsedSet.value,
						depth: 0,
						onClick: onTreeClick,
						onToggle: toggleCollapse
					}, null, _parent));
				});
				_push(`<!--]--></ul>`);
				if (!toc.value.length) _push(`<div class="toc-empty" data-v-4bf29612><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4bf29612><path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-v-4bf29612></path></svg><span data-v-4bf29612>暂无目录</span></div>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			}, "body", false, _parent);
		};
	}
});
//#endregion
//#region src/components/p-center/Toc.vue
var _sfc_setup$3 = Toc_vue_vue_type_script_setup_true_lang_default.setup;
Toc_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/Toc.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var Toc_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Toc_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4bf29612"]]);
//#endregion
//#region src/components/p-center/TocButton.vue?vue&type=script&setup=true&lang.ts
var TocButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "TocButton",
	__ssrInlineRender: true,
	props: { show: { type: Boolean } },
	emits: ["update:show"],
	setup(__props, { emit: __emit }) {
		const tocStore = useTocStore();
		const themeStore = useThemeStore();
		const isDarkTheme = computed(() => themeStore.isDark);
		computed(() => tocStore.toc.length > 0);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["toc-btn-container", { "dark-theme": isDarkTheme.value }] }, _attrs))} data-v-f8bb2534><button class="${ssrRenderClass([{ active: unref(tocStore).show }, "toc-btn"])}"${ssrRenderAttr("title", unref(tocStore).show ? "关闭目录" : "打开目录")} data-v-f8bb2534>`);
			if (!unref(tocStore).show) _push(`<svg class="toc-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-f8bb2534><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-f8bb2534></path></svg>`);
			else _push(`<svg class="toc-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-f8bb2534><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" data-v-f8bb2534></path></svg>`);
			_push(`</button></div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/TocButton.vue
var _sfc_setup$2 = TocButton_vue_vue_type_script_setup_true_lang_default.setup;
TocButton_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/TocButton.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var TocButton_default = /* @__PURE__ */ _plugin_vue_export_helper_default(TocButton_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f8bb2534"]]);
//#endregion
//#region src/components/p-center/PostMenu.vue?vue&type=script&setup=true&lang.ts
var PostMenu_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PostMenu",
	__ssrInlineRender: true,
	props: { show: { type: Boolean } },
	emits: ["update:show"],
	setup(__props, { emit: __emit }) {
		useRouter();
		const articlesStore = useArticlesStore();
		const searchKeyword = ref("");
		const sortBy = ref("id");
		const sortOrder = ref("desc");
		const filteredPosts = computed(() => {
			let result = [...articlesStore.articles];
			if (searchKeyword.value) {
				const keyword = searchKeyword.value.toLowerCase();
				result = result.filter((post) => post.title.toLowerCase().includes(keyword) || post.tags?.some((tag) => tag.toLowerCase().includes(keyword)));
			}
			result.sort((a, b) => {
				let comparison = 0;
				if (sortBy.value === "id") comparison = Number(a.id) - Number(b.id);
				else if (sortBy.value === "title") comparison = a.title.localeCompare(b.title, "zh-CN");
				return sortOrder.value === "desc" ? -comparison : comparison;
			});
			return result;
		});
		const posts = computed(() => filteredPosts.value);
		const loadPosts = async () => {
			await articlesStore.fetchArticles();
		};
		const getSortIcon = (sortType) => {
			if (sortBy.value !== sortType) return "";
			return sortOrder.value === "desc" ? "↓" : "↑";
		};
		onMounted(() => {
			loadPosts();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "post-menu-container" }, _attrs))} data-v-aa41d0b6><div class="post-menu-btn-container" data-v-aa41d0b6><button class="post-menu-btn"${ssrRenderAttr("title", __props.show ? "关闭菜单" : "文章菜单")} data-v-aa41d0b6>`);
			if (!__props.show) _push(`<svg class="menu-btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-aa41d0b6><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-aa41d0b6></path></svg>`);
			else _push(`<svg class="menu-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-aa41d0b6><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" data-v-aa41d0b6></path></svg>`);
			_push(`</button></div>`);
			ssrRenderTeleport(_push, (_push) => {
				_push(`<div class="${ssrRenderClass([{ active: __props.show }, "post-menu-card"])}" data-v-aa41d0b6><div class="post-menu-card-header" data-v-aa41d0b6><div class="post-menu-header-left" data-v-aa41d0b6><svg class="post-menu-header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-aa41d0b6><path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-aa41d0b6></path></svg><h3 data-v-aa41d0b6>文章菜单</h3><span class="post-menu-count" data-v-aa41d0b6>${ssrInterpolate(posts.value.length)}</span></div><button class="post-menu-close-btn" title="关闭" data-v-aa41d0b6><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-aa41d0b6><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-aa41d0b6></path></svg></button></div><div class="post-menu-divider" data-v-aa41d0b6></div><div class="post-menu-controls" data-v-aa41d0b6><div class="search-box" data-v-aa41d0b6><svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-aa41d0b6><path d="M21 21L15 15M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-aa41d0b6></path></svg><input type="text"${ssrRenderAttr("value", searchKeyword.value)} placeholder="搜索文章标题或标签..." class="menu-search-input" data-v-aa41d0b6>`);
				if (searchKeyword.value) _push(`<button class="menu-clear-search-btn" title="清除" data-v-aa41d0b6><svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-aa41d0b6><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" data-v-aa41d0b6></path></svg></button>`);
				else _push(`<!---->`);
				_push(`</div><div class="sort-controls" data-v-aa41d0b6><button class="${ssrRenderClass([{ active: sortBy.value === "id" }, "sort-btn"])}" data-v-aa41d0b6> ID ${ssrInterpolate(getSortIcon("id"))}</button><button class="${ssrRenderClass([{ active: sortBy.value === "title" }, "sort-btn"])}" data-v-aa41d0b6> 标题 ${ssrInterpolate(getSortIcon("title"))}</button></div></div><div class="post-menu-divider" data-v-aa41d0b6></div><div class="post-menu-card-content" data-v-aa41d0b6><ul class="post-list" data-v-aa41d0b6><!--[-->`);
				ssrRenderList(posts.value, (post, index) => {
					_push(`<li class="post-list-item" data-v-aa41d0b6><span class="post-index" data-v-aa41d0b6>${ssrInterpolate(index + 1)}</span><div class="post-info" data-v-aa41d0b6><span class="post-title" data-v-aa41d0b6>${ssrInterpolate(post.title)}</span><div class="post-meta" data-v-aa41d0b6><span class="post-date" data-v-aa41d0b6>${ssrInterpolate(post.date)}</span>`);
					if (post.category) _push(`<span class="post-category" data-v-aa41d0b6>${ssrInterpolate(post.category)}</span>`);
					else _push(`<!---->`);
					_push(`</div></div></li>`);
				});
				_push(`<!--]--></ul>`);
				if (!posts.value.length) _push(`<div class="post-list-empty" data-v-aa41d0b6><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-aa41d0b6><path d="M21 21L15 15M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-v-aa41d0b6></path></svg><span data-v-aa41d0b6>没有匹配的文章</span></div>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/PostMenu.vue
var _sfc_setup$1 = PostMenu_vue_vue_type_script_setup_true_lang_default.setup;
PostMenu_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/PostMenu.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var PostMenu_default = /* @__PURE__ */ _plugin_vue_export_helper_default(PostMenu_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-aa41d0b6"]]);
//#endregion
//#region src/components/api/Comment.vue?vue&type=script&setup=true&lang.ts
var Comment_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Comment",
	__ssrInlineRender: true,
	setup(__props) {
		const commentStore = useCommentStore();
		const themeStore = useThemeStore();
		const isLoading = ref(false);
		computed(() => commentStore.commentLoaded);
		const error = ref(null);
		const commentCount = computed(() => commentStore.commentCount);
		watch([() => themeStore.isDark, () => themeStore.currentStyle], () => {
			commentStore.updateGiscusTheme("");
		});
		onMounted(() => {
			commentStore.loadPreference();
			commentStore.initCommentSystem();
			if (typeof window !== "undefined") window.updateGiscusTheme = commentStore.updateGiscusTheme;
			setTimeout(() => {
				isLoading.value = false;
				commentStore.setCommentLoaded(true);
			}, 1500);
		});
		onUnmounted(() => {
			if (typeof window !== "undefined") delete window.updateGiscusTheme;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "comment-section" }, _attrs))} data-v-0b653176><div class="comment-header" data-v-0b653176><h3 data-v-0b653176>评论</h3>`);
			if (commentCount.value > 0) _push(`<span class="comment-count" data-v-0b653176>${ssrInterpolate(commentCount.value)} 条评论</span>`);
			else _push(`<!---->`);
			_push(`</div><p class="comment-hint" data-v-0b653176> 想说点什么呢……</p><div class="comment-content" data-v-0b653176>`);
			if (isLoading.value) _push(`<div class="loading-state" data-v-0b653176><div class="loading-spinner" data-v-0b653176></div><span class="loading-text" data-v-0b653176>加载评论中...</span></div>`);
			else if (error.value) _push(`<div class="error-state" data-v-0b653176><div class="error-icon" data-v-0b653176><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-0b653176><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" data-v-0b653176></path><line x1="12" y1="9" x2="12" y2="13" data-v-0b653176></line><line x1="12" y1="17" x2="12.01" y2="17" data-v-0b653176></line></svg></div><span class="error-text" data-v-0b653176>${ssrInterpolate(error.value)}</span><button class="retry-button" data-v-0b653176>重试</button></div>`);
			else _push(`<div class="comment-container" data-v-0b653176></div>`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region src/components/api/Comment.vue
var _sfc_setup = Comment_vue_vue_type_script_setup_true_lang_default.setup;
Comment_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/Comment.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Comment_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Comment_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-0b653176"]]);
//#endregion
export { ReadingTime_default as a, Toc_default as i, PostMenu_default as n, ContentRender_default as o, TocButton_default as r, BackToTop_default as s, Comment_default as t };
