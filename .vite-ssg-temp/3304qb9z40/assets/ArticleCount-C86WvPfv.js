import { i as useArticlesStore } from "./stores-CSCNxxdH.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, defineComponent, mergeProps, onMounted, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs } from "vue/server-renderer";
//#region src/components/p-center/ArticleCount.vue?vue&type=script&setup=true&lang.ts
var ArticleCount_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ArticleCount",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		const articleCount = computed(() => store.totalArticles.toString());
		onMounted(async () => {
			await store.fetchArticles();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({ class: "article-count-btn" }, _attrs))} data-v-7688a661><svg class="count-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-7688a661><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-7688a661></path><polyline points="14 2 14 8 20 8" data-v-7688a661></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-7688a661></line><line x1="16" y1="17" x2="8" y2="17" data-v-7688a661></line><polyline points="10 9 9 9 8 9" data-v-7688a661></polyline></svg><span data-v-7688a661>共 ${ssrInterpolate(articleCount.value)} 篇文章</span></button>`);
		};
	}
});
//#endregion
//#region src/components/p-center/ArticleCount.vue
var _sfc_setup = ArticleCount_vue_vue_type_script_setup_true_lang_default.setup;
ArticleCount_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ArticleCount.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ArticleCount_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ArticleCount_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7688a661"]]);
//#endregion
export { ArticleCount_default as t };
