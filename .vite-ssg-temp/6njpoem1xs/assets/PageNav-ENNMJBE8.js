import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, defineComponent, mergeProps, ref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
//#region src/components/p-center/PageNav.vue?vue&type=script&setup=true&lang.ts
var PageNav_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "PageNav",
	__ssrInlineRender: true,
	props: {
		type: {},
		currentPage: {},
		totalPages: {},
		categories: { default: () => [] },
		currentCategory: { default: "" }
	},
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const showCategoryDropdown = ref(false);
		const getPageLabel = (index) => {
			if (props.categories[index - 1]) return props.categories[index - 1].name;
			return `第 ${index} 页`;
		};
		const displayPages = computed(() => {
			const pages = [];
			let startPage = Math.max(1, props.currentPage - 2);
			let endPage = Math.min(props.totalPages, startPage + 4);
			if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
			for (let i = startPage; i <= endPage; i++) pages.push(i);
			return pages;
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page-nav-container" }, _attrs))} data-v-3217e8e8><div class="pagination-bar" data-v-3217e8e8><button class="nav-btn prev-btn"${ssrIncludeBooleanAttr(__props.currentPage === 1) ? " disabled" : ""} data-v-3217e8e8> &lt; 上一页 </button><div class="page-buttons" data-v-3217e8e8><!--[-->`);
			ssrRenderList(displayPages.value, (page) => {
				_push(`<button class="${ssrRenderClass(["page-btn", { active: page === __props.currentPage }])}" data-v-3217e8e8>${ssrInterpolate(getPageLabel(page))}</button>`);
			});
			_push(`<!--]--></div><div class="right-section" data-v-3217e8e8><button class="nav-btn next-btn"${ssrIncludeBooleanAttr(__props.currentPage === __props.totalPages) ? " disabled" : ""} data-v-3217e8e8> 下一页 &gt; </button>`);
			if (__props.categories.length > 0) {
				_push(`<div class="dropdown-wrapper" data-v-3217e8e8><button class="nav-btn category-btn" data-v-3217e8e8> 分类列表 <span class="dropdown-arrow" data-v-3217e8e8>▼</span></button>`);
				if (showCategoryDropdown.value) {
					_push(`<div class="dropdown-card" data-v-3217e8e8><div class="dropdown-header" data-v-3217e8e8> 快速跳转 </div><div class="dropdown-list" data-v-3217e8e8><!--[-->`);
					ssrRenderList(__props.categories, (category, index) => {
						_push(`<button class="${ssrRenderClass(["dropdown-item", { active: index + 1 === __props.currentPage }])}" data-v-3217e8e8><span class="item-number" data-v-3217e8e8>${ssrInterpolate(index + 1)}.</span><span class="item-name" data-v-3217e8e8>${ssrInterpolate(category.name)}</span>`);
						if (index + 1 === __props.currentPage) _push(`<span class="current-badge" data-v-3217e8e8>当前</span>`);
						else _push(`<!---->`);
						_push(`</button>`);
					});
					_push(`<!--]--></div></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div><div class="page-info" data-v-3217e8e8> 第 ${ssrInterpolate(__props.currentPage)} / ${ssrInterpolate(__props.totalPages)} 页 `);
			if (__props.currentCategory) _push(`<span class="current-category" data-v-3217e8e8> - ${ssrInterpolate(__props.currentCategory)}</span>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region src/components/p-center/PageNav.vue
var _sfc_setup = PageNav_vue_vue_type_script_setup_true_lang_default.setup;
PageNav_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/PageNav.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PageNav_default = /* @__PURE__ */ _plugin_vue_export_helper_default(PageNav_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-3217e8e8"]]);
//#endregion
export { PageNav_default as t };
