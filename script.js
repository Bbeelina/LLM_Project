async function generateSong() {
  // Получаем все значения
  const topic = document.getElementById("topic").value.trim();
  const genre = document.getElementById("genre").value;
  const mood = document.getElementById("mood").value;
  const audience = document.getElementById("audience").value;
  const rhyme = document.getElementById("rhyme").value;
  const verses = document.getElementById("verses").value;
  const choruses = document.getElementById("choruses").value;

  // Проверка на пустую тему
  if (!topic) {
    showError("Пожалуйста, введите тему песни");
    document.getElementById("topic").focus();
    return;
  }

  // Проверка на конкретную тему
  const predefinedTopic = "птицы, улетающие на юг";
  if (topic.toLowerCase() !== predefinedTopic) {
    showError(`Тема должна быть "${predefinedTopic}". Это пока демо-версия, здесь не подключен API :'(`);
    document.getElementById("topic").focus();
    return;
  }

  // Показываем сообщение о загрузке
  const songText = document.getElementById("song-text");
  songText.innerHTML = "<em>Генерируем песню...</em>";

  try {
    // Имитация загрузки
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Формируем промпт
    const prompt = `Соблюдай структуру песни, используй подходящую лексику для выбранной аудитории.
    Напиши текст песни в жанре ${genre} с ${mood} настроением. 
    Тема: '${topic}'. Аудитория: ${audience}. 
    В тексте песни рифма ${rhyme}. 
    Что касается длины: количество куплетов - ${verses}, количество припевов - ${choruses}.`;

    // Для демо используем локальную генерацию
    const generatedSong = generateMockSong(prompt, genre);

    // Отображаем результат с учетом жанра
    songText.innerHTML = generatedSong;
    songText.className = genre + "-text";

    hideError();
  } catch (error) {
    showError("Ошибка при генерации песни: " + error.message);
  }
}

function generateMockSong(prompt, genre) {
  // Болванка чтобы что-то выводилось
  const genreTemplates = {
    рэп: `[Куплет 1]\nЯ летаю над городом, вижу всё свысока\nМои строки - как птицы, не знают порока\n\n[Припев]\nМы свободны, как ветер, нам не нужны оковы\nЭта бита - мой воздух, эти строки - основы\n\n[Куплет 2]\nТы спросишь куда я? На юг, где тепло\nГде море и солнце и люди светло\n\n[Припев]\nМы свободны, как ветер, нам не нужны оковы\nЭта бита - мой воздух, эти строки - основы`,

    рок: `[Вступление]\nГитара кричит, барабаны гремят\nМы улетаем, нам не нужен билет\n\n[Куплет 1]\nКрылья расправлены, ветер в лицо\nТысячи миль нам не страшны до конца\n\n[Припев]\nЛЕТИМ! В пекло и во тьму!\nЛЕТИМ! Я кричу тебе!\nЮг где-то там вдали\nНо нам всё равно куда мы летим!`,

    поп: `(Куплет 1)\nТы и я, мы как птицы в небе\nЛетим туда, где солнце светит\n\n(Припев)\nНа юг, на юг, где тепло\nНа юг, на юг, нам так легко\n\n(Куплет 2)\nОблака как вата под нами\nИ мы свободны с тобой, я знаю`,

    "хип-хоп": `[Интро]\nYo, это наш полёт, check it out\n\n[Куплет 1]\nБёрды в воздухе, мы на wave\nТы не догонишь, даже если brave\n\n[Припев]\nFly high, touch the sky\nNever look back, just say goodbye\n\n[Куплет 2]\nЮг зовёт нас, там наш spot\nIce cold lemonade и жаркий lot`,
  };

  return genreTemplates[genre];
}

// Функции для работы с ошибками остаются без изменений
function showError(message) {
  const errorElement = document.getElementById("error-message");
  if (!errorElement) {
    const resultDiv = document.getElementById("result");
    const errorDiv = document.createElement("div");
    errorDiv.id = "error-message";
    errorDiv.className = "error";
    errorDiv.textContent = message;
    resultDiv.prepend(errorDiv);
  } else {
    errorElement.textContent = message;
  }
}

function hideError() {
  const errorElement = document.getElementById("error-message");
  if (errorElement) {
    errorElement.remove();
  }
}
