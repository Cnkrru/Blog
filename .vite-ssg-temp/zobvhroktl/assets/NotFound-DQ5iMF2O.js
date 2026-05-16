import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { defineComponent, mergeProps, onMounted, onUnmounted, ref, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { useRouter } from "vue-router";
//#region src/pages/NotFound.vue?vue&type=script&setup=true&lang.ts
var NotFound_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "NotFound",
	__ssrInlineRender: true,
	setup(__props) {
		const router = useRouter();
		const countdown = ref(10);
		let timer = null;
		onMounted(() => {
			timer = setInterval(() => {
				countdown.value--;
				if (countdown.value <= 0) router.push("/");
			}, 1e3);
		});
		onUnmounted(() => {
			if (timer) clearInterval(timer);
		});
		const floatingDots = Array.from({ length: 20 }, (_, i) => ({
			id: i,
			style: {
				left: `${Math.random() * 100}%`,
				top: `${Math.random() * 100}%`,
				animationDelay: `${Math.random() * 3}s`,
				animationDuration: `${3 + Math.random() * 4}s`,
				width: `${4 + Math.random() * 8}px`,
				height: `${4 + Math.random() * 8}px`
			}
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "not-found-wrapper" }, _attrs))} data-v-193bee4f><div class="floating-dots" data-v-193bee4f><!--[-->`);
			ssrRenderList(unref(floatingDots), (dot) => {
				_push(`<span class="dot" style="${ssrRenderStyle(dot.style)}" data-v-193bee4f></span>`);
			});
			_push(`<!--]--></div><div class="not-found-content" data-v-193bee4f><div class="error-code" data-v-193bee4f><span class="digit" data-v-193bee4f>4</span><span class="digit zero" data-v-193bee4f>0</span><span class="digit" data-v-193bee4f>4</span></div><div class="glitch-text" data-v-193bee4f>页面不存在</div><p class="sub-text" data-v-193bee4f> 你来到了没有知识的荒原... </p><div class="actions" data-v-193bee4f><button class="back-btn" data-v-193bee4f><span class="btn-icon" data-v-193bee4f>🏠</span> 返回首页 </button></div><p class="countdown-text" data-v-193bee4f>${ssrInterpolate(countdown.value)} 秒后自动返回首页 </p></div></div>`);
		};
	}
});
//#endregion
//#region src/pages/NotFound.vue
var _sfc_setup = NotFound_vue_vue_type_script_setup_true_lang_default.setup;
NotFound_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/NotFound.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var NotFound_default = /* @__PURE__ */ _plugin_vue_export_helper_default(NotFound_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-193bee4f"]]);
//#endregion
export { NotFound_default as default };
