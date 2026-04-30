import { b as useArticlesStore, y as useThemeStore } from "./stores-CqGIWUfC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { a as ReadingTime_default, i as Toc_default, n as PostMenu_default, o as ContentRender_default, r as TocButton_default, s as BackToTop_default, t as Comment_default } from "./Comment-BJnDjwF7.js";
import { n as ArticleNav_default, t as SiteStats_default } from "./SiteStats-Bip4hTDL.js";
import { Fragment, computed, createBlock, createCommentVNode, createVNode, mergeProps, onMounted, onUnmounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, watch, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { RouterLink, useRoute, useRouter } from "vue-router";
//#region src/components/p-center/RelatedArticles.vue
var _sfc_main$1 = {
	__name: "RelatedArticles",
	__ssrInlineRender: true,
	props: {
		currentArticleId: {
			type: String,
			required: true
		},
		currentArticleCategory: {
			type: String,
			required: true
		}
	},
	setup(__props) {
		const props = __props;
		const articlesStore = useArticlesStore();
		const themeStore = useThemeStore();
		const relatedArticles = ref([]);
		const isDarkTheme = computed(() => themeStore.isDark);
		let debounceTimer = null;
		const fetchRelatedArticles = async () => {
			try {
				const articles = await articlesStore.fetchArticles();
				const currentIndex = articles.findIndex((article) => article.id === props.currentArticleId);
				if (currentIndex === -1) return;
				const articlePositionMap = /* @__PURE__ */ new Map();
				articles.forEach((article, index) => {
					articlePositionMap.set(article.id, index);
				});
				const sameCategoryArticles = articles.filter((article) => article.category === props.currentArticleCategory && article.id !== props.currentArticleId);
				if (sameCategoryArticles.length === 0) {
					const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
					const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
					const nearbyArticles = [];
					if (prevArticle) nearbyArticles.push(prevArticle);
					if (nextArticle) nearbyArticles.push(nextArticle);
					relatedArticles.value = nearbyArticles;
				} else {
					const articlesWithDistance = sameCategoryArticles.map((article) => {
						const articleIndex = articlePositionMap.get(article.id);
						return {
							...article,
							distance: Math.abs(articleIndex - currentIndex)
						};
					});
					articlesWithDistance.sort((a, b) => a.distance - b.distance);
					relatedArticles.value = articlesWithDistance.slice(0, 3);
				}
			} catch (err) {
				console.error("Failed to fetch related articles:", err);
			}
		};
		const init = () => {
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				fetchRelatedArticles();
			}, 200);
		};
		onMounted(() => {
			init();
		});
		onUnmounted(() => {
			if (debounceTimer) clearTimeout(debounceTimer);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "related-articles-wrapper" }, _attrs))} data-v-ba0be050><div class="${ssrRenderClass([{ "dark-theme": isDarkTheme.value }, "related-articles-container"])}" data-v-ba0be050><h3 class="related-articles-title" data-v-ba0be050>相关文章推荐</h3><div class="related-articles-list" data-v-ba0be050><!--[-->`);
			ssrRenderList(relatedArticles.value, (article) => {
				_push(`<div class="related-article-item" data-v-ba0be050>`);
				_push(ssrRenderComponent(unref(RouterLink), {
					to: `/post/${article.id}`,
					class: "related-article-link"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="related-article-content" data-v-ba0be050${_scopeId}>`);
							if (article.category) _push(`<span class="related-article-category" data-v-ba0be050${_scopeId}>${ssrInterpolate(article.category)}</span>`);
							else _push(`<!---->`);
							_push(`<div class="related-article-title" data-v-ba0be050${_scopeId}>${ssrInterpolate(article.title)}</div><div class="related-article-meta" data-v-ba0be050${_scopeId}><span class="related-article-date" data-v-ba0be050${_scopeId}>${ssrInterpolate(article.date)}</span>`);
							if (article.tags && article.tags.length > 0) {
								_push(`<span class="related-article-tags" data-v-ba0be050${_scopeId}><!--[-->`);
								ssrRenderList(article.tags.slice(0, 2), (tag) => {
									_push(`<span class="tag" data-v-ba0be050${_scopeId}>${ssrInterpolate(tag)}</span>`);
								});
								_push(`<!--]--></span>`);
							} else _push(`<!---->`);
							_push(`</div></div><span class="related-article-arrow" data-v-ba0be050${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ba0be050${_scopeId}><polyline points="9 18 15 12 9 6" data-v-ba0be050${_scopeId}></polyline></svg></span>`);
						} else return [createVNode("div", { class: "related-article-content" }, [
							article.category ? (openBlock(), createBlock("span", {
								key: 0,
								class: "related-article-category"
							}, toDisplayString(article.category), 1)) : createCommentVNode("", true),
							createVNode("div", { class: "related-article-title" }, toDisplayString(article.title), 1),
							createVNode("div", { class: "related-article-meta" }, [createVNode("span", { class: "related-article-date" }, toDisplayString(article.date), 1), article.tags && article.tags.length > 0 ? (openBlock(), createBlock("span", {
								key: 0,
								class: "related-article-tags"
							}, [(openBlock(true), createBlock(Fragment, null, renderList(article.tags.slice(0, 2), (tag) => {
								return openBlock(), createBlock("span", {
									key: tag,
									class: "tag"
								}, toDisplayString(tag), 1);
							}), 128))])) : createCommentVNode("", true)])
						]), createVNode("span", { class: "related-article-arrow" }, [(openBlock(), createBlock("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							"stroke-width": "2"
						}, [createVNode("polyline", { points: "9 18 15 12 9 6" })]))])];
					}),
					_: 2
				}, _parent));
				_push(`</div>`);
			});
			_push(`<!--]--></div></div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/RelatedArticles.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var RelatedArticles_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-ba0be050"]]);
//#endregion
//#region src/pages/post/Posts.vue
var _sfc_main = {
	__name: "Posts",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const router = useRouter();
		const postId = computed(() => route.params.id);
		const showToc = ref(false);
		const showPostMenu = ref(false);
		const prevPost = ref(null);
		const nextPost = ref(null);
		const post = ref(null);
		const loading = ref(true);
		const error = ref(null);
		ref(null);
		useHead({
			title: computed(() => post.value ? post.value.seoTitle || `${post.value.title} - 我的博客` : "文章详情 - 我的博客"),
			meta: computed(() => [
				{
					name: "description",
					content: post.value ? post.value.description || `${post.value.title} - 我的博客文章` : "文章详情"
				},
				{
					name: "keywords",
					content: post.value ? post.value.keywords || (post.value.tags ? post.value.tags.join(", ") : "") : "文章,博客"
				},
				{
					name: "author",
					content: post.value ? post.value.author || "Cnkrru" : "Cnkrru"
				},
				{
					name: "robots",
					content: "index, follow"
				},
				{
					property: "og:title",
					content: post.value ? post.value.seoTitle || post.value.title : "文章详情 - 我的博客"
				},
				{
					property: "og:description",
					content: post.value ? post.value.description || `${post.value.title} - 我的博客文章` : "文章详情"
				},
				{
					property: "og:url",
					content: `https://cnkrru.top/post/${postId.value}`
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:image",
					content: post.value ? post.value.image || "https://cnkrru.top/default-image.jpg" : "https://cnkrru.top/default-image.jpg"
				},
				{
					property: "og:site_name",
					content: "Cnkrru's Blog"
				},
				{
					property: "og:locale",
					content: "zh_CN"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:url",
					content: `https://cnkrru.top/post/${postId.value}`
				},
				{
					name: "twitter:title",
					content: post.value ? post.value.seoTitle || post.value.title : "文章详情 - 我的博客"
				},
				{
					name: "twitter:description",
					content: post.value ? post.value.description || `${post.value.title} - 我的博客文章` : "文章详情"
				},
				{
					name: "twitter:image",
					content: post.value ? post.value.image || "https://cnkrru.top/default-image.jpg" : "https://cnkrru.top/default-image.jpg"
				},
				{
					name: "twitter:site",
					content: "@Cnkrru"
				}
			]),
			link: computed(() => [{
				rel: "canonical",
				href: `https://cnkrru.top/post/${postId.value}`
			}]),
			script: computed(() => post.value ? [{
				type: "application/ld+json",
				innerHTML: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					"headline": post.value.title,
					"description": post.value.description || `${post.value.title} - 我的博客文章`,
					"datePublished": post.value.date,
					"author": {
						"@type": "Person",
						"name": post.value.author || "作者名"
					},
					"image": post.value.image || "https://cnkrru.top/default-image.jpg",
					"url": `https://cnkrru.top/post/${postId.value}`
				})
			}] : [])
		});
		const scrollToTop = () => {
			const centerCardContent = document.querySelector(".center-card-content");
			if (centerCardContent) centerCardContent.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		};
		const handlePostLoaded = (loadedPost) => {
			post.value = loadedPost;
			setTimeout(() => {
				scrollToTop();
			}, 100);
		};
		const handleLoading = (isLoading) => {
			loading.value = isLoading;
		};
		const handleError = (err) => {
			error.value = err;
		};
		const handlePrevNextPosts = (data) => {
			prevPost.value = data.prevPost;
			nextPost.value = data.nextPost;
		};
		const handleArticleNav = (post) => {
			if (post && post.id) router.push(`/post/${post.id}`);
		};
		watch(() => route.params.id, () => {
			setTimeout(() => {
				scrollToTop();
			}, 500);
		});
		onMounted(() => {
			scrollToTop();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div id="site-stats-container" data-v-d8473e83></div><div class="center-head-card" data-v-d8473e83><h2 data-v-d8473e83>${ssrInterpolate(post.value?.title || "文章详情")}</h2><div class="center-head-card-tools" data-v-d8473e83>`);
			_push(ssrRenderComponent(BackToTop_default, null, null, _parent));
			_push(ssrRenderComponent(PostMenu_default, {
				show: showPostMenu.value,
				"onUpdate:show": ($event) => showPostMenu.value = $event
			}, null, _parent));
			_push(ssrRenderComponent(TocButton_default, {
				show: showToc.value,
				"onUpdate:show": ($event) => showToc.value = $event
			}, null, _parent));
			_push(`</div></div>`);
			_push(ssrRenderComponent(Toc_default, {
				show: showToc.value,
				"onUpdate:show": ($event) => showToc.value = $event
			}, null, _parent));
			_push(`<hr data-v-d8473e83><div class="center-card-content" data-v-d8473e83>`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(ReadingTime_default, null, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(ContentRender_default, {
				key: postId.value,
				id: postId.value,
				type: "post",
				onContentLoaded: handlePostLoaded,
				onLoading: handleLoading,
				onError: handleError,
				onPrevNextPosts: handlePrevNextPosts
			}, null, _parent));
			if (!loading.value && !error.value) _push(`<hr data-v-d8473e83>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(ArticleNav_default, {
				"prev-post": prevPost.value,
				"next-post": nextPost.value,
				onNavigate: handleArticleNav
			}, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value && post.value) _push(ssrRenderComponent(RelatedArticles_default, {
				"current-article-id": postId.value,
				"current-article-category": post.value?.category || ""
			}, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-d8473e83>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<div class="read-center-card-footer" data-v-d8473e83><p data-v-d8473e83>© 2026 Cnkrru&#39;s Blog. All rights reserved.</p></div>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(Comment_default, null, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-d8473e83>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(SiteStats_default, null, null, _parent));
			else _push(`<!---->`);
			_push(`</div><hr data-v-d8473e83><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/post/Posts.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Posts_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-d8473e83"]]);
//#endregion
export { Posts_default as default };
