import { i as useArticlesStore, n as useAnnouncementStore } from "./stores-D5XJjRmy.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as MarkdownRender_default } from "./MarkdownRender-DpjFFQRI.js";
import { t as ArticleCount_default } from "./ArticleCount-DxibLSD1.js";
import { t as PageNav_default } from "./PageNav-ENNMJBE8.js";
import { Fragment, computed, createBlock, createCommentVNode, createVNode, defineComponent, onMounted, onUnmounted, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
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
			_push(`<div${ssrRenderAttrs(_attrs)} data-v-abb91e6f><button class="announcement-btn" data-v-abb91e6f><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" data-v-abb91e6f><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" data-v-abb91e6f></path></svg><span data-v-abb91e6f>公告</span></button>`);
			if (showModal.value) {
				_push(`<div class="modal-overlay" data-v-abb91e6f><div class="modal-content" data-v-abb91e6f><div class="modal-header" data-v-abb91e6f><h3 data-v-abb91e6f>网站公告</h3><button class="modal-close" data-v-abb91e6f><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" data-v-abb91e6f><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" data-v-abb91e6f></path></svg></button></div><div class="modal-body" data-v-abb91e6f>`);
				if (loading.value) _push(`<div class="loading-message" data-v-abb91e6f><div class="loading-spinner" data-v-abb91e6f></div><p data-v-abb91e6f>加载公告中...</p></div>`);
				else _push(ssrRenderComponent(MarkdownRender_default, { content: announcementContent.value }, null, _parent));
				_push(`</div><div class="modal-footer" data-v-abb91e6f><button class="modal-btn" data-v-abb91e6f>确定</button></div></div></div>`);
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
var Announcement_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Announcement_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-abb91e6f"]]);
//#endregion
//#region src/pages/Home.vue?vue&type=script&setup=true&lang.ts
var Home_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Home",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useArticlesStore();
		useHead({
			title: "首页 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "欢迎来到Cnkrru's Blog，分享技术和生活的个人空间"
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
					content: "欢迎来到Cnkrru's Blog，分享技术和生活的个人空间"
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
					content: "欢迎来到Cnkrru's Blog，分享技术和生活的个人空间"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/home"
			}]
		});
		const articles = ref([]);
		const currentPage = ref(1);
		const pageSize = ref(6);
		const totalPages = ref(1);
		const loading = ref(true);
		const error = ref(null);
		const pinnedPosts = ref([]);
		const hasPinned = ref(false);
		const loadArticles = async () => {
			try {
				loading.value = true;
				error.value = null;
				articles.value = (await store.fetchArticles()).filter((a) => a.id !== "terminal" && a.id !== "changelog");
				pinnedPosts.value = articles.value.filter((a) => a.pinned === true);
				hasPinned.value = pinnedPosts.value.length > 0;
				calculateTotalPages();
			} catch (err) {
				error.value = "加载文章失败";
				articles.value = [];
			} finally {
				loading.value = false;
			}
		};
		const calculateTotalPages = () => {
			const others = articles.value.filter((a) => !a.pinned);
			totalPages.value = Math.ceil(others.length / pageSize.value) || 1;
		};
		const getPaginatedArticles = () => {
			const others = articles.value.filter((a) => !a.pinned).sort((a, b) => parseInt(b.id) - parseInt(a.id));
			const start = (currentPage.value - 1) * pageSize.value;
			return others.slice(start, start + pageSize.value);
		};
		const changePage = (p) => {
			if (p >= 1 && p <= totalPages.value) currentPage.value = p;
		};
		onMounted(() => loadArticles());
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div id="site-stats-container" data-v-978e93da></div><div class="center-head-card" data-v-978e93da><h2 data-v-978e93da>最新文章</h2>`);
			_push(ssrRenderComponent(ArticleCount_default, null, null, _parent));
			_push(ssrRenderComponent(Announcement_default, null, null, _parent));
			_push(`</div><hr data-v-978e93da><div class="center-card-content" data-v-978e93da>`);
			if (loading.value) {
				_push(`<div class="skel-grid" data-v-978e93da><!--[-->`);
				ssrRenderList(6, (n) => {
					_push(`<div class="skel-card" data-v-978e93da><div class="skel-img" data-v-978e93da></div><div class="skel-body" data-v-978e93da><div class="skel-line w60" data-v-978e93da></div><div class="skel-line w40" data-v-978e93da></div></div></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (error.value) _push(`<div class="err-msg" data-v-978e93da><p data-v-978e93da>${ssrInterpolate(error.value)}</p></div>`);
			else {
				_push(`<!--[-->`);
				if (hasPinned.value && currentPage.value === 1) {
					_push(`<div class="pinned-section" data-v-978e93da><div class="pinned-label" data-v-978e93da>📌 置顶</div><div class="card-grid" data-v-978e93da><!--[-->`);
					ssrRenderList(pinnedPosts.value, (a) => {
						_push(ssrRenderComponent(unref(RouterLink), {
							key: a.id,
							to: `/post/${a.id}`,
							class: "post-card pinned"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="card-cover" data-v-978e93da${_scopeId}><img${ssrRenderAttr("src", `/og/post-${a.id}.svg`)}${ssrRenderAttr("alt", a.title)} data-v-978e93da${_scopeId}><span class="pin-badge" data-v-978e93da${_scopeId}>📌</span></div><div class="card-info" data-v-978e93da${_scopeId}><h3 class="card-title" data-v-978e93da${_scopeId}>${ssrInterpolate(a.title)}</h3><p class="card-date" data-v-978e93da${_scopeId}>${ssrInterpolate(a.date)}</p><div class="card-tags" data-v-978e93da${_scopeId}><!--[-->`);
									ssrRenderList((a.tags || []).slice(0, 3), (t) => {
										_push(`<span class="card-tag" data-v-978e93da${_scopeId}>${ssrInterpolate(t)}</span>`);
									});
									_push(`<!--]--></div></div>`);
								} else return [createVNode("div", { class: "card-cover" }, [createVNode("img", {
									src: `/og/post-${a.id}.svg`,
									alt: a.title
								}, null, 8, ["src", "alt"]), createVNode("span", { class: "pin-badge" }, "📌")]), createVNode("div", { class: "card-info" }, [
									createVNode("h3", { class: "card-title" }, toDisplayString(a.title), 1),
									createVNode("p", { class: "card-date" }, toDisplayString(a.date), 1),
									createVNode("div", { class: "card-tags" }, [(openBlock(true), createBlock(Fragment, null, renderList((a.tags || []).slice(0, 3), (t) => {
										return openBlock(), createBlock("span", {
											key: t,
											class: "card-tag"
										}, toDisplayString(t), 1);
									}), 128))])
								])];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div>`);
					if (getPaginatedArticles().length > 0) _push(`<hr class="section-divider" data-v-978e93da>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				if (getPaginatedArticles().length > 0) {
					_push(`<div class="card-grid" data-v-978e93da><!--[-->`);
					ssrRenderList(getPaginatedArticles(), (a) => {
						_push(ssrRenderComponent(unref(RouterLink), {
							key: a.id,
							to: `/post/${a.id}`,
							class: "post-card"
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="card-cover" data-v-978e93da${_scopeId}><img${ssrRenderAttr("src", `/og/post-${a.id}.svg`)}${ssrRenderAttr("alt", a.title)} data-v-978e93da${_scopeId}></div><div class="card-info" data-v-978e93da${_scopeId}><h3 class="card-title" data-v-978e93da${_scopeId}>${ssrInterpolate(a.title)}</h3><p class="card-date" data-v-978e93da${_scopeId}>${ssrInterpolate(a.date)}</p><div class="card-tags" data-v-978e93da${_scopeId}>`);
									if (a.category) _push(`<span class="card-cat" data-v-978e93da${_scopeId}>${ssrInterpolate(a.category)}</span>`);
									else _push(`<!---->`);
									_push(`<!--[-->`);
									ssrRenderList((a.tags || []).slice(0, 3), (t) => {
										_push(`<span class="card-tag" data-v-978e93da${_scopeId}>${ssrInterpolate(t)}</span>`);
									});
									_push(`<!--]--></div></div>`);
								} else return [createVNode("div", { class: "card-cover" }, [createVNode("img", {
									src: `/og/post-${a.id}.svg`,
									alt: a.title
								}, null, 8, ["src", "alt"])]), createVNode("div", { class: "card-info" }, [
									createVNode("h3", { class: "card-title" }, toDisplayString(a.title), 1),
									createVNode("p", { class: "card-date" }, toDisplayString(a.date), 1),
									createVNode("div", { class: "card-tags" }, [a.category ? (openBlock(), createBlock("span", {
										key: 0,
										class: "card-cat"
									}, toDisplayString(a.category), 1)) : createCommentVNode("", true), (openBlock(true), createBlock(Fragment, null, renderList((a.tags || []).slice(0, 3), (t) => {
										return openBlock(), createBlock("span", {
											key: t,
											class: "card-tag"
										}, toDisplayString(t), 1);
									}), 128))])
								])];
							}),
							_: 2
						}, _parent));
					});
					_push(`<!--]--></div>`);
				} else _push(`<div class="empty-msg" data-v-978e93da><p data-v-978e93da>暂无文章</p></div>`);
				_push(`<!--]-->`);
			}
			_push(`</div><hr data-v-978e93da>`);
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
});
//#endregion
//#region src/pages/Home.vue
var _sfc_setup = Home_vue_vue_type_script_setup_true_lang_default.setup;
Home_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Home.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Home_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Home_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-978e93da"]]);
//#endregion
export { Home_default as default };
