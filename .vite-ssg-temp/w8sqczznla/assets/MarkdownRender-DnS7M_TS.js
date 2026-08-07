import { _ as useThemeStore, c as useCodeStore, l as useMermaidStore, p as useNotificationStore, u as useMathStore } from "./stores-CSCNxxdH.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, defineComponent, mergeProps, nextTick, onMounted, onUnmounted, ref, unref, useSSRContext, watch } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderTeleport } from "vue/server-renderer";
import { useRoute } from "vue-router";
//#region src/components/content/MermaidRender.vue?vue&type=script&setup=true&lang.ts
var MermaidRender_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MermaidRender",
	__ssrInlineRender: true,
	props: { code: {} },
	emits: ["render-success", "render-error"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const containerRef = ref(null);
		const lastRenderedCode = ref("");
		const mermaidId = ref("mermaid-" + Date.now() + "-" + Math.floor(Math.random() * 1e4));
		const mermaidStore = useMermaidStore();
		const themeStore = useThemeStore();
		const isDarkTheme = computed(() => themeStore.isDark);
		const loading = computed(() => mermaidStore.loading);
		const error = computed(() => mermaidStore.error);
		const mermaidCdnLinks = [
			"https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js",
			"https://unpkg.com/mermaid@10.6.1/dist/mermaid.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js"
		];
		const loadResource = (urls, type) => {
			return new Promise((resolve, reject) => {
				let currentIndex = 0;
				const tryLoad = () => {
					if (currentIndex >= urls.length) {
						reject(/* @__PURE__ */ new Error(`${type} 加载失败，所有 CDN 链接都不可用`));
						return;
					}
					const url = urls[currentIndex];
					const element = document.createElement("script");
					element.src = url;
					element.crossOrigin = "anonymous";
					element.onload = () => resolve();
					element.onerror = () => {
						console.warn(`CDN 加载失败: ${url}，尝试备用链接`);
						currentIndex++;
						tryLoad();
					};
					document.head.appendChild(element);
				};
				tryLoad();
			});
		};
		const loadMermaid = () => {
			return new Promise((resolve, reject) => {
				if (window.mermaid) {
					mermaidStore.setMermaidLoaded(true);
					if (!window.mermaidInitialized) initializeMermaid();
					resolve();
					return;
				}
				loadResource(mermaidCdnLinks, "Mermaid JS").then(() => {
					mermaidStore.setMermaidLoaded(true);
					initializeMermaid();
					resolve();
				}).catch((err) => {
					mermaidStore.setError("Mermaid 加载失败");
					reject(err);
				});
			});
		};
		const initializeMermaid = () => {
			const theme = isDarkTheme.value ? "dark" : "default";
			window.mermaid.initialize({
				startOnLoad: false,
				securityLevel: "loose",
				theme,
				flowchart: {
					useMaxWidth: true,
					htmlLabels: true,
					nodeSpacing: 100,
					rankSpacing: 100
				}
			});
			window.mermaidInitialized = true;
		};
		const renderMermaid = async () => {
			if (!containerRef.value) return;
			mermaidStore.setLoading(true);
			mermaidStore.resetError();
			if (!mermaidStore.mermaidLoaded) try {
				await loadMermaid();
			} catch (error) {
				mermaidStore.setLoading(false);
				emit("render-error", error);
				return;
			}
			else initializeMermaid();
			if (lastRenderedCode.value === props.code) {
				mermaidStore.setLoading(false);
				return;
			}
			try {
				containerRef.value.innerHTML = "";
				mermaidId.value = "mermaid-" + Date.now() + "-" + Math.floor(Math.random() * 1e4);
				const { svg } = await window.mermaid.render(mermaidId.value, props.code);
				containerRef.value.innerHTML = svg;
				lastRenderedCode.value = props.code;
				mermaidStore.incrementRenderedCount();
				emit("render-success", props.code);
			} catch (error) {
				const errorMessage = `图表渲染错误: ${error.message}`;
				mermaidStore.setError(errorMessage);
				containerRef.value.innerHTML = `<span style="color: #cc0000;">${errorMessage}</span>`;
				emit("render-error", error);
			} finally {
				mermaidStore.setLoading(false);
			}
		};
		onMounted(() => {
			renderMermaid();
		});
		watch(() => props.code, () => {
			nextTick(() => {
				renderMermaid();
			});
		});
		watch(() => isDarkTheme.value, () => {
			nextTick(() => {
				renderMermaid();
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["mermaid-container", { "mermaid-container-dark": isDarkTheme.value }] }, _attrs))} data-v-b946c137>`);
			if (loading.value) _push(`<div class="mermaid-loading" data-v-b946c137><div class="loading-spinner" data-v-b946c137></div><span data-v-b946c137>加载图表中...</span></div>`);
			else if (error.value) _push(`<div class="mermaid-error" data-v-b946c137><span data-v-b946c137>${ssrInterpolate(error.value)}</span><button class="retry-button" data-v-b946c137>重试</button></div>`);
			else _push(`<!---->`);
			_push(`<div style="${ssrRenderStyle(!loading.value && !error.value ? null : { display: "none" })}" data-v-b946c137></div></div>`);
		};
	}
});
//#endregion
//#region src/components/content/MermaidRender.vue
var _sfc_setup$6 = MermaidRender_vue_vue_type_script_setup_true_lang_default.setup;
MermaidRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/MermaidRender.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var MermaidRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(MermaidRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b946c137"]]);
//#endregion
//#region src/components/content/KatexRender.vue?vue&type=script&setup=true&lang.ts
var KatexRender_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "KatexRender",
	__ssrInlineRender: true,
	props: { latex: {} },
	emits: ["render-success", "render-error"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const mathRef = ref(null);
		const lastRenderedLatex = ref("");
		const mathStore = useMathStore();
		const themeStore = useThemeStore();
		const isDarkTheme = computed(() => themeStore.isDark);
		const loading = computed(() => mathStore.loading);
		const error = computed(() => mathStore.error);
		const katexCdnLinks = {
			css: [
				"https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
				"https://unpkg.com/katex@0.16.8/dist/katex.min.css",
				"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.css"
			],
			js: [
				"https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js",
				"https://unpkg.com/katex@0.16.8/dist/katex.min.js",
				"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.js"
			],
			autoRender: [
				"https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js",
				"https://unpkg.com/katex@0.16.8/dist/contrib/auto-render.min.js",
				"https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/contrib/auto-render.min.js"
			]
		};
		const loadResource = (urls, type) => {
			return new Promise((resolve, reject) => {
				let currentIndex = 0;
				const tryLoad = () => {
					if (currentIndex >= urls.length) {
						reject(/* @__PURE__ */ new Error(`${type} 加载失败，所有 CDN 链接都不可用`));
						return;
					}
					const url = urls[currentIndex];
					let element;
					if (type === "css") {
						element = document.createElement("link");
						element.rel = "stylesheet";
						element.href = url;
					} else if (type === "js") {
						element = document.createElement("script");
						element.src = url;
					}
					element.crossOrigin = "anonymous";
					element.onload = () => resolve();
					element.onerror = () => {
						console.warn(`CDN 加载失败: ${url}，尝试备用链接`);
						currentIndex++;
						tryLoad();
					};
					if (type === "css") document.head.appendChild(element);
					else if (type === "js") document.head.appendChild(element);
				};
				tryLoad();
			});
		};
		const loadKaTeX = () => {
			return new Promise(async (resolve, reject) => {
				if (window.katex) {
					mathStore.setKaTeXLoaded(true);
					resolve();
					return;
				}
				try {
					await loadResource(katexCdnLinks.css, "css");
					await loadResource(katexCdnLinks.js, "js");
					await loadResource(katexCdnLinks.autoRender, "js");
					mathStore.setKaTeXLoaded(true);
					resolve();
				} catch (error) {
					mathStore.setError("KaTeX 加载失败");
					reject(error);
				}
			});
		};
		const renderMath = async () => {
			if (!mathRef.value) return;
			mathStore.setLoading(true);
			mathStore.resetError();
			if (!mathStore.katexLoaded) try {
				await loadKaTeX();
			} catch (error) {
				mathStore.setLoading(false);
				emit("render-error", error);
				return;
			}
			if (lastRenderedLatex.value === props.latex) {
				mathStore.setLoading(false);
				return;
			}
			try {
				mathRef.value.innerHTML = "";
				if (window.katex) {
					window.katex.render(props.latex, mathRef.value, {
						throwOnError: false,
						displayMode: true,
						fleqn: false,
						errorColor: "#cc0000",
						strict: "ignore",
						trust: true
					});
					lastRenderedLatex.value = props.latex;
					mathStore.incrementRenderedCount();
					emit("render-success", props.latex);
				} else throw new Error("KaTeX 库未加载");
			} catch (error) {
				console.error("渲染数学公式失败:", error);
				mathStore.setError("公式渲染错误: " + error.message);
				mathRef.value.innerHTML = `<span style="color: #cc0000;">公式渲染错误: ${error.message}</span>`;
				emit("render-error", error);
			} finally {
				mathStore.setLoading(false);
			}
		};
		onMounted(() => {
			renderMath();
		});
		watch(() => props.latex, () => {
			nextTick(() => {
				renderMath();
			});
		});
		onUnmounted(() => {});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["math-container", { "math-container-dark": isDarkTheme.value }] }, _attrs))} data-v-16f65687>`);
			if (loading.value) _push(`<div class="math-loading" data-v-16f65687><div class="loading-spinner" data-v-16f65687></div><span data-v-16f65687>加载数学公式中...</span></div>`);
			else if (error.value) _push(`<div class="math-error" data-v-16f65687><span data-v-16f65687>${ssrInterpolate(error.value)}</span><button class="retry-button" data-v-16f65687>重试</button></div>`);
			else _push(`<!---->`);
			_push(`<div class="math-content" style="${ssrRenderStyle(!loading.value && !error.value ? null : { display: "none" })}" data-v-16f65687></div></div>`);
		};
	}
});
//#endregion
//#region src/components/content/KatexRender.vue
var _sfc_setup$5 = KatexRender_vue_vue_type_script_setup_true_lang_default.setup;
KatexRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/KatexRender.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var KatexRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(KatexRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-16f65687"]]);
//#endregion
//#region src/components/content/CodeRender.vue?vue&type=script&setup=true&lang.ts
var CodeRender_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "CodeRender",
	__ssrInlineRender: true,
	props: { code: {} },
	setup(__props) {
		const route = useRoute();
		computed(() => route.params.id || "");
		const clipboardStore = useCodeStore();
		useNotificationStore();
		const isCopied = ref(false);
		const isLoading = ref(false);
		const animationClass = ref("");
		onMounted(() => {
			clipboardStore.init();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({
				class: ["copy-button", {
					"copied": isCopied.value,
					"loading": isLoading.value,
					[animationClass.value]: animationClass.value
				}],
				title: "Copy code",
				tabindex: "0",
				role: "button",
				"aria-label": isCopied.value ? "Code copied!" : "Copy code"
			}, _attrs))} data-v-766904a0>`);
			if (isLoading.value) _push(`<span class="loading-spinner" data-v-766904a0></span>`);
			else if (isCopied.value) _push(`<span class="status-text success" data-v-766904a0><span class="check-icon" data-v-766904a0>✓</span><span class="text" data-v-766904a0>Copied!</span></span>`);
			else _push(`<span class="status-text" data-v-766904a0><span class="copy-icon" data-v-766904a0>⎘</span><span class="text" data-v-766904a0>Copy</span></span>`);
			_push(`</button>`);
		};
	}
});
//#endregion
//#region src/components/content/CodeRender.vue
var _sfc_setup$4 = CodeRender_vue_vue_type_script_setup_true_lang_default.setup;
CodeRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/CodeRender.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var CodeRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(CodeRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-766904a0"]]);
//#endregion
//#region src/components/content/CodePreview.vue?vue&type=script&setup=true&lang.ts
var CodePreview_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "CodePreview",
	__ssrInlineRender: true,
	props: { code: {} },
	setup(__props) {
		const show = ref(false);
		ref(0);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><button class="run-btn" title="运行代码" data-v-df048a06>▶</button>`);
			ssrRenderTeleport(_push, (_push) => {
				if (show.value) _push(`<div class="preview-overlay" data-v-df048a06><div class="preview-window" data-v-df048a06><div class="preview-header" data-v-df048a06><span data-v-df048a06>预览</span><button class="preview-close" data-v-df048a06>×</button></div><div class="preview-body" data-v-df048a06><iframe id="code-preview-frame" class="preview-iframe" sandbox="allow-scripts allow-same-origin" data-v-df048a06></iframe></div></div></div>`);
				else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/components/content/CodePreview.vue
var _sfc_setup$3 = CodePreview_vue_vue_type_script_setup_true_lang_default.setup;
CodePreview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/CodePreview.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var CodePreview_default = /* @__PURE__ */ _plugin_vue_export_helper_default(CodePreview_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-df048a06"]]);
//#endregion
//#region src/components/content/HighlightRender.vue?vue&type=script&setup=true&lang.ts
var HighlightRender_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "HighlightRender",
	__ssrInlineRender: true,
	props: {
		code: {},
		language: { default: "plaintext" },
		showLineNumbers: {
			type: Boolean,
			default: true
		},
		showCopyButton: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const codeRef = ref(null);
		ref(null);
		ref(0);
		const codeStore = useCodeStore();
		const isLoaded = computed(() => codeStore.isPrismLoaded);
		const showLineNumbers = computed(() => props.showLineNumbers && codeStore.lineNumbersEnabled);
		const showCopyButton = computed(() => props.showCopyButton && codeStore.copyEnabled);
		const langAlias = {
			cpp: "cpp",
			Cpp: "cpp",
			CPP: "cpp",
			"c++": "cpp",
			"C++": "cpp",
			c: "c",
			C: "c",
			js: "javascript",
			JS: "javascript",
			ts: "typescript",
			TS: "typescript",
			py: "python",
			PY: "python",
			sh: "bash",
			SH: "bash",
			vue: "vue",
			Vue: "vue"
		};
		const normalizedLanguage = computed(() => langAlias[props.language] || props.language.toLowerCase());
		const loadPrism = () => {
			return new Promise((resolve, reject) => {
				if (window.Prism) {
					codeStore.setPrismLoaded(true);
					resolve();
					return;
				}
				const cssLink = document.createElement("link");
				cssLink.rel = "stylesheet";
				cssLink.href = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css";
				document.head.appendChild(cssLink);
				const script = document.createElement("script");
				script.src = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js";
				script.onload = () => {
					const languages = [
						"javascript",
						"typescript",
						"css",
						"html",
						"json",
						"python",
						"bash",
						"vue",
						"c",
						"cpp"
					];
					let loadedCount = 0;
					const checkComplete = () => {
						if (loadedCount >= languages.length) {
							codeStore.setPrismLoaded(true);
							resolve();
						}
					};
					languages.forEach((lang) => {
						const langScript = document.createElement("script");
						langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
						langScript.onload = () => {
							codeStore.addLoadedLanguage(lang);
							loadedCount++;
							checkComplete();
						};
						langScript.onerror = () => {
							loadedCount++;
							checkComplete();
						};
						document.head.appendChild(langScript);
					});
				};
				script.onerror = reject;
				document.head.appendChild(script);
			});
		};
		const highlightCode = async () => {
			if (!codeRef.value) return;
			if (!isLoaded.value) try {
				await loadPrism();
			} catch (error) {
				console.error("加载 Prism.js 失败:", error);
				return;
			}
			const lines = props.code.split("\n").length;
			const chars = props.code.length;
			codeStore.updateCodeStats(lines, chars);
			codeStore.incrementHighlightCount();
			try {
				window.Prism.highlightElement(codeRef.value);
			} catch (error) {
				console.error("代码高亮失败:", error);
			}
		};
		const generateLineNumbers = () => {
			const lines = props.code.split("\n").length;
			return Array.from({ length: lines }, (_, i) => i + 1);
		};
		onMounted(() => {
			codeStore.init();
			highlightCode();
		});
		watch(() => [props.code, props.language], () => {
			nextTick(() => {
				highlightCode();
			});
		});
		watch(() => codeStore.lineNumbersEnabled, () => {
			nextTick(() => {
				highlightCode();
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["code-container", { "with-line-numbers": showLineNumbers.value }] }, _attrs))} data-v-9a844a8a>`);
			if (__props.language && unref(codeStore).showLanguageBadge) {
				_push(`<div class="code-header" data-v-9a844a8a><span class="language-badge"${ssrRenderAttr("data-lang", __props.language.toLowerCase())} data-v-9a844a8a><span class="lang-dot" data-v-9a844a8a></span><span class="lang-text" data-v-9a844a8a>${ssrInterpolate(__props.language)}</span></span><div class="header-actions" data-v-9a844a8a>`);
				if (showCopyButton.value) _push(ssrRenderComponent(CodeRender_default, { code: __props.code }, null, _parent));
				else _push(`<!---->`);
				if (__props.language && (__props.language.toLowerCase() === "html" || __props.language.toLowerCase() === "htmlembedded")) _push(ssrRenderComponent(CodePreview_default, { code: __props.code }, null, _parent));
				else _push(`<!---->`);
				if (showLineNumbers.value) _push(`<span class="line-count" data-v-9a844a8a>${ssrInterpolate(__props.code.split("\n").length)} lines</span>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="${ssrRenderClass([{ "loading": !isLoaded.value }, "code-content-wrapper"])}" data-v-9a844a8a>`);
			if (showLineNumbers.value) {
				_push(`<div class="line-numbers" data-v-9a844a8a><!--[-->`);
				ssrRenderList(generateLineNumbers(), (line) => {
					_push(`<span class="line-number" data-v-9a844a8a>${ssrInterpolate(line)}</span>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`<pre class="code-content" data-v-9a844a8a><code class="${ssrRenderClass(`language-${normalizedLanguage.value}`)}" data-v-9a844a8a>${ssrInterpolate(__props.code)}</code></pre>`);
			if (showLineNumbers.value) {
				_push(`<div class="line-highlight-overlay" data-v-9a844a8a><!--[-->`);
				ssrRenderList(generateLineNumbers(), (_, i) => {
					_push(`<div class="line-highlight-row" data-v-9a844a8a></div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			if (!isLoaded.value) _push(`<div class="loading-overlay" data-v-9a844a8a><div class="loading-spinner" data-v-9a844a8a></div><span class="loading-text" data-v-9a844a8a>Loading syntax highlighting...</span></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region src/components/content/HighlightRender.vue
var _sfc_setup$2 = HighlightRender_vue_vue_type_script_setup_true_lang_default.setup;
HighlightRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/HighlightRender.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var HighlightRender_default = /* @__PURE__ */ _plugin_vue_export_helper_default(HighlightRender_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-9a844a8a"]]);
//#endregion
//#region src/components/media/EasterEggAnimation.vue?vue&type=script&setup=true&lang.ts
var EasterEggAnimation_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "EasterEggAnimation",
	__ssrInlineRender: true,
	props: {
		text: { default: "欢迎来到我的博客" },
		finalText: { default: "欢迎来到我的博客" }
	},
	setup(__props) {
		const isAnimating = ref(false);
		const showFinalText = ref(false);
		const chars = ref([]);
		onMounted(() => {});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "egg-wrap" }, _attrs))} data-v-051ce2e1><button class="egg-btn"${ssrIncludeBooleanAttr(isAnimating.value) ? " disabled" : ""} data-v-051ce2e1>${ssrInterpolate(isAnimating.value ? "..." : "点击一下试试?")}</button>`);
			ssrRenderTeleport(_push, (_push) => {
				if (isAnimating.value) _push(`<div class="egg-backdrop" data-v-051ce2e1></div>`);
				else _push(`<!---->`);
				if (isAnimating.value) {
					_push(`<div class="egg-overlay" data-v-051ce2e1><!--[-->`);
					ssrRenderList(chars.value, (ch) => {
						_push(`<div class="egg-char" style="${ssrRenderStyle({
							left: ch.x + "px",
							top: ch.y + "px",
							opacity: ch.opacity
						})}" data-v-051ce2e1>${ssrInterpolate(ch.char)}</div>`);
					});
					_push(`<!--]-->`);
					if (showFinalText.value) _push(`<div class="egg-final" data-v-051ce2e1>${ssrInterpolate(__props.finalText)}</div>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/media/EasterEggAnimation.vue
var _sfc_setup$1 = EasterEggAnimation_vue_vue_type_script_setup_true_lang_default.setup;
EasterEggAnimation_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/media/EasterEggAnimation.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var EasterEggAnimation_default = /* @__PURE__ */ _plugin_vue_export_helper_default(EasterEggAnimation_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-051ce2e1"]]);
//#endregion
//#region src/components/content/MarkdownRender.vue?vue&type=script&setup=true&lang.ts
var MarkdownRender_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "MarkdownRender",
	__ssrInlineRender: true,
	props: { content: {} },
	setup(__props) {
		const props = __props;
		const route = useRoute();
		computed(() => route.params.id || "");
		const markdownContent = ref("");
		const showLightbox = ref(false);
		const currentImageIndex = ref(0);
		const lightboxImages = ref([]);
		const mermaidBlocks = ref([]);
		const mathBlocks = ref([]);
		const codeBlocks = ref([]);
		const easterEggBlocks = ref([]);
		const orderedBlocks = ref([]);
		const renderMode = ref("normal");
		const loadCDN = async () => {
			console.log("开始加载CDN资源", window.marked);
			const cleanupOldResources = () => {
				document.querySelectorAll("script[src*=\"marked\"]").forEach((script) => script.remove());
				delete window.marked;
			};
			cleanupOldResources();
			await new Promise((resolve, reject) => {
				const script = document.createElement("script");
				script.src = "https://cdn.jsdelivr.net/npm/marked@14.0.0/marked.min.js";
				script.onload = () => {
					console.log("marked.js加载完成", window.marked);
					resolve();
				};
				script.onerror = () => {
					console.error("marked.js加载失败，尝试备用链接");
					const backupScript = document.createElement("script");
					backupScript.src = "https://unpkg.com/marked@14.0.0/marked.min.js";
					backupScript.onload = () => {
						console.log("marked.js备用链接加载完成");
						resolve();
					};
					backupScript.onerror = () => {
						console.error("marked.js备用链接也加载失败");
						reject(/* @__PURE__ */ new Error("marked.js加载失败"));
					};
					document.head.appendChild(backupScript);
				};
				document.head.appendChild(script);
			});
			if (window.marked && typeof window.marked === "object") {
				console.log("marked配置成功");
				if (typeof window.marked.parse === "function") console.log("使用marked.parse方法");
				else if (typeof window.marked === "function") console.log("使用marked函数");
				else console.error("marked.js API结构异常", window.marked);
			} else {
				console.error("marked.js未正确加载", window.marked);
				throw new Error("marked.js未正确加载");
			}
			console.log("CDN资源加载完成");
		};
		const extractSpecialBlocks = (content) => {
			mermaidBlocks.value = [];
			mathBlocks.value = [];
			codeBlocks.value = [];
			easterEggBlocks.value = [];
			const mermaidRegex = /```mermaid[\s\S]*?```/gim;
			let match;
			while ((match = mermaidRegex.exec(content)) !== null) {
				const code = match[0].replace(/^```mermaid\s*/i, "").replace(/```$/i, "").trim();
				mermaidBlocks.value.push({
					id: `mermaid-${mermaidBlocks.value.length}`,
					code
				});
			}
			const mathRegex = /\$\$([\s\S]*?)\$\$/gim;
			while ((match = mathRegex.exec(content)) !== null) {
				const latex = match[1].trim();
				mathBlocks.value.push({
					id: `math-${mathBlocks.value.length}`,
					latex
				});
			}
			const codeRegex = /```([\s\S]*?)```/gim;
			while ((match = codeRegex.exec(content)) !== null) {
				const lines = match[1].split("\n");
				const lang = lines[0].trim() || "plaintext";
				let codeContent = lines.slice(1).join("\n");
				if (lang.toLowerCase() !== "mermaid") codeBlocks.value.push({
					language: lang,
					code: codeContent.replace(/\n+$/, "")
				});
			}
			const easterEggRegex = /<easter-egg([^>]*)>[\s\S]*?<\/easter-egg>/gim;
			while ((match = easterEggRegex.exec(content)) !== null) {
				const textMatch = match[0].match(/text=["']([^"']+)["']/);
				const finalTextMatch = match[0].match(/final-text=["']([^"']+)["']/);
				easterEggBlocks.value.push({
					id: `easter-egg-${easterEggBlocks.value.length}`,
					text: textMatch ? textMatch[1] : "欢迎来到我的博客",
					finalText: finalTextMatch ? finalTextMatch[1] : "欢迎来到我的博客"
				});
			}
		};
		const extractOrderedBlocks = (content) => {
			const blocks = [];
			let lastIndex = 0;
			const yamlMatch = content.match(/^---[\s\S]*?---\n?/);
			if (yamlMatch) lastIndex = yamlMatch[0].length;
			const patterns = [
				{
					type: "mermaid",
					regex: /```mermaid[\s\S]*?```/gim
				},
				{
					type: "math",
					regex: /\$\$([\s\S]*?)\$\$/gim
				},
				{
					type: "code",
					regex: /```([\s\S]*?)```/gim
				},
				{
					type: "easter-egg",
					regex: /<easter-egg([^>]*)>[\s\S]*?<\/easter-egg>/gim
				}
			];
			const allMatches = [];
			patterns.forEach(({ type, regex }) => {
				let match;
				while ((match = regex.exec(content)) !== null) allMatches.push({
					type,
					match,
					index: match.index
				});
			});
			allMatches.sort((a, b) => a.index - b.index);
			allMatches.forEach(({ type, match, index }) => {
				if (index > lastIndex) {
					const markdownContent = content.substring(lastIndex, index);
					if (markdownContent.trim()) blocks.push({
						type: "markdown",
						content: markdownContent
					});
				}
				if (type === "mermaid") {
					const code = match[0].replace(/^```mermaid\s*/i, "").replace(/```$/i, "").trim();
					blocks.push({
						type: "mermaid",
						content: code
					});
				} else if (type === "math") {
					const latex = match[1].trim();
					blocks.push({
						type: "math",
						content: latex
					});
				} else if (type === "code") {
					const lines = match[1].split("\n");
					const lang = lines[0].trim() || "plaintext";
					const codeContent = lines.slice(1).join("\n").replace(/\n+$/, "");
					if (lang.toLowerCase() !== "mermaid") blocks.push({
						type: "code",
						content: codeContent,
						language: lang
					});
				} else if (type === "easter-egg") {
					const textMatch = match[0].match(/text=["']([^"']+)["']/);
					const finalTextMatch = match[0].match(/final-text=["']([^"']+)["']/);
					blocks.push({
						type: "easter-egg",
						content: match[0],
						text: textMatch ? textMatch[1] : "欢迎来到我的博客",
						finalText: finalTextMatch ? finalTextMatch[1] : "欢迎来到我的博客"
					});
				}
				lastIndex = index + match[0].length;
			});
			if (lastIndex < content.length) {
				const markdownContent = content.substring(lastIndex);
				if (markdownContent.trim()) blocks.push({
					type: "markdown",
					content: markdownContent
				});
			}
			return blocks;
		};
		const renderMarkdown = async () => {
			console.log("开始渲染Markdown", props.content);
			try {
				await loadCDN();
				console.log("CDN资源加载完成后，开始处理Markdown");
				extractSpecialBlocks(props.content);
				console.log("特殊块提取完成", mermaidBlocks.value, mathBlocks.value, codeBlocks.value, easterEggBlocks.value);
				if (mermaidBlocks.value.length > 0 || mathBlocks.value.length > 0 || codeBlocks.value.length > 0 || easterEggBlocks.value.length > 0) {
					renderMode.value = "special-blocks";
					orderedBlocks.value = extractOrderedBlocks(props.content).map((block) => {
						if (block.type === "markdown") if (window.marked) if (typeof window.marked.parse === "function") return {
							...block,
							content: window.marked.parse(block.content)
						};
						else if (typeof window.marked === "function") return {
							...block,
							content: window.marked(block.content)
						};
						else return {
							...block,
							content: `<p>Markdown解析器API错误</p>`
						};
						else return {
							...block,
							content: `<p>Markdown解析器加载失败</p>`
						};
						return block;
					});
					console.log("按顺序组织的内容块", orderedBlocks.value);
				} else {
					renderMode.value = "normal";
					let processedContent = props.content.replace(/^---[\s\S]*?---\n?/, "");
					if (window.marked) if (typeof window.marked.parse === "function") markdownContent.value = window.marked.parse(processedContent);
					else if (typeof window.marked === "function") markdownContent.value = window.marked(processedContent);
					else {
						markdownContent.value = `<p>Markdown解析器API错误</p>`;
						console.error("Markdown解析器API错误", window.marked);
					}
					else {
						markdownContent.value = `<p>Markdown解析器加载失败</p>`;
						console.error("Markdown解析器加载失败");
					}
				}
				nextTick(() => {
					addImageClickListeners();
				});
			} catch (error) {
				console.error("渲染Markdown时出错:", error);
				markdownContent.value = `<p>渲染Markdown时出错: ${error.message}</p>`;
				renderMode.value = "normal";
			}
		};
		const addImageClickListeners = () => {
			setTimeout(() => {
				const contentImages = document.querySelectorAll(".markdown-content img, .post-content img, .markdown-image");
				const imageData = [];
				contentImages.forEach((image, index) => {
					const src = image.src;
					const alt = image.alt || "";
					imageData.push({
						src,
						title: alt
					});
					image.style.cursor = "pointer";
					image.removeEventListener("click", () => {});
					image.addEventListener("click", () => {
						openLightbox(index);
					});
				});
				lightboxImages.value = imageData;
			}, 100);
		};
		const showQuotePopup = ref(false);
		const quotePopupPos = ref({
			x: 0,
			y: 0
		});
		const selectedText = ref("");
		const quoteCopied = ref(false);
		function handleTextSelection(e) {
			if (!e.target.closest(".markdown-content")) {
				setTimeout(() => {
					showQuotePopup.value = false;
				}, 200);
				return;
			}
			setTimeout(() => {
				const sel = window.getSelection();
				if (!sel || sel.isCollapsed || !sel.toString().trim()) {
					showQuotePopup.value = false;
					return;
				}
				const text = sel.toString().trim();
				if (text.length < 5) {
					showQuotePopup.value = false;
					return;
				}
				selectedText.value = text;
				quotePopupPos.value = {
					x: e.clientX,
					y: e.clientY - 10
				};
				showQuotePopup.value = true;
				quoteCopied.value = false;
			}, 10);
		}
		const openLightbox = (index) => {
			currentImageIndex.value = index;
			showLightbox.value = true;
		};
		onMounted(() => {
			renderMarkdown();
			document.addEventListener("mouseup", handleTextSelection);
		});
		onUnmounted(() => {
			document.removeEventListener("mouseup", handleTextSelection);
		});
		watch(() => props.content, () => {
			renderMarkdown();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div>`);
			if (renderMode.value === "special-blocks") {
				_push(`<div><!--[-->`);
				ssrRenderList(orderedBlocks.value, (block, index) => {
					_push(`<div>`);
					if (block.type === "mermaid") {
						_push(`<div class="mermaid-container">`);
						_push(ssrRenderComponent(MermaidRender_default, { code: block.content }, null, _parent));
						_push(`</div>`);
					} else if (block.type === "math") {
						_push(`<div class="math-container">`);
						_push(ssrRenderComponent(KatexRender_default, { latex: block.content }, null, _parent));
						_push(`</div>`);
					} else if (block.type === "code") {
						_push(`<div class="code-container">`);
						_push(ssrRenderComponent(HighlightRender_default, {
							code: block.content,
							language: block.language
						}, null, _parent));
						_push(`</div>`);
					} else if (block.type === "easter-egg") {
						_push(`<div class="easter-egg-container">`);
						_push(ssrRenderComponent(EasterEggAnimation_default, {
							text: block.text,
							"final-text": block.finalText
						}, null, _parent));
						_push(`</div>`);
					} else if (block.type === "markdown") _push(`<div class="markdown-content">${block.content ?? ""}</div>`);
					else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<div class="markdown-content">${markdownContent.value ?? ""}</div>`);
			if (showLightbox.value) _push(`<div class="lightbox-overlay"><div class="lightbox-content"><button class="lightbox-close">×</button><img${ssrRenderAttr("src", lightboxImages.value[currentImageIndex.value].src)}${ssrRenderAttr("alt", lightboxImages.value[currentImageIndex.value].title)}><div class="lightbox-title">${ssrInterpolate(lightboxImages.value[currentImageIndex.value].title)}</div><div class="lightbox-nav"><button class="lightbox-prev"${ssrIncludeBooleanAttr(currentImageIndex.value === 0) ? " disabled" : ""}>&lt;</button><button class="lightbox-next"${ssrIncludeBooleanAttr(currentImageIndex.value === lightboxImages.value.length - 1) ? " disabled" : ""}>&gt;</button></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (showQuotePopup.value) {
					_push(`<div class="quote-popup" style="${ssrRenderStyle({
						left: quotePopupPos.value.x + "px",
						top: quotePopupPos.value.y + "px"
					})}">`);
					if (!quoteCopied.value) _push(`<button class="quote-btn"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> 引用 </button>`);
					else _push(`<span class="quote-done">已复制</span>`);
					_push(`</div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/components/content/MarkdownRender.vue
var _sfc_setup = MarkdownRender_vue_vue_type_script_setup_true_lang_default.setup;
MarkdownRender_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/content/MarkdownRender.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var MarkdownRender_default = MarkdownRender_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { MarkdownRender_default as t };
