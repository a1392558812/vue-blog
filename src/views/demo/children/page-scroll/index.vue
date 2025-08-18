<template>
  <div class="parallax-container" @mousemove="handleMouseMove">
    <!-- 进度指示器 -->
    <div class="scroll-progress"></div>

    <!-- 导航栏 -->
    <nav class="floating-nav">
      <div class="nav-content">
        <span class="nav-logo">Awen's Scroll</span>
        <div class="nav-links">
          <a href="#section1" class="nav-link" :class="{ active: activeSection === 'section1' }">Section 1</a>
          <a href="#section2" class="nav-link" :class="{ active: activeSection === 'section2' }">Section 2</a>
          <a href="#section3" class="nav-link" :class="{ active: activeSection === 'section3' }">Section 3</a>
        </div>
      </div>
    </nav>

    <!-- 星空背景层 -->
    <div class="parallax-layer stars" data-speed="0.1"></div>

    <!-- 3D深度装饰层 -->
    <div class="parallax-layer depth-lines" data-speed="-0.05"></div>

    <!-- 渐变背景层 -->
    <div class="gradient-overlay"></div>

    <!-- 原有视差层 -->
    <div class="parallax-layer" data-speed="0.2">
      <div class="background"></div>
    </div>
    <div class="parallax-layer" data-speed="0.5">
      <div class="midground"></div>
    </div>
    <div class="parallax-layer" data-speed="0.8">
      <div class="foreground"></div>
    </div>

    <!-- 浮动元素 -->
    <div class="floating-elements">
      <div class="float-item" style="--i: 1"></div>
      <div class="float-item" style="--i: 2"></div>
      <div class="float-item" style="--i: 3"></div>
      <div class="float-item" style="--i: 4"></div>
      <div class="float-item" style="--i: 5"></div>
      <div class="float-item" style="--i: 6"></div>
      <div class="float-item" style="--i: 7"></div>
    </div>

    <!-- 3D文本层 -->
    <div class="text-layer">
      <h1 class="parallax-title">
        <span class="title-word" data-speed="0.02">Awen's</span>
        <span class="title-word" data-speed="-0.01">Scroll</span>
        <span class="title-word highlight" data-speed="0.03">Experience</span>
      </h1>
      <p class="scroll-prompt">Scroll to Unlock by scroll</p>
      <div class="scroll-indicator"></div>
    </div>

    <!-- 滚动内容区域 -->
    <div class="scroll-content">
      <section id="section1" class="content-section" data-section="1">
        <div class="animated-card">
          <h2 class="section-title" data-text="Dynamic Content">card-1</h2>
          <p>卡片详情：这是一个动态内容卡片，当你滚动页面时，它会显示出来。</p>
          <div class="card-icon"></div>
          <div class="section-decoration"></div>

        </div>
      </section>

      <section id="section2" class="content-section" data-section="2">
        <div class="animated-card">
          <h2 class="section-title" data-text="Interactive Elements">card-2</h2>
          <p>卡片详情：这是一个动态内容卡片，当你滚动页面时，它会显示出来。</p>
          <div class="card-icon"></div>
          <div class="section-decoration"></div>

        </div>
      </section>

      <section id="section3" class="content-section" data-section="3">
        <div class="animated-card">
          <h2 class="section-title" data-text="Performance Optimized">card-3</h2>
          <p>卡片详情：这是一个动态内容卡片，当你滚动页面时，它会显示出来。</p>
          <div class="card-icon"></div>
          <div class="section-decoration"></div>

        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger, TextPlugin, MotionPathPlugin } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

const isScrolled = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const windowSize = ref({ width: window.innerWidth, height: window.innerHeight });
const scrollProgress = ref(0);
const activeSection = ref('section1');

// 鼠标移动处理函数
const handleMouseMove = (e) => {
  // 计算鼠标位置的百分比
  const xPercent = (e.clientX / windowSize.value.width - 0.5) * 20;
  const yPercent = (e.clientY / windowSize.value.height - 0.5) * 20;
  mousePosition.value = { x: xPercent, y: yPercent };

  // 创建光标粒子
  createCursorParticles(e);
};

// 创建光标粒子效果
const createCursorParticles = (e) => {
  const particle = document.createElement('div');
  particle.classList.add('cursor-particle');

  // 设置随机大小和位置
  const size = gsap.utils.random(5, 15);
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${e.clientX}px`;
  particle.style.top = `${e.clientY}px`;

  // 添加到容器
  document.querySelector('.parallax-container').appendChild(particle);

  // 粒子动画
  gsap.to(particle, {
    x: gsap.utils.random(-50, 50),
    y: gsap.utils.random(-50, 50),
    opacity: 0,
    scale: 0,
    duration: gsap.utils.random(0.5, 1.5),
    ease: 'power2.out',
    onComplete: () => particle.remove()
  });
};

onMounted(() => {
  // 创建粒子背景
  createStars();
  // 创建深度线条
  createDepthLines();

  // 创建流星效果
  const createMeteor = () => {
    const meteor = document.createElement('div');
    meteor.classList.add('meteor');

    // 随机位置和角度
    const startX = gsap.utils.random(-100, window.innerWidth + 100);
    const startY = gsap.utils.random(-100, 200);
    const angle = gsap.utils.random(30, 60); // 流星角度
    const length = gsap.utils.random(100, 300); // 流星长度
    const duration = gsap.utils.random(0.8, 2); // 动画时长

    // 设置初始位置和旋转
    gsap.set(meteor, {
      x: startX,
      y: startY,
      rotation: angle,
      height: length,
      opacity: 0
    });

    // 添加到容器
    document.querySelector('.parallax-container').appendChild(meteor);

    // 流星动画
    gsap.to(meteor, {
      opacity: 1,
      scaleX: 1.5,
      x: `+=${Math.cos(angle * Math.PI / 180) * length * 6}`,
      y: `+=${Math.sin(angle * Math.PI / 180) * length * 6}`,
      duration: duration,
      ease: 'power4.out',
      onComplete: () => meteor.remove()
    });
  };

  // 定时生成流星
  gsap.ticker.add(() => {
    if (Math.random() < 0.01) { // 增加流星出现频率
      createMeteor();
    }
  });

  // 窗口大小变化监听
  window.addEventListener('resize', () => {
    windowSize.value = { width: window.innerWidth, height: window.innerHeight };
  });

  // 视差层动画
  const layers = document.querySelectorAll('.parallax-layer');
  layers.forEach(layer => {
    const speed = layer.dataset.speed;
    gsap.to(layer, {
      y: () => -(ScrollTrigger.maxScroll(window) * (1 - speed)),
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  });

  // 导航链接动画
  gsap.fromTo('.nav-link',
    { color: 'rgba(255, 255, 255, 0.8)', y: 10, opacity: 0 },
    {
      color: '#6366f1',
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.floating-nav',
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // 导航链接悬停效果
  document.querySelectorAll('.nav-link').forEach(link => {
    gsap.to(link, {
      duration: 0.3,
      scale: 1.1,
      color: '#ec4899',
      textShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
      ease: 'power2.out',
      paused: true,
      onMouseEnter: function () { this.play(); },
      onMouseLeave: function () { this.reverse(); }
    });
  });

  // 鼠标移动视差效果
  const animateMouseParallax = () => {
    // 应用鼠标视差到所有视差层
    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed);
      const depth = speed * 15;
      gsap.set(layer, {
        x: mousePosition.value.x * depth,
        y: mousePosition.value.y * depth
      });
    });

    // 文本层鼠标视差
    gsap.set('.title-word', (i, target) => {
      const speed = parseFloat(target.dataset.speed);
      return {
        x: mousePosition.value.x * speed * 30,
        y: mousePosition.value.y * speed * 30,
        rotationY: mousePosition.value.x * speed * 5,
        rotationX: -mousePosition.value.y * speed * 5,
        transformPerspective: 800
      };
    });

    requestAnimationFrame(animateMouseParallax);
  };

  // 启动鼠标视差动画循环
  animateMouseParallax();

  // 文字动画
  gsap.from('.title-word', {
    opacity: 0,
    y: 80,
    stagger: 0.2,
    duration: 1.2,
    ease: 'power3.out'
  });

  // 滚动触发文字动画
  gsap.from('.highlight', {
    color: '#ff00ff',
    textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff',
    duration: 2,
    ease: 'none',
    scrollTrigger: {
      trigger: '.text-layer',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true
    }
  });

  // 浮动元素动画
  document.querySelectorAll('.float-item').forEach((item, index) => {
    gsap.set(item, {
      x: gsap.utils.random(-400, 400),
      y: gsap.utils.random(-300, 300),
      opacity: 0,
      scale: gsap.utils.random(0.5, 1.5),
      rotation: gsap.utils.random(-30, 30)
    });

    gsap.to(item, {
      motionPath: {
        path: [
          { x: gsap.utils.random(-400, 400), y: gsap.utils.random(-300, 300) },
          { x: gsap.utils.random(-400, 400), y: gsap.utils.random(-300, 300) },
          { x: gsap.utils.random(-400, 400), y: gsap.utils.random(-300, 300) }
        ],
        curviness: 1.5,
        autoRotate: true
      },
      opacity: gsap.utils.random(0.4, 0.8),
      duration: gsap.utils.random(10, 20),
      repeat: -1,
      repeatRefresh: true,
      ease: 'sine.inOut',
      delay: index * 0.3,
      // 悬停效果
      onMouseOver: function () {
        gsap.to(this.targets()[0], {
          scale: '+=0.5',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      },
      onMouseOut: function () {
        gsap.to(this.targets()[0], {
          scale: '-=0.5',
          opacity: gsap.utils.random(0.4, 0.8),
          duration: 0.5,
          ease: 'power2.in'
        });
      }
    });
  });

  // 滚动指示器动画
  gsap.to('.scroll-indicator', {
    y: 20,
    repeat: -1,
    yoyo: true,
    duration: 1.5,
    ease: 'sine.inOut'
  });

  // 滚动进度条动画
  gsap.to('.scroll-progress', {
    width: '100%',
    duration: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.parallax-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });

  // 导航栏滚动动画
  gsap.fromTo('.floating-nav',
    { y: -100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.parallax-container',
        start: 'top -10%',
        end: 'top -5%',
        scrub: true
      }
    }
  );

  // 内容卡片动画
  document.querySelectorAll('.animated-card').forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 100,
      scale: 0.9,
      rotation: index % 2 === 0 ? -5 : 5,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
        once: true
      }
    });

    // 卡片图标动画
    gsap.to(card.querySelector('.card-icon'), {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: 'linear'
    });

    // 卡片3D旋转和发光动画
    gsap.fromTo(card, {
      rotationY: -15,
      rotationX: 5,
      scale: 0.95,
      boxShadow: '0 0 0 rgba(99, 102, 241, 0)'
    }, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // 监听滚动事件改变状态
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) isScrolled.value = true;
    scrollProgress.value = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  });
});

// 创建星空背景
const createStars = () => {
  const starsLayer = document.querySelector('.stars');
  const count = 200;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    gsap.set(star, {
      position: 'absolute',
      width: gsap.utils.random(1, 4),
      height: gsap.utils.random(1, 4),
      backgroundColor: i % 5 === 0 ? '#6366f1' : i % 3 === 0 ? '#ec4899' : 'white',
      borderRadius: '50%',
      left: `${gsap.utils.random(0, 100)}%`,
      top: `${gsap.utils.random(0, 100)}%`,
      opacity: gsap.utils.random(0.2, 1)
    });

    // 星星闪烁动画
    gsap.to(star, {
      opacity: gsap.utils.random(0.1, 1),
      duration: gsap.utils.random(0.5, 3),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    starsLayer.appendChild(star);
  }
};

// 创建深度线条
const createDepthLines = () => {
  const linesLayer = document.querySelector('.depth-lines');
  const count = 20;

  for (let i = 0; i < count; i++) {
    const line = document.createElement('div');
    line.classList.add('depth-line');

    gsap.set(line, {
      position: 'absolute',
      width: '100%',
      height: 0,
      backgroundColor: `rgba(99, 102, 241, ${0.1 + i * 0.01})`,
      top: `${i * 5}%`,
      left: 0,
      transformOrigin: 'center left'
    });

    // 线条动画
    gsap.to(line, {
      scaleX: 1.5,
      duration: gsap.utils.random(15, 30),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    linesLayer.appendChild(line);
  }
};

// 各区域联动动画
const sections = document.querySelectorAll('.content-section');
const sectionAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: '.scroll-content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      // 更新当前激活的区域
      const scrollPosition = self.progress * sections.length;
      const currentSection = Math.ceil(scrollPosition);
      activeSection.value = `section${currentSection}`;
    }
  }
});

// 为每个区域添加背景过渡效果
sections.forEach((section, index) => {
  const sectionNum = index + 1;
  const nextSection = sections[index + 1];
  const bgColor = index % 3 === 0 ? '#0f172a' : index % 3 === 1 ? '#1e293b' : '#0f172a';

  // 区域背景颜色过渡
  sectionAnimation.to('.parallax-container', {
    backgroundColor: bgColor,
    duration: 1
  }, sectionNum / sections.length);

  // 区域间元素联动
  if (nextSection) {
    sectionAnimation.fromTo(section.querySelector('.animated-card'), {
      scale: 1
    }, {
      scale: 0.8,
      opacity: 0.6,
      duration: 0.5
    }, sectionNum / sections.length + 0.2);
  }
});

// 为装饰元素添加随滚动变化的动画
gsap.to('.section-decoration', {
  y: (i, target) => -window.innerHeight * 0.5 * (i + 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.scroll-content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});

// 文字逐字动画
gsap.utils.toArray('.section-title').forEach(title => {
  const text = title.dataset.text;
  const chars = text.split('');
  title.textContent = '';

  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.opacity = '0';
    span.style.display = 'inline-block';
    title.appendChild(span);
  });

  // 滚动触发文字动画
  gsap.to(title.querySelectorAll('span'), {
    opacity: 1,
    y: 0,
    stagger: 0.05,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
});


// 3D滚动旋转元素
gsap.to('.animated-card', {
  rotationY: (i) => i * 15,
  transformPerspective: 1000,
  ease: 'none',
  scrollTrigger: {
    trigger: '.scroll-content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});

// 渐变背景滚动动画
gsap.to('.gradient-overlay', {
  backgroundPosition: '100% 100%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.parallax-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});
</script>
<style>
#app,
#page {
  height: auto !important;
}
</style>

<style scoped lang="scss">
$primary: #6366f1;
$secondary: #ec4899;
$dark-bg: #0f172a;
$medium-bg: #1e293b;

.parallax-container {
  position: relative;
  min-height: 400vh;
  overflow: hidden;
  background: linear-gradient(135deg, $dark-bg 0%, $medium-bg 50%, $dark-bg 100%);

  .meteor {
    position: absolute;
    width: 3px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(135, 206, 235, 0.9) 50%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
    z-index: 50;
    box-shadow: 0 0 6px rgba(135, 206, 235, 0.8);
  }

  &::after {
    content: '';
    position: fixed;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
    mix-blend-mode: screen;
    transition: width 0.2s, height 0.2s, border-color 0.2s;
  }

  &:hover::after {
    width: 50px;
    height: 50px;
    border-color: rgba(99, 102, 241, 0.8);
  }
}

.cursor-particle {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(236, 72, 153, 0.4) 100%);
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #ec4899);
  z-index: 9998;
  width: 0%;
}

.floating-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  z-index: 900;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #6366f1, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #ec4899);
    transition: width 0.3s;
  }

  &:hover {
    color: white;

    &::after {
      width: 100%;
    }
  }
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.depth-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;

  .background {
    background-image: radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.8) 0%, transparent 70%),
      url('https://picsum.photos/id/1015/1920/1080');
    background-size: cover;
    background-position: center;
    filter: blur(2px) brightness(0.8);
    transition: filter 2s ease;
  }

  .midground {
    background-image: radial-gradient(circle at 30% 40%, rgba($primary, 0.3) 0%, transparent 60%),
      radial-gradient(circle at 70% 70%, rgba($secondary, 0.2) 0%, transparent 50%);
    background-size: 150% 150%;
    animation: bgShift 30s infinite alternate;
  }

  .foreground {
    background-image: radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 40%),
      radial-gradient(circle at 80% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 40%);
    background-size: 120% 120%;
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba($dark-bg, 0.8) 0%, rgba($dark-bg, 0) 50%, rgba($dark-bg, 0.8) 100%);
  pointer-events: none;
}

.parallax-container {
  &.scrolled {
    .background {
      filter: blur(0px) brightness(1);
    }
  }
}

@keyframes bgShift {
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: 100% 100%;
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.float-item {
  position: absolute;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  filter: blur(5px);
  transition: all 0.3s ease;
}

.float-item {
  &:nth-child(odd) {
    background: radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(99, 102, 241, 0.2) 70%);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
  }

  &:nth-child(even) {
    background: radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(236, 72, 153, 0.2) 70%);
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
  }
}

.text-layer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  z-index: 100;
  width: 100%;
  padding: 0 20px;

  .parallax-title {
    font-size: 5rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
  }

  .title-word {
    display: inline-block;
    will-change: transform;
  }

  .highlight {
    position: relative;
    background: linear-gradient(to right, $primary, $secondary);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 30px rgba($primary, 0.5);
  }
}

.scroll-prompt {
  font-size: 1.5rem;
  opacity: 0.8;
  margin-bottom: 3rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.scroll-indicator {
  width: 3px;
  height: 50px;
  background: linear-gradient(to bottom, transparent, white);
  margin: 0 auto;
  border-radius: 3px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 15px;
    background: white;
    border-radius: 3px;
    top: 0;
    left: 0;
    animation: scrollDown 1.5s infinite;
  }
}

@keyframes scrollDown {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(35px);
    opacity: 0;
  }
}

.scroll-content {
  position: relative;
  top: 100vh;
  padding: 5rem 0;

  .content-section {
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .animated-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 15px;
      padding: 3rem;
      max-width: 600px;
      width: 90%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;

      & h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        background: linear-gradient(to right, $primary, $secondary);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      p {
        font-size: 1.2rem;
        opacity: 0.9;
        line-height: 1.6;
        color: #9e9e9e; // 
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(90deg, #6366f1, #ec4899);
      }

      .card-icon {
        $size: 80px;
        width: $size;
        height: $size;
        background: linear-gradient(135deg, $primary, $secondary);
        border-radius: 50%;
        position: absolute;
        top: -20px;
        right: -20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 20px rgba($primary, 0.5);

        &::after {
          content: '✦';
          font-size: 2rem;
          color: white;
        }
      }
    }
  }
}
</style>
