import { _ as useUserStore, y as useThemeStore } from "./stores-CqGIWUfC.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { computed, mergeProps, onMounted, onUnmounted, ref, unref, useSSRContext, watch } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { useRouter } from "vue-router";
//#region src/components/page-index/IndexLogo.vue
var _sfc_main$9 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "nav-logo index-log" }, _attrs))} data-v-dc5fce94><span class="logo-text" data-v-dc5fce94>Cnkrru</span><span class="logo-dot" data-v-dc5fce94>.</span></div>`);
}
var _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/IndexLogo.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var IndexLogo_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$9, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-dc5fce94"]]);
//#endregion
//#region src/components/page-index/IndexNavbar.vue
var _sfc_main$8 = {
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
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "nav-menu-container" }, _attrs))} data-v-2e8f57b4><ul class="nav-menu" data-v-2e8f57b4><!--[-->`);
			ssrRenderList(sections, (section, index) => {
				_push(`<li class="nav-item" data-v-2e8f57b4><a href="#" class="nav-link" data-v-2e8f57b4><span class="nav-link-text" data-v-2e8f57b4>${ssrInterpolate(section.name)}</span><span class="nav-link-underline" data-v-2e8f57b4></span></a></li>`);
			});
			_push(`<!--]--></ul></div>`);
		};
	}
};
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/IndexNavbar.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var IndexNavbar_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$8, [["__scopeId", "data-v-2e8f57b4"]]);
//#endregion
//#region src/components/page-index/Heatmap.vue
var _sfc_main$7 = {
	__name: "Heatmap",
	__ssrInlineRender: true,
	setup(__props) {
		const themeStore = useThemeStore();
		const isDarkMode = computed(() => themeStore.isDark);
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
		onMounted(async () => {
			await updateHeatmapData();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "heatmap-wrapper" }, _attrs))} data-v-bf134283>`);
			if (isLoading.value) _push(`<div class="loading-overlay" data-v-bf134283><div class="loading-spinner" data-v-bf134283></div><div class="loading-text" data-v-bf134283>加载中...</div></div>`);
			else _push(`<!---->`);
			if (error.value && !isLoading.value) _push(`<div class="error-message" data-v-bf134283><p data-v-bf134283>⚠️ ${ssrInterpolate(error.value)}</p><button class="retry-btn" data-v-bf134283>重试</button></div>`);
			else _push(`<!---->`);
			_push(`<div class="heatmap-header" data-v-bf134283><div class="year-selector" data-v-bf134283><select${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-bf134283><!--[-->`);
			ssrRenderList(years.value, (year) => {
				_push(`<option${ssrRenderAttr("value", year)} data-v-bf134283${ssrIncludeBooleanAttr(Array.isArray(selectedYear.value) ? ssrLooseContain(selectedYear.value, year) : ssrLooseEqual(selectedYear.value, year)) ? " selected" : ""}>${ssrInterpolate(year)}年 </option>`);
			});
			_push(`<!--]--></select></div><h3 class="heatmap-title" data-v-bf134283>文章发布热力图</h3><div class="month-selector" data-v-bf134283><select${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-bf134283><!--[-->`);
			ssrRenderList(months.value, (month, index) => {
				_push(`<option${ssrRenderAttr("value", index + 1)} data-v-bf134283${ssrIncludeBooleanAttr(Array.isArray(selectedMonth.value) ? ssrLooseContain(selectedMonth.value, index + 1) : ssrLooseEqual(selectedMonth.value, index + 1)) ? " selected" : ""}>${ssrInterpolate(month)}</option>`);
			});
			_push(`<!--]--></select></div></div><div class="heatmap-content" data-v-bf134283>`);
			if (currentMonthData.value.length > 0 && !error.value) {
				_push(`<div class="heatmap-grid" data-v-bf134283><!--[-->`);
				ssrRenderList(currentMonthData.value, (day, index) => {
					_push(`<div class="${ssrRenderClass([[day.hasArticle ? isDarkMode.value ? "heatmap-has-article-dark" : "heatmap-has-article" : isDarkMode.value ? "heatmap-no-article-dark" : "heatmap-no-article"], "heatmap-cell"])}"${ssrRenderAttr("title", `${day.date}: ${day.hasArticle ? "有文章" : "无文章"}`)} data-v-bf134283></div>`);
				});
				_push(`<!--]--></div>`);
			} else if (!isLoading.value && !error.value && currentMonthData.value.length === 0) _push(`<div class="no-data" data-v-bf134283><p data-v-bf134283>暂无数据</p></div>`);
			else _push(`<!---->`);
			_push(`</div><div class="heatmap-legend" data-v-bf134283><span class="legend-text" data-v-bf134283>无文章</span><div class="legend-cells" data-v-bf134283><div class="${ssrRenderClass([isDarkMode.value ? "no-article-dark" : "no-article", "legend-cell"])}" data-v-bf134283></div><div class="${ssrRenderClass([isDarkMode.value ? "has-article-dark" : "has-article", "legend-cell"])}" data-v-bf134283></div></div><span class="legend-text" data-v-bf134283>有文章</span></div></div>`);
		};
	}
};
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/Heatmap.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var Heatmap_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$7, [["__scopeId", "data-v-bf134283"]]);
//#endregion
//#region src/components/page-index/RealTimeClock.vue
var _sfc_main$6 = {
	__name: "RealTimeClock",
	__ssrInlineRender: true,
	props: { size: {
		type: String,
		default: "medium",
		validator: (value) => [
			"small",
			"medium",
			"large"
		].includes(value)
	} },
	setup(__props) {
		const hours = ref("00");
		const minutes = ref("00");
		const seconds = ref("00");
		let timer = null;
		const updateTime = () => {
			const now = /* @__PURE__ */ new Date();
			hours.value = String(now.getHours()).padStart(2, "0");
			minutes.value = String(now.getMinutes()).padStart(2, "0");
			seconds.value = String(now.getSeconds()).padStart(2, "0");
		};
		onMounted(() => {
			updateTime();
			timer = setInterval(updateTime, 1e3);
		});
		onUnmounted(() => {
			if (timer) clearInterval(timer);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["real-time-clock", `clock-${__props.size}`] }, _attrs))} data-v-a1f8cb08><div class="clock-card" data-v-a1f8cb08><div class="card-number" data-v-a1f8cb08>${ssrInterpolate(hours.value)}</div><div class="card-label" data-v-a1f8cb08>时</div></div><div class="clock-separator" data-v-a1f8cb08>:</div><div class="clock-card" data-v-a1f8cb08><div class="card-number" data-v-a1f8cb08>${ssrInterpolate(minutes.value)}</div><div class="card-label" data-v-a1f8cb08>分</div></div><div class="clock-separator" data-v-a1f8cb08>:</div><div class="clock-card" data-v-a1f8cb08><div class="card-number" data-v-a1f8cb08>${ssrInterpolate(seconds.value)}</div><div class="card-label" data-v-a1f8cb08>秒</div></div></div>`);
		};
	}
};
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/RealTimeClock.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var RealTimeClock_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$6, [["__scopeId", "data-v-a1f8cb08"]]);
//#endregion
//#region src/components/page-index/VisitorMap.vue
var _sfc_main$5 = {
	__name: "VisitorMap",
	__ssrInlineRender: true,
	setup(__props) {
		const chartRef = ref(null);
		const isLoading = ref(true);
		const userStore = useUserStore();
		const visitorCount = computed(() => userStore.visitorCount);
		computed(() => userStore.visitorCities);
		let echarts = null;
		let chart = null;
		const loadEcharts = async () => {
			return new Promise((resolve, reject) => {
				if (window.echarts) {
					echarts = window.echarts;
					resolve();
					return;
				}
				const script = document.createElement("script");
				script.src = "https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js";
				script.onload = () => {
					echarts = window.echarts;
					resolve();
				};
				script.onerror = reject;
				document.head.appendChild(script);
			});
		};
		const loadChinaMap = async () => {
			return new Promise(async (resolve, reject) => {
				try {
					const response = await fetch("https://cdn.jsdelivr.net/npm/echarts/map/json/china.json");
					if (!response.ok) throw new Error("Network response was not ok");
					const chinaGeoJson = await response.json();
					echarts.registerMap("china", chinaGeoJson);
					resolve();
				} catch (error) {
					console.warn("Failed to load China map data:", error);
					resolve();
				}
			});
		};
		const getChartColors = () => {
			const isDark = document.body.classList.contains("dark-theme");
			return {
				borderColor: isDark ? "rgba(79, 195, 247, 0.6)" : "rgba(78, 205, 196, 0.6)",
				areaColor: isDark ? "rgba(79, 195, 247, 0.2)" : "rgba(78, 205, 196, 0.2)",
				shadowColor: isDark ? "rgba(79, 195, 247, 0.5)" : "rgba(78, 205, 196, 0.5)",
				scatterColor: isDark ? "#4fc3f7" : "#ff6b6b",
				lineColor: isDark ? "#4fc3f7" : "#4ecdc4",
				textColor: isDark ? "#e0e0e0" : "#333"
			};
		};
		const initChart = () => {
			if (!chartRef.value || !echarts) return;
			chart = echarts.init(chartRef.value);
			const colors = getChartColors();
			const option = {
				backgroundColor: "transparent",
				geo: {
					map: "china",
					roam: true,
					zoom: 1.2,
					label: {
						show: false,
						color: colors.textColor
					},
					itemStyle: {
						borderColor: colors.borderColor,
						borderWidth: 1,
						areaColor: colors.areaColor,
						shadowColor: colors.shadowColor,
						shadowBlur: 20
					},
					emphasis: {
						label: {
							show: true,
							color: colors.textColor
						},
						itemStyle: { areaColor: colors.areaColor.replace("0.2", "0.4") }
					}
				},
				series: [{
					name: "访客",
					type: "scatter",
					coordinateSystem: "geo",
					data: [],
					symbolSize: 12,
					itemStyle: {
						color: colors.scatterColor,
						shadowBlur: 10,
						shadowColor: colors.scatterColor + "80"
					},
					emphasis: { scale: 1.5 }
				}, {
					name: "飞线",
					type: "lines",
					coordinateSystem: "geo",
					data: [],
					lineStyle: {
						color: colors.lineColor,
						width: 2,
						opacity: .6,
						curveness: .3
					},
					effect: {
						show: true,
						period: 3,
						trailLength: .3,
						color: colors.lineColor,
						symbol: "circle",
						symbolSize: 3
					}
				}]
			};
			chart.setOption(option);
			isLoading.value = false;
			if (typeof MutationObserver !== "undefined") {
				const observer = new MutationObserver(() => {
					if (chart) {
						const newColors = getChartColors();
						chart.setOption({
							geo: {
								label: { color: newColors.textColor },
								itemStyle: {
									borderColor: newColors.borderColor,
									areaColor: newColors.areaColor,
									shadowColor: newColors.shadowColor
								}
							},
							series: [{ itemStyle: {
								color: newColors.scatterColor,
								shadowColor: newColors.scatterColor + "80"
							} }, {
								lineStyle: { color: newColors.lineColor },
								effect: { color: newColors.lineColor }
							}]
						});
					}
				});
				observer.observe(document.body, {
					attributes: true,
					attributeFilter: ["class"]
				});
				onUnmounted(() => observer.disconnect());
			}
		};
		const fetchVisitorLocation = async () => {
			const locationData = await userStore.fetchUserLocation();
			if (locationData && locationData.lon !== null) {
				updateChart();
				addFlyLine();
			}
		};
		const updateChart = () => {
			if (!chart) return;
			chart.setOption({ series: [{
				name: "访客",
				data: userStore.visitorCities
			}] });
		};
		const addFlyLine = () => {
			if (!chart || userStore.visitorCities.length < 1) return;
			const endCity = userStore.visitorCities[userStore.visitorCities.length - 1];
			if (!endCity.value) return;
			const startCity = {
				name: "随机起点",
				value: [Math.random() * 40 + 100, Math.random() * 30 + 20]
			};
			chart.setOption({ series: [{ name: "访客" }, {
				name: "飞线",
				data: [{
					fromName: startCity.name,
					toName: endCity.name,
					coords: [startCity.value, endCity.value]
				}]
			}] });
			setTimeout(() => {
				if (!chart) return;
				chart.setOption({ series: [{ name: "访客" }, {
					name: "飞线",
					data: []
				}] });
			}, 3e3);
		};
		const handleResize = () => {
			if (chart) chart.resize();
		};
		onMounted(async () => {
			await loadEcharts();
			await loadChinaMap();
			initChart();
			fetchVisitorLocation();
			window.addEventListener("resize", handleResize);
		});
		onUnmounted(() => {
			window.removeEventListener("resize", handleResize);
			if (chart) chart.dispose();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "visitor-map" }, _attrs))} data-v-ffa57c03><div class="map-info-container" data-v-ffa57c03>`);
			if (isLoading.value) _push(`<div class="loading-overlay" data-v-ffa57c03><div class="loading-text" data-v-ffa57c03>地图加载中...</div></div>`);
			else _push(`<!---->`);
			_push(`<div class="map-info" data-v-ffa57c03><h4 data-v-ffa57c03>访客地图</h4><p data-v-ffa57c03>总访客: ${ssrInterpolate(visitorCount.value)}</p></div></div><div class="chart-container" data-v-ffa57c03></div></div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/VisitorMap.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var VisitorMap_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$5, [["__scopeId", "data-v-ffa57c03"]]);
//#endregion
//#region src/components/page-index/HeroContent.vue
var _sfc_main$4 = {
	__name: "HeroContent",
	__ssrInlineRender: true,
	setup(__props) {
		useRouter();
		function useTyping(options = {}) {
			const { text = "Welcome to Cnkrru's Blog", typingSpeed = 150, deletingSpeed = 80, pauseTime = 2e3, loop = true, randomSpeed = true } = options;
			const typingText = ref("");
			const typingIndex = ref(0);
			const isDeleting = ref(false);
			const isPaused = ref(false);
			const currentText = ref(text);
			let animationFrameId = null;
			let lastTime = 0;
			let isPausing = false;
			const getRandomSpeed = (baseSpeed) => {
				if (!randomSpeed) return baseSpeed;
				return baseSpeed * (.8 + Math.random() * .4);
			};
			const typeEffect = (timestamp) => {
				if (isPaused.value) {
					animationFrameId = requestAnimationFrame(typeEffect);
					return;
				}
				if (!lastTime) lastTime = timestamp;
				const elapsed = timestamp - lastTime;
				if (isPausing) {
					if (elapsed >= pauseTime) {
						isPausing = false;
						isDeleting.value = true;
						lastTime = timestamp;
					}
				} else if (!isDeleting.value) {
					if (elapsed >= getRandomSpeed(typingSpeed)) {
						if (typingIndex.value < currentText.value.length) {
							typingText.value += currentText.value.charAt(typingIndex.value);
							typingIndex.value++;
							lastTime = timestamp;
						} else if (loop) {
							isPausing = true;
							lastTime = timestamp;
						}
					}
				} else if (elapsed >= getRandomSpeed(deletingSpeed)) {
					if (typingIndex.value > 0) {
						typingText.value = currentText.value.substring(0, typingIndex.value - 1);
						typingIndex.value--;
						lastTime = timestamp;
					} else if (loop) {
						isDeleting.value = false;
						lastTime = timestamp;
					}
				}
				animationFrameId = requestAnimationFrame(typeEffect);
			};
			const start = () => {
				isPaused.value = false;
				if (!animationFrameId) {
					lastTime = 0;
					animationFrameId = requestAnimationFrame(typeEffect);
				}
			};
			const pause = () => {
				isPaused.value = true;
			};
			const reset = () => {
				pause();
				typingText.value = "";
				typingIndex.value = 0;
				isDeleting.value = false;
				isPausing = false;
				lastTime = 0;
			};
			const updateText = (newText) => {
				currentText.value = newText;
				reset();
				start();
			};
			onMounted(() => {
				start();
			});
			onUnmounted(() => {
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
			});
			watch(() => text, (newText) => {
				updateText(newText);
			});
			return {
				typingText,
				isPaused,
				start,
				pause,
				reset,
				updateText
			};
		}
		const { typingText } = useTyping({
			text: "Welcome to Cnkrru's Blog",
			typingSpeed: 150,
			deletingSpeed: 80,
			pauseTime: 2e3,
			loop: true,
			randomSpeed: true
		});
		const checkTimeAndSetTheme = () => {
			if (typeof document !== "undefined" && typeof localStorage !== "undefined") {
				if (localStorage.getItem("themeMode") === "manual") return;
				const body = document.body;
				if ((/* @__PURE__ */ new Date()).getHours() >= 13) {
					body.classList.add("dark-theme");
					localStorage.setItem("theme", "dark");
				} else {
					body.classList.remove("dark-theme");
					localStorage.setItem("theme", "light");
				}
			}
		};
		onMounted(() => {
			checkTimeAndSetTheme();
			const intervalId = setInterval(checkTimeAndSetTheme, 6e4);
			onUnmounted(() => {
				clearInterval(intervalId);
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "hero-content" }, _attrs))} data-v-b46125a4><div class="hero-text" data-v-b46125a4><p class="hero-subtitle" data-v-b46125a4><span class="glow-text typing-text" data-v-b46125a4>HELLO WORLD</span></p><h1 class="hero-title" data-v-b46125a4><span class="typing-text" data-v-b46125a4>${ssrInterpolate(unref(typingText))}</span><span class="cursor-blink" data-v-b46125a4>|</span></h1></div><div class="hero-buttons" data-v-b46125a4><button class="btn btn-primary" data-v-b46125a4><span class="btn-text" data-v-b46125a4>开始</span><span class="btn-glow" data-v-b46125a4></span></button></div><div class="right-aligned-content" data-v-b46125a4><div class="main-content" data-v-b46125a4><div class="left-card" data-v-b46125a4><div class="clock-container" data-v-b46125a4>`);
			_push(ssrRenderComponent(RealTimeClock_default, { size: "small" }, null, _parent));
			_push(`</div><div class="heatmap-container" data-v-b46125a4>`);
			_push(ssrRenderComponent(Heatmap_default, null, null, _parent));
			_push(`</div></div><div class="right-card" data-v-b46125a4>`);
			_push(ssrRenderComponent(VisitorMap_default, null, null, _parent));
			_push(`</div></div></div></main>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/HeroContent.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var HeroContent_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$4, [["__scopeId", "data-v-b46125a4"]]);
//#endregion
//#region src/components/page-index/ScrollIndicator.vue
var _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "scroll-indicator" }, _attrs))} data-v-c32e1482><div class="scroll-line" data-v-c32e1482></div><span class="scroll-text" data-v-c32e1482>Scroll</span></div>`);
}
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/ScrollIndicator.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var ScrollIndicator_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$3, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c32e1482"]]);
//#endregion
//#region src/components/page-index/NetworkParticles.vue
var _sfc_main$2 = {
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
			}, _attrs))} data-v-f0a0cb44></canvas>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/page-index/NetworkParticles.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var NetworkParticles_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$2, [["__scopeId", "data-v-f0a0cb44"]]);
//#endregion
//#region src/components/api/WelcomeNotification.vue
var _sfc_main$1 = {
	__name: "WelcomeNotification",
	__ssrInlineRender: true,
	setup(__props) {
		ref(false);
		const visitorInfo = ref({
			ip: "",
			city: "",
			region: "",
			country: "",
			countryCode: ""
		});
		const cityNames = {
			"Beijing": "北京",
			"Shanghai": "上海",
			"Guangzhou": "广州",
			"Shenzhen": "深圳",
			"Hangzhou": "杭州",
			"Nanjing": "Nanjing",
			"Wuhan": "武汉",
			"Chengdu": "成都",
			"Xian": "西安",
			"Tianjin": "Tianjin",
			"Chongqing": "重庆",
			"Suzhou": "苏州",
			"Dalian": "大连",
			"Qingdao": "青岛",
			"Changsha": "长沙",
			"Zhengzhou": "郑州",
			"Shijiazhuang": "石家庄",
			"Jinan": "济南",
			"Kunming": "昆明",
			"Harbin": "哈尔滨",
			"Changchun": "长春",
			"Shenyang": "沈阳",
			"Fuzhou": "福州",
			"Nanchang": "南昌",
			"Hefei": "合肥",
			"Taiyuan": "太原",
			"Lanzhou": "兰州",
			"Urumqi": "乌鲁木齐",
			"Xining": "西宁",
			"Yinchuan": "银川",
			" Hohhot": "呼和浩特",
			"Nanning": "南宁",
			"Guiyang": "贵阳",
			"Haikou": "海口",
			"Lhasa": "拉萨",
			"Hong Kong": "香港",
			"Macau": "澳门",
			"Taipei": "台北"
		};
		const getCityName = (city, countryCode) => {
			if (countryCode === "TW") return city;
			if (cityNames[city]) return cityNames[city];
			return city;
		};
		const getWelcomeMessage = (city, region, country, countryCode) => {
			const cityName = getCityName(city, countryCode);
			const greetings = [
				`欢迎来自 ${cityName} 的朋友！🌟`,
				`Hello, ${cityName} 朋友！✨`,
				`${cityName} 来的访客你好！👋`,
				`有缘千里来相会，来自 ${cityName} 的朋友！💫`,
				`欢迎来到 Cnkrru 的小站，${cityName} 的朋友！🏠`
			];
			const hour = (/* @__PURE__ */ new Date()).getHours();
			let timeGreeting = "";
			if (hour >= 5 && hour < 9) timeGreeting = "早上好";
			else if (hour >= 9 && hour < 12) timeGreeting = "上午好";
			else if (hour >= 12 && hour < 14) timeGreeting = "中午好";
			else if (hour >= 14 && hour < 18) timeGreeting = "下午好";
			else if (hour >= 18 && hour < 22) timeGreeting = "晚上好";
			else timeGreeting = "夜深了";
			const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
			return `${timeGreeting}！${randomGreeting}`;
		};
		const fetchVisitorInfo = async () => {
			let visitorData = {
				ip: "未知",
				city: "未知",
				region: "",
				country: "中国",
				countryCode: "CN"
			};
			let apiSuccess = false;
			const apis = [
				{
					name: "ipinfo.io",
					url: "https://ipinfo.io/json",
					parser: (data) => ({
						ip: data.ip || "未知",
						city: data.city || "未知",
						region: data.region || "",
						country: data.country || "中国",
						countryCode: data.country || ""
					})
				},
				{
					name: "ipapi.co",
					url: "https://ipapi.co/json/",
					parser: (data) => ({
						ip: data.ip || "未知",
						city: data.city || "未知",
						region: data.region || "",
						country: data.country_name || "中国",
						countryCode: data.country_code || ""
					})
				},
				{
					name: "ipwho.is",
					url: "https://ipwho.is/",
					parser: (data) => ({
						ip: data.ip || "未知",
						city: data.city || "未知",
						region: data.region || "",
						country: data.country || "中国",
						countryCode: data.country_code || ""
					})
				},
				{
					name: "freeipapi.com",
					url: "https://freeipapi.com/api/json/",
					parser: (data) => ({
						ip: data.ipAddresses?.[0] || "未知",
						city: data.cityName || "未知",
						region: data.regionName || "",
						country: data.countryName || "中国",
						countryCode: data.countryCode || ""
					})
				},
				{
					name: "ip-api.com",
					url: "https://ip-api.com/json/?fields=status,country,countryCode,regionName,city,query",
					parser: (data) => ({
						ip: data.query || "未知",
						city: data.city || "未知",
						region: data.regionName || "",
						country: data.country || "中国",
						countryCode: data.countryCode || ""
					})
				}
			];
			for (const api of apis) {
				if (apiSuccess) break;
				try {
					const response = await fetch(api.url);
					if (response.ok) {
						const data = await response.json();
						if (data.status !== "fail" && data.ip) {
							visitorData = api.parser(data);
							apiSuccess = true;
						}
					}
				} catch (error) {
					console.warn(`[WelcomeNotification] ${api.name} API 调用失败:`, error);
				}
			}
			visitorInfo.value = visitorData;
			const welcomeMsg = getWelcomeMessage(visitorInfo.value.city, visitorInfo.value.region, visitorInfo.value.country, visitorInfo.value.countryCode);
			const showWelcomeMessage = (message) => {
				if (typeof window !== "undefined" && document && document.body) if (window.toast) window.toast.info(message, 5e3);
				else {
					const toast = document.createElement("div");
					toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          min-width: 300px;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          color: white;
          z-index: 9999;
        `;
					const toastContent = document.createElement("div");
					toastContent.style.display = "flex";
					toastContent.style.alignItems = "center";
					toastContent.style.gap = "12px";
					const icon = document.createElement("div");
					icon.style.width = "24px";
					icon.style.height = "24px";
					icon.style.borderRadius = "50%";
					icon.style.display = "flex";
					icon.style.alignItems = "center";
					icon.style.justifyContent = "center";
					icon.style.fontWeight = "bold";
					icon.style.fontSize = "14px";
					icon.style.background = "rgba(255, 255, 255, 0.2)";
					icon.style.color = "#ffffff";
					icon.textContent = "i";
					const messageDiv = document.createElement("div");
					messageDiv.style.flex = "1";
					messageDiv.style.fontSize = "14px";
					messageDiv.style.lineHeight = "1.4";
					messageDiv.textContent = message;
					toastContent.appendChild(icon);
					toastContent.appendChild(messageDiv);
					toast.appendChild(toastContent);
					document.body.appendChild(toast);
					setTimeout(() => {
						toast.style.transition = "opacity 0.3s ease";
						toast.style.opacity = "0";
						setTimeout(() => {
							if (document.body && document.body.contains(toast)) document.body.removeChild(toast);
						}, 300);
					}, 5e3);
				}
			};
			showWelcomeMessage(welcomeMsg);
		};
		onMounted(() => {
			fetchVisitorInfo();
		});
		return (_ctx, _push, _parent, _attrs) => {};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/WelcomeNotification.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region src/pages/Index.vue
var _sfc_main = {
	__name: "Index",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "hero-container" }, _attrs))} data-v-aec5308f>`);
			_push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
			_push(`<div class="gradient-bg" data-v-aec5308f></div>`);
			_push(ssrRenderComponent(NetworkParticles_default, null, null, _parent));
			_push(`<nav class="navbar" data-v-aec5308f>`);
			_push(ssrRenderComponent(IndexLogo_default, null, null, _parent));
			_push(ssrRenderComponent(IndexNavbar_default, null, null, _parent));
			_push(`</nav>`);
			_push(ssrRenderComponent(HeroContent_default, null, null, _parent));
			_push(ssrRenderComponent(ScrollIndicator_default, null, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Index_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-aec5308f"]]);
//#endregion
export { Index_default as default };
