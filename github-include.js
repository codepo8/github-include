let styles = `
<style>
:host {
    --border-color: #ccc;
    --background-color: #eee;
    --text-color: #111;
    --link-color: #369;
}
@media (prefers-color-scheme: dark) {    
    :host {
        --border-color: #111;
        --background-color: #333;
        --text-color: #ccc;
        --link-color: #69c;
    }
}
div {
    font-family: sans-serif;
    border: 1px solid var(--border-color);
    line-height: 1.3em;
    padding: 1em;
    color:var(--text-color);
    margin: 1em 0;
    border-radius: 0.5em;
    background-color: var(--background-color);
}
p {
    font-size: 1em;
}
    a {
    text-decoration: none;
    color: var(--link-color);
}
a:hover, a:focus {
    text-decoration: underline;
}
div > a:nth-child(1) {
    background-image: url("data:image/svg+xml,<svg width='3em' height='3em' xmlns='http://www.w3.org/2000/svg' fill='grey' viewBox='0 0 200 200'><path d='M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z'/></svg>");
    background-repeat: no-repeat;
    line-height: 2em;
    min-height: 2em;
    display: inline-block;
    background-position: 0 0;
    padding-left: 2em;
}
</style>`;

let proxy = 'https://api.allorigins.win/raw?url=';
let suffix = '/commits/main.atom';
let user = '';
let repo = '';

const getsettings = (setting, source) => {
    if(source.nodeName === 'GITHUB-INCLUDE') {
        return source.getAttribute(setting);
    } else {
        return source.dataset[setting];
    }
}

const createpages = (from,container,user,repo) => {
    let pageslink = document.createElement('a');
    pageslink.classList.add('github-include-pages');
    pageslink.href = `https://${user}.github.io/${repo}/`;
    pageslink.target = '_blank';
    pageslink.rel = 'noopener';
    pageslink.title = `View GitHub Pages for ${repo}`;
    pageslink.innerHTML = getsettings('pages', from) === '' ? 'Demo' : getsettings('pages', from);
    container.appendChild(pageslink);
}

const getcommits = (from,container,user,repo) => {
    let links =  getsettings('links', from);
    links = links === "true" ? true : false;
    let commitheader = getsettings('commitheader', from) || 'Latest commits: ';
    let loadingmessage = getsettings('loadingmessage', from) || 'loading…';
    let p = document.createElement('p');
    p.className = 'github-include-commitheader';
    p.innerText = commitheader;
    container.appendChild(p);
    let origin = container.querySelector('a').href;
    let url = `${proxy}${encodeURIComponent(origin+suffix)}`;
    let list = document.createElement('ul');
    list.className = 'github-include-commits';
    container.appendChild(list);
    list.innerHTML = loadingmessage;
    fetch(url, {"method": "GET"})
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let items = data.querySelectorAll("entry");
            let out = '';
            if (getsettings('commits', from) !== "-1") {
                items = Array.from(items).slice(0, +getsettings('commits', from));
            }
            items.forEach(el => {
                let title = el.querySelector("title").innerHTML;
                let link = el.querySelector("link").getAttribute('href');
                out += `<li>
                    ${links ? `<a href="${link}">` : ''}
                    ${title.trim()}
                    ${links  ? `</a>` : ''}
                </li>`;
            });
            list.innerHTML = out;
        });

}

// Web Component
class gitHubInclude extends HTMLElement {
    constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `${styles}<div></div>`;
    let old = this.innerHTML;
    let container = this.shadowRoot.querySelector('div');
    let chunks = this.querySelector('a').getAttribute('href').split('/');
    repo = chunks.pop();
    user = chunks.pop();
    container.innerHTML += old;
    if (getsettings('pages', this) !== null) { createpages(this, container, user, repo); } 
    if (getsettings('commits', this)) { getcommits(this, container, user, repo); }
    }
}
customElements.define('github-include', gitHubInclude);

// Plain HTML instances
const githubInclude = container => {
    let origin = container.querySelector('a');
    origin.classList.add('github-include-origin');
    let chunks = container.querySelector('a').href.split('/');
    repo = chunks.pop();
    user = chunks.pop();
    if (getsettings('pages', container)) {
        createpages(container, container, user, repo);
    } 
    if (getsettings('commits', container)) {
        getcommits(container, container, user, repo);
    }
}
document.querySelectorAll('.github-include').forEach(el => githubInclude(el))

