import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-DMwexRDj.js";
import { t as _sfc_main$2 } from "./MarkdownRender-BiaaSOGw.js";
import { mergeProps, onMounted, ref, useSSRContext } from "vue";
import { useHead } from "@vueuse/head";
import { ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region src/components/api/GitHub.vue
var _sfc_main$1 = {
	__name: "GitHub",
	__ssrInlineRender: true,
	props: { username: {
		type: String,
		required: true
	} },
	setup(__props) {
		const props = __props;
		const loading = ref(false);
		const error = ref("");
		const userData = ref(null);
		const reposData = ref([]);
		const contributionData = ref(null);
		const fetchGitHubData = async () => {
			loading.value = true;
			error.value = "";
			try {
				const fetchWithTimeout = (url, options = {}, timeout = 1e4) => {
					return new Promise((resolve, reject) => {
						const timer = setTimeout(() => {
							reject(/* @__PURE__ */ new Error("请求超时"));
						}, timeout);
						fetch(url, options).then((response) => {
							clearTimeout(timer);
							resolve(response);
						}).catch((err) => {
							clearTimeout(timer);
							reject(err);
						});
					});
				};
				const userResponse = await fetchWithTimeout(`https://api.github.com/users/${props.username}`);
				if (!userResponse.ok) if (userResponse.status === 403) throw new Error("GitHub API 请求已达上限，请稍后再试");
				else if (userResponse.status === 404) throw new Error("未找到该用户");
				else throw new Error(`获取用户信息失败 (${userResponse.status})`);
				userData.value = await userResponse.json();
				const reposResponse = await fetchWithTimeout(`https://api.github.com/users/${props.username}/repos?sort=stars&per_page=6`);
				if (reposResponse.ok) reposData.value = (await reposResponse.json()).filter((repo) => !repo.fork).slice(0, 6);
				try {
					const contributionsResponse = await fetchWithTimeout(`https://github-contributions-api.jogruber.de/v4/${props.username}`);
					if (contributionsResponse.ok) contributionData.value = calculateContributions(await contributionsResponse.json());
				} catch (contribError) {
					console.warn("获取贡献数据失败:", contribError);
					contributionData.value = null;
				}
			} catch (err) {
				error.value = err.message;
			} finally {
				loading.value = false;
			}
		};
		const calculateContributions = (data) => {
			if (!data || !data.years || data.years.length === 0) return {
				totalContributions: 0,
				longestStreak: 0,
				currentStreak: 0
			};
			const years = data.years;
			const currentYear = years[years.length - 1];
			if (!currentYear || !currentYear.contributions) return {
				totalContributions: 0,
				longestStreak: 0,
				currentStreak: 0
			};
			let totalContributions = 0;
			let longestStreak = 0;
			let currentStreak = 0;
			let tempStreak = 0;
			currentYear.contributions.forEach((week) => {
				let weekHasContribution = false;
				week.contributions.forEach((day) => {
					totalContributions += day.count;
					if (day.count > 0) weekHasContribution = true;
				});
				if (weekHasContribution) {
					tempStreak++;
					longestStreak = Math.max(longestStreak, tempStreak);
				} else tempStreak = 0;
			});
			const today = /* @__PURE__ */ new Date();
			today.setHours(0, 0, 0, 0);
			let foundGap = false;
			for (let weekIndex = currentYear.contributions.length - 1; weekIndex >= 0 && !foundGap; weekIndex--) {
				const week = currentYear.contributions[weekIndex];
				for (let dayIndex = week.contributions.length - 1; dayIndex >= 0; dayIndex--) {
					const day = week.contributions[dayIndex];
					const dayDate = new Date(day.date);
					dayDate.setHours(0, 0, 0, 0);
					if (dayDate > today) continue;
					if (day.count > 0) currentStreak++;
					else {
						foundGap = true;
						break;
					}
				}
			}
			return {
				totalContributions,
				longestStreak,
				currentStreak
			};
		};
		onMounted(() => {
			fetchGitHubData();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "github-container" }, _attrs))} data-v-8a7e97c1>`);
			if (loading.value) _push(`<div class="github-loading" data-v-8a7e97c1><div class="loading-spinner" data-v-8a7e97c1></div><p data-v-8a7e97c1>加载GitHub信息中...</p></div>`);
			else if (error.value) _push(`<div class="github-error" data-v-8a7e97c1><p data-v-8a7e97c1>${ssrInterpolate(error.value)}</p><button class="retry-button" data-v-8a7e97c1>重试</button></div>`);
			else if (userData.value) {
				_push(`<div class="github-content" data-v-8a7e97c1><div class="user-card" data-v-8a7e97c1><img${ssrRenderAttr("src", userData.value.avatar_url)}${ssrRenderAttr("alt", userData.value.login)} class="avatar" data-v-8a7e97c1><div class="user-info" data-v-8a7e97c1><h3 data-v-8a7e97c1>${ssrInterpolate(userData.value.name || userData.value.login)}</h3><p class="username" data-v-8a7e97c1>@${ssrInterpolate(userData.value.login)}</p>`);
				if (userData.value.bio) _push(`<p class="bio" data-v-8a7e97c1>${ssrInterpolate(userData.value.bio)}</p>`);
				else _push(`<!---->`);
				_push(`<div class="user-stats" data-v-8a7e97c1><div class="stat-item" data-v-8a7e97c1><span class="stat-value" data-v-8a7e97c1>${ssrInterpolate(userData.value.public_repos)}</span><span class="stat-label" data-v-8a7e97c1>仓库</span></div><div class="stat-item" data-v-8a7e97c1><span class="stat-value" data-v-8a7e97c1>${ssrInterpolate(userData.value.followers)}</span><span class="stat-label" data-v-8a7e97c1>粉丝</span></div><div class="stat-item" data-v-8a7e97c1><span class="stat-value" data-v-8a7e97c1>${ssrInterpolate(userData.value.following)}</span><span class="stat-label" data-v-8a7e97c1>关注</span></div></div><a${ssrRenderAttr("href", userData.value.html_url)} target="_blank" class="profile-link" data-v-8a7e97c1>访问GitHub主页</a></div></div>`);
				if (reposData.value.length > 0) {
					_push(`<div class="repositories-section" data-v-8a7e97c1><h3 class="section-title" data-v-8a7e97c1>热门仓库</h3><div class="repos-grid" data-v-8a7e97c1><!--[-->`);
					ssrRenderList(reposData.value, (repo) => {
						_push(`<div class="repo-card" data-v-8a7e97c1><div class="repo-header" data-v-8a7e97c1><span class="repo-name" data-v-8a7e97c1>${ssrInterpolate(repo.name)}</span><span class="repo-stars" data-v-8a7e97c1>★ ${ssrInterpolate(repo.stargazers_count)}</span></div>`);
						if (repo.description) _push(`<p class="repo-description" data-v-8a7e97c1>${ssrInterpolate(repo.description)}</p>`);
						else _push(`<!---->`);
						_push(`<div class="repo-meta" data-v-8a7e97c1>`);
						if (repo.language) _push(`<span class="repo-language" data-v-8a7e97c1><span class="${ssrRenderClass([repo.language.toLowerCase(), "language-dot"])}" data-v-8a7e97c1></span> ${ssrInterpolate(repo.language)}</span>`);
						else _push(`<!---->`);
						_push(`<span class="repo-forks" data-v-8a7e97c1>🍴 ${ssrInterpolate(repo.forks_count)}</span></div></div>`);
					});
					_push(`<!--]--></div></div>`);
				} else _push(`<!---->`);
				if (contributionData.value) _push(`<div class="contribution-section" data-v-8a7e97c1><h3 class="section-title" data-v-8a7e97c1>贡献统计</h3><div class="contribution-stats" data-v-8a7e97c1><div class="contribution-item" data-v-8a7e97c1><span class="contribution-value" data-v-8a7e97c1>${ssrInterpolate(contributionData.value.totalContributions)}</span><span class="contribution-label" data-v-8a7e97c1>今年贡献</span></div><div class="contribution-item" data-v-8a7e97c1><span class="contribution-value" data-v-8a7e97c1>${ssrInterpolate(contributionData.value.longestStreak)}</span><span class="contribution-label" data-v-8a7e97c1>最长连续贡献</span></div><div class="contribution-item" data-v-8a7e97c1><span class="contribution-value" data-v-8a7e97c1>${ssrInterpolate(contributionData.value.currentStreak)}</span><span class="contribution-label" data-v-8a7e97c1>当前连续贡献</span></div></div></div>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/api/GitHub.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var GitHub_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$1, [["__scopeId", "data-v-8a7e97c1"]]);
//#endregion
//#region src/pages/About/About.vue
var AboutTitle = "关于";
var _sfc_main = {
	__name: "About",
	__ssrInlineRender: true,
	setup(__props) {
		useHead({
			title: "关于 - Cnkrru's Blog",
			meta: [
				{
					name: "description",
					content: "关于Cnkrru和Cnkrru's Blog，了解作者的个人经历、技术技能和創作初衷"
				},
				{
					name: "keywords",
					content: "关于,个人简介,技术经历,Cnkrru"
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
					content: "https://cnkrru.top/about"
				},
				{
					property: "og:title",
					content: "关于 - Cnkrru's Blog"
				},
				{
					property: "og:description",
					content: "关于Cnkrru和Cnkrru's Blog，了解作者的个人经历、技术技能和創作初衷"
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
					content: "https://cnkrru.top/about"
				},
				{
					name: "twitter:title",
					content: "关于 - Cnkrru's Blog"
				},
				{
					name: "twitter:description",
					content: "关于Cnkrru和Cnkrru's Blog，了解作者的个人经历、技术技能和创作初衷"
				}
			],
			link: [{
				rel: "canonical",
				href: "https://cnkrru.top/about"
			}]
		});
		const aboutContent = ref("");
		const loading = ref(true);
		const error = ref(null);
		const loadAboutContent = async () => {
			try {
				loading.value = true;
				error.value = null;
				aboutContent.value = (await import("./about-BjWm85yQ.js")).default;
			} catch (importError) {
				error.value = "加载关于页面内容失败";
				aboutContent.value = "";
			} finally {
				loading.value = false;
			}
		};
		onMounted(() => {
			loadAboutContent();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[--><div class="center-head-card" data-v-62c9bc3f><h2 data-v-62c9bc3f>${ssrInterpolate(AboutTitle)}</h2></div><hr data-v-62c9bc3f><div class="center-card-content" data-v-62c9bc3f><div class="about-center-card-body" data-v-62c9bc3f>`);
			if (loading.value) _push(`<div class="loading-message" data-v-62c9bc3f><p data-v-62c9bc3f>加载中...</p></div>`);
			else if (error.value) _push(`<div class="error-message" data-v-62c9bc3f><p data-v-62c9bc3f>${ssrInterpolate(error.value)}</p></div>`);
			else {
				_push(`<div class="text-style" data-v-62c9bc3f>`);
				_push(ssrRenderComponent(_sfc_main$2, { content: aboutContent.value }, null, _parent));
				_push(`</div>`);
			}
			_push(`<div class="github-section" data-v-62c9bc3f>`);
			_push(ssrRenderComponent(GitHub_default, { username: "Cnkrru" }, null, _parent));
			_push(`</div></div></div><hr data-v-62c9bc3f><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/About/About.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var About_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-62c9bc3f"]]);
//#endregion
export { About_default as default };
