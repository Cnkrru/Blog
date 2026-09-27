<script setup>
import { computed, onMounted, ref } from 'vue';
import { data } from '@/modules/data';

import Cloud from '../icon/Cloud.vue';
import CloudDrizzle from '../icon/CloudDrizzle.vue';
import CloudFog from '../icon/CloudFog.vue';
import CloudLightning from '../icon/CloudLightning.vue';
import CloudSnow from '../icon/CloudSnow.vue';
import Light from '../icon/Light.vue';

// UI数据
const ip_city = ref('')
const weather_number = ref(0)
let weather_code = 0

// 图标映射
const is_icon = computed(() => {
    if (weather_code === 0) return Light;
    if (weather_code <= 3) return Cloud;
    if (weather_code <= 49) return CloudFog;
    if (weather_code <= 59) return CloudDrizzle;
    if (weather_code <= 69) return CloudSnow;
    if (weather_code <= 82) return CloudDrizzle;
    if (weather_code <= 86) return CloudSnow;
    if (weather_code <= 99) return CloudLightning;
    return Light;
});
/* ====================<ip>==================== */


onMounted(async () => {
    // ip数据获取
    ip_city.value = (await data.ip_data_getter()).city
    // weather数据获取
    const _weather = await data.weather_data_getter()
    weather_code = _weather.current.weather_code
    weather_number.value = Math.round(_weather.current.temperature_2m); 
})
</script>

<template>
    <div class="weather-ip">
        <component :is="is_icon" class="icon"/>
        <span class="weather-number">{{ weather_number }}°</span>
        <span class="ip">{{ ip_city }}</span>
    </div>
</template>

<style scoped>
.weather-ip {
    width: 75%;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap:var(--space-sm);

    border-radius: var(--radius-full);
    border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent); 
    padding:var(--space-sm);

    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);    
}

.weather-ip .icon {
    color: var(--g-color);
}

.weather-number {
    font-size: 14px;    
    font-weight: 600;
    color: var(--g-text);    
}

.ip {
    width: fit-content;
    height: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 11px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--g-text);    
}

</style>