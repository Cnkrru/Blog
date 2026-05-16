import { i as useArticlesStore, v as useThemeStore } from "./stores-D5XJjRmy.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { a as ReadingTime_default, i as Toc_default, n as PostMenu_default, o as ContentRender_default, r as TocButton_default, s as BackToTop_default, t as Comment_default } from "./Comment-DbUCyGM3.js";
import { n as ArticleNav_default, t as SiteStats_default } from "./SiteStats-DOR97MG3.js";
import { Fragment, computed, createBlock, createCommentVNode, createVNode, defineComponent, mergeProps, nextTick, onMounted, onUnmounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, watch, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderTeleport } from "vue/server-renderer";
import { RouterLink, useRoute, useRouter } from "vue-router";
//#region src/components/p-center/RelatedArticles.vue?vue&type=script&setup=true&lang.ts
var RelatedArticles_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "RelatedArticles",
	__ssrInlineRender: true,
	props: {
		currentArticleId: {},
		currentArticleCategory: {}
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "related-articles-wrapper" }, _attrs))} data-v-457af871><div class="${ssrRenderClass([{ "dark-theme": isDarkTheme.value }, "related-articles-container"])}" data-v-457af871><h3 class="related-articles-title" data-v-457af871>相关文章推荐</h3><div class="related-articles-list" data-v-457af871><!--[-->`);
			ssrRenderList(relatedArticles.value, (article) => {
				_push(`<div class="related-article-item" data-v-457af871>`);
				_push(ssrRenderComponent(unref(RouterLink), {
					to: `/post/${article.id}`,
					class: "related-article-link"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="related-article-content" data-v-457af871${_scopeId}>`);
							if (article.category) _push(`<span class="related-article-category" data-v-457af871${_scopeId}>${ssrInterpolate(article.category)}</span>`);
							else _push(`<!---->`);
							_push(`<div class="related-article-title" data-v-457af871${_scopeId}>${ssrInterpolate(article.title)}</div><div class="related-article-meta" data-v-457af871${_scopeId}><span class="related-article-date" data-v-457af871${_scopeId}>${ssrInterpolate(article.date)}</span>`);
							if (article.tags && article.tags.length > 0) {
								_push(`<span class="related-article-tags" data-v-457af871${_scopeId}><!--[-->`);
								ssrRenderList(article.tags.slice(0, 2), (tag) => {
									_push(`<span class="tag" data-v-457af871${_scopeId}>${ssrInterpolate(tag)}</span>`);
								});
								_push(`<!--]--></span>`);
							} else _push(`<!---->`);
							_push(`</div></div><span class="related-article-arrow" data-v-457af871${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-457af871${_scopeId}><polyline points="9 18 15 12 9 6" data-v-457af871${_scopeId}></polyline></svg></span>`);
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
});
//#endregion
//#region src/components/p-center/RelatedArticles.vue
var _sfc_setup$3 = RelatedArticles_vue_vue_type_script_setup_true_lang_default.setup;
RelatedArticles_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/RelatedArticles.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var RelatedArticles_default = /* @__PURE__ */ _plugin_vue_export_helper_default(RelatedArticles_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-457af871"]]);
//#endregion
//#region src/components/api/ShareButton.vue?vue&type=script&setup=true&lang.ts
var ShareButton_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ShareButton",
	__ssrInlineRender: true,
	props: {
		title: {},
		url: {},
		description: {}
	},
	setup(__props) {
		const props = __props;
		const scriptLoaded = ref(false);
		const loadShareScript = () => {
			if (document.getElementById("addtoany-script")) {
				initButtons();
				return;
			}
			const script = document.createElement("script");
			script.id = "addtoany-script";
			script.src = "https://static.addtoany.com/menu/page.js";
			script.async = true;
			script.onload = () => {
				scriptLoaded.value = true;
				initButtons();
			};
			document.body.appendChild(script);
		};
		const initButtons = () => {
			nextTick(() => {
				if (window.a2a && window.a2a.init_all) window.a2a.init_all();
			});
		};
		onMounted(() => {
			loadShareScript();
		});
		watch(() => props.url, () => {
			if (scriptLoaded.value) initButtons();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "share-container" }, _attrs))} data-v-7d62a8b6><div class="share-header" data-v-7d62a8b6><span class="share-icon" data-v-7d62a8b6>🔗</span><span class="share-title" data-v-7d62a8b6>分享这篇文章</span></div><div class="a2a_kit a2a_kit_size_32 a2a_default_style"${ssrRenderAttr("data-a2a-url", __props.url)}${ssrRenderAttr("data-a2a-title", __props.title)} data-v-7d62a8b6><a class="a2a_button_copy_link" data-v-7d62a8b6></a><a class="a2a_button_wechat" data-v-7d62a8b6></a><a class="a2a_button_weibo" data-v-7d62a8b6></a><a class="a2a_button_twitter" data-v-7d62a8b6></a><a class="a2a_button_facebook" data-v-7d62a8b6></a><a class="a2a_button_telegram" data-v-7d62a8b6></a><a class="a2a_button_reddit" data-v-7d62a8b6></a><a class="a2a_dd" href="https://www.addtoany.com/share" data-v-7d62a8b6></a></div></div>`);
		};
	}
});
//#endregion
//#region src/components/api/ShareButton.vue
var _sfc_setup$2 = ShareButton_vue_vue_type_script_setup_true_lang_default.setup;
ShareButton_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/ShareButton.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ShareButton_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ShareButton_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7d62a8b6"]]);
//#endregion
//#region src/components/api/Sponsor.vue?vue&type=script&setup=true&lang.ts
var Sponsor_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Sponsor",
	__ssrInlineRender: true,
	setup(__props) {
		const showModal = ref(false);
		const activeTab = ref("wechat");
		const sponsor = ref({ enabled: false });
		const loadConfig = async () => {
			try {
				const res = await fetch("/config/sponsor.json");
				if (res.ok) sponsor.value = await res.json();
			} catch {}
		};
		const closeModal = () => {
			showModal.value = false;
		};
		if (typeof window !== "undefined") window.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && showModal.value) closeModal();
		});
		onMounted(loadConfig);
		return (_ctx, _push, _parent, _attrs) => {
			if (sponsor.value.enabled) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "sponsor-wrap" }, _attrs))} data-v-6e5f30b8><button class="sponsor-btn" title="赞赏" data-v-6e5f30b8><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-6e5f30b8><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-v-6e5f30b8></path></svg> 赞赏 </button>`);
				ssrRenderTeleport(_push, (_push) => {
					if (showModal.value) _push(`<div class="sponsor-overlay" data-v-6e5f30b8><div class="sponsor-modal" data-v-6e5f30b8><div class="sponsor-header" data-v-6e5f30b8><h3 data-v-6e5f30b8>赞赏支持</h3><button class="sponsor-close" data-v-6e5f30b8>×</button></div><p class="sponsor-msg" data-v-6e5f30b8>${ssrInterpolate(sponsor.value.message)}</p><div class="sponsor-tabs" data-v-6e5f30b8><button class="${ssrRenderClass(["sp-tab", { active: activeTab.value === "wechat" }])}" data-v-6e5f30b8>微信</button><button class="${ssrRenderClass(["sp-tab", { active: activeTab.value === "alipay" }])}" data-v-6e5f30b8>支付宝</button></div><div class="sponsor-qr" data-v-6e5f30b8><img${ssrRenderAttr("src", activeTab.value === "wechat" ? sponsor.value.wechat : sponsor.value.alipay)}${ssrRenderAttr("alt", activeTab.value === "wechat" ? "微信赞赏码" : "支付宝收款码")} class="qr-image" data-v-6e5f30b8></div><p class="sponsor-thanks" data-v-6e5f30b8>感谢你的支持 ✨</p></div></div>`);
					else _push(`<!---->`);
				}, "body", false, _parent);
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region src/components/api/Sponsor.vue
var _sfc_setup$1 = Sponsor_vue_vue_type_script_setup_true_lang_default.setup;
Sponsor_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/Sponsor.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Sponsor_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Sponsor_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6e5f30b8"]]);
//#endregion
//#region src/pages/post/Posts.vue?vue&type=script&setup=true&lang.ts
var Posts_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
					content: post.value ? `https://cnkrru.top/og/post-${post.value.id}.svg` : "https://cnkrru.top/og/default.svg"
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
					content: post.value ? `https://cnkrru.top/og/post-${post.value.id}.svg` : "https://cnkrru.top/og/default.svg"
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
					"image": `https://cnkrru.top/og/post-${post.value.id}.svg`,
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
			_push(`<!--[--><div id="site-stats-container" data-v-7b6fefdc></div><div class="center-head-card" data-v-7b6fefdc><h2 data-v-7b6fefdc>${ssrInterpolate(post.value?.title || "文章详情")}</h2><div class="center-head-card-tools" data-v-7b6fefdc>`);
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
			_push(`<hr data-v-7b6fefdc><div class="center-card-content" data-v-7b6fefdc>`);
			if (!loading.value && !error.value && post.value) _push(`<div class="post-cover" data-v-7b6fefdc><img${ssrRenderAttr("src", `/og/post-${post.value.id}.svg`)}${ssrRenderAttr("alt", post.value.title)} class="cover-image" data-v-7b6fefdc></div>`);
			else _push(`<!---->`);
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
			if (!loading.value && !error.value) _push(`<hr data-v-7b6fefdc>`);
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
			if (!loading.value && !error.value) _push(`<hr data-v-7b6fefdc>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<div class="read-center-card-footer" data-v-7b6fefdc><p data-v-7b6fefdc>© 2026 Cnkrru&#39;s Blog. All rights reserved.</p></div>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value && post.value) _push(ssrRenderComponent(ShareButton_default, {
				title: post.value?.title || "",
				url: `https://cnkrru.top/post/${postId.value}`,
				description: post.value?.description || ""
			}, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value && post.value) _push(ssrRenderComponent(Sponsor_default, null, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(Comment_default, null, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-7b6fefdc>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(SiteStats_default, null, null, _parent));
			else _push(`<!---->`);
			_push(`</div><hr data-v-7b6fefdc><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/post/Posts.vue
var _sfc_setup = Posts_vue_vue_type_script_setup_true_lang_default.setup;
Posts_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/post/Posts.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Posts_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Posts_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7b6fefdc"]]);
//#endregion
export { Posts_default as default };
