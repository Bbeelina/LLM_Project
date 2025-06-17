const MISTRAL_API_URL = "api_url"; // Уточните точный URL API
const MISTRAL_API_KEY = "api_key"; // Замените на реальный ключ

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
    const generatedSong = await callMistralAPI(prompt);

    // Отображаем результат с учетом жанра
    songText.innerHTML = generatedSong;
    songText.className = genre + "-text";

    hideError();
  } catch (error) {
    showError("Ошибка при генерации песни: " + error.message);
  }
}

async function callMistralAPI(prompt) {
  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistral-medium",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateMockSong() {
  // Теперь эта функция не используется в основном потоке
  // Может быть полезна для тестирования интерфейса
  return "[Тестовый текст песни]\n\nЭто демо-версия. При подключении API здесь будет реальный текст.";
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
