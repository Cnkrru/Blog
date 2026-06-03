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
    padding: 16px 24px;
    border-radius: 16px;
    display: flex;
    flex-direction: column !important;
    gap: 8px;
    align-items: center;
}

.footer-element-card {
    width: 80% !important;
    border-radius: 14px;
    padding: 8px 20px;
    border: 1px solid;
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>

<style scoped>
.footer-element-card {
    background: rgba(255, 192, 203, 0.15);
    border-color: rgba(255, 192, 203, 0.25);
    color: var(--common-text);
}

body.dark-theme .footer-element-card {
    background: rgba(58, 170, 231, 0.1);
    border-color: rgba(58, 170, 231, 0.2);
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
