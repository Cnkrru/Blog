<script setup lang="ts">
</script>

<template></template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.global-music-player {
    position: fixed;
    bottom: 10px;
    left: 0;
    width: 100%;
    z-index: 1001;
    transform: translateY(calc(100% + 10px));
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.global-music-player.active {
    transform: translateY(0);
}

.player-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
    backdrop-filter: blur(10px);
}

.player-cover {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    position: relative;
}

.player-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.player-cover::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.player-cover.playing::before {
    opacity: 1;
}

.player-meta {
    min-width: 0;
    flex-shrink: 1;
    max-width: 200px;
}

#player-title {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

#player-artist {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.player-progress {
    flex: 1;
    min-width: 0;
    margin: 0 16px;
}

.progress-bar {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

#progress-fill {
    height: 100%;
    border-radius: 3px;
    width: 0%;
    transition: width 0.1s linear;
    position: relative;
}

#progress-fill::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.progress-bar:hover #progress-fill::after {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
}

.time-display {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-top: 6px;
    font-family: 'Courier New', monospace;
}

.player-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.control-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.control-btn:hover {
    transform: scale(1.05);
}

.control-btn img {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.play-btn {
    width: 50px;
    height: 50px;
}

.play-btn:hover {
    transform: scale(1.1);
}

.play-btn img {
    width: 20px;
    height: 20px;
}

.player-volume {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    margin-left: 16px;
}

.volume-bar {
    width: 80px;
    height: 6px;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

#volume-fill {
    height: 100%;
    border-radius: 3px;
    width: 80%;
    transition: width 0.1s linear;
    position: relative;
}

#volume-handle {
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.volume-bar:hover #volume-handle {
    transform: translateY(-50%) scale(1.1);
}

.list-btn {
    margin-left: 0;
}

.pause-icon,
.mute-icon,
.volume-low-icon {
    display: none;
}

.playing .pause-icon,
.muted .mute-icon,
.volume-low .volume-low-icon {
    display: block;
}

.playing .play-icon,
.muted .volume-icon,
.volume-low .volume-icon {
    display: none;
}

.player-list {
    display: flex;
    align-items: center;
}

.player-playlist {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.player-playlist.active {
    display: flex;
}

.playlist-container {
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

.playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-radius: 16px 16px 0 0;
}

.playlist-header h3 {
    font-size: 18px;
    font-weight: 600;
}

.close-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
}

.close-btn:hover {
    transform: scale(1.1);
}

.close-btn svg {
    width: 20px;
    height: 20px;
}

.playlist-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
}

.playlist-content::-webkit-scrollbar {
    width: 6px;
}

.playlist-content::-webkit-scrollbar-track {
    border-radius: 3px;
}

.playlist-content::-webkit-scrollbar-thumb {
    border-radius: 3px;
}

.playlist-items {
    list-style: none;
}

.playlist-items li {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.playlist-items li:hover {
    transform: translateX(4px);
}

.playlist-items li.active {
    border-left: 4px solid;
}

.playlist-items img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    margin-right: 16px;
}

.playlist-item-info {
    flex: 1;
    min-width: 0;
}

.playlist-item-title {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.playlist-item-artist {
    font-size: 12px;
}

.playlist-item-status {
    font-size: 16px;
    margin-left: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.playlist-items li.active .playlist-item-status {
    opacity: 1;
}
</style>

<style>
.player-content {
    background: linear-gradient(135deg, 
        var(--common-color-1), 
        var(--common-color-2));
    box-shadow: 0 8px 32px var(--common-shadow);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.player-cover img {
    box-shadow: 0 4px 12px var(--common-shadow);
}

.player-cover::before {
    background: linear-gradient(45deg, var(--common-color-1), transparent);
}

#player-title {
    color: var(--common-text);
}

#player-artist {
    color: var(--common-text);
}

.progress-bar {
    background: rgba(255, 255, 255, 0.3);
}

.progress-bar::before {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
}

#progress-fill {
    background: linear-gradient(90deg, var(--common-color-1), #ff9900);
}

#progress-fill::after {
    background: var(--common-color-1);
    box-shadow: 0 2px 8px var(--common-shadow);
}

.time-display {
    color: var(--common-text);
}

.control-btn {
    background: rgba(255, 255, 255, 0.2);
    color: var(--common-text);
}

.control-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px var(--common-shadow);
}

.control-btn img {
    filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(90deg) brightness(90%) contrast(100%);
}

.control-btn:hover img {
    filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(90deg) brightness(100%) contrast(100%);
}

.play-btn {
    background: linear-gradient(135deg, var(--common-color-1), #ff9900);
    color: white;
    box-shadow: 0 4px 16px rgba(255, 103, 0, 0.4);
}

.play-btn:hover {
    background: linear-gradient(135deg, #ff7a18, #ffb347);
    box-shadow: 0 6px 20px rgba(255, 103, 0, 0.5);
}

.play-btn img {
    filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(90deg) brightness(100%) contrast(100%);
}

.volume-bar {
    background: rgba(255, 255, 255, 0.3);
}

.volume-bar::before {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
}

#volume-fill {
    background: linear-gradient(90deg, var(--common-color-1), #ff9900);
}

#volume-handle {
    background: var(--common-color-1);
    box-shadow: 0 2px 8px var(--common-shadow);
}

.player-playlist {
    background: rgba(0, 0, 0, 0.7);
}

.playlist-container {
    background: var(--common-bg);
    box-shadow: 0 12px 48px var(--common-shadow);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-header {
    border-bottom: 1px solid var(--common-color-1);
    background: linear-gradient(135deg, var(--common-color-1), var(--common-color-2));
}

.playlist-header h3 {
    color: white;
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.playlist-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
}

.playlist-content::-webkit-scrollbar-thumb {
    background: var(--common-color-1);
}

.playlist-items li {
    border-bottom: 1px solid var(--common-color-1);
}

.playlist-items li:hover {
    background: var(--common-hover);
}

.playlist-items li.active {
    background: var(--common-hover);
    border-left: 4px solid var(--common-color-1);
}

.playlist-items img {
    box-shadow: 0 2px 8px var(--common-shadow);
}

.playlist-item-title {
    color: var(--common-text);
}

.playlist-item-artist {
    color: var(--common-text);
}

.playlist-item-status {
    color: var(--common-color-1);
}
</style>

<style>
@media (max-width: var(--md)) {
    .player-content {
        padding: 12px 16px;
        gap: 16px;
    }
    
    .player-cover {
        width: 50px;
        height: 50px;
    }
    
    .player-meta {
        max-width: 150px;
    }
    
    #player-title {
        font-size: 14px;
    }
    
    #player-artist {
        font-size: 12px;
    }
    
    .player-progress {
        margin: 0 8px;
    }
    
    .player-controls {
        gap: 8px;
    }
    
    .control-btn {
        width: 36px;
        height: 36px;
    }
    
    .play-btn {
        width: 44px;
        height: 44px;
    }
    
    .player-volume {
        margin-left: 8px;
    }
    
    .volume-bar {
        width: 60px;
    }
    
    .list-btn {
        margin-left: 8px;
    }
}

@media (max-width: var(--sm)) {
    .player-content {
        flex-wrap: wrap;
        padding: 12px;
    }
    
    .player-cover {
        width: 44px;
        height: 44px;
    }
    
    .player-meta {
        max-width: calc(100% - 160px);
    }
    
    .player-progress {
        order: 99;
        width: 100%;
        margin: 12px 0 0 0;
    }
    
    .player-volume {
        display: none;
    }
}
</style>
