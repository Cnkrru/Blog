import { computed, ref } from "vue";
import { createPinia, defineStore } from "pinia";
//#region src/stores/articles.js
var useArticlesStore = defineStore("articles", () => {
	const articles = ref([]);
	const loaded = ref(false);
	const loading = ref(false);
	const mdModules = {
		.../* @__PURE__ */ Object.assign({
			"../pages/post/post-0.md": () => import("./post-0-Cmd4P-KX.js").then((m) => m["default"]),
			"../pages/post/post-1.md": () => import("./post-1-DTMe5Su_.js").then((m) => m["default"]),
			"../pages/post/post-2.md": () => import("./post-2-C_fRB8KJ.js").then((m) => m["default"]),
			"../pages/post/post-3.md": () => import("./post-3-XwDYB_tJ.js").then((m) => m["default"]),
			"../pages/post/post-4.md": () => import("./post-4-CpgR3mV0.js").then((m) => m["default"]),
			"../pages/post/post-5.md": () => import("./post-5-DY3FjGe4.js").then((m) => m["default"]),
			"../pages/post/post-6.md": () => import("./post-6-CuGfBtV7.js").then((m) => m["default"]),
			"../pages/post/post-7.md": () => import("./post-7-D_Q5bIlx.js").then((m) => m["default"]),
			"../pages/post/post-8.md": () => import("./post-8-DBEfQcKT.js").then((m) => m["default"]),
			"../pages/post/post-9.md": () => import("./post-9-DCnEWrjX.js").then((m) => m["default"])
		}),
		.../* @__PURE__ */ Object.assign({ "../pages/log/changelog.md": () => import("./changelog-DtbufIL9.js").then((m) => m["default"]) }),
		.../* @__PURE__ */ Object.assign({ "../pages/project/project-0.md": () => import("./project-0-DXDKG4az.js").then((m) => m["default"]) })
	};
	/**
	* 加载 search.json，已加载则直接返回缓存
	*/
	async function fetchArticles() {
		if (loaded.value) return articles.value;
		if (loading.value) {
			await new Promise((resolve) => {
				const stop = setInterval(() => {
					if (!loading.value) {
						clearInterval(stop);
						resolve();
					}
				}, 20);
			});
			return articles.value;
		}
		loading.value = true;
		try {
			const res = await fetch("/config/search.json");
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			articles.value = await res.json();
			loaded.value = true;
		} catch (e) {
			console.error("[articlesStore] 加载 search.json 失败:", e);
			articles.value = [];
		} finally {
			loading.value = false;
		}
		return articles.value;
	}
	/**
	* 根据 id 加载对应 md 文件的原始内容
	* 文件命名规则：
	*   数字 id (0,1,2...)  -> pages/post/post-{id}.md
	*   字符串 id           -> pages/post/{id}.md
	*   changelog           -> pages/log/changelog.md
	*   project-N           -> pages/project/project-{N}.md
	*/
	async function loadMarkdown(id) {
		const candidates = [
			`../pages/post/post-${id}.md`,
			`../pages/post/${id}.md`,
			`../pages/project/${id}.md`,
			`../pages/log/${id}.md`
		];
		for (const path of candidates) if (mdModules[path]) try {
			return await mdModules[path]();
		} catch (err) {
			console.error(`[articlesStore] 加载文件失败 ${path}:`, err);
		}
		return null;
	}
	return {
		articles,
		loaded,
		loading,
		fetchArticles,
		loadMarkdown,
		articleCount: computed(() => {
			return articles.value.filter((item) => item.id !== "changelog").length;
		})
	};
});
defineStore("live2d", () => {
	const isVisible = ref(true);
	const toggle = () => {
		isVisible.value = !isVisible.value;
	};
	const show = () => {
		isVisible.value = true;
	};
	const hide = () => {
		isVisible.value = false;
	};
	return {
		isVisible,
		toggle,
		show,
		hide
	};
});
//#endregion
//#region src/stores/theme.js
var useThemeStore = defineStore("theme", () => {
	const isDark = ref(false);
	const themeMode = ref("auto");
	const currentTheme = computed(() => isDark.value ? "dark" : "light");
	const toggleTheme = () => {
		isDark.value = !isDark.value;
		applyTheme();
		themeMode.value = "manual";
		if (typeof localStorage !== "undefined") localStorage.setItem("themeMode", "manual");
	};
	const setTheme = (dark) => {
		isDark.value = dark;
		applyTheme();
	};
	const applyTheme = () => {
		if (typeof document !== "undefined") {
			const body = document.body;
			if (isDark.value) body.classList.add("dark-theme");
			else body.classList.remove("dark-theme");
			if (typeof localStorage !== "undefined") localStorage.setItem("theme", currentTheme.value);
			if (typeof updateGiscusTheme === "function") updateGiscusTheme();
		}
	};
	const isNightTime = () => {
		return (/* @__PURE__ */ new Date()).getHours() >= 13;
	};
	const checkAutoTheme = () => {
		if (themeMode.value !== "auto") return;
		setTheme(isNightTime());
	};
	const initTheme = () => {
		if (typeof document === "undefined" || typeof localStorage === "undefined") return;
		const savedTheme = localStorage.getItem("theme");
		const savedMode = localStorage.getItem("themeMode");
		if (savedMode) themeMode.value = savedMode;
		if (themeMode.value === "manual" && savedTheme) setTheme(savedTheme === "dark");
		else checkAutoTheme();
		startAutoThemeTimer();
	};
	let autoThemeTimer = null;
	const startAutoThemeTimer = () => {
		if (typeof window === "undefined") return;
		if (autoThemeTimer) clearInterval(autoThemeTimer);
		autoThemeTimer = setInterval(() => {
			checkAutoTheme();
		}, 6e4);
	};
	const cleanup = () => {
		if (autoThemeTimer) {
			clearInterval(autoThemeTimer);
			autoThemeTimer = null;
		}
	};
	return {
		isDark,
		themeMode,
		currentTheme,
		toggleTheme,
		setTheme,
		initTheme,
		cleanup
	};
});
//#endregion
//#region src/stores/music.js
var SpatialAudioProcessor = class {
	constructor(audioContext) {
		this.audioContext = audioContext;
		this.stereoPanner = audioContext.createStereoPanner();
		this.gainNode = audioContext.createGain();
		this.analyser = audioContext.createAnalyser();
		this.filters = [];
		this.bands = 10;
		this.createFilters();
		for (let i = 0; i < this.bands; i++) if (i === 0) this.filters[i].connect(this.analyser);
		else this.filters[i].connect(this.filters[i - 1]);
		this.analyser.connect(this.stereoPanner);
		this.stereoPanner.connect(this.gainNode);
		this.gainNode.connect(audioContext.destination);
		this.isSurroundEnabled = false;
		this.surroundSpeed = .5;
		this.surroundPhase = 0;
		this.animationId = null;
	}
	createFilters() {
		for (let i = 0; i < this.bands; i++) {
			const filter = this.audioContext.createBiquadFilter();
			if (i === 0) filter.type = "lowshelf";
			else if (i === this.bands - 1) filter.type = "highshelf";
			else filter.type = "peaking";
			filter.frequency.value = 20 * Math.pow(2, i * .5);
			filter.Q.value = 1;
			filter.gain.value = 0;
			this.filters.push(filter);
		}
		this.analyser.fftSize = 256;
		this.analyser.smoothingTimeConstant = .8;
	}
	startSurroundAnimation() {
		if (this.animationId) return;
		const animate = () => {
			if (!this.isSurroundEnabled) return;
			const pan = Math.sin(this.surroundPhase);
			this.stereoPanner.pan.value = pan;
			this.surroundPhase += .05 * this.surroundSpeed;
			if (this.surroundPhase >= Math.PI * 2) this.surroundPhase = 0;
			this.animationId = requestAnimationFrame(animate);
		};
		animate();
	}
	stopSurroundAnimation() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
		this.stereoPanner.pan.value = 0;
	}
	setSurroundMode(mode) {
		if (mode === "off") {
			this.isSurroundEnabled = false;
			this.stopSurroundAnimation();
		} else {
			this.isSurroundEnabled = true;
			switch (mode) {
				case "stereo":
					this.surroundSpeed = .3;
					break;
				case "3d":
					this.surroundSpeed = .5;
					break;
				case "concert":
					this.surroundSpeed = .8;
					break;
				case "church":
					this.surroundSpeed = .2;
					break;
				default: this.surroundSpeed = .5;
			}
			this.startSurroundAnimation();
		}
	}
	setEqPreset(preset) {
		const presets = {
			flat: [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			],
			bass: [
				6,
				5,
				4,
				2,
				0,
				0,
				0,
				0,
				0,
				0
			],
			treble: [
				0,
				0,
				0,
				0,
				0,
				2,
				4,
				5,
				6,
				6
			],
			pop: [
				-2,
				0,
				2,
				4,
				5,
				4,
				2,
				0,
				-2,
				-4
			],
			rock: [
				5,
				4,
				2,
				0,
				-2,
				-2,
				0,
				2,
				4,
				5
			],
			jazz: [
				4,
				3,
				1,
				2,
				-2,
				-2,
				0,
				1,
				3,
				4
			],
			classical: [
				5,
				4,
				3,
				2,
				0,
				0,
				0,
				2,
				3,
				5
			]
		};
		(presets[preset] || presets.flat).forEach((gain, i) => {
			if (this.filters[i]) this.filters[i].gain.value = gain;
		});
	}
	connect(source) {
		source.connect(this.filters[0]);
	}
	setVolume(volume) {
		this.gainNode.gain.value = volume;
	}
};
var isBrowser = typeof window !== "undefined";
var useMusicStore = defineStore("music", () => {
	const playlist = ref([]);
	const currentIndex = ref(0);
	const isPlaying = ref(false);
	const isPlayerVisible = ref(false);
	const isPlaylistVisible = ref(false);
	const volume = ref(.7);
	const isMuted = ref(false);
	const currentTime = ref(0);
	const duration = ref(0);
	const isLoading = ref(false);
	const effectsEnabled = ref(false);
	const surroundMode = ref("off");
	const eqPreset = ref("flat");
	let audio = null;
	let audioContext = null;
	let spatialProcessor = null;
	let saveStateInterval = null;
	const currentSong = computed(() => playlist.value[currentIndex.value] || null);
	const progressPercent = computed(() => {
		if (duration.value <= 0) return 0;
		return currentTime.value / duration.value * 100;
	});
	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};
	const savePlayerState = () => {
		if (!isBrowser) return;
		if (!audio) return;
		const state = {
			currentIndex: currentIndex.value,
			currentTime: audio.currentTime,
			isPlaying: !audio.paused,
			volume: audio.volume,
			isMuted: audio.muted
		};
		try {
			localStorage.setItem("musicPlayerState", JSON.stringify(state));
		} catch (error) {}
	};
	const loadPlayerState = () => {
		if (!isBrowser) return {
			currentTime: 0,
			isPlaying: false
		};
		try {
			const savedState = localStorage.getItem("musicPlayerState");
			if (savedState) {
				const state = JSON.parse(savedState);
				currentIndex.value = state.currentIndex ?? 0;
				volume.value = state.volume ?? .7;
				isMuted.value = state.isMuted ?? false;
				return {
					currentTime: state.currentTime ?? 0,
					isPlaying: state.isPlaying ?? false
				};
			}
		} catch (error) {}
		return {
			currentTime: 0,
			isPlaying: false
		};
	};
	const loadSong = (index) => {
		const song = playlist.value[index];
		if (!song) return;
		isLoading.value = true;
		if (audio) {
			audio.crossOrigin = "anonymous";
			loadAudioWithFallback(song);
		}
	};
	const applyEffects = ({ enabled, surroundMode: mode, eqPreset: preset }) => {
		effectsEnabled.value = enabled;
		surroundMode.value = mode;
		eqPreset.value = preset;
		if (!spatialProcessor) return;
		spatialProcessor.setEqPreset(preset);
		spatialProcessor.setSurroundMode(enabled ? mode : "off");
	};
	const initSpatialAudio = () => {
		if (!isBrowser) return;
		if (!audioContext && audio) {
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
			spatialProcessor = new SpatialAudioProcessor(audioContext);
			const source = audioContext.createMediaElementSource(audio);
			spatialProcessor.connect(source);
			spatialProcessor.setVolume(volume.value);
		}
	};
	const loadAudioWithFallback = (song) => {
		if (!audio) return;
		const audioPath = song.audio;
		const backupUrls = song.backupAudio || [];
		let currentBackupIndex = 0;
		const tryLoadUrl = (url) => {
			audio.src = url;
		};
		const handleError = () => {
			if (currentBackupIndex < backupUrls.length) {
				currentBackupIndex++;
				tryLoadUrl(backupUrls[currentBackupIndex - 1]);
			} else setTimeout(() => {
				nextSong();
			}, 1e3);
		};
		audio.onerror = handleError;
		tryLoadUrl(audioPath);
	};
	const togglePlay = () => {
		if (!audio) return;
		if (!spatialProcessor) initSpatialAudio();
		if (audioContext && audioContext.state === "suspended") audioContext.resume();
		if (audio.paused) audio.play().catch(() => {});
		else audio.pause();
		savePlayerState();
	};
	const prevSong = () => {
		if (playlist.value.length === 0) return;
		const wasPlaying = isPlaying.value;
		currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length;
		loadSong(currentIndex.value);
		if (wasPlaying && audio) audio.addEventListener("canplay", () => {
			audio.play().catch(() => {});
		}, { once: true });
		savePlayerState();
	};
	const nextSong = () => {
		if (playlist.value.length === 0) return;
		const wasPlaying = isPlaying.value;
		currentIndex.value = (currentIndex.value + 1) % playlist.value.length;
		loadSong(currentIndex.value);
		if (wasPlaying && audio) audio.addEventListener("canplay", () => {
			audio.play().catch(() => {});
		}, { once: true });
		savePlayerState();
	};
	const togglePlaylist = () => {
		isPlaylistVisible.value = !isPlaylistVisible.value;
	};
	const closePlaylist = () => {
		isPlaylistVisible.value = false;
	};
	const selectSong = (index) => {
		if (!audio) initializePlayer();
		if (index !== currentIndex.value) {
			const wasPlaying = isPlaying.value;
			currentIndex.value = index;
			loadSong(currentIndex.value);
			if (wasPlaying && audio) audio.addEventListener("canplay", () => {
				audio.play().catch(() => {});
			}, { once: true });
			savePlayerState();
		} else if (audio && audio.paused) audio.play().catch(() => {});
		else if (audio) audio.pause();
	};
	const seek = (percent) => {
		if (!audio) return;
		audio.currentTime = percent * duration.value;
	};
	const setVolume = (percent) => {
		if (!audio) return;
		audio.volume = percent;
		volume.value = percent;
		if (percent === 0) {
			audio.muted = true;
			isMuted.value = true;
		} else {
			audio.muted = false;
			isMuted.value = false;
		}
		savePlayerState();
	};
	const toggleMute = () => {
		if (!audio) return;
		audio.muted = !audio.muted;
		isMuted.value = audio.muted;
		savePlayerState();
	};
	const initializePlayer = () => {
		if (!isBrowser) return;
		if (!audio) {
			audio = new Audio();
			audio.addEventListener("timeupdate", () => {
				currentTime.value = audio.currentTime || 0;
				duration.value = audio.duration || 0;
			});
			audio.addEventListener("ended", () => {
				nextSong();
			});
			audio.addEventListener("loadedmetadata", () => {
				duration.value = audio.duration || 0;
			});
			audio.addEventListener("play", () => {
				isPlaying.value = true;
			});
			audio.addEventListener("pause", () => {
				isPlaying.value = false;
			});
			audio.addEventListener("canplay", () => {
				isLoading.value = false;
			});
		}
		const savedState = loadPlayerState();
		audio.volume = volume.value;
		audio.muted = isMuted.value;
		loadSong(currentIndex.value);
		if (savedState.currentTime > 0) audio.addEventListener("loadedmetadata", () => {
			audio.currentTime = savedState.currentTime;
		}, { once: true });
		initSpatialAudio();
		saveStateInterval = setInterval(savePlayerState, 500);
	};
	const loadMusicConfig = async () => {
		try {
			const response = await fetch("/config/music.json");
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			playlist.value = (await response.json()).songs;
			initializePlayer();
		} catch (error) {
			console.error("[musicStore] 加载音乐配置失败:", error);
		}
	};
	const cleanup = () => {
		if (saveStateInterval) clearInterval(saveStateInterval);
		if (audio) audio.pause();
	};
	const getAudio = () => audio;
	const getAudioContext = () => audioContext;
	const getAnalyser = () => spatialProcessor ? spatialProcessor.analyser : null;
	const setPlayerVisible = (visible) => {
		isPlayerVisible.value = visible;
	};
	return {
		playlist,
		currentIndex,
		isPlaying,
		isPlayerVisible,
		isPlaylistVisible,
		volume,
		isMuted,
		currentTime,
		duration,
		isLoading,
		currentSong,
		progressPercent,
		effectsEnabled,
		surroundMode,
		eqPreset,
		formatTime,
		loadSong,
		togglePlay,
		prevSong,
		nextSong,
		togglePlaylist,
		closePlaylist,
		selectSong,
		seek,
		setVolume,
		toggleMute,
		loadMusicConfig,
		savePlayerState,
		cleanup,
		getAudio,
		getAudioContext,
		getAnalyser,
		applyEffects,
		setPlayerVisible
	};
});
defineStore("global", () => {
	const isLoading = ref(false);
	const notifications = ref([]);
	const performance = ref({
		memory: 0,
		cpu: 0,
		network: 0
	});
	const setLoading = (loading) => {
		isLoading.value = loading;
	};
	const addNotification = (message, type = "info", duration = 3e3, buttons = []) => {
		const id = Date.now().toString();
		notifications.value.push({
			id,
			message,
			type,
			duration,
			buttons
		});
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	};
	const removeNotification = (id) => {
		notifications.value = notifications.value.filter((notification) => notification.id !== id);
	};
	const updatePerformance = (data) => {
		performance.value = {
			...performance.value,
			...data
		};
	};
	return {
		isLoading,
		notifications,
		performance,
		setLoading,
		addNotification,
		removeNotification,
		updatePerformance
	};
});
//#endregion
//#region src/stores/user.js
var useUserStore = defineStore("user", () => {
	const visitorCount = ref(0);
	const visitorCities = ref([]);
	const currentLocation = ref(null);
	const incrementVisitorCount = () => {
		visitorCount.value++;
	};
	const addVisitorCity = (city, lat, lon) => {
		visitorCities.value.push({
			name: city,
			value: [lon, lat]
		});
	};
	const setCurrentLocation = (location) => {
		currentLocation.value = location;
	};
	const fetchUserLocation = async () => {
		const apis = [{
			name: "ip-api.com",
			url: "https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon",
			parser: (data) => data.status === "success" ? {
				city: data.city,
				lat: data.lat,
				lon: data.lon
			} : null
		}, {
			name: "ipwho.is",
			url: "https://ipwho.is/",
			parser: (data) => data.ip ? {
				city: data.city,
				lat: data.latitude,
				lon: data.longitude
			} : null
		}];
		let locationData = null;
		for (const api of apis) {
			if (locationData) break;
			try {
				const response = await fetch(api.url);
				if (response.ok) {
					const data = await response.json();
					locationData = api.parser(data);
				}
			} catch (error) {
				console.warn(`[userStore] ${api.name} API 调用失败:`, error);
			}
		}
		if (locationData && locationData.city) {
			incrementVisitorCount();
			addVisitorCity(locationData.city, locationData.lat, locationData.lon);
			setCurrentLocation(locationData);
		}
		return locationData;
	};
	return {
		visitorCount,
		visitorCities,
		currentLocation,
		incrementVisitorCount,
		addVisitorCity,
		setCurrentLocation,
		fetchUserLocation
	};
});
//#endregion
//#region src/stores/announcement.ts
var useAnnouncementStore = defineStore("announcement", () => {
	const announcementContent = ref("");
	const loading = ref(true);
	const showModal = ref(false);
	const lastUpdated = ref(null);
	const controlAnnouncement = () => {
		if (loading.value && announcementContent.value) showModal.value = true;
		else showModal.value = false;
	};
	const loadAnnouncement = async () => {
		try {
			announcementContent.value = (await import("./announcement-D4qKeY3i.js")).default;
			lastUpdated.value = /* @__PURE__ */ new Date();
			loading.value = true;
		} catch (error) {
			console.error("[announcementStore] 加载公告失败:", error);
			announcementContent.value = "## 网站公告\n\n公告加载失败，请稍后再试。";
		} finally {
			loading.value = false;
		}
	};
	const checkForUpdates = async () => {
		if (lastUpdated.value) {
			const oneWeekAgo = /* @__PURE__ */ new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
			if (lastUpdated.value < oneWeekAgo) {
				await loadAnnouncement();
				return true;
			}
		}
		return false;
	};
	return {
		showModal,
		announcementContent,
		loading,
		lastUpdated,
		controlAnnouncement,
		loadAnnouncement,
		checkForUpdates
	};
});
//#endregion
//#region src/stores/audio.js
var useAudioStore = defineStore("audio", () => {
	const effectsEnabled = ref(false);
	const visualizerEnabled = ref(false);
	const surroundMode = ref("off");
	const eqPreset = ref("flat");
	const customEqSettings = ref([]);
	const surroundModes = [
		{
			value: "off",
			label: "关闭"
		},
		{
			value: "stereo",
			label: "立体声"
		},
		{
			value: "3d",
			label: "3D环绕"
		},
		{
			value: "concert",
			label: "演唱会"
		},
		{
			value: "church",
			label: "教堂"
		}
	];
	const eqPresets = [
		{
			value: "flat",
			label: "平坦"
		},
		{
			value: "bass",
			label: "低音增强"
		},
		{
			value: "treble",
			label: "高音增强"
		},
		{
			value: "pop",
			label: "流行"
		},
		{
			value: "rock",
			label: "摇滚"
		},
		{
			value: "jazz",
			label: "爵士"
		},
		{
			value: "classical",
			label: "古典"
		}
	];
	const currentSurroundMode = computed(() => surroundMode.value);
	const currentEqPreset = computed(() => eqPreset.value);
	const toggleEffects = () => {
		effectsEnabled.value = !effectsEnabled.value;
		saveSettings();
	};
	const toggleVisualizer = () => {
		visualizerEnabled.value = !visualizerEnabled.value;
		saveSettings();
	};
	const setSurroundMode = (mode) => {
		surroundMode.value = mode;
		if (mode !== "off" && !effectsEnabled.value) effectsEnabled.value = true;
		saveSettings();
	};
	const setEqPreset = (preset) => {
		eqPreset.value = preset;
		if (preset !== "flat" && !effectsEnabled.value) effectsEnabled.value = true;
		saveSettings();
	};
	const setCustomEqSettings = (settings) => {
		customEqSettings.value = settings;
		saveSettings();
	};
	const saveSettings = () => {
		if (typeof localStorage !== "undefined") try {
			localStorage.setItem("audioSettings", JSON.stringify({
				effectsEnabled: effectsEnabled.value,
				visualizerEnabled: visualizerEnabled.value,
				surroundMode: surroundMode.value,
				eqPreset: eqPreset.value,
				customEqSettings: customEqSettings.value
			}));
		} catch (error) {
			console.error("[audioStore] 保存音效设置失败:", error);
		}
	};
	const loadSettings = () => {
		if (typeof localStorage !== "undefined") try {
			const savedSettings = localStorage.getItem("audioSettings");
			if (savedSettings) {
				const settings = JSON.parse(savedSettings);
				effectsEnabled.value = settings.effectsEnabled || false;
				visualizerEnabled.value = settings.visualizerEnabled || false;
				surroundMode.value = settings.surroundMode || "off";
				eqPreset.value = settings.eqPreset || "flat";
				customEqSettings.value = settings.customEqSettings || [];
			}
		} catch (error) {
			console.error("[audioStore] 加载音效设置失败:", error);
		}
	};
	const init = () => {
		loadSettings();
	};
	return {
		effectsEnabled,
		visualizerEnabled,
		surroundMode,
		eqPreset,
		customEqSettings,
		surroundModes,
		eqPresets,
		currentSurroundMode,
		currentEqPreset,
		toggleEffects,
		toggleVisualizer,
		setSurroundMode,
		setEqPreset,
		setCustomEqSettings,
		saveSettings,
		loadSettings,
		init
	};
});
//#endregion
//#region src/stores/scroll.js
var useScrollStore = defineStore("scroll", () => {
	const scrollPosition = ref(0);
	const backToTopVisible = ref(false);
	const showThreshold = ref(300);
	const isVisible = computed(() => backToTopVisible.value);
	const threshold = computed(() => showThreshold.value);
	const updateScrollPosition = (position) => {
		scrollPosition.value = position;
		updateBackToTopVisibility();
	};
	const updateBackToTopVisibility = () => {
		backToTopVisible.value = scrollPosition.value > showThreshold.value;
	};
	const setShowThreshold = (threshold) => {
		showThreshold.value = threshold;
		updateBackToTopVisibility();
	};
	const scrollToTop = () => {
		if (document.body.classList.contains("immersive-reading")) window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
		else {
			const centerCardContent = document.querySelector(".center-card-content");
			if (centerCardContent) centerCardContent.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			else window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}
	};
	const initScrollListener = () => {
		if (typeof window !== "undefined") {
			const handleScroll = () => {
				if (document.body.classList.contains("immersive-reading")) updateScrollPosition(window.scrollY);
				else {
					const centerCardContent = document.querySelector(".center-card-content");
					if (centerCardContent) updateScrollPosition(centerCardContent.scrollTop);
					else updateScrollPosition(window.scrollY);
				}
			};
			window.addEventListener("scroll", handleScroll, { passive: true });
			handleScroll();
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}
	};
	return {
		scrollPosition,
		backToTopVisible,
		showThreshold,
		isVisible,
		threshold,
		updateScrollPosition,
		updateBackToTopVisibility,
		setShowThreshold,
		scrollToTop,
		initScrollListener
	};
});
//#endregion
//#region src/stores/clipboard.js
var useClipboardStore = defineStore("clipboard", () => {
	const copyHistory = ref([]);
	const lastCopiedCode = ref("");
	const lastCopiedTime = ref(null);
	const copyCount = ref(0);
	const isCopying = ref(false);
	const copyError = ref(null);
	const hasCopyHistory = computed(() => copyHistory.value.length > 0);
	const recentCopies = computed(() => copyHistory.value.slice(0, 10));
	const totalCopyCount = computed(() => copyCount.value);
	const addToHistory = (code, success = true) => {
		const timestamp = (/* @__PURE__ */ new Date()).toISOString();
		if (success) {
			copyHistory.value.unshift({
				code: code.substring(0, 100),
				timestamp,
				success: true
			});
			if (copyHistory.value.length > 50) copyHistory.value.pop();
			lastCopiedCode.value = code;
			lastCopiedTime.value = timestamp;
			copyCount.value++;
		} else copyError.value = "复制失败";
	};
	const clearHistory = () => {
		copyHistory.value = [];
		lastCopiedCode.value = "";
		lastCopiedTime.value = null;
	};
	const setCopying = (copying) => {
		isCopying.value = copying;
	};
	const setError = (error) => {
		copyError.value = error;
	};
	const clearError = () => {
		copyError.value = null;
	};
	const saveToStorage = () => {
		if (typeof localStorage !== "undefined") try {
			localStorage.setItem("clipboardHistory", JSON.stringify({
				copyHistory: copyHistory.value,
				copyCount: copyCount.value
			}));
		} catch (error) {
			console.error("[clipboardStore] 保存剪贴板历史失败:", error);
		}
	};
	const loadFromStorage = () => {
		if (typeof localStorage !== "undefined") try {
			const saved = localStorage.getItem("clipboardHistory");
			if (saved) {
				const data = JSON.parse(saved);
				copyHistory.value = data.copyHistory || [];
				copyCount.value = data.copyCount || 0;
			}
		} catch (error) {
			console.error("[clipboardStore] 加载剪贴板历史失败:", error);
		}
	};
	const init = () => {
		loadFromStorage();
	};
	return {
		copyHistory,
		lastCopiedCode,
		lastCopiedTime,
		copyCount,
		isCopying,
		copyError,
		hasCopyHistory,
		recentCopies,
		totalCopyCount,
		addToHistory,
		clearHistory,
		setCopying,
		setError,
		clearError,
		saveToStorage,
		loadFromStorage,
		init
	};
});
//#endregion
//#region src/stores/code.js
var useCodeStore = defineStore("code", () => {
	const prismLoaded = ref(false);
	const loadedLanguages = ref([]);
	const codeStats = ref({
		totalLines: 0,
		totalChars: 0,
		highlightCount: 0
	});
	const theme = ref("default");
	const lineNumbersEnabled = ref(true);
	const showLanguageBadge = ref(true);
	const copyEnabled = ref(true);
	const isPrismLoaded = computed(() => prismLoaded.value);
	const hasLoadedLanguages = computed(() => loadedLanguages.value.length > 0);
	const totalHighlightCount = computed(() => codeStats.value.highlightCount);
	const setPrismLoaded = (loaded) => {
		prismLoaded.value = loaded;
	};
	const addLoadedLanguage = (language) => {
		if (!loadedLanguages.value.includes(language)) loadedLanguages.value.push(language);
	};
	const incrementHighlightCount = () => {
		codeStats.value.highlightCount++;
	};
	const updateCodeStats = (lines, chars) => {
		codeStats.value.totalLines += lines;
		codeStats.value.totalChars += chars;
	};
	const setTheme = (newTheme) => {
		theme.value = newTheme;
	};
	const toggleLineNumbers = () => {
		lineNumbersEnabled.value = !lineNumbersEnabled.value;
	};
	const toggleLanguageBadge = () => {
		showLanguageBadge.value = !showLanguageBadge.value;
	};
	const toggleCopy = () => {
		copyEnabled.value = !copyEnabled.value;
	};
	const saveSettings = () => {
		if (typeof localStorage !== "undefined") try {
			localStorage.setItem("codeSettings", JSON.stringify({
				theme: theme.value,
				lineNumbersEnabled: lineNumbersEnabled.value,
				showLanguageBadge: showLanguageBadge.value,
				copyEnabled: copyEnabled.value
			}));
		} catch (error) {
			console.error("[codeStore] 保存代码设置失败:", error);
		}
	};
	const loadSettings = () => {
		if (typeof localStorage !== "undefined") try {
			const saved = localStorage.getItem("codeSettings");
			if (saved) {
				const data = JSON.parse(saved);
				theme.value = data.theme || "default";
				lineNumbersEnabled.value = data.lineNumbersEnabled !== false;
				showLanguageBadge.value = data.showLanguageBadge !== false;
				copyEnabled.value = data.copyEnabled !== false;
			}
		} catch (error) {
			console.error("[codeStore] 加载代码设置失败:", error);
		}
	};
	const init = () => {
		loadSettings();
	};
	return {
		prismLoaded,
		loadedLanguages,
		codeStats,
		theme,
		lineNumbersEnabled,
		showLanguageBadge,
		copyEnabled,
		isPrismLoaded,
		hasLoadedLanguages,
		totalHighlightCount,
		setPrismLoaded,
		addLoadedLanguage,
		incrementHighlightCount,
		updateCodeStats,
		setTheme,
		toggleLineNumbers,
		toggleLanguageBadge,
		toggleCopy,
		saveSettings,
		loadSettings,
		init
	};
});
//#endregion
//#region src/stores/comment.js
var useCommentStore = defineStore("comment", () => {
	const isLoaded = ref(false);
	const isLoading = ref(false);
	const error = ref(null);
	const commentCount = ref(0);
	const giscusConfig = ref({
		repo: "Cnkrru/Blog",
		repoId: "R_kgDORzTTCQ",
		category: "Announcements",
		categoryId: "DIC_kwDORzTTCc4C5e-m",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "bottom",
		lang: "zh-CN",
		theme: "light"
	});
	const baseThemeUrl = "https://pub-b8c25e855b194f5aa9d5e32789ca6f9d.r2.dev";
	const currentTheme = computed(() => giscusConfig.value.theme);
	const isDarkTheme = computed(() => currentTheme.value === "dark");
	const giscusThemeUrl = computed(() => {
		return isDarkTheme.value ? `${baseThemeUrl}/comment-dark.css` : `${baseThemeUrl}/comment-light.css`;
	});
	const setLoading = (loading) => {
		isLoading.value = loading;
	};
	const setError = (err) => {
		error.value = err;
	};
	const setLoaded = (loaded) => {
		isLoaded.value = loaded;
	};
	const setCommentCount = (count) => {
		commentCount.value = count;
	};
	const setTheme = (isDark) => {
		giscusConfig.value.theme = isDark ? "dark" : "light";
		updateGiscusTheme();
	};
	const setLanguage = (lang) => {
		giscusConfig.value.lang = lang;
	};
	const initCommentSystem = () => {
		if (typeof document === "undefined") return;
		setLoading(true);
		setError(null);
		try {
			document.querySelectorAll(".comment-container").forEach((container) => {
				if (container.querySelector("script[src*=\"giscus\"]")) {
					setLoaded(true);
					setLoading(false);
					return;
				}
				const giscusScript = document.createElement("script");
				giscusScript.src = "https://giscus.app/client.js";
				giscusScript.setAttribute("data-repo", giscusConfig.value.repo);
				giscusScript.setAttribute("data-repo-id", giscusConfig.value.repoId);
				giscusScript.setAttribute("data-category", giscusConfig.value.category);
				giscusScript.setAttribute("data-category-id", giscusConfig.value.categoryId);
				giscusScript.setAttribute("data-mapping", giscusConfig.value.mapping);
				giscusScript.setAttribute("data-strict", giscusConfig.value.strict);
				giscusScript.setAttribute("data-reactions-enabled", giscusConfig.value.reactionsEnabled);
				giscusScript.setAttribute("data-emit-metadata", giscusConfig.value.emitMetadata);
				giscusScript.setAttribute("data-input-position", giscusConfig.value.inputPosition);
				giscusScript.setAttribute("data-theme", giscusThemeUrl.value);
				giscusScript.setAttribute("data-lang", giscusConfig.value.lang);
				giscusScript.setAttribute("crossorigin", "anonymous");
				giscusScript.setAttribute("async", "");
				giscusScript.onload = () => {
					setLoaded(true);
					setLoading(false);
				};
				giscusScript.onerror = () => {
					console.error("[commentStore] giscus脚本加载失败");
					setError("评论系统加载失败");
					setLoading(false);
				};
				setLoaded(true);
				setLoading(false);
				container.appendChild(giscusScript);
			});
		} catch (err) {
			console.error("[commentStore] 初始化评论系统失败:", err);
			setError("初始化评论系统失败");
			setLoading(false);
		}
	};
	const updateGiscusTheme = () => {
		if (typeof document === "undefined") return;
		const iframe = document.querySelector("iframe.giscus-frame");
		if (iframe) try {
			iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusThemeUrl.value } } }, "https://giscus.app");
		} catch (err) {
			setError("更新主题失败");
		}
	};
	const refreshComments = () => {
		if (typeof document === "undefined") return;
		const iframe = document.querySelector("iframe.giscus-frame");
		if (iframe) try {
			iframe.contentWindow.postMessage({ giscus: { refresh: true } }, "https://giscus.app");
		} catch (err) {
			setError("刷新评论失败");
		}
	};
	const init = () => {
		if (typeof window !== "undefined") {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === "attributes" && mutation.attributeName === "class") setTheme(document.body.classList.contains("dark-theme"));
				});
			});
			observer.observe(document.body, { attributes: true });
			return () => observer.disconnect();
		}
	};
	return {
		isLoaded,
		isLoading,
		error,
		commentCount,
		giscusConfig,
		currentTheme,
		isDarkTheme,
		giscusThemeUrl,
		setLoading,
		setError,
		setLoaded,
		setCommentCount,
		setTheme,
		setLanguage,
		initCommentSystem,
		updateGiscusTheme,
		refreshComments,
		init
	};
});
//#endregion
//#region src/stores/content.js
var useContentStore = defineStore("content", () => {
	const content = ref({});
	const loading = ref({});
	const errors = ref({});
	const cache = ref({});
	const isAnyLoading = computed(() => Object.values(loading.value).some(Boolean));
	const hasErrors = computed(() => Object.values(errors.value).some(Boolean));
	const setLoading = (type, id, isLoading) => {
		if (!loading.value[type]) loading.value[type] = {};
		loading.value[type][id] = isLoading;
	};
	const setError = (type, id, error) => {
		if (!errors.value[type]) errors.value[type] = {};
		errors.value[type][id] = error;
	};
	const clearError = (type, id) => {
		if (errors.value[type]) delete errors.value[type][id];
	};
	const setContent = (type, id, data) => {
		if (!content.value[type]) content.value[type] = {};
		content.value[type][id] = data;
		cacheContent(type, id, data);
	};
	const getContent = (type, id) => {
		if (content.value[type] && content.value[type][id]) return content.value[type][id];
		return getFromCache(type, id);
	};
	const cacheContent = (type, id, content) => {
		if (!cache.value[type]) cache.value[type] = {};
		cache.value[type][id] = {
			...content,
			cachedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (Object.keys(cache.value[type] || {}).length > 50) {
			const oldestKey = Object.keys(cache.value[type]).reduce((oldest, key) => {
				return cache.value[type][key].cachedAt < cache.value[type][oldest].cachedAt ? key : oldest;
			});
			delete cache.value[type][oldestKey];
		}
	};
	const getFromCache = (type, id) => {
		if (cache.value[type] && cache.value[type][id]) {
			const cachedAt = new Date(cache.value[type][id].cachedAt);
			if ((/* @__PURE__ */ new Date() - cachedAt) / (1e3 * 60 * 60) < 24) return cache.value[type][id];
			else delete cache.value[type][id];
		}
		return null;
	};
	const clearCache = (type, id) => {
		if (id) {
			if (cache.value[type]) delete cache.value[type][id];
		} else cache.value[type] = {};
	};
	const clearAllCache = () => {
		cache.value = {};
	};
	const init = () => {};
	return {
		content,
		loading,
		errors,
		cache,
		isAnyLoading,
		hasErrors,
		setLoading,
		setError,
		clearError,
		setContent,
		getContent,
		cacheContent,
		getFromCache,
		clearCache,
		clearAllCache,
		init
	};
});
//#endregion
//#region src/stores/dynamicEffects.js
var useDynamicEffectsStore = defineStore("dynamicEffects", () => {
	const isEnabled = ref(true);
	const effects = ref({
		sakura: true,
		snow: true,
		particles: true,
		mouseTrail: true,
		musicVisualizer: true
	});
	const animationDuration = ref(300);
	const hasAnyEffectEnabled = computed(() => {
		return Object.values(effects.value).some((effect) => effect);
	});
	const enabledEffects = computed(() => {
		return Object.keys(effects.value).filter((key) => effects.value[key]);
	});
	const toggleAllEffects = () => {
		isEnabled.value = !isEnabled.value;
		saveUserPreference();
	};
	const toggleEffect = (effectName) => {
		if (effects.value.hasOwnProperty(effectName)) {
			effects.value[effectName] = !effects.value[effectName];
			saveUserPreference();
		}
	};
	const enableAllEffects = () => {
		isEnabled.value = true;
		Object.keys(effects.value).forEach((effectName) => {
			effects.value[effectName] = true;
		});
		saveUserPreference();
	};
	const disableAllEffects = () => {
		isEnabled.value = false;
		Object.keys(effects.value).forEach((effectName) => {
			effects.value[effectName] = false;
		});
		saveUserPreference();
	};
	const loadUserPreference = () => {
		if (typeof window !== "undefined" && window.localStorage) {
			const savedEnabled = localStorage.getItem("dynamicEffectEnabled");
			if (savedEnabled !== null) isEnabled.value = savedEnabled === "true";
			const savedEffects = localStorage.getItem("dynamicEffects");
			if (savedEffects) try {
				const parsedEffects = JSON.parse(savedEffects);
				Object.keys(parsedEffects).forEach((effectName) => {
					if (effects.value.hasOwnProperty(effectName)) effects.value[effectName] = parsedEffects[effectName];
				});
			} catch (error) {
				console.error("[dynamicEffectsStore] 解析保存的效果配置失败:", error);
			}
		}
	};
	const saveUserPreference = () => {
		if (typeof window !== "undefined" && window.localStorage) {
			localStorage.setItem("dynamicEffectEnabled", isEnabled.value.toString());
			localStorage.setItem("dynamicEffects", JSON.stringify(effects.value));
		}
	};
	const resetToDefault = () => {
		isEnabled.value = true;
		effects.value = {
			sakura: true,
			snow: true,
			particles: true,
			mouseTrail: true,
			musicVisualizer: true
		};
		saveUserPreference();
	};
	return {
		isEnabled,
		effects,
		animationDuration,
		hasAnyEffectEnabled,
		enabledEffects,
		toggleAllEffects,
		toggleEffect,
		enableAllEffects,
		disableAllEffects,
		loadUserPreference,
		saveUserPreference,
		resetToDefault
	};
});
//#endregion
//#region src/stores/math.js
var useMathStore = defineStore("math", () => {
	const katexLoaded = ref(false);
	const loading = ref(false);
	const error = ref(null);
	const renderedCount = ref(0);
	const isKaTeXReady = computed(() => katexLoaded.value);
	const setKaTeXLoaded = (loaded) => {
		katexLoaded.value = loaded;
	};
	const setLoading = (isLoading) => {
		loading.value = isLoading;
	};
	const setError = (err) => {
		error.value = err;
	};
	const incrementRenderedCount = () => {
		renderedCount.value++;
	};
	const resetError = () => {
		error.value = null;
	};
	return {
		katexLoaded,
		loading,
		error,
		renderedCount,
		isKaTeXReady,
		setKaTeXLoaded,
		setLoading,
		setError,
		incrementRenderedCount,
		resetError
	};
});
//#endregion
//#region src/stores/mermaid.js
var useMermaidStore = defineStore("mermaid", () => {
	const mermaidLoaded = ref(false);
	const loading = ref(false);
	const error = ref(null);
	const renderedCount = ref(0);
	const isMermaidReady = computed(() => mermaidLoaded.value);
	const setMermaidLoaded = (loaded) => {
		mermaidLoaded.value = loaded;
	};
	const setLoading = (isLoading) => {
		loading.value = isLoading;
	};
	const setError = (err) => {
		error.value = err;
	};
	const incrementRenderedCount = () => {
		renderedCount.value++;
	};
	const resetError = () => {
		error.value = null;
	};
	return {
		mermaidLoaded,
		loading,
		error,
		renderedCount,
		isMermaidReady,
		setMermaidLoaded,
		setLoading,
		setError,
		incrementRenderedCount,
		resetError
	};
});
//#endregion
//#region src/stores/mouse.js
var useMouseStore = defineStore("mouse", {
	state: () => ({
		enabled: true,
		trailLength: 20,
		trailSpeed: 40,
		trailSize: 18,
		trailOpacity: 1,
		trailMode: "random",
		trailColor: "#3498db",
		trailChars: "!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
		isDarkTheme: false
	}),
	getters: {
		isTrailEnabled: (state) => state.enabled,
		currentTrailConfig: (state) => {
			return {
				length: state.trailLength,
				speed: state.trailSpeed,
				size: state.trailSize,
				opacity: state.trailOpacity,
				mode: state.trailMode,
				color: state.trailColor,
				chars: state.trailChars
			};
		}
	},
	actions: {
		setEnabled(enabled) {
			this.enabled = enabled;
		},
		setTrailLength(length) {
			this.trailLength = Math.max(5, Math.min(50, length));
		},
		setTrailSpeed(speed) {
			this.trailSpeed = Math.max(10, Math.min(100, speed));
		},
		setTrailSize(size) {
			this.trailSize = Math.max(8, Math.min(32, size));
		},
		setTrailMode(mode) {
			this.trailMode = mode;
		},
		setTrailColor(color) {
			this.trailColor = color;
		},
		setDarkTheme(isDark) {
			this.isDarkTheme = isDark;
		},
		resetConfig() {
			this.trailLength = 20;
			this.trailSpeed = 40;
			this.trailSize = 18;
			this.trailOpacity = 1;
			this.trailMode = "random";
			this.trailColor = "#3498db";
		}
	}
});
//#endregion
//#region src/stores/notification.js
var useNotificationStore = defineStore("notification", () => {
	const notifications = ref([]);
	const maxNotifications = ref(5);
	const defaultDuration = ref(1e4);
	const isDarkTheme = ref(false);
	const activeNotifications = computed(() => notifications.value);
	const notificationCount = computed(() => notifications.value.length);
	const addNotification = (message, type = "info", duration = null, buttons = []) => {
		if (notifications.value.length >= maxNotifications.value) notifications.value.shift();
		const id = Date.now().toString() + "-" + Math.floor(Math.random() * 1e3);
		const notification = {
			id,
			message,
			type,
			duration: duration || defaultDuration.value,
			buttons,
			timestamp: Date.now()
		};
		notifications.value.push(notification);
		if (notification.duration > 0) setTimeout(() => {
			removeNotification(id);
		}, notification.duration);
		return id;
	};
	const removeNotification = (id) => {
		const index = notifications.value.findIndex((n) => n.id === id);
		if (index !== -1) {
			notifications.value[index].isLeaving = true;
			setTimeout(() => {
				notifications.value.splice(index, 1);
			}, 300);
		}
	};
	const clearAllNotifications = () => {
		notifications.value = [];
	};
	const setMaxNotifications = (max) => {
		maxNotifications.value = Math.max(1, Math.min(10, max));
		while (notifications.value.length > maxNotifications.value) notifications.value.shift();
	};
	const setDefaultDuration = (duration) => {
		defaultDuration.value = Math.max(1e3, Math.min(1e4, duration));
	};
	const setDarkTheme = (isDark) => {
		isDarkTheme.value = isDark;
	};
	return {
		notifications,
		maxNotifications,
		defaultDuration,
		isDarkTheme,
		activeNotifications,
		notificationCount,
		addNotification,
		removeNotification,
		clearAllNotifications,
		setMaxNotifications,
		setDefaultDuration,
		setDarkTheme
	};
});
//#endregion
//#region src/stores/posts.js
var usePostsStore = defineStore("posts", () => {
	const posts = ref([]);
	const loading = ref(false);
	const error = ref(null);
	const searchKeyword = ref("");
	const sortBy = ref("date");
	const sortOrder = ref("desc");
	const filteredPosts = computed(() => {
		let filtered = [...posts.value];
		if (searchKeyword.value) {
			const keyword = searchKeyword.value.toLowerCase();
			filtered = filtered.filter((post) => post.title.toLowerCase().includes(keyword) || post.id.toLowerCase().includes(keyword));
		}
		filtered.sort((a, b) => {
			let comparison = 0;
			switch (sortBy.value) {
				case "date":
					comparison = new Date(b.date) - new Date(a.date);
					break;
				case "title":
					comparison = a.title.localeCompare(b.title);
					break;
				case "id":
					comparison = a.id.localeCompare(b.id);
					break;
			}
			return sortOrder.value === "desc" ? comparison : -comparison;
		});
		return filtered;
	});
	const postCount = computed(() => posts.value.length);
	const fetchPosts = async () => {
		loading.value = true;
		error.value = null;
		try {
			const response = await fetch("/config/search.json");
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			posts.value = (await response.json()).filter((post) => post.id !== "changelog");
		} catch (errorData) {
			error.value = errorData.message;
			console.error("[postsStore] 加载文章失败:", errorData);
		} finally {
			loading.value = false;
		}
	};
	const setSearchKeyword = (keyword) => {
		searchKeyword.value = keyword;
	};
	const setSortBy = (newSortBy) => {
		sortBy.value = newSortBy;
	};
	const setSortOrder = (newSortOrder) => {
		sortOrder.value = newSortOrder;
	};
	const toggleSortOrder = () => {
		sortOrder.value = sortOrder.value === "desc" ? "asc" : "desc";
	};
	const resetFilters = () => {
		searchKeyword.value = "";
		sortBy.value = "date";
		sortOrder.value = "desc";
	};
	return {
		posts,
		loading,
		error,
		searchKeyword,
		sortBy,
		sortOrder,
		filteredPosts,
		postCount,
		fetchPosts,
		setSearchKeyword,
		setSortBy,
		setSortOrder,
		toggleSortOrder,
		resetFilters
	};
});
//#endregion
//#region src/stores/tag.js
var useTagStore = defineStore("tag", () => {
	const tags = ref([]);
	const tagStats = ref([]);
	const sortBy = ref("frequency");
	const loading = ref(false);
	const error = ref(null);
	const lastLoaded = ref(null);
	const tagCache = ref(/* @__PURE__ */ new Map());
	const hasTags = computed(() => tags.value.length > 0);
	const getTagCount = computed(() => tags.value.length);
	const getPopularTags = computed(() => tagStats.value.slice(0, 10));
	const loadTags = async (articles) => {
		loading.value = true;
		error.value = null;
		try {
			const tagCounts = /* @__PURE__ */ new Map();
			const tagLastUsed = /* @__PURE__ */ new Map();
			articles.forEach((article) => {
				if (article.tags && Array.isArray(article.tags)) article.tags.forEach((tag) => {
					tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
					const currentDate = new Date(article.date).getTime();
					if (currentDate > (tagLastUsed.get(tag) || 0)) tagLastUsed.set(tag, currentDate);
				});
			});
			const stats = [];
			tagCounts.forEach((count, tag) => {
				stats.push({
					tag,
					count,
					frequency: count / articles.length,
					lastUsed: tagLastUsed.get(tag) || Date.now()
				});
			});
			stats.sort((a, b) => {
				switch (sortBy.value) {
					case "frequency": return b.frequency - a.frequency;
					case "count": return b.count - a.count;
					case "recent": return b.lastUsed - a.lastUsed;
					case "trending":
						const aTrend = a.count * (Date.now() - a.lastUsed) / 1e6;
						return b.count * (Date.now() - b.lastUsed) / 1e6 - aTrend;
					default: return b.count - a.count;
				}
			});
			tagStats.value = stats.slice(0, 50);
			tags.value = tagStats.value.map((item) => item.tag);
			lastLoaded.value = /* @__PURE__ */ new Date();
		} catch (err) {
			console.error("[tagStore] 加载标签失败:", err);
			error.value = "加载标签失败";
		} finally {
			loading.value = false;
		}
	};
	const getTagArticles = async (tag, articles) => {
		const cacheKey = `tag_articles_${tag}`;
		const cachedArticles = tagCache.value.get(cacheKey);
		if (cachedArticles) return cachedArticles;
		const filteredArticles = articles.filter((article) => article.tags && article.tags.includes(tag));
		if (filteredArticles.length > 0) tagCache.value.set(cacheKey, filteredArticles);
		return filteredArticles;
	};
	const getRelatedTags = (tag, limit = 5) => {
		return [];
	};
	const setSortBy = (newSortBy) => {
		sortBy.value = newSortBy;
		try {
			localStorage.setItem("tag_sort_preference", newSortBy);
		} catch (e) {
			console.warn("[tagStore] 无法保存标签排序偏好:", e);
		}
	};
	const resetError = () => {
		error.value = null;
	};
	const clearCache = () => {
		tagCache.value.clear();
		try {
			localStorage.removeItem("tag_sort_preference");
		} catch (e) {
			console.warn("[tagStore] 无法清除标签缓存:", e);
		}
	};
	return {
		tags,
		tagStats,
		sortBy,
		loading,
		error,
		lastLoaded,
		tagCache,
		hasTags,
		getTagCount,
		getPopularTags,
		loadTags,
		getTagArticles,
		getRelatedTags,
		setSortBy,
		resetError,
		clearCache
	};
});
//#endregion
//#region src/stores/toc.js
var useTocStore = defineStore("toc", () => {
	const show = ref(false);
	const activeId = ref("");
	const toc = ref([]);
	const lastScrollTime = ref(0);
	const scrollThrottleDelay = ref(100);
	const hasToc = computed(() => toc.value.length > 0);
	const activeItem = computed(() => {
		if (!activeId.value) return null;
		return toc.value.find((item) => item.id === activeId.value);
	});
	const tocDepth = computed(() => {
		if (toc.value.length === 0) return 0;
		return Math.max(...toc.value.map((item) => item.level));
	});
	const toggleToc = () => {
		show.value = !show.value;
		try {
			localStorage.setItem("toc_show_preference", show.value.toString());
		} catch (e) {
			console.warn("[tocStore] 无法保存目录显示偏好:", e);
		}
	};
	const setShow = (newShow) => {
		show.value = newShow;
		try {
			localStorage.setItem("toc_show_preference", newShow.toString());
		} catch (e) {
			console.warn("[tocStore] 无法保存目录显示偏好:", e);
		}
	};
	const setToc = (newToc) => {
		toc.value = newToc;
	};
	const setActiveId = (id) => {
		if (id !== activeId.value) activeId.value = id;
	};
	const scrollToHeading = (id) => {
		const element = document.getElementById(id);
		if (!element) return;
		const scrollContainers = [
			document.querySelector(".center-card-content"),
			document.querySelector(".post-content"),
			document.querySelector(".markdown-content")
		];
		let container = null;
		for (const potentialContainer of scrollContainers) if (potentialContainer && potentialContainer.contains(element)) {
			container = potentialContainer;
			break;
		}
		if (container) {
			const rect = element.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const relativeTop = rect.top - containerRect.top;
			container.scrollTo({
				top: container.scrollTop + relativeTop - 20,
				behavior: "smooth"
			});
		} else element.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const loadUserPreference = () => {
		try {
			const savedPreference = localStorage.getItem("toc_show_preference");
			if (savedPreference !== null) show.value = savedPreference === "true";
		} catch (e) {
			console.warn("[tocStore] 无法加载目录显示偏好:", e);
		}
	};
	const reset = () => {
		show.value = false;
		activeId.value = "";
		toc.value = [];
	};
	return {
		show,
		activeId,
		toc,
		lastScrollTime,
		scrollThrottleDelay,
		hasToc,
		activeItem,
		tocDepth,
		toggleToc,
		setShow,
		setToc,
		setActiveId,
		scrollToHeading,
		loadUserPreference,
		reset
	};
});
//#endregion
//#region src/stores/index.js
var pinia = createPinia();
//#endregion
export { useUserStore as _, useNotificationStore as a, useArticlesStore as b, useMathStore as c, useCommentStore as d, useCodeStore as f, useAnnouncementStore as g, useAudioStore as h, usePostsStore as i, useDynamicEffectsStore as l, useScrollStore as m, useTocStore as n, useMouseStore as o, useClipboardStore as p, useTagStore as r, useMermaidStore as s, pinia as t, useContentStore as u, useMusicStore as v, useThemeStore as y };
