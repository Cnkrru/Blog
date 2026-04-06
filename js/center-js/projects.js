/*==============================项目展示功能==============================*/

document.addEventListener('DOMContentLoaded', function() {
    /*==========获取项目容器==========*/
    const projectsContainer = document.getElementById('projects-container');
    
    if (!projectsContainer) return;

    /*==========获取路径前缀==========*/
    function getPathPrefix() {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length - 1;
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += '../';
        }
        return prefix;
    }

    /*==========加载项目数据==========*/
    async function loadProjects() {
        try {
            const prefix = getPathPrefix();
            // 使用原生fetch API加载数据
            const response = await fetch(`${prefix}config/projects.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            renderProjects(data.projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    /*==========渲染项目列表==========*/
    function renderProjects(projects) {
        const prefix = getPathPrefix();
        projectsContainer.innerHTML = '';
        
        projects.forEach(project => {
            const link = document.createElement('a');
            link.href = `projects/project-${project.id}.html`;
            
            const card = document.createElement('div');
            card.className = 'archives-center-list-card';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = 'archives-center-list-card-header';
            
            const img = document.createElement('img');
            img.src = `${prefix}${project.image}`;
            img.alt = project.name;
            
            const cardName = document.createElement('div');
            cardName.className = 'archives-center-list-card-name';
            cardName.textContent = project.name;
            
            cardHeader.appendChild(img);
            card.appendChild(cardHeader);
            card.appendChild(cardName);
            link.appendChild(card);
            projectsContainer.appendChild(link);
        });
    }

    /*==========加载项目数据==========*/
    loadProjects();
});
