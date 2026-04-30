import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { useSSRContext } from "vue";
import { useRouter } from "vue-router";
//#region src/pages/NotFound.vue
var _sfc_main = {
	__name: "NotFound",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="center-card-content" data-v-292f1ec1><div class="lose-center-card-content" data-v-292f1ec1><div class="lose-center-content" data-v-292f1ec1><h1 data-v-292f1ec1>404 页面不存在</h1><p data-v-292f1ec1>您访问的页面不存在，请检查URL是否正确</p><button class="back-home-btn" data-v-292f1ec1>返回首页</button></div></div></div><hr data-v-292f1ec1><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/NotFound.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var NotFound_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-292f1ec1"]]);
//#endregion
export { NotFound_default as default };
