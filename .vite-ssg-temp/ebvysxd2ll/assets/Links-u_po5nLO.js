import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as PageNav_default } from "./PageNav-ENNMJBE8.js";
import { createTextVNode, defineComponent, onMounted, reactive, ref, resolveComponent, useSSRContext, withCtx } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region src/pages/Links.vue?vue&type=script&setup=true&lang.ts
var Links_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
		const linkStatus = reactive({});
		const checkedCount = ref(0);
		const totalLinks = ref(0);
		async function checkLink(link) {
			const id = link.id;
			linkStatus[id] = "checking";
			try {
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 8e3);
				await fetch(link.url, {
					mode: "no-cors",
					signal: controller.signal
				});
				clearTimeout(timeout);
				linkStatus[id] = "online";
			} catch {
				linkStatus[id] = "offline";
			}
			checkedCount.value++;
		}
		function checkAllLinks() {
			totalLinks.value = links.value.length;
			checkedCount.value = 0;
			links.value.forEach((link) => {
				linkStatus[link.id] = "checking";
				checkLink(link);
			});
		}
		const loadLinks = async () => {
			try {
				const response = await fetch("/config/links.json");
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				links.value = await response.json();
				categorizeLinks();
				checkAllLinks();
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
		const onlineCount = () => Object.values(linkStatus).filter((s) => s === "online").length;
		const offlineCount = () => Object.values(linkStatus).filter((s) => s === "offline").length;
		onMounted(() => {
			loadLinks();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_RouterLink = resolveComponent("RouterLink");
			_push(`<!--[--><div id="site-stats-container" data-v-f076f3d3></div><div class="center-head-card" data-v-f076f3d3><h2 data-v-f076f3d3>友情链接</h2><div class="status-summary" data-v-f076f3d3><span class="status-dot online" data-v-f076f3d3></span>${ssrInterpolate(onlineCount())} 在线 <span class="status-dot offline" data-v-f076f3d3></span>${ssrInterpolate(offlineCount())} 离线 <span class="status-dot checking" data-v-f076f3d3></span>${ssrInterpolate(totalLinks.value - checkedCount.value)} 检测中 </div></div><hr data-v-f076f3d3><div class="center-card-content" data-v-f076f3d3>`);
			if (getCurrentCategory()) {
				_push(`<div class="links-content" data-v-f076f3d3><!--[-->`);
				ssrRenderList(getCurrentCategory().links, (link) => {
					_push(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener noreferrer" class="${ssrRenderClass([{ offline: linkStatus[link.id] === "offline" }, "link-card"])}" data-v-f076f3d3><div class="link-name" data-v-f076f3d3>${ssrInterpolate(link.name)} <span class="${ssrRenderClass([linkStatus[link.id] || "checking", "link-status-icon"])}" data-v-f076f3d3></span></div><div class="link-description" data-v-f076f3d3>${ssrInterpolate(link.description)}</div><div class="${ssrRenderClass([linkStatus[link.id] || "checking", "link-status-text"])}" data-v-f076f3d3>${ssrInterpolate(linkStatus[link.id] === "online" ? "在线" : linkStatus[link.id] === "offline" ? "无法访问" : "检测中...")}</div></a>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
			_push(`</div><hr data-v-f076f3d3><div class="apply-link-wrap" data-v-f076f3d3>`);
			_push(ssrRenderComponent(_component_RouterLink, {
				to: "/links/apply",
				class: "apply-link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`📬 申请友链`);
					else return [createTextVNode("📬 申请友链")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
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
});
//#endregion
//#region src/pages/Links.vue
var _sfc_setup = Links_vue_vue_type_script_setup_true_lang_default.setup;
Links_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Links.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Links_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Links_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f076f3d3"]]);
//#endregion
export { Links_default as default };
