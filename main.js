// --- 1. GESTION DES STATISTIQUES ---
let phantmStats = JSON.parse(localStorage.getItem('phantm_stats')) || {};

const triggerAd = (slug) => {
    if (!slug) return;
    phantmStats[slug] = (phantmStats[slug] || 0) + 1;
    localStorage.setItem('phantm_stats', JSON.stringify(phantmStats));
    console.clear();
    console.table(phantmStats);
};

// --- 2. FONCTION BARON (DESSIN) ---
const triggerArt = () => {
    const modalText = document.querySelector('.modal-text');
    if (modalText && !document.getElementById('discussion-container')) {
        const originalContent = modalText.innerHTML;
        modalText.innerHTML = `
            <div id="discussion-container" style="text-align:center; animation: fadeIn 0.4s ease; width: 100%;">
                <img src="images/BaronNosferatu.png" alt="Baron" style="max-width: 100%; max-height: 280px; border-radius: 12px; border: 2px solid #28a745; margin-bottom:15px;">
                <p style="color:#28a745; font-family: monospace; font-weight: bold;">[ SESSION BARON ACTIVÉE ]</p>
                <button id="back-to-article" style="margin-top:10px; background: none; border: 1px solid #28a745; color: #28a745; padding: 5px 15px; cursor: pointer; border-radius: 6px;">Retour</button>
            </div>
        `;
        document.getElementById('back-to-article').onclick = () => { modalText.innerHTML = originalContent; };
    }
};

// --- 3. MENTIONS LÉGALES ---
function openLegalModal() {
    const modal = document.getElementById('article-modal');
    const legalContent = document.getElementById('legal-content');
    if (modal && legalContent) {
        document.getElementById('modal-title').textContent = "Informations Légales";
        document.querySelector('.modal-text').innerHTML = legalContent.innerHTML;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// --- 4. INJECTION PUB NATIVE (LISTE) ---
const injectInFeedAd = () => {
    const articles = document.querySelectorAll('.article-item');
    if (articles.length >= 2) {
        const adCard = document.createElement('div');
        adCard.className = 'article-item'; 
        adCard.innerHTML = `
            <div class="article-meta">05 Février 2026</div>
            <div class="article-title">Découvrez Phant_m</div>
            <div class="article-author">Admin</div>
        `;
        articles[1].after(adCard);
        adCard.onclick = (e) => {
            e.stopPropagation();
            triggerAd('native-feed-ad');
            window.open('https://google.com', '_blank');
        };
    }
};

// --- 5. INITIALISATION GLOBALE ---
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            pages.forEach(p => p.classList.toggle('active', p.id === targetId));
        });
    });

    // --- GESTION DES MENTIONS LÉGALES (DESKTOP + MOBILE) ---
const openLegal = (e) => { 
    e.preventDefault(); 
    openLegalModal(); 
};

const legalLink = document.getElementById('legal-link');
const legalLinkMobile = document.getElementById('legal-link-mobile');

if (legalLink) legalLink.onclick = openLegal;
if (legalLinkMobile) legalLinkMobile.onclick = openLegal;

    // Sidebar Ad Clic
    const sidebarAd = document.querySelector('.ad-sidebar-container');
    if (sidebarAd) sidebarAd.onclick = () => triggerAd('sidebar-fixed-ad');

    initModal();
    initCanvasAnimation();
    injectInFeedAd(); 
});

function initModal() {
    const modal = document.getElementById('article-modal');
    const articles = document.querySelectorAll('.article-item');

    articles.forEach(article => {
        article.onclick = () => {
            // Sécurité : ne pas ouvrir la modale si c'est la pub native
            if (article.querySelector('.article-title').textContent.includes("Écosystème")) return;

            const slug = article.getAttribute('data-slug') || "art";
            document.getElementById('modal-title').textContent = article.querySelector('.article-title').textContent;
            document.getElementById('modal-date').textContent = article.querySelector('.article-meta').textContent;
            document.getElementById('modal-author').textContent = article.querySelector('.article-author').textContent;
            
            // BANNIÈRE DANS L'ARTICLE
            const content = article.querySelector('.full-article-content')?.innerHTML || "";
            const adBanner = `
                <div class="article-ad-box" style="margin-top:25px; padding:20px; background:#fcfcfc; border-radius:15px; border:1px solid #eee; text-align:center;">
                    <small style="color:#bbb; font-size:0.7rem;">PUBLICITÉ</small>
                    <div style="margin-top:10px; color:#444; font-weight:bold;">Sponsor de l'article</div>
                    <button style="margin-top:10px; padding:5px 15px; border-radius:20px; border:1px solid #d7e3fc; background:white; cursor:pointer;" onclick="triggerAd('internal-article-ad')">En savoir plus</button>
                </div>
            `;
            
            document.querySelector('.modal-text').innerHTML = content + adBanner;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            triggerAd(slug);
        };
    });

    document.querySelectorAll('.modal-action-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            if (btn.classList.contains('share-btn')) {
                triggerArt();
            } else {
                triggerAd('btn-engagement');
            }
        };
    });

    document.querySelector('.close-modal').onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
}

function initCanvasAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const resize = () => {
        width = canvas.width = window.innerWidth - (window.innerWidth > 768 ? 200 : 0);
        height = canvas.height = window.innerHeight;
    };
    window.onresize = resize;
    resize();
    const drops = new Array(Math.floor(width / 14)).fill(1);
    setInterval(() => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = '14px monospace';
        ctx.fillStyle = '#d7e3fc';
        drops.forEach((y, i) => {
            ctx.fillText('01'[Math.floor(Math.random()*2)], i * 14, y * 14);
            if (y * 14 > height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 50);
}