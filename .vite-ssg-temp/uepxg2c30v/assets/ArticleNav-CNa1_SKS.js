import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { defineComponent, mergeProps, onMounted, onUnmounted, ref, useSSRContext } from "vue";
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "post-nav-container" }, _attrs))} data-v-380925b0><button class="${ssrRenderClass([{
				disabled: !__props.prevPost,
				loading: loadingPrev.value
			}, "post-nav-btn prev"])}"${ssrIncludeBooleanAttr(!__props.prevPost) ? " disabled" : ""} data-v-380925b0><span class="post-nav-btn-icon" data-v-380925b0><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-380925b0><polyline points="15 18 9 12 15 6" data-v-380925b0></polyline></svg></span><div class="post-nav-btn-text" data-v-380925b0><span class="post-nav-btn-label" data-v-380925b0>上一篇</span><span class="post-nav-btn-title" data-v-380925b0>${ssrInterpolate(__props.prevPost?.title || "暂无")}</span></div>`);
			if (loadingPrev.value) _push(`<div class="post-nav-loading" data-v-380925b0></div>`);
			else _push(`<!---->`);
			_push(`</button><button class="${ssrRenderClass([{
				disabled: !__props.nextPost,
				loading: loadingNext.value
			}, "post-nav-btn next"])}"${ssrIncludeBooleanAttr(!__props.nextPost) ? " disabled" : ""} data-v-380925b0><div class="post-nav-btn-text" data-v-380925b0><span class="post-nav-btn-label" data-v-380925b0>下一篇</span><span class="post-nav-btn-title" data-v-380925b0>${ssrInterpolate(__props.nextPost?.title || "暂无")}</span></div><span class="post-nav-btn-icon" data-v-380925b0><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-380925b0><polyline points="9 18 15 12 9 6" data-v-380925b0></polyline></svg></span>`);
			if (loadingNext.value) _push(`<div class="post-nav-loading" data-v-380925b0></div>`);
			else _push(`<!---->`);
			_push(`</button></div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/ArticleNav.vue
var _sfc_setup = ArticleNav_vue_vue_type_script_setup_true_lang_default.setup;
ArticleNav_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ArticleNav.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ArticleNav_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ArticleNav_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-380925b0"]]);
//#endregion
export { ArticleNav_default as t };
