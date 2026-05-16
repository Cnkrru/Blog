import { v as useThemeStore } from "./stores-D5XJjRmy.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, defineComponent, mergeProps, onMounted, onUnmounted, ref, useSSRContext, watch } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderClass } from "vue/server-renderer";
//#region src/components/p-center/ArticleNav.vue?vue&type=script&setup=true&lang.ts
var ArticleNav_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ArticleNav",
	__ssrInlineRender: true,
	props: {
		prevPost: { default: null },
		nextPost: { default: null }
	},
	emits: ["navigate"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const loadingPrev = ref(false);
		const loadingNext = ref(false);
		const handlePrev = async () => {
			if (!props.prevPost || loadingPrev.value) return;
			loadingPrev.value = true;
			try {
				emit("navigate", props.prevPost);
			} finally {
				loadingPrev.value = false;
			}
		};
		const handleNext = async () => {
			if (!props.nextPost || loadingNext.value) return;
			loadingNext.value = true;
			try {
				emit("navigate", props.nextPost);
			} finally {
				loadingNext.value = false;
			}
		};
		const handleKeydown = (e) => {
			if (e.key === "ArrowLeft" && props.prevPost) handlePrev();
			else if (e.key === "ArrowRight" && props.nextPost) handleNext();
		};
		onMounted(() => {
			window.addEventListener("keydown", handleKeydown);
		});
		onUnmounted(() => {
			window.removeEventListener("keydown", handleKeydown);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "post-nav-container" }, _attrs))} data-v-783470dc><button class="${ssrRenderClass([{
				disabled: !__props.prevPost,
				loading: loadingPrev.value
			}, "post-nav-btn prev"])}"${ssrIncludeBooleanAttr(!__props.prevPost) ? " disabled" : ""} data-v-783470dc><span class="post-nav-btn-icon" data-v-783470dc><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-783470dc><polyline points="15 18 9 12 15 6" data-v-783470dc></polyline></svg></span><div class="post-nav-btn-text" data-v-783470dc><span class="post-nav-btn-label" data-v-783470dc>上一篇</span><span class="post-nav-btn-title" data-v-783470dc>${ssrInterpolate(__props.prevPost?.title || "暂无")}</span></div>`);
			if (loadingPrev.value) _push(`<div class="post-nav-loading" data-v-783470dc></div>`);
			else _push(`<!---->`);
			_push(`</button><button class="${ssrRenderClass([{
				disabled: !__props.nextPost,
				loading: loadingNext.value
			}, "post-nav-btn next"])}"${ssrIncludeBooleanAttr(!__props.nextPost) ? " disabled" : ""} data-v-783470dc><div class="post-nav-btn-text" data-v-783470dc><span class="post-nav-btn-label" data-v-783470dc>下一篇</span><span class="post-nav-btn-title" data-v-783470dc>${ssrInterpolate(__props.nextPost?.title || "暂无")}</span></div><span class="post-nav-btn-icon" data-v-783470dc><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-783470dc><polyline points="9 18 15 12 9 6" data-v-783470dc></polyline></svg></span>`);
			if (loadingNext.value) _push(`<div class="post-nav-loading" data-v-783470dc></div>`);
			else _push(`<!---->`);
			_push(`</button></div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/ArticleNav.vue
var _sfc_setup$1 = ArticleNav_vue_vue_type_script_setup_true_lang_default.setup;
ArticleNav_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ArticleNav.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ArticleNav_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ArticleNav_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-783470dc"]]);
//#endregion
//#region src/components/p-center/SiteStats.vue?vue&type=script&setup=true&lang.ts
var busuanziCdnLink = "//cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js";
var SiteStats_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SiteStats",
	__ssrInlineRender: true,
	setup(__props) {
		const themeStore = useThemeStore();
		const isDarkTheme = computed(() => themeStore.isDark);
		const loadBusuanzi = async () => {
			if (typeof window === "undefined") return;
			if (document.querySelector("script[src*=\"busuanzi\"]")) {
				console.log("不蒜子脚本已加载");
				return;
			}
			const script = document.createElement("script");
			script.src = busuanziCdnLink;
			script.defer = true;
			script.onload = () => {
				console.log("不蒜子脚本加载完成");
			};
			script.onerror = () => {
				console.error("加载不蒜子脚本失败");
			};
			document.head.appendChild(script);
			console.log("不蒜子脚本开始加载:", busuanziCdnLink);
		};
		onMounted(() => {
			loadBusuanzi();
		});
		watch(() => isDarkTheme.value, () => {
			setTimeout(() => {
				window.busuanzi && window.busuanzi.reload && window.busuanzi.reload();
			}, 100);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["site-stats-card", { "site-stats-card-dark": isDarkTheme.value }] }, _attrs))} data-v-3cdaa6da><h3 class="stats-title" data-v-3cdaa6da>站点统计</h3><div class="stats-container" data-v-3cdaa6da><div class="stats-row" data-v-3cdaa6da><div class="stats-item" data-v-3cdaa6da><div class="stats-label" data-v-3cdaa6da>今日总访问量</div><div class="stats-value" data-v-3cdaa6da><span id="busuanzi_today_pv" data-v-3cdaa6da>加载中...</span></div></div><div class="stats-item" data-v-3cdaa6da><div class="stats-label" data-v-3cdaa6da>今日总访客数</div><div class="stats-value" data-v-3cdaa6da><span id="busuanzi_today_uv" data-v-3cdaa6da>加载中...</span></div></div></div><div class="stats-divider" data-v-3cdaa6da></div><div class="stats-row" data-v-3cdaa6da><div class="stats-item" data-v-3cdaa6da><div class="stats-label" data-v-3cdaa6da>本站总访问量</div><div class="stats-value" data-v-3cdaa6da><span id="busuanzi_site_pv" data-v-3cdaa6da>加载中...</span></div></div><div class="stats-item" data-v-3cdaa6da><div class="stats-label" data-v-3cdaa6da>本站总访客数</div><div class="stats-value" data-v-3cdaa6da><span id="busuanzi_site_uv" data-v-3cdaa6da>加载中...</span></div></div></div><div class="stats-divider" data-v-3cdaa6da></div><div class="stats-row" data-v-3cdaa6da><div class="stats-item" data-v-3cdaa6da><div class="stats-label" data-v-3cdaa6da>本页总阅读量</div><div class="stats-value" data-v-3cdaa6da><span id="busuanzi_page_pv" data-v-3cdaa6da>加载中...</span></div></div><div class="stats-item" data-v-3cdaa6da><div class="stats-label" data-v-3cdaa6da>本页总访客数</div><div class="stats-value" data-v-3cdaa6da><span id="busuanzi_page_uv" data-v-3cdaa6da>加载中...</span></div></div></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/SiteStats.vue
var _sfc_setup = SiteStats_vue_vue_type_script_setup_true_lang_default.setup;
SiteStats_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/SiteStats.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var SiteStats_default = /* @__PURE__ */ _plugin_vue_export_helper_default(SiteStats_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3cdaa6da"]]);
//#endregion
export { ArticleNav_default as n, SiteStats_default as t };
