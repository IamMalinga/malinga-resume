import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/Hero.module.css';
import Button from '../common/Button';
import { gsap } from 'gsap';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvas3Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // GSAP animation for text and button
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!canvas1Ref.current || !canvas2Ref.current || !canvas3Ref.current) return;

    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;
    const canvas3 = canvas3Ref.current;
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    const ctx3 = canvas3.getContext('2d');

    if (!ctx1 || !ctx2 || !ctx3) return;

    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    canvas3.width = window.innerWidth;
    canvas3.height = window.innerHeight;

    // Symbol class for Matrix characters
    class Symbol {
      characters: string;
      x: number;
      y: number;
      fontSize: number;
      text: string;
      canvasHeight: number;

      constructor(x: number, y: number, fontSize: number, canvasHeight: number) {
        this.characters = '01010101000111110001010101110001110000011000100001ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678900101010001110001000100111111000100001001abcdefghijklmnopqrstuvwxyz0123456789';
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = 'A';
        this.canvasHeight = canvasHeight;
      }

      draw(context: CanvasRenderingContext2D, context2: CanvasRenderingContext2D) {
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
        context2.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
        if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.97) {
          this.y = 0;
        } else {
          this.y += 0.9;
        }
      }
    }

    // Effect class to manage the Matrix rain
    class Effect {
      fontSize: number;
      canvasWidth: number;
      canvasHeight: number;
      columns: number;
      symbols: Symbol[];

      constructor(canvasWidth: number, canvasHeight: number) {
        this.fontSize = 16;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
      }

      #initialize() {
        for (let i = 0; i < this.columns; i++) {
          this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
        }
      }

      resize(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
      }
    }

    const effect = new Effect(canvas1.width, canvas1.height);
    let lastTime = 0;
    const fps = 26;
    const nextFrame = 1000 / fps;
    let timer = 0;

    // Texture animation with GSAP
    const textureTl = gsap.timeline({ repeat: -1, yoyo: true });
    let textureOffsetX = 0;
    let textureOffsetY = 0;
    textureTl.to(
      { offsetX: 0, offsetY: 0 },
      {
        duration: 5,
        offsetX: 100,
        offsetY: 100,
        onUpdate: () => {
          textureOffsetX = textureTl.progress() * 100;
          textureOffsetY = textureTl.progress() * 100;
        },
        ease: 'sine.inOut',
      }
    );

    // Animation loop
    const animate = (timeStamp: number) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      if (timer > nextFrame) {
        // Matrix rain on canvas1 and canvas2
        ctx1.textAlign = "center";
        ctx1.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
        ctx1.font = effect.fontSize + 'px monospace';
        ctx1.fillStyle = '#2563eb';

        ctx2.textAlign = "center";
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.font = effect.fontSize + 'px monospace';
        ctx2.fillStyle = 'white';

        effect.symbols.forEach(symbol => symbol.draw(ctx1, ctx2));

        // Texture on canvas3
        ctx3.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx3.fillRect(0, 0, canvas3.width, canvas3.height);
        for (let x = 0; x < canvas3.width; x += 10) {
          for (let y = 0; y < canvas3.height; y += 10) {
            const noise = Math.sin(x * 0.1 + textureOffsetX) * Math.cos(y * 0.1 + textureOffsetY) * 50 + 50;
            ctx3.fillStyle = `rgba(37, 99, 235, ${noise / 255})`;
            ctx3.fillRect(x, y, 10, 10);
          }
        }

        timer = 0;
      } else {
        timer += deltaTime;
      }
      requestAnimationFrame(animate);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      canvas1.width = window.innerWidth;
      canvas1.height = window.innerHeight;
      canvas2.width = window.innerWidth;
      canvas2.height = window.innerHeight;
      canvas3.width = window.innerWidth;
      canvas3.height = window.innerHeight;
      effect.resize(canvas1.width, canvas1.height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      textureTl.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <section className={styles.matrixSection}>
        <canvas ref={canvas3Ref} className={styles.textureCanvas} />
        <canvas ref={canvas1Ref} className={styles.canvas} />
        <canvas ref={canvas2Ref} className={styles.canvasOverlay} />
      </section>
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-center">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200 mb-6 leading-tight"
        >
          Welcome to My Matrix
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-green-300 max-w-2xl mx-auto mb-8"
        >
          Diving into the code and crafting the future of technology.
        </p>
        <Button
          ref={buttonRef}
          variant="primary"
          className="mt-6 px-8 py-3 text-lg font-semibold rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Enter the Code
        </Button>
      </div>
    </section>
  );
};

export default Hero;