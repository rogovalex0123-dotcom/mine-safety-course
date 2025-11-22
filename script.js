// Глобальні змінні
const appState = {
    currentScreen: 'welcome',
    userName: 'Гість',
    userAge: 'adult',
    currentLevel: 0,
    currentQuestion: 0,
    score: 0,
    levelScores: {1: 0, 2: 0, 3: 0},
    levelAnswers: {1: [], 2: [], 3: []},
    levelCompleted: {1: false, 2: false, 3: false},
    totalQuestions: 0,
    correctAnswers: 0,
    currentShuffledOptions: [] // Додано для зберігання перемішаних опцій
};

// Зображення для карток рівнів (заглушки для візуалізації)
const levelImages = {
    1: 'https://placehold.co/600x400/2c3e50/f8f9fa?text=Рівень 1', // Темний фон, світлий текст
    2: 'https://placehold.co/600x400/dc3545/f8f9fa?text=Рівень 2', // Червоний фон
    3: 'https://placehold.co/600x400/ff7f00/2c3e50?text=Рівень 3' // Помаранчевий фон
};

// --- БАЗА ДАНИХ ПИТАНЬ ---
// Питання завантажуються з окремого файлу questions.js
const questionsDatabase = window.questionsDatabase;

// --- ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ ОТРИМАННЯ ПИТАНЬ ---
function getCurrentLevelQuestions() {
    const level = appState.currentLevel;
    const age = appState.userAge;
    return questionsDatabase[level].questions[age];
}

function getCurrentQuestionData() {
    const questions = getCurrentLevelQuestions();
    return questions[appState.currentQuestion];
}

// --- ФУНКЦІЯ ПЕРЕМІШУВАННЯ (Fisher-Yates) ---
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- КІНЕЦЬ ДОПОМІЖНИХ ФУНКЦІЙ ---


// Ініціалізація додатку
function initApp() {
    updateStats();
    renderLevelsMenu();
    // Відновлення прогресу з локального сховища
    const savedProgress = localStorage.getItem('mineSafetyProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        if (!progress.userAge) {
            progress.userAge = document.getElementById('userAgeSelect').value;
        }
        Object.assign(appState, progress);
        document.getElementById('userNameInput').value = appState.userName;
        document.getElementById('userAgeSelect').value = appState.userAge;
        updateStats();
        renderLevelsMenu();
    }
}

// Оновлення статистики
function updateStats() {
    const totalScore = Object.values(appState.levelScores).reduce((sum, score) => sum + score, 0);
    const completedLevelsCount = Object.values(appState.levelCompleted).filter(isCompleted => isCompleted).length;

    let totalCorrect = 0;
    let totalAnswered = 0;
    for (const level in appState.levelAnswers) {
        totalCorrect += appState.levelAnswers[level].filter(a => a.isCorrect).length;
        totalAnswered += appState.levelAnswers[level].length;
    }

    appState.correctAnswers = totalCorrect;

    const correctPercentage = totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(0) : 0;

    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('completedLevels').textContent = `${completedLevelsCount}/3`;
    document.getElementById('correctAnswers').textContent = `${correctPercentage}%`;

    // Показати повідомлення про повне проходження
    if (completedLevelsCount === 3) {
        document.getElementById('allLevelsComplete').classList.add('show');
    } else {
        document.getElementById('allLevelsComplete').classList.remove('show');
    }
}

// Рендеринг меню рівнів
function renderLevelsMenu() {
    const levelsGrid = document.getElementById('levelsGrid');
    levelsGrid.innerHTML = '';
    for (let level = 1; level <= 3; level++) {
        const levelData = questionsDatabase[level];
        const isCompleted = appState.levelCompleted[level];
        const levelCard = document.createElement('div');
        levelCard.className = 'level-card';

        const imageUrl = levelImages[level];
        const questionsCount = levelData.questions[appState.userAge].length;
        const maxScore = questionsCount * 10;
        const currentScore = appState.levelScores[level];

        levelCard.innerHTML = `
            <div class="level-image-container">
                <img class="level-image" src="${imageUrl}" alt="${levelData.title}">
            </div>
            <div class="level-content">
                <div>
                    <h3 class="level-title">${levelData.title}</h3>
                    <p class="level-description">${levelData.description}</p>
                </div>
                <div>
                    <div class="level-stats">Ваш результат: ${currentScore}/${maxScore} балів</div>
                    <button class="btn ${isCompleted ? 'btn-success' : 'btn-primary'}" onclick="startLevel(${level})">
                        ${isCompleted ? ' 🔁 Пройти знову' : 'Почати'}
                    </button>
                </div>
            </div>
        `;
        levelsGrid.appendChild(levelCard);
    }
}

// Початок роботи з додатком
function startApp() {
    const userNameInput = document.getElementById('userNameInput');
    const userAgeSelect = document.getElementById('userAgeSelect');

    if (userNameInput.value.trim()) {
        appState.userName = userNameInput.value.trim();
    }

    if (appState.userAge !== userAgeSelect.value) {
        appState.userAge = userAgeSelect.value;
        // Скидання прогресу, оскільки змінилася категорія питань
        appState.levelScores = {1: 0, 2: 0, 3: 0};
        appState.levelAnswers = {1: [], 2: [], 3: []};
        appState.levelCompleted = {1: false, 2: false, 3: false};
        updateStats();
    }

    appState.userAge = userAgeSelect.value;
    saveProgress();
    showScreen('menu');
}

// Показати конкретний екран
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenName + 'Screen').classList.add('active');
    appState.currentScreen = screenName;
}

// Початок рівня
function startLevel(level) {
    appState.currentLevel = level;
    appState.currentQuestion = 0;
    appState.score = 0;

    const questionsForLevel = getCurrentLevelQuestions();

    if (!questionsForLevel) {
        alert(`Помилка: Не знайдено питань для рівня ${level} та вікової категорії ${appState.userAge}.`);
        return;
    }

    appState.totalQuestions = questionsForLevel.length;

    appState.levelAnswers[level] = [];

    document.getElementById('levelTitleHeader').textContent = questionsDatabase[level].title;
    document.getElementById('levelDescriptionHeader').textContent = questionsDatabase[level].description;

    showScreen('game');
    showQuestion();
}

// Показати поточне питання
function showQuestion() {
    const questionData = getCurrentQuestionData();

    document.getElementById('feedbackBox').style.display = 'none';
    document.getElementById('nextQuestionBtn').disabled = true;

    document.getElementById('questionText').textContent = `${appState.currentQuestion + 1}. ${questionData.text}`;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    // 1. Створення масиву об'єктів для перемішування, зберігаючи оригінальний індекс
    let optionsToShuffle = questionData.options.map((option, index) => ({
        text: option,
        originalIndex: index
    }));

    // 2. Перемішування та збереження в appState
    appState.currentShuffledOptions = shuffleArray(optionsToShuffle);

    // 3. Відображення перемішаних опцій
    appState.currentShuffledOptions.forEach((optionObj, shuffledIndex) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-btn';
        optionButton.textContent = optionObj.text;
        // Передаємо індекс в перемішаному масиві
        optionButton.onclick = () => checkAnswer(shuffledIndex, optionButton);
        optionsContainer.appendChild(optionButton);
    });

    const progressPercent = ((appState.currentQuestion) / appState.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
}

// Перевірка відповіді
function checkAnswer(shuffledIndex, selectedButton) {
    const questionData = getCurrentQuestionData();
    const selectedOptionObj = appState.currentShuffledOptions[shuffledIndex];

    // Визначення, чи була обрана опція правильною, порівнюючи оригінальний індекс
    const isCorrect = selectedOptionObj.originalIndex === questionData.correct;
    const feedbackBox = document.getElementById('feedbackBox');
    const optionsContainer = document.getElementById('optionsContainer');

    Array.from(optionsContainer.children).forEach((btn, index) => {
        btn.disabled = true;
        btn.classList.remove('selected');

        const originalIndex = appState.currentShuffledOptions[index].originalIndex;

        // Виділяємо вибрану користувачем кнопку
        if (index === shuffledIndex) {
            btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        }

        // Виділяємо правильну відповідь
        if (originalIndex === questionData.correct) {
            btn.classList.add('correct');
        }
    });

    document.getElementById('nextQuestionBtn').disabled = false;

    let scoreEarned = 0;
    if (isCorrect) {
        scoreEarned = 10;
        appState.score += scoreEarned;
    }

    appState.levelAnswers[appState.currentLevel].push({
        question: questionData.text,
        userAnswer: selectedOptionObj.text,
        correctAnswer: questionData.options[questionData.correct],
        isCorrect: isCorrect,
        explanation: questionData.explanation,
        score: scoreEarned
    });

    feedbackBox.classList.remove('correct', 'incorrect');
    feedbackBox.classList.add(isCorrect ? 'correct' : 'incorrect');
    document.getElementById('feedbackResult').textContent = isCorrect ? 'Правильно!' : 'Помилка!';
    document.getElementById('feedbackExplanation').textContent = `Пояснення: ${questionData.explanation}`;
    feedbackBox.style.display = 'block';


    if (appState.currentQuestion === appState.totalQuestions - 1) {
        document.getElementById('nextQuestionBtn').textContent = 'Показати результати →';
    }
}

// Перехід до наступного питання
function nextQuestion() {
    if (appState.currentQuestion === appState.totalQuestions - 1) {
        showSummary();
    } else {
        appState.currentQuestion++;
        document.getElementById('nextQuestionBtn').textContent = 'Наступне питання →';
        showQuestion();
    }
}

// Показати підсумки рівня
function showSummary() {
    const level = appState.currentLevel;
    const levelData = questionsDatabase[level];

    appState.levelScores[level] = appState.score;
    appState.levelCompleted[level] = true;
    updateStats();

    document.getElementById('summaryTitle').textContent = `Підсумки рівня: ${levelData.title}`;
    const maxScore = appState.totalQuestions * 10;
    document.getElementById('summaryScore').textContent = `${appState.score} / ${maxScore} балів`;

    let message = '';
    const percentage = (appState.score / maxScore) * 100;

    if (percentage >= 90) {
        message = 'Відмінний результат! Ви добре засвоїли матеріал. 💪';
    } else if (percentage >= 70) {
        message = 'Добрий результат! Але є ще що вивчити. 👍';
    } else if (percentage >= 50) {
        message = 'Задовільний результат. Рекомендуємо повторити матеріал. 📚';
    } else {
        message = 'Потрібно краще вивчити матеріал. Спробуйте ще раз. 🚨';
    }

    document.getElementById('summaryMessage').textContent = message;

    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (level < 3) {
        nextLevelBtn.style.display = 'inline-block';
    } else {
        nextLevelBtn.style.display = 'none';
    }

    const summaryDetails = document.getElementById('summaryDetails');
    summaryDetails.innerHTML = '';
    appState.levelAnswers[level].forEach((answer, index) => {
        const questionResult = document.createElement('div');
        questionResult.className = `question-result ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        questionResult.innerHTML = `
            <div class="question-text-summary">${index + 1}. ${answer.question}</div>
            <div class="answer-comparison">
                <div class="user-answer">Ваша відповідь: <strong>${answer.isCorrect ? '✔' : '❌'} ${answer.userAnswer}</strong></div>
                <div class="correct-answer">Правильна відповідь: <strong>${answer.correctAnswer}</strong></div>
            </div>
            <div class="answer-info">Пояснення: ${answer.explanation}</div>
        `;
        summaryDetails.appendChild(questionResult);
    });

    saveProgress();
    showScreen('summary');
}

// Перехід до наступного рівня
function startNextLevel() {
    const nextLevel = appState.currentLevel + 1;
    if (nextLevel <= 3) {
        startLevel(nextLevel);
    } else {
        returnToMenu();
    }
}

// Повернутися до меню
function returnToMenu() {
    renderLevelsMenu();
    showScreen('menu');
}

// Збереження прогресу
function saveProgress() {
    localStorage.setItem('mineSafetyProgress', JSON.stringify(appState));
}

// --- ФУНКЦІЯ ГЕНЕРАЦІЇ PDF ---
function generatePDF(isCertificate) {
    debugger;
    updateStats();

    const {jsPDF} = window.jspdf;
    const ageText = document.getElementById('userAgeSelect').options[document.getElementById('userAgeSelect').selectedIndex].text;

    if (isCertificate) {
        // --- НОВИЙ ДИЗАЙН СЕРТИФІКАТА (Стиль: "ІТ та Мінна безпека") ---

        const totalScore = appState.levelScores[1] + appState.levelScores[2] + appState.levelScores[3];
        const maxQuestions = Object.values(questionsDatabase).reduce((sum, level) => sum + level.questions[appState.userAge].length, 0);
        const maxScore = maxQuestions * 10;
        const correctCount = appState.correctAnswers;
        const totalAnswered = Object.values(appState.levelAnswers).reduce((sum, level) => sum + level.length, 0);

        // Встановлюємо дані у приховану структуру
        const certContainer = document.getElementById('customCertificate');
        if (!certContainer) {
            alert('Помилка: Не знайдено структуру сертифіката для друку.');
            return;
        }

        certContainer.querySelector('#certRecipientName').textContent = appState.userName || 'Користувач';
        certContainer.querySelector('#certDateLine').textContent = new Date().toLocaleDateString('uk-UA');

        // Встановлюємо показники
        certContainer.querySelector('#certScore').textContent = `${totalScore}/${maxScore}`;
        certContainer.querySelector('#certCorrect').textContent = `${correctCount}/${totalAnswered}`;

        // Тимчасово показуємо прихований контейнер для рендерингу
        certContainer.style.display = 'block';

        html2canvas(certContainer, {scale: 2}).then(canvas => {
            certContainer.style.display = 'none'; // Ховаємо назад

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' - Landscape
            const imgWidth = 297; // A4 Landscape width
            const pageHeight = 210; // A4 Landscape height
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

            // Якщо вміст не поміщається (хоча для сертифіката не має бути)
            heightLeft -= pageHeight;
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const docType = 'Сертифікат';
            const fileName = `${docType}_Мінна_безпека_${appState.userName.replace(/\s/g, '_')}_${new Date().toLocaleDateString('uk-UA').replace(/\./g, '_')}.pdf`;
            pdf.save(fileName);
        });

        return; // Завершуємо виконання для сертифіката
    }

    // --- СТАНДАРТНИЙ ЗВІТ (REPORT) ---

    const pdfOrientation = 'p';
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm';
    tempDiv.style.height = '297mm';
    tempDiv.style.padding = '0';
    tempDiv.style.backgroundColor = '#fff';
    tempDiv.style.fontFamily = 'Roboto, Arial, sans-serif';
    tempDiv.style.fontSize = '12pt';

    let content = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0078d7; padding-bottom: 10px;">
            <h1 style="color: #0078d7; font-size: 24pt;">ЗВІТ ПРО ПРОХОДЖЕННЯ КУРСУ</h1>
            <p style="font-size: 14pt; color: #333;">Курс: Правила мінної безпеки</p>
        </div>
        <div style="margin-bottom: 20px;">
            <p><strong>Ім'я користувача:</strong> ${appState.userName}</p>
            <p><strong>Вікова категорія:</strong> ${ageText}</p>
            <p><strong>Загальний рахунок:</strong> ${appState.levelScores[1] + appState.levelScores[2] + appState.levelScores[3]} балів</p>
            <p><strong>Правильних відповідей:</strong> ${appState.correctAnswers} із ${Object.values(appState.levelAnswers).reduce((sum, level) => sum + level.length, 0)}</p>
        </div>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
    `;

    for (let level = 1; level <= 3; level++) {
        if (appState.levelAnswers[level].length > 0) {
            const levelData = questionsDatabase[level];
            const levelScore = appState.levelScores[level];
            const correctCount = appState.levelAnswers[level].filter(a => a.isCorrect).length;
            const totalCount = appState.levelAnswers[level].length;

            content += `
                <div style="margin: 20px 0; border: 1px solid #eee; padding: 15px; border-radius: 5px;">
                    <h2 style="color: #005fa3; font-size: 16pt; margin-bottom: 10px;">Рівень ${level}: ${levelData.title}</h2>
                    <p><strong>Бали:</strong> ${levelScore}</p>
                    <p><strong>Результат:</strong> ${correctCount} правильних відповідей із ${totalCount}</p>
                    <h3 style="font-size: 14pt; margin-top: 15px; color: #dc3545;">Деталізація питань (категорія ${ageText}):</h3>
            `;
            appState.levelAnswers[level].forEach((answer, index) => {
                const color = answer.isCorrect ? '#28a745' : '#dc3545';
                content += `
                    <div style="margin-top: 10px; padding: 10px; border-left: 3px solid ${color}; background: #f9f9f9;">
                        <p><strong>${index + 1}. ${answer.question}</strong></p>
                        <p style="color: ${color}; margin-left: 10px;">Ваша відповідь: ${answer.isCorrect ? '✔' : '❌'} ${answer.userAnswer}</p>
                        <p style="color: #28a745; margin-left: 10px;">Правильна відповідь: ${answer.correctAnswer}</p>
                        <p style="font-size: 10pt; color: #666; margin-left: 10px; margin-top: 5px;">Пояснення: ${answer.explanation}</p>
                    </div>
                `;
            });
            content += `</div>`;
        }
    }

    content += `
        <div style="margin-top: 30px; text-align: center; font-size: 0.9em; color: #666;">
            <p>Дата створення: ${new Date().toLocaleDateString('uk-UA')}</p>
            <p>Цей документ підтверджує результати курсу "Правила мінної безпеки"</p>
        </div>
    `;
debugger;
    tempDiv.innerHTML = content;
    document.body.appendChild(tempDiv);

    // Конвертуємо HTML в PDF
    html2canvas(tempDiv, {scale: 2}).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF(pdfOrientation, 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        document.body.removeChild(tempDiv);

        const docType = 'Звіт';
        const fileName = `${docType}_Мінна_безпека_${appState.userName.replace(/\s/g, '_')}_${new Date().toLocaleDateString('uk-UA').replace(/\./g, '_')}.pdf`;
        pdf.save(fileName);
    });
}


// Запускаємо ініціалізацію при завантаженні сторінки
window.onload = initApp;
