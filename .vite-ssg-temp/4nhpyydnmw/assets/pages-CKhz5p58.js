import { _ as useThemeStore } from "./stores-D945GC2p.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { defineComponent, mergeProps, onMounted, onUnmounted, ref, useSSRContext } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderTeleport } from "vue/server-renderer";
import { useRouter } from "vue-router";
//#region src/components/page-index/IndexLogo.vue
var _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "nav-logo index-log" }, _attrs))} data-v-4ade1d47><span class="logo-text" data-v-4ade1d47>Cnkrru</span><span class="logo-dot" data-v-4ade1d47>.</span></div>`);
}
var _sfc_setup$6 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/IndexLogo.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var IndexLogo_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-4ade1d47"]]);
//#endregion
//#region src/components/page-index/IndexNavbar.vue?vue&type=script&setup=true&lang.ts
var IndexNavbar_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "IndexNavbar",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		const sections = [
			{
				id: 0,
				name: "首页",
				path: "/home"
			},
			{
				id: 1,
				name: "关于",
				path: "/about"
			},
			{
				id: 2,
				name: "归档",
				path: "/archives"
			},
			{
				id: 3,
				name: "友链",
				path: "/links"
			},
			{
				id: 4,
				name: "项目",
				path: "/projects"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "nav-menu-container" }, _attrs))} data-v-10bcc3b1><ul class="nav-menu" data-v-10bcc3b1><!--[-->`);
			ssrRenderList(sections, (section, index) => {
				_push(`<li class="nav-item" data-v-10bcc3b1><a href="#" class="nav-link" data-v-10bcc3b1><span class="nav-link-text" data-v-10bcc3b1>${ssrInterpolate(section.name)}</span><span class="nav-link-underline" data-v-10bcc3b1></span></a></li>`);
			});
			_push(`<!--]--></ul></div>`);
		};
	}
});
//#endregion
//#region src/components/page-index/IndexNavbar.vue
var _sfc_setup$5 = IndexNavbar_vue_vue_type_script_setup_true_lang_default.setup;
IndexNavbar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/IndexNavbar.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var IndexNavbar_default = /* @__PURE__ */ _plugin_vue_export_helper_default(IndexNavbar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-10bcc3b1"]]);
//#endregion
//#region src/components/page-index/Heatmap.vue?vue&type=script&setup=true&lang.ts
var Heatmap_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "Heatmap",
	__ssrInlineRender: true,
	setup(__props) {
		useThemeStore();
		const selectedYear = ref((/* @__PURE__ */ new Date()).getFullYear());
		const selectedMonth = ref((/* @__PURE__ */ new Date()).getMonth() + 1);
		const isLoading = ref(false);
		const error = ref(null);
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		const years = ref(Array.from({ length: Math.max(currentYear + 2 - 2026 + 1, 3) }, (_, i) => 2026 + i));
		const months = ref([
			"一月",
			"二月",
			"三月",
			"四月",
			"五月",
			"六月",
			"七月",
			"八月",
			"九月",
			"十月",
			"十一月",
			"十二月"
		]);
		const yearData = ref([]);
		const currentMonthData = ref([]);
		const yearDropdownOpen = ref(false);
		const monthDropdownOpen = ref(false);
		const yearSelectRef = ref(null);
		const monthSelectRef = ref(null);
		const yearMenuStyle = ref({});
		const monthMenuStyle = ref({});
		const closeDropdowns = () => {
			yearDropdownOpen.value = false;
			monthDropdownOpen.value = false;
		};
		const handleClickOutside = (e) => {
			if (!yearSelectRef.value?.contains(e.target) && !monthSelectRef.value?.contains(e.target)) closeDropdowns();
		};
		const handleKeydown = (e) => {
			if (e.key === "Escape") closeDropdowns();
		};
		onMounted(async () => {
			await updateHeatmapData();
			document.addEventListener("click", handleClickOutside);
			document.addEventListener("keydown", handleKeydown);
		});
		onUnmounted(() => {
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("keydown", handleKeydown);
		});
		const fetchArticleData = async () => {
			isLoading.value = true;
			error.value = null;
			try {
				const response = await fetch("/config/search.json");
				if (!response.ok) throw new Error(`HTTP ${response.status}: 无法加载文章数据`);
				return await response.json();
			} catch (err) {
				error.value = err.message;
				console.error("加载热力图数据失败:", err);
				return [];
			} finally {
				isLoading.value = false;
			}
		};
		const buildDateIndex = (articles) => {
			const dateIndex = /* @__PURE__ */ new Set();
			articles.forEach((article) => {
				if (article.date) dateIndex.add(article.date);
			});
			return dateIndex;
		};
		const processArticleData = (articles, year) => {
			const data = [];
			const dateIndex = buildDateIndex(articles);
			for (let month = 1; month <= 12; month++) {
				const daysInMonth = new Date(year, month, 0).getDate();
				for (let day = 1; day <= daysInMonth; day++) {
					const dateString = new Date(year, month - 1, day).toISOString().split("T")[0];
					data.push({
						date: dateString,
						hasArticle: dateIndex.has(dateString),
						month
					});
				}
			}
			return data;
		};
		let cachedArticles = null;
		const updateHeatmapData = async () => {
			if (!cachedArticles) cachedArticles = await fetchArticleData();
			yearData.value = processArticleData(cachedArticles, selectedYear.value);
			currentMonthData.value = yearData.value.filter((item) => item.month === selectedMonth.value).sort((a, b) => new Date(a.date) - new Date(b.date));
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "heatmap-wrapper" }, _attrs))} data-v-4cc6c35c>`);
			if (isLoading.value) _push(`<div class="loading-overlay" data-v-4cc6c35c><div class="loading-spinner" data-v-4cc6c35c></div><div class="loading-text" data-v-4cc6c35c>加载中...</div></div>`);
			else _push(`<!---->`);
			if (error.value && !isLoading.value) _push(`<div class="error-message" data-v-4cc6c35c><p data-v-4cc6c35c>⚠️ ${ssrInterpolate(error.value)}</p><button class="retry-btn" data-v-4cc6c35c>重试</button></div>`);
			else _push(`<!---->`);
			_push(`<div class="heatmap-header" data-v-4cc6c35c><div class="custom-select" data-v-4cc6c35c><button class="${ssrRenderClass([{ active: yearDropdownOpen.value }, "select-trigger"])}"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-4cc6c35c><span class="select-value" data-v-4cc6c35c>${ssrInterpolate(selectedYear.value)}年</span><span class="${ssrRenderClass([{ rotated: yearDropdownOpen.value }, "select-arrow"])}" data-v-4cc6c35c></span></button>`);
			ssrRenderTeleport(_push, (_push) => {
				if (yearDropdownOpen.value) {
					_push(`<ul class="dropdown-menu" style="${ssrRenderStyle(yearMenuStyle.value)}" data-v-4cc6c35c><!--[-->`);
					ssrRenderList(years.value, (year) => {
						_push(`<li class="${ssrRenderClass([{ active: selectedYear.value === year }, "dropdown-item"])}" data-v-4cc6c35c>${ssrInterpolate(year)}年 </li>`);
					});
					_push(`<!--]--></ul>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div><h3 class="heatmap-title" data-v-4cc6c35c>文章发布热力图</h3><div class="custom-select" data-v-4cc6c35c><button class="${ssrRenderClass([{ active: monthDropdownOpen.value }, "select-trigger"])}"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-4cc6c35c><span class="select-value" data-v-4cc6c35c>${ssrInterpolate(months.value[selectedMonth.value - 1])}</span><span class="${ssrRenderClass([{ rotated: monthDropdownOpen.value }, "select-arrow"])}" data-v-4cc6c35c></span></button>`);
			ssrRenderTeleport(_push, (_push) => {
				if (monthDropdownOpen.value) {
					_push(`<ul class="dropdown-menu" style="${ssrRenderStyle(monthMenuStyle.value)}" data-v-4cc6c35c><!--[-->`);
					ssrRenderList(months.value, (month, index) => {
						_push(`<li class="${ssrRenderClass([{ active: selectedMonth.value === index + 1 }, "dropdown-item"])}" data-v-4cc6c35c>${ssrInterpolate(month)}</li>`);
					});
					_push(`<!--]--></ul>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div></div><div class="heatmap-content" data-v-4cc6c35c>`);
			if (currentMonthData.value.length > 0 && !error.value) {
				_push(`<div class="heatmap-grid" data-v-4cc6c35c><!--[-->`);
				ssrRenderList(currentMonthData.value, (day, index) => {
					_push(`<div class="${ssrRenderClass([[day.hasArticle ? "heatmap-has-article" : "heatmap-no-article"], "heatmap-cell"])}"${ssrRenderAttr("title", `${day.date}: ${day.hasArticle ? "有文章" : "无文章"}`)} data-v-4cc6c35c></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (!isLoading.value && !error.value && currentMonthData.value.length === 0) _push(`<div class="no-data" data-v-4cc6c35c><p data-v-4cc6c35c>暂无数据</p></div>`);
			else _push(`<!---->`);
			_push(`</div><div class="heatmap-legend" data-v-4cc6c35c><span class="legend-text" data-v-4cc6c35c>无文章</span><div class="legend-cells" data-v-4cc6c35c><div class="legend-cell no-article" data-v-4cc6c35c></div><div class="legend-cell has-article" data-v-4cc6c35c></div></div><span class="legend-text" data-v-4cc6c35c>有文章</span></div></div>`);
		};
	}
});
//#endregion
//#region src/components/page-index/Heatmap.vue
var _sfc_setup$4 = Heatmap_vue_vue_type_script_setup_true_lang_default.setup;
Heatmap_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/Heatmap.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var Heatmap_default = /* @__PURE__ */ _plugin_vue_export_helper_default(Heatmap_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-4cc6c35c"]]);
//#endregion
//#region src/components/page-index/HeroContent.vue?vue&type=script&setup=true&lang.ts
var HeroContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "HeroContent",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		const texts = ["Welcome to Cnkrru's Blog", "欢迎来到 Cnkrru 的博客"];
		let textIdx = 0;
		let charIdx = 0;
		let isDeleting = false;
		const typingText = ref("");
		let timer = null;
		function type() {
			const current = texts[textIdx];
			if (!isDeleting) {
				typingText.value = current.slice(0, charIdx + 1);
				charIdx++;
				if (charIdx === current.length) {
					timer = setTimeout(() => {
						isDeleting = true;
						type();
					}, 3e3);
					return;
				}
			} else {
				typingText.value = current.slice(0, charIdx - 1);
				charIdx--;
				if (charIdx === 0) {
					isDeleting = false;
					textIdx = (textIdx + 1) % texts.length;
				}
			}
			timer = setTimeout(type, isDeleting ? 40 : 100);
		}
		onMounted(() => {
			timer = setTimeout(type, 500);
		});
		onUnmounted(() => {
			if (timer) clearTimeout(timer);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "hero-content" }, _attrs))} data-v-5ac28f67><div class="hero-text" data-v-5ac28f67><h1 class="hero-title" data-v-5ac28f67>${ssrInterpolate(typingText.value)}<span class="cursor-blink" data-v-5ac28f67>|</span></h1></div><div class="hero-buttons" data-v-5ac28f67><button class="btn btn-primary" data-v-5ac28f67>开始阅读</button><button class="btn btn-secondary" data-v-5ac28f67>关于我</button></div><div class="hero-cards" data-v-5ac28f67><div class="glass-card" data-v-5ac28f67>`);
			_push(ssrRenderComponent(Heatmap_default, null, null, _parent));
			_push(`</div></div></main>`);
		};
	}
});
//#endregion
//#region src/components/page-index/HeroContent.vue
var _sfc_setup$3 = HeroContent_vue_vue_type_script_setup_true_lang_default.setup;
HeroContent_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/HeroContent.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var HeroContent_default = /* @__PURE__ */ _plugin_vue_export_helper_default(HeroContent_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5ac28f67"]]);
//#endregion
//#region src/components/page-index/ScrollIndicator.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "scroll-indicator" }, _attrs))} data-v-b19dd657><div class="scroll-mouse" data-v-b19dd657><div class="scroll-wheel" data-v-b19dd657></div></div><span class="scroll-text" data-v-b19dd657>SCROLL</span></div>`);
}
var _sfc_setup$2 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/ScrollIndicator.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ScrollIndicator_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-b19dd657"]]);
//#endregion
//#region src/components/page-index/NetworkParticles.vue?vue&type=script&setup=true&lang.ts
var NetworkParticles_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "NetworkParticles",
	__ssrInlineRender: true,
	setup(__props) {
		const canvas = ref(null);
		const particles = ref([]);
		let animationId = null;
		let ctx = null;
		let isDarkMode = false;
		let mouseX = null;
		let mouseY = null;
		class Particle {
			constructor(canvasWidth, canvasHeight) {
				this.x = Math.random() * canvasWidth;
				this.y = Math.random() * canvasHeight;
				this.vx = (Math.random() - .5) * 1.5;
				this.vy = (Math.random() - .5) * 1.5;
				this.radius = Math.random() * 3 + 1.5;
				this.originalVx = this.vx;
				this.originalVy = this.vy;
			}
			draw(ctx, color) {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
				ctx.fillStyle = color;
				ctx.fill();
			}
			update(canvasWidth, canvasHeight) {
				if (mouseX !== null && mouseY !== null) {
					const dx = mouseX - this.x;
					const dy = mouseY - this.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (distance < 200) {
						const attractionStrength = .02 * (1 - distance / 200);
						this.vx += dx * attractionStrength;
						this.vy += dy * attractionStrength;
						this.vx = Math.max(-2, Math.min(2, this.vx));
						this.vy = Math.max(-2, Math.min(2, this.vy));
					} else {
						this.vx += (this.originalVx - this.vx) * .05;
						this.vy += (this.originalVy - this.vy) * .05;
					}
				}
				this.x += this.vx;
				this.y += this.vy;
				if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
				if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
			}
		}
		const checkTheme = () => {
			isDarkMode = document.body.classList.contains("dark-theme");
		};
		const initParticles = (width, height) => {
			const screenArea = width * height;
			const baseParticleCount = 80;
			const densityFactor = screenArea / (1920 * 1080);
			const particleCount = Math.floor(baseParticleCount * Math.min(densityFactor, 2.5));
			particles.value = [];
			for (let i = 0; i < particleCount; i++) particles.value.push(new Particle(width, height));
		};
		const getColors = () => {
			if (isDarkMode) return {
				particle: "rgba(78, 205, 196, 0.9)",
				link: "rgba(78, 205, 196, "
			};
			else return {
				particle: "rgba(255, 142, 83, 0.9)",
				link: "rgba(255, 142, 83, "
			};
		};
		const connectParticles = (canvasWidth, canvasHeight, linkColor) => {
			const linkDistance = 180;
			const maxMouseConnections = 8;
			for (let i = 0; i < particles.value.length; i++) for (let j = i + 1; j < particles.value.length; j++) {
				const dx = particles.value[i].x - particles.value[j].x;
				const dy = particles.value[i].y - particles.value[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < linkDistance) {
					ctx.beginPath();
					ctx.strokeStyle = `${linkColor}${1 - distance / linkDistance})`;
					ctx.lineWidth = 1;
					ctx.moveTo(particles.value[i].x, particles.value[i].y);
					ctx.lineTo(particles.value[j].x, particles.value[j].y);
					ctx.stroke();
				}
			}
			if (mouseX !== null && mouseY !== null) {
				const mouseConnections = [];
				for (let i = 0; i < particles.value.length; i++) {
					const dx = particles.value[i].x - mouseX;
					const dy = particles.value[i].y - mouseY;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (distance < linkDistance) mouseConnections.push({
						index: i,
						distance
					});
				}
				mouseConnections.sort((a, b) => a.distance - b.distance);
				const connectionsToDraw = mouseConnections.slice(0, maxMouseConnections);
				for (const conn of connectionsToDraw) {
					ctx.beginPath();
					ctx.strokeStyle = `${linkColor}${1 - conn.distance / linkDistance})`;
					ctx.lineWidth = 1.5;
					ctx.moveTo(particles.value[conn.index].x, particles.value[conn.index].y);
					ctx.lineTo(mouseX, mouseY);
					ctx.stroke();
				}
			}
		};
		const animate = (width, height) => {
			checkTheme();
			const colors = getColors();
			ctx.clearRect(0, 0, width, height);
			particles.value.forEach((particle) => {
				particle.update(width, height);
				particle.draw(ctx, colors.particle);
			});
			connectParticles(width, height, colors.link);
			animationId = requestAnimationFrame(() => animate(width, height));
		};
		const resizeCanvas = () => {
			if (!canvas.value) return;
			const width = window.innerWidth;
			const height = window.innerHeight;
			canvas.value.width = width;
			canvas.value.height = height;
			initParticles(width, height);
		};
		const handleMouseMove = (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};
		const handleTouchMove = (e) => {
			if (e.touches.length > 0) {
				mouseX = e.touches[0].clientX;
				mouseY = e.touches[0].clientY;
				e.preventDefault();
			}
		};
		const handleMouseLeave = () => {
			mouseX = null;
			mouseY = null;
		};
		const handleTouchEnd = () => {
			mouseX = null;
			mouseY = null;
		};
		let observer = null;
		onMounted(() => {
			if (canvas.value) {
				ctx = canvas.value.getContext("2d");
				checkTheme();
				resizeCanvas();
				animate(canvas.value.width, canvas.value.height);
				window.addEventListener("resize", resizeCanvas);
				window.addEventListener("mousemove", handleMouseMove);
				window.addEventListener("mouseleave", handleMouseLeave);
				window.addEventListener("touchmove", handleTouchMove, { passive: false });
				window.addEventListener("touchend", handleTouchEnd);
				if (typeof MutationObserver !== "undefined") {
					observer = new MutationObserver((mutations) => {
						mutations.forEach((mutation) => {
							if (mutation.attributeName === "class") checkTheme();
						});
					});
					observer.observe(document.body, { attributes: true });
				}
			}
		});
		onUnmounted(() => {
			if (animationId) cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseleave", handleMouseLeave);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("touchend", handleTouchEnd);
			if (observer) observer.disconnect();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<canvas${ssrRenderAttrs(mergeProps({
				ref_key: "canvas",
				ref: canvas,
				class: "network-particles"
			}, _attrs))} data-v-c672a34c></canvas>`);
		};
	}
});
//#endregion
//#region src/components/page-index/NetworkParticles.vue
var _sfc_setup$1 = NetworkParticles_vue_vue_type_script_setup_true_lang_default.setup;
NetworkParticles_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/NetworkParticles.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var NetworkParticles_default = /* @__PURE__ */ _plugin_vue_export_helper_default(NetworkParticles_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c672a34c"]]);
//#endregion
//#region src/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "hero-container" }, _attrs))} data-v-e3b09bb0>`);
			_push(ssrRenderComponent(NetworkParticles_default, null, null, _parent));
			_push(`<header class="index-header" data-v-e3b09bb0>`);
			_push(ssrRenderComponent(IndexLogo_default, null, null, _parent));
			_push(ssrRenderComponent(IndexNavbar_default, null, null, _parent));
			_push(`</header>`);
			_push(ssrRenderComponent(HeroContent_default, null, null, _parent));
			_push(ssrRenderComponent(ScrollIndicator_default, null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = /* @__PURE__ */ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e3b09bb0"]]);
//#endregion
export { pages_default as default };
