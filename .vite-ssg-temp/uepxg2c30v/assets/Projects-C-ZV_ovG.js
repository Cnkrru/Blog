import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as PageNav_default } from "./PageNav-ByJ4dsnL.js";
import { Fragment, createBlock, createCommentVNode, createVNode, defineComponent, onMounted, openBlock, ref, renderList, resolveComponent, toDisplayString, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region src/pages/Projects.vue?vue&type=script&setup=true&lang.ts
var Projects_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Projects",
	__ssrInlineRender: true,
	setup(__props) {
		useHead({
			title: "项目 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "Cnkrru的个人项目展示，包含博客、前端开发、后端开发等各类项目的详细介绍"
				},
				{
					name: "keywords",
					content: "项目,个人项目,博客,前端,后端,开发"
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
					content: "https://cnkrru.top/projects"
				},
				{
					property: "og:title",
					content: "项目 - Cnkrru's Blog"
				},
				{
					property: "og:description",
					content: "Cnkrru的个人项目展示"
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
					content: "https://cnkrru.top/projects"
				},
				{
					name: "twitter:title",
					content: "项目 - Cnkrru's Blog"
				},
				{
					name: "twitter:description",
					content: "Cnkrru的个人项目展示"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/projects"
			}]
		});
		const projects = ref([]);
		const categories = ref([]);
		const currentPage = ref(1);
		const totalPages = ref(1);
		const loadProjects = async () => {
			try {
				const response = await fetch("/config/projects.json");
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				projects.value = await response.json();
				categorizeProjects();
			} catch (error) {
				console.error("加载项目失败:", error);
				projects.value = [];
			}
		};
		const categorizeProjects = () => {
			const categoryMap = {};
			projects.value.forEach((project) => {
				const category = project.category;
				if (!categoryMap[category]) categoryMap[category] = [];
				categoryMap[category].push(project);
			});
			categories.value = Object.keys(categoryMap).map((category) => {
				return {
					name: category,
					projects: categoryMap[category].sort((a, b) => {
						return parseInt(b.id) - parseInt(a.id);
					})
				};
			}).sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
			totalPages.value = categories.value.length;
		};
		const getCurrentCategory = () => {
			return categories.value[currentPage.value - 1];
		};
		const changePage = (page) => {
			if (page >= 1 && page <= totalPages.value) currentPage.value = page;
		};
		onMounted(() => {
			loadProjects();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RouterLink = resolveComponent("RouterLink");
			_push(`<!--[--><div id="site-stats-container" data-v-3c2e8856></div><div class="center-head-card" data-v-3c2e8856><h2 data-v-3c2e8856>项目</h2></div><hr data-v-3c2e8856><div class="center-card-content" data-v-3c2e8856>`);
			if (getCurrentCategory()) {
				_push(`<div class="projects-content" data-v-3c2e8856><!--[-->`);
				ssrRenderList(getCurrentCategory().projects, (project) => {
					_push(ssrRenderComponent(_component_RouterLink, {
						key: project.id,
						to: `/project/${project.id}`,
						class: "project-card"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="card-accent" data-v-3c2e8856${_scopeId}></div><div class="card-body" data-v-3c2e8856${_scopeId}><div class="card-meta" data-v-3c2e8856${_scopeId}><span class="card-category" data-v-3c2e8856${_scopeId}>${ssrInterpolate(project.category)}</span><span class="card-date" data-v-3c2e8856${_scopeId}>${ssrInterpolate(project.date)}</span></div><h3 class="card-title" data-v-3c2e8856${_scopeId}>${ssrInterpolate(project.title)}</h3><p class="card-desc" data-v-3c2e8856${_scopeId}>${ssrInterpolate(project.description)}</p><div class="card-footer" data-v-3c2e8856${_scopeId}>`);
								if (project.tags && project.tags.length) {
									_push(`<div class="card-tags" data-v-3c2e8856${_scopeId}><!--[-->`);
									ssrRenderList(project.tags.slice(0, 3), (t) => {
										_push(`<span class="card-tag" data-v-3c2e8856${_scopeId}>${ssrInterpolate(t)}</span>`);
									});
									_push(`<!--]--></div>`);
								} else _push(`<!---->`);
								_push(`<span class="card-arrow" data-v-3c2e8856${_scopeId}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-3c2e8856${_scopeId}><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3c2e8856${_scopeId}></path></svg></span></div></div>`);
							} else return [createVNode("div", { class: "card-accent" }), createVNode("div", { class: "card-body" }, [
								createVNode("div", { class: "card-meta" }, [createVNode("span", { class: "card-category" }, toDisplayString(project.category), 1), createVNode("span", { class: "card-date" }, toDisplayString(project.date), 1)]),
								createVNode("h3", { class: "card-title" }, toDisplayString(project.title), 1),
								createVNode("p", { class: "card-desc" }, toDisplayString(project.description), 1),
								createVNode("div", { class: "card-footer" }, [project.tags && project.tags.length ? (openBlock(), createBlock("div", {
									key: 0,
									class: "card-tags"
								}, [(openBlock(true), createBlock(Fragment, null, renderList(project.tags.slice(0, 3), (t) => {
									return openBlock(), createBlock("span", {
										key: t,
										class: "card-tag"
									}, toDisplayString(t), 1);
								}), 128))])) : createCommentVNode("", true), createVNode("span", { class: "card-arrow" }, [(openBlock(), createBlock("svg", {
									width: "16",
									height: "16",
									viewBox: "0 0 24 24",
									fill: "none",
									xmlns: "http://www.w3.org/2000/svg"
								}, [createVNode("path", {
									d: "M5 12H19M19 12L12 5M19 12L12 19",
									stroke: "currentColor",
									"stroke-width": "2",
									"stroke-linecap": "round",
									"stroke-linejoin": "round"
								})]))])])
							])];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`</div><hr data-v-3c2e8856>`);
			_push(ssrRenderComponent(PageNav_default, {
				type: "projects",
				"current-page": currentPage.value,
				"total-pages": totalPages.value,
				categories: categories.value,
				"current-category": getCurrentCategory()?.name || "",
				onChange: changePage
			}, null, _parent));
			_push(`<!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/Projects.vue
var _sfc_setup = Projects_vue_vue_type_script_setup_true_lang_default.setup;
Projects_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Projects.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Projects_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Projects_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3c2e8856"]]);
//#endregion
export { Projects_default as default };
