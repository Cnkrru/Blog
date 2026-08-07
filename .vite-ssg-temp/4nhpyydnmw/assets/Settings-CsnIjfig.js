import { _ as useThemeStore } from "./stores-D945GC2p.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, defineComponent, useSSRContext } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
//#region src/pages/Settings.vue?vue&type=script&setup=true&lang.ts
var Settings_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Settings",
	__ssrInlineRender: true,
	setup(__props) {
		const themeStore = useThemeStore();
		const currentStyle = computed(() => themeStore.currentStyle);
		const currentLayout = computed(() => themeStore.currentLayout);
		const glassAlpha = computed(() => themeStore.glassAlpha);
		useHead({
			title: "设置 - Cnkrru's Blog",
			meta: [{
				name: "description",
				content: "主题与风格设置"
			}, {
				name: "robots",
				content: "noindex, nofollow"
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="center-head-card" data-v-dac06fc4><h2 data-v-dac06fc4>设置</h2></div><hr data-v-dac06fc4><div class="center-card-content settings-content" data-v-dac06fc4><section class="setting-block" data-v-dac06fc4><h3 class="setting-title" data-v-dac06fc4>风格方案</h3><div class="option-row" data-v-dac06fc4><button class="${ssrRenderClass([{ active: currentStyle.value === "ink" }, "style-opt"])}" data-v-dac06fc4><span class="opt-name" data-v-dac06fc4>水墨风</span><span class="opt-desc" data-v-dac06fc4>宣纸米白 · 朱砂点睛</span></button><button class="${ssrRenderClass([{ active: currentStyle.value === "sakura" }, "style-opt"])}" data-v-dac06fc4><span class="opt-name" data-v-dac06fc4>樱粉风</span><span class="opt-desc" data-v-dac06fc4>粉色基调 · 梦幻渐变</span></button></div></section><section class="setting-block" data-v-dac06fc4><h3 class="setting-title" data-v-dac06fc4>布局模式</h3><div class="option-row" data-v-dac06fc4><button class="${ssrRenderClass([{ active: currentLayout.value === "card" }, "style-opt"])}" data-v-dac06fc4><span class="opt-name" data-v-dac06fc4>卡片式</span><span class="opt-desc" data-v-dac06fc4>区域之间留有间隔</span></button><button class="${ssrRenderClass([{ active: currentLayout.value === "compact" }, "style-opt"])}" data-v-dac06fc4><span class="opt-name" data-v-dac06fc4>无空隙</span><span class="opt-desc" data-v-dac06fc4>四大区域紧贴相连</span></button></div></section><section class="setting-block" data-v-dac06fc4><h3 class="setting-title" data-v-dac06fc4>玻璃风透明度</h3><div class="slider-row" data-v-dac06fc4><input class="glass-slider" type="range" min="0.2" max="1" step="0.02"${ssrRenderAttr("value", glassAlpha.value)} data-v-dac06fc4><span class="slider-value" data-v-dac06fc4>${ssrInterpolate(Math.round(glassAlpha.value * 100))}%</span></div><p class="slider-hint" data-v-dac06fc4>越低越通透（MAC 玻璃感越强），越高越实色</p></section><p class="setting-tip" data-v-dac06fc4>设置会自动保存，刷新后依然生效。</p></div><!--]-->`);
		};
	}
});
//#endregion
//#region src/pages/Settings.vue
var _sfc_setup = Settings_vue_vue_type_script_setup_true_lang_default.setup;
Settings_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Settings.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Settings_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Settings_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-dac06fc4"]]);
//#endregion
export { Settings_default as default };
