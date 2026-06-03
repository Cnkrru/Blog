import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { defineComponent, ref, useSSRContext } from "vue";
import { useHead } from "@vueuse/head";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
//#region src/pages/LinkApply.vue?vue&type=script&setup=true&lang.ts
var LinkApply_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "LinkApply",
	__ssrInlineRender: true,
	setup(__props) {
		useHead({
			title: "友链申请 - Cnkrru's Blog",
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/links/apply"
			}]
		});
		const form = ref({
			name: "",
			url: "",
			description: "",
			email: ""
		});
		const submitted = ref(false);
		const submitting = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="center-head-card" data-v-c3b2cfc7><h2 data-v-c3b2cfc7>友链申请</h2></div><hr data-v-c3b2cfc7><div class="center-card-content" data-v-c3b2cfc7>`);
			if (submitted.value) _push(`<div class="success-card" data-v-c3b2cfc7><span class="s-icon" data-v-c3b2cfc7>✅</span><h3 data-v-c3b2cfc7>申请已提交</h3><p data-v-c3b2cfc7>我会尽快审核并添加你的友链，感谢支持！</p></div>`);
			else _push(`<form class="apply-form" data-v-c3b2cfc7><p class="form-desc" data-v-c3b2cfc7>申请友链前请先在你的网站添加本站链接：<strong data-v-c3b2cfc7>https://cnkrru.top</strong></p><label class="field" data-v-c3b2cfc7><span data-v-c3b2cfc7>网站名称</span><input${ssrRenderAttr("value", form.value.name)} type="text" required placeholder="你的网站名" data-v-c3b2cfc7></label><label class="field" data-v-c3b2cfc7><span data-v-c3b2cfc7>网站链接</span><input${ssrRenderAttr("value", form.value.url)} type="url" required placeholder="https://" data-v-c3b2cfc7></label><label class="field" data-v-c3b2cfc7><span data-v-c3b2cfc7>网站描述</span><input${ssrRenderAttr("value", form.value.description)} type="text" placeholder="简短介绍（选填）" data-v-c3b2cfc7></label><label class="field" data-v-c3b2cfc7><span data-v-c3b2cfc7>你的邮箱</span><input${ssrRenderAttr("value", form.value.email)} type="email" placeholder="用于回复通知（选填）" data-v-c3b2cfc7></label><button type="submit" class="submit-btn"${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""} data-v-c3b2cfc7>${ssrInterpolate(submitting.value ? "提交中..." : "提交申请")}</button></form>`);
			_push(`</div><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/LinkApply.vue
var _sfc_setup = LinkApply_vue_vue_type_script_setup_true_lang_default.setup;
LinkApply_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/LinkApply.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var LinkApply_default = /* @__PURE__ */ _plugin_vue_export_helper_default(LinkApply_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c3b2cfc7"]]);
//#endregion
export { LinkApply_default as default };
