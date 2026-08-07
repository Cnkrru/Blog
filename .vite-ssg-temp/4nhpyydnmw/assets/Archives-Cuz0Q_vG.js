import { i as useArticlesStore } from "./stores-D945GC2p.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as ArticleCount_default } from "./ArticleCount-yo4xZoam.js";
import { computed, createVNode, defineComponent, onMounted, ref, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { RouterLink } from "vue-router";
//#region src/pages/Archives.vue?vue&type=script&setup=true&lang.ts
var Archives_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Archives",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		useHead({
			title: "归档 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "Cnkrru's Blog的所有文章归档"
				},
				{
					name: "keywords",
					content: "归档,文章列表,历史文章"
				},
				{
					name: "robots",
					content: "index, follow"
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: "https://cnkrru.top/archives"
				},
				{
					property: "og:title",
					content: "归档 - Cnkrru's Blog"
				},
				{
					property: "og:locale",
					content: "zh_CN"
				},
				{
					property: "og:site_name",
					content: "Cnkrru's Blog"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:url",
					content: "https://cnkrru.top/archives"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/archives"
			}]
		});
		const articles = ref([]);
		const viewMode = ref("category");
		const expandedKey = ref(null);
		const loadArticles = async () => {
			try {
				articles.value = (await store.fetchArticles()).sort((a, b) => parseInt(b.id) - parseInt(a.id));
			} catch {
				articles.value = [];
			}
		};
		const categoryGroups = computed(() => {
			const map = {};
			articles.value.forEach((a) => {
				const c = a.category || "未分类";
				if (!map[c]) map[c] = [];
				map[c].push(a);
			});
			return Object.keys(map).sort().map((k) => ({
				name: k,
				items: map[k]
			}));
		});
		const yearGroups = computed(() => {
			const map = {};
			articles.value.forEach((a) => {
				const y = new Date(a.date).getFullYear().toString();
				if (!map[y]) map[y] = [];
				map[y].push(a);
			});
			return Object.keys(map).sort().reverse().map((k) => ({
				name: k,
				items: map[k]
			}));
		});
		const monthGroups = computed(() => {
			const map = {};
			articles.value.forEach((a) => {
				const d = new Date(a.date);
				const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
				if (!map[k]) map[k] = [];
				map[k].push(a);
			});
			return Object.keys(map).sort().reverse().map((k) => ({
				name: k,
				items: map[k]
			}));
		});
		const groups = computed(() => {
			if (viewMode.value === "year") return yearGroups.value;
			if (viewMode.value === "month") return monthGroups.value;
			return categoryGroups.value;
		});
		onMounted(loadArticles);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div id="site-stats-container" data-v-1fa08dab></div><div class="center-head-card" data-v-1fa08dab><h2 data-v-1fa08dab>归档</h2>`);
			_push(ssrRenderComponent(ArticleCount_default, null, null, _parent));
			_push(`</div><hr data-v-1fa08dab><div class="center-card-content" data-v-1fa08dab><div class="view-tabs" data-v-1fa08dab><button class="${ssrRenderClass(["view-tab", { active: viewMode.value === "category" }])}" data-v-1fa08dab>按分类</button><button class="${ssrRenderClass(["view-tab", { active: viewMode.value === "year" }])}" data-v-1fa08dab>按年</button><button class="${ssrRenderClass(["view-tab", { active: viewMode.value === "month" }])}" data-v-1fa08dab>按月</button></div><!--[-->`);
			ssrRenderList(groups.value, (g) => {
				_push(`<div class="arch-group" data-v-1fa08dab><a href="#" class="arch-header" data-v-1fa08dab><span class="arch-name" data-v-1fa08dab>${ssrInterpolate(g.name)}</span><span class="arch-count" data-v-1fa08dab>${ssrInterpolate(g.items.length)} 篇</span><span class="arch-arrow" data-v-1fa08dab>${ssrInterpolate(expandedKey.value === g.name ? "▾" : "▸")}</span></a>`);
				if (expandedKey.value === g.name) {
					_push(`<div class="arch-list" data-v-1fa08dab><!--[-->`);
					ssrRenderList(g.items, (a) => {
						_push(ssrRenderComponent(unref(RouterLink), {
							key: a.id,
							to: `/post/${a.id}`,
							class: "arch-item"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="arch-title" data-v-1fa08dab${_scopeId}>${ssrInterpolate(a.title)}</span><span class="arch-date" data-v-1fa08dab${_scopeId}>${ssrInterpolate(a.date)}</span>`);
								else return [createVNode("span", { class: "arch-title" }, toDisplayString(a.title), 1), createVNode("span", { class: "arch-date" }, toDisplayString(a.date), 1)];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--></div><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/Archives.vue
var _sfc_setup = Archives_vue_vue_type_script_setup_true_lang_default.setup;
Archives_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Archives.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Archives_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Archives_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1fa08dab"]]);
//#endregion
export { Archives_default as default };
