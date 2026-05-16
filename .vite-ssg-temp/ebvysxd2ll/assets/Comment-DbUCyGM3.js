import { _ as useScrollStore, a as useContentStore, h as useTocStore, i as useArticlesStore, o as useCommentStore, v as useThemeStore } from "./stores-D5XJjRmy.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as MarkdownRender_default } from "./MarkdownRender-DpjFFQRI.js";
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
			}] }, _attrs))} data-v-adaa2faf><img${ssrRenderAttr("src", arrow_up_default)} alt="返回顶部" data-v-adaa2faf></button>`);
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
var BackToTop_default = /* @__PURE__ */ _plugin_vue_export_helper_default(BackToTop_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-adaa2faf"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "content-loader" }, _attrs))} data-v-8dd4df7a>`);
			if (unref(loading)) _push(`<div class="loading-message" data-v-8dd4df7a><div class="loading-spinner" data-v-8dd4df7a></div><p data-v-8dd4df7a>加载中...</p></div>`);
			else if (error.value) _push(`<div class="error-message" data-v-8dd4df7a><div class="error-icon" data-v-8dd4df7a>⚠️</div><p data-v-8dd4df7a>${ssrInterpolate(error.value)}</p><button class="retry-button" data-v-8dd4df7a>重试</button></div>`);
			else if (loadedContent.value) {
				_push(`<div class="content-container" data-v-8dd4df7a><div class="text-style" data-v-8dd4df7a>`);
				if (__props.type === "project") _push(`<!--[--><p data-v-8dd4df7a>项目名称：${ssrInterpolate(loadedContent.value.name)}</p><p data-v-8dd4df7a>分类：${ssrInterpolate(loadedContent.value.category)}</p><p data-v-8dd4df7a>编号：${ssrInterpolate(loadedContent.value.id)}</p><hr data-v-8dd4df7a><p data-v-8dd4df7a>项目描述：${ssrInterpolate(loadedContent.value.description)}</p><hr data-v-8dd4df7a><!--]-->`);
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
var _sfc_setup$5 = ContentRender_vue_vue_type_script_setup_true_lang_default.setup;
ContentRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/ContentRender.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var ContentRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ContentRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8dd4df7a"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "reading-time-wrapper" }, _attrs))} data-v-1a9f2137>`);
			if (readingTime.value) _push(`<div class="${ssrRenderClass([{ "dark-theme": isDarkTheme.value }, "reading-time-container"])}" data-v-1a9f2137><div class="word-count-section" data-v-1a9f2137><span class="word-count-icon" data-v-1a9f2137><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-1a9f2137><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-1a9f2137></path><polyline points="14 2 14 8 20 8" data-v-1a9f2137></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-1a9f2137></line><line x1="16" y1="17" x2="8" y2="17" data-v-1a9f2137></line><polyline points="10 9 9 9 8 9" data-v-1a9f2137></polyline></svg></span><span class="word-count-text" data-v-1a9f2137> 字数统计: ${ssrInterpolate(readingTime.value.totalWords)} 字 </span><span class="word-count-detail" data-v-1a9f2137> (${ssrInterpolate(readingTime.value.chineseCount)}中文 / ${ssrInterpolate(readingTime.value.englishCount)}英文 / ${ssrInterpolate(readingTime.value.codeCount)}代码) </span></div><div class="reading-time-section" data-v-1a9f2137><span class="reading-time-icon" data-v-1a9f2137><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-1a9f2137><circle cx="12" cy="12" r="10" data-v-1a9f2137></circle><polyline points="12 6 12 12 16 14" data-v-1a9f2137></polyline></svg></span><span class="reading-time-text" data-v-1a9f2137> 预计阅读时间: ${ssrInterpolate(formatTime(readingTime.value))}</span></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/ReadingTime.vue
var _sfc_setup$4 = ReadingTime_vue_vue_type_script_setup_true_lang_default.setup;
ReadingTime_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ReadingTime.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var ReadingTime_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ReadingTime_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1a9f2137"]]);
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
		const themeStore = useThemeStore();
		const tocContentRef = ref(null);
		const toc = ref([]);
		const collapsedSet = ref(/* @__PURE__ */ new Set());
		const expandedAll = ref(true);
		const activeId = ref("");
		computed(() => themeStore.isDark);
		function genNum(index, level, counters) {
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
		function isChildActive(node) {
			if (node.id === activeId.value) return true;
			for (const c of node.children) if (isChildActive(c)) return true;
			return false;
		}
		const renderedTree = computed(() => {
			return renderNodes(treeToc.value, 0);
		});
		function renderNodes(nodes, _depth) {
			const result = [];
			for (const node of nodes) {
				const hasCh = node.children && node.children.length > 0;
				const col = collapsedSet.value.has(node.id);
				const active = activeId.value === node.id;
				let childrenHtml = null;
				if (hasCh && !col) childrenHtml = renderNodes(node.children, _depth + 1);
				result.push({
					id: node.id,
					level: node.level,
					text: node.text,
					numbering: node.numbering,
					hasChildren: hasCh,
					collapsed: col,
					active,
					childrenHtml
				});
			}
			return result;
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["toc-card", { active: __props.show }] }, _attrs))} data-v-21e2b37c><div class="toc-card-header" data-v-21e2b37c><h3 data-v-21e2b37c>文章目录</h3><div class="header-actions" data-v-21e2b37c>`);
			if (toc.value.length) _push(`<span class="toc-count" data-v-21e2b37c>${ssrInterpolate(toc.value.length)} 项</span>`);
			else _push(`<!---->`);
			_push(`<button class="toc-close-btn" title="关闭" data-v-21e2b37c>x</button></div></div><div class="toc-toolbar" data-v-21e2b37c>`);
			if (expandedAll.value) _push(`<button class="toc-tb-btn" data-v-21e2b37c>折叠全部</button>`);
			else _push(`<button class="toc-tb-btn" data-v-21e2b37c>展开全部</button>`);
			_push(`</div><div class="toc-card-content" data-v-21e2b37c><ul class="toc-list" data-v-21e2b37c><!--[-->`);
			ssrRenderList(renderedTree.value, (node) => {
				_push(`<li class="${ssrRenderClass([[`lv-${node.level}`, { active: node.active }], "toc-item"])}" data-v-21e2b37c><a href="#" class="toc-link" data-v-21e2b37c>`);
				if (node.hasChildren) _push(`<span class="toc-arrow" data-v-21e2b37c><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="${ssrRenderClass({ rot: !node.collapsed })}" data-v-21e2b37c><polygon points="8,4 16,12 8,20" data-v-21e2b37c></polygon></svg></span>`);
				else _push(`<span class="toc-arrow-blank" data-v-21e2b37c></span>`);
				_push(`<span class="toc-num" data-v-21e2b37c>${ssrInterpolate(node.numbering)}</span><span class="toc-text" data-v-21e2b37c>${ssrInterpolate(node.text)}</span></a>`);
				if (node.hasChildren && !node.collapsed) {
					_push(`<div class="toc-children" data-v-21e2b37c><ul class="toc-list" data-v-21e2b37c><!--[-->`);
					ssrRenderList(node.childrenHtml, (child) => {
						_push(`<li class="${ssrRenderClass([[`lv-${child.level}`, { active: child.active }], "toc-item"])}" data-v-21e2b37c><a href="#" class="toc-link" data-v-21e2b37c>`);
						if (child.hasChildren) _push(`<span class="toc-arrow" data-v-21e2b37c><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="${ssrRenderClass({ rot: !child.collapsed })}" data-v-21e2b37c><polygon points="8,4 16,12 8,20" data-v-21e2b37c></polygon></svg></span>`);
						else _push(`<span class="toc-arrow-blank" data-v-21e2b37c></span>`);
						_push(`<span class="toc-num" data-v-21e2b37c>${ssrInterpolate(child.numbering)}</span><span class="toc-text" data-v-21e2b37c>${ssrInterpolate(child.text)}</span></a>`);
						if (child.hasChildren && !child.collapsed) {
							_push(`<div class="toc-children" data-v-21e2b37c><ul class="toc-list" data-v-21e2b37c><!--[-->`);
							ssrRenderList(child.childrenHtml, (gc) => {
								_push(`<li class="${ssrRenderClass([[`lv-${gc.level}`, { active: gc.active }], "toc-item"])}" data-v-21e2b37c><a href="#" class="toc-link" data-v-21e2b37c><span class="toc-arrow-blank" data-v-21e2b37c></span><span class="toc-num" data-v-21e2b37c>${ssrInterpolate(gc.numbering)}</span><span class="toc-text" data-v-21e2b37c>${ssrInterpolate(gc.text)}</span></a></li>`);
							});
							_push(`<!--]--></ul></div>`);
						} else _push(`<!---->`);
						_push(`</li>`);
					});
					_push(`<!--]--></ul></div>`);
				} else _push(`<!---->`);
				_push(`</li>`);
			});
			_push(`<!--]--></ul>`);
			if (!toc.value.length) _push(`<div class="toc-empty" data-v-21e2b37c>暂无目录</div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
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
var Toc_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Toc_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-21e2b37c"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["toc-btn-container", { "dark-theme": isDarkTheme.value }] }, _attrs))} data-v-bfb39d31><button class="${ssrRenderClass([{ active: unref(tocStore).show }, "toc-btn"])}"${ssrRenderAttr("title", unref(tocStore).show ? "关闭目录" : "打开目录")} data-v-bfb39d31><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="${ssrRenderClass({ active: unref(tocStore).show })}" data-v-bfb39d31><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" data-v-bfb39d31></path></svg><span class="btn-text" data-v-bfb39d31>目录</span></button></div>`);
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
var TocButton_default = /* @__PURE__ */ _plugin_vue_export_helper_default(TocButton_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-bfb39d31"]]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "post-menu-container" }, _attrs))} data-v-45581d72><div class="post-menu-btn-container" data-v-45581d72><button class="post-menu-btn" data-v-45581d72><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" data-v-45581d72><path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" data-v-45581d72></path></svg> 菜单 </button></div><div class="${ssrRenderClass([{ active: __props.show }, "post-menu-card"])}" data-v-45581d72><div class="post-menu-card-header" data-v-45581d72><h3 data-v-45581d72>文章菜单</h3><button class="post-menu-close-btn" data-v-45581d72><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" data-v-45581d72><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" data-v-45581d72></path></svg></button></div><div class="post-menu-card-content" data-v-45581d72><div class="post-menu-controls" data-v-45581d72><div class="search-box" data-v-45581d72><input type="text"${ssrRenderAttr("value", searchKeyword.value)} placeholder="搜索文章..." class="menu-search-input" data-v-45581d72>`);
			if (searchKeyword.value) _push(`<button class="clear-search-btn" data-v-45581d72> × </button>`);
			else _push(`<!---->`);
			_push(`</div><div class="sort-controls" data-v-45581d72><button class="${ssrRenderClass([{ active: sortBy.value === "id" }, "sort-btn"])}" data-v-45581d72> ID ${ssrInterpolate(getSortIcon("id"))}</button><button class="${ssrRenderClass([{ active: sortBy.value === "title" }, "sort-btn"])}" data-v-45581d72> 标题 ${ssrInterpolate(getSortIcon("title"))}</button></div></div><ul class="post-list" data-v-45581d72><!--[-->`);
			ssrRenderList(posts.value, (post, index) => {
				_push(`<li class="post-list-item" data-v-45581d72><span class="post-id" data-v-45581d72>#${ssrInterpolate(index + 1)}</span><span class="post-title" data-v-45581d72>${ssrInterpolate(post.title)}</span><span class="post-date" data-v-45581d72>${ssrInterpolate(post.date)}</span></li>`);
			});
			_push(`<!--]--></ul></div></div></div>`);
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
var PostMenu_default = /* @__PURE__ */ _plugin_vue_export_helper_default(PostMenu_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-45581d72"]]);
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
		watch(() => themeStore.isDark, (isDark) => {
			const theme = isDark ? "dark" : "light";
			commentStore.updateGiscusTheme(theme);
		});
		onMounted(() => {
			commentStore.loadPreference();
			if (typeof window !== "undefined") window.updateGiscusTheme = commentStore.updateGiscusTheme;
			const theme = themeStore.isDark ? "dark" : "light";
			commentStore.updateGiscusTheme(theme);
			setTimeout(() => {
				isLoading.value = false;
				commentStore.setCommentLoaded(true);
			}, 1e3);
		});
		onUnmounted(() => {
			if (typeof window !== "undefined") delete window.updateGiscusTheme;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "comment-section" }, _attrs))} data-v-129b7841><div class="comment-header" data-v-129b7841><h3 data-v-129b7841>评论</h3>`);
			if (commentCount.value > 0) _push(`<span class="comment-count" data-v-129b7841>${ssrInterpolate(commentCount.value)} 条评论</span>`);
			else _push(`<!---->`);
			_push(`</div><p class="comment-hint" data-v-129b7841>想说点什么呢 (´•ω•\`)</p><div class="comment-content" data-v-129b7841>`);
			if (isLoading.value) _push(`<div class="loading-state" data-v-129b7841><div class="loading-spinner" data-v-129b7841></div><span class="loading-text" data-v-129b7841>加载评论中...</span></div>`);
			else if (error.value) _push(`<div class="error-state" data-v-129b7841><div class="error-icon" data-v-129b7841>⚠️</div><span class="error-text" data-v-129b7841>${ssrInterpolate(error.value)}</span><button class="retry-button" data-v-129b7841>重试</button></div>`);
			else _push(`<div class="comment-container" data-v-129b7841></div>`);
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
var Comment_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Comment_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-129b7841"]]);
//#endregion
export { ReadingTime_default as a, Toc_default as i, PostMenu_default as n, ContentRender_default as o, TocButton_default as r, BackToTop_default as s, Comment_default as t };
