<script setup lang="ts">
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
    border-radius: 12px;
    border: 3px solid var(--common-color-1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column !important;
    gap: 10px;
    align-items: center;
}

.footer-element-card {
    width: 80% !important;
    margin-bottom: 5px !important;;
    border-radius: 8px;
    padding: 10px;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>

<style scoped>
.footer-card {
    background-color: var(--common-bg);
}

.footer-element-card {
    background-color: var(--common-color-1);
}
</style>

<style scoped>
@media (max-width: 480px) {
    .footer-S {
        height: auto;
        padding: 6px 0;
    }
    .footer-card {
        padding: 6px;
    }
    .footer-element-card {
        width: 95%;
        padding: 6px;
    }
}

@media (max-width: 768px) {
    .footer-S {
        height: auto;
        padding: 10px 0;
    }
}

@media (min-width: 1281px) {
    .footer-S {
        max-width: 1400px;
    }
}
</style>
