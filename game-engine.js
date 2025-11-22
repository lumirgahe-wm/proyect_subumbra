// DOM Elements
const storyTitle = document.getElementById('story-title');
const passageContainer = document.getElementById('passage-container');
const passageContent = document.getElementById('passage-content');
const passageChoices = document.getElementById('passage-choices');
const ghostScream = document.getElementById('ghost-scream');
const ghostScream2 = document.getElementById('ghost-scream2');
const ghostScream3 = document.getElementById('ghost-scream3');
const stepSound = document.getElementById('step-sound');
const criyingsound = document.getElementById('criying-sound');
const runsound = document.getElementById('run-sound');
const moansound = document.getElementById('moan-sound');
const heartsound = document.getElementById('heart-sound');
const breatsound = document.getElementById('breat-sound');
const voicesound = document.getElementById('voice-sound');
const callsound = document.getElementById('call-sound');

const characterButtons = document.querySelectorAll('.character-btn');

// --- VIDEO INICIAL --- //
const introScreen = document.getElementById("intro-screen");
const introVideo = document.getElementById("intro-start-video");
const continueBtn = document.getElementById("continue-btn");

// Ocultar el juego mientras el video está activo
document.getElementById("game-container").classList.add("hidden");

// Cuando se presiona "Continuar"
continueBtn.addEventListener("click", () => {
    introVideo.pause();
    introScreen.classList.add("hidden");

    // Ahora el juego aparece
    document.getElementById("game-container").classList.remove("hidden");

    // Aquí arranca el menú del juego
    loadPassage(storyData.startPassage);

// Game state
let currentPassage = null;
let gameHistory = [];
let playerName = '';
let friendName = '';
let selectedCharacter = null;

// Sonidos opcionales (no usados por ahora)
const soundEffects = {};

// Selección de personaje: al hacer clic se inicia el juego
characterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedCharacter = btn.dataset.character;

        // Resaltar visualmente el personaje seleccionado
        characterButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Opcional: pequeña pausa para el efecto
        setTimeout(() => {
            startGame();
        }, 300);
    });
});

// Start the game
function startGame() {
    // Puedes mapear quién es jugador y quién amigo si quieres personalizar texto
    if (selectedCharacter === 'Gabriel') {
        playerName = 'Gabriel';
        friendName = 'Edward';
    } else if (selectedCharacter === 'Edward') {
        playerName = 'Edward';
        friendName = 'Gabriel';
    } else {
        // Por defecto (por si acaso)
        playerName = 'Gabriel';
        friendName = 'Edward';
    }

    // Ocultar pantalla de selección y mostrar la historia
    storyTitle.classList.add('hidden');
    passageContainer.classList.remove('hidden');

    // Cargar primer pasaje
    loadPassage(storyData.startPassage);
}

// Load a passage by its name
function loadPassage(passageName) {
    // Save current passage to history if not null
    if (currentPassage) {
        gameHistory.push(currentPassage);
    }
    
    // Get the new passage data
    const passage = storyData.passages[passageName];
    currentPassage = passageName;
    
    // Clear current content
    passageContent.innerHTML = '';
    passageChoices.innerHTML = '';
    
    // Add fade transition
    passageContainer.classList.add('fade-transition');
    
    // Add text content
    if (passage.text) {
        const textDiv = document.createElement('div');
        let modifiedText = passage.text;
        
        // Replace character names with player-provided names
        if (playerName && friendName) {
            modifiedText = replaceCharacterNames(modifiedText);
        }
        
        textDiv.innerHTML = modifiedText;
        passageContent.appendChild(textDiv);
    }
    
    // Add image if present
    if (passage.image) {
        const img = document.createElement('img');
        img.src = passage.image;
        img.alt = passage.imageAlt || '';
        img.classList.add('zoom-toggle');
        img.addEventListener('click', () => {
            img.classList.toggle('zoomed');
        });
        passageContent.appendChild(img);
    }
    
    // Add additional text content if present
    if (passage.text2) {
        const text2Div = document.createElement('div');
        let modifiedText2 = passage.text2;
        
        // Replace character names with player-provided names
        if (playerName && friendName) {
            modifiedText2 = replaceCharacterNames(modifiedText2);
        }
        
        text2Div.innerHTML = modifiedText2;
        passageContent.appendChild(text2Div);
    }
    
    // Add second image if present
    if (passage.image2) {
        const img2 = document.createElement('img');
        img2.src = passage.image2;
        img2.alt = passage.image2Alt || '';
        passageContent.appendChild(img2);
    }
    
    // Add third text content if present
    if (passage.text3) {
        const text3Div = document.createElement('div');
        let modifiedText3 = passage.text3;
        
        // Replace character names with player-provided names
        if (playerName && friendName) {
            modifiedText3 = replaceCharacterNames(modifiedText3);
        }
        
        text3Div.innerHTML = modifiedText3;
        passageContent.appendChild(text3Div);
    }
    
    // Add choices
    if (passage.choices && passage.choices.length > 0) {
    //  Filtrar por personaje
    const filteredChoices = passage.choices.filter(choice => {
        // Si no tiene onlyFor, la ven todos
        if (!choice.onlyFor) return true;

        // Si tiene onlyFor, revisamos si incluye al personaje seleccionado
        return Array.isArray(choice.onlyFor) && 
               selectedCharacter && 
               choice.onlyFor.includes(selectedCharacter);
    });

    filteredChoices.forEach(choice => {
        const choiceBtn = document.createElement('button');
        choiceBtn.classList.add('choice-btn');
        
        let choiceText = choice.text;
        if (playerName && friendName) {
            choiceText = replaceCharacterNames(choiceText);
        }
        
        choiceBtn.innerHTML = choiceText;
        choiceBtn.addEventListener('click', () => {
            passageContainer.classList.remove('fade-transition');
            setTimeout(() => {
                loadPassage(choice.passage);
            }, 200);
        });
        passageChoices.appendChild(choiceBtn);
    });
}
    
    // Scroll to top
    window.scrollTo(0, 0);

    // Special effects for certain passages
    handleSpecialPassageEffects(passageName);
}

document.body.style.backgroundImage = ""; // limpia cualquier fondo

// Handle special effects for specific passages
function handleSpecialPassageEffects(passageName) {
    document.body.style.backgroundImage = "";
    runsound.pause();
    runsound.currentTime = 0;
    stepSound.pause();
    stepSound.currentTime = 0;
    criyingsound.pause();
    criyingsound.currentTime = 0;
    moansound.pause();
    moansound.currentTime = 0;
    heartsound.pause();
    heartsound.currentTime = 0;
    voicesound.pause();
    voicesound.currentTime = 0;
    breatsound.pause();
    breatsound.currentTime = 0;

    switch (passageName) {
        case "Intentar hablar con la figura":
            setTimeout(() => {
                ghostScream.volume = 0.7;
                ghostScream.play();
            }, 1000);
            break;

        case "Correr hacia la puerta":
            document.body.classList.add('shake');
            setTimeout(() => {
                document.body.classList.remove('shake');
            }, 2000);
            
            setTimeout(() => {
                runsound.volume = 0.7;
                runsound.play(); // corregido: antes decía run.play()
            }, 2000);
            break;

        case "Salir inmediatamente del salón":
            document.body.classList.add('shake');
            setTimeout(() => {
                document.body.classList.remove('shake');
            }, 2000);
            // sin break: deja caer a otros casos si quieres

        case "Intentar esquivar corriendo por el lado":
            setTimeout(() => {
                ghostScream3.volume = 0.7;
                ghostScream3.play();
            }, 3000);
            break;

        case "Investigar el origen del llanto":
            setTimeout(() => {
                moansound.volume = 0.7;
                moansound.play();
            }, 3000);
            break;

        case "Buscar a un profesor o guardia":
            setTimeout(() => {
                ghostScream.volume = 0.7;
                ghostScream.play();
            }, 3000);
            break;

        case "periódico":
            document.body.style.backgroundImage = "url('imagenes/Fondo.jpg')";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
            break;

        case "Continuar con la historia":
            callsound.currentTime = 0;
            callsound.volume = 0.6;
            callsound.play();

            setTimeout(() => {
                callsound.pause();
                callsound.currentTime = 0;
            }, 1500);

            setTimeout(() => {
                voicesound.currentTime = 0;
                voicesound.volume = 0.6;
                voicesound.play();
            }, 2500);
            break;

        case "Noticia":
            stepSound.currentTime = 0;
            stepSound.volume = 0.6;
            stepSound.play();
            break;

        case "Entrar al salón":
            criyingsound.currentTime = 0;
            criyingsound.volume = 0.6;
            criyingsound.play();

            setTimeout(() => {
                const lightFlash = document.getElementById('light-flash');
                lightFlash.style.animation = "flashLight 1s ease";
                lightFlash.classList.remove('hidden');

                setTimeout(() => {
                    lightFlash.style.animation = "none";
                    lightFlash.classList.add('hidden');
                }, 1000);
            }, 1000);
            break;

        case "Ignorar el marcador":
        case "Salir inmediatamente del salón":
            runsound.currentTime = 0;
            runsound.volume = 0.6;
            runsound.play();
            break;

        case "Correr hacia la puerta": // respiración agitada
            breatsound.currentTime = 0;
            breatsound.volume = 0.6;
            breatsound.play();
            break;
    }
}

// Add keyboard navigation (optional)
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        const choiceIndex = parseInt(e.key) - 1;
        const choices = passageChoices.querySelectorAll('.choice-btn');
        
        if (choiceIndex < choices.length) {
            choices[choiceIndex].click();
        }
    }
});

// Function to replace character names in the text
function replaceCharacterNames(text) {
    let modifiedText = text.replace(/Gabriel/g, playerName)
                           .replace(/GABRIEL/g, playerName.toUpperCase())
                           .replace(/Jugador/g, playerName);
    
    modifiedText = modifiedText.replace(/Edward/g, friendName)
                               .replace(/EDWARD/g, friendName.toUpperCase());
    
    return modifiedText;
}
