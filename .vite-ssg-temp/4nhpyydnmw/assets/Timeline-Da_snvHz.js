import { _ as useThemeStore, h as useTagStore, i as useArticlesStore } from "./stores-D945GC2p.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as ArticleCount_default } from "./ArticleCount-yo4xZoam.js";
import { Fragment, computed, createBlock, createCommentVNode, createVNode, defineComponent, onMounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { RouterLink } from "vue-router";
//#region src/pages/Timeline.vue?vue&type=script&setup=true&lang.ts
var Timeline_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Timeline",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		const tagStore = useTagStore();
		const themeStore = useThemeStore();
		useHead({
			title: "标签 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "Cnkrru's Blog 标签云与文章时间线，按标签和发布时间浏览所有文章"
				},
				{
					name: "keywords",
					content: "标签云,时间线,文章时间轴,博客标签"
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
					content: "https://cnkrru.top/timeline"
				},
				{
					property: "og:title",
					content: "标签 - Cnkrru's Blog"
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
					content: "https://cnkrru.top/timeline"
				},
				{
					name: "twitter:title",
					content: "标签 - Cnkrru's Blog"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/timeline"
			}]
		});
		const articles = ref([]);
		const loading = ref(true);
		const selectedTag = ref(null);
		const tagArticles = ref([]);
		const searchQuery = ref("");
		const zoomLevel = ref(1);
		computed(() => themeStore.isDark);
		const tagStats = computed(() => tagStore.tagStats);
		const sortBy = computed(() => tagStore.sortBy);
		const filteredTags = computed(() => {
			if (!searchQuery.value) return tagStats.value;
			const q = searchQuery.value.toLowerCase();
			return tagStats.value.filter((s) => s.tag.toLowerCase().includes(q));
		});
		const getRelatedTags = (tag) => {
			return tagStore.getRelatedTags(tag, 5);
		};
		const filteredArticles = computed(() => {
			let list = articles.value;
			if (selectedTag.value) return tagArticles.value;
			return list;
		});
		const timelineGroups = computed(() => {
			const sorted = [...filteredArticles.value].sort((a, b) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
			const groups = [];
			let currentGroup = null;
			sorted.forEach((article) => {
				const d = new Date(article.date);
				let label;
				if (zoomLevel.value === 0) label = d.getFullYear().toString();
				else label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
				if (!currentGroup || currentGroup.label !== label) {
					currentGroup = {
						label,
						articles: []
					};
					groups.push(currentGroup);
				}
				currentGroup.articles.push(article);
			});
			return groups;
		});
		const chartData = computed(() => {
			return [...filteredArticles.value].sort((a, b) => parseInt(a.id) - parseInt(b.id)).map((a) => ({
				id: a.id,
				title: a.title,
				tagsCount: Array.isArray(a.tags) ? a.tags.length : 0,
				descLen: a.description ? a.description.length : 0,
				hasCategory: !!a.category,
				tags: Array.isArray(a.tags) ? a.tags.slice(0, 2).join(", ") : ""
			}));
		});
		const statsSummary = computed(() => {
			const total = articles.value.length;
			if (total === 0) return {
				total: 0,
				avgTags: 0,
				maxTags: 0,
				withCategory: 0
			};
			const tagCounts = articles.value.map((a) => Array.isArray(a.tags) ? a.tags.length : 0);
			const withCat = articles.value.filter((a) => !!a.category).length;
			return {
				total,
				avgTags: (tagCounts.reduce((s, c) => s + c, 0) / total).toFixed(1),
				maxTags: Math.max(...tagCounts),
				withCategory: withCat
			};
		});
		computed(() => Math.max(...chartData.value.map((d) => d.descLen), 1));
		onMounted(async () => {
			try {
				articles.value = (await store.fetchArticles()).filter((a) => a.id !== "terminal");
				await tagStore.loadTags(articles.value);
			} finally {
				loading.value = false;
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="center-head-card" data-v-b1d5bb5f><h2 data-v-b1d5bb5f>标签</h2>`);
			_push(ssrRenderComponent(ArticleCount_default, null, null, _parent));
			_push(`</div><hr data-v-b1d5bb5f><div class="center-card-content" data-v-b1d5bb5f><div class="tag-section" data-v-b1d5bb5f><div class="tag-controls" data-v-b1d5bb5f><div class="search-container" data-v-b1d5bb5f><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="搜索标签..." class="search-input" data-v-b1d5bb5f>`);
			if (searchQuery.value) _push(`<button class="clear-btn" data-v-b1d5bb5f>x</button>`);
			else _push(`<!---->`);
			_push(`</div><div class="sort-options" data-v-b1d5bb5f><span class="sort-label" data-v-b1d5bb5f>排序:</span><!--[-->`);
			ssrRenderList([
				{
					k: "frequency",
					l: "频率"
				},
				{
					k: "count",
					l: "数量"
				},
				{
					k: "recent",
					l: "最近"
				},
				{
					k: "trending",
					l: "趋势"
				}
			], (s) => {
				_push(`<button class="${ssrRenderClass(["sort-btn", { active: sortBy.value === s.k }])}" data-v-b1d5bb5f>${ssrInterpolate(s.l)}</button>`);
			});
			_push(`<!--]--></div></div><div class="tag-cloud" data-v-b1d5bb5f><!--[-->`);
			ssrRenderList(filteredTags.value, (stat) => {
				_push(`<span class="${ssrRenderClass(["tag-item", { active: selectedTag.value === stat.tag }])}" style="${ssrRenderStyle({
					fontSize: `${13 + Math.min(stat.count / 2, 8)}px`,
					opacity: .55 + Math.min(stat.count / Math.max(...tagStats.value.map((s) => s.count), 1), 1) * .45
				})}"${ssrRenderAttr("title", `频率: ${stat.frequency?.toFixed(2)}, 数量: ${stat.count}`)} data-v-b1d5bb5f>${ssrInterpolate(stat.tag)} <span class="tag-num" data-v-b1d5bb5f>${ssrInterpolate(stat.count)}</span></span>`);
			});
			_push(`<!--]-->`);
			if (filteredTags.value.length === 0 && !loading.value) _push(`<div class="tag-empty" data-v-b1d5bb5f> 没有匹配的标签 </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (selectedTag.value) {
				_push(`<div class="selected-tag-info" data-v-b1d5bb5f><div class="selected-tag-header" data-v-b1d5bb5f><span class="sel-label" data-v-b1d5bb5f>当前标签: <strong data-v-b1d5bb5f>${ssrInterpolate(selectedTag.value)}</strong></span><span class="sel-count" data-v-b1d5bb5f>${ssrInterpolate(tagArticles.value.length)} 篇文章</span><button class="sel-clear" data-v-b1d5bb5f>x 清除</button></div>`);
				if (getRelatedTags(selectedTag.value).length > 0) {
					_push(`<div class="related-tags-row" data-v-b1d5bb5f><span class="related-label" data-v-b1d5bb5f>相关标签:</span><!--[-->`);
					ssrRenderList(getRelatedTags(selectedTag.value), (r) => {
						_push(`<span class="related-chip"${ssrRenderAttr("title", `相关性: ${r.score?.toFixed(2)}`)} data-v-b1d5bb5f>${ssrInterpolate(r.tag)}</span>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
			if (!loading.value && articles.value.length > 0) {
				_push(`<div class="stats-panel" data-v-b1d5bb5f><div class="stats-summary" data-v-b1d5bb5f><div class="stat-box" data-v-b1d5bb5f><span class="stat-num" data-v-b1d5bb5f>${ssrInterpolate(statsSummary.value.total)}</span><span class="stat-label" data-v-b1d5bb5f>文章总数</span></div><div class="stat-box" data-v-b1d5bb5f><span class="stat-num" data-v-b1d5bb5f>${ssrInterpolate(statsSummary.value.avgTags)}</span><span class="stat-label" data-v-b1d5bb5f>平均标签数</span></div><div class="stat-box" data-v-b1d5bb5f><span class="stat-num" data-v-b1d5bb5f>${ssrInterpolate(statsSummary.value.maxTags)}</span><span class="stat-label" data-v-b1d5bb5f>最多标签数</span></div><div class="stat-box" data-v-b1d5bb5f><span class="stat-num" data-v-b1d5bb5f>${ssrInterpolate(statsSummary.value.withCategory)}</span><span class="stat-label" data-v-b1d5bb5f>有分类的文章</span></div></div><div class="chart-title" data-v-b1d5bb5f>文章标签分布</div><div class="bar-chart" data-v-b1d5bb5f><!--[-->`);
				ssrRenderList(chartData.value, (d) => {
					_push(`<div class="bar-item"${ssrRenderAttr("title", `${d.title}: ${d.tagsCount} 标签 (${d.tags || "无"})`)} data-v-b1d5bb5f><div class="bar-fill" style="${ssrRenderStyle({ height: `${d.tagsCount / Math.max(statsSummary.value.maxTags, 1) * 100}%` })}" data-v-b1d5bb5f></div><span class="bar-label" data-v-b1d5bb5f>${ssrInterpolate(d.id)}</span></div>`);
				});
				_push(`<!--]--></div></div>`);
			} else _push(`<!---->`);
			_push(`<hr data-v-b1d5bb5f><div class="timeline-top-bar" data-v-b1d5bb5f><div class="zoom-controls" data-v-b1d5bb5f><button class="${ssrRenderClass(["zoom-btn", { active: zoomLevel.value === 0 }])}" data-v-b1d5bb5f>年</button><button class="${ssrRenderClass(["zoom-btn", { active: zoomLevel.value === 1 }])}" data-v-b1d5bb5f>月</button></div></div>`);
			if (loading.value) {
				_push(`<div class="skeleton-container" data-v-b1d5bb5f><!--[-->`);
				ssrRenderList(4, (n) => {
					_push(`<div class="tl-skel" data-v-b1d5bb5f><div class="tl-dot-skel" data-v-b1d5bb5f></div><div class="tl-card-skel" data-v-b1d5bb5f></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else {
				_push(`<div class="timeline" data-v-b1d5bb5f><div class="timeline-line" data-v-b1d5bb5f></div><!--[-->`);
				ssrRenderList(timelineGroups.value, (group) => {
					_push(`<div class="tl-group" data-v-b1d5bb5f><div class="tl-group-label" data-v-b1d5bb5f><div class="tl-dot" data-v-b1d5bb5f></div><span class="tl-label-text" data-v-b1d5bb5f>${ssrInterpolate(group.label)}</span><span class="tl-count" data-v-b1d5bb5f>${ssrInterpolate(group.articles.length)} 篇</span></div><div class="tl-cards" data-v-b1d5bb5f><!--[-->`);
					ssrRenderList(group.articles, (article) => {
						_push(ssrRenderComponent(unref(RouterLink), {
							key: article.id,
							to: `/post/${article.id}`,
							class: "tl-card"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="tl-card-connector" data-v-b1d5bb5f${_scopeId}></div><div class="tl-card-body" data-v-b1d5bb5f${_scopeId}><div class="tl-card-header" data-v-b1d5bb5f${_scopeId}><span class="tl-card-title" data-v-b1d5bb5f${_scopeId}>${ssrInterpolate(article.title)}</span><span class="tl-card-date" data-v-b1d5bb5f${_scopeId}>${ssrInterpolate(article.date)}</span></div><div class="tl-card-meta" data-v-b1d5bb5f${_scopeId}>`);
									if (article.category) _push(`<span class="tl-cat" data-v-b1d5bb5f${_scopeId}>${ssrInterpolate(article.category)}</span>`);
									else _push(`<!---->`);
									_push(`<!--[-->`);
									ssrRenderList((article.tags || []).slice(0, 3), (tag) => {
										_push(`<span class="tl-tag" data-v-b1d5bb5f${_scopeId}>${ssrInterpolate(tag)}</span>`);
									});
									_push(`<!--]--></div></div>`);
								} else return [createVNode("div", { class: "tl-card-connector" }), createVNode("div", { class: "tl-card-body" }, [createVNode("div", { class: "tl-card-header" }, [createVNode("span", { class: "tl-card-title" }, toDisplayString(article.title), 1), createVNode("span", { class: "tl-card-date" }, toDisplayString(article.date), 1)]), createVNode("div", { class: "tl-card-meta" }, [article.category ? (openBlock(), createBlock("span", {
									key: 0,
									class: "tl-cat"
								}, toDisplayString(article.category), 1)) : createCommentVNode("", true), (openBlock(true), createBlock(Fragment, null, renderList((article.tags || []).slice(0, 3), (tag) => {
									return openBlock(), createBlock("span", {
										key: tag,
										class: "tl-tag"
									}, toDisplayString(tag), 1);
								}), 128))])])];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div></div>`);
				});
				_push(`<!--]-->`);
				if (timelineGroups.value.length === 0 && !loading.value) _push(`<div class="empty-tl" data-v-b1d5bb5f> 没有找到文章 </div>`);
				else _push(`<!---->`);
				_push(`</div>`);
			}
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/Timeline.vue
var _sfc_setup = Timeline_vue_vue_type_script_setup_true_lang_default.setup;
Timeline_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Timeline.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Timeline_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Timeline_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b1d5bb5f"]]);
//#endregion
export { Timeline_default as default };
