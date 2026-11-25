"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_DURATIONS, MOTION_EASINGS } from "./tokens";
import { registerGsapPlugins } from "./init";

export interface RevealOptions {
  trigger?: gsap.DOMTarget;
  start?: string;
  duration?: number;
  y?: number;
  delay?: number;
  ease?: string;
}

export interface StaggerOptions {
  trigger?: gsap.DOMTarget;
  start?: string;
  duration?: number;
  stagger?: number;
  y?: number;
  ease?: string;
  delay?: number;
}

export interface ParallaxOptions {
  trigger?: gsap.DOMTarget;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  yPercent?: number;
}

export interface PinStoryOptions {
  trigger: gsap.DOMTarget;
  pin: gsap.DOMTarget;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export interface HorizontalSequenceOptions {
  trigger: gsap.DOMTarget;
  target: gsap.DOMTarget;
  scrollDistancePercent?: number;
  start?: string;
  end?: string | (() => string);
  scrub?: boolean | number;
}

export interface ScrollProgressOptions {
  trigger?: gsap.DOMTarget;
  onUpdate: (progress: number) => void;
}

export interface SvgPathDrawOptions {
  trigger?: gsap.DOMTarget;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  duration?: number;
}

export const motionPresets = {
  // 1. Reveal Preset: Clean upward fade entrance on scroll
  reveal(target: gsap.DOMTarget, options: RevealOptions = {}): gsap.core.Tween {
    registerGsapPlugins();
    const {
      trigger = target,
      start = "top 85%",
      duration = MOTION_DURATIONS.base,
      y = 28,
      delay = 0,
      ease = MOTION_EASINGS.power2Out,
    } = options;

    return gsap.fromTo(
      target,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: trigger as any,
          start,
          toggleActions: "play none none none",
        },
      }
    );
  },

  // 2. Stagger Preset: Cascading reveal for lists, cards, and grids
  stagger(targets: gsap.DOMTarget, options: StaggerOptions = {}): gsap.core.Tween {
    registerGsapPlugins();
    const {
      trigger = targets,
      start = "top 85%",
      duration = MOTION_DURATIONS.base,
      stagger = 0.12,
      y = 32,
      delay = 0,
      ease = MOTION_EASINGS.power2Out,
    } = options;

    return gsap.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease,
        scrollTrigger: {
          trigger: trigger as any,
          start,
          toggleActions: "play none none none",
        },
      }
    );
  },

  // 3. Text Entrance Preset: Editorial heading entrance
  textEntrance(target: gsap.DOMTarget, options: RevealOptions = {}): gsap.core.Tween {
    registerGsapPlugins();
    const {
      trigger = target,
      start = "top 90%",
      duration = MOTION_DURATIONS.slow,
      y = 20,
      delay = 0.05,
      ease = MOTION_EASINGS.power3Out,
    } = options;

    return gsap.fromTo(
      target,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: trigger as any,
          start,
          toggleActions: "play none none none",
        },
      }
    );
  },

  // 4. Parallax Preset: Subtle vertical offset scrubbed to viewport entry
  parallax(target: gsap.DOMTarget, options: ParallaxOptions = {}): gsap.core.Tween {
    registerGsapPlugins();
    const {
      trigger = target,
      start = "top bottom",
      end = "bottom top",
      scrub = 1,
      yPercent = -15,
    } = options;

    return gsap.fromTo(
      target,
      { yPercent: 0 },
      {
        yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: trigger as any,
          start,
          end,
          scrub,
        },
      }
    );
  },

  // 5. Pin Story Preset: Pinned container during multi-step story scrolling
  pinStory(options: PinStoryOptions): ScrollTrigger {
    registerGsapPlugins();
    const {
      trigger,
      pin,
      start = "top top",
      end = "+=1500",
      scrub = 0.5,
    } = options;

    return ScrollTrigger.create({
      trigger: trigger as any,
      pin: pin as any,
      start,
      end,
      scrub,
      anticipatePin: 1,
    });
  },

  // 6. Horizontal Sequence Preset: Desktop horizontal track scrubbed to vertical scroll
  horizontalSequence(options: HorizontalSequenceOptions): gsap.core.Tween {
    registerGsapPlugins();
    const {
      trigger,
      target,
      scrollDistancePercent = -70,
      start = "top 20%",
      end = () => "+=" + (window.innerHeight * 1.5),
      scrub = 1,
    } = options;

    return gsap.to(target, {
      xPercent: scrollDistancePercent,
      ease: "none",
      scrollTrigger: {
        trigger: trigger as any,
        pin: true,
        start,
        end,
        scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  },

  // 7. Scroll Progress Preset: Page or section scroll progress callback
  scrollProgress(options: ScrollProgressOptions): ScrollTrigger {
    registerGsapPlugins();
    const { trigger = document.body, onUpdate } = options;

    return ScrollTrigger.create({
      trigger: trigger as any,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => onUpdate(self.progress),
    });
  },

  // 8. SVG Path Draw Preset (Stage 21.1 Signature Motion): Progressive stroke drawing
  svgPathDraw(pathElement: SVGPathElement | SVGGeometryElement, options: SvgPathDrawOptions = {}): gsap.core.Tween {
    registerGsapPlugins();
    const {
      trigger = pathElement,
      start = "top 80%",
      end = "bottom 20%",
      scrub = 0.5,
    } = options;

    const length = pathElement.getTotalLength ? pathElement.getTotalLength() : 500;
    gsap.set(pathElement, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    return gsap.to(pathElement, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: trigger as any,
        start,
        end,
        scrub,
      },
    });
  },

  // 9. Magnetic CTA Interaction (Stage 21.1): Subtle cursor attraction for buttons
  magnetic(element: HTMLElement, strength = 0.35) {
    if (typeof window === "undefined" || !element) return () => {};

    function handleMouseMove(e: MouseEvent) {
      const rect = element.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(element, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    function handleMouseLeave() {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
    }

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  },
};
