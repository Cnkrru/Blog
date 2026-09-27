<script setup>
import Wechat from '@/components/icon/share/Wechat.vue';
import QQIcon from '@/components/icon/share/QQIcon.vue';
import Weibo from '@/components/icon/share/Weibo.vue';
import Telegram from '@/components/icon/share/Telegram.vue';
import Facebook from '@/components/icon/share/Facebook.vue';
import XIcon from '@/components/icon/share/XIcon.vue';
import Copy from '@/components/icon/Copy.vue';
import X from '@/components/icon/X.vue';
import Share from '@/components/icon/share/Share.vue';
import Heart from '@/components/icon/Heart.vue';

import {content} from '@/modules/content.js'
import { nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

// 链接参数：文章链接和标题（按当前路由动态拼，不写死 id）
const title = `https://blog.cnkrru.top${route.path}`;
const url = `https://blog.cnkrru.top${route.path}`;

const share = content.share_maker(url,title);

// 二维码参数，HTML标签
const qrcode_canvas = ref(null)

/*
* id: 链接按钮
* fn: 根据平台跳转到指定链接
*/
const link_btn = (platform) => {
    try {
        window.open(share.link_maker(platform), '_blank', 'noopener');
        console.log(`[INFO]:${platform}链接打开成功`)
    }
    catch {
        console.error('[ERR]:打开链接失败')
    }
}

/*
* id: 二维码按钮
* fn: 显隐二维码
*/
const qrcode_open = async () => {
    await nextTick();
    share.qrcode_maker(qrcode_canvas.value);
    document.querySelector('.qrcode-dialog').showModal()
}

const qrcode_close = () => {
    document.querySelector('.qrcode-dialog').close()
}

/*
* id: 复制按钮
* fn: 封装换个名，统一一下API而已
*/
const copy_btn = () => {
    share.copy_maker()
}


const toast = content.toast_maker()
</script>

<template>
    <div class="share-area">
        <!-- 这里多包一层主要是为了画border -->
        <div class="share-box">
            <!-- 分享图标 -->
            <Share class="share-icon"/>
            <!-- 分享字串 -->
            <p class="share-text">分享这篇文章</p>
            <!-- 按钮列表 -->
            <div class="btn-list">
                <button class="btn weixin" @click="qrcode_open"><Wechat/></button>
                <button class="btn qq" @click="link_btn('qq')"><QQIcon/></button>
                <button class="btn weibo" @click="link_btn('weibo')"><Weibo/></button>
                <button class="btn tg" @click="link_btn('tg')"><Telegram/></button>
                <button class="btn facebook" @click="link_btn('facebook')"><Facebook/></button>
                <button class="btn x" @click="link_btn('x')"><XIcon/></button>
                <button class="btn copy-btn" @click="[copy_btn,toast.toast_open('success','已成功复制链接')]"><Copy/></button>
            </div>

            <div class="divider"></div>

            <a href="https://ifdian.net/a/Cnkrru" class="sponser-btn">
                <Heart class="sponser-icon"/>
                <p>赞助</p>
            </a>

            <!-- 微信分享的弹窗 -->
            <dialog class="qrcode-dialog">
                <div class="dialog-head">
                    <p>微信分享二维码</p>
                    <button class="dialog-close" @click="qrcode_close"><X/></button>
                </div>
                <canvas ref="qrcode_canvas"></canvas>
            </dialog>
        </div>
    </div>
</template>

<style scoped>
.share-area {
    width: 100%;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
}

.share-box {
    width: fit-content;
    height: max-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-sm);

    padding: var(--space-md);
    /* [AI对齐] 边框 12% → 25%，提升可见度（12% 太浅不明显） */
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--space-lg);
}

.share-icon {
    color: var(--g-text);
    opacity: 0.6;
}

.share-text {
    color: var(--g-text);
    opacity: 0.6;
}

.btn-list {
    width:fit-content ;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);
}

.btn {
    width: 40px;
    height: 40px;
    
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: var(--radius-sm);
    border: var(--border-width) solid var(--g-color); 
}

.weixin {
    background: #07c160;
    border-color: #06ad56;
    color: #fff;
}
.weixin:hover {
    background: #06ad56;
}

.qq {
    background: #12b7f5;
    border-color: #0fa5d8;
    color: #fff;
}
.qq:hover {
    background: #0fa5d8;
}

.weibo {
    background: #e6162d;
    border-color: #c81023;
    color: #fff;
}
.weibo:hover {
    background: #c81023;
}

.tg {
    background: #229ed9;
    border-color: #1b8ac0;
    color: #fff;
}
.tg:hover {
    background: #1b8ac0;
}

.facebook {
    background: #1877f2;
    border-color: #1466ce;
    color: #fff;
}
.facebook:hover {
    background: #1466ce;
}

.x {
    background: #000000;
    border-color: #111111;
    color: #fff;
}
.x:hover {
    background: #111111;
}

.copy-btn {
    background: var(--g-color);
    border-color: var(--g-hover);
    color: #fff;
}
.copy-btn:hover {
    background: var(--g-hover);
}

/* ==========<微信弹窗>========== */
.qrcode-dialog {  

    gap: var(--space-sm);
}

.qrcode-dialog[open] {
    width: fit-content;
    height: fit-content;

    padding: var(--space-md);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
    border-radius: var(--radius-md);  

    display: flex;            
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);
}

.dialog-head {
    width: 100%;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-sm);
}

.dialog-close {
    border-radius: var(--radius-md); 
    background-color: white;        
}

/* ==========<赞助组件>========== */
.divider {
    width: 1px;
    align-self: stretch;
    background-color: color-mix(in srgb, var(--g-color) 12%, transparent);
}

/* [AI对齐] 去掉赞助链接下划线 + 修复高度塌陷（10px → fit-content，图标不再被压扁） */
.sponser-btn {
    width: fit-content;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);

    flex-direction: row;
    text-decoration: none;
}

.sponser-icon {
    color: var(--g-color);
}

.sponser-btn p {
    color: var(--g-color);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机：分享盒改列向堆叠，按钮列表允许换行，避免七个按钮横向溢出 */
    .share-box {
        width: 100%;
        flex-direction: column;
        gap: var(--space-sm);
    }
    .btn-list {
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-xs);
    }
    .btn {
        width: 36px;
        height: 36px;
    }
    /* 分隔线小屏隐藏，避免换行后挤占布局 */
    .divider {
        display: none;
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏：进一步收紧按钮与文字 */
    .btn {
        width: 32px;
        height: 32px;
    }
    .share-text {
        font-size: 13px;
    }
}

</style>