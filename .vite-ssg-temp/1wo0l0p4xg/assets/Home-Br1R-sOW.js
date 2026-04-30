import { b as useArticlesStore, g as useAnnouncementStore } from "./stores-CqGIWUfC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as _sfc_main$1 } from "./MarkdownRender-BiaaSOGw.js";
import { t as ArticleCount_default } from "./ArticleCount-BaZ99zKI.js";
import { t as PageNav_default } from "./PageNav-CLio7YyF.js";
import { computed, createBlock, createCommentVNode, createVNode, defineComponent, onMounted, onUnmounted, openBlock, ref, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { RouterLink } from "vue-router";
//#region src/pages/announcement/Announcement.vue?vue&type=script&setup=true&lang.ts
var Announcement_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Announcement",
	__ssrInlineRender: true,
	setup(__props, { expose: __expose }) {
		const announcementStore = useAnnouncementStore();
		const showModal = computed(() => announcementStore.showModal);
		const announcementContent = computed(() => announcementStore.announcementContent);
		const loading = computed(() => announcementStore.loading);
		const openAnnouncement = () => announcementStore.openAnnouncement();
		const closeAnnouncement = () => announcementStore.closeAnnouncement();
		const loadAnnouncement = () => announcementStore.loadAnnouncement();
		const handleKeydown = (event) => {
			if (event.key === "Escape" && showModal.value) closeAnnouncement();
		};
		__expose({ openAnnouncement });
		onMounted(() => {
			loadAnnouncement();
			window.addEventListener("keydown", handleKeydown);
		});
		onUnmounted(() => {
			window.removeEventListener("keydown", handleKeydown);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-49dd5331><button class="announcement-btn" data-v-49dd5331><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" data-v-49dd5331><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" data-v-49dd5331></path></svg><span data-v-49dd5331>公告</span></button>`);
			if (showModal.value) {
				_push(`<div class="modal-overlay" data-v-49dd5331><div class="modal-content" data-v-49dd5331><div class="modal-header" data-v-49dd5331><h3 data-v-49dd5331>网站公告</h3><button class="modal-close" data-v-49dd5331><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" data-v-49dd5331><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" data-v-49dd5331></path></svg></button></div><div class="modal-body" data-v-49dd5331>`);
				if (loading.value) _push(`<div class="loading-message" data-v-49dd5331><div class="loading-spinner" data-v-49dd5331></div><p data-v-49dd5331>加载公告中...</p></div>`);
				else _push(ssrRenderComponent(_sfc_main$1, { content: announcementContent.value }, null, _parent));
				_push(`</div><div class="modal-footer" data-v-49dd5331><button class="modal-btn" data-v-49dd5331>确定</button></div></div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/pages/announcement/Announcement.vue
var _sfc_setup$1 = Announcement_vue_vue_type_script_setup_true_lang_default.setup;
Announcement_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/announcement/Announcement.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Announcement_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Announcement_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-49dd5331"]]);
//#endregion
//#region src/pages/Home.vue
var _sfc_main = {
	__name: "Home",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		useHead({
			title: "首页 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "欢迎来到Cnkrru's Blog，分享技术和生活的个人空间，包含最新技术文章、实用工具和项目展示"
				},
				{
					name: "keywords",
					content: "博客,技术,生活,分享,前端开发,Vue,JavaScript"
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
					content: "https://cnkrru.top/home"
				},
				{
					property: "og:title",
					content: "首页 - Cnkrru's Blog"
				},
				{
					property: "og:description",
					content: "欢迎来到Cnkrru's Blog，分享技术和生活的个人空间，包含最新技术文章、实用工具和项目展示"
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
					content: "https://cnkrru.top/home"
				},
				{
					name: "twitter:title",
					content: "首页 - Cnkrru's Blog"
				},
				{
					name: "twitter:description",
					content: "欢迎来到Cnkrru's Blog，分享技术和生活的个人空间，包含最新技术文章、实用工具和项目展示"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/home"
			}]
		});
		const articles = ref([]);
		const currentPage = ref(1);
		const pageSize = ref(5);
		const totalPages = ref(1);
		const loading = ref(true);
		const error = ref(null);
		const loadArticles = async () => {
			try {
				loading.value = true;
				error.value = null;
				articles.value = (await store.fetchArticles()).filter((article) => article.id !== "terminal" && article.id !== "changelog");
				calculateTotalPages();
			} catch (err) {
				error.value = "加载文章失败";
				articles.value = [];
			} finally {
				loading.value = false;
			}
		};
		const calculateTotalPages = () => {
			const otherArticles = articles.value.filter((article) => article.id !== "0");
			totalPages.value = Math.ceil((otherArticles.length + 1) / pageSize.value);
		};
		const getPaginatedArticles = () => {
			const welcomeArticle = articles.value.find((article) => article.id === "0") || {
				id: "0",
				title: "欢迎来到我的博客",
				category: "公告",
				tags: ["欢迎"],
				date: "2026-03-29",
				path: "./html/posts/post-0.html"
			};
			const otherArticles = articles.value.filter((article) => article.id !== "0").sort((a, b) => {
				return parseInt(b.id) - parseInt(a.id);
			});
			if (currentPage.value === 1) {
				const remainingSlots = pageSize.value - 1;
				return [welcomeArticle, ...otherArticles.slice(0, remainingSlots)];
			} else {
				const startIndex = (currentPage.value - 1) * pageSize.value - 1;
				const endIndex = startIndex + pageSize.value;
				return otherArticles.slice(startIndex, endIndex);
			}
		};
		const changePage = (page) => {
			if (page >= 1 && page <= totalPages.value) currentPage.value = page;
		};
		onMounted(() => {
			loadArticles();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div id="site-stats-container"></div><div class="center-head-card"><h2>最新文章</h2>`);
			_push(ssrRenderComponent(ArticleCount_default, null, null, _parent));
			_push(ssrRenderComponent(Announcement_default, null, null, _parent));
			_push(`</div><hr><div class="center-card-content">`);
			if (loading.value) _push(`<div class="loading-message"><p>Loading...</p></div>`);
			else if (error.value) _push(`<div class="error-message"><p>${ssrInterpolate(error.value)}</p></div>`);
			else if (getPaginatedArticles().length > 0) {
				_push(`<!--[-->`);
				ssrRenderList(getPaginatedArticles(), (article, index) => {
					_push(`<!--[-->`);
					if (currentPage.value === 1 && index === 1) _push(`<hr style="${ssrRenderStyle({ "margin": "10px 0" })}">`);
					else _push(`<!---->`);
					_push(ssrRenderComponent(unref(RouterLink), { to: `/post/${article.id}` }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="index-center-list-card"${_scopeId}><div class="index-center-list-card-header"${_scopeId}>${ssrInterpolate(article.title)}</div><hr${_scopeId}><div class="index-center-list-card-content"${_scopeId}><div class="article-meta-info"${_scopeId}><span${_scopeId}>ID: ${ssrInterpolate(article.id)}</span>`);
								if (article.category) _push(`<span${_scopeId}>分类: ${ssrInterpolate(article.category)}</span>`);
								else _push(`<!---->`);
								if (article.tags && article.tags.length > 0) _push(`<span${_scopeId}>标签: ${ssrInterpolate(article.tags.join(", "))}</span>`);
								else _push(`<!---->`);
								_push(`<span${_scopeId}>Date: ${ssrInterpolate(article.date)}</span></div></div></div>`);
							} else return [createVNode("div", { class: "index-center-list-card" }, [
								createVNode("div", { class: "index-center-list-card-header" }, toDisplayString(article.title), 1),
								createVNode("hr"),
								createVNode("div", { class: "index-center-list-card-content" }, [createVNode("div", { class: "article-meta-info" }, [
									createVNode("span", null, "ID: " + toDisplayString(article.id), 1),
									article.category ? (openBlock(), createBlock("span", { key: 0 }, "分类: " + toDisplayString(article.category), 1)) : createCommentVNode("", true),
									article.tags && article.tags.length > 0 ? (openBlock(), createBlock("span", { key: 1 }, "标签: " + toDisplayString(article.tags.join(", ")), 1)) : createCommentVNode("", true),
									createVNode("span", null, "Date: " + toDisplayString(article.date), 1)
								])])
							])];
						}),
						_: 2
					}, _parent));
					_push(`<!--]-->`);
				});
				_push(`<!--]-->`);
			} else _push(`<div class="empty-message"><p>No articles found</p></div>`);
			_push(`</div><hr>`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(PageNav_default, {
				type: "posts",
				"current-page": currentPage.value,
				"total-pages": totalPages.value,
				categories: [],
				onChange: changePage
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Home.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
