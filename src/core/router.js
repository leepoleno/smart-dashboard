export class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/tasks';
        const route = this.routes[hash] || this.routes['/tasks'];
        
        if (route && this.currentRoute !== hash) {
            this.currentRoute = hash;
            await route.component.render(route.container);
            this.updateActiveNav(hash);
        }
    }

    updateActiveNav(route) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const itemRoute = item.getAttribute('data-route');
            if (route.includes(itemRoute)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    navigate(route) {
        window.location.hash = route;
    }
}