<script setup>
import { ref } from 'vue';
import X from '../icon/X.vue';
/* ====================<不蒜子统计官方脚本>==================== */
(()=>{
    if(window.busuanziRequestSent)
        return;
    window.busuanziRequestSent=true;
    const u=new URL('https://cdn.busuanzi.cc/');
    fetch(u.protocol+'//'+u.host+'/api.php',
        {method:'POST',
            body:JSON.stringify({url:location.href,referrer:document.referrer})
        }
    )
    .then(r=>r.json())
    .then(r=>{for(const k in r)document.querySelectorAll('#'+k)
        .forEach(e=>e.innerText=r[k])})
        .catch(e=>console.error(e))})()

/* ====================<不蒜子UI控制>==================== */
const bsz_open = () => {
    document.querySelector('.bsz-box').showModal()
}

const bsz_close = () => {
    document.querySelector('.bsz-box').close()
}
</script>

<template>
    <button class="bsz-btn" @click="bsz_open">统计</button>

    <dialog class="bsz-box">
        <div class="bsz-header">
            <p>站点统计</p>
            <button @click="bsz_close"><X/></button>
        </div>

        <div class="bsz-body">
            <div class="bsz-row">
                <span class="bsz-ui" id="busuanzi_today_pv"></span>
                <span class="bsz-ui"  id="busuanzi_today_uv"></span>
            </div>
            <div class="bsz-row">
                <span  class="bsz-ui" id="busuanzi_site_pv"></span>
                <span  class="bsz-ui" id="busuanzi_site_uv"></span>
            </div>
            <div class="bsz-row">
                <span  class="bsz-ui" id="busuanzi_page_pv"></span>
                <span  class="bsz-ui" id="busuanzi_page_uv"></span>
            </div>
        </div>

        <div class="bsz-footer">
            <p>Power by</p>
            <a href="https://www.busuanzi.cc/">不蒜子</a>
        </div>
    </dialog>
</template>

<style scoped>
.bsz-btn {
    width: 90%;
    height: fit-content;
    min-height: 40px;

    padding: var(--space-sm);
    border-radius: var(--radius-md);

    color: var(--g-text);

    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 30%, transparent);
    background: color-mix(in srgb, var(--g-color) 30%, transparent);
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease;
}

.bsz-btn:hover {
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--g-color) 50%, transparent);
    border-color: color-mix(in srgb, var(--g-color) 45%, transparent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.bsz-box {
    width: 400px;
    height: 400px;

    border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent);
    border-radius: var(--radius-lg);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.95);

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    
    box-shadow: 0 20px 60px var(--common-shadow);
    padding: 20px;
}

.bsz-box::backdrop {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.bsz-header {
    width: 100%;
    height: 10%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 60%;
}

.bsz-header p {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--g-text);
}

.bsz-header button {
    width: 28px;
    height: 28px;
    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent);
    background: color-mix(in srgb, var(--g-text) 8%, transparent);
    color: var(--g-text);
    cursor: pointer;
    transition: background 0.2s ease;
}

.bsz-header button:hover {
    background: color-mix(in srgb, var(--g-text) 18%, transparent);
}

.bsz-body {
    width: 100%;
    height: 80%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.bsz-row {
    width: 100%;
    height: 33%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    gap:var(--space-sm); 
}

.bsz-footer {
    width: 100%;
    height: 10%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    text-align: center;
    font-size: 11px;
    opacity: 0.4;
}

.bsz-footer p {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--g-text);
}

.bsz-footer a {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--g-color);
}

.bsz-ui {
    width: 30% ;
    height: fit-content ;

    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 20%, transparent);
    border-radius: var(--radius-md);

    padding:  var(--space-sm);
    text-align: center;
    background: color-mix(in srgb, var(--g-color) 15%, transparent); 
    color: var(--g-color);
    font-size: 16px;
    font-weight: 700;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>