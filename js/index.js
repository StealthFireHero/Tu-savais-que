document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const logo = document.querySelector('.logo');
    const mascot = document.querySelector('.mascot');
    const randomExampleBtn = document.getElementById('randomExampleBtn');
    
    let allExamples = [];
    let usedExamples = [];
    let currentExample = "";
    
    async function loadAnecdotes() {
        try {
            const response = await fetch('./json/anecdotes.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('JSON chargé avec succès:', data);
            
            if (data && data.anecdotes && Array.isArray(data.anecdotes)) {
                allExamples = data.anecdotes;
                console.log(`${allExamples.length} anecdotes chargées depuis le JSON`);
                
                const exampleItem = document.getElementById('exampleItem');
                if (exampleItem && allExamples.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allExamples.length);
                    currentExample = allExamples[randomIndex];
                    usedExamples.push(currentExample);
                    exampleItem.textContent = currentExample;
                    console.log('Premier exemple initialisé:', currentExample);
                }
            } else {
                throw new Error('Structure JSON invalide');
            }
        } catch (error) {
            console.error('ERREUR CRITIQUE - Impossible de charger les anecdotes:', error);
            
            const exampleItem = document.getElementById('exampleItem');
            if (exampleItem) {
                exampleItem.textContent = "❌ Erreur de chargement des anecdotes.";
                exampleItem.style.color = '#dc3545';
                exampleItem.style.fontWeight = 'bold';
            }
            
            const randomBtn = document.getElementById('randomExampleBtn');
            if (randomBtn) {
                randomBtn.disabled = true;
                randomBtn.textContent = "❌ Service indisponible";
                randomBtn.style.opacity = '0.5';
                randomBtn.style.cursor = 'not-allowed';
            }
            
            allExamples = [];
        }
    }
    
    loadAnecdotes();
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            handleNavigation(category);
        });
    });
    
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    if (mascot) {
        mascot.addEventListener('click', function() {
            showRandomFact();
        });
    }
    
    if (randomExampleBtn) {
        randomExampleBtn.addEventListener('click', function() {
            showRandomExamples();
        });
    }
    
    const footerNavButtons = document.querySelectorAll('.footer-nav-btn');
    const footerLogo = document.querySelector('.footer-logo');
    
    footerNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            handleNavigation(category);
        });
    });
    
    if (footerLogo) {
        footerLogo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    function getNextExample() {
        if (allExamples.length === 0) return "";
        
        if (usedExamples.length >= allExamples.length) {
            usedExamples = [];
        }
        
        let availableExamples = allExamples.filter(example => 
            !usedExamples.includes(example) && example !== currentExample
        );
        
        if (availableExamples.length === 0) {
            usedExamples = [currentExample];
            availableExamples = allExamples.filter(example => example !== currentExample);
        }
        
        const randomIndex = Math.floor(Math.random() * availableExamples.length);
        const selectedExample = availableExamples[randomIndex];
        
        usedExamples.push(selectedExample);
        currentExample = selectedExample;
        
        return selectedExample;
    }
    
    function showRandomExamples() {
        const exampleItem = document.getElementById('exampleItem');
        
        if (!exampleItem) {
            console.log('Élément example introuvable');
            return;
        }
        
        if (allExamples.length === 0) {
            console.log('ERREUR: Aucune anecdote disponible - JSON non chargé');
            exampleItem.textContent = "❌ Impossible de charger une nouvelle anecdote. Le fichier JSON n'est pas accessible.";
            exampleItem.style.color = '#dc3545';
            return;
        }
        
        console.log(`Nombre total d'anecdotes: ${allExamples.length}`);
        console.log(`Anecdotes déjà utilisées: ${usedExamples.length}`);
        
        exampleItem.classList.add('updating');
        
        setTimeout(() => {
            const selectedExample = getNextExample();
            console.log('Nouvelle anecdote sélectionnée:', selectedExample);
            
            exampleItem.textContent = selectedExample;
            exampleItem.style.color = '#333';
            exampleItem.classList.remove('updating');
            exampleItem.classList.add('updated');
            
            setTimeout(() => {
                exampleItem.classList.remove('updated');
            }, 400);
        }, 200);
    }
    
    function handleNavigation(category) {
        const routes = {
            'histoire': '0- Page d\'accueil Histoire.html',
            'geographie': '0- Page d\'accueil Géographie.html',
            'sciences': '0- Page d\'accueil Sciences.html',
            'vie-quotidienne': '0- Page d\'accueil Vie quotidienne.html',
            'en-savoir-plus': '0- Page d\'accueil En savoir plus.html'
        };
        
        if (routes[category]) {
            console.log(`Navigation vers: ${routes[category]}`);
        }
    }
    
    function showRandomFact() {
        if (allExamples.length === 0) return;
        const randomFact = allExamples[Math.floor(Math.random() * allExamples.length)];
        alert(randomFact);
    }
});