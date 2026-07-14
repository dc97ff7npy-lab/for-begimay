// 1. Получение и форматирование имени из ссылки (?name=бегимай)
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
if (name) {
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('friendName').innerText = formattedName;
}

// 2. Фоновый бесконечный полет букетов и сердечек
function createMagic() {
    const container = document.getElementById('magicContainer');
    const items = ['💐', '🤍', '💐', '🤍', '✨']; 
    setInterval(() => {
        const flyingItem = document.createElement('div');
        flyingItem.classList.add('flying-item');
        flyingItem.innerText = items[Math.floor(Math.random() * items.length)];
        const leftPosition = Math.random() * 100;
        const duration = Math.random() * 6 + 6;
        const fontSize = Math.random() * 18 + 18; // чуть меньше для экранов мобильных
        
        flyingItem.style.left = `${leftPosition}%`;
        flyingItem.style.animationDuration = `${duration}s`;
        flyingItem.style.fontSize = `${fontSize}px`;
        container.appendChild(flyingItem);
        setTimeout(() => flyingItem.remove(), duration * 1000);
    }, 500); 
}

const tiltContainer = document.getElementById('tiltContainer');

// 3. Интерактив для телефона: 3D-наклон при движении пальцем (Touch Events)
document.addEventListener('touchmove', (e) => {
    // Берем координаты первого касания пальца
    const touch = e.touches[0];
    const xAxis = (window.innerWidth / 2 - touch.clientX) / 10; 
    const yAxis = (window.innerHeight / 2 - touch.clientY) / 10;
    
    // Ограничиваем углы, чтобы сердце не переворачивалось слишком сильно
    const scale = 1.05; // легкое увеличение при касании
    tiltContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg) scale(${scale})`;
}, { passive: true });

// Возвращаем сердце в исходное положение, когда она убирает палец
document.addEventListener('touchend', () => {
    tiltContainer.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
});

// 4. Фишка для мобильных: Наклон через Гироскоп (Device Orientation)
// Если она просто крутит телефон в руках, сердце будет мягко реагировать
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
        // gamma - наклон влево/вправо, beta - наклон вперед/назад
        const tiltX = Math.min(Math.max(e.gamma, -20), 20) / 2;
        const tiltY = Math.min(Math.max(e.beta - 60, -20), 20) / 2; // Адаптировано под обычный наклон телефона в руках
        
        // Применяем наклон, только если палец не на экране
        if (e.touches && e.touches.length === 0 || !e.touches) {
            tiltContainer.style.transform = `rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
        }
    });
}

// 5. Взрыв сердечек при тапе по экрану + Музыка
document.addEventListener('touchstart', (e) => {
    // Включаем трек
    const audio = document.getElementById('bgMusic');
    if (audio && audio.paused) {
        audio.play().catch(() => console.log("Ждем первого тапа"));
    }

    const touch = e.touches[0];
    
    // Создаем 8 взрывающихся сердечек из точки нажатия
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('click-sparkle');
        sparkle.innerText = Math.random() > 0.5 ? '🤍' : '💖';
        
        // Позиция пальца
        sparkle.style.top = `${touch.pageY}px`;
        sparkle.style.left = `${touch.clientX}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 40; // дистанция разлета
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }
});

window.addEventListener('DOMContentLoaded', createMagic);