import { b as useArticlesStore } from "./stores-CqGIWUfC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, mergeProps, onMounted, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs } from "vue/server-renderer";
//#region src/components/p-center/ArticleCount.vue
var _sfc_main = {
	__name: "ArticleCount",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		const articleCount = computed(() => store.articleCount.toString());
		onMounted(async () => {
			await store.fetchArticles();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<button${ssrRenderAttrs(mergeProps({ class: "article-count-btn" }, _attrs))} data-v-4a4a6011><span data-v-4a4a6011>共 ${ssrInterpolate(articleCount.value)} 篇文章</span></button>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ArticleCount.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var ArticleCount_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-4a4a6011"]]);
//#endregion
export { ArticleCount_default as t };
