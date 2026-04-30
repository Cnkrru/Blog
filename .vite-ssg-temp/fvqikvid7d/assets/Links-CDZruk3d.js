import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as PageNav_default } from "./PageNav-CLio7YyF.js";
import { onMounted, ref, useSSRContext } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region src/pages/Links.vue
var _sfc_main = {
	__name: "Links",
	__ssrInlineRender: true,
	setup(__props) {
		useHead({
			title: "友链 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "Cnkrru's Blog推荐的有趣网站和资源链接，包括技术博客、工具网站和其他优秀项目"
				},
				{
					name: "keywords",
					content: "友链,链接,推荐,资源网站,技术博客"
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
					content: "https://cnkrru.top/links"
				},
				{
					property: "og:title",
					content: "友链 - Cnkrru's Blog"
				},
				{
					property: "og:description",
					content: "Cnkrru's Blog推荐的有趣网站和资源链接"
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
					content: "https://cnkrru.top/links"
				},
				{
					name: "twitter:title",
					content: "友链 - Cnkrru's Blog"
				},
				{
					name: "twitter:description",
					content: "Cnkrru's Blog推荐的有趣网站和资源链接"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/links"
			}]
		});
		const links = ref([]);
		const categories = ref([]);
		const currentPage = ref(1);
		const totalPages = ref(1);
		const loadLinks = async () => {
			try {
				const response = await fetch("/config/links.json");
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				links.value = await response.json();
				categorizeLinks();
			} catch (error) {
				console.error("加载链接失败:", error);
				links.value = [];
			}
		};
		const categorizeLinks = () => {
			const categoryMap = {};
			links.value.forEach((link) => {
				const category = link.category;
				if (!categoryMap[category]) categoryMap[category] = [];
				categoryMap[category].push(link);
			});
			categories.value = Object.keys(categoryMap).map((category) => {
				return {
					name: category,
					links: categoryMap[category].sort((a, b) => {
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
			loadLinks();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div id="site-stats-container" data-v-2af58b73></div><div class="center-head-card" data-v-2af58b73><h2 data-v-2af58b73>友情链接</h2></div><hr data-v-2af58b73><div class="center-card-content" data-v-2af58b73>`);
			if (getCurrentCategory()) {
				_push(`<div class="links-content" data-v-2af58b73><!--[-->`);
				ssrRenderList(getCurrentCategory().links, (link) => {
					_push(`<a${ssrRenderAttr("href", link.url)} target="_blank" class="link-card" data-v-2af58b73><div class="link-name" data-v-2af58b73>${ssrInterpolate(link.name)}</div><div class="link-description" data-v-2af58b73>${ssrInterpolate(link.description)}</div></a>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`</div><hr data-v-2af58b73>`);
			_push(ssrRenderComponent(PageNav_default, {
				type: "links",
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Links.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Links_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-2af58b73"]]);
//#endregion
export { Links_default as default };
