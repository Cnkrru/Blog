import { i as useArticlesStore } from "./stores-D5XJjRmy.js";
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
			_push(`<button${ssrRenderAttrs(mergeProps({ class: "article-count-btn" }, _attrs))} data-v-fa6c91b7><span data-v-fa6c91b7>共 ${ssrInterpolate(articleCount.value)} 篇文章</span></button>`);
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
var ArticleCount_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ArticleCount_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-fa6c91b7"]]);
//#endregion
export { ArticleCount_default as t };
