<script setup>
import WebsiteAge from './p-footer/WebsiteAge.vue'
import Copyright from './p-footer/CopyRight.vue'
</script>

<template>
    <footer class="footer-flex">
        <div class="footer-S">
            <nav class="footer-container">
                <div class="footer-card">
                    <WebsiteAge />
                    <Copyright />
                </div>
            </nav>
        </div>
    </footer>
</template>

<style scoped>
.footer-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
}

.footer-S {
    width: 95%;
    max-width: 1400px;
    margin: 0 auto;
}

.footer-container {
    width: 100%;
}

.footer-card {
    width: 100%;
    padding: 15px;
    background: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid var(--card-border);
    display: flex;
    flex-direction: column !important;
    gap: 10px;
    align-items: center;
}

.footer-card .footer-element-card {
    width: 80% !important;
    margin-bottom: 5px !important;
    border: 2px solid var(--footer-element-card-border-color);
    background-color: var(--card-bg);
    border-radius: 8px;
    padding: 10px;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.footer-card .footer-element-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}
</style>
