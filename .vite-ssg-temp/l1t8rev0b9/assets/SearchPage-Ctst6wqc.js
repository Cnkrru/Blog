import { i as useArticlesStore } from "./stores-D5XJjRmy.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { Fragment, computed, createBlock, createCommentVNode, createVNode, defineComponent, onMounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { RouterLink, useRoute } from "vue-router";
//#region src/pages/SearchPage.vue?vue&type=script&setup=true&lang.ts
var SearchPage_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "SearchPage",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		const route = useRoute();
		useHead({
			title: "搜索 - Cnkrru's Blog",
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/search"
			}]
		});
		const query = ref("");
		const articles = ref([]);
		const loading = ref(false);
		const results = computed(() => {
			if (!query.value.trim()) return articles.value;
			const q = query.value.toLowerCase();
			return articles.value.filter((a) => a.title?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q) || (a.tags || []).some((t) => t.toLowerCase().includes(q)) || a.category?.toLowerCase().includes(q));
		});
		function highlightMatch(text) {
			if (!query.value.trim()) return text;
			const q = query.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			return text.replace(new RegExp(`(${q})`, "gi"), "<mark>$1</mark>");
		}
		onMounted(async () => {
			loading.value = true;
			articles.value = (await store.fetchArticles()).filter((a) => a.id !== "terminal");
			const q = route.query.q;
			if (q) query.value = q;
			loading.value = false;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="center-head-card" data-v-d096b9af><h2 data-v-d096b9af>搜索</h2></div><hr data-v-d096b9af><div class="center-card-content" data-v-d096b9af><div class="search-input-wrap" data-v-d096b9af><input${ssrRenderAttr("value", query.value)} type="search" placeholder="搜索文章标题、描述、标签..." class="search-field" autofocus data-v-d096b9af>`);
			if (query.value) _push(`<span class="result-count" data-v-d096b9af>${ssrInterpolate(results.value.length)} 个结果</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (loading.value) _push(`<div class="search-loading" data-v-d096b9af>加载中...</div>`);
			else if (results.value.length > 0) {
				_push(`<!--[-->`);
				ssrRenderList(results.value, (a) => {
					_push(ssrRenderComponent(unref(RouterLink), {
						key: a.id,
						to: `/post/${a.id}`,
						class: "search-result"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<h3 class="sr-title" data-v-d096b9af${_scopeId}>${highlightMatch(a.title) ?? ""}</h3>`);
								if (a.description) _push(`<p class="sr-desc" data-v-d096b9af${_scopeId}>${highlightMatch(a.description.slice(0, 120)) ?? ""}</p>`);
								else _push(`<!---->`);
								_push(`<div class="sr-meta" data-v-d096b9af${_scopeId}>`);
								if (a.category) _push(`<span class="sr-cat" data-v-d096b9af${_scopeId}>${ssrInterpolate(a.category)}</span>`);
								else _push(`<!---->`);
								_push(`<!--[-->`);
								ssrRenderList((a.tags || []).slice(0, 3), (t) => {
									_push(`<span class="sr-tag" data-v-d096b9af${_scopeId}>${ssrInterpolate(t)}</span>`);
								});
								_push(`<!--]--><span class="sr-date" data-v-d096b9af${_scopeId}>${ssrInterpolate(a.date)}</span></div>`);
							} else return [
								createVNode("h3", {
									class: "sr-title",
									innerHTML: highlightMatch(a.title)
								}, null, 8, ["innerHTML"]),
								a.description ? (openBlock(), createBlock("p", {
									key: 0,
									class: "sr-desc",
									innerHTML: highlightMatch(a.description.slice(0, 120))
								}, null, 8, ["innerHTML"])) : createCommentVNode("", true),
								createVNode("div", { class: "sr-meta" }, [
									a.category ? (openBlock(), createBlock("span", {
										key: 0,
										class: "sr-cat"
									}, toDisplayString(a.category), 1)) : createCommentVNode("", true),
									(openBlock(true), createBlock(Fragment, null, renderList((a.tags || []).slice(0, 3), (t) => {
										return openBlock(), createBlock("span", {
											key: t,
											class: "sr-tag"
										}, toDisplayString(t), 1);
									}), 128)),
									createVNode("span", { class: "sr-date" }, toDisplayString(a.date), 1)
								])
							];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]-->`);
			} else if (query.value) _push(`<div class="search-empty" data-v-d096b9af> 没有找到匹配的文章 </div>`);
			else _push(`<div class="search-hint" data-v-d096b9af> 输入关键词开始搜索 </div>`);
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/SearchPage.vue
var _sfc_setup = SearchPage_vue_vue_type_script_setup_true_lang_default.setup;
SearchPage_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/SearchPage.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var SearchPage_default = /* @__PURE__ */ _plugin_vue_export_helper_default(SearchPage_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-d096b9af"]]);
//#endregion
export { SearchPage_default as default };
