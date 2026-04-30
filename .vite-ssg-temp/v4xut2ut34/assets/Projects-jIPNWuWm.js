import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { a as ReadingTime_default, i as Toc_default, n as PostMenu_default, o as ContentRender_default, r as TocButton_default, s as BackToTop_default, t as Comment_default } from "./Comment-BJnDjwF7.js";
import { n as ArticleNav_default, t as SiteStats_default } from "./SiteStats-Bip4hTDL.js";
import { computed, ref, resolveComponent, useSSRContext } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useRoute } from "vue-router";
//#region src/pages/project/Projects.vue
var _sfc_main = {
	__name: "Projects",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const projectId = computed(() => route.params.id);
		const showToc = ref(false);
		const showPostMenu = ref(false);
		const project = ref(null);
		const loading = ref(true);
		const error = ref(null);
		const toc = ref([]);
		const prevProject = ref(null);
		const nextProject = ref(null);
		useHead({
			title: computed(() => project.value ? project.value.seoTitle || `${project.value.name} - 项目展示` : "项目详情 - 我的博客"),
			meta: computed(() => [
				{
					name: "description",
					content: project.value ? project.value.description || `${project.value.name} - 我的项目` : "项目详情"
				},
				{
					name: "keywords",
					content: project.value ? project.value.keywords || (project.value.tags ? project.value.tags.join(", ") : "") : "项目,博客"
				},
				{
					name: "author",
					content: project.value ? project.value.author || "Cnkrru" : "Cnkrru"
				},
				{
					name: "robots",
					content: "index, follow"
				},
				{
					property: "og:title",
					content: project.value ? project.value.seoTitle || project.value.name : "项目详情 - 我的博客"
				},
				{
					property: "og:description",
					content: project.value ? project.value.description || `${project.value.name} - 我的项目` : "项目详情"
				},
				{
					property: "og:url",
					content: `https://cnkrru.top/project/${projectId.value}`
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:image",
					content: project.value ? project.value.image || "https://cnkrru.top/default-image.jpg" : "https://cnkrru.top/default-image.jpg"
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
					content: `https://cnkrru.top/project/${projectId.value}`
				},
				{
					name: "twitter:title",
					content: project.value ? project.value.seoTitle || project.value.name : "项目详情 - 我的博客"
				},
				{
					name: "twitter:description",
					content: project.value ? project.value.description || `${project.value.name} - 我的项目` : "项目详情"
				},
				{
					name: "twitter:image",
					content: project.value ? project.value.image || "https://cnkrru.top/default-image.jpg" : "https://cnkrru.top/default-image.jpg"
				},
				{
					name: "twitter:site",
					content: "@Cnkrru"
				}
			]),
			link: computed(() => [{
				rel: "canonical",
				href: `https://cnkrru.top/project/${projectId.value}`
			}]),
			script: computed(() => project.value ? [{
				type: "application/ld+json",
				innerHTML: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "CreativeWork",
					"name": project.value.name,
					"description": project.value.description || `${project.value.name} - 我的项目`,
					"dateCreated": project.value.date,
					"creator": {
						"@type": "Person",
						"name": project.value.author || "作者名"
					},
					"image": project.value.image || "https://cnkrru.top/default-image.jpg",
					"url": `https://cnkrru.top/project/${projectId.value}`
				})
			}] : [])
		});
		const handleProjectLoaded = (loadedProject) => {
			if (loadedProject) project.value = loadedProject;
		};
		const handleLoading = (isLoading) => {
			loading.value = isLoading;
		};
		const handleError = (err) => {
			error.value = err;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Share = resolveComponent("Share");
			_push(`<!--[--><div id="site-stats-container" data-v-5258f383></div><div class="center-head-card" data-v-5258f383><h2 data-v-5258f383>${ssrInterpolate(project.value?.name || "项目详情")}</h2><div class="center-head-card-tools" data-v-5258f383>`);
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
				"onUpdate:show": ($event) => showToc.value = $event,
				toc: toc.value
			}, null, _parent));
			_push(`<hr data-v-5258f383><div class="center-card-content" data-v-5258f383>`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(ReadingTime_default, null, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(ContentRender_default, {
				key: projectId.value,
				id: projectId.value,
				type: "project",
				onContentLoaded: handleProjectLoaded,
				onLoading: handleLoading,
				onError: handleError
			}, null, _parent));
			if (!loading.value && !error.value) _push(`<hr data-v-5258f383>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(ArticleNav_default, {
				"prev-post": prevProject.value,
				"next-post": nextProject.value
			}, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-5258f383>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(_component_Share, null, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-5258f383>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<div class="read-center-card-footer" data-v-5258f383><p data-v-5258f383>© 2026 Cnkrru&#39;s Blog. All rights reserved.</p></div>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(Comment_default, null, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-5258f383>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(SiteStats_default, null, null, _parent));
			else _push(`<!---->`);
			_push(`</div><hr data-v-5258f383><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/project/Projects.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Projects_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-5258f383"]]);
//#endregion
export { Projects_default as default };
