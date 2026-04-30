import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as PageNav_default } from "./PageNav-CLio7YyF.js";
import { createVNode, onMounted, ref, resolveComponent, toDisplayString, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region src/pages/Projects.vue
var _sfc_main = {
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
			_push(`<!--[--><div id="site-stats-container" data-v-dba7e073></div><div class="center-head-card" data-v-dba7e073><h2 data-v-dba7e073>项目</h2></div><hr data-v-dba7e073><div class="center-card-content" data-v-dba7e073>`);
			if (getCurrentCategory()) {
				_push(`<div class="projects-content" data-v-dba7e073><!--[-->`);
				ssrRenderList(getCurrentCategory().projects, (project) => {
					_push(ssrRenderComponent(_component_RouterLink, {
						key: project.id,
						to: `/project/${project.id}`,
						class: "project-card"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<div class="project-name" data-v-dba7e073${_scopeId}>${ssrInterpolate(project.name)}</div><div class="project-description" data-v-dba7e073${_scopeId}>${ssrInterpolate(project.description)}</div>`);
							else return [createVNode("div", { class: "project-name" }, toDisplayString(project.name), 1), createVNode("div", { class: "project-description" }, toDisplayString(project.description), 1)];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`</div><hr data-v-dba7e073>`);
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
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Projects.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Projects_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-dba7e073"]]);
//#endregion
export { Projects_default as default };
