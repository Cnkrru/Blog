import { b as useArticlesStore, r as useTagStore, y as useThemeStore } from "./stores-CqGIWUfC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as ArticleCount_default } from "./ArticleCount-BaZ99zKI.js";
import { computed, createVNode, mergeProps, onMounted, ref, resolveComponent, toDisplayString, unref, useSSRContext, watch, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { RouterLink } from "vue-router";
//#region src/components/p-center/TagCloud.vue
var _sfc_main$1 = {
	__name: "TagCloud",
	__ssrInlineRender: true,
	props: { articles: {
		type: Array,
		default: () => []
	} },
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["tag-cloud-container", { "dark-theme": isDarkTheme.value }] }, _attrs))} data-v-a09940c8><button class="tag-cloud-button" data-v-a09940c8><span class="button-icon" data-v-a09940c8>🏷️</span><span class="button-text" data-v-a09940c8>标签云</span><span class="tag-count" data-v-a09940c8>${ssrInterpolate(tags.value.length)}</span></button>`);
			if (showTagCloud.value) {
				_push(`<div class="tag-cloud-modal" data-v-a09940c8><div class="${ssrRenderClass([{ "dark-theme": isDarkTheme.value }, "tag-cloud-content"])}" data-v-a09940c8><div class="tag-cloud-header" data-v-a09940c8><h3 data-v-a09940c8>标签云</h3><button class="close-button" data-v-a09940c8>×</button></div><div class="search-container" data-v-a09940c8><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="搜索标签..." class="search-input" data-v-a09940c8>`);
				if (searchQuery.value) _push(`<button class="clear-button" data-v-a09940c8> × </button>`);
				else _push(`<!---->`);
				_push(`</div><div class="sort-options" data-v-a09940c8><span class="sort-label" data-v-a09940c8>排序:</span><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "frequency" }])}" data-v-a09940c8> 频率 </button><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "count" }])}" data-v-a09940c8> 数量 </button><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "recent" }])}" data-v-a09940c8> 最近 </button><button class="${ssrRenderClass(["sort-button", { active: sortBy.value === "trending" }])}" data-v-a09940c8> 趋势 </button></div><div class="tag-cloud" data-v-a09940c8><!--[-->`);
				ssrRenderList(filteredTags.value, (stat) => {
					_push(`<span class="${ssrRenderClass(["tag", { active: selectedTag.value === stat.tag }])}" style="${ssrRenderStyle({
						fontSize: `${14 + Math.min(stat.count / 2, 10)}px`,
						opacity: `${.7 + Math.min(stat.frequency * .3, .3)}`,
						animationDelay: `${Math.random() * .5}s`
					})}"${ssrRenderAttr("title", `频率: ${stat.frequency.toFixed(2)}, 数量: ${stat.count}, 最后使用: ${new Date(stat.lastUsed).toLocaleDateString()}`)} data-v-a09940c8>${ssrInterpolate(stat.tag)} (${ssrInterpolate(stat.count)}) </span>`);
				});
				_push(`<!--]--></div>`);
				if (selectedTag.value && tagArticles.value.length > 0) {
					_push(`<div class="tag-articles" data-v-a09940c8><div class="tag-header" data-v-a09940c8><h4 data-v-a09940c8>${ssrInterpolate(selectedTag.value)} 的文章 (${ssrInterpolate(tagArticles.value.length)})</h4>`);
					if (getRelatedTags(selectedTag.value).length > 0) {
						_push(`<div class="related-tags" data-v-a09940c8><span class="related-label" data-v-a09940c8>相关标签:</span><!--[-->`);
						ssrRenderList(getRelatedTags(selectedTag.value), (related) => {
							_push(`<span class="related-tag"${ssrRenderAttr("title", `相关性: ${related.score.toFixed(2)}`)} data-v-a09940c8>${ssrInterpolate(related.tag)}</span>`);
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
								if (_push) _push(`<span class="tag-article-title" data-v-a09940c8${_scopeId}>${ssrInterpolate(article.title)}</span><span class="tag-article-date" data-v-a09940c8${_scopeId}>${ssrInterpolate(article.date)}</span>`);
								else return [createVNode("span", { class: "tag-article-title" }, toDisplayString(article.title), 1), createVNode("span", { class: "tag-article-date" }, toDisplayString(article.date), 1)];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				if (selectedTag.value && tagArticles.value.length === 0) _push(`<div class="tag-articles-empty" data-v-a09940c8><span data-v-a09940c8>该标签下暂无文章</span></div>`);
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/TagCloud.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var TagCloud_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-a09940c8"]]);
//#endregion
//#region src/pages/Archives.vue
var _sfc_main = {
	__name: "Archives",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		useHead({
			title: "归档 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "Cnkrru's Blog的所有文章归档，按分类和时间顺序整理，方便查找和阅读"
				},
				{
					name: "keywords",
					content: "归档,文章列表,历史文章,博客归档"
				},
				{
					name: "author",
					content: "Cnkrru"
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
					property: "og:description",
					content: "Cnkrru's Blog的所有文章归档，按分类和时间顺序整理，方便查找和阅读"
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
				},
				{
					name: "twitter:title",
					content: "归档 - Cnkrru's Blog"
				},
				{
					name: "twitter:description",
					content: "Cnkrru's Blog的所有文章归档，按分类和时间顺序整理，方便查找和阅读"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/archives"
			}]
		});
		const articles = ref([]);
		const categories = ref([]);
		const expandedCategory = ref(null);
		const loadArticles = async () => {
			try {
				articles.value = await store.fetchArticles();
				categorizeArticles();
			} catch (error) {
				articles.value = [];
			}
		};
		const categorizeArticles = () => {
			const categoryMap = {};
			articles.value.forEach((article) => {
				const category = article.category;
				if (category) {
					if (!categoryMap[category]) categoryMap[category] = [];
					categoryMap[category].push(article);
				}
			});
			categories.value = Object.keys(categoryMap).map((category) => {
				return {
					name: category,
					posts: categoryMap[category].sort((a, b) => {
						return parseInt(b.id) - parseInt(a.id);
					})
				};
			}).sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		};
		onMounted(() => {
			loadArticles();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RouterLink = resolveComponent("RouterLink");
			_push(`<!--[--><div id="site-stats-container" data-v-c0609c00></div><div class="center-head-card" data-v-c0609c00><h2 data-v-c0609c00>归档</h2>`);
			_push(ssrRenderComponent(ArticleCount_default, null, null, _parent));
			_push(ssrRenderComponent(TagCloud_default, { articles: articles.value }, null, _parent));
			_push(`</div><hr data-v-c0609c00><div class="center-card-content" data-v-c0609c00><!--[-->`);
			ssrRenderList(categories.value, (category) => {
				_push(`<!--[--><a href="#" data-v-c0609c00><div class="index-center-list-card" data-v-c0609c00><div class="index-center-list-card-header" data-v-c0609c00>${ssrInterpolate(category.name)}</div><hr data-v-c0609c00><div class="index-center-list-card-content" data-v-c0609c00><div class="article-meta-info" data-v-c0609c00><span data-v-c0609c00>文章数量: ${ssrInterpolate(category.posts.length)}</span><span data-v-c0609c00>${ssrInterpolate(expandedCategory.value === category.name ? "收起" : "展开")}</span></div></div></div></a>`);
				if (expandedCategory.value === category.name) {
					_push(`<div class="category-posts" data-v-c0609c00><!--[-->`);
					ssrRenderList(category.posts, (article) => {
						_push(ssrRenderComponent(_component_RouterLink, {
							to: `/post/${article.id}`,
							class: "post-item"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="post-title" data-v-c0609c00${_scopeId}>${ssrInterpolate(article.title)}</span><span class="post-date" data-v-c0609c00${_scopeId}>${ssrInterpolate(article.date)}</span>`);
								else return [createVNode("span", { class: "post-title" }, toDisplayString(article.title), 1), createVNode("span", { class: "post-date" }, toDisplayString(article.date), 1)];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`<!--]-->`);
			});
			_push(`<!--]--></div><hr data-v-c0609c00><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Archives.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Archives_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-c0609c00"]]);
//#endregion
export { Archives_default as default };
