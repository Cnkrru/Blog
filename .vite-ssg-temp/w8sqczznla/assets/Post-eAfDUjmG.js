import { i as useArticlesStore } from "./stores-CSCNxxdH.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { a as ReadingTime_default, i as Toc_default, n as PostMenu_default, o as ContentRender_default, r as TocButton_default, s as BackToTop_default, t as Comment_default } from "./Comment-CK0yKwJn.js";
import { t as ArticleNav_default } from "./ArticleNav-CNa1_SKS.js";
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
		const relatedArticles = ref([]);
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "related-articles-wrapper" }, _attrs))} data-v-7779493e><div class="related-articles-container" data-v-7779493e><h3 class="related-articles-title" data-v-7779493e>相关文章推荐</h3><div class="related-articles-grid" data-v-7779493e><!--[-->`);
			ssrRenderList(relatedArticles.value, (article, idx) => {
				_push(ssrRenderComponent(unref(RouterLink), {
					key: article.id,
					to: `/post/${article.id}`,
					class: "related-card",
					style: { animationDelay: `${idx * .08}s` }
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="related-card-cover" data-v-7779493e${_scopeId}><img${ssrRenderAttr("src", `/og/post-${article.id}.svg`)}${ssrRenderAttr("alt", article.title)} loading="lazy" data-v-7779493e${_scopeId}></div><div class="related-card-body" data-v-7779493e${_scopeId}>`);
							if (article.category) _push(`<span class="related-card-category" data-v-7779493e${_scopeId}>${ssrInterpolate(article.category)}</span>`);
							else _push(`<!---->`);
							_push(`<div class="related-card-title" data-v-7779493e${_scopeId}>${ssrInterpolate(article.title)}</div><div class="related-card-meta" data-v-7779493e${_scopeId}><span class="related-card-date" data-v-7779493e${_scopeId}>${ssrInterpolate(article.date)}</span>`);
							if (article.tags && article.tags.length > 0) {
								_push(`<span class="related-card-tags" data-v-7779493e${_scopeId}><!--[-->`);
								ssrRenderList(article.tags.slice(0, 2), (tag) => {
									_push(`<span class="tag" data-v-7779493e${_scopeId}>${ssrInterpolate(tag)}</span>`);
								});
								_push(`<!--]--></span>`);
							} else _push(`<!---->`);
							_push(`</div></div>`);
						} else return [createVNode("div", { class: "related-card-cover" }, [createVNode("img", {
							src: `/og/post-${article.id}.svg`,
							alt: article.title,
							loading: "lazy"
						}, null, 8, ["src", "alt"])]), createVNode("div", { class: "related-card-body" }, [
							article.category ? (openBlock(), createBlock("span", {
								key: 0,
								class: "related-card-category"
							}, toDisplayString(article.category), 1)) : createCommentVNode("", true),
							createVNode("div", { class: "related-card-title" }, toDisplayString(article.title), 1),
							createVNode("div", { class: "related-card-meta" }, [createVNode("span", { class: "related-card-date" }, toDisplayString(article.date), 1), article.tags && article.tags.length > 0 ? (openBlock(), createBlock("span", {
								key: 0,
								class: "related-card-tags"
							}, [(openBlock(true), createBlock(Fragment, null, renderList(article.tags.slice(0, 2), (tag) => {
								return openBlock(), createBlock("span", {
									key: tag,
									class: "tag"
								}, toDisplayString(tag), 1);
							}), 128))])) : createCommentVNode("", true)])
						])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></div></div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/RelatedArticles.vue
var _sfc_setup$4 = RelatedArticles_vue_vue_type_script_setup_true_lang_default.setup;
RelatedArticles_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/RelatedArticles.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var RelatedArticles_default = /* @__PURE__ */ _plugin_vue_export_helper_default(RelatedArticles_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-7779493e"]]);
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
		onMounted(loadConfig);
		if (typeof window !== "undefined") window.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && showModal.value) closeModal();
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (sponsor.value.enabled) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "sponsor-wrap" }, _attrs))} data-v-58592bea><button class="sponsor-btn" data-v-58592bea><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="sp-btn-icon" data-v-58592bea><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-v-58592bea></path></svg> 赞赏 </button>`);
				ssrRenderTeleport(_push, (_push) => {
					if (showModal.value) _push(`<div class="sponsor-overlay" data-v-58592bea><div class="sponsor-modal" data-v-58592bea><div class="sponsor-header" data-v-58592bea><h3 data-v-58592bea>赞赏支持</h3><button class="sponsor-close" data-v-58592bea><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-58592bea><line x1="18" y1="6" x2="6" y2="18" data-v-58592bea></line><line x1="6" y1="6" x2="18" y2="18" data-v-58592bea></line></svg></button></div><p class="sponsor-msg" data-v-58592bea>${ssrInterpolate(sponsor.value.message)}</p><div class="sponsor-tabs" data-v-58592bea><button class="${ssrRenderClass(["sp-tab", { active: activeTab.value === "wechat" }])}" data-v-58592bea>微信</button><button class="${ssrRenderClass(["sp-tab", { active: activeTab.value === "alipay" }])}" data-v-58592bea>支付宝</button></div><div class="sponsor-qr" data-v-58592bea><img${ssrRenderAttr("src", activeTab.value === "wechat" ? sponsor.value.wechat : sponsor.value.alipay)}${ssrRenderAttr("alt", activeTab.value === "wechat" ? "微信赞赏码" : "支付宝收款码")} class="qr-image" data-v-58592bea></div><p class="sponsor-thanks" data-v-58592bea>感谢你的支持</p></div></div>`);
					else _push(`<!---->`);
				}, "body", false, _parent);
				_push(`</div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region src/components/api/Sponsor.vue
var _sfc_setup$3 = Sponsor_vue_vue_type_script_setup_true_lang_default.setup;
Sponsor_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/Sponsor.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var Sponsor_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Sponsor_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-58592bea"]]);
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
				if (window.a2a?.init_all) window.a2a.init_all();
			});
		};
		onMounted(() => loadShareScript());
		watch(() => props.url, () => {
			if (scriptLoaded.value) initButtons();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "share-container" }, _attrs))} data-v-60e296c8><div class="share-header" data-v-60e296c8><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024" fill="currentColor" class="share-icon" data-v-60e296c8><path d="M832 128h-192v64h146.752l-265.376 265.376 45.248 45.248L832 237.248V384h64V128z" data-v-60e296c8></path><path d="M768 832H192V256h352V192H160a32 32 0 0 0-32 32v640a32 32 0 0 0 32 32h640a32 32 0 0 0 32-32V480h-64v352z" data-v-60e296c8></path></svg><span class="share-title" data-v-60e296c8>分享这篇文章</span></div><div class="a2a_kit a2a_kit_size_32 a2a_default_style"${ssrRenderAttr("data-a2a-url", __props.url)}${ssrRenderAttr("data-a2a-title", __props.title)} data-v-60e296c8><a class="a2a_button_wechat" data-v-60e296c8></a><a class="a2a_button_qzone" data-v-60e296c8></a><a class="a2a_button_copy_link" data-v-60e296c8></a><a class="a2a_dd" href="https://www.addtoany.com/share" data-v-60e296c8></a></div></div>`);
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
var ShareButton_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ShareButton_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-60e296c8"]]);
//#endregion
//#region src/components/p-center/ArticleActionBar.vue?vue&type=script&setup=true&lang.ts
var ArticleActionBar_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "ArticleActionBar",
	__ssrInlineRender: true,
	props: {
		title: {},
		url: {},
		description: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "action-bar" }, _attrs))} data-v-3c9e6199><div class="action-bar-inner" data-v-3c9e6199>`);
			_push(ssrRenderComponent(ShareButton_default, {
				title: __props.title,
				url: __props.url,
				description: __props.description
			}, null, _parent));
			_push(`<div class="action-divider" data-v-3c9e6199></div>`);
			_push(ssrRenderComponent(Sponsor_default, null, null, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/ArticleActionBar.vue
var _sfc_setup$1 = ArticleActionBar_vue_vue_type_script_setup_true_lang_default.setup;
ArticleActionBar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/ArticleActionBar.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ArticleActionBar_default = /* @__PURE__ */ _plugin_vue_export_helper_default(ArticleActionBar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3c9e6199"]]);
//#endregion
//#region src/pages/Post.vue?vue&type=script&setup=true&lang.ts
var Post_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Post",
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
			_push(`<!--[--><div id="site-stats-container" data-v-8ebb6627></div><div class="center-head-card" data-v-8ebb6627><div class="center-head-title" data-v-8ebb6627><h2 data-v-8ebb6627>${ssrInterpolate(post.value?.title || "文章详情")}</h2></div><div class="center-head-tools" data-v-8ebb6627>`);
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
			_push(`<hr data-v-8ebb6627><div class="center-card-content" data-v-8ebb6627>`);
			if (!loading.value && !error.value && post.value) _push(`<div class="post-cover" data-v-8ebb6627><img${ssrRenderAttr("src", `/og/post-${post.value.id}.svg`)}${ssrRenderAttr("alt", post.value.title)} class="cover-image" data-v-8ebb6627></div>`);
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
			if (!loading.value && !error.value) _push(`<hr data-v-8ebb6627>`);
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
			if (!loading.value && !error.value) _push(`<hr data-v-8ebb6627>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<div class="read-center-card-footer" data-v-8ebb6627><p data-v-8ebb6627>© 2026 Cnkrru&#39;s Blog. All rights reserved.</p></div>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value && post.value) _push(ssrRenderComponent(ArticleActionBar_default, {
				title: post.value?.title || "",
				url: `https://cnkrru.top/post/${postId.value}`,
				description: post.value?.description || ""
			}, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(Comment_default, null, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-8ebb6627>`);
			else _push(`<!---->`);
			_push(`</div><hr data-v-8ebb6627><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/Post.vue
var _sfc_setup = Post_vue_vue_type_script_setup_true_lang_default.setup;
Post_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Post.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Post_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Post_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8ebb6627"]]);
//#endregion
export { Post_default as default };
