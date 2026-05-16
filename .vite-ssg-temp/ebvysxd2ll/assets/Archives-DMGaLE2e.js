import { g as useTagStore, i as useArticlesStore, v as useThemeStore } from "./stores-D5XJjRmy.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as ArticleCount_default } from "./ArticleCount-DxibLSD1.js";
import { computed, createVNode, defineComponent, mergeProps, onMounted, ref, toDisplayString, unref, useSSRContext, watch, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { RouterLink } from "vue-router";
//#region src/components/p-center/TagCloud.vue?vue&type=script&setup=true&lang.ts
var TagCloud_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "TagCloud",
	__ssrInlineRender: true,
	props: { articles: {} },
	setup(__props) {
		const props = __props;
		const showTagCloud = ref(false);
		const selectedTag = ref(null);
		const tagArticles = ref([]);
		const searchQuery = ref("");
		const themeStore = useThemeStore();
		const tagStore = useTagStore();
		const isDarkTheme = computed(() => themeStore.isDark);
		const tags = computed(() => tagStore.tags);
		const tagStats = computed(() => tagStore.tagStats);
		const sortBy = computed(() => tagStore.sortBy);
		const filteredTags = computed(() => {
			if (!searchQuery.value) return tagStats.value;
			const query = searchQuery.value.toLowerCase();
			return tagStats.value.filter((stat) => stat.tag.toLowerCase().includes(query));
		});
		const loadTags = async () => {
			await tagStore.loadTags(props.articles);
		};
		const getRelatedTags = (tag) => {
			return tagStore.getRelatedTags(tag, 5);
		};
		const getTagGradient = (stat) => {
			const maxCount = Math.max(...tagStats.value.map((s) => s.count), 1);
			const ratio = stat.count / maxCount;
			const hue1 = isDarkTheme.value ? 270 : 330;
			const hue2 = isDarkTheme.value ? 300 : 350;
			const sat1 = 70 + ratio * 30;
			const sat2 = 80 + ratio * 20;
			return `linear-gradient(135deg, hsl(${hue1}, ${sat1}%, ${isDarkTheme.value ? 60 + ratio * 15 : 88 - ratio * 18}%), hsl(${hue2}, ${sat2}%, ${isDarkTheme.value ? 50 + ratio * 10 : 75 - ratio * 12}%))`;
		};
		const closeTagCloud = () => {
			showTagCloud.value = false;
			selectedTag.value = null;
			tagArticles.value = [];
			searchQuery.value = "";
		};
		watch(() => props.articles, () => {
			loadTags();
		}, { deep: true });
		onMounted(() => {
			loadTags();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["tag-cloud-container", { "dark-theme": isDarkTheme.value }] }, _attrs))} data-v-b9378e3a><button class="tag-cloud-button" data-v-b9378e3a><span class="button-icon" data-v-b9378e3a>🏷️</span><span class="button-text" data-v-b9378e3a>标签云</span><span class="tag-count" data-v-b9378e3a>${ssrInterpolate(tags.value.length)}</span></button>`);
			if (showTagCloud.value) {
				_push(`<div class="tag-cloud-modal" data-v-b9378e3a><div class="${ssrRenderClass([{ "dark-theme": isDarkTheme.value }, "tag-cloud-content"])}" data-v-b9378e3a><div class="tag-cloud-header" data-v-b9378e3a><h3 data-v-b9378e3a>标签云</h3><button class="close-button" data-v-b9378e3a>×</button></div><div class="search-container" data-v-b9378e3a><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="搜索标签..." class="search-input" data-v-b9378e3a>`);
				if (searchQuery.value) _push(`<button class="clear-button" data-v-b9378e3a> × </button>`);
				else _push(`<!---->`);
				_push(`</div><div class="sort-options" data-v-b9378e3a><span class="sort-label" data-v-b9378e3a>排序:</span><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "frequency" }])}" data-v-b9378e3a> 频率 </button><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "count" }])}" data-v-b9378e3a> 数量 </button><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "recent" }])}" data-v-b9378e3a> 最近 </button><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "trending" }])}" data-v-b9378e3a> 趋势 </button></div><div class="tag-cloud" data-v-b9378e3a><!--[-->`);
				ssrRenderList(filteredTags.value, (stat) => {
					_push(`<span class="${ssrRenderClass(["tag", { active: selectedTag.value === stat.tag }])}" style="${ssrRenderStyle({
						fontSize: `${14 + Math.min(stat.count / 2, 10)}px`,
						background: getTagGradient(stat),
						color: isDarkTheme.value ? "#fff" : "#333",
						textShadow: isDarkTheme.value ? "0 0 8px rgba(255,255,255,0.4)" : "0 1px 3px rgba(0,0,0,0.15)",
						animationDelay: `${Math.random() * .5}s`
					})}"${ssrRenderAttr("title", `频率: ${stat.frequency.toFixed(2)}, 数量: ${stat.count}, 最后使用: ${new Date(stat.lastUsed).toLocaleDateString()}`)} data-v-b9378e3a>${ssrInterpolate(stat.tag)} (${ssrInterpolate(stat.count)}) </span>`);
				});
				_push(`<!--]--></div>`);
				if (selectedTag.value && tagArticles.value.length > 0) {
					_push(`<div class="tag-articles" data-v-b9378e3a><div class="tag-header" data-v-b9378e3a><h4 data-v-b9378e3a>${ssrInterpolate(selectedTag.value)} 的文章 (${ssrInterpolate(tagArticles.value.length)})</h4>`);
					if (getRelatedTags(selectedTag.value).length > 0) {
						_push(`<div class="related-tags" data-v-b9378e3a><span class="related-label" data-v-b9378e3a>相关标签:</span><!--[-->`);
						ssrRenderList(getRelatedTags(selectedTag.value), (related) => {
							_push(`<span class="related-tag" style="${ssrRenderStyle({
								background: `linear-gradient(135deg, hsl(${isDarkTheme.value ? 270 : 330}, 80%, 65%), hsl(${isDarkTheme.value ? 300 : 350}, 85%, 75%))`,
								color: isDarkTheme.value ? "#fff" : "#333",
								textShadow: isDarkTheme.value ? "0 0 6px rgba(255,255,255,0.3)" : "0 1px 2px rgba(0,0,0,0.1)"
							})}"${ssrRenderAttr("title", `相关性: ${related.score.toFixed(2)}`)} data-v-b9378e3a>${ssrInterpolate(related.tag)}</span>`);
						});
						_push(`<!--]--></div>`);
					} else _push(`<!---->`);
					_push(`</div><!--[-->`);
					ssrRenderList(tagArticles.value, (article) => {
						_push(ssrRenderComponent(unref(RouterLink), {
							key: article.id,
							to: `/post/${article.id}`,
							class: "tag-article-item",
							onClick: closeTagCloud
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="tag-article-title" data-v-b9378e3a${_scopeId}>${ssrInterpolate(article.title)}</span><span class="tag-article-date" data-v-b9378e3a${_scopeId}>${ssrInterpolate(article.date)}</span>`);
								else return [createVNode("span", { class: "tag-article-title" }, toDisplayString(article.title), 1), createVNode("span", { class: "tag-article-date" }, toDisplayString(article.date), 1)];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				if (selectedTag.value && tagArticles.value.length === 0) _push(`<div class="tag-articles-empty" data-v-b9378e3a><span data-v-b9378e3a>该标签下暂无文章</span></div>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/TagCloud.vue
var _sfc_setup$1 = TagCloud_vue_vue_type_script_setup_true_lang_default.setup;
TagCloud_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/TagCloud.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var TagCloud_default = /* @__PURE__ */ _plugin_vue_export_helper_default(TagCloud_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b9378e3a"]]);
//#endregion
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
			_push(`<!--[--><div id="site-stats-container" data-v-6abc2d7c></div><div class="center-head-card" data-v-6abc2d7c><h2 data-v-6abc2d7c>归档</h2>`);
			_push(ssrRenderComponent(ArticleCount_default, null, null, _parent));
			_push(ssrRenderComponent(TagCloud_default, { articles: articles.value }, null, _parent));
			_push(`</div><hr data-v-6abc2d7c><div class="center-card-content" data-v-6abc2d7c><div class="view-tabs" data-v-6abc2d7c><button class="${ssrRenderClass(["view-tab", { active: viewMode.value === "category" }])}" data-v-6abc2d7c>按分类</button><button class="${ssrRenderClass(["view-tab", { active: viewMode.value === "year" }])}" data-v-6abc2d7c>按年</button><button class="${ssrRenderClass(["view-tab", { active: viewMode.value === "month" }])}" data-v-6abc2d7c>按月</button></div><!--[-->`);
			ssrRenderList(groups.value, (g) => {
				_push(`<div class="arch-group" data-v-6abc2d7c><a href="#" class="arch-header" data-v-6abc2d7c><span class="arch-name" data-v-6abc2d7c>${ssrInterpolate(g.name)}</span><span class="arch-count" data-v-6abc2d7c>${ssrInterpolate(g.items.length)} 篇</span><span class="arch-arrow" data-v-6abc2d7c>${ssrInterpolate(expandedKey.value === g.name ? "▾" : "▸")}</span></a>`);
				if (expandedKey.value === g.name) {
					_push(`<div class="arch-list" data-v-6abc2d7c><!--[-->`);
					ssrRenderList(g.items, (a) => {
						_push(ssrRenderComponent(unref(RouterLink), {
							key: a.id,
							to: `/post/${a.id}`,
							class: "arch-item"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="arch-title" data-v-6abc2d7c${_scopeId}>${ssrInterpolate(a.title)}</span><span class="arch-date" data-v-6abc2d7c${_scopeId}>${ssrInterpolate(a.date)}</span>`);
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
var Archives_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Archives_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6abc2d7c"]]);
//#endregion
export { Archives_default as default };
