import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { a as ReadingTime_default, i as Toc_default, n as PostMenu_default, o as ContentRender_default, r as TocButton_default, s as BackToTop_default, t as Comment_default } from "./Comment-DbUCyGM3.js";
import { computed, defineComponent, onMounted, ref, resolveComponent, useSSRContext } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useRoute, useRouter } from "vue-router";
//#region src/pages/log/Changelog.vue?vue&type=script&setup=true&lang.ts
var Changelog_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Changelog",
	__ssrInlineRender: true,
	setup(__props) {
		useRoute();
		useRouter();
		const postId = computed(() => "changelog");
		const showToc = ref(false);
		const showPostMenu = ref(false);
		const prevPost = ref(null);
		const nextPost = ref(null);
		const post = ref(null);
		const loading = ref(true);
		const error = ref(null);
		const toc = ref([]);
		ref(null);
		useHead({
			title: computed(() => "网站更新日志 - Cnkrru's Blog"),
			meta: computed(() => [
				{
					name: "description",
					content: "Cnkrru's Blog网站更新日志，记录网站的更新历史和功能变更"
				},
				{
					name: "keywords",
					content: "更新日志,网站更新,功能变更,Cnkrru"
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
					content: "https://cnkrru.top/changelog"
				},
				{
					property: "og:title",
					content: "网站更新日志 - Cnkrru's Blog"
				},
				{
					property: "og:description",
					content: "Cnkrru's Blog网站更新日志，记录网站的更新历史和功能变更"
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
					content: "https://cnkrru.top/changelog"
				},
				{
					name: "twitter:title",
					content: "网站更新日志 - Cnkrru's Blog"
				},
				{
					name: "twitter:description",
					content: "Cnkrru's Blog网站更新日志"
				}
			]),
			link: computed(() => [{
				rel: "canonical",
				href: "https://cnkrru.top/changelog"
			}])
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
		const handleTocUpdate = (newToc) => {
			toc.value = newToc;
		};
		onMounted(() => {
			scrollToTop();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Share = resolveComponent("Share");
			_push(`<!--[--><div id="site-stats-container" data-v-4964ef86></div><div class="center-head-card" data-v-4964ef86><h2 data-v-4964ef86>${ssrInterpolate(post.value?.title || "网站更新日志")}</h2><div class="center-head-card-tools" data-v-4964ef86>`);
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
			_push(`<hr data-v-4964ef86><div class="center-card-content" data-v-4964ef86>`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(ReadingTime_default, null, null, _parent));
			else _push(`<!---->`);
			_push(ssrRenderComponent(ContentRender_default, {
				id: postId.value,
				type: "post",
				onContentLoaded: handlePostLoaded,
				onLoading: handleLoading,
				onError: handleError,
				onPrevNextPosts: handlePrevNextPosts,
				"onUpdate:toc": handleTocUpdate
			}, null, _parent));
			if (!loading.value && !error.value) _push(`<hr data-v-4964ef86>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(_component_Share, null, null, _parent));
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<hr data-v-4964ef86>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(`<div class="read-center-card-footer" data-v-4964ef86><p data-v-4964ef86>© 2026 Cnkrru&#39;s Blog. All rights reserved.</p></div>`);
			else _push(`<!---->`);
			if (!loading.value && !error.value) _push(ssrRenderComponent(Comment_default, null, null, _parent));
			else _push(`<!---->`);
			_push(`</div><hr data-v-4964ef86><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/log/Changelog.vue
var _sfc_setup = Changelog_vue_vue_type_script_setup_true_lang_default.setup;
Changelog_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/log/Changelog.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Changelog_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Changelog_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4964ef86"]]);
//#endregion
export { Changelog_default as default };
