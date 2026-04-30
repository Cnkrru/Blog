import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, mergeProps, ref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import "vue-router";
//#region src/components/p-center/PageNav.vue
var _sfc_main = {
	__name: "PageNav",
	__ssrInlineRender: true,
	props: {
		type: {
			type: String,
			required: true,
			validator: (value) => [
				"posts",
				"tools",
				"projects",
				"links"
			].includes(value)
		},
		currentPage: {
			type: Number,
			required: true
		},
		totalPages: {
			type: Number,
			required: true
		},
		categories: {
			type: Array,
			default: () => []
		},
		currentCategory: {
			type: String,
			default: ""
		}
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page-nav-container" }, _attrs))} data-v-8b59ff84><div class="pagination-bar" data-v-8b59ff84><button class="nav-btn prev-btn"${ssrIncludeBooleanAttr(__props.currentPage === 1) ? " disabled" : ""} data-v-8b59ff84> &lt; 上一页 </button><div class="page-buttons" data-v-8b59ff84><!--[-->`);
			ssrRenderList(displayPages.value, (page) => {
				_push(`<button class="${ssrRenderClass(["page-btn", { active: page === __props.currentPage }])}" data-v-8b59ff84>${ssrInterpolate(getPageLabel(page))}</button>`);
			});
			_push(`<!--]--></div><div class="right-section" data-v-8b59ff84><button class="nav-btn next-btn"${ssrIncludeBooleanAttr(__props.currentPage === __props.totalPages) ? " disabled" : ""} data-v-8b59ff84> 下一页 &gt; </button>`);
			if (__props.categories.length > 0) {
				_push(`<div class="dropdown-wrapper" data-v-8b59ff84><button class="nav-btn category-btn" data-v-8b59ff84> 分类列表 <span class="dropdown-arrow" data-v-8b59ff84>▼</span></button>`);
				if (showCategoryDropdown.value) {
					_push(`<div class="dropdown-card" data-v-8b59ff84><div class="dropdown-header" data-v-8b59ff84> 快速跳转 </div><div class="dropdown-list" data-v-8b59ff84><!--[-->`);
					ssrRenderList(__props.categories, (category, index) => {
						_push(`<button class="${ssrRenderClass(["dropdown-item", { active: index + 1 === __props.currentPage }])}" data-v-8b59ff84><span class="item-number" data-v-8b59ff84>${ssrInterpolate(index + 1)}.</span><span class="item-name" data-v-8b59ff84>${ssrInterpolate(category.name)}</span>`);
						if (index + 1 === __props.currentPage) _push(`<span class="current-badge" data-v-8b59ff84>当前</span>`);
						else _push(`<!---->`);
						_push(`</button>`);
					});
					_push(`<!--]--></div></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div><div class="page-info" data-v-8b59ff84> 第 ${ssrInterpolate(__props.currentPage)} / ${ssrInterpolate(__props.totalPages)} 页 `);
			if (__props.currentCategory) _push(`<span class="current-category" data-v-8b59ff84> - ${ssrInterpolate(__props.currentCategory)}</span>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/p-center/PageNav.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var PageNav_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-8b59ff84"]]);
//#endregion
export { PageNav_default as t };
