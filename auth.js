// ============ LumiLearn Authentication System ============

// Vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
  const user = localStorage.getItem('lumilearn_user') || sessionStorage.getItem('lumilearn_user');
  return user !== null;
}

// Récupérer les informations de l'utilisateur connecté
function getCurrentUser() {
  const userStr = localStorage.getItem('lumilearn_user') || sessionStorage.getItem('lumilearn_user');
  return userStr ? JSON.parse(userStr) : null;
}

// Déconnexion
function logout() {
  localStorage.removeItem('lumilearn_user');
  sessionStorage.removeItem('lumilearn_user');
  window.location.href = 'indexSIGHT.html';
}

// Protéger une page (à appeler au début des pages protégées)
function protectPage() {
  if (!isUserLoggedIn()) {
    // Sauvegarder l'URL actuelle pour rediriger après connexion
    const currentPage = window.location.pathname.split('/').pop();
    window.location.href = `login.html?return=${currentPage}`;
  }
}

// Mettre à jour le bouton de connexion dans le header
function updateAuthButton() {
  const user = getCurrentUser();
  const loginBtns = document.querySelectorAll('.login-btn');
  
  if (user) {
    loginBtns.forEach(btn => {
      btn.textContent = `👤 ${user.name}`;
      btn.onclick = (e) => {
        e.preventDefault();
        showUserMenu();
      };
    });
  } else {
    loginBtns.forEach(btn => {
      btn.textContent = '👤 Connexion';
      btn.href = 'login.html';
      btn.onclick = null;
    });
  }
}

// Afficher le menu utilisateur
function showUserMenu() {
  const user = getCurrentUser();
  const menu = `
    <div style="
      position: fixed;
      top: 70px;
      right: 20px;
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 1000;
      min-width: 200px;
    " id="userMenuPopup">
      <div style="text-align: center; margin-bottom: 15px;">
        <div style="font-size: 40px; margin-bottom: 10px;">👤</div>
        <h4 style="margin: 0; color: #FF91AF;">${user.name}</h4>
        <p style="font-size: 0.85em; color: #666; margin: 5px 0 0 0;">${user.email}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 15px 0;">
      <button onclick="closeUserMenu(); window.location.href='profile.html'" style="
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #FF91AF, #6ED3CF);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        margin-bottom: 10px;
        font-family: 'Poppins', sans-serif;
      ">
        📝 Mon Profil
      </button>
      <button onclick="logout()" style="
        width: 100%;
        padding: 12px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-family: 'Poppins', sans-serif;
      ">
        🚪 Déconnexion
      </button>
    </div>
  `;
  
  // Supprimer le menu existant s'il y en a un
  const existingMenu = document.getElementById('userMenuPopup');
  if (existingMenu) {
    existingMenu.remove();
  } else {
    document.body.insertAdjacentHTML('beforeend', menu);
    
    // Fermer le menu en cliquant à l'extérieur
    setTimeout(() => {
      document.addEventListener('click', closeUserMenuOnClickOutside);
    }, 100);
  }
}

function closeUserMenu() {
  const menu = document.getElementById('userMenuPopup');
  if (menu) {
    menu.remove();
    document.removeEventListener('click', closeUserMenuOnClickOutside);
  }
}

function closeUserMenuOnClickOutside(e) {
  const menu = document.getElementById('userMenuPopup');
  if (menu && !menu.contains(e.target) && !e.target.classList.contains('login-btn')) {
    closeUserMenu();
  }
}

// Initialiser l'authentification au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  updateAuthButton();
  
  // Vérifier si la page actuelle est protégée
  const protectedPages = ['quiz.html', 'audio.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    protectPage();
  }
});

// Ajouter un message de bienvenue sur les pages protégées
function showWelcomeMessage() {
  const user = getCurrentUser();
  if (user && !sessionStorage.getItem('welcomed')) {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: linear-gradient(135deg, #FF91AF, #6ED3CF);
      color: white;
      padding: 15px 25px;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
      z-index: 999;
      animation: slideInRight 0.5s ease;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    `;
    message.textContent = `Bienvenue ${user.name} ! 🎉`;
    document.body.appendChild(message);
    
    sessionStorage.setItem('welcomed', 'true');
    
    setTimeout(() => {
      message.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => message.remove(), 500);
    }, 3000);
  }
}

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Appeler le message de bienvenue après le chargement
window.addEventListener('load', showWelcomeMessage);