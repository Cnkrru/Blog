<script setup>
import { onMounted } from 'vue';
import { ip, weather } from '@/composables/psidebar';

const { ref_city, data: ip_data } = ip();
const { ref_weartherNum, data: weather_data } = weather();

onMounted(async () => {
    await ip_data();
    await weather_data();
})
</script>

<template>
    <div class="weather-ip">
        <span class="weather-number">{{ ref_weartherNum }}°</span>
        <span class="ip">{{ ref_city }}</span>
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